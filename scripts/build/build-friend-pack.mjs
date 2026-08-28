#!/usr/bin/env node
// The artifact a friend actually receives, under ADR 0005.
//
// It contains **no third-party jar at all**. What it carries is:
//
//   - the packwiz manifest (pack.toml, index.toml, mods/*.pw.toml) — exact
//     versions and hashes, but only as references
//   - the pack-owned layer (config/, kubejs/, defaultconfigs/, resourcepacks/)
//     — which is the whole of what we author and the whole of what changes
//     between versions
//   - instructions
//
// packwiz-installer downloads each mod from its author's own upload on the
// friend's machine. We rehost nothing, which is what Serene Seasons and Entity
// Culling actually ask for (see docs/distribution-licenses.md).
//
// ADR 0003's self-contained 405 MB instance is NOT deleted — it is demoted to an
// internal test artifact. It is the thing we boot; it is not the thing we hand
// out.

import { readdirSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync, copyFileSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { execFileSync } from 'node:child_process'
import { readPack, readMetas, versionStamp, packOwnedJars } from './lib/pack.mjs'

const ROOT = process.cwd()
const STAGE = join(ROOT, 'build', '.friend')
const pack = readPack(ROOT)
const NAME = pack.name, VERSION = pack.version, MC = pack.mc, FORGE = pack.forge
const OUT = join('build', `${NAME.replace(/[^A-Za-z0-9]+/g, '-')}-${VERSION}-friend.zip`)

/** The mods packwiz-installer cannot fetch, because their authors switched off
 *  third-party API distribution. ADR 0005 makes these an explicit one-time
 *  manual step rather than something we quietly work around. */
const MANUAL = [
  ['TakKit', 'takkit'],
  ['Flashier Flashlights', 'flashier-flashlights'],
  ['Client Dynamic Light', 'client-dynamic-light'],
  ['Player Microchip (Tracker)', 'player-microchip'],
]

if (existsSync(STAGE)) rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })

// -- the manifest -----------------------------------------------------------
copyFileSync(join(ROOT, 'pack.toml'), join(STAGE, 'pack.toml'))
copyFileSync(join(ROOT, 'index.toml'), join(STAGE, 'index.toml'))
mkdirSync(join(STAGE, 'mods'))
let metaCount = 0
for (const f of readdirSync(join(ROOT, 'mods'))) {
  if (!f.endsWith('.pw.toml')) continue
  copyFileSync(join(ROOT, 'mods', f), join(STAGE, 'mods', f))
  metaCount++
}
console.log(`manifest: pack.toml, index.toml, ${metaCount} metafiles`)

// The one place a jar is allowed in the friend pack: our own. It is 1 KB, we
// wrote it, and packwiz-installer cannot fetch it from anywhere — there is no
// URL. Shipping it inside the archive is what makes it reach the friend at all.
let ownJars = 0
for (const j of packOwnedJars(ROOT)) {
  copyFileSync(j.path, join(STAGE, 'mods', j.filename))
  ownJars++
  console.log(`bundled our own ${j.filename}`)
}

// -- the pack-owned layer ---------------------------------------------------
let ownedBytes = 0, ownedFiles = 0
const measure = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) measure(full)
    else { ownedBytes += statSync(full).size; ownedFiles++ }
  }
}
for (const dir of ['config', 'kubejs', 'defaultconfigs', 'resourcepacks']) {
  const src = join(ROOT, dir)
  if (!existsSync(src) || !statSync(src).isDirectory()) continue
  execFileSync('cp', ['-r', src, join(STAGE, dir)])
  measure(join(STAGE, dir))
  console.log(`bundled ${dir}/`)
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
  copyFileSync(src, join(STAGE, name))
  ownedBytes += statSync(src).size
  ownedFiles++
  console.log(`bundled ${name}`)
}

// Maintainer READMEs are repo documentation. The connected-texture pack's README
// is the one exception: it ships, because it tells a player why that pack does
// nothing yet.
let stripped = 0
const stripMarkdown = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) { stripMarkdown(full); continue }
    if (!name.toLowerCase().endsWith('.md')) continue
    if (relative(STAGE, full).split(sep).join('/').startsWith('resourcepacks/')) continue
    rmSync(full); stripped++
  }
}
stripMarkdown(STAGE)
console.log(`stripped ${stripped} maintainer .md file(s)`)

const roster = join(ROOT, 'docs', 'MODLIST.md')
if (!existsSync(roster)) {
  console.error('docs/MODLIST.md is missing — run: node scripts/build/generate-modlist.mjs')
  process.exit(1)
}
copyFileSync(roster, join(STAGE, 'MODLIST.md'))
writeFileSync(join(STAGE, 'pack-version.txt'), versionStamp(pack, 'friend'))

// -- instructions -----------------------------------------------------------
const metas = readMetas(ROOT)
writeFileSync(join(STAGE, 'README.txt'), [
  `${NAME} — ${VERSION}`,
  '',
  `Minecraft ${MC} · Forge ${FORGE} · ${metas.length} mods`,
  '',
  'WHAT THIS FILE IS',
  '',
  '  The pack, without the mods.',
  '',
  '  It carries our own work — configs, KubeJS scripts, the quest campaign, the',
  '  connected-texture pack — plus an exact, hash-pinned list of every mod. The',
  '  mods themselves download from their authors when you install.',
  '',
  '  We do not redistribute other people\'s mod files. Several authors ask',
  '  exactly that: use a pack, but do not rehost the jar. MODLIST.md lists all',
  `  ${metas.length} with a link to where each one came from.`,
  '',
  'INSTALL',
  '',
  '  1. Install Prism Launcher and a Java 17 runtime.',
  `  2. Create an instance: Minecraft ${MC}, Forge ${FORGE}.`,
  '  3. Unzip this archive into the instance\'s .minecraft folder.',
  '  4. Download packwiz-installer-bootstrap.jar from',
  '     https://github.com/packwiz/packwiz-installer-bootstrap/releases',
  '     and put it in the same folder.',
  '  5. In Prism: Edit Instance -> Settings -> Custom Commands -> Pre-launch,',
  '     and set:',
  '',
  '       "$INST_JAVA" -jar packwiz-installer-bootstrap.jar pack.toml',
  '',
  '  6. Launch. The first launch downloads the mods; later launches only fetch',
  '     what changed.',
  '',
  'FOUR MODS YOU DOWNLOAD ONCE, BY HAND',
  '',
  '  Their authors turned off third-party downloading, so the installer cannot',
  '  fetch them and neither will we. Get each from CurseForge and drop the jar',
  '  in .minecraft/mods/ — once. Updates after that are ours, not theirs.',
  '',
  ...MANUAL.map(([n, slug]) => `    ${n}\n      https://www.curseforge.com/minecraft/mc-mods/${slug}`),
  '',
  'RUNNING A SERVER FROM THIS SAME FILE',
  '',
  '  No other download. Install Forge ' + FORGE + ' as a dedicated server, unzip',
  '  this over it, put the bootstrap jar beside pack.toml, and run once:',
  '',
  '    java -jar packwiz-installer-bootstrap.jar -g -s server pack.toml',
  '',
  '  -s server skips the client-only mods (graphics, sound, HUD). Then start the',
  '  server normally.',
  '',
  '  Everyone must be on the same version. Compare pack-version.txt; if the',
  '  numbers differ, that IS the problem - do not debug anything else first.',
  '',
  'UPDATING',
  '',
  '  Replace this archive\'s contents and launch. The pre-launch step reconciles',
  '  the mod list for you. A patch is usually a few hundred kilobytes, because',
  '  what changes is our configs and scripts, not 400 MB of jars.',
  '',
  'SHADERS ARE OPTIONAL, AND THE LOADER IS ALREADY HERE',
  '',
  '  Oculus is included. It is Iris, built for Forge, and it does nothing until',
  '  you pick a shaderpack: drop a .zip into shaderpacks/ (Oculus creates that',
  '  folder on first launch) and choose it under Options -> Video Settings ->',
  '  Shader Packs. With nothing selected the game renders normally.',
  '',
  '  No shaderpack ships with this file. Players have different GPUs, and most',
  '  shaders make dark places genuinely dark — which matters here, because the',
  '  monsters in this pack do not burn in daylight.',
  '',
  '  DO NOT INSTALL OPTIFINE. Shader guides on the web name it as the Forge',
  '  route; it collides with Embeddium, which this pack depends on. If the game',
  '  stops launching or renders wrong, remove OptiFine before looking anywhere',
  '  else.',
  '',
  'WHAT IS NOT VERIFIED',
  '',
  '  Nobody has played this. A client has been launched and reaches the main',
  '  menu; everything past that is untested. Most other checks are',
  '  dedicated-server boots: configs parse, recipes register, quests load.',
  '  Balance numbers are design targets, not measurements — and Oculus itself',
  '  has not been launched with a shaderpack selected.',
  '',
].join('\n'))

// -- archive ----------------------------------------------------------------
mkdirSync(join(ROOT, 'build'), { recursive: true })
const outAbs = join(ROOT, OUT)
if (existsSync(outAbs)) rmSync(outAbs)
// Entries are written explicitly with `/`. `ZipFile::CreateFromDirectory` uses
// the platform separator on Windows, which the ZIP spec forbids (4.4.17.1) —
// the defect ADR 0003 recorded, and which the self-check below caught again
// when this script first used it.
execFileSync('powershell', ['-NoProfile', '-Command', `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stage = '${STAGE}'
$out   = '${outAbs}'
$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($stage.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose() }
`], { stdio: 'pipe' })

// -- self-check: the whole point is that there are NO jars in here -----------
const listing = execFileSync('powershell', ['-NoProfile', '-Command',
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `$z=[System.IO.Compression.ZipFile]::OpenRead('${outAbs.replace(/\\/g, '\\\\')}');` +
  `$z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()`,
], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)

const jars = listing.filter(e => e.toLowerCase().endsWith('.jar'))
const backslashes = listing.filter(e => e.includes('\\'))
const problems = []
// Zero THIRD-PARTY jars is the rule; our own shim is the sole exception and is
// matched by name, so a stray mod jar still fails the build.
const foreign = jars.filter(e => !/^mods\/militarybackpack-refmap-shim-[^/]*\.jar$/.test(e))
if (foreign.length) problems.push(`${foreign.length} third-party jar(s) present — this artifact must contain none: ${foreign.slice(0, 3).join(', ')}`)
if (jars.length !== ownJars) problems.push(`expected ${ownJars} of our own jar(s), found ${jars.length}`)
if (backslashes.length) problems.push(`${backslashes.length} entry name(s) contain a backslash`)
if (!listing.includes('pack.toml')) problems.push('pack.toml missing')
if (!listing.some(e => e.startsWith('mods/'))) problems.push('no metafiles')
if (problems.length) {
  console.error('\n✗ friend pack is malformed:')
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}

// The readme that sits BESIDE the archive, for whoever is handed the link. The
// one inside the zip is for someone who already downloaded it; this one is for
// someone looking at a folder and deciding what to click.
const driveReadme = join(ROOT, 'docs', 'friend-download-readme.md')
if (!existsSync(driveReadme)) {
  console.error('docs/friend-download-readme.md is missing — the upload has no instructions')
  process.exit(1)
}
copyFileSync(driveReadme, join(ROOT, 'build', 'README.md'))
console.log('wrote build/README.md — upload this next to the archive')

const size = statSync(outAbs).size
console.log(`\narchive verified — ${listing.length} entries, 0 third-party jars, ${ownJars} of ours, no backslash entries`)
console.log(`\n✓ ${OUT}  (${(size / 1024).toFixed(0)} KB, ${metas.length} mods referenced, ${ownedFiles} pack-owned files)`)
console.log(`  Our own layer is ${(ownedBytes / 1024).toFixed(0)} KB. The 405 MB instance zip is now an internal test artifact.`)
