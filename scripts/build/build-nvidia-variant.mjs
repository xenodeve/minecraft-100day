#!/usr/bin/env node
// Build the opt-in upscaling / frame-generation artifacts — three drop-in
// add-ons, plus one full profile for Candidate A.
//
// PERF-UPFG-045 asks for Super Resolution in an ISOLATED CLIENT PROFILE. That
// is the full variant below: the jar is injected into a COPY of the CurseForge
// artifact and never enters mods/.
//
// The three ADD-ONS (#115) are the shape a player actually uses: one jar and a
// README, dropped over an existing .minecraft. They are mutually exclusive by
// intent, not by Forge — see the one-at-a-time note further down.
//
// WHY NONE OF THIS IS A METAFILE
//
//   PERF-FREEZE forbids a performance mod entering the pack. A mods/*.pw.toml
//   would put it in index.toml, move the roster digest, change MODLIST.md and
//   make `verify` report 121. None of that happens here, so the roster is
//   untouched and PERF-UPFG-042 rollback is satisfied by deleting one file.
//
// NAMING, PERF-UPFG-004
//
//   Each archive is named for what its own upstream verifiably claims, and no
//   further. The per-candidate `naming` field records why that name is allowed.
//
//   #119 settled the question this rule was hedging: real NVIDIA DLSS-G exists
//   in this family -- nvngx_dlssg.dll -- but it is in WISTERIA, a separate
//   companion mod, not in Super Resolution. Candidate A does upscaling only,
//   and its FG menu section is never built. `(Upscaling)` was the right name.
//
// PINS, PERF-UPFG-032
//
//   Every jar is checked against a recorded size and digest before it is used.
//   Provenance differs by candidate and is stated per candidate: CurseForge
//   publishes a sha1 for PFG, so that one is checked against the UPSTREAM
//   number. GitHub publishes no digest for MCDLSSG, so its sha512 is the digest
//   of the asset as downloaded from the pinned release URL at the recorded
//   size — a reproducibility pin, not an upstream attestation. Said plainly
//   because the two are not the same kind of evidence.
import { existsSync, mkdirSync, rmSync, copyFileSync, readFileSync, writeFileSync, statSync } from 'node:fs'
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
const CACHE = join(ROOT, 'build', '.jar-cache')

const CANDIDATES = [
  {
    key: 'A',
    name: 'Super Resolution',
    version: '1.20.1-0.9.1-alpha.1+gl-forge',
    filename: 'super_resolution-forge-1.20.1-0.9.1-alpha.1+opengl.jar',
    size: 33264554,
    alg: 'sha512',
    // prefix; Modrinth publishes the full sha512 for this file
    hash: '0b0744f3a708f33f83c37a785b39e12c062a4d690b2774af3c3be339d7f06b34',
    provenance: 'Modrinth publishes this sha512 — checked against the upstream number',
    url: 'https://cdn.modrinth.com/data/Hf3Qz2H3/versions/MeE6lOJf/' +
         'super_resolution-forge-1.20.1-0.9.1-alpha.1%2Bopengl.jar',
    label: '[Optional] Super Resolution(Upscaling)',
    // PERF-UPFG-004: names the mod and its primary function. Asserts nothing
    // about which frame-generation backend it uses.
    naming: 'mod name + primary function',
    what: [
      '  ทำ upscaling อย่างเดียว — DLSS / FSR2 / XeSS',
      '  ตั้งค่าได้ในเกมที่ Options → Video Settings',
      '',
      '  **ตัวนี้ทำ frame generation ไม่ได้ และในเมนูจะไม่มีหัวข้อนั้นให้เห็นเลย**',
      '  ไม่ใช่ตั้งค่าผิด โค้ดมันซ่อนหัวข้อนั้นไว้จนกว่าจะมี backend จริง',
      '  และ backend จริงอยู่ในมอดแยกอีกตัว (Wisteria) ซึ่งตอนนี้ยังลงไม่ได้',
      '  เพราะมันบังคับว่าต้องมี Super Resolution ที่ใหม่กว่าตัวที่ปล่อยออกมาแล้ว',
      '',
      '  ชื่อไฟล์เขียนว่า Upscaling ด้วยเหตุผลนี้ ไม่ได้เขียนว่า Frame Gen',
    ],
    notes: [
      '  ตอนเปิดครั้งแรกมันจะโหลดไฟล์โมเดล DLSS จาก ngx.download.nvidia.com',
      '  นั่นคือตัวมอดไปโหลดจาก NVIDIA เอง ไม่ใช่แพ็คนี้แจกไฟล์ของ NVIDIA ซ้ำ',
      '  ถ้าไม่มีเน็ตตอนเปิดครั้งแรก ส่วน DLSS อาจใช้ไม่ได้',
      '',
      '  มันโหลดเวอร์ชัน "ล่าสุด" เสมอ แปลว่าไฟล์โมเดลเปลี่ยนได้เองระหว่างรอบ',
      '  ถ้าจะเอาไปเทียบผลกับตัวอื่น ต้องจดจาก log ว่ารอบนั้นได้ไฟล์ไหนมา',
      '',
      '  อย่าไปหาปุ่ม Frame Generation ในเมนู มันไม่มี ตามที่เขียนไว้ข้างบน',
      '',
      '  อีกสองตัวในชุดนี้อ้างว่าทำ frame generation ได้ ถ้าจะลองให้อ่าน README',
      '  ของตัวนั้นเอง เพราะแต่ละตัวมีเงื่อนไขคนละอย่าง และยังไม่มีตัวไหนถูกวัด',
      '  จะลองตัวไหนก็ลบ jar ตัวนี้ออกก่อน ลงพร้อมกันไม่ได้',
    ],
  },
  {
    key: 'B',
    name: 'MCDLSSG',
    version: '0.1.0-alpha+opengl',
    filename: 'mcdlssg-forge-1.20.1-0.1.0-alpha+opengl.jar',
    size: 23056319,
    alg: 'sha512',
    hash: 'd8b30e484c9206455d3bf7de1d314398d4be6132e991028a4736daeedb532233',
    provenance: 'GitHub publishes no digest — this is the downloaded asset, pinned for reproducibility',
    url: 'https://github.com/Tunanodra/MC-DLSSFG/releases/download/ITJUSTWORK/' +
         'mcdlssg-forge-1.20.1-0.1.0-alpha%2Bopengl.jar',
    label: '[Optional] MCDLSSG(DLSS Frame Gen)',
    // PERF-UPFG-004: `DLSS Frame Gen` is allowed HERE and nowhere else. The
    // spec records "DLSS Frame Generation full pipeline" as an EXPLICIT UPSTREAM
    // CLAIM for this mod, so the name repeats a claim the author makes rather
    // than inventing one. It is still a claim, not a measurement.
    naming: 'repeats the upstream author claim, verbatim',
    what: [
      '  ทำ upscaling แบบ DLSS / XeSS / FSR2 และอ้างว่าทำ DLSS Frame Generation',
      '  ตั้งค่าได้ในเกมที่ Options → Video Settings',
      '',
      '  คำว่า DLSS Frame Gen ในชื่อไฟล์ คือคำที่ "ผู้เขียนมอดอ้างเอง"',
      '  ไม่ใช่ผลที่แพ็คนี้วัดได้ ยังไม่มีใครในกลุ่มยืนยัน',
    ],
    notes: [
      '  ตัวนี้เสี่ยงที่สุดในสามตัว และควรรู้ไว้ก่อนกด:',
      '    - เป็น pre-release ที่ต้นทาง (tag ชื่อ ITJUSTWORK)',
      '    - ตอนที่หยิบมา ทั้ง GitHub มีคนโหลดไปแค่ 3 ครั้ง',
      '    - repo มีดาวเดียว',
      '  แปลว่าแทบไม่มีใครรันมันมาก่อนเรา ถ้าเจอบั๊กคืออาจไม่มีใครเคยเจอ',
      '',
      '  ผู้เขียนบอกเองว่างานนี้ได้แรงบันดาลใจจากโปรเจกต์ Super Resolution',
      '  มันไม่ใช่ fork (ไม่มีโค้ดของอีกตัวอยู่ข้างใน) แต่ทำเรื่องเดียวกัน',
      '  เพราะงั้นอย่าลงคู่กับ Super Resolution เด็ดขาด',
      '',
      '  ข้างในมี DLL ของ Windows สี่ไฟล์ ไม่มีของ Linux — ตัวนี้ Windows เท่านั้น',
      '',
      '  ถ้าจะเปิด Frame Generation ให้เริ่มที่ 2× ก่อน',
    ],
  },
  {
    key: 'C',
    name: 'PFG',
    version: '1.4.0',
    filename: 'pfg-1.4.0.jar',
    size: 62781,
    alg: 'sha1',
    hash: 'dd62223a58a62793454d59ea642ff961a8268084',
    provenance: 'CurseForge publishes this sha1 — checked against the upstream number',
    url: 'https://mediafilez.forgecdn.net/files/8722/501/pfg-1.4.0.jar',
    label: '[Optional] PFG(Frame Gen)',
    // PERF-UPFG-007 says in as many words: do not call PFG NVIDIA DLSS-G. It
    // ships no vendor SDK and no native code at all, so the name stays generic.
    naming: 'generic Frame Gen only — PERF-UPFG-007 forbids the DLSS-G wording here',
    what: [
      '  ทำ frame generation อย่างเดียว ไม่มี upscaling',
      '  ปุ่มสลับเปิด/ปิดคือ K',
      '',
      '  มันคำนวณเฟรมแทรกด้วย optical flow ที่เขียนเป็น fragment shader ล้วน ๆ',
      '  ไม่มี SDK ของ NVIDIA / AMD / Intel ไม่มี DLL ไม่มีการโหลดไฟล์เพิ่มตอนรัน',
      '  เพราะงั้นมันถึงมีขนาดแค่ 61 KB ไม่ใช่ 20–30 MB เหมือนอีกสองตัว',
      '  และเพราะงั้นมันใช้ได้กับการ์ดจอทุกยี่ห้อ ไม่ใช่แค่ NVIDIA',
      '',
      '  อย่าเรียกมันว่า DLSS Frame Generation มันคนละอย่างกันจริง ๆ',
    ],
    notes: [
      '  ผู้เขียนแนะนำเองว่า ตอนเปิด frame generation ให้:',
      '    - ปิด V-Sync',
      '    - ล็อก FPS ที่เกมเรนเดอร์จริงให้ "ต่ำกว่า" refresh rate ของจอ',
      '  ตอนนี้เครื่องที่ทดสอบตั้ง V-Sync เปิดอยู่ ถ้าจะลองตัวนี้ต้องปิดก่อน',
      '  ไม่งั้นผลที่ได้จะไม่ใช่ผลของมอด',
      '',
      '  ตัวเลขเวอร์ชันของมันไม่ตรงกันเอง: ชื่อไฟล์เขียน 1.4.0 แต่ข้างในเขียน 1.2.0',
      '  จดไว้ตามที่เห็น ไม่ได้แก้ให้',
      '',
      '  มันเป็น client-side ล้วน เข้า server ไหนก็ไม่กระทบ',
    ],
  },
]

const A = CANDIDATES[0]

// ---------------------------------------------------------------------------
// Resolve and verify every jar BEFORE building anything, so a bad pin fails
// before half the artifacts exist.
// ---------------------------------------------------------------------------
for (const c of CANDIDATES) {
  c.jar = join(CACHE, c.filename)
  if (!existsSync(c.jar)) {
    console.error(`${c.filename} is not in build/.jar-cache.`)
    console.error(`Fetch it once from:\n  ${c.url}`)
    console.error('It is deliberately not auto-downloaded: PERF-UPFG-032 wants a pinned release with')
    console.error('a recorded hash, not a silent fetch of whatever is current.')
    process.exit(1)
  }
  const got = createHash(c.alg).update(readFileSync(c.jar)).digest('hex')
  const size = statSync(c.jar).size
  if (size !== c.size || !got.startsWith(c.hash)) {
    console.error(`Candidate ${c.key}: the cached jar does not match the pinned release.`)
    console.error(`  expected ${c.size} bytes, ${c.alg} ${c.hash}…`)
    console.error(`  got      ${size} bytes, ${c.alg} ${got.slice(0, c.hash.length)}…`)
    console.error('Re-read the issue before overriding this — a changed jar is a changed experiment.')
    process.exit(1)
  }
  console.log(`${c.key}  ${c.name} ${c.version} — ${c.alg} matches the pin`)
  console.log(`    ${c.provenance}`)
}

// Repack entry-by-entry with `/` separators. CreateFromDirectory writes
// BACKSLASH entry names on Windows -- the ZIP-spec violation ADR 0003 recorded,
// and the self-check below caught it here too on the first run. Every other
// build in this repo writes entries the same way for the same reason.
function zipDir(stage, out) {
  if (existsSync(out)) rmSync(out)
  execFileSync('powershell', ['-NoProfile', '-Command', `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stage = '${stage}'
$out   = '${out}'
$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($stage.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose() }
`], { stdio: 'pipe' })
}

// A build log is not evidence. Read the archive back and list what is in it.
function entriesOf(zip) {
  return execFileSync('powershell', ['-NoProfile', '-Command',
    `$ErrorActionPreference='Stop';` +
    `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
    `$z=[System.IO.Compression.ZipFile]::OpenRead('${zip}');` +
    `$z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()`,
  ], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)
}

function fail(what, problems) {
  console.error(`\n✗ ${what} is malformed:`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// The full variant — Candidate A only.
//
// This is the right shape for a PERF-UPFG-021 A/B, where an unnoticed
// difference between two profiles would invalidate the run. It is the WRONG
// shape for someone who just wants to try a mod: importing it makes the
// CurseForge App fetch and install all 120 mods a second time.
// ---------------------------------------------------------------------------
if (!existsSync(SRC)) {
  console.error(`\n${SRC} is missing.`)
  console.error('Build the CurseForge artifact first: node scripts/build/build-curseforge-local.mjs')
  process.exit(1)
}

if (existsSync(STAGE)) rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })

execFileSync('powershell', ['-NoProfile', '-Command',
  `$ErrorActionPreference='Stop';` +
  `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
  `[System.IO.Compression.ZipFile]::ExtractToDirectory('${SRC}','${STAGE}')`,
], { stdio: 'pipe' })
console.log(`\nunpacked ${NAME}-${pack.version}-curseforge-local.zip`)

const modsDir = join(STAGE, 'overrides', 'mods')
mkdirSync(modsDir, { recursive: true })
copyFileSync(A.jar, join(modsDir, A.filename))
console.log(`injected ${A.filename}`)

zipDir(STAGE, OUT)
const listing = entriesOf(OUT)

const problems = []
if (!listing.some(e => e.endsWith(A.filename))) problems.push(`${A.filename} is not in the archive`)
const backslashes = listing.filter(e => e.includes('\\')).length
if (backslashes) problems.push(`${backslashes} entry name(s) use backslashes`)
if (!listing.includes('manifest.json')) problems.push('manifest.json missing')
// The other two candidates must NOT be here — this profile is Candidate A alone.
for (const c of CANDIDATES.slice(1)) {
  if (listing.some(e => e.endsWith(c.filename))) problems.push(`${c.filename} leaked into the A profile`)
}
if (problems.length) fail('variant', problems)

rmSync(STAGE, { recursive: true, force: true })
const jars = listing.filter(e => e.toLowerCase().endsWith('.jar')).length

console.log(`\narchive verified — ${listing.length} entries, ${jars} jars, Candidate A alone`)
console.log(`✓ build/${NAME}-${pack.version}-nvidia-upscaling.zip  (${(statSync(OUT).size / 1048576).toFixed(0)} MB)`)
console.log('  A CLEAN PROFILE, for measuring. Import as a new CurseForge profile.')

// ---------------------------------------------------------------------------
// The add-ons — one per candidate, no reinstall.
//
// PERF-UPFG-023 asks for isolated profiles and forbids mutating the playable
// instance "without tracking changes". One tracked file with a written
// uninstall step satisfies the qualifier.
//
// ONE AT A TIME, AND FORGE WILL NOT ENFORCE IT. Checked: MCDLSSG declares no
// incompatibility with super_resolution, so nothing stops a player loading two
// of these at once. PERF-UPFG-009 forbids it and Forge cannot, so the rule has
// to live on the first screen of every README.
// ---------------------------------------------------------------------------
const ALL_LABELS = CANDIDATES.map(c => `    ${c.label}`)

function readmeFor(c) {
  return [
    `${c.label}  —  ${c.name} ${c.version}`,
    `ของเสริมสำหรับ ${pack.name}`,
    '',
    '=== ลงได้ทีละตัวเท่านั้น ===',
    '',
    '  ของเสริมชุดนี้มีสามตัว และทั้งสามทำงานทับกัน:',
    ...ALL_LABELS,
    '',
    '  Forge จะไม่ห้ามคุณลงพร้อมกัน แต่ทั้งสามตัวไปแทรกขั้นตอนวาดเฟรมเดียวกัน',
    '  ลงซ้อนกันแล้วเกมพังหรือภาพเพี้ยน จะไม่รู้เลยว่าตัวไหนทำ',
    '  จะลองตัวใหม่ ให้ลบ jar ของตัวเดิมออกก่อนเสมอ',
    '',
    'ติดตั้ง',
    '',
    '  แตกไฟล์นี้ทับโฟลเดอร์ .minecraft ของ profile ที่คุณเล่นอยู่',
    '  ไม่ต้องสร้าง profile ใหม่ ไม่ต้องโหลดมอดใหม่ทั้งชุด',
    '',
    '  จะได้ไฟล์เดียวเพิ่มเข้าไป:',
    `    mods/${c.filename}`,
    '',
    'ถอน',
    '',
    '  ลบไฟล์ jar นั้นทิ้ง จบ ไม่มีอะไรค้าง',
    '',
    'มันคืออะไร',
    '',
    ...c.what,
    '',
    'สิ่งที่ต้องรู้ก่อนใช้',
    '',
    '  เป็นซอฟต์แวร์ทดลอง และ **ยังไม่มีใครวัดว่ามันช่วยหรือทำให้แย่ลง**',
    '  ไม่ได้อยู่ในรายชื่อมอดของแพ็ค การมีหรือไม่มีมันไม่กระทบการเข้า server',
    '',
    ...c.notes,
    '',
    ...(c.key === 'A' ? [] : [
      '  FPS ที่เพิ่มจาก frame generation ไม่เท่ากับการตอบสนองที่ดีขึ้น',
      '  ตัวเลขขึ้นแต่มือรู้สึกหน่วงลง เป็นเรื่องปกติของเทคนิคนี้',
      '',
    ]),
    'เจอปัญหา',
    '',
    '  ลบ jar ออกก่อนเป็นอย่างแรก แล้วส่ง .minecraft/logs/latest.log มา',
    '  โดยเฉพาะถ้าเปิดกับ shader แล้วภาพเพี้ยน หรือ HUD ปืนดูผิดปกติ',
    '',
  ].join('\n')
}

const built = []
for (const c of CANDIDATES) {
  const addon = join(ROOT, 'build', `${c.label}.zip`)
  const stage = join(ROOT, 'build', `.addon-${c.key}`)
  if (existsSync(stage)) rmSync(stage, { recursive: true, force: true })
  mkdirSync(join(stage, 'mods'), { recursive: true })
  copyFileSync(c.jar, join(stage, 'mods', c.filename))
  writeFileSync(join(stage, 'README.txt'), readmeFor(c))

  zipDir(stage, addon)
  const list = entriesOf(addon)

  const want = [`mods/${c.filename}`, 'README.txt']
  const bad = []
  for (const w of want) if (!list.includes(w)) bad.push(`${w} missing`)
  if (list.length !== want.length) bad.push(`expected exactly ${want.length} entries, found ${list.length}: ${list.join(', ')}`)
  if (list.some(e => e.includes('\\'))) bad.push('entry names contain a backslash')
  // Each add-on carries exactly its own jar. A cross-contaminated archive would
  // put two of these in one mods/ folder, which is the one thing they forbid.
  for (const o of CANDIDATES) {
    if (o.key !== c.key && list.some(e => e.endsWith(o.filename))) bad.push(`${o.filename} leaked in`)
  }
  if (bad.length) fail(`add-on ${c.key}`, bad)

  rmSync(stage, { recursive: true, force: true })
  built.push({ c, addon, size: statSync(addon).size, entries: list.length })
}

console.log('\naddons verified — each holds exactly its own jar + README, no backslashes')
for (const b of built) {
  const mb = b.size / 1048576
  const shown = mb < 1 ? `${(b.size / 1024).toFixed(0)} KB` : `${mb.toFixed(0)} MB`
  console.log(`✓ build/${b.c.label}.zip  (${shown})`)
  console.log(`    ${b.c.name} ${b.c.version} — name: ${b.c.naming}`)
}

console.log('\n  DROP-IN. Extract over the .minecraft of an existing profile — no reinstall.')
console.log('  Delete the jar to revert.')
console.log('')
console.log('  INSTALL EXACTLY ONE. All three hook the same frame path and Forge will')
console.log('  not stop you loading two — the rule lives in the READMEs, nowhere else.')
console.log('')
console.log('  All three are experimental and NOTHING about them has been measured here.')
console.log('  None is in the pack roster; verify still reports the same mod count.')
console.log('  Candidates A and B download a DLSS model from NVIDIA on first run — the mod')
console.log('  fetching from NVIDIA, not this pack redistributing anything. C downloads nothing.')
console.log('')
console.log('  A DOES NOT DO FRAME GENERATION (#119). Super Resolution ships only automatic')
console.log('  placeholders; the concrete DLSS-G backend is a separate mod, Wisteria, whose')
console.log('  build requires an SR version that has never been released. Verified from the')
console.log('  jar: MaterialConfigScreen gates the whole section on a non-automatic backend.')
