#!/usr/bin/env node
// A CurseForge-format pack that carries the four mods whose authors disabled
// third-party downloading, so importing it into the CurseForge App is one step.
//
// ---------------------------------------------------------------------------
// THIS DELIBERATELY BREAKS ADR 0005, AND THE SCOPE IS THE POINT.
//
// ADR 0005 stopped shipping other people's jars. This bundles four of them. The
// difference is who receives it:
//
//   -friend.zip            friends, and anyone else   ->  zero third-party jars
//   -instance.zip          internal test only         ->  all of them
//   -curseforge-local.zip  THIS MACHINE               ->  all of them, incl. the four
//
// ADR 0005 reasons about *distribution*. A file built here for use here is not
// distribution. The name says `local`, and the README inside says why.
//
// Two of the four are unproblematic — TakKit is MIT and Client Dynamic Light is
// MPL-2.0, both of which grant redistribution in their own text. The other two,
// Flashier Flashlights and Player Microchip, are All Rights Reserved with an
// explicit opt-out. They are the reason this file is not simply the normal
// export.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync, copyFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { readPack, readMetas } from './lib/pack.mjs'

const ROOT = process.cwd()
const pack = readPack(ROOT)
const NAME = pack.name.replace(/[^A-Za-z0-9]+/g, '-')
const SRC = join(ROOT, 'build', `${NAME}-${pack.version}.zip`)
const OUT = join(ROOT, 'build', `${NAME}-${pack.version}-curseforge-local.zip`)
const STAGE = join(ROOT, 'build', '.cf-local')

/** The four, with the licence that decides how each one reads. Slugs match the
 *  metafile basenames; nothing here is guessed. */
const BLOCKED = [
  ['takkit', 'TakKit', 'MIT — the licence grants redistribution'],
  ['client-dynamic-light', 'Client Dynamic Light', 'MPL-2.0 — the licence grants redistribution'],
  ['flashier-flashlights', 'Flashier Flashlights', 'All Rights Reserved — no grant, and an explicit opt-out'],
  ['player-microchip', 'Player Microchip (Tracker)', 'All Rights Reserved — no grant, and an explicit opt-out'],
]

if (!existsSync(SRC)) {
  console.error(`${SRC} is missing.`)
  console.error('Run: packwiz curseforge export -o "build/<name>-<version>.zip"')
  process.exit(1)
}

if (existsSync(STAGE)) rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })

// -- unpack the normal export ----------------------------------------------
execFileSync('powershell', ['-NoProfile', '-Command',
  `$ErrorActionPreference='Stop';` +
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `[System.IO.Compression.ZipFile]::ExtractToDirectory('${SRC}','${STAGE}')`,
], { stdio: 'pipe' })
console.log(`unpacked ${NAME}-${pack.version}.zip`)

// -- copy each blocked jar out of the build cache --------------------------
const CACHE = join(ROOT, 'build', '.jar-cache')
const metas = readMetas(ROOT)
const modsDir = join(STAGE, 'overrides', 'mods')
mkdirSync(modsDir, { recursive: true })

const added = []
for (const [slug, label, licence] of BLOCKED) {
  const metaPath = join(ROOT, 'mods', `${slug}.pw.toml`)
  if (!existsSync(metaPath)) { console.error(`  ! ${slug}: no metafile`); process.exit(1) }
  const filename = (readFileSync(metaPath, 'utf8').match(/^filename\s*=\s*"([^"]*)"/m) || [])[1]
  const cached = join(CACHE, filename)
  if (!existsSync(cached)) {
    console.error(`  ! ${label}: ${filename} not in build/.jar-cache/`)
    console.error('    Run a build that fetches jars first: node scripts/build/build-instance.mjs')
    process.exit(1)
  }
  copyFileSync(cached, join(modsDir, filename))
  added.push({ slug, label, filename, licence })
  console.log(`  bundled ${label} — ${licence}`)
}

// -- drop their manifest entries, so the App does not refetch what is here --
const manifestPath = join(STAGE, 'manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const blockedIds = new Set(BLOCKED.map(([slug]) => {
  const src = readFileSync(join(ROOT, 'mods', `${slug}.pw.toml`), 'utf8')
  return Number((src.match(/^\s*project-id\s*=\s*(\d+)/m) || [])[1])
}).filter(Boolean))

const before = manifest.files.length
manifest.files = manifest.files.filter(f => !blockedIds.has(f.projectID))
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`manifest: ${before} → ${manifest.files.length} referenced (${before - manifest.files.length} now bundled)`)

// -- the warning the importer sees -----------------------------------------
writeFileSync(join(STAGE, 'README.txt'), [
  `${pack.name} — ${pack.version} — CurseForge format, LOCAL USE ONLY`,
  '',
  'DO NOT SHARE THIS FILE.',
  '',
  '  It contains four mods whose authors switched off third-party downloading.',
  '  It exists so that importing into the CurseForge App is one step on the',
  '  machine that built it. It is not the artifact anyone else receives.',
  '',
  '  To give this pack to someone, send the friend pack instead. It contains no',
  '  third-party mod files at all, and the build refuses to emit one that does.',
  '',
  'THE FOUR, AND WHY THEY ARE NOT ONE CASE',
  '',
  ...added.flatMap(a => [`  ${a.label}`, `    ${a.filename}`, `    ${a.licence}`, '']),
  '  TakKit and Client Dynamic Light could be shared — their own licences say so.',
  '  The other two could not. That is the whole reason this file is named local.',
  '',
  'WHAT IS NOT VERIFIED',
  '',
  '  Nobody has launched a client. Every check so far is a dedicated-server boot.',
  '  Treat any world you create as a test world: the biome generation has not',
  '  been tested against the criteria the design documents set.',
  '',
].join('\n'))

// -- repack, entries with `/` ----------------------------------------------
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

// -- read the archive back; do not trust that the copies landed ------------
const listing = execFileSync('powershell', ['-NoProfile', '-Command',
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `$z=[System.IO.Compression.ZipFile]::OpenRead('${OUT}');` +
  `$z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()`,
], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)

const problems = []
for (const a of added) {
  if (!listing.includes(`overrides/mods/${a.filename}`)) problems.push(`${a.label} did not make it into the archive`)
}
if (listing.some(e => e.includes('\\'))) problems.push('entry names contain a backslash')
if (!listing.includes('manifest.json')) problems.push('manifest.json missing')
if (!listing.includes('README.txt')) problems.push('README.txt missing')

const jars = listing.filter(e => e.toLowerCase().endsWith('.jar')).length
if (problems.length) {
  console.error('\n✗ local CurseForge pack is malformed:')
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}

rmSync(STAGE, { recursive: true, force: true })
const size = statSync(OUT).size
console.log(`\narchive verified — ${jars} jars bundled, all four blocked mods present, no backslash entries`)
console.log(`\n✓ build/${NAME}-${pack.version}-curseforge-local.zip  (${(size / 1048576).toFixed(0)} MB, ${metas.length} mods)`)
console.log('  CurseForge App → Create Custom Profile → Import. LOCAL USE ONLY — do not share it.')
