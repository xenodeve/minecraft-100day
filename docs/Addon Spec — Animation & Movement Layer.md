# Addon Spec — Animation & Movement Layer
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Repository:** `xenodeve/minecraft-100day`  
> **Platform:** Minecraft 1.20.1 / Forge / Java 17  
> **Purpose:** Add a smooth, expressive and comfortable animation/movement layer for player, Vanilla mobs/animals and modded entities while preserving Minecraft-like controls and avoiding excessive realism or motion sickness.
>
> This document is standalone implementation context for Claude Code CLI.

---

# 1. Design Goal

Target:

```text
Minecraft movement
        ↓
Smoother
More expressive
More readable
More immersive
        ↓
Still feels like Minecraft
```

Do **not** turn the pack into:

```text
real-world inertia simulation
camera-heavy realism
Arma-like movement
constant acceleration/deceleration
```

Core principle:

> **Improve visual motion without making long 100–300+ day sessions tiring.**

---

# 2. Approved Stack

## Core / Core Candidates

```text
Smooth Player Animations
Not Enough Animations
Better Animations Collection
Smooth Movement
```

## Optional Selective Layer

```text
Entity Model Features (EMF)
Entity Texture Features (ETF)
Fresh Animations
```

Fresh Animations is a **selective Vanilla-entity gap filler**, not a default global replacement.

---

# 3. Rejected

## AMF: Better Movement

```text
Status: REJECTED
```

Reasons:

- excessive real-life inertia
- changes control feel too much
- potential motion sickness / fatigue
- not needed for pack identity

Do not re-propose without explicit developer direction.

---

# 4. Hard Rule — Animation Ownership

> **One entity, one primary animation owner.**

Examples:

```text
Player → Smooth Player Animations
Zombie → Better Animations Collection
Wolf → Fresh Animations
Naturalist Bear → Naturalist native animation
Ice & Fire Dragon → Ice & Fire native animation
```

Do not blindly let BAC and Fresh Animations control the same entity.

---

# 5. Architecture

```text
                    ENTITY MOVEMENT
                          │
                          ▼
                  Smooth Movement
             visual position interpolation
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
       PLAYER       VANILLA ENTITY    MODDED ENTITY
          │               │                │
          ▼               ▼                ▼
 Smooth Player       Better Anim.         Native
 Animations           Collection        Animation
      +                   │
 Not Enough               ▼
 Animations          Missing / weak?
                          │
                         YES
                          │
                          ▼
                Fresh Animations
                    EMF + ETF
```

---

# 6. Player Ownership

Primary:

```text
Smooth Player Animations
```

Secondary action layer:

```text
Not Enough Animations
```

Smooth Player Animations should own locomotion such as:

```text
walking
running
sprinting
swimming
crawling
climbing
idle
body transitions
upper/lower body movement
```

Not Enough Animations should complement missing third-person/action animations.

---

# 7. Player Compatibility Targets

Must test with:

```text
TaCZ
TaCZ Additions
TaCZ Durability
TakKit
Brimm Armors
CAPS_Awim
Sophisticated Backpacks
Curios
PlayerRevive
Create contraptions
Minecarts / trains
Swimming
Ladders / crawling
```

Critical TaCZ checks:

```text
ADS
reload
fire
sprint
crouch
weapon swap
remote-player pose
```

---

# 8. Fresh Animations Player Extension

Initial status:

```text
DISABLED
```

Player already has:

```text
Smooth Player Animations
+
Not Enough Animations
```

Do not add a third player animation owner unless testing reveals a real gap.

---

# 9. Vanilla Mob / Animal Default

Primary default:

```text
Better Animations Collection
```

Fresh Animations is only considered where BAC is:

```text
missing
visibly weaker
aesthetic mismatch
or otherwise not satisfactory
```

Selection must be made per entity.

---

# 10. Fresh Animations Role

Use Fresh Animations through:

```text
EMF
+
ETF
+
Fresh Animations Resource Pack
```

Do not use OptiFine.

Fresh Animations should fill **entity-level gaps**, not automatically replace BAC everywhere.

---

# 11. Entity-Level, Not Animation-Level Mixing

Do not start with:

```text
Cow walk → BAC
Cow idle → FA
Cow eat → BAC
Cow sleep → FA
```

Prefer:

```text
Cow → BAC
Wolf → FA
```

Animation-by-animation merging is a future custom compatibility task only.

---

# 12. Animation Coverage Matrix

Create:

```text
docs/animation-coverage.md
```

Recommended columns:

```text
Entity
Category
Native Animation
BAC Coverage
FA Coverage
Selected Owner
Reason
Conflict
Performance Notes
Tested
```

Example only:

| Entity | BAC | FA | Owner | Reason |
|---|---:|---:|---|---|
| Zombie | Yes | Yes | BAC | good default |
| Cow | Yes | Yes | BAC | good default |
| Wolf | Partial | Strong | FA | richer movement |
| Naturalist Bear | — | — | Native | mod owns animation |
| Dragon | — | — | Native | Ice & Fire owns animation |

Do not treat the example as final truth.

---

# 13. Modded Entity Rule

Default:

```text
Modded entity → native mod animation
```

Includes:

```text
Naturalist
Critters and Companions
Born in Chaos
Ice & Fire
MineColonies NPCs
```

Do not force BAC/FA onto modded entities unless explicitly supported and tested.

---

# 14. Ownership Priority

```text
1. Native mod animation
2. Explicit compatibility layer
3. BAC / FA for Vanilla entities
4. Vanilla fallback
```

---

# 15. Smooth Movement Role

Smooth Movement is **not** an animation owner.

It is a:

> **Visual interpolation layer**

Purpose:

```text
smooth position transitions
reduce visible entity jerk
reduce perceived multiplayer/TPS stutter
improve motion continuity
```

It may improve perceived smoothness without increasing raw TPS/FPS.

---

# 16. Smooth Movement Initial Policy

Conceptual initial state:

```text
Players             ON / TEST
Living Entities     ON / TEST
Items                ON / TEST
Minecarts            TEST
Falling Blocks       TEST
Projectiles          OFF
```

Read the actual installed config before implementing. Do not invent option names.

---

# 17. Projectile Smoothing

Initial status:

```text
OFF
```

Because the pack uses or may use:

```text
TaCZ bullets
Create Big Cannons
Warium projectiles
Historical Anti Air
Aircraft weapons
```

Do not risk visual/server ballistic disagreement.

---

# 18. Projectile Smoothing Gate

Only consider enabling after:

```text
TaCZ semi-auto test
TaCZ full-auto test
CBC shell test
multiplayer latency test
Warium test later
```

Required:

```text
no hit-registration mismatch
no visual trajectory mismatch
no projectile teleport artifacts
no damage regression
```

---

# 19. Better Animations Collection Configuration

Inspect real generated config.

Possible actions:

```text
disable conflicting features
disable weak/unwanted features
disable ownership for entities handed to FA
```

Do not assume per-entity/per-animation toggles exist until verified.

---

# 20. Fresh Animations Selection Criteria

For each Vanilla entity evaluate:

```text
1. Is BAC coverage present?
2. Does BAC look good?
3. Is FA meaningfully better?
4. What is the render cost?
5. Is this entity common enough that cost matters?
6. Does FA conflict with other model/resource packs?
```

Then assign:

```text
BAC
FA
VANILLA
```

---

# 21. Custom Animation Compatibility Pack

If an entity later needs a custom hybrid:

```text
resourcepacks/
└── industrial-civilization-animation-compat/
```

Only build after understanding:

```text
EMF model definitions
animation expressions
resource-pack priority
license constraints
```

Do not immediately fork BAC or Fresh Animations.

---

# 22. Licensing / Redistribution

Before shipping Fresh Animations:

```text
read current license
record attribution requirements
record redistribution permission
avoid copying upstream assets unnecessarily
```

Preferred model:

```text
Original Fresh Animations pack
+
Industrial Civilization compatibility override pack
```

Update:

```text
docs/distribution-licenses.md
```

---

# 23. Movement Comfort Rule

Hard UX requirement:

> Avoid systems that add continuous inertia, excessive camera motion, heavy body sway or motion that can cause motion sickness in long sessions.

This is a permanent pack-level design constraint unless explicitly changed.

---

# 24. First-Person Camera Policy

Do not add by default:

```text
excessive head bob
dynamic camera inertia
strong sprint shake
forced breathing sway
```

TaCZ already provides weapon feedback.

---

# 25. Tactical Readability

Animation must preserve:

```text
fast reaction
sprint-stop-shoot
crouch
ADS
reload
weapon switch
revive
climb / escape
```

Aesthetic polish must not reduce combat readability.

---

# 26. PlayerRevive Compatibility

Test:

```text
downed pose
crawl/incapacitated state
revive interaction
standing recovery
```

Look for:

```text
pose fighting
T-pose
snapping
stuck animation
```

---

# 27. TaCZ Compatibility Matrix

Test:

```text
Idle with gun
Walk
Sprint
Crouch
ADS
Fire
Reload
Weapon swap
Attachment interaction
```

Observe:

```text
first person
third person
remote multiplayer player
```

---

# 28. Tactical Gear Compatibility

Test:

```text
TakKit NVG
Brimm armor
CAPS_Awim
Sophisticated Backpacks
Curios
```

Watch for:

```text
clipping
floating equipment
body desync
headgear/NVG pose conflict
```

---

# 29. Create Compatibility

Test player animation while:

```text
standing on contraption
moving on contraption
riding train
using seats
using elevator
climbing Create structures
```

Document any unavoidable foot sliding or orientation issue.

---

# 30. MineColonies Compatibility

MineColonies NPCs remain native-owned.

Performance test:

```text
10 citizens
25 citizens
50 citizens
```

Do not force Vanilla animation replacements onto citizens without evidence.

---

# 31. Hordes Compatibility

Test:

```text
50 mobs
100 mobs
150 mobs
```

with:

```text
BAC
Smooth Movement
Entity Culling
ImmediatelyFast
Embeddium
```

Measure:

```text
FPS
1% low
frame time
entity render cost
```

---

# 32. Naturalist Compatibility

Naturalist entities keep native animations.

Verify:

```text
walk
run
idle
attack
swim
special animations
```

Smooth Movement may interpolate position only.

---

# 33. Born in Chaos Compatibility

Born in Chaos remains native-owned.

Test:

```text
movement
attack animation
special abilities
death
Smooth Movement interpolation
```

Reject interpolation settings that create hitbox/visual mismatch.

---

# 34. Ice & Fire Compatibility

Critical entities:

```text
Dragon
Cyclops
Troll
Hydra
Sea Serpent
Death Worm
```

retain native animation.

Test Smooth Movement especially for:

```text
dragon flight
takeoff
landing
charge
attack
```

Exclude problematic entities if supported and necessary.

---

# 35. Combat Readability

Hostile animation must not obscure:

```text
attack windup
facing direction
hit reaction
special ability cue
```

Combat readability outranks animation smoothness.

---

# 36. Animal Style Goal

Animals should feel:

```text
alive
cute
natural
ambient
```

while preserving Minecraft's visual language.

The contrast must remain:

```text
normal wildlife
vs
abnormal hostile creatures
```

---

# 37. Performance Layer Integration

Test with:

```text
Embeddium
ModernFix
FerriteCore
Entity Culling
ImmediatelyFast
ServerCore
```

If Fresh Animations is enabled, explicitly test:

```text
EMF
+
ETF
+
Fresh Animations
+
Entity Culling
```

---

# 38. Performance Documentation

Create:

```text
docs/animation-performance.md
```

Compare:

```text
Baseline
NEA only
SPA + NEA
BAC
BAC + Smooth Movement
BAC + EMF/ETF + selective FA
```

Metrics:

```text
Average FPS
1% low
frame time
CPU
GPU
RAM
VRAM
entity count
```

---

# 39. Benchmark Scene — Player

```text
tactical armor
TaCZ rifle
walk
sprint
crouch
ADS
reload
fire
```

Primary goal:

```text
animation correctness
```

---

# 40. Benchmark Scene — Vanilla Entities

Spawn controlled groups:

```text
20
50
100
```

Compare BAC vs selected FA ownership.

---

# 41. Benchmark Scene — Horde

Test:

```text
50
100
150
```

Look for:

```text
frame pacing
render bottleneck
interpolation artifacts
```

---

# 42. Benchmark Scene — Colony

Use mixed load:

```text
MineColonies
+
wildlife
+
player animation
+
Create activity
```

This represents real gameplay better than an empty benchmark arena.

---

# 43. Multiplayer Test

Test at least:

```text
2 players
4 players
```

Check:

```text
remote player SPA/NEA
TaCZ remote pose
Smooth Movement
equipment sync
```

---

# 44. Smooth Movement Network Test

Observe:

```text
normal ping
moderate ping
TPS fluctuation
packet jitter
```

Goal:

reduce visual jerk without:

```text
ghost positions
rubber-band-looking interpolation
server/client mismatch
```

---

# 45. Conflict Log

Create:

```text
docs/animation-conflicts.md
```

Record:

```text
Entity
Owner A
Owner B
Observed issue
Resolution
Version
```

---

# 46. Repository Structure

Recommended:

```text
docs/
├── animation-coverage.md
├── animation-performance.md
├── animation-conflicts.md
└── animation-test-plan.md

resourcepacks/
└── industrial-civilization-animation-compat/
```

Actual config file paths must come from first launch.

---

# 47. Phase A0 — Version Sweep

Verify exact Forge 1.20.1 builds for:

```text
Smooth Player Animations
Better Animations Collection
Smooth Movement
EMF
ETF
Fresh Animations
```

Record:

```text
version
source
dependencies
loader
side
license
```

---

# 48. Phase A1 — Player Baseline

Install:

```text
Smooth Player Animations
```

alongside existing:

```text
Not Enough Animations
```

Do not add FA/EMF/ETF yet.

---

# 49. Phase A2 — Player Combat Test

Test:

```text
TaCZ
TakKit
PlayerRevive
Backpacks
Curios
```

Resolve player conflicts before adding more animation layers.

---

# 50. Phase A3 — BAC Baseline

Install Better Animations Collection.

Audit Vanilla entities.

Create:

```text
docs/animation-coverage.md
```

---

# 51. Phase A4 — Smooth Movement

Install Smooth Movement.

Initial principle:

```text
living movement enabled
projectile smoothing disabled
```

Test Vanilla + modded mobs + multiplayer.

---

# 52. Phase A5 — Fresh Animations Evaluation

On a test branch/profile install:

```text
EMF
ETF
Fresh Animations
```

Compare entity-by-entity against BAC.

Do not make FA global owner automatically.

---

# 53. Phase A6 — Ownership Matrix

Assign every relevant Vanilla entity:

```text
BAC
FA
VANILLA
```

with documented reason.

---

# 54. Phase A7 — Selective FA Layer

Build resource-pack priority / selective ownership strategy.

Goal:

```text
FA owns only approved entities
```

Do not blindly delete or copy upstream assets.

---

# 55. Phase A8 — Performance Test

Run:

```text
Vanilla entity density
Horde
MineColonies
Wildlife
```

Compare:

```text
BAC-only
vs
BAC + selective FA
```

---

# 56. Phase A9 — Multiplayer Test

Test:

```text
remote SPA/NEA player
Smooth Movement
TaCZ
Horde
```

---

# 57. Phase A10 — Release Gate

Animation layer may merge only when:

```text
no major player pose conflict
no TaCZ ADS/reload conflict
no PlayerRevive stuck pose
no Vanilla model corruption
no severe Horde render regression
projectile smoothing still OFF unless separately validated
no redistribution/license issue
```

---

# 58. Optional Profiles

If selective Fresh Animations is measurably heavier:

## Standard

```text
Smooth Player Animations
Not Enough Animations
Better Animations Collection
Smooth Movement
```

## Enhanced Animation

```text
Standard
+
EMF
+
ETF
+
Selective Fresh Animations
```

Gameplay must remain identical.

---

# 59. Success Criteria — Player

Player should:

```text
walk smoothly
sprint naturally
transition smoothly
look good with tactical gear
use TaCZ correctly
recover correctly after revive
```

while staying responsive.

---

# 60. Success Criteria — Vanilla Entities

Vanilla mobs/animals should:

```text
look more alive
remain combat-readable
fit Minecraft's style
not clash badly with modded entities
```

---

# 61. Success Criteria — Modded Entities

Modded entities should:

```text
retain native animation
avoid accidental model override
interpolate cleanly where Smooth Movement is used
```

---

# 62. Failure Conditions

Reject/disable a component if it causes:

```text
T-pose
weapon pose corruption
player snapping
camera discomfort
broken revive pose
entity model distortion
attack animation mismatch
projectile visual/hit mismatch
severe FPS regression
```

---

# 63. Claude Code Hard Rules

## DO

1. Keep one primary animation owner per entity.
2. Prefer native animation for modded entities.
3. Use Smooth Player Animations + NEA for Player.
4. Use BAC as Vanilla default.
5. Use Fresh Animations selectively.
6. Keep Smooth Movement separate from animation ownership.
7. Keep projectile smoothing OFF initially.
8. Test TaCZ before declaring player animation stable.
9. Benchmark Horde/entity-heavy scenes.
10. Audit Fresh Animations licensing before redistribution.
11. Document ownership decisions.
12. Preserve Minecraft-like responsiveness.
13. Prioritize motion comfort for long sessions.

## DO NOT

1. Do not add AMF: Better Movement.
2. Do not use OptiFine.
3. Do not enable Fresh Animations Player Extension initially.
4. Do not blindly stack BAC and FA on the same entity.
5. Do not assume animation-level mixing is trivial.
6. Do not enable projectile smoothing before ballistic testing.
7. Do not force BAC/FA onto modded entities.
8. Do not add heavy camera sway/inertia.
9. Do not sacrifice combat readability for smoothness.
10. Do not claim compatibility without launching the game.

---

# 64. Final Architecture

```text
PLAYER
────────────────────────
Smooth Player Animations
+
Not Enough Animations

VANILLA MONSTERS / ANIMALS
────────────────────────
Better Animations Collection
        │
        └─ Fresh Animations
           only where approved
           through EMF + ETF

MODDED MONSTERS / ANIMALS
────────────────────────
Native mod animations

GLOBAL VISUAL MOVEMENT
────────────────────────
Smooth Movement
(projectiles OFF initially)
```

---

# 65. Final Feature Definition

> **The Animation & Movement Layer makes Industrial Civilization Survival smoother, more alive and more expressive without turning Minecraft into a real-world movement simulator. Player animation remains responsive and tactical, Vanilla creatures gain improved motion, modded creatures retain their native identity, and Smooth Movement improves visual continuity during multiplayer or server-load fluctuations.**

Target:

```text
More life
+
More smoothness
+
Better tactical presentation
+
No motion sickness
+
No unnecessary realism tax
```

Guiding sentence:

> **Smooth like a modern game, readable like Minecraft, comfortable enough to play for hundreds of days.**
