# Addon Spec — Khaojee Enchanted Visuals Integration
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Repository:** `xenodeve/minecraft-100day`  
> **Platform:** Minecraft 1.20.1 / Forge / Java 17  
> **Reference Video:** https://youtu.be/cxahj-PuLb0  
> **Reference Modpack:** https://modrinth.com/modpack/khaojee-enchanted-visuals  
> **Goal:** Adapt the strongest Vanilla+ visual ideas from Khaojee Enchanted Visuals without changing platform, breaking combat readability, duplicating existing systems, or turning the pack into a shader showcase.

---

# 1. Core Philosophy

Reference principle:

> Make Minecraft look better without losing Minecraft's charm.

Our version:

```text
Vanilla identity
+ environmental detail
+ smoother animation
+ better weather
+ richer particles
+ connected surfaces
+ industrial/tactical world
= Minecraft still looks like Minecraft
```

Default visuals must remain comfortable for long 100–300+ day multiplayer sessions.

---

# 2. Integration Strategy

Do **not** import the reference `.mrpack` directly.

Our hard constraints remain:

```text
Minecraft 1.20.1
Forge
Java 17
```

Each reference component must be classified as:

```text
ADOPT
ADOPT WITH REPLACEMENT
PROTOTYPE
OPTIONAL PROFILE
ALREADY COVERED
REJECT
```

---

# 3. Reference Inventory

## Terrain / Biomes
- Grassier Grass
- Biomes O' Plenty
- Regions Unexplored
- Better Biome Reblend
- Pufferfish's Biome Dither
- Countered's Terrain Slabs

## Textures / Decoration
- Continuity
- Connected Paths
- Connected Texture+
- Soft Imprints
- Musgo
- Lushier Forests
- 3D World Decorations
- Rainbow's Foliage
- Polytone

## Particles / Atmosphere
- Wakes
- Particular
- Subtle Effects
- Particle Rain
- Particle Interactions

## Animation
- EMF
- ETF
- Fresh Animations
- Fresh Animations: Player Extension
- Just Expressions
- Fancy World Animations
- Tree Physics
- Punchy

## Extra
- Item Interactions
- Client Backpack

## Sound
- AmbientSounds
- Auditory Continued
- Sound Physics Remastered
- Presence Footsteps

---

# 4. Initial Decisions

## Adopt / Strong Candidate

```text
Grassier Grass
Better Biome Blend / equivalent
Soft Imprints
Subtle Effects
Particle Rain
Fancy World Animations
Fusion (Forge-native connected-texture solution)
```

## Selective / Optional

```text
EMF
ETF
Fresh Animations
```

Governed by the separate Animation & Movement Spec.

## Prototype

```text
Biomes O' Plenty
Regions Unexplored
Countered's Terrain Slabs
3D World Decorations
Musgo
Lushier Forests
Polytone / foliage enhancements
Particle Interactions
```

## Already Covered

```text
AmbientSounds
Sound Physics Remastered
```

## Reject / Defer for Current Platform

```text
Wakes
Particular
Tree Physics
Item Interactions
Presence Footsteps
Auditory Continued
```

Do not add Fabric compatibility infrastructure solely to reproduce these visuals.

---

# 5. Grassier Grass

**Status:** CORE VISUAL CANDIDATE

Purpose:

```text
flat grass
→ denser
→ more natural
→ more alive
```

Must preserve Vanilla readability.

Test with:
- Embeddium
- Entity Culling
- ImmediatelyFast
- Serene Seasons
- Naturalist
- Ecologics
- MineColonies
- Create

Measure FPS, frame time and seasonal color behavior.

---

# 6. Better Biome Blend

**Status:** CORE VISUAL CANDIDATE

Smooth visual transitions between:
- grass
- leaves
- water

High-value situations:
- train travel
- city borders
- outposts
- long-distance exploration
- future aviation

It must not change biome logic, spawning or worldgen.

---

# 7. Soft Imprints

**Status:** CORE VISUAL CANDIDATE

Adds environmental traces such as footprints in:
- snow
- sand
- red sand

Useful for tactical atmosphere and wildlife ambience.

Performance requirements:
- bounded lifetime
- bounded density
- bounded distance where configurable

Do not allow persistent mark spam around colonies, farms or Horde battlefields.

---

# 8. Subtle Effects

**Status:** CORE VISUAL CANDIDATE

Desired effects:
- sparks
- smoke
- fire feedback
- block particles
- entity feedback
- low-health effects where tasteful

Rule:

> More feedback, not more noise.

Combat visibility must remain clear during TaCZ fights.

---

# 9. Particle Rain

**Status:** CORE / WEATHER CANDIDATE

Improves:
- rain
- snow
- wind feel
- atmospheric weather particles

Complements:
- Serene Seasons
- AmbientSounds
- Sound Physics Remastered

Mandatory stress test:

```text
Heavy rain
+ Horde
+ TaCZ automatic fire
+ Create factory
+ MineColonies
```

Keep only if frame-time and visibility remain acceptable.

---

# 10. Fancy World Animations

**Status:** CORE ANIMATION CANDIDATE

Target:
- doors
- trapdoors
- gates
- buttons
- levers
- chests
- lanterns
- chains
- supported world blocks

Animation architecture becomes:

```text
Player → Smooth Player Animations + NEA
Vanilla mobs → BAC / selective Fresh Animations
Modded mobs → native animations
Position interpolation → Smooth Movement
World blocks → Fancy World Animations
```

High-value locations:
- factories
- bunkers
- control rooms
- stations
- warehouses
- refineries
- command centers

---

# 11. Fresh Animations

**Status:** SELECTIVE / OPTIONAL

Use through:

```text
EMF
+
ETF
+
Fresh Animations
```

Hard rule:

> Fresh Animations does not become the default global owner.

Use it only for Vanilla entities selected in `docs/animation-coverage.md`.

Fresh Animations: Player Extension remains **OFF initially** because Player ownership already belongs to:

```text
Smooth Player Animations
+
Not Enough Animations
```

---

# 12. Connected Textures

Reference pack uses Continuity and related texture packs.

Our policy:

```text
Do not add Fabric compatibility infrastructure only for Continuity.
```

Preferred route:

```text
Fusion
+
compatible connected-texture resource pack
```

Use cases:
- factory glass
- control rooms
- station windows
- industrial walls
- greenhouses
- urban architecture

Test dense builds with Embeddium and ImmediatelyFast.

---

# 13. Biomes O' Plenty

**Status:** PROTOTYPE

This is not merely visual.

It affects:
- world geography
- travel distance
- oil-field search
- dragon territory
- rail planning
- wildlife distribution
- settlement locations

Do not merge automatically.

---

# 14. Regions Unexplored

**Status:** PROTOTYPE

Same worldgen concerns as BOP.

Worldgen evaluation must compare:

```text
A. Current pack
B. + BOP
C. + Regions Unexplored
D. + Both
```

Default bias:

> Prefer one biome expansion unless testing proves both are worth the cost.

Avoid kitchen-sink geography.

---

# 15. Worldgen Test Criteria

Across multiple seeds evaluate:
- spawn safety
- settlement locations
- oil access
- dragon worldgen
- rail corridors
- biome readability
- world size
- generation time
- wildlife distribution

Do not decide from one seed.

---

# 16. Countered's Terrain Slabs

**Status:** PROTOTYPE

Potential compatibility risks:
- MineColonies pathfinding
- player movement
- rail construction
- Create contraptions
- mob navigation
- future vehicles

Visual improvement alone does not justify gameplay regressions.

---

# 17. 3D World Decorations

**Status:** PROTOTYPE

Evaluate:
- model density
- GPU cost
- visual clutter
- Horde visibility
- city FPS

Do not sacrifice tactical readability for decoration.

---

# 18. Musgo / Lushier Forests / Foliage

**Status:** PROTOTYPE / OPTIONAL

Goal:

```text
better forests
without
visual clutter
or
target visibility problems
```

A foliage mod fails if it makes TaCZ combat frustrating.

---

# 19. Polytone / Color Layer

**Status:** PROTOTYPE

Only keep if it:
- improves atmosphere
- works with Serene Seasons
- does not create platform compromise
- does not conflict with biome blending/resource packs

---

# 20. Platform-Mismatch Components

Current default decision:

```text
Wakes → REJECT/DEFER
Particular → REJECT/DEFER
Tree Physics → REJECT/DEFER
Item Interactions → REJECT/DEFER
Presence Footsteps → REJECT/DEFER
Auditory Continued → REJECT/DEFER
```

Reason:

> Compatibility cost is greater than the unique value they currently add.

Do not use a compatibility bridge unless a future requirement justifies it at architecture level.

---

# 21. Sound Stack

Already owned by:

```text
AmbientSounds
Sound Physics Remastered
Simple Voice Chat
Simple Voice Radio
```

Do not duplicate AmbientSounds or Sound Physics.

---

# 22. Shader Policy

Default pack:

```text
NO REQUIRED SHADER
```

Reason:
- 3–4 players may have different GPUs
- Hordes are render-heavy
- Create cities are render-heavy
- combat readability matters

Shaders may be:

```text
OPTIONAL CINEMATIC PROFILE
```

Never required for multiplayer.

---

# 23. Visual Profiles

## Standard

```text
Grassier Grass
Better Biome Blend
Soft Imprints
Subtle Effects
Particle Rain
Fancy World Animations
Fusion
SPA + NEA + BAC + Smooth Movement
```

## Enhanced

```text
Standard
+
EMF
ETF
Selective Fresh Animations
approved extra foliage
```

## Cinematic Optional

```text
Enhanced
+
user-selected shader
```

Gameplay behavior must remain identical between profiles.

---

# 24. Performance Philosophy

Optimize for:

```text
frame-time stability
1% lows
combat readability
Horde performance
```

not maximum screenshot quality.

The visual layer must be tested with:

```text
Embeddium
ModernFix
FerriteCore
Entity Culling
ImmediatelyFast
ServerCore
```

---

# 25. Benchmark Scene A — Natural World

Scene:

```text
forest
grass
wildlife
weather
```

Measure:
- average FPS
- 1% low
- frame time
- GPU usage
- VRAM
- RAM

---

# 26. Benchmark Scene B — Main City

Scene:

```text
MineColonies
street lights
factories
connected textures
Fancy World Animations
players
```

This is a realistic sustained-load scene.

---

# 27. Benchmark Scene C — Horde in Rain

Mandatory stress test:

```text
100+ hostiles
Particle Rain
Subtle Effects
TaCZ gunfire
muzzle effects
entity animation
```

Reject or tune any component that causes severe frame-time instability.

---

# 28. Benchmark Scene D — Rail Travel

Use:
- Create train
- multiple biomes
- weather
- biome blending
- foliage

Look for:
- chunk stutter
- color transition artifacts
- weather hitching

---

# 29. Benchmark Scene E — Night Tactical Operation

Use:
- flashlight
- weapon light
- NVG
- dynamic light
- forest
- rain
- particles

Ensure target visibility remains good.

---

# 30. Visual Density Budget

If performance is insufficient, reduce in this order:

```text
1. extra particles
2. decorative 3D elements
3. dense foliage
4. optional Fresh Animations coverage
5. weather particle density
```

Do not first cut core gameplay systems.

---

# 31. Particle Budget

Combined particle load includes:

```text
TaCZ muzzle effects
TaCZ tracers
Subtle Effects
Particle Rain
Create processing
fire
explosions
Horde combat
CBC later
```

Benchmark the stack as a whole.

---

# 32. Weather Visibility Rule

Rain/snow must never make:
- ADS unreadable
- NVG unusable
- Horde silhouettes invisible

Reduce density if necessary.

---

# 33. Worldgen Lock Rule

Do not casually add/remove major biome mods after the persistent multiplayer world begins.

Worldgen decisions should be finalized before long-term play where practical.

---

# 34. Multiplayer Target

Balance visual testing around:

```text
3 players = baseline team
4 players = full team
```

Benchmark:
- city
- rain
- Horde
- train
- forest
- gunfight

---

# 35. Redistribution / Licensing

Before shipping:
- verify license
- verify redistribution permission
- record attribution
- record resource-pack conditions

Especially inspect:
- Fresh Animations
- connected texture packs
- decorative resource packs

Update:

```text
docs/distribution-licenses.md
```

---

# 36. Source Tracking

Create:

```text
docs/khaojee-visual-reference.md
```

Recommended columns:

```text
Reference Project
Our Choice
Version
Platform
Status
Reason
License
```

---

# 37. Implementation Phases

## V0 — Reference Audit

Verify each selected project:
- exact Forge 1.20.1 build
- dependencies
- client/server side
- license

## V1 — Safe Visual Baseline

Add:
```text
Grassier Grass
Better Biome Blend
Soft Imprints
Subtle Effects
Fancy World Animations
```

Do not add worldgen expansion in the same phase.

## V2 — Weather

Add:
```text
Particle Rain
```

Test with Serene Seasons + TaCZ + Horde.

## V3 — Connected Textures

Evaluate:
```text
Fusion
```

Test dense industrial builds.

## V4 — Animation Integration

Follow Animation & Movement Spec:
```text
EMF
ETF
Selective Fresh Animations
```

No Player Extension initially.

## V5 — Decorative Prototypes

Test separately:
```text
3D World Decorations
Musgo
Lushier Forests
Polytone-based foliage
Particle Interactions
```

## V6 — Worldgen Branch A

Test:
```text
Biomes O' Plenty
```

## V7 — Worldgen Branch B

Test:
```text
Regions Unexplored
```

## V8 — Worldgen Comparison

Compare:
```text
Base
BOP
RU
BOP + RU
```

## V9 — Multiplayer Benchmark

Test 3–4 players in representative scenarios.

## V10 — Final Visual Profiles

Define:
```text
Standard
Enhanced
Cinematic Optional
```

---

# 38. Definition of Done — Standard Visual Layer

Ready when:

- Minecraft still looks unmistakably like Minecraft.
- No shader is required.
- No unnecessary Fabric compatibility bridge exists.
- Grass / biome / environmental improvements work.
- Weather remains combat-readable.
- Fancy World Animations does not break interaction.
- Particle load is acceptable during Horde combat.
- TaCZ / NVG / flashlight remain readable.
- FPS/frame-time are acceptable.
- Licenses are documented.
- Exact versions are pinned.
- Clean client boot succeeds.

---

# 39. Definition of Done — Worldgen Layer

Ready only when:

- multiple seeds are tested
- Ice & Fire worldgen works
- oil/resource geography remains practical
- settlement sites remain available
- rail construction remains reasonable
- world generation performance is measured
- persistent-world decision is documented

---

# 40. Failure Conditions

Reject or reduce a component if it causes:

```text
combat visibility loss
motion sickness
severe FPS regression
worldgen incompatibility
MineColonies pathfinding problems
Create interaction bugs
NVG readability problems
particle overload
model corruption
license uncertainty
```

---

# 41. Claude Code Hard Rules

## DO

1. Treat Khaojee Enchanted Visuals as a reference, not a dependency.
2. Preserve Minecraft's art direction.
3. Prefer native Forge 1.20.1 solutions.
4. Prefer Fusion over adding a Fabric bridge only for Continuity.
5. Test particles under real combat load.
6. Test visual mods with the performance stack.
7. Keep Fresh Animations selective.
8. Keep Player animation under SPA + NEA.
9. Prototype biome mods separately.
10. Benchmark 3–4 player scenarios.
11. Protect tactical readability.
12. Document licensing.
13. Pin exact versions.
14. Keep shaders optional.

## DO NOT

1. Do not import the whole reference modpack.
2. Do not change Minecraft version or loader.
3. Do not add Fabric Connector solely for visuals.
4. Do not install BOP + RU automatically.
5. Do not duplicate AmbientSounds or Sound Physics.
6. Do not enable Fresh Animations Player Extension by default.
7. Do not stack particles without profiling.
8. Do not let foliage block targets.
9. Do not make shaders mandatory.
10. Do not casually change worldgen after persistent play starts.
11. Do not claim compatibility without launch testing.

---

# 42. Recommended Initial Adoption Set

```text
Grassier Grass
Better Biome Blend
Soft Imprints
Subtle Effects
Particle Rain
Fancy World Animations
Fusion
```

Animation integration:

```text
EMF
ETF
Fresh Animations
```

only where approved by the Animation Coverage Matrix.

---

# 43. Prototype Set

```text
Biomes O' Plenty
Regions Unexplored
Countered's Terrain Slabs
3D World Decorations
Musgo
Lushier Forests
Polytone / foliage enhancements
Particle Interactions
```

---

# 44. Rejected / Deferred Set

```text
Wakes
Particular
Tree Physics
Item Interactions
Presence Footsteps
Auditory Continued
```

---

# 45. Final Architecture

```text
               INDUSTRIAL CIVILIZATION SURVIVAL
                          │
                          ▼
                 Vanilla Visual Identity
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ENVIRONMENT         ANIMATION         ATMOSPHERE
        │                 │                 │
Grassier Grass      SPA + NEA         Subtle Effects
Biome Blend         BAC / FA          Particle Rain
Soft Imprints       Smooth Move       AmbientSounds
Fusion              Fancy World       Sound Physics
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  Performance Layer
                          │
                          ▼
                 3–4 Player Multiplayer
```

---

# 46. Final Feature Definition

> **Khaojee Enchanted Visuals Integration adapts the strongest Vanilla+ visual ideas from the reference pack to Industrial Civilization Survival's Forge 1.20.1 architecture. The goal is not to copy Khaojee exactly, but to make the world greener, smoother, more atmospheric and more alive while keeping combat readable, performance stable and Minecraft instantly recognizable.**

Guiding sentence:

> **Minecraft, but every part of the world feels a little more alive — without becoming a different game.**
