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

**What it stays good for.** Tick hotspots, entity ticking, MineColonies, Create, mob AI and worldgen
— the questions `PERF-PRIORITY` item 2 actually asks. The fallback does not make spark useless.

**What no document may say.** That a profile taken on this machine is equivalent to native
async-profiler output. It is not, and writing so would launder a limitation into a result.

**What is not known:** whether any bottleneck this pack has is one the Java engine will misattribute.
Nothing here is measured yet.

**What would settle it:** if a profile shows a flat, uninformative distribution, run the same
scenario on a Linux server where async-profiler is available before concluding anything about the
pack.

---

## C7 — AllTheLeaks actively patches seven of our mods

**Status: live, working as intended. Recorded because it is a surface, not a fault.**

> ### Stop thinking of this as "a mod that reduces memory"
>
> ```text
> AllTheLeaks = memory / leak fix layer
>             + behavioral compatibility patch layer
> ```
>
> The second layer is the one that matters for debugging. **AllTheLeaks belongs at the top of the
> bisect list** for symptoms like:
>
> ```text
> Create state behaving oddly
> Curios item lifecycle behaving oddly
> Serene Seasons lifecycle behaving oddly
> world unload / reload bugs
> ```
>
> What `Boot 19` actually proved, and what it did not:
>
> ```text
> startup compatibility   ✅
> runtime correctness     ❓
> long-session correctness ❓
> client behavior          ❓
> ```

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

## C8 — ImmediatelyFast 1.2.7 × Oculus 1.8.0 shut the client down at startup

**Status: fixed by upgrading ImmediatelyFast to `1.5.5+1.20.4-forge` (#107). Unverified on a
client — nobody has launched one since.**

**This is the first real compatibility bug the performance stack has produced**, and it arrived
from a client smoke test rather than from any check in this repository.

```
java.lang.ClassNotFoundException: net.coderbot.iris.vertices.ImmediateState
  at forge.net.raphimc.immediatelyfast.compat.IrisCompat.init(IrisCompat.java:41)
  at com.mojang.blaze3d.platform.Window.<init>(Window.java:113)
```

**The chain, each link read out of a jar:**

1. Oculus 1.8.0 ships `net/irisshaders/iris/vertices/ImmediateState.class` and **zero** classes
   under `net/coderbot/iris/vertices/` — the Iris package was renamed.
2. ImmediatelyFast 1.2.7's `IrisCompat` holds the constant
   `String net.coderbot.iris.vertices.ImmediateState` and calls `Class.forName` on it.
3. Oculus declares `provides = ["iris"]`, so `PlatformCode.getModVersion("iris")` finds it and
   `IrisCompat.init()` runs.

**Why it looked like the game quit rather than crashed.** `IrisCompat.init` catches
`java.lang.Throwable` — and its handler is:

```
LOGGER.error("Failed to initialize Iris compatibility. Try updating Iris and ImmediatelyFast…")
System.exit(-1)
```

**The mod shuts the JVM down on purpose.** No crash report is written, because nothing crashed.
Anyone debugging this by looking for a crash report finds nothing and concludes the launcher is at
fault.

**The fix, chosen on evidence.** ImmediatelyFast 1.5.5's `IrisCompat` holds constants for **both**
`net.coderbot.iris.vertices` and `net.irisshaders.iris.vertices` — verified by disassembling the
jar the build actually fetched, not by reading a changelog. Downgrading Oculus was considered and
rejected: `1.20.1-1.7.0` also has zero `net/coderbot/iris/vertices/ImmediateState`, so the rename
predates it.

**What is not known:** whether the shader path itself works. A main menu proves
`ImmediatelyFast + Embeddium + Oculus` with **no shader selected**; `IrisCompat` exists to serve the
active path, and that is a different set of code.

**What would settle it:** launch → main menu with no shader → test world → back to menu → enable a
shaderpack → re-enter → toggle the shader off and on at runtime. If something still fails after
that, try `hud_batching = false` in `config/immediatelyfast.json` **before** removing anything —
there are reported Forge 1.20.1 × Oculus HUD-batching issues, and that is a different fault from
this one.

### The check that should have caught it, and did not

`#91` recorded: *"Nothing else in the client stack declares an Oculus or Iris relationship —
checked by grepping `mods.toml`."*

**True, and useless.** ImmediatelyFast's Iris integration is not declared anywhere — it is a string
passed to `Class.forName`, reached because Oculus *provides* the `iris` modId. A `mods.toml` grep
cannot see a code-level integration, and its silence was read as evidence of absence.

> **Rule earned:** a mod declaring `provides = [...]` can activate compatibility code in mods that
> never name it. Check what the **provided id** pulls in, not only what depends on the mod's own id.
> `docs/mod-dependencies.md` reads declared dependencies and **cannot** see this class of coupling.

---

---

# Upscaling / Frame Generation — `C-UPFG-*`

Ids defined by *Upscaling Spec* `PERF-UPFG-033`. These belong to the **opt-in artifacts**, not to
the pack: Super Resolution has no metafile and `verify` still reports 120 mods.

**Four artifacts. Three of them are the same shape, and one is a different question (#111, #115):**

| Artifact | Size | Carries | Use it to |
|---|---|---|---|
| `[Optional] Super Resolution(Upscaling).zip` | 31 MB | Candidate A `1.20.1-0.9.1-alpha.1+gl-forge` | **try A** |
| `[Optional] MCDLSSG(DLSS Frame Gen).zip` | 22 MB | Candidate B `0.1.0-alpha+opengl` | **try B** |
| `[Optional] PFG(Frame Gen).zip` | 59 KB | Candidate C `1.4.0` | **try C** |
| `-nvidia-upscaling.zip` | 214 MB | Candidate A only | **measure A** — a clean profile where nothing else can differ |

The add-ons are what you hand anybody: extract over an existing profile's `.minecraft`, delete the
jar to revert. The full variant exists because a `PERF-UPFG-021` A/B is invalidated by an unnoticed
difference between two profiles, and only a clean import rules that out.

**The names are not decoration** (`PERF-UPFG-004`). A says *Upscaling* because its DLSS **upscaling**
path is verified and its FG backend is not. B says *DLSS Frame Gen* because that is an **explicit
upstream claim** the spec records for that mod — a claim repeated, not a result measured. C says only
*Frame Gen*, because `PERF-UPFG-007` forbids calling PFG NVIDIA DLSS-G and PFG ships no vendor SDK at
all.

**Every jar is pinned and re-checked at build time, but the pins are not equal evidence.** Modrinth
publishes A's sha512 and CurseForge publishes C's sha1, so those two are checked against an
**upstream** number. GitHub publishes no digest for B, so B's sha512 is the digest of the asset as
downloaded from the pinned release URL — a reproducibility pin, not an attestation.

## C-UPFG-00 — the DLSS model is downloaded at runtime, and it resolves "latest"

**Status: verified from bytecode. Not a fault — a constraint on every benchmark.**

Super Resolution does **not** ship a DLSS model and does not redistribute one. `NgxDlssLatestProvider`
fetches it from NVIDIA:

```
BASE_URL    https://ngx.download.nvidia.com/
CONFIG_URL  https://ngx.download.nvidia.com/dev-models/org/nvidia/team/ngx/models/config/versions/2/…
pattern     org/nvidia/team/ngx/models/dlss/versions/(\d+)/files/160_([0-9A-Fa-f]+)\.bin
log line    "Resolved latest DLSS object from NGX: app_{} = {}, {}"
```

**Why it matters for `PERF-UPFG-021`.** The A/B matrix requires every variable held fixed. This one
moves on NVIDIA's schedule, not ours. **Any A/B run must record the resolved DLSS object from the
log**, or run A and B far enough apart in configuration but close enough in time that it cannot have
changed.

`PERF-UPFG-031` asks for six fields. Four are answered above. Two are **not determined** and stay
open: where the model is cached on disk, and whether uninstalling cleans it up.

Offline behaviour is a log string — `"No DLSS object found on NGX server for any known app id"` —
not an observation. Nobody has pulled the network and watched.

## C-UPFG-01 — Super Resolution × Oculus

**Status: UNTESTED.** Both rewrite the render path; Oculus already disables three Embeddium mixins
(C1). Test shader OFF and shader ON separately — `PERF-UPFG-012`, `PERF-UPFG-038`.

## C-UPFG-02 — Super Resolution × ImmediatelyFast

**Status: UNTESTED, and this pairing has already produced one client-killing bug.** C8 was
ImmediatelyFast reaching into Iris internals and calling `System.exit(-1)` when they moved. It is
now at 1.5.5. `PERF-UPFG-011` requires this pair be tested deliberately rather than assumed.

## C-UPFG-03 — Super Resolution × TaCZ HUD / weapon rendering

**Status: UNTESTED.** Upscaling reconstructs from a lower internal resolution; a weapon HUD drawn at
native and a scope drawn through reconstruction are different problems. `PERF-UPFG-036` has the
subjective checklist.

## C-UPFG-07 — the client bound to the wrong GPU

**Status: LIVE on the developer's machine. Blocks every measurement.**

`latest.log` from 2026-08-28:

```
Found graphics card: NVIDIA GeForce RTX 4070 SUPER
Found graphics card: Intel(R) UHD Graphics 770
Found graphics card: NVIDIA GeForce RTX 5060 Ti
OpenGL Renderer:     NVIDIA GeForce RTX 5060 Ti/PCIe/SSE2      <- the weaker card, on PCIe 4.0 x4
```

The narrow link starves texture and chunk uploads, which shows up as **frame-time spikes rather than
lower average FPS** — the reported symptom exactly: 80–140 FPS that does not feel smooth.

**No upscaling or FG verdict may be drawn until this is fixed**, and neither may any performance
baseline. `PERF-UPFG-021` compares runs; two runs on different GPUs are not comparable.

**How to check, in one line.** Do not judge by feel:

```
grep "OpenGL Renderer" .minecraft/logs/latest.log
```

Anyone with more than one GPU can hit this, and nothing in the game says which card it picked.

## C-UPFG-08 — the three add-ons are mutually exclusive, and Forge will not enforce it

**Status: verified from the jars. No incompatibility is declared by any of the three.**

`PERF-UPFG-009` and the spec's hard rule DO-NOT 3 forbid running A, B and C together. **Nothing in
the software implements that rule.** `mcdlssg`'s `META-INF/mods.toml` declares no `breaks` or
`conflicts` against `super_resolution`, and none of the three declares one against the others — so a
player who extracts two add-ons over the same `.minecraft` gets two mods hooking the same frame
path, and Forge starts normally.

**What that costs.** Not necessarily a crash — the bad case is that it *works*, badly, and the
resulting stutter or artefact cannot be attributed to either mod. That is the failure `PERF-UPFG-021`
exists to prevent.

**What holds the line instead.** One paragraph on the first screen of all three `README.txt` files,
naming the other two by filename and saying to delete the previous jar first. The build enforces the
other half: each archive is read back and rejected if it contains any candidate but its own.

**Not known.** Whether two of them actually load together in game, and what it looks like if they do.
Nobody has tried it and nobody should, except deliberately and last.

## C-UPFG-09 — Candidate B is the least-run software in this repo

**Status: measured from the upstream release at pin time, 2026-08-28.**

`github.com/Tunanodra/MC-DLSSFG`, release tag `ITJUSTWORK`, marked **pre-release**, published
2026-07-19. The asset `mcdlssg-forge-1.20.1-0.1.0-alpha+opengl.jar` had **3 downloads**, and the
repository **1 star**. `PERF-UPFG-029` asks for exactly this scrutiny before adopting a native-code
mod, so it is recorded as a number rather than an impression.

**A second licence disagreement, same shape as Candidate A's.** `mods.toml` declares `MIT`; GitHub
reports the repository licence as **"Other"**. Both are handed to the group and neither is published,
so nothing is blocked (`docs/distribution-licenses.md`), but two sources disagree.

**Related to Candidate A, but not derived from it.** Its own description says *"Inspired by the Super
Resolution project"* and it bundles the same twelve third-party licences including `ngx.txt`. It is
**not a fork** — the jar contains zero classes under `io/homo/superresolution`. Two independent
implementations of the same idea is exactly why they must not be loaded together (`C-UPFG-08`).

**Windows only.** Four DLLs ship inside — `MCDLSSG`, `MCDLSSGNGX`, `MCDLSSGStreamline`,
`MCDLSSGXeSS` — and no Linux `.so`. Candidate A ships both.

**Not known.** Whether it launches at all. Nobody in this group has run it.

## C-UPFG-10 — Candidate C is a different technique, and V-Sync fights it

**Status: read from the jar and the author's own description. Not launched.**

PFG is the odd one out and that is its value: `PERF-UPFG-007` asks whether a simpler FG-focused
implementation beats the larger upscaling framework on compatibility or overhead, and PFG is the
clean test. It does frame generation **only**, via *"multi-scale optical flow, up to 6x, computed
entirely in fragment shaders"* — coarse-to-fine pyramidal Lucas-Kanade, per its description. **No
vendor SDK, no native library of any kind, no runtime download.** That is why it is 61 KB rather than
22–31 MB, and why it is not NVIDIA-only.

**The setting that will invalidate the test.** The author advises capping render FPS **below** the
monitor refresh rate and keeping **V-Sync off** while FG is active. The current test client runs
`enableVsync: true` with `maxFps: 260` — so a run started today measures the interaction, not the
mod. Change it before testing C, and record that it was changed (`PERF-METHOD-ONEVAR`).

**Toggle key `K`**, which means a run can be A/B-ed within one session — the only one of the three
that can.

**Two facts recorded as seen, not smoothed.** The filename says `1.4.0` while `mods.toml` says
`1.2.0`; and the licence is `All Rights Reserved`, which is the same footing as four mods already in
the pack — fine to hand to the group, never to publish.

**Not known.** Everything about how it looks in motion. Optical-flow FG has characteristic artefacts
around fast-moving thin geometry, and this pack renders gun HUDs and scopes (`C-UPFG-03`).

## Licence discrepancy on Candidate A — recorded, not blocking

The jar's `mods.toml` declares `license = "MIT"`; Modrinth reports `GPL-3.0-or-later`. Both permit
redistribution so nothing is blocked, but two sources disagree.

The jar ships `licenses/` with thirteen third-party licences including **`ngx.txt` — "NVIDIA RTX SDKs
LICENSE"** — so the author has done the SDK licensing work rather than leaving it to us
(`PERF-UPFG-029`).

---

## How to add an entry

One heading per interaction, numbered `C<n>`. Each entry states:

1. **Status** — live / prevented / resolved / observed-once, and whether the cost is measured.
2. **The evidence**, cited to a file, a jar, or a log line. Not a recollection.
3. **What is not known.** This is the field that stops an entry becoming folklore.
4. **What would settle it** — the specific run or read, so the next agent does not have to design
   the experiment.

An entry that cannot fill field 3 or 4 is probably a note, not a conflict.
