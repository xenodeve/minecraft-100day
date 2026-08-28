#!/usr/bin/env node
// Stamp a benchmark run's metadata.json with the three fields that are wrong
// most often when they are typed by hand.
//
// PERF-HARNESS-IDENTITY says a run missing any identity field is not comparable
// and should be marked invalid. Three of those fields — the commit, the pack
// version and the MODLIST roster digest — are already known to this repository,
// and a human copying them is a human who will eventually copy the wrong one.
// Everything the repo cannot know (coordinates, GPU, the numbers) is emitted as
// an empty string, so the gaps are visible rather than plausible.
//
// PERF-HARNESS-VARIANTS: every result must point to a commit. This refuses to
// stamp a dirty tree, because a commit hash does not describe a working
// directory that has been edited since.
//
// GPU PRECONDITION. C-UPFG-07 was a client that bound to the wrong GPU for
// weeks, and PERF-HARNESS-IDENTITY only *records* the GPU — which catches it
// after the run rather than before. Pass --log <path> to read the actual
// `OpenGL Renderer:` line out of latest.log and have it refuse a run on a card
// that is not the expected one.
//
//   node scripts/build/new-benchmark-run.mjs --zone A --variant baseline \
//     --log "<instance>/logs/latest.log" --expect-gpu "RTX 4070 SUPER"
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { readPack } from './lib/pack.mjs'

const ROOT = process.cwd()
const argv = process.argv.slice(2)
const arg = (name, fallback = '') => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}

const zone = arg('zone')
const variant = arg('variant')
const date = arg('date')          // the repo cannot know "today" reproducibly
if (!zone || !variant || !date) {
  console.error('usage: --zone <A-H> --variant <name> --date <YYYY-MM-DD>')
  console.error('       [--log <latest.log>] [--expect-gpu <substring>] [--notes <text>]')
  console.error('')
  console.error('--date is required rather than defaulted: a run stamped with the')
  console.error('machine clock is a run nobody can reproduce from the repository.')
  process.exit(1)
}

// -- the tree must be clean, or the commit does not describe it ---------------
const dirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()
if (dirty && !argv.includes('--allow-dirty')) {
  console.error('The working tree is dirty, so the commit hash would not describe what ran:')
  console.error(dirty.split('\n').slice(0, 10).map(l => `  ${l}`).join('\n'))
  console.error('\nCommit first. PERF-HARNESS-VARIANTS: every result points to a commit.')
  console.error('(--allow-dirty exists for a dry run and marks the record invalid.)')
  process.exit(1)
}

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const pack = readPack(ROOT)

// -- the roster digest, read from the generated MODLIST -----------------------
const modlistPath = join(ROOT, 'docs', 'MODLIST.md')
let modlistDigest = '', modCount = ''
if (existsSync(modlistPath)) {
  const head = readFileSync(modlistPath, 'utf8').slice(0, 400)
  modlistDigest = (head.match(/roster-digest:\s*([0-9a-f]+)/) || [, ''])[1]
  modCount = (head.match(/mod-count:\s*(\d+)/) || [, ''])[1]
}
if (!modlistDigest) {
  console.error('docs/MODLIST.md has no roster-digest — run generate-modlist.mjs first.')
  process.exit(1)
}

// -- GPU precondition, if a log was given -------------------------------------
let gpu = ''
const logPath = arg('log')
const expectGpu = arg('expect-gpu')
if (logPath) {
  if (!existsSync(logPath)) {
    console.error(`--log points at a file that does not exist: ${logPath}`)
    process.exit(1)
  }
  const line = readFileSync(logPath, 'utf8').split(/\r?\n/).find(l => l.includes('OpenGL Renderer:'))
  if (!line) {
    console.error('That log has no `OpenGL Renderer:` line — it is not a client log, or the run never got that far.')
    process.exit(1)
  }
  gpu = line.split('OpenGL Renderer:')[1].trim()
  console.log(`OpenGL Renderer: ${gpu}`)
  if (expectGpu && !gpu.includes(expectGpu)) {
    console.error(`\nWRONG GPU. Expected a renderer containing "${expectGpu}".`)
    console.error('C-UPFG-07 was exactly this: the client bound to the wrong card and every')
    console.error('number taken in that state was measured on hardware nobody meant to test.')
    process.exit(1)
  }
}

const meta = {
  date, commit, packVersion: pack.version, modlistDigest, modCount: Number(modCount) || null,
  zone, variant,
  seed: '', coordinates: '', yaw: 0, pitch: 0,
  renderDistance: 0, simulationDistance: 0,
  resolution: '', shader: 'OFF', shaderPreset: '', vsync: false, fpsCap: 'unlimited',
  ramMb: 0, java: '', javaArgs: '',
  cpu: '', gpu, driver: '', os: '',
  notes: arg('notes'),
}

const dir = join(ROOT, 'benchmarks', 'captures', date, commit.slice(0, 12), `zone-${zone.toLowerCase()}`, variant)
mkdirSync(dir, { recursive: true })
const out = join(dir, 'metadata.json')
if (existsSync(out) && !argv.includes('--force')) {
  console.error(`${out} already exists. Pass --force to overwrite.`)
  process.exit(1)
}
writeFileSync(out, JSON.stringify(meta, null, 2) + '\n')

const blank = Object.entries(meta).filter(([, v]) => v === '' || v === 0).map(([k]) => k)
console.log(`\n✓ ${out.replace(ROOT, '.')}`)
console.log(`  commit ${commit.slice(0, 12)} · ${pack.version} · roster ${modlistDigest.slice(0, 12)}… (${modCount} mods)`)
console.log(`\n  ${blank.length} field(s) still empty and the run is NOT comparable until they are filled:`)
console.log(`  ${blank.join(', ')}`)
