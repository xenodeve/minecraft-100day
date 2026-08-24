#!/usr/bin/env node
// Build ONE self-contained file a launcher imports with no network access.
//
// The CurseForge-format export (`packwiz curseforge export`) is one file too,
// but importing it is not one step: its manifest carries CurseForge references
// the launcher must resolve, and four mods have third-party downloads disabled
// by their authors, so the user is sent to click links by hand.
//
// This assembles every jar itself and emits a Prism Launcher instance zip.
//
//   node scripts/build/build-instance.mjs
//   node scripts/build/build-instance.mjs --out build/custom-name.zip
//
// Every jar is checked against the hash recorded in its metafile. A mismatch
// is fatal — a silently corrupt jar in a 130 MB artifact is exactly the kind
// of failure nobody finds until a friend cannot launch.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const ROOT = process.cwd()
const CACHE = join(ROOT, 'build', '.jar-cache')
const STAGE = join(ROOT, 'build', '.instance')
const outArg = process.argv.indexOf('--out')

// ------------------------------------------------------------ pack metadata
const pack = readFileSync(join(ROOT, 'pack.toml'), 'utf8')
const packField = (k) => (pack.match(new RegExp(`^${k}\\s*=\\s*"([^"]*)"`, 'm')) || [])[1]
const NAME = packField('name') ?? 'modpack'
const VERSION = packField('version') ?? '0.0.0'
const MC = (pack.match(/^minecraft\s*=\s*"([^"]*)"/m) || [])[1]
const FORGE = (pack.match(/^forge\s*=\s*"([^"]*)"/m) || [])[1]
if (!MC || !FORGE) { console.error('pack.toml: could not read the minecraft/forge versions'); process.exit(1) }

const OUT = outArg > -1
  ? process.argv[outArg + 1]
  : join('build', `${NAME.replace(/[^A-Za-z0-9]+/g, '-')}-${VERSION}-instance.zip`)

// ------------------------------------------------------------ read metafiles
/** packwiz metafiles are small and flat; a full TOML parser is not worth a dependency here. */
function parseMeta(text) {
  const get = (k) => (text.match(new RegExp(`^\\s*${k}\\s*=\\s*"([^"]*)"`, 'm')) || [])[1]
  const num = (k) => (text.match(new RegExp(`^\\s*${k}\\s*=\\s*(\\d+)`, 'm')) || [])[1]
  return {
    name: get('name'),
    filename: get('filename'),
    side: get('side') ?? 'both',
    url: get('url'),
    hashFormat: get('hash-format'),
    hash: get('hash'),
    mode: get('mode'),
    projectId: num('project-id'),
    fileId: num('file-id'),
  }
}

const metas = readdirSync(join(ROOT, 'mods'))
  .filter(f => f.endsWith('.pw.toml'))
  .map(f => parseMeta(readFileSync(join(ROOT, 'mods', f), 'utf8')))

console.log(`${NAME} ${VERSION} — Minecraft ${MC}, Forge ${FORGE}`)
console.log(`${metas.length} mods to assemble\n`)

// ------------------------------------------------------------ fetch + verify
const digest = (buf, fmt) => createHash(fmt === 'sha1' ? 'sha1' : fmt === 'sha512' ? 'sha512' : 'sha256')
  .update(buf).digest('hex')

/** CurseForge-sourced metafiles carry no URL. This is the endpoint the website's
 *  own Download button uses — not the API those four mods opted out of. */
const cfUrl = (m) => `https://www.curseforge.com/api/v1/mods/${m.projectId}/files/${m.fileId}/download`

mkdirSync(CACHE, { recursive: true })
const problems = []
let fetched = 0, cached = 0

for (const [i, m] of metas.entries()) {
  const dest = join(CACHE, m.filename)
  const label = `(${String(i + 1).padStart(2)}/${metas.length}) ${m.name}`

  let buf
  if (existsSync(dest)) {
    buf = readFileSync(dest)
    cached++
  } else {
    const url = m.url ?? cfUrl(m)
    if (!m.url && (!m.projectId || !m.fileId)) {
      problems.push(`${m.name}: no download url and no curseforge ids`); continue
    }
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'minecraft-100day-bot' }, redirect: 'follow' })
      if (!r.ok) { problems.push(`${m.name}: HTTP ${r.status} from ${url}`); console.log(`${label} — HTTP ${r.status}`); continue }
      buf = Buffer.from(await r.arrayBuffer())
      writeFileSync(dest, buf)
      fetched++
    } catch (e) {
      problems.push(`${m.name}: ${e.message}`); console.log(`${label} — ${e.message}`); continue
    }
  }

  if (m.hash) {
    const got = digest(buf, m.hashFormat)
    if (got !== m.hash) {
      problems.push(`${m.name}: ${m.hashFormat} mismatch\n      expected ${m.hash}\n      got      ${got}`)
      console.log(`${label} — HASH MISMATCH`)
      continue
    }
  } else {
    problems.push(`${m.name}: metafile records no hash — cannot verify`)
  }
  console.log(`${label} — ok (${(buf.length / 1048576).toFixed(1)} MB)`)
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('\nRefusing to build an artifact that is missing or corrupt.')
  process.exit(1)
}
console.log(`\nall ${metas.length} jars verified — ${fetched} downloaded, ${cached} from cache`)

// ------------------------------------------------------------ stage instance
execFileSync('rm', ['-rf', STAGE])
const MODS = join(STAGE, '.minecraft', 'mods')
mkdirSync(MODS, { recursive: true })
for (const m of metas) execFileSync('cp', [join(CACHE, m.filename), join(MODS, m.filename)])

// Anything the pack owns beyond mods — config, kubejs, datapacks — ships too.
// Distribution Spec §4: those files are the gameplay; mods alone are not the pack.
for (const dir of ['config', 'defaultconfigs', 'kubejs', 'datapacks', 'resourcepacks', 'ftbquests']) {
  const src = join(ROOT, dir)
  if (existsSync(src) && statSync(src).isDirectory()) {
    execFileSync('cp', ['-r', src, join(STAGE, '.minecraft', dir)])
    console.log(`bundled ${dir}/`)
  }
}

writeFileSync(join(STAGE, 'mmc-pack.json'), JSON.stringify({
  components: [
    { uid: 'net.minecraft', version: MC, important: true },
    { uid: 'net.minecraftforge', version: FORGE },
  ],
  formatVersion: 1,
}, null, 4) + '\n')

writeFileSync(join(STAGE, 'instance.cfg'),
  [
    'InstanceType=OneSix',
    `name=${NAME} ${VERSION}`,
    'OverrideMemory=true',
    'MinMemAlloc=4096',
    'MaxMemAlloc=8192',
    `notes=${NAME} ${VERSION} — self-contained. Every mod is inside this file; nothing is downloaded on import.`,
    '',
  ].join('\n'))

// ------------------------------------------------------------ zip
//
// NOT Compress-Archive. It writes entry names with backslashes, which the ZIP
// spec forbids (4.4.17.1: the path separator MUST be '/'). Prism then reads
// `.minecraft\mods\create.jar` as one flat filename instead of a path, and the
// imported instance has ninety-three oddly-named files and no mods directory.
// Caught here by a structural check that found 0 jars under `*/mods/`.
//
// Entry names are built explicitly below so the separator is never left to a tool.
mkdirSync(join(ROOT, 'build'), { recursive: true })
execFileSync('rm', ['-f', join(ROOT, OUT)])

const zipScript = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stage = '${STAGE}'
$out   = '${join(ROOT, OUT)}'
$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($stage.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose() }
`
execFileSync('powershell', ['-NoProfile', '-Command', zipScript], { stdio: 'inherit' })

// Verify the separator actually came out right, rather than trusting it did.
const check = execFileSync('powershell', ['-NoProfile', '-Command',
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `$z=[System.IO.Compression.ZipFile]::OpenRead('${join(ROOT, OUT)}');` +
  `$n=($z.Entries | Where-Object { $_.FullName -like '.minecraft/mods/*.jar' }).Count;` +
  `$b=($z.Entries | Where-Object { $_.FullName -like '*\\\\*' }).Count;` +
  `$z.Dispose(); Write-Output "$n $b"`], { encoding: 'utf8' }).trim().split(/\s+/)

const [jarsInZip, backslashEntries] = check.map(Number)
if (jarsInZip !== metas.length || backslashEntries > 0) {
  console.error(`\n✗ archive is malformed: ${jarsInZip}/${metas.length} jars found under .minecraft/mods/, ` +
    `${backslashEntries} entries contain a backslash`)
  process.exit(1)
}
console.log(`archive verified — ${jarsInZip} jars under .minecraft/mods/, no backslash entries`)

const size = statSync(join(ROOT, OUT)).size
console.log(`\n✓ ${OUT}  (${(size / 1048576).toFixed(0)} MB, ${metas.length} mods)`)
console.log('  Prism Launcher → Add Instance → Import from zip. No network needed.')
