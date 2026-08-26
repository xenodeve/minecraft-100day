#!/usr/bin/env node
// Generates `docs/MODLIST.md` — the roster a downloader reads to find out what
// they just installed, and the only place this repo credits the authors whose
// work the pack ships.
//
// Generated rather than written by hand, for the same reason `SHA256SUMS.txt` is:
// a hand-maintained list of a hundred-odd rows is wrong the first time a version bumps, and
// nothing would catch it. `verify.mjs` refuses a roster that disagrees with
// `mods/`.
//
// ---------------------------------------------------------------------------
// The one rule this script exists to enforce: NEVER COMPOSE A SOURCE URL FROM A
// GUESSED SLUG.
//
// packwiz metafiles store project *ids*, not slugs, and this repo has been
// burned by guessing the difference twice:
//
//   - `smoothplayeranimations` vs `smooth-player-animations`  (compatibility matrix)
//   - `create-industry`, which on Modrinth is a MODPACK, not TFMG  (ADR 0004)
//
// Both hosts redirect an id-only URL to the canonical page, so this script
// follows the id once and records where it *landed*. Every slug in the output is
// therefore measured. When a lookup fails the id URL is emitted instead — it
// still works in a browser — and the failure is counted in the output rather
// than papered over.
// ---------------------------------------------------------------------------

import { writeFileSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { readPack, readMetas, rosterDigest, parseMeta } from './lib/pack.mjs'

const ROOT = process.cwd()
const OUT = join(ROOT, 'docs', 'MODLIST.md')

/** Project-page URLs built from ids alone. Neither contains a slug. */
const idUrl = (m) =>
  m.modId ? `https://modrinth.com/mod/${m.modId}`
    : m.projectId ? `https://www.curseforge.com/projects/${m.projectId}`
      : null

const hostOf = (m) => (m.modId ? 'Modrinth' : m.projectId ? 'CurseForge' : '—')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) minecraft-100day-modlist'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

/** Every lookup is bounded. `fetch` has no default timeout, so one stalled
 *  connection parks a worker for as long as the OS will hold the socket open —
 *  which is how a 40-second job became a ten-minute one the first time
 *  CurseForge decided to stop answering rather than refuse. */
const get = (url) => fetch(url, {
  redirect: 'follow',
  headers: { 'User-Agent': UA },
  signal: AbortSignal.timeout(12_000),
})

/** Modrinth publishes the slug as a field. Reading it is still resolution, not
 *  guessing — the slug arrives as data from the id, and the API is documented
 *  and rate-limited generously, unlike the Cloudflare-fronted website. */
async function resolveModrinth(m) {
  const api = `https://api.modrinth.com/v2/project/${m.modId}`
  const r = await get(api)
  if (!r.ok) return { url: idUrl(m), resolved: false, why: `HTTP ${r.status} from the Modrinth API` }
  const p = await r.json()
  if (!p.slug) return { url: idUrl(m), resolved: false, why: 'the API returned no slug' }
  // The path segment comes from `project_type`, not a hardcoded `/mod/`:
  // `create-industry` on Modrinth is a MODPACK, and that exact confusion is why
  // this script resolves instead of composing (ADR 0004). If a metafile ever
  // points at a non-mod project, the URL says so rather than 404ing.
  return { url: `https://modrinth.com/${p.project_type ?? 'mod'}/${p.slug}`, resolved: true }
}

/** CurseForge has no public API without a key, so the id URL's own redirect is
 *  the only handle. It is Cloudflare-fronted and will 403/429 under load.
 *
 *  Retrying with backoff is right for a *transient* block and wrong for a
 *  sustained one: when Cloudflare has decided about this IP, four attempts per
 *  mod turns a 40-second job into a ten-minute one and still resolves nothing.
 *  So the first few failures are retried, and once enough have failed in a row
 *  the opener is treated as shut — the rest fall back immediately and the doc
 *  says so. Giving up quickly is the honest read of a systemic block. */
let cfConsecutiveBlocks = 0
const CF_GIVE_UP_AFTER = 5

async function resolveCurseForge(m) {
  const url = idUrl(m)
  if (cfConsecutiveBlocks >= CF_GIVE_UP_AFTER) {
    return { url, resolved: false, why: 'skipped — CurseForge is blocking this address' }
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await sleep(600 * 2 ** attempt)
    let r
    try {
      r = await get(url)
    } catch (e) {
      // A timeout is a block by another name here — count it as one, so the
      // circuit breaker below can still trip instead of retrying forever.
      if (attempt === 2) { cfConsecutiveBlocks++; return { url, resolved: false, why: `no answer: ${e.message}` } }
      continue
    }
    if (r.ok) { cfConsecutiveBlocks = 0; return { url: r.url || url, resolved: true } }
    if (r.status !== 403 && r.status !== 429) {
      cfConsecutiveBlocks = 0
      return { url, resolved: false, why: `HTTP ${r.status}` }
    }
  }
  cfConsecutiveBlocks++
  return { url, resolved: false, why: 'HTTP 403/429 after 3 attempts — rate-limited' }
}

async function resolveOne(m) {
  if (!idUrl(m)) return { url: null, resolved: false, why: 'metafile carries neither a Modrinth nor a CurseForge id' }
  try {
    return m.modId ? await resolveModrinth(m) : await resolveCurseForge(m)
  } catch (e) {
    return { url: idUrl(m), resolved: false, why: e.message }
  }
}

/** Two pools, because the two hosts tolerate wildly different rates: Modrinth's
 *  API is fine in parallel, CurseForge's website is not. Running them as one
 *  queue would pace the whole job at CurseForge's speed for no reason. */
async function resolveAll(metas) {
  const out = new Array(metas.length)
  let done = 0
  const pool = async (idxs, width) => {
    let next = 0
    const worker = async () => {
      while (next < idxs.length) {
        const i = idxs[next++]
        out[i] = await resolveOne(metas[i])
        process.stdout.write(`\r  resolving ${++done}/${metas.length}   `)
      }
    }
    await Promise.all(Array.from({ length: Math.min(width, idxs.length) }, worker))
  }
  const idx = (pred) => metas.map((m, i) => [m, i]).filter(([m]) => pred(m)).map(([, i]) => i)
  await Promise.all([
    pool(idx(m => m.modId), 8),
    pool(idx(m => !m.modId), 2),
  ])
  process.stdout.write('\r')
  return out
}

/** Previously-resolved URLs, read back out of the file we are about to replace.
 *
 *  Without this, regeneration is not monotonic: run the script on a day when
 *  CurseForge is blocking and 12 rows that had real links get downgraded to id
 *  URLs. A generator whose output gets worse when the network is bad is one
 *  people stop running. A resolved URL is a fact that does not expire, so a
 *  fresh failure falls back to the last good answer before it falls back to the
 *  id.
 *
 *  Keyed by the metafile's `filename`, which is the one field that changes
 *  whenever the project does. */
function previouslyResolved() {
  const map = new Map()
  try {
    const old = readFileSync(OUT, 'utf8')
    for (const line of old.split('\n')) {
      const m = line.match(/^\|[^|]*\|\s*`([^`]+)`\s*\|\s*\[[^\]]*\]\(([^)]+)\)/)
      if (!m) continue
      const [, filename, url] = m
      if (!/\/(projects|project)\/\d+$/.test(url)) map.set(filename, url)
    }
  } catch { /* no previous file — first run */ }
  return map
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|')

function table(rows) {
  return [
    '| Mod · มอด | File · ไฟล์ | Source · ต้นทาง |',
    '|---|---|---|',
    ...rows.map(({ m, r }) => {
      const src = r.url ? `[${hostOf(m)}](${r.url})` : hostOf(m)
      return `| ${esc(m.name)} | \`${esc(m.filename)}\` | ${src} |`
    }),
  ].join('\n')
}

// ------------------------------------------------------------------- run
const pack = readPack(ROOT)
const metas = readMetas(ROOT).sort((a, b) =>
  (a.name ?? '').localeCompare(b.name ?? '', 'en', { sensitivity: 'base' }))

console.log(`${pack.name} ${pack.version} — ${metas.length} mods`)
const cached = previouslyResolved()
const results = await resolveAll(metas)

let reused = 0
const rows = metas.map((m, i) => {
  let r = results[i]
  if (!r.resolved && cached.has(m.filename)) {
    r = { url: cached.get(m.filename), resolved: true, fromCache: true }
    reused++
  }
  return { m, r }
})
const unresolved = rows.filter(({ r }) => !r.resolved)
const bySide = (s) => rows.filter(({ m }) => m.side === s)
const both = bySide('both'), client = bySide('client'), server = bySide('server')

for (const { m, r } of unresolved) console.log(`  ! ${m.name}: ${r.why} — falling back to the id URL`)
console.log(`  resolved ${rows.length - unresolved.length}/${rows.length} source URLs` +
  (reused ? ` (${reused} kept from the previous roster — this run could not reach the host)` : ''))

const digest = rosterDigest(
  readdirSync(join(ROOT, 'mods'))
    .filter(f => f.endsWith('.pw.toml'))
    .map(f => ({ file: `mods/${f}`, meta: parseMeta(readFileSync(join(ROOT, 'mods', f), 'utf8')) })))

const doc = `<!-- roster-digest: ${digest} -->
<!-- mod-count: ${metas.length} -->
<!-- GENERATED FILE — do not edit by hand.
     Run: node scripts/build/generate-modlist.mjs
     \`verify\` refuses a roster that disagrees with mods/. -->

# What is in this pack · ในแพ็กนี้มีอะไรบ้าง

**${pack.name} ${pack.version}** — **${metas.length} mods** on Minecraft \`${pack.mc}\`,
Forge \`${pack.forge}\`.

Every mod here is somebody else's work. This file exists so you can see whose, and go and find
the original.

**Where you will find this file.** It ships at the top of the client instance zip and at the top of
the server zip. The CurseForge-format zip instead carries packwiz's own \`modlist.html\`, which lists
${both.length + client.length} names — the client-side set — with no versions, sides or links. This
file is the complete one.

**ไฟล์นี้อยู่ตรงไหน** มันอยู่บนสุดของ zip ตัว client instance และบนสุดของ zip ตัว server
ส่วน zip รูปแบบ CurseForge จะมี \`modlist.html\` ของ packwiz เองแทน ซึ่งลงชื่อไว้ ${both.length + client.length} ชื่อ —
ชุดฝั่ง client — โดยไม่มีเวอร์ชัน ไม่มี side ไม่มีลิงก์ ไฟล์นี้คือตัวที่ครบ

## Reading the table

**The File column is the exact jar filename**, not a tidied-up version number. That is deliberate:
${metas.length} mods use ${metas.length} filename conventions, and parsing a version out of them would mean
guessing. The
filename is what is actually on your disk, so it is also what you can match against your \`mods/\`
folder when something goes wrong.

**Source links are resolved, not guessed.** packwiz records a project *id*, never a slug, so this
script follows the id to whatever page it lands on and links that. It never assembles a URL out of a
mod's name — twice now, a guessed slug in this repo has pointed at the wrong project entirely, once
at a modpack rather than the mod.

**Client / Server** tells you where a mod runs. If you are hosting a server, you need the
${both.length} in *Both* and the ${server.length} in *Server only*; the ${client.length} client-only
mods are not installed on a server and are not missing when they are absent.

## อ่านตารางยังไง

**คอลัมน์ File คือชื่อไฟล์ jar จริง ๆ** ไม่ใช่เลขเวอร์ชันที่จัดให้สวย ตั้งใจให้เป็นแบบนั้น เพราะมอด ${metas.length} ตัว
ใช้รูปแบบการตั้งชื่อไฟล์ ${metas.length} แบบ การพยายามแกะเวอร์ชันออกมาคือการเดา ชื่อไฟล์คือสิ่งที่อยู่บนเครื่องคุณจริง ๆ
ดังนั้นมันจึงเป็นสิ่งที่คุณเอาไปเทียบกับโฟลเดอร์ \`mods/\` ได้ตอนมีอะไรผิดพลาด

**ลิงก์ต้นทาง resolve มา ไม่ได้เดา** packwiz บันทึก project *id* ไว้ ไม่เคยบันทึก slug
สคริปต์นี้จึงตาม id ไปจนถึงหน้าที่มันไปจบแล้วลิงก์หน้านั้น มันไม่ประกอบ URL ขึ้นจากชื่อมอดเด็ดขาด —
สอง​ครั้งแล้วที่ slug ที่เดาใน repo นี้ชี้ไปผิดโปรเจกต์ ครั้งหนึ่งชี้ไปที่ modpack แทนที่จะเป็นตัวมอด

**Client / Server** บอกว่ามอดตัวนั้นทำงานฝั่งไหน ถ้าคุณจะเปิด server คุณต้องใช้ ${both.length} ตัวใน *Both*
กับ ${server.length} ตัวใน *Server only* ส่วนมอดฝั่ง client ${client.length} ตัวจะไม่ถูกติดตั้งบน server
และการที่มันไม่อยู่ตรงนั้นไม่ใช่ของหาย

> **หมายเหตุ** ตารางด้านล่างมีชุดเดียว ไม่ได้ทำสองภาษา เพราะเนื้อในเป็นชื่อมอด ชื่อไฟล์ และ URL ซึ่งเป็น
> ภาษาอังกฤษอยู่แล้วทั้งหมด หัวตารางเป็นสองภาษา

---

## Both — client and server · ทั้งสองฝั่ง (${both.length})

${table(both)}

## Client only · เฉพาะฝั่ง client (${client.length})

Not installed on a server. \`docs/side-classification.md\` records the evidence for each call.

ไม่ถูกติดตั้งบน server \`docs/side-classification.md\` บันทึกหลักฐานของการตัดสินแต่ละตัวไว้

${table(client)}

## Server only · เฉพาะฝั่ง server (${server.length})

${table(server)}

---

## What this file does not tell you · สิ่งที่ไฟล์นี้ไม่ได้บอก

**Licences.** Knowing where a mod came from is not the same as knowing what you may do with it.
Check each project page before redistributing anything.

**Dependencies between these mods.** packwiz records what is installed, not why. A mod in this list
may be here only because another one requires it.

**Which mods this pack modifies.** Recipes, spawn rules and balance are changed by this pack's own
configs and scripts, not by the mod authors. \`docs/customization-map.md\` is that list.

**สัญญาอนุญาต** การรู้ว่ามอดมาจากไหนไม่เท่ากับการรู้ว่าคุณทำอะไรกับมันได้บ้าง
ตรวจหน้าโปรเจกต์ของแต่ละตัวก่อนแจกจ่ายต่อ

**ความสัมพันธ์ระหว่างมอดในนี้** packwiz บันทึกว่าอะไรถูกติดตั้ง ไม่ได้บันทึกว่าทำไม
มอดบางตัวในรายชื่อนี้อาจอยู่ที่นี่เพราะมอดอีกตัวต้องการมันเท่านั้น

**มอดตัวไหนที่แพ็กนี้ไปแก้บ้าง** สูตรคราฟต์ กฎการเกิดของมอนสเตอร์ และสมดุลถูกเปลี่ยนโดย config
และสคริปต์ของแพ็กนี้เอง ไม่ใช่โดยผู้เขียนมอด \`docs/customization-map.md\` คือรายชื่อนั้น
`

writeFileSync(OUT, doc)
console.log(`\n✓ docs/MODLIST.md  (${metas.length} mods — ${both.length} both · ${client.length} client · ${server.length} server)`)
if (unresolved.length) {
  console.log(`  ${unresolved.length} source URL(s) unresolved — the id URL is in the file and still works in a browser`)
}
