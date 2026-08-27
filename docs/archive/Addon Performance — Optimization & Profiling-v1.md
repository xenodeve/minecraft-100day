<!-- SUPERSEDED — NOT AUTHORITY. Do not cite this file. -->

> # ⛔ SUPERSEDED — Performance Spec **v1**
>
> **This file is history. An agent must not treat it as authority.**
>
> The canonical Performance Spec is
> [`docs/Addon Performance — Optimization & Profiling.md`](../Addon%20Performance%20%E2%80%94%20Optimization%20%26%20Profiling.md),
> which merges this file with v2 and carries stable `PERF-*` identifiers (#93).
>
> **Every rule below that still applies was backported.** It is kept only so the merge can be
> audited against its source, and because its section numbers appear in `DONE.md` entries written
> while it was current.
>
> **Its `§N` numbers are dead as citations.** v1 §5 was *Embeddium Rules*; v2 §5 was something
> else entirely. That collision is why `PERF-*` ids exist.

---

# Addon Spec — Performance Optimization & Profiling Layer
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Platform:** Minecraft 1.20.1 Forge / Java 17  
> **Purpose:** สร้าง performance layer สำหรับ modpack ขนาดใหญ่ที่มี Create, MineColonies, TaCZ, Hordes, wildlife, advanced mob AI, worldgen, trains และในอนาคต Valkyrien Skies / Clockwork / Warium โดยต้อง optimize ทั้ง Client FPS, RAM, Server TPS/MSPT, entity ticking, recipe processing, chunk generation และ gunfight load
>
> เอกสารนี้ต้องสามารถใช้เป็น standalone implementation context สำหรับ Claude Code CLI โดยไม่ต้องมี conversation history
>
> **Core rule:** ห้ามติดตั้ง performance mods แบบ blind stacking ทุกตัวต้องผ่าน compatibility test และ benchmark ก่อน/หลัง

---

# 1. Performance Philosophy

Industrial Civilization Survival เป็น modpack ที่มี workload หลายแบบพร้อมกัน:

```text
Create factories
+
Create trains / contraptions
+
MineColonies NPCs
+
TaCZ bullets / tracers / gun animations
+
Born in Chaos
+
The Hordes
+
Enhanced AI
+
Improved Mobs
+
Naturalist wildlife
+
Critters and Companions
+
IceAndFire creatures
+
CCTV / Security systems
+
World generation
+
Future Valkyrien Skies physics
```

ดังนั้น performance strategy ต้องแบ่งเป็นหลาย layer

```text
Client Rendering
Server Simulation
Memory
Entity Management
Recipe Processing
Chunk Generation
Gun System
Pack Design
Profiling
```

เป้าหมายไม่ใช่:

```text
Install every optimization mod available
```

เป้าหมายคือ:

> ใช้ optimization ที่วัดผลได้จริง โดยไม่เปลี่ยน gameplay หรือทำให้ระบบสำคัญของ pack พัง

---

# 2. Approved Core Performance Stack

เริ่มจาก stack นี้ก่อน:

```text
1. Embeddium
2. ModernFix
3. FerriteCore
4. Entity Culling
5. ImmediatelyFast
6. ServerCore
7. FastSuite
8. Clumps
9. TaCZ: Accelerated
```

Server/world tool:

```text
10. Chunky OR Chunk-Pregenerator
```

ห้ามติดตั้ง Chunky และ Chunk-Pregenerator พร้อมกันโดยไม่มีเหตุผล

---

# 3. Experimental Performance Candidates

ยังไม่ถือเป็น Core

```text
AI Improvements
Let Me Despawn
Alternate Current
Canary
TaCZ Optimization
Smooth Boot Reloaded
```

แต่ละตัวต้องมี isolated benchmark branch ก่อน merge

---

# 4. Embeddium

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/embeddium
```

## Status

```text
CORE
CLIENT PERFORMANCE
COMPATIBILITY TEST REQUIRED
```

## Role

Embeddium เป็น rendering optimization layer หลักของ Forge 1.20.1

หน้าที่หลัก:

```text
Terrain rendering
Chunk rendering
Render batching
Client FPS improvement
CPU/GPU render efficiency
```

เหมาะกับ pack เพราะเมืองจะมี:

```text
Create machines
Belts
Pipes
Train tracks
Street lights
MineColonies buildings
CCTV
Furniture
Industrial blocks
Large cities
```

---

# 5. Embeddium Rules

Do:

- Test with Create 6.0.x exact version
- Test with TaCZ rendering
- Test with dynamic lights
- Test with Jade overlays
- Test with ImmediatelyFast
- Test with Entity Culling
- Test shader compatibility only if shaders are officially supported later

Do not:

```text
Install OptiFine
```

OptiFine ไม่ใช่ส่วนหนึ่งของ target architecture

---

# 6. ModernFix

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/modernfix
```

## Status

```text
CORE
COMMON
MEMORY + STARTUP + BUG/PERFORMANCE FIXES
```

## Role

ModernFix ใช้สำหรับ:

```text
Memory reduction
Startup optimization
Resource/cache optimization
Forge/mod performance fixes
General bug fixes
```

มีค่ามากกับ pack ที่มี:

```text
Large item registry
Large block registry
Many recipes
Many models
Many resource packs
Many mods
```

---

# 7. ModernFix Rules

ต้อง:

- Pin exact version
- Inspect generated config
- Keep defaults initially
- Only disable individual fixes if an actual incompatibility is measured

ห้าม:

```text
randomly toggle ModernFix mixins
```

เพราะเห็น config จำนวนมากแล้วคิดว่าเปิด/ปิดได้ตามใจ

---

# 8. FerriteCore

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/ferritecore
```

## Status

```text
CORE
MEMORY OPTIMIZATION
```

## Role

ลด memory usage โดยเฉพาะ blockstate/model-related structures

Pack นี้มี block variety สูงจาก:

```text
Create
TFMG
Immersive Engineering
MineColonies
SecurityCraft
Macaw's Lights
Refurbished Furniture
Ecologics
```

ดังนั้น FerriteCore เป็น high-value low-complexity optimization

---

# 9. Entity Culling

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/entityculling
```

## Status

```text
CORE
CLIENT
```

## Role

ไม่ render:

```text
Entities
Block Entities
```

ที่ถูก geometry บังและมองไม่เห็น

เหมาะกับ:

```text
Dense city
MineColonies
Factories
Warehouses
Interior machinery
Large structures
Horde outside walls
```

---

# 10. Entity Culling Important Constraint

Entity Culling ต้องไม่:

```text
change server simulation
change AI
change mob existence
```

มันควรเป็น visual/render optimization เท่านั้น

Test special rendering ของ:

```text
TaCZ
CCTV
Create contraptions
IceAndFire creatures
Valkyrien Skies later
```

ว่าถูก cull ผิดหรือไม่

---

# 11. ImmediatelyFast

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/immediatelyfast
```

## Status

```text
CORE
CLIENT RENDERING
```

## Role

Optimize immediate-mode rendering / batching เช่น:

```text
Entities
Particles
Text
GUI
HUD
Block entities
Modded rendering paths
```

เหมาะกับ:

```text
TaCZ tracers
Muzzle flash
Particles
Horde mobs
JEI
Jade
Create machinery
```

---

# 12. Client Rendering Stack

Preferred starting stack:

```text
Embeddium
+
ImmediatelyFast
+
Entity Culling
```

Benchmark แยก:

```text
Vanilla Forge baseline
↓
+ Embeddium
↓
+ ImmediatelyFast
↓
+ Entity Culling
```

Record FPS และ frame-time ทุกขั้น

อย่า benchmark แค่ FPS average

---

# 13. ServerCore

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/servercore
```

## Status

```text
CORE
SERVER
HEAVY CONFIG
```

## Role

ServerCore ใช้ลด server simulation cost ผ่านระบบเช่น:

```text
Entity activation range
Reduced inactive ticking
Mob spawning optimization
Server entity management
```

นี่เป็นหนึ่งในตัวสำคัญที่สุดของ pack เพราะ workload หลักของ server คือ entity

---

# 14. ServerCore Critical Exclusions

ห้ามใช้ activation/tick reduction กับ entity สำคัญโดยไม่ตรวจสอบ

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

---

# 15. ServerCore Philosophy

ใช้:

```text
normal wildlife far away
ordinary hostile mobs far away
ambient creatures
```

เป็น target หลักของ reduced ticking

อย่าใช้ server optimization เพื่อทำให้:

```text
Dragon freezes when player steps 70 blocks away
Train stops
MineColonies worker breaks
Horde loses AI
```

---

# 16. FastSuite

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/fastsuite
```

## Status

```text
CORE
COMMON
RECIPE OPTIMIZATION
```

## Role

Optimize recipe processing / recipe lookup

Pack มี recipe volume สูงจาก:

```text
JEI
KubeJS
Create
TaCZ
Create: TaCZ
TFMG
Farmer's Delight
MineColonies
Immersive Engineering
SecurityCraft
Furniture
Custom integration
```

FastSuite เหมาะกับ recipe-heavy pack

---

# 17. FastSuite Test Matrix

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

หาก recipe lookup มี bug:

ให้ isolate ก่อน disable FastSuite ทั้งหมด

---

# 18. Clumps

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/clumps
```

## Status

```text
CORE
SERVER + CLIENT ENTITY REDUCTION
```

## Role

รวม XP orbs เพื่อลด entity count

สำคัญหลัง:

```text
Horde battle
Large mob farm
Mass combat
Dragon fight
```

Concept:

```text
100 XP orbs
↓
few merged XP entities
```

---

# 19. TaCZ: Accelerated

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/tacza
```

## Status

```text
CORE CANDIDATE
PROMOTE AFTER BENCHMARK
TACZ-SPECIFIC
```

## Role

Optimize TaCZ hot paths เช่น:

```text
Bullet processing
Rendering
Repeated lookups
Temporary allocations
Gunpack assets/cache
```

Pack มี high-concurrency gunfire use case:

```text
4–8 players
+
automatic rifles
+
Horde
+
Born in Chaos
+
TaCZ Additions
+
Guns Lights
+
Attract to Sound
```

ดังนั้นตัวนี้มี potential สูงมาก

---

# 20. TaCZ: Accelerated Test Matrix

ต้องทดสอบกับ:

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

# 21. Chunk Pregeneration

เลือกหนึ่ง:

```text
Chunky
OR
Chunk-Pregenerator
```

## Status

```text
SERVER TOOL
NOT GAMEPLAY CONTENT
```

## Purpose

ลด chunk-generation spikes ตอนผู้เล่นสำรวจ

Pack worldgen มี:

```text
Ecologics
IceAndFire
Oil resources
Structures
Biomes
Create-related world content
Other modded generation
```

และ players จะเดินทางไกลด้วย:

```text
Train
Ground vehicles
Aircraft later
```

---

# 22. Pregeneration Strategy

ก่อนเปิด persistent multiplayer world:

pregenerate safe operational region

Example conceptual radius:

```text
5,000–10,000 blocks
```

แต่ exact radius ขึ้นกับ:

```text
Storage
Generation time
Expected player count
Exploration design
```

อย่า pregenerate 50,000 blocks แบบไม่มีเหตุผล

---

# 23. Pregeneration Verification

หลัง pregenerate:

check:

```text
world size
generation errors
missing structures
IceAndFire worldgen
oil generation
biome distribution
server logs
```

Backup ก่อนทดลอง pregeneration command บน production world

---

# 24. AI Improvements

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/ai-improvements
```

## Status

```text
EXPERIMENTAL
DO NOT INSTALL IN MAIN BY DEFAULT
```

## Reason

Pack มี:

```text
Enhanced AI
Improved Mobs
ServerCore
```

อยู่แล้ว

AI Improvements อาจแตะ logic เดียวกัน

ต้อง inspect:

```text
Mixins
Goals
Target classes
Entity behavior
```

ก่อนใช้

---

# 25. AI Improvements Benchmark Branch

Branch:

```text
perf/ai-improvements
```

Test:

```text
100 zombies
Born in Chaos
Horde
MineColonies nearby
Enhanced AI enabled
```

ถ้า MSPT ดีขึ้นแต่ mob behavior พัง:

```text
REJECT
```

Gameplay correctness สำคัญกว่า benchmark number

---

# 26. Let Me Despawn

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/let-me-despawn
```

## Status

```text
EXPERIMENTAL
HEAVY CONFIG
```

## Role

ลด persistent mob buildup ผ่าน despawn behavior

เหมาะกับ common mobs

---

# 27. Let Me Despawn Exclusion Candidates

ห้ามปล่อย despawn แบบ generic กับ:

```text
Dragons
Bosses
Named mobs
MineColonies NPCs
Horde key entities
Tamed animals
Important wildlife
Quest entities
Special Born in Chaos elites
```

ต้อง inspect exact tags/entity IDs

---

# 28. Alternate Current

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/alternate-current
```

## Status

```text
EXPERIMENTAL
REDSTONE OPTIMIZATION
```

## Role

Optimize redstone dust update logic

Potentially useful in industrial cities

Test interaction with:

```text
Create Redstone Links
Observers
SecurityCraft
Industrial automation
Rail signaling
MineColonies automation
```

---

# 29. Canary

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/canary
```

## Status

```text
PROTOTYPE ONLY
BROAD OPTIMIZATION
```

## Reason for Caution

Canary เป็น broad optimization mod และอาจ overlap กับ:

```text
ModernFix
ServerCore
Enhanced AI
Create
MineColonies
Future Valkyrien Skies
```

ห้ามใส่ main branch โดยตรง

---

# 30. TaCZ Optimization

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/tacz-optimization
```

## Status

```text
OPTIONAL CLIENT PERFORMANCE PROFILE
```

## Role

ลด rendering ของ:

```text
other players' guns
attachments
tracers
effects
```

เหมาะกับ:

```text
low-end client
large multiplayer firefights
```

แต่ visual fidelity ลด

ดังนั้นไม่ควรเป็น default ถ้าไม่จำเป็น

---

# 31. Performance Profiles

Future optional client profiles:

## Standard

```text
Full tactical visuals
Normal tracers
Normal animations
```

## Performance

```text
Reduced remote weapon visuals
Reduced particles
Lower render distance recommendations
TaCZ Optimization enabled if stable
```

Gameplay configs ต้องเหมือนกัน

ห้ามสร้าง gameplay advantage ต่างกัน

---

# 32. Profiling Tool

ใช้:

```text
spark
```

หรือ equivalent profiler ที่รองรับ exact environment

ต้องเก็บ:

```text
TPS
MSPT
Entity tick time
Chunk tick time
World generation time
Memory
GC behavior
```

Client:

```text
FPS
1% lows
Frame time
GPU usage
CPU usage
RAM
VRAM if available
```

---

# 33. Benchmark Philosophy

ห้ามใช้:

```text
"รู้สึกลื่นขึ้น"
```

เป็นหลักฐานหลัก

ต้องมี baseline

Example:

```text
Scenario A
No optimization

Scenario B
+ ModernFix

Scenario C
+ FerriteCore

Scenario D
+ ServerCore
```

record results

---

# 34. Benchmark Documentation

Create:

```text
docs/performance.md
```

Recommended table:

```text
Build
Scenario
Players
Entities
MSPT Avg
MSPT P95
FPS Avg
FPS 1% Low
RAM
Notes
```

---

# 35. Standard Benchmark World

สร้าง world/save สำหรับ performance testing โดยเฉพาะ

ต้องมี zones:

```text
Zone A — Empty baseline
Zone B — Create factory
Zone C — MineColonies settlement
Zone D — Horde arena
Zone E — Wildlife area
Zone F — Dragon encounter
Zone G — Train network
```

Future:

```text
Zone H — Valkyrien Skies physics
```

---

# 36. Benchmark Scenario A — Idle Base

Target:

```text
Main city
Create factory partially active
MineColonies loaded
No combat
```

Measure:

```text
Idle MSPT
Client FPS
RAM
```

---

# 37. Benchmark Scenario B — Factory Load

Run:

```text
Belts
Fans
Presses
Mixers
Deployers
Fluid systems
Train station
```

Measure:

```text
MSPT
Block entity tick
Client FPS
```

---

# 38. Benchmark Scenario C — Horde Combat

Test:

```text
50 mobs
100 mobs
150 mobs
200 mobs
```

with:

```text
Enhanced AI
Improved Mobs
Attract to Sound
TaCZ automatic fire
```

Record server degradation curve

---

# 39. Benchmark Scenario D — Multiplayer Gunfight

Test:

```text
2 players
4 players
8 players
```

all firing automatic weapons

with:

```text
TaCZ Additions
Guns Lights
Attract to Sound
```

Measure:

```text
MSPT
FPS
Projectile processing
Network stability
```

---

# 40. Benchmark Scenario E — MineColonies

Population steps:

```text
10 NPC
25 NPC
50 NPC
75 NPC
```

Measure:

```text
NPC tick cost
Pathfinding
MSPT
```

This is critical because MineColonies may become one of the largest persistent CPU costs

---

# 41. Benchmark Scenario F — Wildlife

Test:

```text
25 passive entities
50 passive entities
100 passive entities
```

from:

```text
Naturalist
Critters and Companions
Ecologics
```

Determine practical spawn budget

---

# 42. Benchmark Scenario G — World Generation

Measure:

```text
walking exploration
train travel
high-speed travel
```

with and without pregeneration

Future:

```text
aircraft exploration
```

---

# 43. Performance Budget Philosophy

The following systems compete for server CPU:

```text
MineColonies
Hostile AI
Wildlife
Horde
TaCZ projectiles
Create
World generation
Future physics
```

ดังนั้นต้องมี budget

ไม่ใช่ให้ทุก subsystem ใช้ทรัพยากรเต็มที่พร้อมกัน

---

# 44. Entity Budget

If entity count becomes excessive:

reduce in this order:

```text
1. Decorative ambient wildlife
2. Small critters
3. Common passive animals
4. Redundant hostile mobs
5. Horde maximum size
```

Do not first nerf:

```text
MineColonies core behavior
Dragon identity
Create logistics
Player combat
```

---

# 45. Horde Performance Budget

Horde design must include technical cap

Example test tiers:

```text
Tier I
50 mobs

Tier II
100 mobs

Tier III
150 mobs
```

Do not assume:

```text
500 mobs = better horde
```

A smaller intelligent horde is preferable to a 5 TPS slideshow

---

# 46. Mob AI Performance

Threat difficulty should come from:

```text
AI
positioning
abilities
armor
mob composition
sound response
```

not merely:

```text
huge mob count
```

This improves both gameplay and performance

---

# 47. Create Performance Design

Pack design itself must optimize Create

Factories should not run forever with output storage full

Preferred:

```text
Storage
↓
Threshold Switch
↓
Factory Control
↓
Stop when full
```

Use:

```text
Redstone control
Threshold switches
Clutches
Stockpile limits
```

---

# 48. Create Anti-Pattern

Avoid:

```text
Always-on belts
Always-on deployers
Always-on fans
Always-on pumps
Always-on crafting
```

when no production demand exists

Consumption economy should create real demand

but factories should still stop when buffers are full

---

# 49. Item Entity Control

Avoid large loose-item systems

Use:

```text
Belts
Funnels
Chutes
Storage
```

properly

Do not intentionally allow thousands of dropped items

Potential future cleanup tools only if needed

---

# 50. MineColonies Performance Design

Do not create enormous population caps before profiling

Growth target should consider:

```text
Server hardware
Player count
Other entities
```

Monitor:

```text
pathfinding
citizen AI
loaded colony chunks
```

---

# 51. Wildlife Performance Design

Normal animals add atmosphere

They are not core mechanics

If performance budget is exceeded:

```text
reduce spawn frequency
reduce group sizes
reduce ambient species density
```

before compromising core industrial gameplay

---

# 52. Attract to Sound Performance

Potential danger:

```text
automatic weapon
↓
many gunshot events
↓
many mobs recalculate targets/path
```

This could become expensive

Test:

```text
semi-auto
full-auto
multiple players
HMG/autocannon later
```

If profiling identifies sound-event spam:

first inspect mod configuration/API

Possible strategy:

```text
event coalescing
cooldown
sound radius tuning
```

but only if supported or custom integration is justified

Do not invent implementation prematurely

---

# 53. TaCZ Projectile Budget

Monitor:

```text
active bullets
tracers
impact particles
muzzle effects
```

Particularly:

```text
LMG
HMG
Aircraft cannon
CBC/Warium weapons
```

Late-game weapons must be benchmarked separately

---

# 54. CCTV / Security Rendering

CameraCraft live views may create additional rendering cost

Test:

```text
1 camera
4 cameras
8 cameras
security room with multiple feeds
```

If expensive:

reduce simultaneously active live feeds

Do not remove CCTV gameplay without measurement

---

# 55. Dynamic Lights

Dynamic lighting can be expensive depending on implementation

Test:

```text
flashlights
weapon lights
multiple squad members
city night operations
```

Client Dynamic Light and TaCZ lighting addons must be profiled together

---

# 56. Resource Packs

Avoid extremely high-resolution textures by default

Pack-owned resource assets should match Minecraft/mod visual scale

Optional high-res packs can be separate

---

# 57. Render Distance Guidance

Do not hard-force low render distance

After profiling provide recommendation

Possible example:

```text
Standard:
12–16 chunks

High-end:
18–24 chunks

Server simulation:
separate tuned value
```

Do not lock until tested

---

# 58. Simulation Distance

Server simulation distance is more important than visual render distance for CPU load

Test:

```text
6
8
10
12
```

with:

```text
MineColonies
Create
Hordes
Wildlife
```

Choose pack/server default after benchmark

---

# 59. Chunk Loading

Audit all mods capable of force-loading chunks

Potential sources:

```text
MineColonies
Create trains
player utilities
server tools
```

Do not allow unlimited chunk loading

Persistent loaded chunks can destroy idle server performance

---

# 60. World Border

For multiplayer, consider world border appropriate to current season

Benefits:

```text
controls storage growth
limits accidental 100k-block exploration
simplifies pregeneration
```

But do not use tiny border that harms exploration

Exact size is design decision, not hard-coded here

---

# 61. Future Valkyrien Skies Performance Gate

Season 2 mods:

```text
Valkyrien Skies 2
Clockwork
Warium
```

must not enter main branch merely because they launch

Required benchmark:

```text
1 vehicle
3 vehicles
5 vehicles
active aircraft
Create machinery on physics objects if supported
combat
```

---

# 62. Season 2 Merge Gate

Merge only if:

```text
No critical crashes
No world corruption
Acceptable MSPT
Acceptable multiplayer sync
No severe Create conflict
```

If physics stack destabilizes main pack:

keep Season 2 separate

---

# 63. GC / JVM

Do not blindly copy giant JVM flag lists from Reddit

Start with:

```text
Java 17
reasonable RAM allocation
default/launcher-supported GC
```

Measure first

Only add JVM tuning if profiling demonstrates GC issue

---

# 64. RAM Allocation

Do not tell users:

```text
allocate all system RAM
```

Too much heap can worsen GC behavior

Recommended range must be determined after final mod count and profiling

Document tested values later in README

---

# 65. Memory Leak Testing

Long-session test:

```text
30 minutes
1 hour
2 hours
4 hours
```

Record:

```text
heap usage
GC recovery
entity count
loaded chunks
```

Look for memory that never returns

---

# 66. Dedicated Server Soak Test

Run server unattended with representative loaded systems

Test:

```text
2 hours
6 hours
12 hours
```

Inspect:

```text
MSPT drift
RAM growth
log errors
entity accumulation
```

---

# 67. Client Soak Test

Spend long session in:

```text
main city
factory
horde
train travel
```

Check:

```text
FPS degradation
VRAM
RAM
resource reload
```

---

# 68. Performance Regression Rule

Every major feature addition must answer:

```text
Did MSPT worsen?
Did FPS worsen?
Did RAM increase significantly?
```

If yes:

document expected cost

Do not accept unexplained regressions

---

# 69. Performance Regression Threshold

Exact thresholds depend on hardware

But any change causing:

```text
>10–15% sustained MSPT regression
```

in equivalent scenario should be investigated

Likewise major FPS/frame-time regression

Do not automatically reject if feature value justifies cost

but document trade-off

---

# 70. Hardware Test Profiles

Maintain at least:

```text
Developer PC
Mid-range friend PC
Dedicated server target
```

Do not optimize only for one high-end machine

---

# 71. Clean Benchmark Protocol

Before comparison:

```text
Same world
Same location
Same entity count
Same render distance
Same simulation distance
Same weather/time if possible
Same JVM/RAM
Same mod configuration
```

Change one variable at a time where practical

---

# 72. Experimental Branch Structure

Use branches:

```text
perf/canary
perf/ai-improvements
perf/alternate-current
perf/let-me-despawn
perf/tacz-optimization
```

Do not test all experimental mods together first

---

# 73. Benchmark Decision States

Every candidate gets:

```text
KEEP
KEEP + CONFIG
OPTIONAL PROFILE
REJECT
RETEST
```

Document reason

---

# 74. Performance Compatibility Matrix

Add performance-specific columns to:

```text
docs/compatibility-matrix.md
```

Example:

```text
Mod
Version
Category
Client/Server
Measured Benefit
Known Conflict
Status
```

---

# 75. Performance Changelog

If optimization changes gameplay-adjacent behavior:

document it

Example:

```text
Changed ServerCore activation range for passive wildlife
Excluded dragons from reduced ticking
Reduced wildlife group sizes
```

---

# 76. Definition of Done — Core Stack

Performance addon is Alpha-ready when:

- Embeddium works with client stack
- ModernFix works
- FerriteCore works
- Entity Culling works without visual bugs
- ImmediatelyFast works
- ServerCore is configured safely
- FastSuite does not break recipes
- Clumps works
- TaCZ: Accelerated is benchmarked
- One chunk pregeneration tool is selected
- Dedicated server boots
- Existing world loads
- Multiplayer combat works
- No critical log spam
- Performance baseline is documented

---

# 77. Definition of Done — Profiling

Performance methodology is complete when:

```text
docs/performance.md
```

contains at least:

```text
Idle city baseline
Factory benchmark
MineColonies benchmark
Horde benchmark
Gunfight benchmark
Wildlife benchmark
Worldgen benchmark
```

---

# 78. Target Runtime Quality

Target:

```text
20 TPS server under normal gameplay
```

with healthy MSPT headroom

Heavy Horde / major battle may temporarily increase MSPT

but should remain playable

Client target:

```text
stable frame pacing
```

is more important than peak FPS

---

# 79. Failure Conditions

Performance layer fails if optimization causes:

```text
Frozen dragons
Broken MineColonies workers
Disappearing Horde mobs
Broken recipes
Invisible weapons
Broken Create contraptions
Desynced trains
Incorrect tracker behavior
World corruption
```

A faster broken game is not an optimization

---

# 80. Claude Code Hard Rules

## DO

1. Pin exact performance mod versions.
2. Benchmark before and after.
3. Change one major optimization variable at a time.
4. Profile real pack scenarios.
5. Test dedicated server.
6. Test multiplayer.
7. Protect important entities from aggressive despawn/tick optimization.
8. Document measured benefit.
9. Use pack design optimization alongside mods.
10. Pregenerate chunks for persistent multiplayer where appropriate.
11. Keep experimental mods isolated until proven.
12. Review logs after every performance stack change.
13. Maintain a reproducible benchmark world.
14. Keep gameplay correctness above raw benchmark score.

## DO NOT

1. Do not install every optimization mod simultaneously.
2. Do not use OptiFine.
3. Do not assume two optimization mods are compatible because both launch.
4. Do not blindly copy JVM flags.
5. Do not despawn bosses/dragons/important NPCs.
6. Do not reduce MineColonies functionality without measurement.
7. Do not destroy wildlife diversity just to win benchmark numbers.
8. Do not let Create factories run unnecessarily forever.
9. Do not claim improvement from subjective feel only.
10. Do not merge Canary or AI Improvements without benchmark.
11. Do not use both Chunky and Chunk-Pregenerator by default.
12. Do not sacrifice core gameplay for decorative performance gains.

---

# 81. Final Approved Stack

## Core

```text
Embeddium
ModernFix
FerriteCore
Entity Culling
ImmediatelyFast
ServerCore
FastSuite
Clumps
TaCZ: Accelerated
```

## Server Tool

```text
Chunky
OR
Chunk-Pregenerator
```

## Experimental

```text
AI Improvements
Let Me Despawn
Alternate Current
Canary
TaCZ Optimization
Smooth Boot Reloaded
```

---

# 82. Final Feature Definition

> **The Performance Optimization Layer keeps Industrial Civilization Survival playable as its civilization grows from a small settlement into a dense industrial world containing factories, MineColonies citizens, wildlife, hordes, gunfights, trains and eventually physics-based vehicles. Optimization must be measured, reproducible and gameplay-safe rather than achieved by blindly stacking performance mods.**

The desired architecture is:

```text
Performance Mods
        +
Spawn / Entity Budgets
        +
Factory Shutdown Logic
        +
Chunk Pregeneration
        +
Profiling
        +
Compatibility Testing
        ↓
Sustainable Long-Term World
```

The goal is not maximum benchmark FPS.

The goal is:

> **A 100–300+ day multiplayer industrial civilization world that remains smooth enough to keep playing as it becomes larger and more complex.**
