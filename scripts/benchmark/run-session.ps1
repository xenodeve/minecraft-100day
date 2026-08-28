# One keypress, one benchmark session.
#
#   pwsh scripts/benchmark/run-session.ps1 -Zone A -Variant baseline -Date 2026-08-29
#
# You stand at the benchmark spot in game. You run this. Three minutes later
# there is a report.
#
# WHAT IT AUTOMATES, AND WHAT IT CANNOT
#
#   PresentMon        started and stopped by this script          fully automatic
#   spark profiler    needs an in-game chat command               KEYSTROKES
#   F3+L              needs a keypress                            KEYSTROKES
#   the spark link    printed into latest.log by spark itself     read from the log
#   collection        copy + analyse                              fully automatic
#
#   Minecraft has no external control surface for a singleplayer client, so the
#   two in-game actions are sent as keystrokes to its window. That is the fragile
#   part and it is called out rather than hidden: if the window loses focus, or
#   you type during the run, the keystrokes land somewhere else and the run is
#   void. The script checks afterwards whether spark actually produced a link,
#   so a keystroke that missed is reported as a failure rather than as an empty
#   result.
#
# -DryRun exercises everything except touching the game: path resolution,
# preflight, the log read, collection and the report. Use it to check the wiring
# before trusting a real run.
#
# It reads the instance. It never deletes, moves or edits anything in it.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Zone,
    [Parameter(Mandatory = $true)][string]$Variant,
    [Parameter(Mandatory = $true)][string]$Date,          # YYYY-MM-DD, not the clock: a run
                                                          # stamped from the machine clock is a
                                                          # run nobody can reproduce
    [string]$InstanceDir = "$env:USERPROFILE\curseforge\minecraft\Instances\Industrial Civilization Survival",
    [string]$PresentMon  = "",
    [int]$Seconds        = 60,
    [string]$ExpectGpu   = "RTX 4070 SUPER",
    [switch]$SpikeProfile,                                # --only-ticks-over 100 instead
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path "$PSScriptRoot\..\..").Path
function Step($m) { Write-Host "  $m" }
function Fail($m) { Write-Host "`nSTOP: $m" -ForegroundColor Red; exit 1 }

Write-Host "`nBenchmark session - zone $Zone / $Variant / $Date"
Write-Host ("=" * 58)

# ---------------------------------------------------------------- preflight
Write-Host "`nPreflight"

if (-not (Test-Path $InstanceDir)) { Fail "instance not found: $InstanceDir" }
$logPath = Join-Path $InstanceDir 'logs\latest.log'
if (-not (Test-Path $logPath))     { Fail "no logs\latest.log under $InstanceDir - has the client ever run?" }
Step "instance   $InstanceDir"

# The commit must describe what runs. PERF-HARNESS-VARIANTS.
Push-Location $repo
$dirty  = (git status --porcelain) -join "`n"
$commit = (git rev-parse HEAD).Trim()
Pop-Location
if ($dirty -and -not $DryRun) {
    Write-Host $dirty
    Fail "the working tree is dirty, so the commit would not describe the run. Commit first."
}
Step "commit     $($commit.Substring(0,12))"

# The GPU that C-UPFG-07 was about. Read it, do not assume it.
$gpuLine = Select-String -Path $logPath -Pattern 'OpenGL Renderer:' | Select-Object -First 1
if ($gpuLine) {
    $gpu = ($gpuLine.Line -split 'OpenGL Renderer:')[1].Trim()
    Step "gpu        $gpu"
    if ($ExpectGpu -and $gpu -notlike "*$ExpectGpu*") {
        Fail "wrong GPU - expected '$ExpectGpu'. C-UPFG-07 was exactly this, and every number taken in that state is void."
    }
} else {
    Step "gpu        (no OpenGL Renderer line yet - the client may not have finished starting)"
}

# PresentMon is optional, and what it costs to skip is stated rather than implied.
if (-not $PresentMon) {
    # Glob, not an exact name: the GitHub asset is PresentMon-2.5.1-x64.exe and
    # requiring a rename is a step that will be forgotten exactly once.
    foreach ($dir in @("$repo\tools", "$env:ProgramFiles\PresentMon", "$env:USERPROFILE\Downloads")) {
        if (-not (Test-Path $dir)) { continue }
        $hit = Get-ChildItem $dir -Filter 'PresentMon*.exe' -ErrorAction SilentlyContinue |
               Sort-Object Name -Descending | Select-Object -First 1
        if ($hit) { $PresentMon = $hit.FullName; break }
    }
}
if ($PresentMon -and (Test-Path $PresentMon)) {
    Step "presentmon $PresentMon"
    $admin = ([Security.Principal.WindowsPrincipal] `
              [Security.Principal.WindowsIdentity]::GetCurrent()
             ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $admin) {
        Step "           NOT RUNNING AS ADMIN. PresentMon needs an elevated shell to"
        Step "           open its trace session; without it the CSV comes out empty"
        Step "           and you find out after the run. Reopen PowerShell as"
        Step "           Administrator, or accept no frame data this session."
    }
} else {
    $PresentMon = ""
    Step "presentmon NOT FOUND - no frametimes, no GPU-busy, and therefore NO"
    Step "           CPU-bound/GPU-bound verdict. Everything else still works."
    Step "           https://github.com/GameTechDev/PresentMon/releases"
}

# ---------------------------------------------------------------- output dir
$dest = Join-Path $repo "benchmarks\captures\$Date\$($commit.Substring(0,12))\zone-$($Zone.ToLower())\$Variant"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Step "output     $($dest.Replace($repo,'.'))"

$logSizeBefore = (Get-Item $logPath).Length

# ---------------------------------------------------------------- the window
$mc = Get-Process -Name javaw, java -ErrorAction SilentlyContinue |
      Where-Object { $_.MainWindowTitle } | Select-Object -First 1
if (-not $DryRun) {
    if (-not $mc) { Fail "no Minecraft window found. Start the game, stand at the spot, then run this." }
    Step "window     $($mc.MainWindowTitle)"
}

if (-not $DryRun) {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
  public const int KEYUP = 0x0002;
  public static void Chord(byte hold, byte tap) {
    keybd_event(hold, 0, 0, UIntPtr.Zero);
    System.Threading.Thread.Sleep(60);
    keybd_event(tap, 0, 0, UIntPtr.Zero);
    System.Threading.Thread.Sleep(60);
    keybd_event(tap, 0, KEYUP, UIntPtr.Zero);
    System.Threading.Thread.Sleep(30);
    keybd_event(hold, 0, KEYUP, UIntPtr.Zero);
  }
}
"@
    Write-Host "`nFocusing the game in 5 seconds. DO NOT touch the keyboard or mouse until this finishes." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    [Win]::SetForegroundWindow($mc.MainWindowHandle) | Out-Null
    Start-Sleep -Milliseconds 800
}

# ---------------------------------------------------------------- capture
$csv = Join-Path $dest 'presentmon.csv'
$pm = $null
if ($PresentMon -and -not $DryRun) {
    # PresentMon 2.x flags are double-dash and there is no -no_top; --no_console_stats
    # replaced it. Read from `--help` on the actual binary, not from memory of 1.x.
    # --v2_metrics pins the CSV column names so the parser is not guessing.
    $pm = Start-Process -FilePath $PresentMon `
        -ArgumentList @('--process_name', 'javaw.exe',
                        '--output_file', "`"$csv`"",
                        '--timed', ($Seconds + 20),
                        '--terminate_after_timed',
                        '--terminate_on_proc_exit',
                        '--no_console_stats',
                        '--stop_existing_session',
                        '--v2_metrics') `
        -PassThru -WindowStyle Hidden
    Write-Host "`nPresentMon capturing"
}

$sparkCmd = if ($SpikeProfile) { "/spark profiler --thread * --only-ticks-over 100 --timeout $Seconds" }
            else                { "/spark profiler --thread * --timeout $Seconds" }

if ($DryRun) {
    Write-Host "`n[dry run] would send: T, then '$sparkCmd', then Enter"
    Write-Host "[dry run] would wait $($Seconds + 8)s, then hold F3 and tap L (a chord, not two keys), then wait 12s"
} else {
    Write-Host "spark: $sparkCmd"
    [System.Windows.Forms.SendKeys]::SendWait('t')          # open chat
    Start-Sleep -Milliseconds 600
    # SendKeys treats + ^ % ~ ( ) { } [ ] as modifiers; the command has none of them,
    # but * is fine and the braces are what would bite. Sent literally on purpose.
    [System.Windows.Forms.SendKeys]::SendWait($sparkCmd)
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')

    Write-Host "profiling for $Seconds seconds - stand still and keep looking at the same thing"
    Start-Sleep -Seconds ($Seconds + 8)

    # F3+L is a CHORD: F3 must be HELD while L is pressed. SendKeys cannot hold a
    # key down -- '{F3}L' presses and releases F3 and then presses L, which does
    # nothing at all. keybd_event can, so the chord is driven directly.
    Write-Host "F3+L (Minecraft's own profiler, 10s)"
    [Win]::Chord(0x72, 0x4C)   # VK_F3, VK_L
    Start-Sleep -Seconds 12
}

if ($pm) { $pm.WaitForExit(30000) | Out-Null; if (-not $pm.HasExited) { $pm.Kill() } }

# ---------------------------------------------------------------- collect
Write-Host "`nCollecting"
Copy-Item $logPath (Join-Path $dest 'latest.log') -Force
Step "latest.log"

# spark prints its link into the log; no need to read chat
$newText = ''
$fs = [System.IO.File]::Open($logPath, 'Open', 'Read', 'ReadWrite')
try {
    $fs.Seek($logSizeBefore, 'Begin') | Out-Null
    $sr = New-Object System.IO.StreamReader($fs)
    $newText = $sr.ReadToEnd()
} finally { $fs.Dispose() }

$sparkUrl = [regex]::Match($newText, 'https?://spark\.lucko\.me/\S+').Value
if ($sparkUrl) {
    Step "spark      $sparkUrl"
    Set-Content -Path (Join-Path $dest 'spark-url.txt') -Value $sparkUrl
} elseif (-not $DryRun) {
    Step "spark      NO LINK IN THE LOG"
    Step "           The keystrokes did not reach the game, or the profile failed."
    Step "           This is the fragile step; the run is not usable without it."
}

# the newest F3+L result
$profDir = Join-Path $InstanceDir 'debug\profiling'
if (Test-Path $profDir) {
    $newest = Get-ChildItem $profDir -Recurse -Filter 'profiling-result.txt' -ErrorAction SilentlyContinue |
              Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($newest) {
        Copy-Item $newest.FullName (Join-Path $dest 'profiling-result.txt') -Force
        Step "F3+L       $($newest.LastWriteTime.ToString('HH:mm:ss'))"
    } else { Step "F3+L       no profiling-result.txt found" }
} else { Step "F3+L       no debug\profiling directory - F3+L never ran here" }

if (Test-Path $csv) { Step "presentmon $([math]::Round((Get-Item $csv).Length/1KB)) KB" }

# ---------------------------------------------------------------- report
Write-Host "`nReport"
$reportArgs = @("$repo\scripts\analyze\session-report.mjs",
          '--log', (Join-Path $dest 'latest.log'),
          '--expect-gpu', $ExpectGpu,
          '--out', (Join-Path $dest 'report.md'))
if ($sparkUrl) { $reportArgs += @('--spark', ($sparkUrl -split '/')[-1]) }
if (Test-Path (Join-Path $dest 'profiling-result.txt')) { $reportArgs += @('--profiler', (Join-Path $dest 'profiling-result.txt')) }
if (Test-Path $csv) { $reportArgs += @('--capframex', $csv) }

# @reportArgs, not the bare automatic one. Splatting PowerShell's AUTOMATIC
# args variable in a script that declares param() splats nothing, so node
# launches with no arguments and drops into its REPL -- silently, no error
# anywhere. That happened once, after a rename that changed the $-form and
# missed the @-form.
Push-Location $repo
& node @reportArgs
$nodeExit = $LASTEXITCODE
Pop-Location
if ($nodeExit -ne 0) { Fail "session-report exited $nodeExit - the report above is incomplete" }

Write-Host "`n$($dest.Replace($repo,'.'))\report.md"
Write-Host "`nNothing here is a per-mod frame cost. Correlation names suspects;"
Write-Host "leave-one-out proves them (PERF-HARNESS-LEAVEONEOUT)."
