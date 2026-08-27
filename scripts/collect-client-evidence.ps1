# Collect everything a client launch produces, in one zip.
#
# Nobody has ever launched this pack's client. That single fact blocks the
# release gate, every balance measurement and the whole visual layer
# (docs/agents/blocked-work.md). The first launch is worth more than any other
# open item, and the point of this script is that you should not have to know
# which files matter — launch, run this, send the zip.
#
#   pwsh scripts/collect-client-evidence.ps1 -InstanceDir "C:\...\instances\ICS\.minecraft"
#
# If -InstanceDir is omitted it looks in the usual Prism location.
#
# It reads. It never deletes, moves or edits anything in the instance.

[CmdletBinding()]
param(
    [string]$InstanceDir,
    [string]$OutDir = "build"
)

$ErrorActionPreference = 'Stop'

function Find-Instance {
    if ($InstanceDir) {
        if (-not (Test-Path $InstanceDir)) { throw "InstanceDir not found: $InstanceDir" }
        return (Resolve-Path $InstanceDir).Path
    }
    $roots = @(
        "$env:APPDATA\PrismLauncher\instances",
        "$env:LOCALAPPDATA\Programs\PrismLauncher\instances",
        "$env:APPDATA\.minecraft"
    )
    foreach ($r in $roots) {
        if (-not (Test-Path $r)) { continue }
        if ($r -like '*\.minecraft') { return $r }
        $hit = Get-ChildItem $r -Directory -ErrorAction SilentlyContinue |
               Where-Object { Test-Path (Join-Path $_.FullName '.minecraft\logs') } |
               Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($hit) { return (Join-Path $hit.FullName '.minecraft') }
    }
    throw "No instance found. Pass -InstanceDir pointing at the .minecraft folder."
}

$mc = Find-Instance
Write-Host "instance: $mc"

# InvariantCulture on purpose: on a Thai-locale machine ToString('yyyy') returns
# the Buddhist year, and the first run produced client-evidence-25690827.zip.
$stamp = (Get-Item $mc).LastWriteTime.ToString('yyyyMMdd-HHmmss', [Globalization.CultureInfo]::InvariantCulture)
$stage = Join-Path $env:TEMP "ics-evidence-$stamp"
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null

function Grab($relative, $destName, [switch]$Recurse) {
    $src = Join-Path $mc $relative
    if (-not (Test-Path $src)) { Write-Host "  -- $relative (absent)"; return 0 }
    $dst = Join-Path $stage $destName
    if ((Get-Item $src).PSIsContainer) {
        New-Item -ItemType Directory -Path $dst -Force | Out-Null
        $files = Get-ChildItem $src -File -Recurse:$Recurse -ErrorAction SilentlyContinue
        foreach ($f in $files) { Copy-Item $f.FullName (Join-Path $dst $f.Name) -Force -ErrorAction SilentlyContinue }
        Write-Host ("  ok {0} ({1} file(s))" -f $relative, $files.Count)
        return $files.Count
    }
    Copy-Item $src $dst -Force
    Write-Host "  ok $relative"
    return 1
}

Write-Host "collecting:"
# The log is the thing. latest.log plus the rotated ones, in case the failure
# was on an earlier launch.
Grab 'logs\latest.log'      'latest.log'          | Out-Null
Grab 'logs\debug.log'       'debug.log'           | Out-Null
Grab 'crash-reports'        'crash-reports' -Recurse | Out-Null
Grab 'logs'                 'logs-all'               | Out-Null
Grab 'options.txt'          'options.txt'         | Out-Null
Grab 'pack-version.txt'     'pack-version.txt'    | Out-Null

# What is actually installed, which is the first thing to check against MODLIST.md
$modsDir = Join-Path $mc 'mods'
if (Test-Path $modsDir) {
    $jars = Get-ChildItem $modsDir -Filter *.jar -ErrorAction SilentlyContinue
    $jars | ForEach-Object { '{0}  {1,10:N0}' -f $_.Name, $_.Length } |
        Set-Content (Join-Path $stage 'installed-mods.txt') -Encoding utf8
    Write-Host ("  ok mods/ ({0} jar(s) listed, not copied)" -f $jars.Count)
} else {
    Write-Host "  -- mods/ (absent)"
}

# Config files that a mod REWROTE differ from what we shipped; that difference is
# the §38 drift question and is worth having beside the log.
$cfg = Join-Path $mc 'config'
if (Test-Path $cfg) {
    Get-ChildItem $cfg -Recurse -File -ErrorAction SilentlyContinue |
        ForEach-Object {
            $rel = $_.FullName.Substring($cfg.Length + 1)
            '{0}  {1,8:N0}  {2:yyyy-MM-dd HH:mm:ss}' -f $rel, $_.Length, $_.LastWriteTimeUtc
        } |
        Set-Content (Join-Path $stage 'config-inventory.txt') -Encoding utf8
    Write-Host "  ok config/ (inventory only)"
}

# Anything that looks like an error, pulled out so it is readable without
# scrolling a 20 MB log. Same shape as the server-boot greps.
$log = Join-Path $stage 'latest.log'
if (Test-Path $log) {
    $lines = Get-Content $log -ErrorAction SilentlyContinue
    $errors = $lines | Select-String -Pattern 'ERROR|FATAL|Exception|Caused by|failed|Mixin apply' -CaseSensitive:$false
    $errors | ForEach-Object { $_.Line } | Set-Content (Join-Path $stage 'errors-extracted.txt') -Encoding utf8
    # Computed outside the strings on purpose: a regex containing an unbalanced
    # '(' inside a $(...) inside "..." does not survive PowerShell's parser.
    $donePattern = 'Done \('
    $sawDone = [bool]($lines | Select-String -Pattern $donePattern -Quiet)
    $crashDir = Join-Path $stage 'crash-reports'
    $crashCount = (Get-ChildItem $crashDir -ErrorAction SilentlyContinue | Measure-Object).Count
    $summary = @(
        "lines in latest.log : $($lines.Count)",
        "error-ish lines     : $($errors.Count)",
        "reached 'Done ('    : $sawDone",
        "crash reports       : $crashCount"
    )
    $summary | Set-Content (Join-Path $stage 'SUMMARY.txt') -Encoding utf8
    Write-Host ""
    $summary | ForEach-Object { Write-Host "  $_" }
}

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$zip = Join-Path (Resolve-Path $OutDir) "client-evidence-$stamp.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem $stage -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($stage.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel) | Out-Null
    }
} finally { $archive.Dispose() }
Remove-Item $stage -Recurse -Force

Write-Host ""
Write-Host "OK  $zip  ($([math]::Round((Get-Item $zip).Length / 1KB)) KB)"
Write-Host "    Send this. SUMMARY.txt and errors-extracted.txt are the first things to read."
