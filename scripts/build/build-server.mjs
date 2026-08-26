#!/usr/bin/env node
// Build the server pack — Distribution Spec §12.
//
//   node scripts/build/build-server.mjs
//   node scripts/build/build-server.mjs --out build/custom-name.zip
//
// §12 lists what a server pack must do:
//
//     exclude unnecessary client-only mods
//     include common mods
//     include server configs
//     include KubeJS
//     include datapacks
//     include quest data if required
//     Client Pack Version = Server Pack Version
//
// The exclusion is not a judgement made here. It reads the `side` field in each
// metafile, and `docs/side-classification.md` is where every one-sided call has
// to justify itself — `verify.mjs` fails the ship gate if a mod is marked
// `client` or `server` without an entry there. This script is the consumer of
// that decision, not the place it gets made.
//
// The output unzips OVER a Forge 1.20.1 server install. It deliberately does
// not bundle Forge itself: the installer is 6 MB of jars that Forge's own
// installer places correctly, and a stale copy inside a pack zip is a support
// problem waiting to happen.

import { readdirSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { readPack, readMetas, fetchAndVerify, versionStamp } from './lib/pack.mjs'

const ROOT = process.cwd()
const CACHE = join(ROOT, 'build', '.jar-cache')
const STAGE = join(ROOT, 'build', '.server')
const outArg = process.argv.indexOf('--out')

const pack = readPack(ROOT)
const { name: NAME, version: VERSION, mc: MC, forge: FORGE } = pack

const OUT = outArg > -1
  ? process.argv[outArg + 1]
  : join('build', `${NAME.replace(/[^A-Za-z0-9]+/g, '-')}-${VERSION}-server.zip`)

// ------------------------------------------------------------ select mods
const all = readMetas(ROOT)
const serverMods = all.filter(m => m.side !== 'client')
const excluded = all.filter(m => m.side === 'client')

console.log(`${NAME} ${VERSION} — server pack — Minecraft ${MC}, Forge ${FORGE}`)
console.log(`${all.length} mods in the pack, ${serverMods.length} for the server`)
console.log(`excluding ${excluded.length} client-only:`)
for (const m of excluded) console.log(`  − ${m.name}`)
console.log()

// ------------------------------------------------------------ fetch + verify
await fetchAndVerify(serverMods, CACHE)

// ------------------------------------------------------------ stage
execFileSync('rm', ['-rf', STAGE])
const MODS = join(STAGE, 'mods')
mkdirSync(MODS, { recursive: true })
for (const m of serverMods) execFileSync('cp', [join(CACHE, m.filename), join(MODS, m.filename)])

// §12 names these explicitly. `resourcepacks/` is absent on purpose — a
// dedicated server has nothing to render.
for (const dir of ['config', 'defaultconfigs', 'kubejs', 'datapacks']) {
  const src = join(ROOT, dir)
  if (existsSync(src) && statSync(src).isDirectory()) {
    execFileSync('cp', ['-r', src, join(STAGE, dir)])
    console.log(`bundled ${dir}/`)
  }
}

// Same reason as the client build: this copy does not go through
// `.packwizignore`, and the maintainer READMEs each say they are not shipped.
let stripped = 0
const stripMarkdown = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) stripMarkdown(full)
    else if (name.toLowerCase().endsWith('.md')) { rmSync(full); stripped++ }
  }
}
stripMarkdown(STAGE)
console.log(`stripped ${stripped} maintainer .md file(s)`)

writeFileSync(join(STAGE, 'pack-version.txt'), versionStamp(pack, 'server'))

writeFileSync(join(STAGE, 'README.txt'), [
  `${NAME} — server pack ${VERSION}`,
  '',
  `Minecraft ${MC} · Forge ${FORGE}`,
  '',
  'INSTALL',
  '',
  `  1. Install Forge ${FORGE} for Minecraft ${MC} as a dedicated server.`,
  '     https://files.minecraftforge.net/  →  Installer  →  "Install server"',
  '  2. Unzip this archive over the server directory, so that mods/, config/,',
  '     defaultconfigs/ and kubejs/ sit next to the Forge run scripts.',
  '  3. Accept the EULA in eula.txt.',
  '  4. Start it with the run script Forge generated.',
  '',
  'VERSION MATCHING',
  '',
  '  The client and server packs must be the same version. Compare',
  '  pack-version.txt here against the one in the client instance',
  '  (.minecraft/pack-version.txt). If they disagree, that IS the problem —',
  '  do not debug anything else first.',
  '',
  'WHAT IS NOT HERE',
  '',
  `  ${excluded.length} client-only mods are deliberately excluded. Each one is`,
  '  justified in docs/side-classification.md, and the ship gate refuses a',
  '  one-sided classification that has no written reason.',
  '',
  '  Forge itself is not bundled. Its own installer places its libraries',
  '  correctly, and a stale copy inside a pack zip is a support problem.',
  '',
].join('\n'))

// ------------------------------------------------------------ zip
//
// NOT Compress-Archive — it writes entry names with backslashes, which the ZIP
// spec forbids (4.4.17.1). See build-instance.mjs for the full story; it cost
// a whole build there.
mkdirSync(join(ROOT, 'build'), { recursive: true })
execFileSync('rm', ['-f', join(ROOT, OUT)])

execFileSync('powershell', ['-NoProfile', '-Command', `
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
`], { stdio: 'inherit' })

// Verify what came out, rather than trusting it.
const check = execFileSync('powershell', ['-NoProfile', '-Command',
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `$z=[System.IO.Compression.ZipFile]::OpenRead('${join(ROOT, OUT)}');` +
  `$n=($z.Entries | Where-Object { $_.FullName -like 'mods/*.jar' }).Count;` +
  `$b=($z.Entries | Where-Object { $_.FullName -like '*\\\\*' }).Count;` +
  `$c=($z.Entries | Where-Object { $_.FullName -like 'config/ftbquests/*' }).Count;` +
  `$z.Dispose(); Write-Output "$n $b $c"`], { encoding: 'utf8' }).trim().split(/\s+/)

const [jarsInZip, backslashEntries, questFiles] = check.map(Number)
const problems = []
if (jarsInZip !== serverMods.length) problems.push(`${jarsInZip}/${serverMods.length} jars under mods/`)
if (backslashEntries > 0) problems.push(`${backslashEntries} entries contain a backslash`)
if (questFiles === 0) problems.push('no quest data — §12 requires it')

// A client-only jar reaching the server pack is the failure this whole script
// exists to prevent, so it is checked rather than assumed.
const leaked = excluded.filter(m => {
  const r = execFileSync('powershell', ['-NoProfile', '-Command',
    `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
    `$z=[System.IO.Compression.ZipFile]::OpenRead('${join(ROOT, OUT)}');` +
    `$n=($z.Entries | Where-Object { $_.FullName -eq 'mods/${m.filename}' }).Count;` +
    `$z.Dispose(); Write-Output $n`], { encoding: 'utf8' }).trim()
  return Number(r) > 0
})
if (leaked.length) problems.push(`client-only mods present: ${leaked.map(m => m.name).join(', ')}`)

if (problems.length) {
  console.error(`\n✗ server pack is malformed:`)
  for (const p of problems) console.error(`   ${p}`)
  process.exit(1)
}
console.log(`archive verified — ${jarsInZip} jars, ${questFiles} quest files, 0 client-only mods, no backslash entries`)

const size = statSync(join(ROOT, OUT)).size
console.log(`\n✓ ${OUT}  (${(size / 1048576).toFixed(0)} MB, ${serverMods.length} mods)`)
console.log(`  Unzip over a Forge ${FORGE} server install.`)
