#!/usr/bin/env node
// Build the opt-in NVIDIA upscaling variant — the pack plus Candidate A.
//
// PERF-UPFG-045 asks for Super Resolution in an ISOLATED CLIENT PROFILE. This
// is that, shaped as a build variant: the jar is injected into a COPY of the
// CurseForge artifact and never enters mods/.
//
// WHY IT IS NOT A METAFILE
//
//   PERF-FREEZE forbids a performance mod entering the pack. A mods/*.pw.toml
//   would put it in index.toml, move the roster digest, change MODLIST.md and
//   make `verify` report 121. None of that happens here, so the roster is
//   untouched and PERF-UPFG-042 rollback is satisfied by deleting one file.
//
// WHAT THIS IS NOT
//
//   Not "DLSS Frame Generation". PERF-UPFG-004: Super Resolution's DLSS
//   UPSCALING path is verified — it links NVIDIA NGX — but whether its frame
//   generation backend is DLSS-G is NOT ESTABLISHED, and nothing here
//   establishes it. The artifact name says nvidia-upscaling for that reason.
//
// RUNTIME DOWNLOAD, PERF-UPFG-031
//
//   The DLSS model is NOT inside this jar and is NOT redistributed. The mod
//   fetches it from https://ngx.download.nvidia.com/ at runtime and resolves
//   "latest", so the DLSS object can change between runs without the pack
//   changing. Any A/B under PERF-UPFG-021 must record which object was used.
import { existsSync, mkdirSync, rmSync, copyFileSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readPack } from './lib/pack.mjs'

const ROOT = process.cwd()
const pack = readPack(ROOT)
const NAME = pack.name.replace(/[^A-Za-z0-9]+/g, '-')
const SRC = join(ROOT, 'build', `${NAME}-${pack.version}-curseforge-local.zip`)
const OUT = join(ROOT, 'build', `${NAME}-${pack.version}-nvidia-upscaling.zip`)
const STAGE = join(ROOT, 'build', '.nvidia-variant')

// Candidate A, pinned. PERF-UPFG-032: exact release, recorded hash.
const CANDIDATE = {
  name: 'Super Resolution',
  project: 'Hf3Qz2H3',
  version: '1.20.1-0.9.1-alpha.1+gl-forge',
  filename: 'super_resolution-forge-1.20.1-0.9.1-alpha.1+opengl.jar',
  size: 33264554,
  sha512: '0b0744f3a708f33f83c37a785b39e12c062a4d690b2774af3c3be339d7f06b34',  // prefix
  url: 'https://cdn.modrinth.com/data/Hf3Qz2H3/versions/MeE6lOJf/' +
       'super_resolution-forge-1.20.1-0.9.1-alpha.1%2Bopengl.jar',
}

if (!existsSync(SRC)) {
  console.error(`${SRC} is missing.`)
  console.error('Build the CurseForge artifact first: node scripts/build/build-curseforge-local.mjs')
  process.exit(1)
}

// The jar lives in the shared cache so a rebuild does not re-download 33 MB.
const CACHE = join(ROOT, 'build', '.jar-cache')
const jar = join(CACHE, CANDIDATE.filename)
if (!existsSync(jar)) {
  console.error(`${CANDIDATE.filename} is not in build/.jar-cache.`)
  console.error(`Fetch it once from:\n  ${CANDIDATE.url}`)
  console.error('It is deliberately not auto-downloaded: PERF-UPFG-032 wants a pinned release with')
  console.error('a recorded hash, not a silent fetch of whatever is current.')
  process.exit(1)
}

// Verify the pin before using it, rather than trusting the filename.
const bytes = readFileSync(jar)
const got = createHash('sha512').update(bytes).digest('hex')
if (statSync(jar).size !== CANDIDATE.size || !got.startsWith(CANDIDATE.sha512)) {
  console.error('The cached jar does not match the pinned release.')
  console.error(`  expected ${CANDIDATE.size} bytes, sha512 ${CANDIDATE.sha512}…`)
  console.error(`  got      ${statSync(jar).size} bytes, sha512 ${got.slice(0, 64)}…`)
  console.error('Re-read the issue before overriding this — a changed jar is a changed experiment.')
  process.exit(1)
}
console.log(`${CANDIDATE.name} ${CANDIDATE.version} — hash matches the pin`)

if (existsSync(STAGE)) rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })

execFileSync('powershell', ['-NoProfile', '-Command',
  `$ErrorActionPreference='Stop';` +
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `[System.IO.Compression.ZipFile]::ExtractToDirectory('${SRC}','${STAGE}')`,
], { stdio: 'pipe' })
console.log(`unpacked ${NAME}-${pack.version}-curseforge-local.zip`)

const modsDir = join(STAGE, 'overrides', 'mods')
mkdirSync(modsDir, { recursive: true })
copyFileSync(jar, join(modsDir, CANDIDATE.filename))
console.log(`injected ${CANDIDATE.filename}`)

// Repack entry-by-entry with `/` separators. CreateFromDirectory writes
// BACKSLASH entry names on Windows -- the ZIP-spec violation ADR 0003 recorded,
// and the self-check below caught it here too on the first run. Every other
// build in this repo writes entries the same way for the same reason.
if (existsSync(OUT)) rmSync(OUT)
execFileSync('powershell', ['-NoProfile', '-Command', `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stage = '${STAGE}'
$out   = '${OUT}'
$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($stage.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose() }
`], { stdio: 'pipe' })

// -- read the archive back, because a build log is not evidence ---------------
const listing = execFileSync('powershell', ['-NoProfile', '-Command',
  `$ErrorActionPreference='Stop';` +
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `$z=[System.IO.Compression.ZipFile]::OpenRead('${OUT}');` +
  `$z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()`,
], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)

const problems = []
if (!listing.some(e => e.endsWith(CANDIDATE.filename))) {
  problems.push(`${CANDIDATE.filename} is not in the archive`)
}
// ADR 0003's lesson: CreateFromDirectory has written backslash entry names before.
const backslashes = listing.filter(e => e.includes('\\')).length
if (backslashes) problems.push(`${backslashes} entry name(s) use backslashes`)
if (!listing.includes('manifest.json')) problems.push('manifest.json missing')

if (problems.length) {
  console.error('\n✗ variant is malformed:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

rmSync(STAGE, { recursive: true, force: true })
const size = statSync(OUT).size
const jars = listing.filter(e => e.toLowerCase().endsWith('.jar')).length

console.log(`\narchive verified — ${listing.length} entries, ${jars} jars, Candidate A present`)
console.log(`\n✓ build/${NAME}-${pack.version}-nvidia-upscaling.zip  (${(size / 1048576).toFixed(0)} MB)`)
console.log('  CurseForge App → Create Custom Profile → Import. OPT-IN TEST BUILD.')
console.log('')
console.log('  Super Resolution is ALPHA software and nothing about it has been measured here.')
console.log('  It is not in the pack roster — deleting this file rolls the experiment back.')
console.log('  On first run it downloads a DLSS model from ngx.download.nvidia.com; that is the')
console.log('  mod fetching from NVIDIA, not this pack redistributing anything.')
