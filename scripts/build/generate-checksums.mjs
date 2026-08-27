#!/usr/bin/env node
// Distribution Spec §39 — checksums for the release artifacts.
//
//   node scripts/build/generate-checksums.mjs
//
// §39 names what they are for:
//
//     corrupted download
//     wrong version
//     release verification
//
// Output is written in the exact format `sha256sum -c` reads, so a friend on
// any platform can check a download without installing anything:
//
//     sha256sum -c SHA256SUMS.txt
//     Get-FileHash file.zip -Algorithm SHA256      (Windows, one file at a time)
//
// The second use — "wrong version" — is the one that actually bites. A friend
// with last month's client zip and this month's server pack gets a mod-list
// mismatch on join and no clue why. The version each artifact carries is
// printed next to its hash for exactly that reason.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { readPack } from './lib/pack.mjs'

const ROOT = process.cwd()
const BUILD = join(ROOT, 'build')
const OUT = join(BUILD, 'SHA256SUMS.txt')

const pack = readPack(ROOT)

if (!existsSync(BUILD)) {
  console.error('build/ does not exist — nothing to checksum.')
  console.error('Run: node scripts/build/build-instance.mjs && node scripts/build/build-server.mjs')
  process.exit(1)
}

// `-curseforge-local.zip` is excluded on purpose. SHA256SUMS.txt is a manifest
// for people who received a download; that artifact is never handed to anyone —
// it bundles the four mods whose authors disabled third-party distribution, and
// ADR 0005 scopes it to the machine that built it. Listing it here would put a
// file that must not be shared into the document people use to check what they
// were sent.
const artifacts = readdirSync(BUILD)
  .filter(f => f.endsWith('.zip') || f.endsWith('.mrpack'))
  .filter(f => !f.endsWith('-curseforge-local.zip'))
  .sort()

if (!artifacts.length) {
  console.error('build/ holds no .zip or .mrpack — nothing to checksum.')
  process.exit(1)
}

console.log(`${pack.name} ${pack.version} — checksumming ${artifacts.length} artifact(s)\n`)

const lines = []
const report = []
for (const f of artifacts) {
  const abs = join(BUILD, f)
  const buf = readFileSync(abs)
  const sum = createHash('sha256').update(buf).digest('hex')

  // Read the version stamp back OUT of the archive rather than trusting
  // pack.toml. §12 wants the client and server packs to agree, and the only
  // way to catch a stale artifact is to ask the artifact.
  let stamped = '(no pack-version.txt)'
  try {
    const raw = execFileSync('powershell', ['-NoProfile', '-Command',
      `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
      `$z=[System.IO.Compression.ZipFile]::OpenRead('${abs}');` +
      `$e=$z.Entries | Where-Object { $_.FullName -like '*pack-version.txt' } | Select-Object -First 1;` +
      `if ($e) { $r=New-Object IO.StreamReader($e.Open()); $r.ReadToEnd(); $r.Dispose() };` +
      `$z.Dispose()`], { encoding: 'utf8' })
    const v = raw.match(/^version=(.+)$/m)
    const side = raw.match(/^side=(.+)$/m)
    if (v) stamped = `${v[1].trim()} (${side ? side[1].trim() : '?'})`
  } catch { /* fall through to the CurseForge manifest below */ }

  // A `packwiz curseforge export` carries no pack-version.txt -- it is built
  // from the index, and pack-version.txt is not a repo file. Its manifest.json
  // records the same version, so read that instead of reporting a blank.
  if (stamped === '(no pack-version.txt)') {
    try {
      const raw = execFileSync('powershell', ['-NoProfile', '-Command',
        `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
        `$z=[System.IO.Compression.ZipFile]::OpenRead('${abs}');` +
        `$e=$z.Entries | Where-Object { $_.FullName -eq 'manifest.json' } | Select-Object -First 1;` +
        `if ($e) { $r=New-Object IO.StreamReader($e.Open()); $r.ReadToEnd(); $r.Dispose() };` +
        `$z.Dispose()`], { encoding: 'utf8' })
      const m = JSON.parse(raw)
      if (m.version) stamped = `${m.version} (curseforge)`
    } catch { /* an archive with neither is reported as such, not as an error */ }
  }

  lines.push(`${sum}  ${f}`)
  report.push({ f, sum, stamped, mb: (statSync(abs).size / 1048576).toFixed(0) })
  console.log(`  ${f}`)
  console.log(`    ${sum}`)
  console.log(`    ${report[report.length - 1].mb} MB · stamped ${stamped}`)
}

// A stale artifact is the failure this file exists to make visible, so say it
// out loud rather than leaving it in a column somebody has to compare by eye.
const mismatched = report.filter(r => r.stamped !== '(no pack-version.txt)' &&
  !r.stamped.startsWith(pack.version))
if (mismatched.length) {
  console.error(`\n✗ ${mismatched.length} artifact(s) were built from a different pack version than pack.toml says (${pack.version}):`)
  for (const r of mismatched) console.error(`   ${r.f} — stamped ${r.stamped}`)
  console.error('\n  Rebuild them. Distribution Spec §12: the client and server packs must match.')
  process.exit(1)
}

writeFileSync(OUT, lines.join('\n') + '\n')
console.log(`\n✓ build/SHA256SUMS.txt  (${lines.length} artifact(s), all stamped ${pack.version})`)
console.log('  Verify with:  sha256sum -c SHA256SUMS.txt')
