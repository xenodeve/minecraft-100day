# Addon Spec — Upscaling + Frame Generation
## NVIDIA RTX 40/50 Client Performance Layer
### Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Repository:** `xenodeve/minecraft-100day`  
> **Platform:** Minecraft 1.20.1 / Forge 47.x / Java 17  
> **Target hardware:** NVIDIA GeForce RTX 40-series and RTX 50-series, desktop and laptop  
> **Target team:** 3-player baseline, 4-player full team  
> **Scope:** Client-side rendering only  
> **Status:** EXPERIMENTAL → benchmark-gated optional profile
>
> This document is standalone. It defines the approved architecture, terminology, candidates,
> compatibility tests, benchmarking method, fallback behavior, distribution constraints and
> acceptance criteria for adding modern upscaling and frame generation to the pack.

---

# PERF-UPFG-001 — Goal

Add an optional NVIDIA-oriented rendering layer that can improve perceived smoothness and/or reduce
GPU render cost without changing gameplay balance or becoming a server requirement.

Desired architecture:

```text
Core Performance Stack
        │
        ├─ Embeddium
        ├─ ImmediatelyFast
        ├─ Entity Culling
        ├─ BadOptimizations
        └─ Legendary Block Entities
                 │
                 ▼
       Upscaling / FG Layer
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
 Super Resolution   MC-DLSSFG   PFG
 Candidate A        Candidate B Candidate C
```

This layer must remain:

```text
CLIENT ONLY
OPTIONAL
DISABLEABLE
BENCHMARK-GATED
SERVER-INDEPENDENT
```

No friend should be unable to join a server because this layer is disabled or removed.

---

# PERF-UPFG-002 — Hardware Assumption

The intended player group uses:

```text
RTX 40-series
or
RTX 50-series
```

including desktop and laptop GPUs.

Therefore an NVIDIA-specific optional profile is justified.

Do **not** design AMD/Intel fallback as a release blocker. However, the base pack must still launch
and play with the entire Upscaling/FG layer disabled.

---

# PERF-UPFG-003 — Terminology

Do not use the word “DLSS” as if every DLSS feature were the same.

## DLSS Super Resolution / DLSS-SR

```text
render internally below native resolution
        ↓
AI reconstruction/upscaling
        ↓
native-output-resolution image
```

Main purpose: reduce GPU render cost while retaining image quality.

## DLAA

```text
native-resolution rendering
        ↓
DLSS-family temporal AA/reconstruction
        ↓
higher image quality
```

Use for quality rather than maximum performance.

## DLSS Frame Generation / DLSS-G

NVIDIA-specific frame-generation technology.

Do not automatically equate any mod’s “Frame Generation” switch with DLSS-G.

## Generic / Custom Frame Generation

A mod may synthesize/interpolate frames with another algorithm. That can still be useful, but label it
`Frame Generation`, not `NVIDIA DLSS Frame Generation`, unless upstream explicitly verifies DLSS-G.

---

# PERF-UPFG-004 — Critical Naming Rule

> **Do not call Super Resolution’s Frame Generation “DLSS Frame Generation” unless the selected
> backend is explicitly verified to be NVIDIA DLSS-G.**

Current verified distinction:

```text
Super Resolution
├─ DLSS upscaling support                  VERIFIED
├─ Frame Generation framework              VERIFIED
├─ FG-only mode                            VERIFIED
├─ NVIDIA Reflex backend                   VERIFIED
└─ FG backend = NVIDIA DLSS-G              NOT ESTABLISHED BY THIS SPEC

MC-DLSSFG
├─ DLSS Super Resolution                   EXPLICIT UPSTREAM CLAIM
└─ DLSS Frame Generation full pipeline     EXPLICIT UPSTREAM CLAIM

PFG
└─ Frame Generation up to 6×               EXPLICIT PROJECT CLAIM
```

Do not turn inference into a product claim.

---

# PERF-UPFG-005 — Candidate A: Super Resolution

**Status: PRIMARY EXPERIMENTAL CANDIDATE**

Preferred first test.

Verified current Forge 1.20.1 release observed while authoring:

```text
1.20.1-0.9.1-alpha.1+gl-forge
```

Verified 0.9.x capabilities include:

```text
super-resolution algorithms
DLSS resources/upscaling
frame-generation framework
Auto and 2×–6× FG modes
FG-only mode
shader interface
asynchronous FG presentation
NVIDIA Reflex backend
GPU timings for:
  - upscaling
  - frame generation
  - presentation
  - interop
```

Why Candidate A:

1. Native Forge 1.20.1 build exists.
2. Client-side.
3. Covers upscaling and FG experimentation in one project.
4. Has built-in diagnostics/timing.
5. Current releases explicitly work on shader integration.
6. Much larger project/user footprint than newer FG-only alternatives.
7. Can be evaluated without committing the pack to a vendor-specific native FG path.

Risks:

```text
Alpha software
render-pipeline interaction
shader compatibility
native resource/backend handling
FG artifacts
latency
```

Do not promote directly to CORE.

---

# PERF-UPFG-006 — Candidate B: MC-DLSSFG

**Status: NVIDIA DLSS-G EXPERIMENT**

Purpose: test an implementation whose upstream explicitly targets full NVIDIA DLSS Frame Generation
on Forge 1.20.1.

Upstream explicitly targets/describes:

```text
Minecraft 1.20.1
Forge
DLSS Super Resolution
XeSS
FSR2
DLSS Frame Generation
Windows + NVIDIA FG-capable GPU for FG
```

Its architecture also includes native components / interop involving areas such as:

```text
C++
NGX / Streamline-related path
OpenGL
Vulkan interoperability
native libraries
```

Why this matters: the player group is entirely RTX 40/50, so an NVIDIA-specific FG path is unusually
relevant.

Why Candidate B rather than Candidate A:

```text
larger native compatibility surface
more complicated packaging
more complicated redistribution
smaller/younger deployment footprint
greater renderer/shader failure risk
```

It may ultimately win in FG quality, latency or NVIDIA-specific integration, but only after
compatibility and distribution review.

---

# PERF-UPFG-007 — Candidate C: PFG

**Status: FALLBACK / COMPARISON CANDIDATE**

Observed current project information:

```text
Minecraft 1.20.1
Forge
Client-side
PFG 1.4.0
Frame Generation up to 6×
```

Use it to answer:

```text
Can a simpler FG-focused implementation
produce better compatibility or lower overhead
than the larger upscaling framework?
```

Do not call PFG NVIDIA DLSS-G unless upstream explicitly adds and documents that feature.

---

# PERF-UPFG-008 — PureScale

**Status: REFERENCE ONLY — DO NOT PORT INTO MAIN**

PureScale is useful as design inspiration:

```text
upscaling
DLSS option
frame generation
A/B comparison controls
performance overlay
native-resolution HUD concept
```

But the currently observed release targets another Minecraft/platform line and is Fabric, not our
Forge 1.20.1 stack.

Therefore:

```text
DO NOT:
- add Sinytra just for PureScale
- backport PureScale during Alpha
- port it merely because the feature list is attractive
```

Reproduce the desired capability using Forge 1.20.1 candidates.

---

# PERF-UPFG-009 — Selection Order

```text
A. Super Resolution
        ↓
B. MC-DLSSFG
        ↓
C. PFG
```

Reason:

```text
A = best overall starting point
B = strongest explicit NVIDIA DLSS-G experiment
C = fallback / simpler FG comparison
```

Do not install all three simultaneously.

---

# PERF-UPFG-010 — Existing Renderer Stack

Candidates must be tested against the real client stack, including at minimum:

```text
Forge 1.20.1
Embeddium
Oculus
ImmediatelyFast
Entity Culling
BadOptimizations
Legendary Block Entities
EMF
ETF
Fresh Animations if enabled
Fancy World Animations
Particle Rain
Subtle Effects
TaCZ
Create
```

The recent ImmediatelyFast × Oculus startup failure is evidence that renderer integrations must be
high-risk compatibility work, not assumed-safe additions.

---

# PERF-UPFG-011 — ImmediatelyFast Rule

Before any Upscaling/FG candidate is tested, resolve and freeze the known-compatible
ImmediatelyFast + Oculus pair.

Required base renderer baseline:

```text
Minecraft launches
Main Menu renders
world enters
world exits
shader OFF works
shader ON works
shader reload works
```

Only then add Candidate A/B/C.

---

# PERF-UPFG-012 — Oculus / Shader Policy

Every candidate must be tested independently in:

```text
Mode S0
Oculus installed
Shader OFF

Mode S1
Oculus installed
Shader ON
```

Passing S0 does not imply passing S1.

Shader failure must not prevent Standard mode from working.

---

# PERF-UPFG-013 — Profiles

## STANDARD

```text
Embeddium
Oculus available
Shader OFF by default
Upscaling OFF
Frame Generation OFF
Native resolution
```

This is the known-good baseline and rollback profile.

## NVIDIA ENHANCED

Target after validation:

```text
RTX 40/50
quality-oriented upscaler if beneficial
FG 2×
Reflex/low-latency feature if supported
Shader optional
```

## NVIDIA QUALITY

```text
DLAA or high-quality DLSS mode
FG 2× optional
native/high render quality
```

## CINEMATIC

```text
Oculus shader ON
high-quality upscaling
FG 2×
```

Never use Cinematic as the performance baseline.

---

# PERF-UPFG-014 — Default FG Multiplier

Start at:

```text
2×
```

Do not default to 4×/6× even when supported.

This pack contains:

```text
TaCZ aiming
weapon recoil
rapid camera movement
mobs charging
Dragons
vehicles
particles
rain
animated hands/items
```

These expose ghosting, interpolation errors and latency quickly.

---

# PERF-UPFG-015 — Minimum Real FPS Rule

Frame Generation must not hide an unusably low real frame rate.

Preferred practical target:

```text
70–100 real FPS
        ↓
FG 2×
        ↓
~140–200 displayed FPS
```

Bad interpretation:

```text
25 real FPS
→ 50 displayed/generated FPS
≠ 50 FPS input responsiveness
```

Always report real FPS and displayed/generated FPS separately where possible.

---

# PERF-UPFG-016 — Server Performance Non-Goal

Upscaling/FG does not fix:

```text
server MSPT
MineColonies pathfinding
Horde AI
Create tick cost
worldgen CPU cost
entity simulation
network latency
```

Never report FG as a server-lag fix.

---

# PERF-UPFG-017 — RTX Laptop Rule

Validate that Minecraft really renders on the NVIDIA GPU.

Check using appropriate diagnostics such as:

```text
F3 / renderer diagnostics
NVIDIA overlay
Task Manager GPU engine
```

Watch for unintended Intel/AMD iGPU routing.

If the laptop has MUX / Advanced Optimus, compare hybrid and dGPU-only paths if renderer/native
interop behaves differently.

---

# PERF-UPFG-018 — Power / Thermal Test

Laptop results must note:

```text
AC power or battery
GPU power limit
thermal state
```

Record when practical:

```text
GPU utilization
GPU clock
GPU power
GPU temperature
CPU temperature
```

Do not compare an unplugged laptop against an AC-powered desktop as if conditions were equal.

---

# PERF-UPFG-019 — Benchmark Scenes

Use the canonical Performance Spec scenes, with these minimum tests:

## U0 — Empty Baseline
Low-entity, low-complexity location.

## U1 — Main Settlement
MineColonies + buildings + citizens + storage + decorations.

## U2 — Create Factory
Moving machinery, belts, items, processing and contraptions.

## U3 — Horde + TaCZ

```text
50 / 100 / 150+ hostile entities as safe
automatic gunfire
weapon recoil
particles
Attract to Sound reactions
```

This is the most important FG artifact/latency test.

## U4 — Rain / Visual Stress
Particle Rain + Subtle Effects + dense vegetation.

## U5 — Shader Scene
Repeat a representative GPU-heavy scene with the selected Oculus shader.

## U6 — Train / High Motion
Create train + rapid scenery movement + chunk transitions.

## U7 — Dragon Combat
Large animated subject + particles + rapid camera turns.

---

# PERF-UPFG-020 — Metrics

Record:

```text
real/native FPS
displayed/generated FPS
1% low
frame time
GPU utilization
CPU utilization
VRAM
RAM
GPU power if practical
input feel / latency notes
ghosting/artifacts
HUD quality
weapon-hand quality
shader compatibility
crashes/errors
```

If exposed by the mod, also capture:

```text
upscaling GPU time
FG GPU time
presentation time
interop time
Reflex wait/sleep time
```

Do not reduce the verdict to average FPS.

---

# PERF-UPFG-021 — A/B Matrix

For Candidate A:

```text
A0 = native resolution, FG OFF
A1 = DLSS/upscaler quality mode, FG OFF
A2 = native/FG-only where supported, FG 2×
A3 = upscaler + FG 2×
A4 = A3 + shader
```

Repeat equivalent modes for Candidates B/C where supported.

---

# PERF-UPFG-022 — One Candidate at a Time

Hard rule:

```text
DO NOT:
Super Resolution
+ MC-DLSSFG
+ PFG
```

Test one, remove it completely, then test the next.

If native DLLs/resources are extracted outside `mods/`, ensure reset/uninstall removes or isolates them
before switching candidate.

---

# PERF-UPFG-023 — Clean Test Profiles

Use isolated profiles/branches:

```text
perf/upfg-baseline
perf/upfg-super-resolution
perf/upfg-mc-dlssfg
perf/upfg-pfg
```

Do not repeatedly mutate the only playable client instance without tracking changes.

---

# PERF-UPFG-024 — Acceptance Criteria

A candidate can become `OPTIONAL PROFILE` only if:

1. Minecraft launches consistently.
2. Main Menu renders correctly.
3. World enter/exit works.
4. Shader OFF works.
5. Shader ON works or is explicitly unsupported without breaking Shader OFF.
6. No persistent native-library contamination after disable/removal.
7. No severe HUD corruption.
8. No severe TaCZ weapon/hand artifacts.
9. No unacceptable ghosting in Horde/Dragon/Train scenes.
10. Supported runtime toggles do not crash.
11. Real FPS stays high enough for acceptable input response.
12. Generated FPS/frame pacing materially improves perceived smoothness.
13. Logs contain no new severe recurring error class.
14. Distribution/licensing is understood.

---

# PERF-UPFG-025 — Candidate Promotion States

```text
DISCOVERED
↓
PLATFORM VERIFIED
↓
INSTALLED IN ISOLATED PROFILE
↓
SMOKE PASSED
↓
BENCHMARKED
↓
OPTIONAL PROFILE APPROVED
```

Never jump from `INSTALLED` to `CORE`.

---

# PERF-UPFG-026 — Candidate A Promotion Target

If Super Resolution passes:

```text
PERF-UPFG-SUPERRES
Status = OPTIONAL NVIDIA PROFILE
Default = OFF globally
```

Recommended initial profile defaults:

```text
FG multiplier = 2×
upscaler = quality-oriented mode
Reflex = ON if supported and verified
shader = user-selectable
```

Do not hard-code an algorithm until screenshots and metrics confirm image quality.

---

# PERF-UPFG-027 — Candidate B Promotion Target

MC-DLSSFG may replace Candidate A as preferred RTX profile only if it shows a meaningful advantage in
one or more of:

```text
FG image quality
latency behavior
frame pacing
shader behavior
lower FG overhead
```

while remaining stable and distributable.

“Uses DLSS-G” alone is not enough to win.

---

# PERF-UPFG-028 — Candidate C Promotion Target

PFG becomes preferred only if:

```text
compatibility materially better
AND
frame-generation quality acceptable
AND
latency/frame pacing acceptable
```

A simpler implementation can win if it behaves better with the real pack.

---

# PERF-UPFG-029 — Distribution / Native Library Rule

Before shipping any candidate:

```text
read project license
read redistribution terms
read native SDK/library terms
identify auto-downloaded resources
identify bundled DLLs
identify files extracted at runtime
```

Do not assume the mod source license grants redistribution rights for NVIDIA/Intel/AMD third-party
binaries.

Scrutinize MC-DLSSFG especially because its architecture explicitly involves native components and
third-party SDK/resource paths.

---

# PERF-UPFG-030 — Distribution Tiers

Distinguish:

```text
LOCAL TEST ARTIFACT
FRIEND DISTRIBUTION
PUBLIC DISTRIBUTION
```

Do not add a native DLSS/FG candidate to a self-contained redistributable artifact merely because it
works locally.

---

# PERF-UPFG-031 — Runtime Downloads

If a candidate downloads resources such as:

```text
DLSS resource
NGX component
backend DLL
model
SDK runtime
```

document:

```text
source
destination
checksum if stable
update behavior
offline behavior
failure behavior
uninstall cleanup
```

Do not let opaque runtime downloads silently become pack dependencies.

---

# PERF-UPFG-032 — Security Rule

For native candidates:

```text
use official project source
pin exact release/commit
record hashes
do not download random DLL mirrors
do not copy DLLs from unrelated games
do not use unofficial “fix packs” without review
```

If instructions require proprietary files from questionable sources, stop integration and review.

---

# PERF-UPFG-033 — Conflict Logging

Suggested compatibility IDs:

```text
C-UPFG-01 Super Resolution × Oculus
C-UPFG-02 Super Resolution × ImmediatelyFast
C-UPFG-03 Super Resolution × TaCZ HUD/weapon
C-UPFG-04 MC-DLSSFG native initialization
C-UPFG-05 MC-DLSSFG × Oculus shader
C-UPFG-06 PFG temporal artifact
C-UPFG-07 RTX Laptop hybrid-GPU routing
```

Record:

```text
commit
exact jar
GPU
driver
mode
shader
error signature
reproduction steps
workaround
verdict
```

---

# PERF-UPFG-034 — Documentation

Extend/create:

```text
docs/performance-baseline.md
docs/performance-benchmarks.md
docs/performance-conflicts.md
docs/upscaling-frame-generation.md
```

`docs/upscaling-frame-generation.md` becomes user-facing only after one candidate is approved.

---

# PERF-UPFG-035 — Benchmark Table Template

```markdown
| Candidate | Mode | Real FPS | Display FPS | 1% Low | GPU | VRAM | Shader | Artifacts | Latency Note | Verdict |
|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| Baseline | Native | | | | | | OFF | | | |
| Super Resolution | Upscale only | | | | | | OFF | | | |
| Super Resolution | FG 2× only | | | | | | OFF | | | |
| Super Resolution | Upscale + FG 2× | | | | | | OFF | | | |
| Super Resolution | Upscale + FG 2× | | | | | | ON | | | |
| MC-DLSSFG | DLSS-SR + DLSS-G | | | | | | OFF | | | |
| PFG | FG 2× | | | | | | OFF | | | |
```

---

# PERF-UPFG-036 — Subjective Quality Checklist

Every player should check:

```text
crosshair stability
scope/ADS stability
weapon silhouette
hands
fast strafing
180° camera turn
mobs crossing screen
dragon wings
rain streaks
foliage
particles
HUD text
inventory text
tracker/waypoint UI
Create belts/items
train scenery
```

Score each:

```text
0 = broken
1 = distracting
2 = visible but acceptable
3 = clean
```

Do not rely on one person’s screenshots only.

---

# PERF-UPFG-037 — Latency Test

Because TaCZ combat matters, perceived latency is first-class.

Compare:

```text
native
upscale only
FG 2×
upscale + FG 2×
```

Perform:

```text
ADS flick
target tracking
rapid semi-auto
full-auto recoil correction
close-range mob turn
```

If displayed FPS doubles but aiming feels materially worse, reject or change profile.

---

# PERF-UPFG-038 — Shader Test

Inspect temporal/shader-sensitive behavior such as:

```text
motion vectors if relevant
TAA history
exposure
depth
transparent particles
hand rendering
water
volumetrics
```

“World renders without crashing” is not enough to declare shader compatibility.

---

# PERF-UPFG-039 — Dynamic FPS Interaction

Test:

```text
foreground FG
→ Alt+Tab
→ Dynamic FPS activates
→ return to game
→ FG recovers
```

Reject regressions such as:

```text
black frame
stuck frame
native DLL crash
wrong frame limiter
massive history artifact
```

---

# PERF-UPFG-040 — Laptop / Desktop Matrix

Minimum desired coverage where hardware is available:

```text
RTX 40 desktop
RTX 40 laptop
RTX 50 desktop or laptop
```

If fewer classes are available, test what exists; do not fabricate coverage.

Record exact GPU model.

---

# PERF-UPFG-041 — Driver Rule

Record NVIDIA driver version for every benchmark.

If NVIDIA/native initialization fails:

```text
1. confirm exact GPU
2. confirm Minecraft uses RTX GPU
3. confirm driver
4. reproduce with Shader OFF
5. inspect candidate logs
```

Do not change five renderer mods at once.

---

# PERF-UPFG-042 — Rollback

Every candidate must be removable.

Rollback must restore:

```text
native rendering
existing Embeddium/Oculus stack
original config
no orphan required dependency
no orphan native library where avoidable
```

Verify launch after rollback.

---

# PERF-UPFG-043 — Roster Rule

Until approved, classify as:

```text
Experimental Client Performance
```

After promotion:

```text
Optional NVIDIA Performance
```

Never describe an unbenchmarked FG mod as Core Performance.

---

# PERF-UPFG-044 — User-Facing Messaging

If approved, explain:

```text
Upscaling lowers internal render cost and reconstructs the image.
Frame Generation creates additional displayed frames.
It does not improve server TPS.
Generated FPS is not the same as real input-response FPS.
```

Never market “2× FG” as “twice the input responsiveness.”

---

# PERF-UPFG-045 — First Experiment

Implement only:

```text
Candidate A: Super Resolution
```

in an isolated client profile.

Pin the exact Forge 1.20.1 release discovered at implementation time.

Before installation verify from source metadata:

```text
exact Minecraft compatibility
exact Forge loader
required dependencies
license
client/server side
file hash
```

Never guess dependency IDs or filenames.

---

# PERF-UPFG-046 — Candidate A Test Sequence

```text
A0. Verify current renderer baseline
A1. Add Super Resolution only
A2. Launch Main Menu
A3. Create/enter test world
A4. Native / feature OFF baseline
A5. Upscaling only
A6. FG-only 2× if supported
A7. Upscaling + FG 2×
A8. Shader ON
A9. TaCZ combat
A10. Horde stress
A11. Create factory
A12. Train/high motion
A13. Alt+Tab / Dynamic FPS recovery
A14. Exit and relaunch
A15. Collect logs + timings
```

Do not proceed to Candidate B until Candidate A has a written verdict.

---

# PERF-UPFG-047 — Candidate B Test Sequence

```text
B0. Return to clean baseline
B1. Audit native/third-party libraries
B2. Install MC-DLSSFG in isolated profile
B3. Verify native initialization
B4. Test DLSS-SR
B5. Test DLSS-G
B6. Shader OFF
B7. Shader ON
B8. TaCZ latency/artifacts
B9. Horde stress
B10. Clean uninstall
```

A native-library failure is not permission to mutate the whole pack without evidence.

---

# PERF-UPFG-048 — Candidate C Test Sequence

```text
C0. Clean baseline
C1. PFG 2×
C2. TaCZ
C3. Horde
C4. High motion
C5. Shader OFF/ON
C6. Artifact comparison against A/B
```

Do not spend Alpha time tuning 4×/6× unless 2× is already excellent.

---

# PERF-UPFG-049 — Decision Matrix

Weighted priorities:

```text
1. Stability / compatibility       highest
2. TaCZ latency + image integrity
3. Frame pacing
4. Shader compatibility
5. Upscaling image quality
6. FG artifact quality
7. Performance uplift
8. Ease of distribution
9. Ease of configuration
10. Peak displayed-FPS number      lowest
```

The biggest FPS counter does not automatically win.

---

# PERF-UPFG-050 — Expected End State

```text
Industrial Civilization Survival

Core Renderer
└─ Embeddium stack

Standard Profile
└─ Native / FG OFF

Optional NVIDIA Profile
└─ ONE validated Upscaling/FG implementation
   ├─ RTX 40/50
   ├─ FG 2× default
   ├─ optional upscaling
   └─ optional Oculus shader

Experimental
├─ remaining candidates
└─ never required by server
```

---

# PERF-UPFG-051 — Candidate Summary

| Candidate | Forge 1.20.1 | Upscaling | Frame Generation | Explicit NVIDIA DLSS-G claim | Role |
|---|---:|---:|---:|---:|---|
| **Super Resolution** | Yes | Yes, including DLSS support | Yes, framework / 2×–6× | **Not established by this spec for its FG backend** | Candidate A |
| **MC-DLSSFG** | Yes, upstream main target | Yes | Yes | **Yes, upstream explicitly describes full DLSS FG** | Candidate B |
| **PFG** | Yes | Not primary purpose | Yes, up to 6× | No | Candidate C |
| **PureScale** | Not for this Forge 1.20.1 target | Yes | Yes | DLSS and FG are separate features | Reference only |

---

# PERF-UPFG-052 — Verified Research Snapshot (2026-08-28)

## Super Resolution

Observed Forge 1.20.1 release:

```text
1.20.1-0.9.1-alpha.1+gl-forge
```

Current 0.9.x release notes document:

```text
frame-generation framework
2×–6× FG
FG-only mode
shader interface
NVIDIA Reflex backend
GPU timing for upscaling / FG / presentation / interop
DLSS resource support via NVIDIA NGX
```

Observed project license on Modrinth:

```text
GPL-3.0-or-later
```

## MC-DLSSFG

Upstream README explicitly identifies:

```text
Forge 1.20.1 as current main target
DLSS Super Resolution
XeSS
FSR2
full DLSS Frame Generation pipeline
Windows + NVIDIA FG-capable GPU test target
native build components
```

## PFG

Observed:

```text
PFG 1.4.0
Minecraft 1.20.1
Forge
Client environment
Frame Generation up to 6×
All Rights Reserved
```

## PureScale

Observed current Planet Minecraft project:

```text
Fabric
current page targets Minecraft 26.2
client-side
DLSS available on RTX
frame generation described separately
```

These are research snapshots, not eternal truths.

> At implementation time, re-check exact current metadata. Do not silently replace these observations
> with guessed versions.

---

# PERF-UPFG-053 — Source Re-Verification Rule

At implementation time, re-verify official/current pages for:

```text
Super Resolution — Modrinth
MC-DLSSFG — upstream GitHub repository
PFG — CurseForge
PureScale — Planet Minecraft (reference only)
```

Prefer official project metadata over reposts.

---

# PERF-UPFG-054 — Claude Code Hard Rules

## DO

1. Keep the layer client-only.
2. Preserve a native-rendering fallback.
3. Test one candidate at a time.
4. Separate real FPS from displayed/generated FPS.
5. Start FG at 2×.
6. Test TaCZ latency/artifacts.
7. Test Shader OFF and ON separately.
8. Re-verify exact mod/version/dependencies before download.
9. Record hashes.
10. Audit native DLL/SDK redistribution separately.
11. Test RTX laptop GPU routing.
12. Capture logs after every smoke test.
13. Use stable `PERF-UPFG-*` IDs in cross-document references.
14. Document every known conflict.
15. Prefer stability/frame pacing over headline FPS.

## DO NOT

1. Do not install PureScale in the Forge 1.20.1 pack.
2. Do not add Sinytra solely for this feature.
3. Do not install A+B+C simultaneously.
4. Do not call generic FG DLSS-G.
5. Do not call Super Resolution’s FG DLSS-G without backend proof.
6. Do not make FG a server requirement.
7. Do not claim FG fixes TPS/MSPT.
8. Do not default to 4×/6×.
9. Do not ship unreviewed native DLLs.
10. Do not compare different scenes/settings as benchmark evidence.
11. Do not promote an Alpha implementation merely because it launches.
12. Do not make the NVIDIA profile irreversible.

---

# PERF-UPFG-055 — Definition of Done

```text
[ ] current base renderer launches reliably
[ ] Super Resolution has an isolated profile
[ ] Super Resolution has a written benchmark verdict
[ ] MC-DLSSFG has a verdict or documented deferral reason
[ ] PFG has a comparison verdict or documented deferral reason
[ ] one optional NVIDIA profile is selected, or all candidates are rejected
[ ] FG default, if selected, is 2×
[ ] TaCZ artifact/latency testing completed
[ ] Horde/high-motion testing completed
[ ] Shader OFF tested
[ ] Shader ON tested where supported
[ ] laptop RTX routing tested where hardware is available
[ ] distribution/native-library rights reviewed
[ ] rollback tested
[ ] performance documentation updated
```

---

# PERF-UPFG-056 — Final Feature Definition

> **Upscaling + Frame Generation is an optional RTX 40/50-oriented client rendering layer for
> Industrial Civilization Survival. It may use modern reconstruction and generated-frame techniques
> to improve GPU efficiency and perceived smoothness, but it never substitutes for real server
> optimization, never hides real FPS, and never becomes mandatory until compatibility, latency,
> image quality, native-library handling and distribution have been verified.**

Recommended starting decision:

```text
Candidate A = Super Resolution
Candidate B = MC-DLSSFG
Candidate C = PFG
PureScale   = reference only
FG default  = 2×
Profile     = Optional NVIDIA
```
