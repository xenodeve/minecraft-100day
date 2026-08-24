
# Industrial Civilization Survival
## Master Context, Mod List, Architecture, Implementation Plan

> **Purpose of this document:**  
> เอกสารนี้เป็น Single Source of Context สำหรับ AI coding agent เช่น Claude Code CLI ที่ไม่มีประวัติการสนทนาก่อนหน้า  
> Agent ต้องสามารถอ่านเอกสารนี้แล้วเข้าใจ vision, architecture, mod selection, compatibility constraints, custom-layer requirements, development order, testing strategy และ release workflow ได้ทันที

---

# 0. Project Summary

เรากำลังสร้าง Minecraft modpack แนว:

> **Industrial Civilization Survival**

ไม่ใช่ Kitchen Sink modpack, ไม่ใช่ RLCraft clone, ไม่ใช่ Fantasy RPG และไม่ใช่ Create automation pack ที่สร้างโรงงานแล้วไม่มีอะไรให้ใช้ของที่ผลิต

แนวคิดหลักคือ:

> ผู้เล่นเป็นมนุษย์ธรรมดาที่ต้องสร้างอารยธรรมอุตสาหกรรมขึ้นมาเพื่อเอาตัวรอดในโลกที่อันตรายกว่าปกติ

โลกมี:

- Monster ที่อันตรายกว่า Vanilla
- Horde / invasion
- Dragon / Apex predators
- AI ที่สามารถโจมตีแนวป้องกันได้
- เสียงปืนที่ดึงดูดศัตรู
- เมืองที่มีประชากรจริง
- ระบบรถไฟและ logistics
- โรงงานผลิตกระสุน
- ระบบไฟฟ้าของเมือง
- CCTV / security
- Tactical gear
- ปืน
- ปืนใหญ่
- ยานพาหนะ physics-based ใน Late Game
- Aviation / helicopter / aircraft ใน Season 2+

แกนสำคัญคือ:

```text
Threat
  ↓
Need Weapons
  ↓
Ammo Consumption
  ↓
Need Industrial Production
  ↓
Create Automation
  ↓
Larger Settlement
  ↓
More Infrastructure
  ↓
More Things To Protect
  ↓
Defense / Logistics / Electricity
  ↓
Expansion Into More Dangerous Territory
  ↓
Stronger Threats
```

นี่คือ **Consumption Economy**

Create ต้องไม่ทำให้เกม “จบเร็วขึ้น”

Create ต้องทำให้ Civilization มีความสามารถผลิตสิ่งที่จำเป็นต่อการอยู่รอด

---

# 1. Hard Platform Constraint

## Minecraft

```text
Minecraft: 1.20.1
Mod Loader: Forge
Java: 17
```

Baseline Forge ที่ควรเริ่มทดสอบ:

```text
Forge 47.4.x
```

สามารถเริ่มที่ Recommended build ก่อน แล้วค่อยขยับหาก dependency ใด require build ใหม่กว่า

## Create

Target:

```text
Create 6.0.x
```

Baseline ที่เคยพิจารณา:

```text
Create 6.0.8
```

แต่ **ต้องทำ Compatibility Matrix จริงก่อน lock**

ห้าม assume ว่า Create addon ทุกตัวรองรับ Create 6.0.8 เพียงเพราะรองรับ Minecraft 1.20.1

---

# 2. Non-Negotiable Design Rules

Agent ต้องรักษากฎต่อไปนี้ตลอด project

## Rule 1 — Create is the technological backbone

Create ไม่ใช่ mod เสริม

Create ecosystem คือฐานของ:

- Manufacturing
- Processing
- Rail logistics
- Industrial machinery
- Heavy engineering
- Mechanical infrastructure
- Vehicle engineering

ห้ามเพิ่ม tech mod ที่ทำให้ผู้เล่น bypass ระบบ Create อย่างง่ายเกินไป

---

## Rule 2 — No fantasy power escalation

หลีกเลี่ยง:

- Magic
- Spell systems
- Fantasy armor
- OP enchantments
- RPG stat stacking
- Mythic weapon tiers

ผู้เล่นไม่ควรกลายเป็น Superman

Power progression ต้องมาจาก:

```text
Better infrastructure
Better manufacturing
Better logistics
Better equipment
Better defenses
Better vehicles
```

---

## Rule 3 — Guns must be powerful, but not free power

ปืนไม่ควรรู้สึกเหมือน BB gun

Vanilla Zombie ไม่ควรต้องใช้ Rifle 20 นัด

เป้าหมายคร่าว ๆ:

```text
Vanilla mob:
2–4 rifle rounds

Common modded monster:
ประมาณ 8–20 rounds

Elite:
20–50 rounds

Large monster:
50–150+ rounds

Dragon:
hundreds of rifle rounds
or heavy weapons preferred
```

Difficulty ต้องมาจาก:

- Armor
- AI
- Abilities
- Mobility
- Numbers
- Noise consequence
- Territory
- Logistics cost

ไม่ใช่แค่ HP × 20

---

## Rule 4 — Ammunition is an industrial resource

กระสุนต้องมีต้นทุนจริง

Early game:

```text
100 rounds = valuable
```

Mid game:

```text
1,000 rounds = requires workshop
```

Late game:

```text
10,000+ rounds = requires industrial ammunition plant
```

โรงงานผลิตกระสุนคือ Core Gameplay

---

## Rule 5 — Logistics must matter

ห้ามให้ระบบ QoL ทำลาย:

- Train
- Freight
- Road
- Outpost
- Warehouse
- Supply chain

ดังนั้น:

- ไม่มี Waystones
- ไม่มี free teleportation
- ไม่มี easy infinite flight
- Backpack ห้ามกลายเป็น mobile warehouse
- Carry On ต้อง blacklist blocks สำคัญ
- ไม่มี Digital Miner แบบวางกล่องแล้วแร่โผล่

---

## Rule 6 — Threat must scale organically

Difficulty progression ควรมาจาก:

- ผู้เล่นขยายออกจาก safe region
- จำนวนวัน
- Horde
- Enemy tiers
- Dragon territory
- Noise
- Geographic danger

ไม่ควรใช้ artificial rule แบบ:

```text
Day 49 = ไม่มี Dragon
Day 50 = Dragon spawn everywhere
```

---

## Rule 7 — City infrastructure should be functional

เมืองไม่ใช่ decoration

เมืองควรมี:

- Electricity
- Street lighting
- CCTV
- Security
- Radio
- Railway
- Industrial district
- Residential district
- Warehouse
- Defenses
- Food production
- Backup power

---

# 3. Master Mod List

---

# 3.1 Create / Industry / Logistics

## Create

**Role:** Mechanical/industrial backbone

Source:

https://www.curseforge.com/minecraft/mc-mods/create

Status:

```text
CORE
```

---

## Create: Steam 'n' Rails

**Role:** Expanded railway/logistics

Source:

https://www.curseforge.com/minecraft/mc-mods/create-steam-n-rails

Status:

```text
CORE
```

---

## Create Big Cannons

**Role:**

- Cannons
- Autocannons
- Artillery
- Heavy defensive weapons

Source:

https://www.curseforge.com/minecraft/mc-mods/create-big-cannons

Status:

```text
CORE
CUSTOM BALANCE
```

---

## CBC: Firepower Components

Role:

- Compact cannon mounts
- Compact autocannon mounts
- Ammo feeds
- Magazine loading

Source:

https://www.curseforge.com/minecraft/mc-mods/cbc-firepower-components

Status:

```text
CORE
```

---

## Create Crafts & Additions

Role:

```text
Create Rotation ↔ Forge Energy
```

ใช้สำหรับ:

- Alternator
- Electric motors
- Power-generation integration

Source:

https://www.curseforge.com/minecraft/mc-mods/createaddition

Status:

```text
CORE
```

---

## Create: Diesel Generators

Role:

- Diesel
- Crude oil
- Fuel
- Diesel engines
- Backup generators

Source:

https://www.curseforge.com/minecraft/mc-mods/create-diesel-generators

Status:

```text
CORE
CUSTOM PROGRESSION
```

---

## Create: New Age

Role:

- Advanced electrical generation
- Electric motors
- Large-scale power
- Nuclear power

Source:

https://www.curseforge.com/minecraft/mc-mods/create-new-age

Status:

```text
SEASON 2 / LATE GAME
CUSTOM
```

---

# 3.2 Guns / Tactical Combat

## TaCZ — Timeless and Classics Zero

Main gun framework

Source:

https://www.curseforge.com/minecraft/mc-mods/timeless-and-classics-zero

Status:

```text
CORE
HEAVY CUSTOM BALANCE
```

ต้อง custom:

- Damage
- Ammo cost
- Recipes
- Availability
- Attachments
- Progression

---

## TACZ: Durability

Role:

- Gun durability
- Weapon degradation
- Jamming
- Repair

Source:

https://www.curseforge.com/minecraft/mc-mods/tacz-durability

Status:

```text
CORE
CUSTOM
```

Goal:

ปืนต้องมี maintenance

แต่ห้าม jam จนน่ารำคาญ

---

## Create: TaCZ

Role:

เชื่อม TaCZ ammunition/components เข้ากับ Create manufacturing

Source:

https://www.curseforge.com/minecraft/mc-mods/tacz-create

Status:

```text
CORE
COMPATIBILITY TEST REQUIRED
```

หาก recipe/integration ไม่เหมาะ:

ใช้ KubeJS แทน

---

## TaCZ Additions

Role:

- Tactical accessories
- Laser
- TaCZ improvements

Source:

https://www.curseforge.com/minecraft/mc-mods/tacz-additions

Status:

```text
CORE
```

---

## TaCZ x Guns Lights Addon

Role:

- Muzzle flash lighting
- Tracer/projectile lighting

Source:

https://www.curseforge.com/minecraft/mc-mods/tacz-x-gunslightsaddon-addon

Status:

```text
CORE
```

---

# 3.3 Sound / Detection

## Attract to Sound

Role:

Monster reacts to:

- Gunshots
- Explosions
- Player noise
- Modded sounds

Source:

https://www.curseforge.com/minecraft/mc-mods/attract-to-sound

Status:

```text
CORE
HEAVY CUSTOM
```

Design target:

```text
Suppressed pistol < pistol < rifle < shotgun < HMG < cannon
```

Important:

Gunfire should generally attract **existing mobs**

ไม่ควร magically spawn mobs ทุกครั้งที่ยิง

---

# 3.4 Monsters / Threat Layer

## Born in Chaos

Role:

Main common-to-elite hostile monster ecosystem

Source:

https://www.curseforge.com/minecraft/mc-mods/born-in-chaos

Status:

```text
CORE
CUSTOM SPAWN + STATS
```

---

## IceAndFire Community Edition

Role:

- Dragons
- Apex predators
- Large monsters
- Territorial danger

Source:

https://www.curseforge.com/minecraft/mc-mods/iceandfire-ce

Status:

```text
CORE
HEAVY WORLDGEN CUSTOMIZATION
```

Important:

Dragon must be:

```text
RARE
REGIONAL
MEMORABLE
DANGEROUS
```

ไม่ใช่ common flying zombie

Target safe radius:

ประมาณ 2,000–2,500 blocks จาก world spawn เป็น starting point

ค่าจริงต้อง test worldgen

Dragon dens/roosts ต้องอยู่ห่างกันมากกว่า default

---

## The Hordes

Role:

Major invasion / Horde Night system

Source:

https://www.curseforge.com/minecraft/mc-mods/the-hordes

Status:

```text
CORE
HEAVY CUSTOM WAVES
```

Threat tiers:

```text
Tier I   → Vanilla mobs
Tier II  → Vanilla + Born in Chaos
Tier III → Elite-heavy / breachers
Tier IV  → Major invasion
```

Dragon ไม่ควรอยู่ใน Horde ปกติ

---

## Enhanced AI

Role:

ทำให้ enemy สามารถ:

- Breach defenses
- Mine weak materials
- Attack intelligently
- Use smarter ranged behavior

Source:

https://www.curseforge.com/minecraft/mc-mods/enhanced-ai

Status:

```text
CORE
HEAVY CONFIG
```

Wood/Dirt/Cobblestone สามารถ breach ได้ง่ายกว่า

Fortified Stone / Industrial defenses ต้องดีขึ้นจริง

---

## Improved Mobs

Role:

Gentle global difficulty scaling

Source:

https://www.curseforge.com/minecraft/mc-mods/improved-mobs

Status:

```text
CORE-LITE
HEAVY NERF FROM DEFAULT
```

เป้าหมาย:

```text
Day 1 Zombie: ~20 HP

Day 100:
~28–32 HP

Day 200:
~35–40 HP

Late:
cap ~40–50 HP
```

ห้าม HP scaling ไม่มีเพดาน

---

## In Control!

Role:

Global spawn director

Source:

https://www.curseforge.com/minecraft/mc-mods/in-control

Status:

```text
CORE
HEAVY CUSTOM
```

ใช้ควบคุม:

- Spawn density
- Day-based threat tier
- Biome rules
- Distance
- Enemy restrictions

Important:

อย่า assume config syntax

อ่าน documentation ของ exact installed version ก่อน generate config

---

# 3.5 Civilization

## MineColonies

Role:

- City
- NPC population
- Jobs
- Builder
- Farmer
- Miner
- Guards
- Couriers
- Warehouses

Source:

https://www.curseforge.com/minecraft/mc-mods/minecolonies

Status:

```text
CORE
CUSTOM RAID / BALANCE
```

Guard role:

```text
Common patrol
Gate defense
Early warning
Delay / hold chokepoint
```

Guards ไม่ต้องกลายเป็น TaCZ rifle infantry

Heavy threats:

Player / CBC defenses จัดการ

---

## Farmer's Delight

Role:

- Food
- Agriculture
- Cooking
- Living-world depth

Source:

https://www.curseforge.com/minecraft/mc-mods/farmers-delight

Status:

```text
CORE
```

---

## Serene Seasons

Role:

- Seasons
- Crop planning
- Agricultural infrastructure

Source:

https://www.curseforge.com/minecraft/mc-mods/serene-seasons

Status:

```text
CORE
```

---

# 3.6 Quest / Custom Framework

## FTB Quests

Source:

https://www.curseforge.com/minecraft/mc-mods/ftb-quests-forge

Status:

```text
CORE
QUESTS WRITTEN FROM SCRATCH
```

Quest philosophy:

ห้ามเป็น checklist เช่น:

```text
Craft Cogwheel
Craft Press
Craft Train
```

ควรเป็น Objectives เช่น:

```text
Establish Industrial Production

Create a Remote Mining Settlement

Build a Freight Corridor

Survive a Major Siege

Establish Air Superiority
```

---

## KubeJS

Source:

https://www.curseforge.com/minecraft/mc-mods/kubejs

Status:

```text
CORE DEVELOPMENT TOOL
```

ใช้ทำ:

- Recipes
- Progression
- Item restrictions
- Compatibility
- Ammo manufacturing
- Industrial balancing

---

# 3.7 Tactical Gear / Clothing

## TakKit

Role:

Main tactical equipment system

มี:

- High Cut helmets
- NVGs
- Plate carriers
- Pouches
- Tactical accessories

Source:

https://www.curseforge.com/minecraft/mc-mods/takkit

Status:

```text
CORE
```

---

## Brimm Armors

Role:

Modern heavier tactical armor

Source:

https://www.curseforge.com/minecraft/mc-mods/brimm-armors-tactical-military-armors

Status:

```text
CORE
CUSTOM BALANCE
```

---

## CAPS_Awim — TACTICAL_GEAR

Role:

Regular military gear / combat uniforms

Source:

https://www.curseforge.com/minecraft/mc-mods/caps-awim-tactical-gear

Status:

```text
CORE
```

---

## Sophisticated Backpacks

Source:

https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks

Status:

```text
CORE
CUSTOM CAPACITY
```

Important:

ห้าม Backpack replace freight logistics

Disable/nerf OP upgrades if necessary

---

## Sophisticated Tactical Backpacks

Role:

Tactical/camo appearance

Source:

https://www.curseforge.com/minecraft/mc-mods/sophisticated-tactical-backpacks

Status:

```text
EXPERIMENTAL
```

---

## ClothingCraft

Role:

Casual clothing

Source:

https://modrinth.com/mod/clothingcraft

Status:

```text
CORE
```

---

## Grillo's Clothes

Role:

Additional clothing / clothing slots

Source:

https://modrinth.com/mod/grillos-clothes

Status:

```text
PROTOTYPE
```

---

## Curios API

Source:

https://www.curseforge.com/minecraft/mc-mods/curios

Status:

```text
DEPENDENCY
```

---

# 3.8 Lighting / Night Operations

## Client Dynamic Light

Role:

ถือ Torch / Lantern แล้วให้ dynamic light

Source:

https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light

Status:

```text
CORE CLIENT
```

---

## Flashier Flashlights

Role:

Real handheld flashlight beam

Source:

https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights

Status:

```text
CORE
```

Night progression:

```text
Torch
 ↓
Handheld Flashlight
 ↓
Weapon Light / Laser
 ↓
TakKit NVG
```

---

# 3.9 Immersion / QoL

## Sound Physics Remastered

https://www.curseforge.com/minecraft/mc-mods/sound-physics-remastered

```text
CORE
```

---

## AmbientSounds

https://www.curseforge.com/minecraft/mc-mods/ambientsounds

```text
CORE
```

---

## Simple Voice Chat

https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat

```text
CORE
```

---

## Simple Voice Radio

https://www.curseforge.com/minecraft/mc-mods/simple-voice-radio

```text
CORE
```

Gameplay:

```text
Local proximity communication
+
Radio for remote outposts
```

---

## PlayerRevive

https://www.curseforge.com/minecraft/mc-mods/playerrevive

```text
CORE
CUSTOM BLEEDOUT / REVIVE TIME
```

---

## ItemPhysic Full

https://www.curseforge.com/minecraft/mc-mods/itemphysic

```text
CORE
```

---

## Not Enough Animations

https://www.curseforge.com/minecraft/mc-mods/not-enough-animations

```text
CORE CLIENT
```

---

## Eating Animation

https://www.curseforge.com/minecraft/mc-mods/eating-animation-forge

```text
CORE CLIENT
```

---

## Visual Workbench

https://www.curseforge.com/minecraft/mc-mods/visual-workbench

```text
CORE
```

---

## Corpse

https://www.curseforge.com/minecraft/mc-mods/corpse

```text
CORE
```

---

## Carry On

https://www.curseforge.com/minecraft/mc-mods/carry-on

```text
CORE
HEAVY BLACKLIST
```

Blacklist:

- Create machinery
- MineColonies blocks
- Large storage
- Industrial machines
- Anything that bypasses logistics

---

# 3.10 CCTV / Security / Smart City

## CameraCraft

Role:

- CCTV
- Live camera feeds
- Security monitoring room

Source:

https://www.curseforge.com/minecraft/mc-mods/cctv-camera

Status:

```text
CORE
```

---

## SecurityCraft

Role:

- Keycards
- Keypads
- Motion sensors
- Panic buttons
- Secure access
- Security systems

Source:

https://www.curseforge.com/minecraft/mc-mods/security-craft

Status:

```text
CORE
HEAVY CUSTOM
```

Potentially disable/limit:

- OP reinforced blocks
- OP sentries
- Mines
- Anything invalidating Horde gameplay

---

## MrCrayfish's Furniture Mod: Refurbished

Role:

- Furniture
- Appliances
- Home electrical objects

Source:

https://www.curseforge.com/minecraft/mc-mods/refurbished-furniture

Status:

```text
CORE
```

---

# 3.11 City Electricity / Grid

## Immersive Engineering

Role:

- LV/MV/HV wiring
- Transformers
- Capacitors
- Floodlights
- Electrical infrastructure
- Razor wire
- Electrified razor wire

Source:

https://www.curseforge.com/minecraft/mc-mods/immersive-engineering

Status:

```text
CORE
HEAVY CUSTOM SCOPE
```

Important:

Immersive Engineering ควรรับบท:

> Electrical Infrastructure

ไม่ใช่:

> Replacement for Create manufacturing

ปิด/เลื่อน IE machinery ที่ bypass Create หากจำเป็น

---

## Immersive Posts

Role:

- Utility poles
- Transmission towers
- Treated wood / steel / aluminium posts

Source:

https://www.curseforge.com/minecraft/mc-mods/immersiveposts

Status:

```text
CORE
```

---

## Macaw's Lights and Lamps

Role:

- Street lamps
- Wall lights
- Residential lighting
- City lighting

Source:

https://www.curseforge.com/minecraft/mc-mods/macaws-lights-and-lamps

Status:

```text
CORE
```

Use:

```text
Residential:
Macaw lights

Industrial:
IE Floodlights

Military walls:
IE Floodlights / tactical lighting
```

---

# 4. Advanced Industry / Season 2

ระบบต่อไปนี้ไม่ควรเป็น requirement สำหรับ Alpha แรก

---

## Create: The Factory Must Grow — TFMG

Role:

- Steel
- Oil
- Refinery
- Heavy industry
- Advanced materials

Source:

https://www.curseforge.com/minecraft/mc-mods/create-industry

Status:

```text
SEASON 2
COMPATIBILITY TEST
```

---

## Valkyrien Skies 2

Role:

Physics platform for block-built vehicles

Source:

https://www.curseforge.com/minecraft/mc-mods/valkyrien-skies

Status:

```text
SEASON 2
HIGH RISK
```

---

## Create: Clockwork

Role:

Create + Valkyrien Skies physics engineering

Potential applications:

- Cars
- Ships
- Helicopters
- Aircraft
- Moving machinery

Source:

https://www.curseforge.com/minecraft/mc-mods/create-clockwork

Status:

```text
SEASON 2
HIGH RISK
```

---

## Warium

Role:

- Modern weapons
- Cannons
- Rockets
- Bombs
- Military engineering
- Vehicle weapon systems

Source:

https://www.curseforge.com/minecraft/mc-mods/warium

Status:

```text
SEASON 2
HIGH RISK
```

---

## CBC: Warium Projectiles

Source:

https://www.curseforge.com/minecraft/mc-mods/cbc-warium-projectiles

Status:

```text
SEASON 2
```

---

## TFMG – Warium Kerosene Converter

Source:

https://modrinth.com/mod/tfmg-warium-kerosene-converter

Status:

```text
SEASON 2
```

---

# 5. Season 2 Vehicle Philosophy

เราไม่ต้องการ vehicle spawn egg

ต้องเป็น:

> **block-built physics vehicles**

Progression:

```text
Ground Engineering
 ↓
Railway
 ↓
Oil Industry
 ↓
Advanced Materials
 ↓
Experimental Aviation
 ↓
Helicopter
 ↓
Armed Aircraft
 ↓
CAS / A-10-like aircraft
```

Aircraft ต้องถูกสร้าง block-by-block

ตัวอย่าง objective:

```text
Experimental Aviation:
สร้างอากาศยานที่ Takeoff, บิน 500 blocks และ Landing ได้

Rapid Response:
สร้าง VTOL ที่ส่งคนและกระสุนไป Outpost ได้

Air Superiority:
สร้างเครื่องบินที่สามารถต่อสู้ Apex Flying Threat และกลับฐาน
```

ไม่บังคับว่าต้องสร้าง UH-60/A-10/B-2 รูปร่างเหมือนจริง

ผู้เล่นมี freedom ในการ engineering

---

# 6. Mods Explicitly Rejected

ห้ามเพิ่มกลับโดยไม่มีเหตุผลใหม่

## TaCZ Juggernaut Armoury

Reject เพราะ aesthetic:

```text
Post-apocalypse / Juggernaut
```

ไม่เข้ากับ modern civilian/military aesthetic

---

## CCTVCraft

Reject เพราะซ้ำกับ:

```text
CameraCraft + SecurityCraft
```

---

## No Mindless Shooting

Reject เพราะ overlap กับ Attract to Sound

เสี่ยง double punishment

---

## Scorched Guns 2

Reject เพราะเราเลือก TaCZ ecosystem แล้ว

---

## Waystones

Reject

Teleportation ทำลาย:

- Railways
- Roads
- Frontier
- Travel risk

---

## Mekanism / Digital Miner

Reject

เพราะ bypass:

- Mining
- Logistics
- Create manufacturing

---

## Jetpacks / trivial flight

Reject

เพราะทำลาย:

- Roads
- Trains
- Aircraft progression
- Frontier danger

---

## Apotheosis

Reject

เพราะ OP equipment scaling ทำลาย combat balance

---

## Ars Nouveau / Botania / Occultism / major magic systems

Reject

ไม่ตรง theme

---

# 7. Custom Layer Architecture

Repository ควรมีโครงสร้างประมาณ:

```text
industrial-civilization-survival/
│
├── README.md
├── CLAUDE.md
├── PROJECT_PLAN.md
│
├── pack.toml
├── index.toml
│
├── mods/
│
├── config/
│   ├── incontrol/
│   ├── soundattract/
│   ├── hordes/
│   ├── enhanced_ai/
│   ├── improved_mobs/
│   ├── securitycraft/
│   ├── immersiveengineering/
│   ├── carryon/
│   └── ...
│
├── defaultconfigs/
│
├── kubejs/
│   ├── startup_scripts/
│   ├── server_scripts/
│   │   ├── ammunition/
│   │   ├── guns/
│   │   ├── create/
│   │   ├── progression/
│   │   └── compatibility/
│   └── client_scripts/
│
├── datapacks/
│   ├── dragon_worldgen/
│   ├── threat_scaling/
│   ├── mob_tags/
│   └── compatibility/
│
├── ftbquests/
│
├── resourcepacks/
│
├── docs/
│   ├── compatibility-matrix.md
│   ├── balance.md
│   ├── performance.md
│   ├── progression.md
│   └── testing.md
│
└── scripts/
    ├── build/
    ├── validate/
    └── release/
```

---

# 8. KubeJS Ammunition Design

กระสุนต้องใช้ Create Sequenced Assembly

Concept:

```text
Brass Sheet
  ↓
Form casing
  ↓
Insert projectile
  ↓
Add propellant
  ↓
Crimp
  ↓
Cartridge
```

Example design:

```text
[Brass Sheet]
 ↓ Deploying projectile
 ↓ Filling/Deploying gunpowder
 ↓ Pressing
 ↓ Final assembly
[Finished Cartridges]
```

Potential scrap loop:

```text
Ammo Production
├── Finished ammo
└── Brass Scrap
      ↓
   Recycling
```

อย่า implement arbitrary failure chance จนกว่าจะตรวจ API จริง

ถ้าจะมี scrap ให้ใช้ weighted outputs / transitional-item behavior ที่ Create/KubeJS รองรับจริง

---

# 9. Threat Architecture

Threat hierarchy:

```text
Vanilla Hostiles
        ↓
Common Born in Chaos
        ↓
Elite Born in Chaos
        ↓
Large Monsters
        ↓
Ice & Fire Creatures
        ↓
Dragon
```

Dragon = Apex Predator

Dragon ไม่ใช่ Horde mob

---

# 10. Dragon Worldgen

อย่าใช้ In Control เป็นวิธีหลักในการสร้าง/ลบ Dragon structures

Ice & Fire dragons ผูกกับ:

- Roost
- Cave / Den
- Dangerous worldgen

ต้อง tune worldgen/config ของ IceAndFire CE โดยตรง

Target:

```text
Spawn-safe region:
~2000–2500 blocks

Dragon territories:
rare

Roost separation:
large

Dragon encounter:
memorable
```

ค่าจริงต้อง generate worlds หลาย seed แล้ววัด

---

# 11. Sound System

Attract to Sound ต้องมี profile

Concept only:

```text
Suppressed pistol   low
Pistol              medium-low
SMG                 medium
Rifle               high
Shotgun             very high
Machine gun         extreme
Explosive           extreme
Artillery           massive
```

อย่า hardcode radius ก่อน benchmark gameplay

ต้องระวัง automatic gun fire

หากทุก bullet trigger expensive mob search อาจทำลาย MSPT

ถ้า mod ไม่มี built-in rate limit:

consider compatibility addon/event coalescing

เช่น:

```text
HMG firing continuously

instead of:
1 sound event / tick

use:
1 attraction event / 5–10 ticks
```

เฉพาะถ้าจำเป็นจาก profiling จริง

---

# 12. Horde Design

Horde ต้องมี:

```text
Calm
 ↓
Tension
 ↓
Crisis
 ↓
Recovery
```

ไม่ควรเป็น:

```text
Crisis → Crisis → Crisis
```

Horde frequency ต้องต่ำพอให้ผู้เล่นได้:

- Build
- Repair
- Expand
- Explore

Major Horde ควรรู้สึกเป็น Event

---

# 13. Electricity Architecture

Desired city grid:

```text
Power Plant
    │
    │ HV
    ▼
Substation
    │
    │ MV
 ┌──┴──────────────┐
 │                 │
Industrial      Residential
 │                 │
Transformer      Transformer
 │                 │
LV Grid          LV Grid
 │                 │
Factory          Streetlights
CCTV             Houses
Floodlights      Appliances
Security         Radio
Fence
```

Main tools:

```text
Immersive Engineering
Immersive Posts
Create Crafts & Additions
Create Diesel Generators
Macaw Lights
```

Future goal:

Power outage should eventually matter

Example:

```text
Main grid failure

↓ CCTV offline
↓ floodlights offline
↓ electric fence offline
↓ some security offline

Backup diesel:
Command center + radio + emergency lighting
```

หาก mods ไม่มี shared FE requirement:

custom compatibility layer อาจต้องทำภายหลัง

อย่า fake feature ก่อนตรวจ API จริง

---

# 14. Security Architecture

Desired city security:

```text
CCTV
 ↓
Security Room
 ↓
Radio Alert
 ↓
Panic Button
 ↓
Gate Lockdown
 ↓
Floodlights
 ↓
Defensive Response
```

SecurityCraft ต้องถูก nerf หากมี block ที่ทำให้ enemy ไม่สามารถ breach ได้เลย

---

# 15. Tactical Loadout Philosophy

ไม่มี Class Lock

Role เกิดจาก equipment

Examples:

## Civilian

```text
Casual clothes
Small backpack
Pistol
```

## Scout

```text
Combat shirt
Light plate carrier
High Cut
NVG
Carbine
```

## Rifleman

```text
Plate carrier
High Cut
Rifle
Ammo
```

## Heavy Gunner

```text
Heavy armor
Machine gun
Large ammunition load
```

Trade-off:

```text
Protection
vs
Mobility
vs
Capacity
vs
Utility
```

อย่าทำ:

```text
Brimm = simply bigger armor number than TakKit
```

ทุก equipment tier ควรมี use case

---

# 16. Backpack Balance

Backpack = personal logistics

Train = industrial logistics

ดังนั้น:

```text
Player Backpack << Freight Train
```

Potentially disable:

- absurd stack upgrades
- huge slot upgrades
- anything making warehouses/trains irrelevant

---

# 17. Quest Campaign

Draft structure:

```text
Chapter I
The Survivor

Chapter II
The Settlement

Chapter III
Firearms

Chapter IV
The Mechanical Age

Chapter V
Industrial Revolution

Chapter VI
Railway Age

Chapter VII
The Long Night

Chapter VIII
Arms Industry

Chapter IX
Wings of Fire

Chapter X
Fortification

Chapter XI
The Frontier

Chapter XII
Industrial Civilization
```

Important:

FTB Quests should be implemented **after gameplay mechanics are stable**

ไม่ควรทำ Quest ก่อน balance

---

# 18. Suggested Long-Term Progression

## Day 1–20

- Survival
- Casual gear
- Primitive guns
- First settlement

## Day 20–45

- MineColonies
- Create workshop
- Basic ammunition

## Day 45–70

- Ammunition industry
- Better firearms
- First serious Horde

## Day 70–100

- Railway
- Fortified city
- Heavy defensive weapons

## Day 100

Major milestone:

> Civilization can survive the world

ไม่ใช่ Endgame

---

## Day 100–150

- Frontier railway
- Remote mines
- Oil
- Heavy industry
- First Dragon hunt

## Day 150–200+

- Aviation
- Helicopters
- CAS
- Advanced vehicle engineering

---

# 19. Development Workflow

Use:

```text
Git
+
packwiz
```

Git repository = source of truth

Do not manually maintain random mod files with no version tracking

---

# 20. Pack Distribution

Development:

```text
Git + packwiz
```

Friends / Beta:

```text
CurseForge exported profile
```

or

```text
Prism Launcher + packwiz installer
```

Stable public release:

```text
CurseForge
and/or
Modrinth .mrpack
```

Goal:

Friends install once

They must receive automatically:

- Mods
- Exact versions
- Config
- KubeJS
- Datapacks
- FTB Quests
- Balance
- Resources

ไม่ต้อง custom เอง

---

# 21. Client vs Server Separation

Client-only candidates:

```text
Client Dynamic Light
Not Enough Animations
Eating Animation
visual/shader mods
```

Server/common:

```text
Create
TaCZ
MineColonies
IceAndFire
The Hordes
In Control
KubeJS
etc.
```

Pack build tooling ต้อง track side correctly

---

# 22. Performance Risks

Main risk stack:

```text
MineColonies NPC pathfinding
+
Born in Chaos
+
Enhanced AI
+
Attract to Sound
+
The Hordes
+
TaCZ projectiles
+
Create contraptions
+
Trains
+
CBC projectiles
+
Valkyrien Skies physics
```

ต้อง profile ด้วย:

```text
spark
MSPT
entity count
chunk count
server thread utilization
client FPS
```

Do not optimize from guesswork

Profile first

---

# 23. Performance Rules

## Create factories

ใช้ Threshold Switch / shutdown logic

ถ้า warehouse เต็ม:

```text
stop production
```

avoid endless:

- Fans
- Belts
- Mechanical Crafters
- Contraptions

ที่ทำงานโดยไม่มี demand

---

## Horde test targets

Test:

```text
50 mobs
100 mobs
150 mobs
200 mobs
```

พร้อม:

```text
automatic gunfire
sound attraction
AI
city NPC
```

วัด MSPT

---

# 24. Development Phases

## Phase 0 — Repository Bootstrap

Tasks:

- Initialize Git
- Initialize packwiz
- Set MC 1.20.1
- Set Forge
- Add documentation
- Create compatibility matrix

Deliverable:

```text
Pack launches with zero gameplay mods
```

---

## Phase 1 — Create Baseline

Install:

- Create
- Steam 'n' Rails
- CBC
- Create Crafts & Additions

Test:

- Startup
- World create
- Train
- Create machinery
- Recipe conflicts

Deliverable:

```text
Stable Create stack
```

---

## Phase 2 — Combat Baseline

Install:

- TaCZ
- TaCZ Additions
- TaCZ Durability
- Create: TaCZ
- Born in Chaos

Test:

TTK matrix

Record:

```text
weapon
ammo
target
body shots
headshots
time-to-kill
```

Deliverable:

```text
combat-baseline.md
```

---

## Phase 3 — Threat Director

Install:

- Enhanced AI
- Improved Mobs
- In Control!

Create initial spawn rules

Test:

- Early world
- Day scaling
- Breaching
- Enemy density

Deliverable:

```text
Threat v0.1
```

---

## Phase 4 — Sound System

Install:

- Attract to Sound
- Sound Physics Remastered
- AmbientSounds

Map TaCZ sounds

Test:

```text
pistol
rifle
shotgun
automatic fire
suppressed fire
```

Measure:

- attraction behavior
- performance
- whether repeated firing causes pathfinding spikes

---

## Phase 5 — Consumption Economy

Implement KubeJS ammo recipes

Use Create Sequenced Assembly where practical

Remove/balance default cheap ammo recipes

Test:

```text
manual early-game ammo
small workshop
automated factory
```

Goal:

Ammo should become a meaningful industrial resource

---

## Phase 6 — Horde

Install/configure The Hordes

Create Tier I and Tier II first

Test:

- walls
- sound
- AI
- firearms
- MSPT

Do not create Tier III/IV until baseline stable

---

## Phase 7 — Civilization

Install:

- MineColonies
- Farmer's Delight
- Serene Seasons

Test:

- NPC survival
- pathfinding
- Horde interaction
- Guard usefulness

Tune MineColonies raids to avoid event spam

---

## Phase 8 — Dragon Frontier

Install/configure IceAndFire CE

Generate multiple test worlds

Measure:

- nearest dragon territory
- roost spacing
- cave spacing
- starting safety

Create map/statistics if useful

Goal:

Dragon feels rare and territorial

---

## Phase 9 — Tactical Gear

Install:

- TakKit
- Brimm
- CAPS
- Clothing
- Backpacks
- Flashlights

Balance:

- armor
- capacity
- mobility if possible
- NVG progression

---

## Phase 10 — City Infrastructure

Install:

- Immersive Engineering
- Immersive Posts
- Macaw Lights
- CameraCraft
- SecurityCraft
- Refurbished Furniture
- Simple Voice Chat
- Simple Voice Radio

Build prototype city:

```text
Power Plant
Substation
Street lighting
Security room
CCTV
Electric fence
Radio
```

---

## Phase 11 — QoL / Immersion

Install:

- PlayerRevive
- Corpse
- ItemPhysic
- Carry On
- Visual Workbench
- Eating Animation
- Not Enough Animations
- Client Dynamic Light

Configure blacklists

Test multiplayer

---

## Phase 12 — Quest Campaign

Only after mechanics are stable

Implement FTB Quest campaign

No tutorial spam

Milestone-focused quests

---

## Phase 13 — Season 2 Prototype

Separate experimental branch

Install:

- TFMG
- Valkyrien Skies
- Clockwork
- Warium
- Warium projectile compatibility

Do not merge into stable pack until:

```text
No startup crash
No severe physics bugs
Acceptable MSPT
Acceptable client FPS
No Create incompatibilities
```

---

# 25. Compatibility Matrix

Create:

```text
docs/compatibility-matrix.md
```

Columns:

```text
Mod
Version
MC Version
Forge Version
Create Version
Side
Required Dependencies
Known Conflicts
Tested
Notes
```

Example:

```text
TaCZ
x.x.x
1.20.1
Forge
N/A
Both
...
PASS
...
```

Never install many mods simultaneously without knowing which one introduced a failure

---

# 26. Boot Testing Strategy

Add mods in small batches

After every batch:

```text
1. Launch client
2. Create fresh test world
3. Join world
4. Save
5. Restart
6. Reload
7. Check latest.log
8. Check crash reports
```

Server test separately

---

# 27. Regression Tests

After each major change verify:

```text
Create machinery
Train assembly
TaCZ firing
TaCZ attachments
Born in Chaos spawn
Horde
MineColonies NPC
Dragon worldgen
CCTV
Electric grid
Voice chat
Backpack
Corpse
Carry On blacklist
```

---

# 28. Balance Documentation

Maintain:

```text
docs/balance.md
```

Tables:

## Guns

```text
weapon
damage
RPM
ammo
cost
TTK vanilla
TTK common
TTK elite
```

## Monsters

```text
mob
HP
armor
damage
speed
special ability
tier
```

## Ammo

```text
ammo type
material cost
batch size
factory throughput
```

## Defense

```text
weapon
damage
ammo consumption
target role
```

---

# 29. Definition of Done — Alpha

Alpha is ready when:

- Pack launches reliably
- Server launches reliably
- No critical recipe conflicts
- Create production works
- TaCZ combat feels correct
- Ammo production is automated
- Sound attraction works
- Tier I/II Horde works
- MineColonies works
- Dragons exist but are rare
- CCTV/electric systems work
- Tactical gear works
- Multiplayer works
- Friends can install via exported pack
- No manual config steps required

---

# 30. Definition of Done — Beta

Beta requires:

- Tier III Horde
- Full progression balance
- Finished ammunition economy
- Electricity infrastructure
- Security systems
- Tactical equipment progression
- FTB Quest campaign
- Performance profiling complete
- No major MSPT spikes
- Packwiz release process working
- Automated or near-automated friend updates

---

# 31. Claude Code Agent Instructions

When Claude Code receives this project:

## DO

1. Read this entire document first.
2. Inspect repository state before editing.
3. Create/update compatibility matrix before mass installation.
4. Verify exact mod versions and dependencies.
5. Prefer configuration/datapack/KubeJS over upstream forks.
6. Commit work in logical increments.
7. Keep exact versions pinned.
8. Run launch/validation tests after each mod batch.
9. Record discovered compatibility issues.
10. Preserve gameplay philosophy above.

## DO NOT

1. Do not upgrade Minecraft away from 1.20.1 without explicit instruction.
2. Do not migrate Forge → NeoForge.
3. Do not add fantasy mods.
4. Do not add teleportation.
5. Do not add OP storage/logistics bypass.
6. Do not add mods merely because they are popular.
7. Do not change Create into a secondary system.
8. Do not create huge HP-sponge difficulty.
9. Do not write all FTB Quests before gameplay stabilizes.
10. Do not fork upstream mods unless configuration/KubeJS/datapack cannot solve the requirement.
11. Do not assume config keys from memory; inspect exact generated configs/docs.
12. Do not claim compatibility without running the game.

---

# 32. First Tasks for Claude Code

If starting from an empty repository, execute in this order:

## Task 1

Create repository structure.

## Task 2

Initialize packwiz for:

```text
Minecraft 1.20.1
Forge
```

## Task 3

Create:

```text
docs/compatibility-matrix.md
docs/balance.md
docs/performance.md
docs/progression.md
docs/testing.md
```

## Task 4

Add only the first compatibility batch:

```text
Create
Steam 'n' Rails
Create Big Cannons
CBC Firepower Components
Create Crafts & Additions
```

## Task 5

Resolve dependencies and pin exact versions.

## Task 6

Launch and validate.

Do not add the next batch until the first batch is confirmed working.

---

# 33. Project Identity

The player fantasy is:

> We enter a hostile world as ordinary people and gradually build an industrial civilization capable of surviving it.

The intended transformation:

```text
Day 1
People hiding from monsters

↓

Day 50
Armed settlement with workshops

↓

Day 100
Fortified industrial city

↓

Day 200
Regional civilization with railways, industry, electricity, defenses and aviation
```

The final power fantasy is not:

> “My character has +500 strength.”

It is:

> **“We built a civilization powerful enough that the monsters that once terrified us now have to deal with our industry.”**

---

# 34. One-Sentence Product Definition

> **A long-term Minecraft 1.20.1 Forge modpack where players use Create-driven industry, logistics, modern equipment and eventually physics-based vehicles to build and defend a functioning civilization against intelligent monsters, hordes and territorial dragons.**

---

# 35. Highest-Priority Principle

Whenever deciding whether to add, remove or modify a feature, ask:

> **“Does this create another meaningful problem for the player to solve through engineering, logistics, preparation or teamwork?”**

If yes:

consider it.

If the feature merely gives the player more power with no new trade-off:

do not add it.