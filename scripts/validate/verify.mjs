#!/usr/bin/env node
// T4 ship gate for a Minecraft modpack repo.
//
// The upstream T4 template assumes a TS/JS app (lint · typecheck · test · build).
// This repo has no compiler and no test runner, so the gate checks what CAN
// actually break here and stay silent until someone launches the game:
//
//   lint  — JSON / TOML syntax + leftover bootstrap placeholders
//   test  — `node --check` over every KubeJS script
//
// A broken KubeJS script does not crash the pack. Create silently drops the
// whole file, and the first symptom is a recipe that no longer exists three
// sessions later. That is the failure this gate exists to catch.
//
// Run one phase at a time (CI) or both (local ship gate):
//   node scripts/validate/verify.mjs            # both
//   node scripts/validate/verify.mjs lint
//   node scripts/validate/verify.mjs test
//
// ---------------------------------------------------------------------------
// This is the seed of `validate-pack` (Distribution Spec §14). Its §15 lists the
// minimum a build must validate; three of those are implemented here and the
// rest are blocked on a resolved pack, not on effort:
//
//   pack metadata valid          — needs pack.toml
//   missing mods = 0             — needs packwiz index
//   duplicate mods = 0           — needs packwiz index
//   missing dependencies = 0     — needs packwiz index
//   unexpected client/server     — needs packwiz side metadata
//   KubeJS startup errors = 0    — needs a launched instance; not automatable here
//   broken config references = 0 — needs the mod set to exist
//   JSON / TOML syntax           — DONE (lint)
//   unfilled placeholders        — DONE (lint), local addition
//   JEI orphaned recipes        — DONE (lint), Crafting Spec §6
//   KubeJS parses                — DONE (test)
//
// Add each check in the change that makes it possible, not before: a check that
// cannot fail is a check nobody trusts. What this script does NOT and cannot do
// is tell you the pack runs — that is the release gate (Distribution Spec §16),
// twelve in-game tests, none of them automatable.
// ---------------------------------------------------------------------------

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SKIP_DIRS = new Set(['.git', 'node_modules', '.gradle', 'run', 'logs', 'crash-reports'])

/** Files that are allowed to contain `<PLACEHOLDER>`-shaped text: they are
 *  upstream templates or documentation quoting the template, not our own docs. */
const PLACEHOLDER_EXEMPT = [
  '.claude/hooks/using-t4.snapshot.md',
  'scripts/validate/verify.mjs',
]

const failures = []
const fail = (file, msg) => failures.push(`${file}: ${msg}`)

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(relative(ROOT, full).split(sep).join('/'))
  }
  return out
}

const files = walk(ROOT)

// ---------------------------------------------------------------- lint: JSON
function lintJson() {
  const targets = files.filter(f => f.endsWith('.json') && !f.endsWith('.jsonc'))
  for (const f of targets) {
    try {
      JSON.parse(readFileSync(join(ROOT, f), 'utf8'))
    } catch (e) {
      fail(f, `invalid JSON — ${e.message}`)
    }
  }
  return targets.length
}

// ---------------------------------------------------------------- lint: TOML
// Deliberately conservative: it flags structure that is unambiguously broken
// (an unclosed multi-line construct, a bare line that is neither a table header
// nor a key/value pair) and nothing else. A gate with false positives is a gate
// people learn to merge past.
function lintToml() {
  const targets = files.filter(f => f.endsWith('.toml'))
  for (const f of targets) {
    const lines = readFileSync(join(ROOT, f), 'utf8').split(/\r?\n/)
    let depth = 0          // open [ or { across lines
    let inTriple = false
    let openedAt = 0
    lines.forEach((raw, i) => {
      const n = i + 1
      let line = raw
      if ((line.match(/"""/g) || []).length % 2 === 1) inTriple = !inTriple
      if (inTriple) return
      const stripped = line.replace(/#.*$/, '').trim()
      if (!stripped) return
      if (depth === 0) {
        const isTable = /^\[\[?[^\]]+\]\]?$/.test(stripped)
        const isPair = /^("[^"]*"|'[^']*'|[A-Za-z0-9_.-]+)\s*=/.test(stripped)
        if (!isTable && !isPair) {
          fail(f, `line ${n}: not a table header or key = value — ${JSON.stringify(raw.trim())}`)
          return
        }
      }
      const before = depth
      for (const ch of stripped) {
        if (ch === '[' || ch === '{') depth++
        else if (ch === ']' || ch === '}') depth--
      }
      if (/^\[\[?[^\]]+\]\]?$/.test(stripped)) depth = 0   // table header brackets are balanced by definition
      if (depth < 0) { fail(f, `line ${n}: unbalanced closing bracket`); depth = 0 }
      if (before === 0 && depth > 0) openedAt = n
    })
    if (inTriple) fail(f, 'unterminated multi-line string (""")')
    if (depth > 0) fail(f, `unterminated [ or { opened at line ${openedAt}`)
  }
  return targets.length
}

// -------------------------------------------------------- lint: placeholders
function lintPlaceholders() {
  const pattern = /<(PLACEHOLDER|ORG|REPO|DIST_DIR|DEPLOY_COMMAND|PRODUCTION_URL|HEALTHCHECK_URL|E2E_OR_VERIFY_COMMAND|FRONTEND_OR_RELEVANT|AREA_1|AREA_2|USER)>/
  const targets = files.filter(f =>
    (f.endsWith('.md') || f.endsWith('.yml') || f.endsWith('.yaml') || f.endsWith('.json') || f.startsWith('.githooks/') || f.startsWith('scripts/')) &&
    !PLACEHOLDER_EXEMPT.includes(f))
  for (const f of targets) {
    readFileSync(join(ROOT, f), 'utf8').split(/\r?\n/).forEach((line, i) => {
      const m = line.match(pattern)
      if (m) fail(f, `line ${i + 1}: unfilled bootstrap placeholder ${m[0]}`)
    })
  }
  return targets.length
}

// ----------------------------------------------- lint: JEI orphaned recipes
// Crafting Spec §6 forbids one exact piece of UX:
//     JEI shows item -> player clicks recipe -> no valid recipe
// and the customization map records the standing obligation as "must stay in
// sync with every mod removal". Staying in sync is not something a person
// remembers three sessions later, so it is checked here.
//
// The rule: a recipe id removed in kubejs/server_scripts/ must be either
// re-added in the same file, or named in kubejs/client_scripts/jei_hide.js.
//
// Only LITERAL ids are checked. A removal built from a variable
// (`event.remove({ id: id })` inside a loop) cannot be resolved statically, so
// those files are checked structurally instead: a file that removes recipes
// must also add some.
function lintJeiOrphans() {
  const scripts = files.filter(f => f.startsWith('kubejs/server_scripts/') && f.endsWith('.js'))
  const hidePath = 'kubejs/client_scripts/jei_hide.js'
  const hideList = existsSync(join(ROOT, hidePath)) ? readFileSync(join(ROOT, hidePath), 'utf8') : ''

  const ADDS = /event\.(custom|shaped|shapeless|smelting|blasting|smoking|campfireCooking|stonecutting|recipes)\s*\(/

  for (const f of scripts) {
    const src = readFileSync(join(ROOT, f), 'utf8')
    if (!/event\.remove\s*\(/.test(src)) continue

    if (!ADDS.test(src)) {
      fail(f, 'removes recipes but adds none — every item it orphans will show in JEI with no recipe (Crafting Spec §6). Re-add them, or hide the items in ' + hidePath)
    }

    // Literal ids: `event.remove({ id: 'namespace:path' })`
    const literals = [...src.matchAll(/event\.remove\s*\(\s*\{[^}]*id\s*:\s*['"]([^'"]+)['"]/g)].map(m => m[1])
    for (const id of new Set(literals)) {
      const reAdded = src.includes(`.id('${id}')`) || src.includes(`.id("${id}")`)
      if (!reAdded && !hideList.includes(id)) {
        fail(f, `removes recipe '${id}' and never re-adds it, and it is not named in ${hidePath} — JEI will show the item with no recipe (Crafting Spec §6)`)
      }
    }
  }
  return scripts.length
}

// ------------------------------------------------------- test: KubeJS syntax
function testKubejs() {
  const targets = files.filter(f => f.startsWith('kubejs/') && f.endsWith('.js'))
  for (const f of targets) {
    try {
      execFileSync(process.execPath, ['--check', join(ROOT, f)], { stdio: 'pipe' })
    } catch (e) {
      const out = (e.stderr?.toString() || e.message).trim().split('\n').slice(0, 4).join('\n  ')
      fail(f, `KubeJS script has a syntax error — Create will drop this file silently\n  ${out}`)
    }
  }
  return targets.length
}

// ------------------------------------------------------------------- runner
const phase = process.argv[2] ?? 'all'
const counts = {}

if (phase === 'all' || phase === 'lint') {
  counts['JSON files'] = lintJson()
  counts['TOML files'] = lintToml()
  counts['files scanned for placeholders'] = lintPlaceholders()
  counts['KubeJS scripts scanned for orphaned recipes'] = lintJeiOrphans()
}
if (phase === 'all' || phase === 'test') {
  counts['KubeJS scripts'] = testKubejs()
  if (!existsSync(join(ROOT, 'kubejs'))) {
    console.log('note: no kubejs/ directory yet — nothing to syntax-check')
  }
}

for (const [what, n] of Object.entries(counts)) console.log(`checked ${n} ${what}`)

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n`)
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}
console.log(`\n✓ ${phase === 'all' ? 'verify' : phase} passed`)
