# Benchmark Plan — Performance Benchmark Harness

> **Project:** Industrial Civilization Survival  
> **Repository:** `xenodeve/minecraft-100day`  
> **Target:** Minecraft 1.20.1 / Forge 47.4.23 / Java 17  
> **Current pack state:** 127 mods (`0.2.2-alpha`)  
> **Purpose:** Determine, with reproducible evidence, what limits FPS/TPS and what each optimization mod, shader, and subsystem actually costs or improves.

---

> **Status: ADOPTED with four corrections (#133).** Cite this document by its stable
> `PERF-HARNESS-*` ids, never by section number — `PERF-CITE` exists because v1 §5 and v2 §5 of the
> Performance Spec were once different rules.
>
> **1. `benchmarks/` must be excluded from the pack before it exists.** `.packwizignore` did not
> cover it; without that line `packwiz refresh` indexes `results.csv`, every `scenarios/*.json` and
> every capture, and a friend downloading the pack receives our CapFrameX exports. Fixed in #133.
>
> **2. `C-UPFG-07` is RESOLVED, and the plan should still gate on it.** The client now reports
> `OpenGL Renderer: NVIDIA GeForce RTX 4070 SUPER/PCIe/SSE2` — read from `latest.log` in both
> instances on 2026-08-28, not taken on trust. Phase 1 is unblocked. **Keep the check anyway:** a GPU
> binding that moved once can move again on a driver update, and `PERF-HARNESS-IDENTITY` only
> records the field. Read `OpenGL Renderer:` before every capture and abort if it names the wrong
> card — a recorded field catches it after the run, a precondition catches it before.
>
> **3. `Observable = F9` collides with a reserved key.** `Alt+F9` is NVIDIA overlay recording, which
> is why the shader reload moved to F8 in #125. After #123/#125 the unbound function keys are F1, F3,
> F4 and F9, of which F1 and F3 are vanilla-reserved — **use `F4`**.
>
> **4. Observable is not in the roster and must never ship.** It is a DEV-only profiler. Keep it to a
> benchmark variant built from a branch; never a `mods/*.pw.toml` on `main`.
>
> **Two free wins.** `PERF-HARNESS-SETTINGS` fixes the baseline at **Shader OFF**, which also settles
> `C9` (does the 2 GB vertex-buffer growth stop with shaders off?) and `C10` (what does
> `Flywheel Backend:` read with shaders off?). Both are two log lines during a run Phase 1 performs
> anyway — read them then rather than running twice.
>
> **What is already in the repo, so it is cross-referenced rather than rebuilt:** Zones A–**H** and
> the A/B recovery plan live in `docs/performance-benchmarks.md`; the run / world / machine identity
> templates live in `docs/performance-baseline.md`; `PERF-BENCH-TACZ`, `PERF-BENCH-LONGSESSION` and
> `PERF-WORLD-TOURNAMENT` are defined there too. This document owns the **tool stack**, the
> **capture storage layout**, the **metadata schema**, the **leave-one-out matrix** and the
> **acceptance rules**.

---

## 0. Core Principle · `PERF-HARNESS-PRINCIPLE`

The benchmark system follows the repository's existing rule:

```text
Baseline → change ONE variable → measure → keep / revert / inconclusive
```

Never use:

```text
+ several mods
→ performance changed
→ assume every mod helped
```

A successful boot is only a compatibility smoke test. It is not a performance result.

---

# 1. Questions This Benchmark Must Answer · `PERF-HARNESS-QUESTIONS`

The harness must be able to answer all of these independently.

### Client / Rendering

- What is the current Average FPS?
- What is the 1% low?
- What is median / P95 / P99 frametime?
- Is the client CPU-bound or GPU-bound?
- Which render-thread paths are expensive?
- How much does Create rendering cost?
- How much do particles cost?
- How much do EMF / ETF / animations cost?
- How much does each shader preset cost?
- Which shader pass / draw-call group is expensive?

### Server / Integrated Server

- Is TPS stable at 20?
- What is MSPT median / P95 / P99?
- Which mods dominate entity ticking?
- Which mobs / entities dominate simulation cost?
- How expensive is pathfinding?
- How much does MineColonies scale with NPC count?
- How much does a Horde + TaCZ fight cost?
- How much does Create automation cost server-side?

### World Generation

- How much does C2ME improve chunk generation?
- How much does Noisium improve generation?
- Does C2ME + Noisium interact positively or negatively?
- How large are train / fast-travel chunk hitch spikes?
- Does the world output remain correct?

### Memory

- What heap size is actually required?
- How often does GC run?
- Are frametime spikes correlated with GC?
- Does RAM usage drift over 30 min / 2 h / 4 h?
- Does reloading a world release memory?

---

# 2. Tool Stack · `PERF-HARNESS-TOOLS`

## PERF-TOOL-CAPFRAMEX — Client Frame Benchmark

**Primary tool for final client numbers.**

Collect:

```text
Average FPS
1% low
0.2% low (optional additional metric)
frametime median
frametime P95
frametime P99
frametime graph
GPU utilization
GPU clock
GPU power
VRAM
CPU utilization
```

Use CapFrameX / PresentMon capture for the final FPS run.

Do not run heavy Java profilers during the final reference capture unless the specific test is a diagnostic run.

## PERF-TOOL-SPARK — Minecraft / Mod CPU Attribution

Already in the pack.

Use Spark for:

```text
render thread
server thread
entity ticking
pathfinding
chunk tasks
Create
MineColonies
TaCZ
Ice & Fire
Enhanced AI
Attract to Sound
GC / heap overview
```

Two profiling classes are required:

### Normal profile

Profile the complete workload for approximately 60 seconds.

Purpose:

```text
Where does total CPU time go?
```

### Slow-spike profile

Capture only unusually slow ticks.

Purpose:

```text
What causes the worst stutters / >100 ms ticks?
```

Do not treat inclusive percentages as additive when one mod calls another library.

## PERF-TOOL-OBSERVABLE — World Hotspot Locator

**DEV-only profiler. Remove / disable for final FPS numbers.**

Use it to identify expensive:

```text
entities
block entities
specific locations
```

Especially useful for:

```text
MineColonies settlements
Create factories
storage rooms
mob farms
dragon encounters
large Horde fights
```

Set its profiling key away from `R` because `R` is reserved for TaCZ reload.

Suggested dev key:

```text
Observable = F9
TaCZ Reload = R
Shader Reload = F8
```

## PERF-TOOL-JFR — JVM Diagnostics

Use Java Flight Recorder + JDK Mission Control for diagnostic runs.

Capture:

```text
CPU samples
thread activity
object allocation
GC
locks / contention
file I/O
class loading
```

Use this when Spark says Java is busy but the reason is unclear, or when GC / allocation churn is suspected.

JFR diagnostic runs are separate from final FPS captures.

## PERF-TOOL-MC-PROFILER — Vanilla F3+L

Use Minecraft's built-in profiler as a standardized evidence artifact.

Store the generated profiling ZIP with the benchmark run.

Purpose:

```text
frame timing
JVM metrics
chunk dispatcher metrics
Minecraft internal profiler data
```

## PERF-TOOL-NSIGHT — Shader / GPU Deep Dive

Use NVIDIA Nsight Graphics only when a shader or render path is proven to be GPU-heavy.

Use it to inspect:

```text
OpenGL draw calls
framebuffers
textures
linked shader programs
CPU cost of GL calls
GPU activity of GL calls
expensive render passes
```

This is an advanced diagnostic tool, not part of every benchmark run.

---

# 3. Benchmark Run Identity · `PERF-HARNESS-IDENTITY`

Every run MUST record:

```text
date
commit
pack version
MODLIST digest
benchmark variant
config state: fresh / reused
client / integrated server / dedicated server
```

Machine:

```text
CPU
GPU
GPU driver
system RAM
JVM RAM allocation
Java runtime
Java arguments
OS
```

World:

```text
seed
dimension
coordinates
yaw
pitch
time of day
weather
entity count
render distance
simulation distance
```

Visual:

```text
resolution
fullscreen / windowed
VSync
FPS cap
resource packs
shader pack
shader preset
upscaling
frame generation
```

A run missing any of these is not comparable and should be marked invalid.

---

# 4. Standard Client Settings · `PERF-HARNESS-SETTINGS`

For the primary CPU/render baseline:

```text
VSync                  OFF
FPS cap                Unlimited
Shader                 OFF
Upscaling              OFF
Frame Generation       OFF
Resolution             Native display resolution
GUI state              Closed
F3 screen              Closed during capture
```

Render and simulation distance must be chosen once for the benchmark suite and then frozen.

Do not change graphics settings between A/B runs unless that setting is the variable being tested.

---

# 5. Run Timing · `PERF-HARNESS-TIMING`

For every client benchmark:

```text
1. Launch clean JVM
2. Load benchmark world
3. Move to exact benchmark coordinates
4. Wait for chunk / shader / asset warm-up
5. Warm-up: 60–90 seconds
6. Capture: 60 seconds
7. Repeat 3 times
8. Use median of the 3 runs
```

For a shader change:

```text
change shader / preset
→ allow shader compilation to finish
→ wait another 60 seconds
→ begin capture
```

For a mod change:

```text
full Minecraft restart required
```

Do not benchmark immediately after joining the world.

---

# 6. Canonical Benchmark Zones · `PERF-HARNESS-ZONES`

Use the repository's existing Zone A–G layout.

## Zone A — Empty Baseline

Purpose:

```text
control
renderer baseline
low entity count
no factory
no colony
```

Measure:

```text
Avg FPS
1% low
P99 frametime
CPU / GPU utilization
heap
VRAM
```

## Zone B — Create Factory

Prepare fixed factory sizes:

```text
B1 Small
B2 Medium
B3 Large
```

Record:

```text
number of kinetic networks
contraptions
moving items
processing machines
block entities
```

Primary targets:

```text
Colorwheel
Create Better FPS
Embeddium
ImmediatelyFast
Legendary Block Entities
Create server simulation
```

## Zone C — MineColonies

Fixed NPC counts:

```text
10
25
50
75
```

Measure:

```text
Avg FPS
1% low
MSPT
pathfinding
entity tick cost
heap
```

## Zone D — Horde Arena

Primary stress benchmark.

Fixed entity counts:

```text
50
100
150
200
```

Sub-scenarios:

```text
idle
moving
attacking walls
TaCZ semi-auto
TaCZ full-auto
rain
particles
full combat
```

Primary targets:

```text
Enhanced AI
Improved Mobs
Attract to Sound
The Hordes
TaCZ
Particle Core
Radium
ServerCore
```

## Zone E — Wildlife

Fixed total wildlife:

```text
25
50
100
```

Track species composition.

Primary targets:

```text
Naturalist
Ice & Fire ambient mobs
Critters and Companions
Ecologics
entity AI
```

## Zone F — Dragon

One fixed dragon encounter.

Record:

```text
dragon type
dragon stage / size
nearby mobs
terrain damage
particles
combat state
```

Measure both client and server cost.

## Zone G — Create Train / Fast Travel

Use one fixed route.

Record:

```text
route length
average travel speed
number of stations
number of new chunks
number of already-generated chunks
```

Measure:

```text
frametime spikes
chunk generation time
MSPT
chunk worker load
```

Primary targets:

```text
C2ME
Noisium
Chunky/pregenerated-world effect
Create train rendering
```

---

# 7. Current Optimization-Mod Attribution Plan · `PERF-HARNESS-LEAVEONEOUT`

Current 0.2.2-alpha contains:

```text
Colorwheel
Create Better FPS
Particle Core
Radium Re-Reforged
Thulium
C2ME Forge
Noisium
```

Because several were added before individual benchmarks existed, use a **leave-one-out** recovery method against the current full stack.

## A — Current Full Stack

```text
A = current main
```

This is the current-player experience baseline.

## B — Remove One Optimizer

```text
B1 = A - Colorwheel
B2 = A - Create Better FPS
B3 = A - Particle Core
B4 = A - Radium Re-Reforged
B5 = A - Thulium
B6 = A - C2ME
B7 = A - Noisium
```

Run only the zones relevant to each mod:

| Variant | Required zones |
|---|---|
| -Colorwheel | A, B |
| -Create Better FPS | A, B |
| -Particle Core | A, D |
| -Radium | C, D, E, F |
| -Thulium | A, B, D |
| -C2ME | G + worldgen |
| -Noisium | G + worldgen |

Calculate:

```text
Δ Avg FPS
Δ 1% low
Δ P99 frametime
Δ MSPT P95
Δ chunk generation time
```

If removing the mod makes performance worse:

```text
the mod is providing measurable benefit
```

If the result is within run-to-run noise:

```text
INCONCLUSIVE
```

Do not mark `keep` purely because the game launches.

---

# 8. Interaction Tests · `PERF-HARNESS-INTERACTION`

Individual results do not necessarily add together.

## C1 — Create Pair

```text
A - Colorwheel - Create Better FPS
```

Purpose:

```text
measure combined Create-render optimization
detect overlap / interaction
```

## C2 — Worldgen Pair

```text
A - C2ME - Noisium
```

Compare against:

```text
A
A - C2ME
A - Noisium
```

This gives:

```text
C2ME contribution
Noisium contribution
combined contribution
interaction
```

If individual gains do not approximately explain the combined result, record the interaction in `docs/performance-conflicts.md`.

---

# 9. Shader Benchmark Matrix · `PERF-HARNESS-SHADERMATRIX`

Shader testing is separate from optimizer testing.

Use the same commit and same Zone.

Recommended shader test zones:

```text
Zone A — clean GPU comparison
Zone B — Create + shader stress
Zone D — combat + particles + shader stress
```

Matrix:

```text
S0 Shader OFF

S1 Shader A — Low
S2 Shader A — Medium
S3 Shader A — High

S4 Shader B — Low
S5 Shader B — Medium
S6 Shader B — High
```

For every shader run record:

```text
Avg FPS
1% low
P99 frametime
GPU Busy / utilization
GPU clock
GPU power
VRAM
CPU utilization
```

Interpretation:

```text
GPU time rises close to total frame time
→ GPU-bound shader cost

GPU time remains low but frametime rises
→ CPU / OpenGL / render-thread overhead
```

Only use Nsight after a shader has already been identified as expensive.

---

# 10. CPU-Bound Diagnostic Protocol · `PERF-HARNESS-CPUBOUND`

When:

```text
FPS low
GPU utilization clearly below saturation
```

Run:

### Step 1

CapFrameX:

```text
confirm low GPU load + bad frametime
```

### Step 2

Spark normal profile:

```text
identify hot thread / mod / subsystem
```

### Step 3

If Server Thread is hot:

```text
Observable
Spark entity / tick analysis
```

### Step 4

If Render Thread is hot:

```text
Spark all-thread profile
compare client visual mods
```

### Step 5

If Java allocations / GC are suspicious:

```text
JFR
```

### Step 6

If GPU becomes saturated:

```text
shader A/B
Nsight
```

---

# 11. Long-Session Memory Benchmark · `PERF-HARNESS-LONGSESSION`

Run:

```text
30 minutes
2 hours
4 hours
```

Record:

```text
heap start
heap end
committed heap
GC frequency
GC pauses
FPS start/end
1% low start/end
MSPT start/end
entity count start/end
world reload memory recovery
```

RAM allocation is itself a benchmark variable.

Test:

```text
8 GB
10 GB
12 GB
```

Choose the smallest allocation that remains stable.

Do not choose the largest heap simply because the PC has spare RAM.

---

# 12. Worldgen Benchmark · `PERF-HARNESS-WORLDGEN`

Create a dedicated worldgen benchmark seed.

Test four states:

```text
W0 = baseline worldgen stack
W1 = + C2ME
W2 = + Noisium
W3 = + C2ME + Noisium
```

If the production branch already contains both, reproduce W0–W2 using benchmark commits.

Measure:

```text
time to generate fixed radius
chunks / second
MSPT P95
frametime spikes while travelling
peak heap
world size
generation errors
```

Verify output:

```text
biome placement
structures
Ice & Fire worldgen
Biomes O' Plenty
oil/resources
terrain continuity
```

Performance improvement with changed/corrupt world output is a failed result.

---

# 13. Dedicated Server Benchmark · `PERF-HARNESS-DEDICATED`

Client and server performance must be separated.

Dedicated server test should use:

```text
same world
same configs
fixed player count
fixed entity count
fixed scenario duration
```

Measure:

```text
TPS
MSPT median
MSPT P95
MSPT P99
entity tick
pathfinding
chunk generation
heap
GC
network traffic when relevant
```

Required workloads:

```text
MineColonies 10/25/50/75 NPC
Horde 50/100/150/200
TaCZ full-auto
Attract to Sound reaction
Create factory
Create train
```

---

# 14. Reproducible Variant Handling · `PERF-HARNESS-VARIANTS`

Do NOT benchmark by locally renaming:

```text
foo.jar → foo.jar.disabled
```

Use reproducible repository states.

Preferred methods:

```text
benchmark branch
temporary commit
git worktree
remove one packwiz metafile
rebuild instance
```

Every result must point to a commit.

---

# 15. Result Storage · `PERF-HARNESS-STORAGE`

Proposed repository layout:

```text
benchmarks/
├─ README.md
├─ results.csv
├─ scenarios/
│  ├─ zone-a.json
│  ├─ zone-b.json
│  ├─ zone-c.json
│  ├─ zone-d.json
│  ├─ zone-e.json
│  ├─ zone-f.json
│  └─ zone-g.json
└─ captures/
   └─ YYYY-MM-DD/
      └─ <commit>/
         └─ <zone>/
            └─ <variant>/
               ├─ metadata.json
               ├─ capframex.csv
               ├─ spark-profile.txt
               ├─ minecraft-profiler.zip
               ├─ jfr.jfr
               └─ notes.md
```

Not every run needs every artifact.

Minimum final benchmark capture:

```text
metadata.json
CapFrameX / PresentMon capture
notes.md
```

Diagnostic runs add Spark / JFR / F3+L.

---

# 16. Proposed Metadata Schema · `PERF-HARNESS-METADATA`

```json
{
  "date": "",
  "commit": "",
  "packVersion": "",
  "modlistDigest": "",
  "zone": "",
  "variant": "",
  "seed": "",
  "coordinates": "",
  "yaw": 0,
  "pitch": 0,
  "renderDistance": 0,
  "simulationDistance": 0,
  "resolution": "",
  "shader": "OFF",
  "shaderPreset": "",
  "vsync": false,
  "fpsCap": "unlimited",
  "ramMb": 8192,
  "java": "",
  "javaArgs": "",
  "cpu": "",
  "gpu": "",
  "driver": "",
  "notes": ""
}
```

---

# 17. Acceptance Rules · `PERF-HARNESS-ACCEPTANCE`

## Keep

A performance mod may be promoted when:

```text
measurable improvement
AND
no gameplay regression
AND
no rendering regression
AND
no stability regression
```

## Revert

Revert when:

```text
performance regression
crash
world corruption
visual corruption
AI / gameplay breakage
measurable stutter regression
```

## Inconclusive

Use when:

```text
result is inside run-to-run variance
scene was not identical
another setting changed
measurement tool failed
three runs disagree strongly
```

`INCONCLUSIVE` is not failure. It means the benchmark did not prove anything.

---

# 18. First Benchmark Order · `PERF-HARNESS-ORDER`

Do not try to finish the entire matrix in one day.

## Phase 1 — Establish Current Baseline

Run:

```text
Zone A
Zone B Medium
Zone D 100 mobs
Zone G fixed route
```

Collect:

```text
CapFrameX
Spark normal profile
Spark slow-tick profile
F3+L
```

This becomes the current 0.2.2-alpha reference.

## Phase 2 — Diagnose Current FPS Problem

Focus on the reported dense-area FPS drop.

Run:

```text
Zone A
Zone B Medium/Large
Zone D 100
```

Goal:

```text
CPU-bound?
render-thread-bound?
server-thread-bound?
GPU-bound?
```

Do not change mods yet.

## Phase 3 — Attribute New Optimizers

Run B1–B7.

Prioritize:

```text
1. Colorwheel
2. Create Better FPS
3. Radium
4. Particle Core
5. Thulium
6. C2ME
7. Noisium
```

Use only the zones relevant to each mod.

## Phase 4 — Shader Matrix

After the base client is characterized:

```text
Shader OFF
→ shader presets
→ compare GPU cost
```

## Phase 5 — Long Session

After the stack is stable:

```text
30 min
2 h
4 h
```

---

# 19. Definition of Done · `PERF-HARNESS-DONE`

The benchmark system is considered usable when the repository contains:

```text
one frozen benchmark world
one fully filled machine/run metadata record
Zone A reference
Zone B reference
Zone D reference
Zone G reference
one Spark normal profile
one Spark slow-tick profile
one CapFrameX capture
one F3+L artifact
```

The optimization evaluation is considered complete when each performance candidate has:

```text
baseline
A/B or leave-one-out result
compatibility result
verdict
```

The shader evaluation is complete when each accepted shader preset has:

```text
Avg FPS
1% low
P99 frametime
GPU cost
VRAM
visual notes
```

---

# 20. Final Rule · `PERF-HARNESS-GOAL`

The purpose of this system is not to produce the highest screenshot FPS.

The target is:

```text
stable frame times
high 1% lows
20 TPS
low MSPT spikes
predictable memory usage
correct gameplay
reproducible evidence
```

A result that is faster but breaks the game is a failed optimization.
