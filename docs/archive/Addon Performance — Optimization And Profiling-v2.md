<!-- SUPERSEDED — NOT AUTHORITY. Do not cite this file. -->

> # ⛔ SUPERSEDED — Performance Spec **v2**
>
> **This file is history. An agent must not treat it as authority.**
>
> The canonical Performance Spec is
> [`docs/Addon Performance — Optimization & Profiling.md`](../Addon%20Performance%20%E2%80%94%20Optimization%20%26%20Profiling.md),
> which merges this file with v1 and carries stable `PERF-*` identifiers (#93).
>
> **Everything new here was kept.** But this file was a summary, and summarising dropped technical
> constraints that were load-bearing: the OptiFine prohibition, ServerCore's Critical Exclusions,
> the Entity Culling constraint, the Embeddium / ModernFix / FastSuite rules, TaCZ: Accelerated and
> Chunk-Pregenerator. Reading it alone gives an incomplete spec — that is the regression #93 fixed.
>
> **Its `§N` numbers are dead as citations.** See `PERF-CITE` in the canonical file.

---

# Addon Spec — Performance Optimization & Profiling
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Repository:** `xenodeve/minecraft-100day`  
> **Platform:** Minecraft 1.20.1 / Forge / Java 17  
> **Target team:** 3 players baseline, 4 players full team  
> **Pack profile:** 100+ mods; heavy Create, MineColonies, Hordes, TaCZ, worldgen and visual systems  
>
> Standalone performance architecture and implementation handoff.

---

# 1. Philosophy

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

Every optimization change should have evidence: FPS/1% low, MSPT/TPS, RAM, startup time, worldgen time, entity/render cost, or long-session stability.

---

# 2. Loader Decision

Remain on:

```text
Minecraft 1.20.1
Forge 47.x
```

Do not migrate to Fabric/NeoForge only for performance. Fabric has a lightweight baseline, but this pack's real cost is the heavy ecosystem already built around Forge: Create/addons, TaCZ, MineColonies, Ice & Fire, Born in Chaos, KubeJS, IE, SecurityCraft, Hordes, AI integrations, configs and quests.

---

# 3. Performance Layers

```text
Rendering
Memory
Client micro-optimization
Server/game logic
Recipe processing
Entity count
World generation
Background resource usage
Profiling
Experimental broad optimizers
```

Keep the layers conceptually separate so overlapping optimizers are not stacked blindly.


# 4. Approved CORE Stack

## Rendering

### Embeddium — CORE
Primary Forge renderer optimization. Keep as the default renderer.

### ImmediatelyFast — CORE
Optimizes immediate-mode rendering paths: entities, particles, text, GUI and related rendering.

### Entity Culling — CORE
Avoid rendering entities/block entities hidden behind geometry. High value in cities, warehouses, factories, Horde fights and animal-heavy areas.

## Memory

### ModernFix — CORE
General memory, startup, cache and bugfix optimization.

### FerriteCore — CORE
Reduces memory use from block states/models/registries. Use client/server where supported.

## Server / Logic

### ServerCore — CORE
Server-side ticking/entity/spawn optimization. Test carefully with Enhanced AI, Improved Mobs, The Hordes, Attract to Sound, MineColonies and In Control!.

### FastSuite — CORE
Recipe-processing optimization for the large Create/KubeJS recipe graph.

### Clumps — CORE
Merges XP orbs to reduce entity count after Horde fights, farms and large combat.

## World Operations

### Chunky — CORE OPERATIONAL
Pregenerate a moderate operational radius before persistent play. Conceptual target: roughly 5k–10k blocks, not an absurd 50k by default.


# 5. High-Priority Add Candidates

## BadOptimizations — ADD / TEST
Client micro-optimizations that complement Embeddium + ImmediatelyFast + Entity Culling.

Especially relevant after adding visual systems such as Grassier Grass, Particle Rain, Subtle Effects, Fancy World Animations and EMF/ETF.

Acceptance:
- no rendering corruption
- no compatibility regression
- measurable or neutral frame-time result

## AllTheLeaks — ADD / TEST
Long-session memory-leak mitigation.

Test:
```text
30 min
2 h
4 h
```

Record:
- heap growth
- GC frequency
- FPS degradation
- MSPT drift
- post-world-reload memory

Keep risky ingredient-dedupe-style features OFF unless proven safe for this exact pack.

## Dynamic FPS — CLIENT QoL CANDIDATE
Reduces CPU/GPU usage while minimized, unfocused or idle. Does not primarily improve active gameplay FPS, but is useful when players keep Discord/browser/voice tools open.

## Legendary Block Entities — ADD / TEST
Forge-native block-entity rendering optimization candidate and preferred direction over Fabric Enhanced Block Entities / FastChest bridge solutions.

High-value for:
- warehouses
- MineColonies
- chest rooms
- stations
- industrial storage
- cities

Test with Embeddium, ModernFix and resource packs.


# 6. Profiling Tool

## spark — DEV/ADMIN CORE

spark does not make the game faster by itself. It identifies what is actually slow.

Use to profile:
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

Do not add broad optimizers simply because they are popular.


# 7. Experimental Candidates

## Fast Noise — WORLDGEN EXPERIMENT
Potential noise/biome/surface-generation optimization.

Test with identical seeds and compare:
- terrain
- biome placement
- structures
- Ice & Fire worldgen
- BOP / Regions Unexplored behavior
- generation time
- MSPT / chunk hitching

Reject if it changes world output unexpectedly.

## Let Me Despawn — ENTITY-LIFETIME EXPERIMENT
Useful if equipment-bearing mobs become unintentionally persistent.

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

## Alternate Current — CONDITIONAL EXPERIMENT
Redstone-dust optimization.

Only useful if profiling shows significant Vanilla-redstone cost. Test Create, SecurityCraft, MineColonies and industrial control logic.

## Canary — EXPERIMENTAL BRANCH ONLY
Broad Lithium-style optimization. Potentially powerful but touches AI, physics, game logic, chunks and collections.

Use only in:
```text
perf/canary-experiment
```

Never blind-stack into main.

## AI Improvements — DEFER
AI already has many layers:
```text
Enhanced AI
Improved Mobs
Attract to Sound
The Hordes
ServerCore
In Control!
```

Only reconsider if spark proves AI/pathfinding is the bottleneck.

## Smooth Boot Reloaded — LOW PRIORITY
Startup scheduling only. Does not solve Horde TPS, Create load, MineColonies load or gameplay FPS.


# 8. Fabric Performance Mods and Forge Decisions

| Fabric-side item | Forge 1.20.1 decision |
|---|---|
| Sodium | Use **Embeddium** |
| Sodium Extra | Optional **Embeddium Extra** |
| Reese's Sodium Options | Not required; avoid redundant UI |
| Mod Menu | Not applicable; Forge has Mods screen |
| Fabric API | Do not add |
| Fabric Language Kotlin | Use **Kotlin for Forge** only when required |
| Cloth Config | Forge native dependency; only when required |
| Architectury | Forge native dependency; only when required |
| YACL | Forge native dependency; only when required |
| MidnightLib | Forge native dependency; only when required |
| Lithium | Do not bridge; use ServerCore/ModernFix/FastSuite |
| C2ME | Do not use in main |
| More Culling | Do not bridge; Entity Culling + Embeddium already cover core need |
| Enhanced Block Entities | Prefer **Legendary Block Entities** |
| VMP | Not needed for 3–4 players |
| Iris | Optional Forge shader path is **Oculus** |
| Continuity | Visual feature, not performance; do not add under this spec |
| Zoomify | QoL, not performance |

Libraries are dependencies, not optimization mods. Install only when something actually requires them.


# 9. Explicit Reject / Not-Main Decisions

## Nvidium — NOT MAIN
Potentially large gains for NVIDIA/high render distance, but Forge 1.20.1 typically introduces bridge/rendering complexity and mixed-hardware issues. Keep Embeddium as the default.

## VulkanMod — EXPERIMENTAL RENDERER BRANCH ONLY
It replaces the rendering backend rather than applying a narrow optimization.

Potential conflict surface:
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

Never make default without a dedicated renderer benchmark.

## C2ME — NOT MAIN
Concurrency-heavy and Fabric-first. Prefer Chunky + targeted worldgen optimization.

## VMP — NOT NEEDED
Designed for high player counts; our target is 3–4 players. Our likely bottlenecks are mobs, NPCs, Create and worldgen, not player count.


# 10. Final Recommended Stack

```text
RENDER
├─ Embeddium
├─ ImmediatelyFast
├─ Entity Culling
├─ BadOptimizations              [ADD/TEST]
└─ Legendary Block Entities      [ADD/TEST]

MEMORY
├─ ModernFix
├─ FerriteCore
└─ AllTheLeaks                   [ADD/TEST]

SERVER / LOGIC
├─ ServerCore
├─ FastSuite
└─ Clumps

WORLD
├─ Chunky
└─ Fast Noise                    [EXPERIMENT]

BACKGROUND
└─ Dynamic FPS                   [ADD/OPTIONAL]

PROFILING
└─ spark                         [DEV CORE]

CONDITIONAL
├─ Let Me Despawn
└─ Alternate Current

EXPERIMENTAL ONLY
├─ Canary
├─ AI Improvements
├─ Smooth Boot Reloaded
├─ VulkanMod Forge Port
└─ Nvidium bridge setup
```


# 11. Benchmark Rules

Always compare:

```text
before
vs
after
```

Record exact:
- commit
- mod list
- config
- seed
- coordinates
- entity count
- render distance
- simulation distance
- Java args
- RAM allocation
- driver/GPU/CPU
- client/server role

Do not compare from memory.

Client metrics:
```text
Average FPS
1% low
frame time
CPU
GPU
RAM
VRAM
```

Server metrics:
```text
TPS
MSPT
tick percentiles
entity tick time
chunk generation time
pathfinding cost
memory
GC
```

Frame-time stability and 1% lows matter more than peak FPS.


# 12. Standard Benchmark Zones

## A — Empty Baseline
Low-entity area, no factory, no colony.

## B — Create Factory
Test small / medium / large factories.
Measure kinetic networks, contraptions, items and processing.

Operational rule:
> Stop factories when storage is full where practical using Threshold Switches, Clutches and control logic.

## C — MineColonies
Test:
```text
10 NPCs
25 NPCs
50 NPCs
75 NPCs
```

Measure pathfinding, rendering, MSPT and memory.

## D — Horde Arena
Test:
```text
50 mobs
100 mobs
150 mobs
200 mobs
```

Scenarios:
```text
idle
moving
attacking walls
automatic gunfire
rain
particles
```

This is the primary stress benchmark.

## E — Wildlife
Test 25 / 50 / 100 entities.

## F — Dragon
Single dragon + combat + terrain + particles.

## G — Create Train
Fast travel through multiple chunks/biomes/stations.

## H — Season 2 Vehicles
Valkyrien/Clockwork/Warium only after Alpha; benchmark separately.


# 13. TaCZ / Sound-AI Stress Test

Test:
```text
semi-auto
burst
full-auto
multiple players firing
```

Measure:
- MSPT
- frame time
- particles
- sound-attraction AI
- pathfinding

Special risk:

```text
gunfire
→ many mobs react
→ many path searches
→ MSPT spike
```

Profile Attract to Sound before rate-limiting or custom integration.


# 14. Entity Budget

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


# 15. Visual Performance Budget

If client load becomes excessive, reduce in this order:

```text
1. extra particles
2. decorative 3D world elements
3. dense foliage
4. optional Fresh Animations coverage
5. weather particle density
```

Do not remove gameplay systems to save visual FPS first.


# 16. RAM and Long-Session Testing

Do not assume more allocated RAM is always faster; oversized heaps can increase GC pause behavior.

Test practical client allocations such as:
```text
8 GB
10 GB
12 GB
```

Choose the smallest stable allocation that avoids memory pressure in representative gameplay.

Long-session test:
```text
30 min
2 h
4 h
```

Track:
```text
RAM growth
GC frequency
FPS degradation
MSPT drift
entity accumulation
chunk-ticket accumulation
```


# 17. World Pregeneration / Worldgen Tournament

Before persistent multiplayer play, use Chunky to pregenerate a moderate operational region.

When comparing:
```text
Base
Biomes O' Plenty
Regions Unexplored
Both
```

also measure:
```text
chunk-generation time
train-travel stutter
RAM
MSPT
world size
```

Worldgen is not chosen by visuals alone.


# 18. One Major Variable at a Time

Preferred:

```text
Baseline
→ + BadOptimizations
→ measure
→ keep/revert

Baseline
→ + AllTheLeaks
→ long-run test
→ keep/revert
```

Avoid:

```text
+ 8 optimization mods
→ performance changes
→ nobody knows which mod caused it
```


# 19. Documentation

Create/maintain:

```text
docs/performance-baseline.md
docs/performance-benchmarks.md
docs/performance-conflicts.md
```

Each run records:
```text
date
commit
mods changed
configs changed
scenario
metrics
verdict
```


# 20. Performance Profiles

## Standard
All approved CORE performance mods.

## Low-End Client
Same gameplay, lower:
```text
particles
Fresh Animations coverage
foliage density
weather density
render distance
```

## Experimental
Only for controlled testing:
```text
Fast Noise
Let Me Despawn
Alternate Current
Canary
VulkanMod
Nvidium bridge
```


# 21. Priority Order

Recommended next work:

```text
1. spark
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


# 22. Definition of Done — Client

- stable frame pacing in normal play
- main city remains playable
- Horde + rain + TaCZ remains readable
- 1% lows do not collapse catastrophically
- visual layer does not dominate frame time
- no progressive memory leak
- no rendering corruption

# 23. Definition of Done — Server

- normal gameplay stays at 20 TPS
- safe Horde caps are known
- MineColonies scaling is documented
- Create factories have operational limits
- worldgen spikes are controlled
- automatic fire does not cause pathological AI spikes
- long sessions do not progressively degrade


# 24. Claude Code Hard Rules

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
10. Prefer Legendary Block Entities over EBE/FastChest bridge approaches.
11. Track 1% lows/frame times, not just average FPS.
12. Benchmark Hordes at controlled entity counts.
13. Keep experimental optimizers isolated.
14. Verify after every performance-stack change.

## DO NOT
1. Do not migrate loaders only for performance.
2. Do not add Fabric API/Sinytra just to obtain optimization mods.
3. Do not bridge Lithium into Forge 1.20.1.
4. Do not put C2ME into main.
5. Do not add VMP for a 3–4 player server.
6. Do not blind-stack AI Improvements.
7. Do not blind-stack Canary.
8. Do not make VulkanMod the default renderer.
9. Do not make Nvidium a pack requirement.
10. Do not claim a performance win without evidence.
11. Do not sacrifice pack identity merely to chase benchmark numbers.


# 25. Final Feature Definition

> **The Performance Layer makes Industrial Civilization Survival stable under the systems that define the pack: large Create factories, MineColonies settlements, Horde events, tactical gunfights, wildlife, weather, world generation and long multiplayer sessions. It favors targeted, measured optimization over blind stacking.**

Guiding sentence:

> **Stable 20 TPS, stable frame times, predictable memory usage, and enough headroom for the civilization to grow.**
