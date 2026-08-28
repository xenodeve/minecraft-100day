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

import { readdirSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync, copyFileSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { readPack, readMetas, fetchAndVerify, versionStamp, packOwnedJars } from './lib/pack.mjs'

const ROOT = process.cwd()
const CACHE = join(ROOT, 'build', '.jar-cache')
const STAGE = join(ROOT, 'build', '.instance')
const outArg = process.argv.indexOf('--out')

// ------------------------------------------------------------ pack metadata
const { name: NAME, version: VERSION, mc: MC, forge: FORGE } = readPack(ROOT)

const OUT = outArg > -1
  ? process.argv[outArg + 1]
  : join('build', `${NAME.replace(/[^A-Za-z0-9]+/g, '-')}-${VERSION}-instance.zip`)

// ------------------------------------------------------------ read metafiles
const metas = readMetas(ROOT)

console.log(`${NAME} ${VERSION} — Minecraft ${MC}, Forge ${FORGE}`)
console.log(`${metas.length} mods to assemble\n`)

// ------------------------------------------------------------ fetch + verify
await fetchAndVerify(metas, CACHE)

// ------------------------------------------------------------ stage instance
execFileSync('rm', ['-rf', STAGE])
const MODS = join(STAGE, '.minecraft', 'mods')
mkdirSync(MODS, { recursive: true })
for (const m of metas) execFileSync('cp', [join(CACHE, m.filename), join(MODS, m.filename)])

// Anything the pack owns beyond mods — config, kubejs, datapacks — ships too.
// Distribution Spec §4: those files are the gameplay; mods alone are not the pack.
//
// `.md` is stripped afterwards, because this copy does NOT go through
// `.packwizignore`. The maintainer READMEs under config/incontrol/,
// config/soundattract/, config/hordes/ and kubejs/ each open by saying they are
// not shipped to players — which was true of the packwiz path and false of this
// one. Two distribution paths that disagree about what the pack contains is the
// exact drift Distribution Spec §38 exists to catch.
for (const dir of ['config', 'defaultconfigs', 'kubejs', 'datapacks', 'resourcepacks', 'ftbquests']) {
  const src = join(ROOT, dir)
  if (existsSync(src) && statSync(src).isDirectory()) {
    execFileSync('cp', ['-r', src, join(STAGE, '.minecraft', dir)])
    console.log(`bundled ${dir}/`)
  }
}

// Root-level pack files. The directory list above cannot see them, and that is
// how options.txt (#123) reached the CurseForge export -- which is built by
// packwiz from the index -- but NOT this artifact, which is built from a
// hardcoded list. Two distribution paths disagreeing about what the pack
// contains is the drift Distribution Spec §38 exists to catch, and it caught
// this one only because the archive was read back.
//
// Driven by index.toml rather than a second hardcoded name, so the next root
// file added to the pack does not repeat this.
const rootFiles = existsSync(join(ROOT, 'index.toml'))
  ? [...readFileSync(join(ROOT, 'index.toml'), 'utf8')
      .matchAll(/\[\[files\]\]\s*\nfile\s*=\s*"([^"/]+)"/g)].map(m => m[1])
  : []
for (const name of rootFiles) {
  const src = join(ROOT, name)
  if (!existsSync(src)) continue
  copyFileSync(src, join(STAGE, '.minecraft', name))
  console.log(`bundled ${name}`)
}

// Jars we author ourselves. A metafile loop cannot see them, which is how the
// refMap shim reached none of the artifacts the first time (#86).
let ownJars = 0
for (const j of packOwnedJars(ROOT)) {
  copyFileSync(j.path, join(join(STAGE, '.minecraft', 'mods'), j.filename))
  ownJars++
  console.log(`bundled our own ${j.filename}`)
}

let stripped = 0
const stripMarkdown = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) stripMarkdown(full)
    else if (name.toLowerCase().endsWith('.md')) { rmSync(full); stripped++ }
  }
}
stripMarkdown(join(STAGE, '.minecraft'))
console.log(`stripped ${stripped} maintainer .md file(s) — they are repo documentation, not pack content`)


// The mod roster ships *after* the strip, deliberately. The strip exists to keep
// maintainer READMEs out of a player's install; `docs/MODLIST.md` is the
// opposite — it is the one document written for the person who downloaded this.
// Anyone reading it is holding the artifact, so it goes where they will see it.
const roster = join(ROOT, 'docs', 'MODLIST.md')
if (existsSync(roster)) {
  copyFileSync(roster, join(STAGE, 'MODLIST.md'))
  console.log('bundled docs/MODLIST.md — the roster a downloader reads')
} else {
  console.error('docs/MODLIST.md is missing — run: node scripts/build/generate-modlist.mjs')
  process.exit(1)
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

// Distribution Spec §12 wants the client and server packs to carry the same
// version, and §40 wants a mismatch to be obvious. A file both artifacts carry
// turns that check into a `cat`.
writeFileSync(join(STAGE, '.minecraft', 'pack-version.txt'), versionStamp(
  { name: NAME, version: VERSION, mc: MC, forge: FORGE }, 'client'))

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
if (jarsInZip !== metas.length + ownJars || backslashEntries > 0) {
  console.error(`\n✗ archive is malformed: ${jarsInZip}/${metas.length + ownJars} jars found under .minecraft/mods/, ` +
    `${backslashEntries} entries contain a backslash`)
  process.exit(1)
}
console.log(`archive verified — ${jarsInZip} jars under .minecraft/mods/ (${ownJars} ours), no backslash entries`)

const size = statSync(join(ROOT, OUT)).size
console.log(`\n✓ ${OUT}  (${(size / 1048576).toFixed(0)} MB, ${metas.length} mods)`)
console.log('  Prism Launcher → Add Instance → Import from zip. No network needed.')
