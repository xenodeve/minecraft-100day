#!/usr/bin/env node
// Distribution Spec §38 — config drift detection.
//
//   node scripts/validate/config-drift.mjs <path-to-instance-or-server>
//
// §38 names the case it exists for:
//
//     Friend A works
//     Friend B behaves differently
//     Check whether pack-controlled configs differ
//
// So: point it at a friend's `.minecraft` folder or a server directory, and it
// reports every pack-controlled config value that no longer matches the pack.
//
// ---------------------------------------------------------------------------
// WHY THIS COMPARES VALUES AND NOT HASHES
//
// The obvious tool diffs each file against the hash in index.toml. That tool
// would be wrong on every install, because Forge REWRITES every .toml config on
// first launch — it parses the file against the mod's ForgeConfigSpec, corrects
// it, and writes it back with comments stripped and formatting normalised.
//
// Measured on a server that had booted exactly once (docs/config-ownership.md):
//
//     config/improvedmobs/common.toml    a8364ac6a95a -> 4a45e508e6e6   drifted
//     config/carryon-common.toml         9549d1d5bbf5 -> 0cf664da7703   drifted
//     config/hordes-common.toml          b4ed64668c93 -> 1bcf977ee291   drifted
//     config/soundattract/guns.toml      8a7a6ae2a763 -> f0ff2c2bff25   drifted
//     config/naturalist.json             883bfe335f55 -> 883bfe335f55   same
//     config/incontrol/spawn.json        852e9a7e1ebc -> 852e9a7e1ebc   same
//
// 4 of 4 TOML drifted; 2 of 2 JSON did not. And in every TOML case the VALUES
// were identical — only comments and formatting moved.
//
// A hash check would therefore flag 100% of the .toml files this tool most
// needs to watch, on a completely healthy install. That is the gate people
// learn to ignore, and a gate people ignore is worse than no gate.
// ---------------------------------------------------------------------------

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const target = process.argv[2]

if (!target) {
  console.error('usage: node scripts/validate/config-drift.mjs <path-to-instance-or-server>')
  console.error('')
  console.error('  A client instance:  .../instances/ICS/.minecraft')
  console.error('  A server:           .../my-server')
  console.error('')
  console.error('Reports pack-controlled config VALUES that no longer match the pack.')
  process.exit(2)
}
if (!existsSync(target)) {
  console.error(`${target} does not exist`)
  process.exit(2)
}

// ------------------------------------------------------- what the pack owns
// docs/config-ownership.md: the pack owns exactly the files it ships, and that
// is not a convention to remember — it is the set packwiz-installer writes.
// Reading the tree here rather than a hand-maintained list means the two cannot
// drift apart, which would be an ironic way for this tool to fail.
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(relative(ROOT, full).split(sep).join('/'))
  }
  return out
}
const owned = [...walk(join(ROOT, 'config')), ...walk(join(ROOT, 'defaultconfigs'))]
  .filter(f => !f.toLowerCase().endsWith('.md'))

// --------------------------------------------------------------- comparison
/**
 * Flatten a config to `path = value` pairs.
 *
 * TOML is handled line-wise rather than with a parser: these files are flat
 * key/value under `[table]` headers, a real parser is not worth a dependency,
 * and a line-wise read cannot silently mis-model a construct it does not
 * understand — it just reports the line.
 */
function pairsOfToml(text) {
  const out = new Map()
  let table = ''
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^\s+/, '')
    if (!line || line.startsWith('#')) continue
    const t = line.match(/^\[\[?([^\]]+)\]\]?\s*$/)
    if (t) { table = t[1]; continue }
    const kv = line.match(/^("[^"]*"|'[^']*'|[A-Za-z0-9_.-]+)\s*=\s*(.*)$/)
    if (!kv) continue
    const key = kv[1].replace(/^["']|["']$/g, '')
    out.set(table ? `${table}.${key}` : key, kv[2].trim())
  }
  return out
}

function pairsOfJson(text) {
  const out = new Map()
  const walkVal = (v, path) => {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      for (const k of Object.keys(v)) walkVal(v[k], path ? `${path}.${k}` : k)
    } else {
      out.set(path, JSON.stringify(v))
    }
  }
  walkVal(JSON.parse(text), '')
  return out
}

/**
 * Everything else — .snbt, pack.mcmeta, anything new — is compared line by line.
 *
 * NOT as one opaque blob: the first version of this dumped the whole file as a
 * single "value", so a one-character edit to a quest chapter printed 1,500
 * characters of SNBT and located nothing. A line index is the smallest unit
 * that still tells the reader where to look.
 */
function pairsOfOpaque(text) {
  const out = new Map()
  text.replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
    if (line.trim()) out.set(`line ${i + 1}`, line.trim())
  })
  return out
}

const findings = []
let compared = 0, missing = 0, skipped = 0

for (const rel of owned) {
  const mine = join(ROOT, rel)
  // A server has no `.minecraft`; a client instance does. Accept either shape.
  const theirs = [join(target, rel), join(target, '.minecraft', rel)].find(existsSync)

  if (!theirs) {
    missing++
    findings.push({ rel, kind: 'missing', detail: 'the pack ships this file and the install does not have it' })
    continue
  }

  const a = readFileSync(mine, 'utf8')
  const b = readFileSync(theirs, 'utf8')

  let pa, pb
  try {
    if (rel.endsWith('.toml')) { pa = pairsOfToml(a); pb = pairsOfToml(b) }
    else if (rel.endsWith('.json')) { pa = pairsOfJson(a); pb = pairsOfJson(b) }
    else { pa = pairsOfOpaque(a); pb = pairsOfOpaque(b) }
  } catch (e) {
    skipped++
    findings.push({ rel, kind: 'unreadable', detail: e.message })
    continue
  }
  compared++

  for (const [k, v] of pa) {
    if (!pb.has(k)) findings.push({ rel, kind: 'removed', key: k, want: v })
    else if (pb.get(k) !== v) findings.push({ rel, kind: 'changed', key: k, want: v, got: pb.get(k) })
  }
  for (const k of pb.keys()) {
    if (!pa.has(k)) findings.push({ rel, kind: 'added', key: k, got: pb.get(k) })
  }
}

// ------------------------------------------------------------------- report
console.log(`config drift — ${owned.length} pack-controlled files`)
console.log(`  compared ${compared} · missing ${missing} · unreadable ${skipped}`)
console.log(`  against ${target}\n`)

if (!findings.length) {
  console.log('✓ no drift — every pack-controlled value matches the pack.')
  console.log('  Comments and formatting are ignored on purpose: Forge rewrites every .toml')
  console.log('  on first launch, so a byte comparison would report drift on a healthy install.')
  process.exit(0)
}

/** A config value can be a 60-entry list; the report is for reading, not archiving. */
const clip = (v) => (v.length > 100 ? v.slice(0, 100) + ` … (${v.length} chars)` : v)

const byFile = new Map()
for (const f of findings) {
  if (!byFile.has(f.rel)) byFile.set(f.rel, [])
  byFile.get(f.rel).push(f)
}

for (const [rel, list] of byFile) {
  console.log(`  ${rel}`)
  for (const f of list.slice(0, 12)) {
    if (f.kind === 'missing') console.log(`    ✗ MISSING — ${f.detail}`)
    else if (f.kind === 'unreadable') console.log(`    ? unreadable — ${f.detail}`)
    else if (f.kind === 'changed') console.log(`    ✗ ${f.key}\n        pack: ${clip(f.want)}\n        them: ${clip(f.got)}`)
    else if (f.kind === 'removed') console.log(`    ✗ ${f.key} — deleted locally (pack: ${clip(f.want)})`)
    else if (f.kind === 'added') console.log(`    + ${f.key} = ${clip(f.got)} — not in the pack`)
  }
  if (list.length > 12) console.log(`    … and ${list.length - 12} more in this file`)
  console.log()
}

console.log(`${findings.length} difference(s) in ${byFile.size} file(s).`)
console.log('')
console.log('An `added` key is usually harmless — a mod update introducing a new setting.')
console.log('A `changed` or `removed` one on a PACK CONTROLLED file means this install is')
console.log('not running the pack as designed, which is Distribution Spec §38\'s exact case:')
console.log('friend A works, friend B behaves differently.')
process.exit(1)
