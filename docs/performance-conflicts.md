# Performance conflicts

**Required by** *Performance Spec: `PERF-DOCS`*.

Where two mods interact in a way that costs performance, changes behaviour, or would if the wrong
one won. **Recording a conflict is not fixing it** — each entry states what is known, what is not,
and what would settle it.

Unlike the other two `PERF-DOCS` files, this one is **not** empty. Five interactions are already
evidenced and were scattered across commit messages, config comments and matrix prose. Scattered is
how they get rediscovered.

---

## C1 — Oculus disables three Embeddium optimisations, shader or no shader

**Status: live. Cost unmeasured.**

`oculus-mc1.20.1-1.8.0.jar` `META-INF/mods.toml` carries:

```toml
[mods."sodium:options"]
"mixin.features.render.world.sky"=false
"mixin.features.render.entity"=false
"mixin.features.render.gui.font"=false
```

Those three Embeddium mixins are off **whether or not a shaderpack is selected**. Shipping the
loader (#91, `PERF-RENDER-OCULUS`) is therefore a trade rather than a free option: the pack bought
the ability to run shaders and paid part of Embeddium's work for it.

**What is not known:** how much. This pack has no FPS baseline, so the size of the trade cannot be
stated and is not guessed.

**What would settle it:** one client run in Zone A with Oculus present, one without, everything else
identical (`PERF-METHOD-ONEVAR`). Both rows go in `docs/performance-benchmarks.md`.

**Do not remove Oculus to "fix" this.** The trade was made deliberately and *Visuals Spec §23*
depends on it. The open question is its price, not its presence.

---

## C2 — `midnightlib` is bundled twice, and the older copy won

**Status: live. No symptom observed.**

Two mods ship a jar-in-jar copy of the same library at different versions:

| Mod | Bundles | Declares it needs |
|---|---|---|
| `countereds-terrain-slabs` | `1.9.2+1.20.1-forge` | `[1.9.2+1.20.1-forge,)` |
| `naturalist` | `1.4.2-forge` | `[1.4.2-forge,)` |

Forge loads exactly one copy for the whole pack. The client boot of 2026-08-27 kept **`1.4.2`** —
below the range `countereds-terrain-slabs` declares.

**Why it is silent.** Forge had to pick one and does not fail on the choice. Nothing in the log says
a mod is running against a library older than it asked for. It would surface only as a
`NoSuchMethodError` at the moment the newer API is actually called, which may be never.

**What is not known:** whether Terrain Slabs calls anything that exists only in 1.9.2. Its blocks
register and no error has appeared.

**What would settle it:** play with Terrain Slabs blocks placed and watch for a `NoSuchMethodError`
naming `eu.midnightdust`. If one appears, the fix is upstream or a version pin, not a config.

**Do not guess which copy Forge keeps.** Highest-version-wins is the obvious rule and this case
falsifies it — read the actual pick out of `logs/latest.log`.
`scripts/build/generate-mod-dependencies.py` deliberately refuses to predict it.

---

## C3 — OptiFine collides with Embeddium

**Status: prevented, not encountered.**

`PERF-RENDER-OPTIFINE` forbids it, and both shipped READMEs now say so to players (#91), because
consumer shader guides — including CurseForge's own — name OptiFine as the first Forge route.

**This is the one entry here that is about somebody else's instructions rather than our mod list.**
A friend who follows a generic guide against this pack breaks it, and no gate we control can stop
that; only the README can.

---

## C4 — Improved Mobs × Brimm: 45 ERROR lines while building the equipment pool

**Status: known, cosmetic, deliberately not suppressed.**

A fresh-`config/` boot logs 45 lines of `Error calculating default weights for item ratnik`, from
Brimm throwing `IllegalStateException` on `m_7366_`.

**A hypothesis was tested and falsified.** Setting `"Item Blacklist" = ["brimm"]` in
`config/improvedmobs/common.toml` was expected to remove them. Measured: the boot still logs all 45,
because `getDefaultWeight` runs while *building* the pool, before the blacklist filters it.

The blacklist was kept anyway — for behaviour, not for the log. The generated `equipment.json`
contains zero `brimm` entries, which turns "excluded because a mod throws" into "excluded because we
said so", and that survives Brimm fixing their bug.

**Shipping a pre-generated `equipment.json` would suppress the noise and was rejected:** 47 KB, no
regeneration option, and it would freeze the equipment pool against this exact mod list forever.
That is a real cost for cosmetic log output with no gameplay effect.

**Baseline impact:** a fresh-config boot is **50 ERROR lines**, a reused-config boot is **4**.
Comparing across that difference reads as a large improvement that did not happen — see
`docs/performance-baseline.md`.

---

## C5 — Create reports `Flywheel Backend: flywheel:off`

**Status: observed once, unexplained.**

The crash report of 2026-08-27 recorded `Flywheel Backend: flywheel:off`. Flywheel is Create's
instanced-rendering backend and it disables itself under several conditions — a shaderpack being
active is one of them, but Oculus was not in the pack on that date.

**What is not known:** why it was off, and whether it is off in normal operation. One line in one
crash report is an observation, not a diagnosis.

**What would settle it:** read `Flywheel Backend` in `latest.log` on a clean client launch. If it is
`off` without a shaderpack selected, Create is rendering contraptions the slow way and that is a
real and currently unbudgeted cost in Zone B and Zone G.

---

## C6 — spark cannot use async-profiler on Windows

**Status: live, measured, and it constrains the baseline run rather than the pack.**

Server boot of 2026-08-28 (`Boot 19`):

> `The async-profiler engine is not supported for your os/arch (windows11/amd64), so the built-in
> Java engine will be used instead.`

spark works — it starts its background profiler — but on this machine it samples with the JVM's own
engine rather than async-profiler.

**What this costs.** The built-in engine cannot see native frames and samples on safepoints, so it
under-attributes JIT-compiled and native work. For `PERF-PRIORITY` item 2 that is acceptable: the
questions are *which mod is hot* and *is MSPT drifting*, and the Java engine answers both.

**What is not known:** whether any bottleneck this pack has is one the Java engine will misattribute.
Nothing here is measured yet.

**What would settle it:** if a profile shows a flat, uninformative distribution, run the same
scenario on a Linux server where async-profiler is available before concluding anything about the
pack.

---

## C7 — AllTheLeaks actively patches seven of our mods

**Status: live, working as intended. Recorded because it is a surface, not a fault.**

Measured at `Boot 19`: AllTheLeaks loaded **17 patch classes** after version-matching against this
pack's actual mod list:

```
forge         Issue10684, Issue39, UntrackedIssue001, UntrackedIssue002
minecraft     UntrackedIssue001, UntrackedIssue002
create        curios        architectury        sereneseasons
spark         Issue447
```

**Why this is worth a conflicts entry.** A mod that rewrites behaviour in seven others is a
correctness surface, not just a memory optimisation. If something subtle breaks in Create, Curios or
Serene Seasons after this, AllTheLeaks belongs on the suspect list — and without this record nobody
would think to look there.

It also patches **spark**, which is the instrument the baseline will be measured with. That is not
circular in a harmful way, but it is worth knowing before reading a profile.

One WARN, interop rather than fault: `mixinsquared-annotation-adjuster` reports modifying
AllTheLeaks' `VillagesTradelistMixin`.

**What is not known:** whether any of the 17 changes behaviour visibly. The boot is green and the
ERROR count matches baseline; nothing beyond that has been exercised.

**What would settle it:** the `PERF-MEM-ALLTHELEAKS` long-session runs, plus normal play. Its risky
ingredient-dedupe-style options stay **OFF** per the spec until proven safe for this pack.

---

## How to add an entry

One heading per interaction, numbered `C<n>`. Each entry states:

1. **Status** — live / prevented / resolved / observed-once, and whether the cost is measured.
2. **The evidence**, cited to a file, a jar, or a log line. Not a recollection.
3. **What is not known.** This is the field that stops an entry becoming folklore.
4. **What would settle it** — the specific run or read, so the next agent does not have to design
   the experiment.

An entry that cannot fill field 3 or 4 is probably a note, not a conflict.
