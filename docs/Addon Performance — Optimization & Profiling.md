# Addon Spec — Performance Optimization & Profiling

**Status: Canonical.** This is the only Performance Spec an agent may treat as authority.

```text
Supersedes:
  Performance Spec v1  — docs/archive/Addon Performance — Optimization & Profiling-v1.md
  Performance Spec v2  — docs/archive/Addon Performance — Optimization And Profiling-v2.md
```

> **Project:** Industrial Civilization Survival
> **Repository:** `xenodeve/minecraft-100day`
> **Platform:** Minecraft 1.20.1 / Forge / Java 17
> **Target team:** 3 players baseline, 4 players full team
> **Pack profile:** 115+ mods; heavy Create, MineColonies, Hordes, TaCZ, worldgen and visual systems

---

# 0. How to cite this document — `PERF-CITE`

**Cite the `PERF-*` id. Never cite a section number.**

```text
correct    Performance Spec: PERF-RENDER-OPTIFINE
wrong      Performance Spec §5
```

Section numbers are for reading. They are **not** a cross-document contract, and this repository
learned that the expensive way: v1 §5 was *Embeddium Rules*, v2 §5 was *High-Priority Add
Candidates*, and three committed documents cited "Performance Spec §5" for a rule that existed in
only one of them (#91, #93).

A `PERF-*` id stays correct when a heading moves from §5 to §12 to §18. Renaming an id is a breaking
change and needs the same reference sweep a rename in code would.

---

# 1. Philosophy — `PERF-PHILOSOPHY`

Goal:

```text
Stable 20 TPS
Stable frame times
Good 1% lows
Predictable RAM usage
Long-session stability
Enough headroom for the civilization to grow
```

Do not optimize for benchmark screenshots or blind mod count.

> **A faster broken game is not optimization.**

Every optimization change needs evidence: FPS / 1% low, MSPT / TPS, RAM, startup time, worldgen
time, entity/render cost, or long-session stability.

The goal is **not**:

```text
Install every optimization mod available
```

---

# 2. Loader decision — `PERF-LOADER`

Remain on:

```text
Minecraft 1.20.1
Forge 47.x
```

Do not migrate to Fabric or NeoForge for performance alone. Fabric has a lighter baseline, but this
pack's real cost is the ecosystem already built on Forge: Create and its addons, TaCZ, MineColonies,
Ice & Fire, Born in Chaos, KubeJS, Immersive Engineering, SecurityCraft, The Hordes, the AI layer,
the configs and the quest campaign.

This restates a hard platform rule from the main design document (§31). It is not negotiable here.

---

# 3. Performance layers — `PERF-LAYERS`

```text
Rendering
Memory
Client micro-optimization
Server / game logic
Recipe processing
Entity count
World generation
Background resource usage
Profiling
Experimental broad optimizers
```

Keep the layers conceptually separate so overlapping optimizers are not stacked blindly.

---

# 4. Approved CORE stack

Everything in this section is **in the pack and stays in the pack** unless a measurement says
otherwise.

## PERF-RENDER-EMBEDDIUM — Embeddium

Primary Forge renderer optimization. Keep as the default renderer.

**Do:**

- Test with Create 6.0.x exact version
- Test with TaCZ rendering
- Test with dynamic lights
- Test with Jade overlays
- Test with ImmediatelyFast
- Test with Entity Culling
- Test shader compatibility — now in scope, see `PERF-RENDER-OCULUS`

**Do not:** see `PERF-RENDER-OPTIFINE`.

## PERF-RENDER-OPTIFINE — OptiFine is forbidden

```text
DO NOT INSTALL OPTIFINE
```

OptiFine ไม่ใช่ส่วนหนึ่งของ target architecture. It collides with Embeddium, which is this pack's
renderer.

**This rule needs to be visible to players, not only to agents.** Consumer shader guides — including
CurseForge's own — name OptiFine as the first Forge route. Both shipped READMEs therefore say so:
the `README.txt` inside the friend archive and the `build/README.md` uploaded beside it (#91).

## PERF-RENDER-IMMEDIATELYFAST — ImmediatelyFast

Optimizes immediate-mode rendering paths: entities, particles, text, GUI and related rendering.

## PERF-RENDER-ENTITY-CULLING — Entity Culling

Avoid rendering entities and block entities hidden behind geometry. High value in cities,
warehouses, factories, Horde fights and animal-heavy areas.

### Important constraint

Entity Culling ต้องไม่:

```text
change server simulation
change AI
change mob existence
```

มันควรเป็น visual/render optimization เท่านั้น.

Test special rendering ของ:

```text
TaCZ
CCTV
Create contraptions
IceAndFire creatures
Valkyrien Skies later
```

ว่าถูก cull ผิดหรือไม่.

## PERF-MEM-MODERNFIX — ModernFix

General memory, startup, cache and bugfix optimization.

ต้อง:

- Pin exact version
- Inspect generated config
- Keep defaults initially
- Only disable individual fixes if an actual incompatibility is **measured**

ห้าม:

```text
randomly toggle ModernFix mixins
```

เพราะเห็น config จำนวนมากแล้วคิดว่าเปิด/ปิดได้ตามใจ.

## PERF-MEM-FERRITECORE — FerriteCore

Reduces memory used by block states, models and registries. Use on client and server where
supported.

## PERF-SERVER-SERVERCORE — ServerCore

Server-side ticking, entity and spawn optimization. Test carefully with Enhanced AI, Improved Mobs,
The Hordes, Attract to Sound, MineColonies and In Control!.

### Critical exclusions

ห้ามใช้ activation / tick reduction กับ entity สำคัญโดยไม่ตรวจสอบ.

ต้อง audit อย่างน้อย:

```text
MineColonies NPCs
IceAndFire Dragons
Born in Chaos elites
Horde mobs
TaCZ bullets/projectiles
Create contraptions
Create trains
Warium projectiles later
Valkyrien Skies ships later
Clockwork entities later
```

ถ้า entity ต้องทำงานไกลจาก player:

```text
EXCLUDE FROM AGGRESSIVE INACTIVE TICKING
```

### Philosophy

ใช้:

```text
normal wildlife far away
ordinary hostile mobs far away
ambient creatures
```

เป็น target หลักของ reduced ticking.

อย่าใช้ server optimization เพื่อทำให้:

```text
Dragon freezes when player steps 70 blocks away
Train stops
MineColonies worker breaks
Horde loses AI
```

## PERF-RECIPE-FASTSUITE — FastSuite

Recipe-processing optimization for the large Create / KubeJS recipe graph.

### Test matrix

Test:

```text
Vanilla crafting
Create processing
Sequenced Assembly
KubeJS recipes
Polymorph
Visual Workbench
MineColonies recipes
TaCZ ammunition
```

หาก recipe lookup มี bug: ให้ isolate ก่อน disable FastSuite ทั้งหมด.

## PERF-ENTITY-CLUMPS — Clumps

Merges XP orbs to reduce entity count after Horde fights, farms and large combat.

## PERF-WORLD-PREGEN — Chunk pregeneration

```text
Chunky              = SELECTED
Chunk-Pregenerator  = ALTERNATIVE / NOT SELECTED
```

**Use one, never both.** Chunky is selected because its Forge 1.20.1 path fitted this pack's sweep;
Chunk-Pregenerator is a working alternative that was simply not chosen. It is recorded here so a
later agent does not re-propose it believing the topic was forgotten.

```text
SERVER TOOL
NOT GAMEPLAY CONTENT
```

**Purpose:** reduce chunk-generation spikes while players explore. The pack's worldgen carries
Ecologics, Ice & Fire, oil resources, structures, biomes and Create-related world content, and
players travel far by train and, later, ground vehicles and aircraft.

### Strategy

Before opening a persistent multiplayer world, pregenerate a safe operational region.

```text
5,000–10,000 blocks
```

Exact radius depends on storage, generation time, expected player count and exploration design.
อย่า pregenerate 50,000 blocks แบบไม่มีเหตุผล.

### Verification

หลัง pregenerate, check:

```text
world size
generation errors
missing structures
IceAndFire worldgen
oil generation
biome distribution
server logs
```

Backup ก่อนทดลอง pregeneration command บน production world.

---

# 5. Benchmark-gated candidate

## PERF-TACZ-ACCELERATED — TaCZ: Accelerated

```text
BENCHMARK-GATED CANDIDATE
NOT CORE YET
TACZ-SPECIFIC
```

**Status history, stated so it is not re-litigated.** v1 listed it in the Core stack *and* graded it
`CORE CANDIDATE / PROMOTE AFTER BENCHMARK` — a contradiction the compatibility matrix recorded. v2
resolved it by deleting the topic, which is **not** a decision to reject. The correct resolution is
this status.

**Source:** <https://www.curseforge.com/minecraft/mc-mods/tacza>

**Role.** Optimize TaCZ hot paths: bullet processing, rendering, repeated lookups, temporary
allocations, gunpack assets and cache. The pack has a genuine high-concurrency gunfire case —
4–8 players, automatic rifles, Horde, Born in Chaos, TaCZ Additions, Guns Lights, Attract to Sound —
so the potential is high.

**Promotion path. Do not skip a step.**

```text
Baseline TaCZ
     ↓
measure automatic-fire workload
     ↓
+ TaCZ: Accelerated
     ↓
same benchmark, same scenario, same seed
     ↓
promote only if measurable AND compatible
```

**Test matrix.** ต้องทดสอบกับ:

```text
TaCZ exact version
TaCZ Additions
TaCZ Durability
Create: TaCZ
TaCZ x Guns Lights Addon
Selected gun packs
Attract to Sound
```

Test scenarios:

```text
Single rifle
Full-auto 30 rounds
4 players full-auto
8 players full-auto
Horde + automatic fire
```

Compare:

```text
Server MSPT
Client FPS
Frame time
GC activity
Projectile count
Network traffic if measurable
```

---

# 6. High-priority add candidates

All of these are gated behind a baseline (`PERF-PRIORITY`). None may be added blind.

## PERF-CLIENT-BADOPTIMIZATIONS — BadOptimizations

Client micro-optimizations that complement Embeddium + ImmediatelyFast + Entity Culling.

Especially relevant now that the visual layer exists: Grassier Grass, Particle Rain, Subtle Effects,
Fancy World Animations, EMF/ETF.

**Acceptance:**

- no rendering corruption
- no compatibility regression
- measurable or neutral frame-time result

## PERF-MEM-ALLTHELEAKS — AllTheLeaks

Long-session memory-leak mitigation.

Test:

```text
30 min
2 h
4 h
```

Record heap growth, GC frequency, FPS degradation, MSPT drift, post-world-reload memory.

Keep risky ingredient-dedupe-style features **OFF** unless proven safe for this exact pack.

## PERF-CLIENT-DYNAMICFPS — Dynamic FPS

Reduces CPU/GPU use while minimized, unfocused or idle. It does not primarily improve active
gameplay FPS, but is useful when players keep Discord, a browser or voice tools open.

Client QoL candidate.

## PERF-RENDER-LEGENDARY-BLOCK-ENTITIES — Legendary Block Entities

Forge-native block-entity rendering optimization, and the preferred direction over Fabric Enhanced
Block Entities or FastChest bridge solutions.

High value for warehouses, MineColonies, chest rooms, stations, industrial storage and cities.

Test with Embeddium, ModernFix and resource packs.

---

# 7. Profiling

## PERF-PROFILE-SPARK — spark

```text
DEV / ADMIN CORE
```

spark does not make the game faster. It identifies what is actually slow.

Profile:

```text
entity ticking
pathfinding
Horde AI
MineColonies
Create
chunk loading
world generation
GC
```

Required workflow:

```text
profile
→ identify bottleneck
→ change one variable
→ benchmark
→ keep or revert
```

Do not add broad optimizers because they are popular.

---

# 8. Experimental candidates

## PERF-EXP-FASTNOISE — Fast Noise

Worldgen experiment: potential noise / biome / surface-generation optimization.

Test with identical seeds and compare terrain, biome placement, structures, Ice & Fire worldgen,
BOP behaviour, generation time and MSPT / chunk hitching.

**Reject if it changes world output unexpectedly.**

## PERF-EXP-LETMEDESPAWN — Let Me Despawn

Entity-lifetime experiment. Useful if equipment-bearing mobs become unintentionally persistent.

Must exclude where necessary:

```text
dragons
bosses
named mobs
tamed animals
important NPCs
Horde event mobs
```

Do not let despawn rules trivialize Horde events.

## PERF-EXP-ALTERNATE-CURRENT — Alternate Current

Redstone-dust optimization. Only useful if profiling shows significant vanilla-redstone cost. Test
Create, SecurityCraft, MineColonies and industrial control logic.

## PERF-EXP-CANARY — Canary

Broad Lithium-style optimization. Potentially powerful, but it touches AI, physics, game logic,
chunks and collections.

Use only in:

```text
perf/canary-experiment
```

Never blind-stack into `main`.

## PERF-EXP-AI-IMPROVEMENTS — AI Improvements

```text
DEFER
```

AI already has many layers: Enhanced AI, Improved Mobs, Attract to Sound, The Hordes, ServerCore,
In Control!. Reconsider only if spark proves AI or pathfinding is the bottleneck.

## PERF-EXP-SMOOTHBOOT — Smooth Boot Reloaded

Low priority. Startup scheduling only; it does not solve Horde TPS, Create load, MineColonies load
or gameplay FPS.

---

# 9. Fabric performance mods and the Forge decision — `PERF-LOADER-TABLE`

| Fabric-side item | Forge 1.20.1 decision | id |
|---|---|---|
| Sodium | Use **Embeddium** | `PERF-RENDER-EMBEDDIUM` |
| Sodium Extra | Optional **Embeddium Extra** | `PERF-RENDER-EMBEDDIUM-EXTRA` |
| Reese's Sodium Options | Not required; avoid redundant UI | — |
| Mod Menu | Not applicable; Forge has a Mods screen | — |
| Fabric API | Do not add | — |
| Fabric Language Kotlin | Use **Kotlin for Forge** only when required | — |
| Cloth Config | Forge native dependency; only when required | — |
| Architectury | Forge native dependency; only when required | — |
| YACL | Forge native dependency; only when required | — |
| MidnightLib | Forge native dependency; only when required | — |
| Lithium | Do not bridge; use ServerCore / ModernFix / FastSuite | — |
| C2ME | Do not use in main | `PERF-REJECT-C2ME` |
| More Culling | Do not bridge; Entity Culling + Embeddium cover the core need | — |
| Enhanced Block Entities | Prefer **Legendary Block Entities** | `PERF-RENDER-LEGENDARY-BLOCK-ENTITIES` |
| VMP | Not needed for 3–4 players | `PERF-REJECT-VMP` |
| Iris | Optional Forge shader path is **Oculus** | `PERF-RENDER-OCULUS` |
| Continuity | Visual feature, not performance; do not add under this spec | — |
| Zoomify | QoL, not performance | — |

Libraries are dependencies, not optimization mods. Install one only when something actually
requires it.

## PERF-RENDER-OCULUS — Oculus, the optional shader path

**In the pack** since #91, `side = "client"`, and it is Iris: `provides = ["iris"]`.

A loader is not a shader. *Visuals Spec §22* forbids a **required** shader; no shaderpack ships,
`shaderpacks/` goes out empty, and Oculus with nothing selected renders the game normally. *Visuals
Spec §23*'s third profile — *Cinematic Optional = Enhanced + user-selected shader* — is what this
makes reachable.

**It is not free.** Oculus sets three Embeddium mixins to `false` — `render.world.sky`,
`render.entity`, `render.gui.font` — whether or not a shaderpack is selected. The size of that trade
is **unmeasured**; measuring it is a `PERF-PRIORITY` item behind the baseline.

## PERF-RENDER-EMBEDDIUM-EXTRA — Embeddium Extra

```text
ALLOWED / OPTIONAL
NOT INSTALLED
```

**Allowed is not the same as install now.** It adds option toggles — fog, clouds, particles,
weather, block animations, biome colours, 51 option labels in total — and **optimizes nothing by
itself**: every gain comes from a player switching something off. Its value is per-player graceful
degradation of the visual layer, which is an accessibility argument, not a performance one.

Evidence already gathered, so it does not have to be gathered twice: Modrinth `oY2B1pjg`,
`embeddium_extra 0.5.4.4+mc1.20.1-build.131`, LGPL-3.0, Forge `[47.1.3,)`, `embeddium` at
`versionRange = "*"`, every dependency `side = "CLIENT"`. Embeddium 0.3.31's own lang file has
**zero** keys for particles/fog/clouds/weather/sky, so there is no duplication.

**Install decision deferred to the client phase**, where the option UI can actually be looked at.

---

# 10. Explicit reject / not-main decisions

## PERF-REJECT-NVIDIUM — Nvidium

```text
NOT MAIN
```

Potentially large gains for NVIDIA hardware at high render distance, but on Forge 1.20.1 it
typically introduces bridge / rendering complexity and mixed-hardware problems. Embeddium stays the
default. Never a pack requirement.

## PERF-REJECT-VULKANMOD — VulkanMod

```text
EXPERIMENTAL RENDERER BRANCH ONLY
```

It replaces the rendering backend rather than applying a narrow optimization.

Conflict surface:

```text
Embeddium
ImmediatelyFast
Entity Culling
TaCZ
Create
EMF/ETF
Fancy World Animations
Particle Rain
optional shaders
```

Never the default without a dedicated renderer benchmark.

## PERF-REJECT-C2ME — C2ME

```text
NOT MAIN
```

Concurrency-heavy and Fabric-first. Prefer Chunky plus targeted worldgen optimization.

## PERF-REJECT-VMP — VMP

```text
NOT NEEDED
```

Designed for high player counts; the target here is 3–4. The likely bottlenecks are mobs, NPCs,
Create and worldgen — not player count.

---

# 11. Final recommended stack — `PERF-STACK`

```text
RENDER
├─ Embeddium                     PERF-RENDER-EMBEDDIUM              [IN PACK]
├─ ImmediatelyFast               PERF-RENDER-IMMEDIATELYFAST        [IN PACK]
├─ Entity Culling                PERF-RENDER-ENTITY-CULLING         [IN PACK]
├─ Oculus (optional shaders)     PERF-RENDER-OCULUS                 [IN PACK]
├─ Embeddium Extra               PERF-RENDER-EMBEDDIUM-EXTRA        [ALLOWED, NOT INSTALLED]
├─ BadOptimizations              PERF-CLIENT-BADOPTIMIZATIONS       [ADD/TEST]
└─ Legendary Block Entities      PERF-RENDER-LEGENDARY-BLOCK-ENTITIES [ADD/TEST]

MEMORY
├─ ModernFix                     PERF-MEM-MODERNFIX                 [IN PACK]
├─ FerriteCore                   PERF-MEM-FERRITECORE               [IN PACK]
└─ AllTheLeaks                   PERF-MEM-ALLTHELEAKS               [ADD/TEST]

SERVER / LOGIC
├─ ServerCore                    PERF-SERVER-SERVERCORE             [IN PACK]
├─ FastSuite                     PERF-RECIPE-FASTSUITE              [IN PACK]
└─ Clumps                        PERF-ENTITY-CLUMPS                 [IN PACK]

WORLD
├─ Chunky                        PERF-WORLD-PREGEN                  [IN PACK]
└─ Fast Noise                    PERF-EXP-FASTNOISE                 [EXPERIMENT]

GUN SYSTEM
└─ TaCZ: Accelerated             PERF-TACZ-ACCELERATED              [BENCHMARK-GATED]

BACKGROUND
└─ Dynamic FPS                   PERF-CLIENT-DYNAMICFPS             [ADD/OPTIONAL]

PROFILING
└─ spark                         PERF-PROFILE-SPARK                 [DEV CORE]

CONDITIONAL
├─ Let Me Despawn                PERF-EXP-LETMEDESPAWN
└─ Alternate Current             PERF-EXP-ALTERNATE-CURRENT

EXPERIMENTAL ONLY
├─ Canary                        PERF-EXP-CANARY
├─ AI Improvements               PERF-EXP-AI-IMPROVEMENTS
├─ Smooth Boot Reloaded          PERF-EXP-SMOOTHBOOT
├─ VulkanMod                     PERF-REJECT-VULKANMOD
└─ Nvidium                       PERF-REJECT-NVIDIUM
```

---

# 12. Benchmark rules — `PERF-BENCH-RULES`

Always compare:

```text
before
vs
after
```

Record exactly:

```text
commit · mod list · config · seed · coordinates · entity count
render distance · simulation distance · Java args · RAM allocation
driver / GPU / CPU · client or server role
```

**Do not compare from memory.**

Client metrics:

```text
Average FPS · 1% low · frame time · CPU · GPU · RAM · VRAM
```

Server metrics:

```text
TPS · MSPT · tick percentiles · entity tick time
chunk generation time · pathfinding cost · memory · GC
```

Frame-time stability and 1% lows matter more than peak FPS.

---

# 13. Standard benchmark zones — `PERF-BENCH-ZONES`

**A — Empty baseline.** Low-entity area, no factory, no colony.

**B — Create factory.** Small / medium / large. Measure kinetic networks, contraptions, items and
processing.

> Operational rule: stop factories when storage is full where practical, using Threshold Switches,
> Clutches and control logic.

**C — MineColonies.** 10 / 25 / 50 / 75 NPCs. Measure pathfinding, rendering, MSPT and memory.

**D — Horde arena.** 50 / 100 / 150 / 200 mobs, across idle, moving, attacking walls, automatic
gunfire, rain and particles. **This is the primary stress benchmark.**

**E — Wildlife.** 25 / 50 / 100 entities.

**F — Dragon.** Single dragon plus combat, terrain and particles.

**G — Create train.** Fast travel through multiple chunks, biomes and stations.

**H — Season 2 vehicles.** Valkyrien / Clockwork / Warium, only after Alpha, benchmarked separately.

---

# 14. TaCZ / sound-AI stress test — `PERF-BENCH-TACZ`

Test semi-auto, burst, full-auto, and multiple players firing.

Measure MSPT, frame time, particles, sound-attraction AI and pathfinding.

Special risk:

```text
gunfire
→ many mobs react
→ many path searches
→ MSPT spike
```

Profile Attract to Sound before rate-limiting it or writing a custom integration.

---

# 15. Entity budget — `PERF-BUDGET-ENTITY`

If server load becomes excessive, reduce in this order:

```text
1. ambient decorative wildlife
2. small critters
3. duplicate species
4. common passive density
5. Horde cap if necessary
```

Cut last:

```text
Create identity
MineColonies identity
core hostile encounters
dragons
```

---

# 16. Visual performance budget — `PERF-BUDGET-VISUAL`

If client load becomes excessive, reduce in this order:

```text
1. extra particles
2. decorative 3D world elements
3. dense foliage
4. optional Fresh Animations coverage
5. weather particle density
```

**Do not remove gameplay systems to save visual FPS first.**

---

# 17. RAM and long-session testing — `PERF-BENCH-LONGSESSION`

Do not assume more allocated RAM is faster; an oversized heap can worsen GC pause behaviour.

Test practical client allocations:

```text
8 GB · 10 GB · 12 GB
```

Choose the smallest stable allocation that avoids memory pressure in representative gameplay.

Long-session test:

```text
30 min · 2 h · 4 h
```

Track RAM growth, GC frequency, FPS degradation, MSPT drift, entity accumulation and chunk-ticket
accumulation.

---

# 18. Worldgen tournament — `PERF-WORLD-TOURNAMENT`

Before persistent multiplayer play, use Chunky to pregenerate a moderate operational region
(`PERF-WORLD-PREGEN`).

When comparing worldgen options:

```text
Base
Biomes O' Plenty
Regions Unexplored
Both
```

measure chunk-generation time, train-travel stutter, RAM, MSPT and world size.

**Worldgen is not chosen by visuals alone.** ADR 0006 chose Biomes O' Plenty on quality; the
performance half of that comparison has not been run.

---

# 19. One major variable at a time — `PERF-METHOD-ONEVAR`

Preferred:

```text
Baseline → + BadOptimizations → measure → keep/revert
Baseline → + AllTheLeaks     → long-run test → keep/revert
```

Avoid:

```text
+ 8 optimization mods
→ performance changes
→ nobody knows which mod caused it
```

---

# 20. Documentation — `PERF-DOCS`

Create and maintain:

```text
docs/performance-baseline.md
docs/performance-benchmarks.md
docs/performance-conflicts.md
```

Each run records:

```text
date · commit · mods changed · configs changed · scenario · metrics · verdict
```

---

# 21. Performance profiles — `PERF-PROFILES`

**Standard.** All approved CORE performance mods.

**Low-End Client.** Same gameplay, lower particles, Fresh Animations coverage, foliage density,
weather density and render distance. `PERF-RENDER-EMBEDDIUM-EXTRA` is the intended mechanism for
this if it is ever installed.

**Experimental.** Controlled testing only: Fast Noise, Let Me Despawn, Alternate Current, Canary,
VulkanMod, Nvidium.

---

# 22. Priority order — `PERF-PRIORITY`

```text
1. spark                       <- the only item that does not need a baseline
2. establish client/server baseline
3. AllTheLeaks
4. BadOptimizations
5. Dynamic FPS
6. Legendary Block Entities
7. Fast Noise
8. Let Me Despawn
9. Alternate Current
10. broad experiments only if profiling justifies them
```

Items 3–10 are gated on item 2. Item 2 needs a launched client, which is this project's standing
blocker (`docs/OPEN-WORK-LEDGER.md`).

---

# 23. Definition of done — client — `PERF-DOD-CLIENT`

- stable frame pacing in normal play
- main city remains playable
- Horde + rain + TaCZ remains readable
- 1% lows do not collapse catastrophically
- visual layer does not dominate frame time
- no progressive memory leak
- no rendering corruption

# 24. Definition of done — server — `PERF-DOD-SERVER`

- normal gameplay stays at 20 TPS
- safe Horde caps are known
- MineColonies scaling is documented
- Create factories have operational limits
- worldgen spikes are controlled
- automatic fire does not cause pathological AI spikes
- long sessions do not progressively degrade

---

# 25. Hard rules — `PERF-RULES`

## DO

1. Profile before optimizing.
2. Keep Embeddium as primary renderer.
3. Keep ModernFix + FerriteCore.
4. Keep Entity Culling + ImmediatelyFast.
5. Keep ServerCore + FastSuite + Clumps.
6. Use Chunky operationally.
7. Add spark as dev/admin core.
8. Test AllTheLeaks for long-session stability.
9. Test BadOptimizations as client micro-optimization.
10. Prefer Legendary Block Entities over EBE / FastChest bridge approaches.
11. Track 1% lows and frame times, not just average FPS.
12. Benchmark Hordes at controlled entity counts.
13. Keep experimental optimizers isolated on their own branch.
14. Verify after every performance-stack change.
15. **Cite `PERF-*` ids, never section numbers** (`PERF-CITE`).

## DO NOT

1. Do not migrate loaders only for performance.
2. Do not add Fabric API / Sinytra just to obtain optimization mods.
3. Do not bridge Lithium into Forge 1.20.1.
4. Do not put C2ME into main.
5. Do not add VMP for a 3–4 player server.
6. Do not blind-stack AI Improvements.
7. Do not blind-stack Canary.
8. Do not make VulkanMod the default renderer.
9. Do not make Nvidium a pack requirement.
10. **Do not install OptiFine.**
11. Do not claim a performance win without evidence.
12. Do not sacrifice pack identity merely to chase benchmark numbers.

---

# 26. Final feature definition — `PERF-DEFINITION`

> **The Performance Layer makes Industrial Civilization Survival stable under the systems that
> define the pack: large Create factories, MineColonies settlements, Horde events, tactical
> gunfights, wildlife, weather, world generation and long multiplayer sessions. It favors targeted,
> measured optimization over blind stacking.**

Guiding sentence:

> **Stable 20 TPS, stable frame times, predictable memory usage, and enough headroom for the
> civilization to grow.**

---

# 27. Provenance — what this merge changed

Written for #93, from v1 and v2. Neither original is authority any more.

**Taken from v1, because v2 dropped them.** The OptiFine prohibition; Embeddium's compatibility test
list; ModernFix's pin-and-do-not-toggle rule; the Entity Culling constraint; ServerCore's Critical
Exclusions and Philosophy; FastSuite's test matrix; the Chunky vs Chunk-Pregenerator decision;
TaCZ: Accelerated and its test matrix; pregeneration strategy and verification.

**Taken from v2, because v1 never had them.** BadOptimizations, AllTheLeaks, Dynamic FPS, Legendary
Block Entities, spark, Fast Noise; the Fabric→Forge decision table; the four explicit rejects;
benchmark zones A–H; the TaCZ stress test; the entity and visual budgets; long-session testing; the
worldgen tournament; one-variable-at-a-time; both Definitions of Done; the priority order.

**Decided here, in neither original.**

- TaCZ: Accelerated is `BENCHMARK-GATED CANDIDATE`, with a written promotion path. v1 contradicted
  itself about it and v2 deleted it; neither is a status.
- Chunk-Pregenerator is `ALTERNATIVE / NOT SELECTED` rather than absent.
- Oculus and Embeddium Extra get their own ids, because #91 shipped one and the other is a live
  question. Embeddium Extra is `ALLOWED / OPTIONAL / NOT INSTALLED` — allowed is not install-now.
- `PERF-*` ids exist at all, and `PERF-CITE` makes citing a section number a rule violation.
