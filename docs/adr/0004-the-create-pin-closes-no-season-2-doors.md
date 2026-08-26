# ADR 0004 — The Create 6.0.8 pin closes no Season 2 doors

- **Status:** Accepted
- **Date:** 2026-08-25
- **Supersedes:** —
- **Related:** ADR 0003 (self-contained distribution), `docs/compatibility-matrix.md` (the Create pin
  derivation), issue #44

## Context

Create is pinned to **`6.0.8`**, and that pin was *forced* rather than chosen: the CORE addons'
declared ranges intersect to `[6.0.8, 6.1.0)`, and 6.0.8 is the newest 1.20.1 build in it.

`docs/OPEN-WORK-LEDGER.md` carried an open row from the moment the pin was resolved:

> Season 2 viability under the chosen Create version (VS2 / Clockwork / TFMG / Warium) — now
> answerable, the Create pin is known. Sweep the four Season 2 mods against Create 6.0.8 and record
> **which doors the pin closes**, as an ADR.

The question is not academic. Main §4 lists five Season 2 systems and §5 builds a whole vehicle
philosophy on top of them. If the pin excluded Valkyrien Skies or TFMG, Season 2 would need either a
different Create major — which §31's hard platform rule makes expensive — or a different design.

The pin also has form here. `cbc_firepower_components` was **removed from the pack** because it
declared `createbigcannons [5.8.0, 5.9.0)` against the 5.11.4 the CORE stack forces, and that was
found by a **boot**, not by the sweep, because the sweep only read ranges pointing at `create`.

## Decision

**Record that the pin closes nothing, on measured evidence, and leave Season 2 out of Alpha on its
own merits rather than on a compatibility fear.**

Every mod §4 names has a 1.20.1 Forge build, and every declared range admits 6.0.8:

| Mod | modId | Version | Declared `create` range | 6.0.8? |
|---|---|---|---|---|
| Create: The Factory Must Grow | `tfmg` | 1.0.2f | `[6.0.6, 6.1.0)` mandatory | ✅ inside |
| Create: Clockwork | `vs_clockwork` | 0.5.6 | `[6.0.7,)` mandatory | ✅ |
| Valkyrien Skies 2 | `valkyrienskies` | 2.4.11 | `[6.0.6,)` **optional** | ✅ |
| Warium | `crusty_chunks` | 1.3.1 | *none declared* | ✅ Create-independent |
| CBC: Warium Projectiles | `shupapium` | 1.3.6 | `[6.0.8,)` mandatory | ✅ **6.0.8 is the exact floor** |
| TFMG–Warium Kerosene Converter | `kerosene_converter` | 1.4.0 | via `tfmg *` | ✅ |

**TFMG is the binding one.** `[6.0.6, 6.1.0)` is the only closed range in the set, and it happens to
be the same window the CORE addons force. Season 2 and Season 1 want the same Create major.

### The second-order ranges, read this time

The lesson `cbc_firepower_components` taught was written into the compatibility matrix as a rule:
*read every `mandatory=true` range, not only the one pointing at Create.* Applied here it changes
the answer for one mod:

| Mod | Second-order requirement | Pack has | |
|---|---|---|---|
| CBC: Warium Projectiles | `createbigcannons [5.11.0,)` | **5.11.4** | ✅ |
| | `crusty_chunks [1.3.0,)` | 1.3.1 (Warium) | ✅ |
| | `geckolib [4.8.2,)` | **4.8.4** | ✅ |
| Create: Clockwork | `valkyrienskies [2.4.6,)` | 2.4.11 | ✅ |
| | `architectury [9.1.12,)` | **9.2.14** | ✅ |
| | `kelvin [0.4.0,)` | **absent** | ⚠️ must be added |
| Kerosene Converter | `tfmg *`, `crusty_chunks *` | — | ✅ |

**The CBC family flipped.** `cbc_firepower_components` was removed because it capped
`createbigcannons` below 5.11; `cbc-warium-projectiles` requires 5.11 *or newer*. The pack's CBC
version excludes the Season 1 addon and admits the Season 2 one.

**One genuinely new dependency**: `kelvin`, required by Clockwork and not in the pack. That is a
Season 2 addition, not a Season 1 problem.

## Consequences

**Season 2 stays out of Alpha, and now for the stated reason only.** Main §4 opens with *"ระบบต่อไปนี้
ไม่ควรเป็น requirement สำหรับ Alpha แรก"* — it is a scope decision. It is no longer *also* an unknown
compatibility risk, and nobody needs to re-run this sweep to find that out.

**Valkyrien Skies keeps its `HIGH RISK` tag, and this ADR does not touch it.** §4 tags VS2 high-risk
for what it does to physics, chunk behaviour and server performance — not for whether it loads.
Version compatibility is the cheap question; this ADR answers only that one.

**The pin is now doubly forced.** Season 1 CORE forces `[6.0.8, 6.1.0)`; TFMG forces
`[6.0.6, 6.1.0)`. Any future argument for moving off 6.0.8 has to satisfy both, which is a
narrower window than before this was measured.

**Watch `create [6.0.8,)` on CBC: Warium Projectiles.** It is an open-ended floor sitting exactly on
the pin. A Create *downgrade* — for any reason — breaks it immediately, with no slack.

### What this ADR does not establish

**That any of these mods works.** Six declared ranges were read out of six jars. Nothing was
installed, nothing was booted, and §4's own `COMPATIBILITY TEST` tag on TFMG is a separate,
unstarted job. `cbc_firepower_components` also *declared* a range that Forge would have accepted
before its second-order requirement was read — declaration is not behaviour.

**That the Season 2 design is sound.** §5's vehicle philosophy, the Clockwork/VS2 interaction, and
whether any of it passes §35's test are untouched here.

**Anything about performance.** VS2 and Clockwork both add per-tick physics. §22's performance risks
and §23's MSPT targets say nothing about mod *versions*, and this sweep says nothing about MSPT.

## Method, so it can be redone

```bash
# find the project by TITLE, never by guessing the slug — the design document's
# URLs are CurseForge slugs, and `create-industry` on Modrinth is a MODPACK,
# not TFMG. That mistake was made and caught during this sweep.
curl -s "https://api.modrinth.com/v2/search?query=The%20Factory%20Must%20Grow&facets=\
%5B%5B%22categories:forge%22%5D,%5B%22versions:1.20.1%22%5D,%5B%22project_type:mod%22%5D%5D"

# then read the ranges out of the jar, not off a web page
unzip -p <jar> META-INF/mods.toml | grep -A3 '\[\[dependencies'
```
