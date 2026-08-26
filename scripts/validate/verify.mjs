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
//   pack metadata valid          — DONE (lint), incl. a stale [index] hash
//   missing mods = 0             — DONE (lint), and every indexed file's hash
//   duplicate mods = 0           — DONE (lint)
//   missing dependencies = 0     — needs a dependency graph packwiz does not record
//   unexpected client/server     — DONE (lint), Distribution Spec §11
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
import { createHash } from 'node:crypto'
import { join, relative, sep } from 'node:path'
import { rosterDigest, parseMeta } from '../build/lib/pack.mjs'

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

// ------------------------------------------------- lint: the packwiz manifest
// Distribution Spec §15 lists ten things a build must validate. Four of them
// became possible only once a resolved pack existed, and they are these.
//
// All four read only files in the repo. Deliberately: `mods/` holds metafiles,
// not jars (.gitignore forbids committing jars), so a check that needed a jar
// could not run in a fresh clone or in CI. A gate that only works on one machine
// is not a gate.
function lintPackManifest() {
  const packPath = join(ROOT, 'pack.toml')
  const indexPath = join(ROOT, 'index.toml')
  if (!existsSync(packPath)) return 0
  const pack = readFileSync(packPath, 'utf8')

  // -- pack metadata valid ---------------------------------------------------
  for (const key of ['name', 'version', 'pack-format']) {
    if (!new RegExp(`^${key}\\s*=`, 'm').test(pack)) {
      fail('pack.toml', `missing required key '${key}' (Distribution Spec §15: pack metadata valid)`)
    }
  }

  // The index hash is the one piece of pack.toml that goes stale silently. A
  // mismatch means someone edited a pack file and did not run `packwiz refresh`,
  // and the symptom lands on a FRIEND: packwiz-installer refuses the index and
  // the install stops. It has already happened here once, when Forge rewrote a
  // config with CRLF and git stored it LF.
  if (existsSync(indexPath)) {
    const declared = pack.match(/^\s*hash\s*=\s*"([0-9a-f]+)"/m)
    const actual = createHash('sha256').update(readFileSync(indexPath)).digest('hex')
    if (declared && declared[1] !== actual) {
      fail('pack.toml', `[index] hash is stale — declared ${declared[1].slice(0, 12)}…, index.toml is ${actual.slice(0, 12)}…\n  Run: packwiz refresh`)
    }
  }

  // -- missing files = 0 -----------------------------------------------------
  // Every file the index promises must exist, and its hash must still match.
  // This is the .packwizignore class of bug caught from the other side: a file
  // the index names but the tree does not have.
  let indexed = 0
  if (existsSync(indexPath)) {
    const idx = readFileSync(indexPath, 'utf8')
    const entries = [...idx.matchAll(/\[\[files\]\]\s*\nfile\s*=\s*"([^"]+)"\s*\nhash\s*=\s*"([0-9a-f]+)"/g)]
    indexed = entries.length
    for (const [, rel, hash] of entries) {
      const abs = join(ROOT, rel)
      if (!existsSync(abs)) {
        fail('index.toml', `names a file that does not exist: ${rel} (Distribution Spec §15: missing mods = 0)`)
        continue
      }
      if (rel.startsWith('mods/')) continue   // metafile hashes are checked by packwiz itself
      const actual = createHash('sha256').update(readFileSync(abs)).digest('hex')
      if (actual !== hash) {
        fail(rel, `content no longer matches the hash in index.toml — run \`packwiz refresh\``)
      }
    }
  }

  // -- duplicate mods = 0 ----------------------------------------------------
  // Two metafiles pointing at the same project means the same mod is installed
  // twice under different filenames, which Forge reports as a duplicate mod id
  // and refuses to load.
  const seen = new Map()
  for (const f of files.filter(x => x.startsWith('mods/') && x.endsWith('.pw.toml'))) {
    const src = readFileSync(join(ROOT, f), 'utf8')
    const url = src.match(/^\s*url\s*=\s*"([^"]+)"/m)
    const proj = src.match(/^\s*(?:mod-id|project-id)\s*=\s*(\S+)/m)
    const key = url ? `url:${url[1]}` : (proj ? `proj:${proj[1]}` : null)
    if (!key) continue
    if (seen.has(key)) {
      fail(f, `duplicate of ${seen.get(key)} — both resolve to ${key} (Distribution Spec §15: duplicate mods = 0)`)
    } else {
      seen.set(key, f)
    }
  }

  // -- unexpected client/server = 0 -----------------------------------------
  // Distribution Spec §11 ends with "Do not guess." So a one-sided mod must
  // carry a written reason: `docs/side-classification.md` names it and says why.
  // A mod marked `client` that the server actually needs is not a size problem,
  // it is a server that will not start; the reason is what makes the claim
  // reviewable by someone who was not there.
  const sidePath = 'docs/side-classification.md'
  const sideDoc = existsSync(join(ROOT, sidePath)) ? readFileSync(join(ROOT, sidePath), 'utf8') : ''
  for (const f of files.filter(x => x.startsWith('mods/') && x.endsWith('.pw.toml'))) {
    const src = readFileSync(join(ROOT, f), 'utf8')
    const side = src.match(/^\s*side\s*=\s*"([a-z]+)"/m)
    if (!side) {
      fail(f, 'no `side` — packwiz-installer cannot filter a server install without it')
      continue
    }
    if (!['both', 'client', 'server'].includes(side[1])) {
      fail(f, `side = "${side[1]}" is not one of both / client / server`)
      continue
    }
    if (side[1] === 'both') continue
    const slug = f.slice('mods/'.length, -'.pw.toml'.length)
    if (!sideDoc.includes('`' + slug + '`')) {
      fail(f, `side = "${side[1]}" but \`${slug}\` is not recorded in ${sidePath}.\n  Distribution Spec §11: "inspect exact mod requirement before classify — Do not guess."\n  A one-sided mod needs a written reason someone else can check.`)
    }
  }

  return indexed
}

// -------------------------------------------------- lint: mod roster is fresh
// `docs/MODLIST.md` is the only file a downloader reads to find out what they
// just installed. If it disagrees with `mods/`, it is not merely out of date —
// it is a false statement about the contents of an artifact somebody already
// has on disk.
//
// The digest covers only what is derivable **locally**: name, filename, side,
// and which project the metafile points at. Resolved URLs are deliberately
// outside it, because this check must never need the network — a ship gate that
// fails when CurseForge is slow is a gate people learn to bypass.
function lintModlist() {
  const metafiles = files.filter(f => f.startsWith('mods/') && f.endsWith('.pw.toml'))
  if (!metafiles.length) return 0

  const listPath = 'docs/MODLIST.md'
  if (!existsSync(join(ROOT, listPath))) {
    fail(listPath, `${metafiles.length} mods are installed and nothing tells a downloader what they are.\n  Run: node scripts/build/generate-modlist.mjs`)
    return 0
  }

  const doc = readFileSync(join(ROOT, listPath), 'utf8')
  const declared = doc.match(/<!--\s*roster-digest:\s*([0-9a-f]{64})\s*-->/)
  if (!declared) {
    fail(listPath, 'no `<!-- roster-digest: … -->` marker — the file cannot be checked against mods/, so it cannot be trusted.\n  Run: node scripts/build/generate-modlist.mjs')
    return 0
  }

  // The digest covers the metafiles, deliberately not the prose — it must never
  // need the network. That left the generated *narrative* unguarded, and it
  // drifted: the file listed 107 rows under a paragraph that said 99, because
  // the generator had the number as a literal. This checks the one number the
  // prose states about itself.
  const count = doc.match(/<!--\s*mod-count:\s*(\d+)\s*-->/)
  if (!count) {
    fail(listPath, `no \`<!-- mod-count: N -->\` marker — the roster's own prose cannot be checked against mods/.
  Run: node scripts/build/generate-modlist.mjs`)
  } else if (Number(count[1]) !== metafiles.length) {
    fail(listPath, `says it covers ${count[1]} mods, but mods/ has ${metafiles.length}.
  Run: node scripts/build/generate-modlist.mjs`)
  }

  const actual = rosterDigest(metafiles.map(f => ({
    file: f, meta: parseMeta(readFileSync(join(ROOT, f), 'utf8')),
  })))
  if (declared[1] !== actual) {
    fail(listPath, `stale — it describes a different set of mods than mods/ contains.\n  declared ${declared[1].slice(0, 12)}…, mods/ is ${actual.slice(0, 12)}…\n  Run: node scripts/build/generate-modlist.mjs`)
  }
  return metafiles.length
}

// ------------------------------------------ lint: every shipped mod has a licence
// ADR 0003 made this pack self-contained, so every build redistributes every
// jar. `docs/distribution-licenses.md` is the record of what we are allowed to
// redistribute, and a mod added without a row in it is a mod nobody checked.
//
// This checks COVERAGE, not permission. Whether the pack may ship a given mod
// is a decision the audit (#53) put in front of a person, and a gate cannot
// make it. What a gate can do is refuse to let the question go unasked.
function lintLicenceCoverage() {
  const metafiles = files.filter(f => f.startsWith('mods/') && f.endsWith('.pw.toml'))
  if (!metafiles.length) return 0

  const docPath = 'docs/distribution-licenses.md'
  if (!existsSync(join(ROOT, docPath))) {
    fail(docPath, `${metafiles.length} mods are redistributed by every build and nothing records whether that is permitted (Visuals Spec §35).`)
    return 0
  }

  const doc = readFileSync(join(ROOT, docPath), 'utf8')
  for (const f of metafiles) {
    const name = parseMeta(readFileSync(join(ROOT, f), 'utf8')).name
    if (!name) continue
    // The doc escapes pipes in mod names, exactly as the roster does.
    if (!doc.includes(name.replace(/\|/g, '\\|'))) {
      fail(f, `\`${name}\` is shipped but has no row in ${docPath} — its redistribution licence has never been read.
  Add it, or record it as unread; do not assume.`)
    }
  }
  return metafiles.length
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
  counts['files in the packwiz index'] = lintPackManifest()
  counts['mods in the shipped roster'] = lintModlist()
  counts['mods with a recorded licence'] = lintLicenceCoverage()
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
