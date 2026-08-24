
# Addon Spec — Crafting Assistance + Tactical Tracker
## Claude Code CLI Implementation Handoff

> **Purpose**  
> เอกสารนี้เป็น Addon Specification เพิ่มเติมสำหรับโปรเจกต์ **Industrial Civilization Survival**  
> ใช้เป็น context แบบ standalone สำหรับ Claude Code CLI โดยไม่ต้องมีประวัติจาก session อื่น
>
> Addon ชุดนี้เพิ่ม 2 ระบบ:
>
> 1. **In-game Crafting / Recipe Assistance**
> 2. **Equipment-based Tactical Personnel Tracking**
>
> เป้าหมายคือทำให้ modpack ที่มี mod จำนวนมากใช้งานง่ายขึ้น โดยผู้เล่นไม่ต้องเปิดเว็บไซต์หา recipe และในขณะเดียวกันระบบระบุตำแหน่งเพื่อนต้องยังคงเป็น “เทคโนโลยี/อุปกรณ์” ไม่ใช่ข้อมูลฟรีจาก HUD

---

# 1. Platform Constraint

ใช้ platform เดียวกับ Main Pack:

```text
Minecraft: 1.20.1
Loader: Forge
Java: 17
Create: 6.0.x target
```

ห้ามเปลี่ยน:

```text
Forge → NeoForge
Minecraft 1.20.1 → version อื่น
```

โดยไม่ได้รับ explicit instruction

---

# 2. Mods Added By This Addon

เพิ่มทั้งหมด 7 รายการ:

```text
1. Just Enough Items (JEI)
2. Jade
3. Jade Addons
4. Crafting Tweaks
5. Mouse Tweaks
6. Polymorph
7. Player Microchip (Tracker)
```

---

# 3. JEI — Just Enough Items

## Source

https://www.curseforge.com/minecraft/mc-mods/jei

## Status

```text
CORE
```

## Role

JEI เป็น **Recipe Browser หลักของ modpack**

ผู้เล่นต้องสามารถ:

- Search item
- ดู recipe
- ดู usages
- ไล่ย้อน component chain
- ดู Create recipes
- ดู KubeJS recipes
- ดู modded crafting methods

ตัวอย่าง:

```text
Search:
5.56

↓

5.56 Cartridge

↓

View Recipe

↓

Brass Casing
Projectile
Gunpowder

↓

Create Sequenced Assembly
```

---

# 4. JEI Design Requirement

ผู้เล่นไม่ควรต้อง:

```text
Alt+Tab
↓
Google
↓
Wiki
↓
YouTube
```

เพื่อหาวิธี craft item

เป้าหมาย:

> Recipe progression ทั้งหมดต้อง discover ได้ภายในเกม

---

# 5. JEI + Custom Recipes

Main Pack ใช้ KubeJS สำหรับ:

- TaCZ ammunition
- Industrial progression
- Disabled recipes
- Custom components
- Integration recipes

ดังนั้นหลังแก้ recipe ต้อง verify ว่า JEI แสดง:

```text
ACTIVE PACK RECIPE
```

ไม่ใช่ recipe default ที่ถูก disable แล้ว

---

# 6. Hide Disabled Content From JEI

หาก item/recipe ถูก disable จาก progression:

ต้องพิจารณาซ่อนจาก JEI ด้วย

ตัวอย่าง:

```text
Default cheap TaCZ ammo
SecurityCraft OP item
Disabled IE machinery
OP backpack upgrades
Deprecated duplicate components
```

ไม่ควรเกิด UX:

```text
JEI shows item
↓
Player clicks recipe
↓
No valid recipe
```

ถ้า item intentionally unavailable:

```text
Hide from JEI
```

เว้นแต่เป็น:

```text
loot-only item
quest reward
worldgen-only item
```

ที่ควรแสดงแต่มี tooltip อธิบาย

---

# 7. Jade

## Source

https://www.curseforge.com/minecraft/mc-mods/jade

## Status

```text
CORE
```

## Role

Jade ตอบคำถาม:

> “Block / Entity ที่กำลังมองอยู่นี่คืออะไร?”

ใช้แสดง contextual information เช่น:

```text
Mechanical Press
Create
```

หรือ:

```text
Fluid Tank
Diesel
6,420 / 8,000 mB
```

หรือ:

```text
Electric Device
Immersive Engineering
```

---

# 8. Jade UI Philosophy

HUD ต้อง informative แต่ไม่รก

Preferred:

```text
Name
Mod
Important state/value
```

หลีกเลี่ยงการแสดง debug-level information มากเกินไป

เช่น:

```text
NBT
Registry internals
Machine implementation details
```

ไม่ควรแสดงให้ player ปกติถ้าไม่จำเป็น

---

# 9. Jade Addons

## Source

https://www.curseforge.com/minecraft/mc-mods/jade-addons

## Status

```text
CORE
```

## Role

เพิ่ม integration ให้ Jade กับ modded systems

โดยเฉพาะ:

- Create
- Contraptions
- Filters
- Containers
- Machine states
- Modded blocks

ต้อง test กับ exact Create 6.0.x version ที่เลือก

---

# 10. Crafting Tweaks

## Source

https://www.curseforge.com/minecraft/mc-mods/crafting-tweaks

## Status

```text
CORE
```

## Role

เพิ่ม QoL ใน Crafting Grid เช่น:

```text
Rotate
Balance
Clear
Spread
```

เหมาะกับ modpack ที่มี component crafting จำนวนมาก

ไม่ควรเปลี่ยน progression

เป็น QoL เท่านั้น

---

# 11. Mouse Tweaks

## Source

https://www.curseforge.com/minecraft/mc-mods/mouse-tweaks

## Status

```text
CORE CLIENT
```

## Role

ปรับ inventory mouse interaction ให้ใช้งานง่ายขึ้น

เช่น:

- Drag distribution
- Faster item movement
- Improved inventory interaction

ไม่มี gameplay progression

---

# 12. Polymorph

## Source

https://www.curseforge.com/minecraft/mc-mods/polymorph

## Status

```text
CORE
COMPATIBILITY TEST REQUIRED
```

## Role

แก้ปัญหา recipe collision

ตัวอย่าง:

```text
Recipe Input A

Mod X → Output X
Mod Y → Output Y
```

Polymorph ให้ผู้เล่นเลือก output

---

# 13. Polymorph Warning

ต้อง test ร่วมกับ:

```text
Visual Workbench
KubeJS
Create
MineColonies crafting
Sophisticated Backpacks
MrCrayfish Furniture
SecurityCraft
Immersive Engineering
```

หากมี incompatibility:

อย่าแก้ด้วยการ remove Polymorph ทันที

ให้ตรวจ:

```text
1. Recipe conflict จริงหรือไม่
2. KubeJS สามารถแก้ conflict โดยตรงได้หรือไม่
3. Polymorph จำเป็นเฉพาะบาง recipe หรือไม่
```

Preferred strategy:

```text
Resolve predictable recipe conflicts with KubeJS

Use Polymorph as safety net
```

ไม่ควรพึ่ง Polymorph เพื่อกลบ recipe architecture ที่ไม่สะอาด

---

# 14. Crafting Assistance UX Flow

Target UX:

```text
FTB Quest
↓
Player sees objective
↓
Clicks / searches target item
↓
JEI
↓
Recipe
↓
Component
↓
Sub-component
↓
Processing method
↓
Player builds production line
```

ตัวอย่าง:

```text
Quest:
Establish Ammunition Production

↓

JEI:
5.56 Cartridge

↓

Sequenced Assembly

↓

Brass Casing
Projectile
Gunpowder

↓

Brass Casing

↓

Copper + Zinc
↓

Create processing
```

ทุกอย่างต้อง discover ได้ในเกม

---

# 15. Relationship With FTB Quests

FTB Quests = Goal

JEI = How

ห้ามใช้ FTB Quests เป็น recipe manual เต็มรูปแบบ

ตัวอย่างที่ดี:

```text
Quest:
Automate Rifle Ammunition
```

ไม่ใช่:

```text
Step 1:
Craft Brass Sheet

Step 2:
Craft Casing

Step 3:
Craft Bullet

Step 4:
Craft Ammo
```

ผู้เล่นควรใช้ JEI สำหรับ technical recipe details

---

# 16. Recipe Information Hierarchy

ใช้ระบบ:

```text
FTB Quest
=
WHY / WHAT

JEI
=
HOW

Jade
=
WHAT IS THIS / CURRENT STATE
```

สามระบบต้อง complement กัน

---

# 17. Tactical Tracker

## Base Mod

### Player Microchip (Tracker)

Source:

https://www.curseforge.com/minecraft/mc-mods/player-microchip

Status:

```text
CORE
CUSTOM AESTHETIC
CUSTOM RECIPE
POSSIBLE CURIOS INTEGRATION
```

---

# 18. Tracker Design Goal

ไม่ต้องการ:

```text
Free teammate HUD
```

ไม่ต้องการ:

```text
Always-visible teammate markers
```

ไม่ต้องการ:

```text
Magic tracking compass
```

ต้องการ:

> Tactical Position Beacon / Blue Force Tracker

ตำแหน่งเพื่อนต้องเกิดจาก equipment

---

# 19. Tracker Re-theme

Base mod concept เดิม:

```text
Microchip implant
```

ไม่ตรง aesthetic ของ pack

ให้ reinterpret เป็น:

```text
Tactical Position Beacon
```

Preferred names:

```text
Tactical Position Beacon
Personnel Tracking Device
```

Alternative:

```text
Blue Force Beacon
Squad Transponder
Personnel Locator
GPS Beacon
```

---

# 20. Tracker Equipment Concept

Player:

```text
Plate Carrier
+
Radio
+
Tactical Position Beacon
```

Beacon ควรดูเหมือนติดกับ:

- Plate carrier
- Belt
- Backpack
- Radio pouch

ไม่ใช่ cybernetic implant

---

# 21. Frequency System

ใช้ frequency เป็น team network

ตัวอย่าง:

```text
ALPHA
101

BRAVO
102

RECON
110

LOGISTICS
200

AIR
300

COMMAND
900
```

ผู้เล่นบน frequency ต่างกัน:

```text
NOT TRACKED
```

---

# 22. Tracker Gameplay Example

```text
Player A
Beacon: 101

Player B
Beacon: 101

Player C
Beacon: 101

Squad Leader
Tracking Device: 101
```

Output:

```text
ALPHA-1
NE
230 m

ALPHA-2
W
511 m

ALPHA-3
N
1.4 km
```

Exact coordinates อาจอยู่ใน detailed view

---

# 23. Relationship With Radio

Main Pack มี:

```text
Simple Voice Chat
Simple Voice Radio
```

Role:

```text
Radio
=
Communication

Tracker
=
Position Awareness
```

ไม่ต้อง hard-depend กันใน Alpha

แต่ concept ควรเข้าคู่กัน

ตัวอย่าง:

```text
Radio Channel 101
Tracker Frequency 101
```

---

# 24. Tracker Progression

## Early Game

```text
No electronic tracking
```

ใช้:

- Coordinates
- Landmarks
- Voice communication

---

## Early-Mid

```text
Radio
```

คุยกันได้

แต่ไม่เห็น location

---

## Mid Game

```text
Tactical Position Beacon
```

เริ่ม transmit position

---

## Mid/Late

```text
Personnel Tracking Device
```

ใช้โดย:

- Squad leader
- Recon
- Command
- Rescue team

---

# 25. Tracker Recipe Philosophy

Tracker ต้องไม่ craft ง่ายตั้งแต่ Day 1

ต้องอยู่ใน:

```text
Industrial Electronics Progression
```

Concept recipe:

## Tactical Position Beacon

```text
Copper Sheet
Electron Tube
Redstone
Precision Mechanism
Electronic Component
```

---

## Personnel Tracking Device

```text
Brass Casing
Precision Mechanism
Electron Tubes
Display Component
Redstone
```

Exact item IDs:

```text
DO NOT ASSUME
```

ต้อง inspect registry จริงหลัง mods ถูกติดตั้ง

---

# 26. Create Integration

ถ้าเหมาะ:

ใช้ Create Sequenced Assembly

Concept:

```text
Brass Sheet
↓
Deploy Electron Tube
↓
Deploy Precision Component
↓
Deploy Redstone/Electronics
↓
Press
↓
Tactical Position Beacon
```

เหตุผล:

Tracker เป็นผลิตภัณฑ์ของ industrial electronics

ไม่ใช่ crafting table magic

---

# 27. Curios Integration

Preferred:

```text
Tactical Beacon
→ Curios slot
```

Candidate slots:

```text
belt
body
radio
back
```

Preferred:

```text
radio
or
belt
```

ถ้า base mod ไม่รองรับง่าย:

Fallback:

```text
Beacon must exist in inventory
```

Alpha ห้าม block เพราะ Curios integration

---

# 28. Tracker Restrictions

Preferred:

### Equipment Required

ไม่มี beacon:

```text
No tracking
```

### Frequency Required

frequency ไม่ตรง:

```text
No tracking
```

### Dimension

Default:

```text
same dimension only
```

ไม่ควร:

```text
Overworld tracker
→ exact Nether player position
```

### Range

ถ้า configurable:

```text
Early tactical beacon:
1–2 km

Advanced system:
4–8 km
```

ถ้า base mod unlimited และแก้ยาก:

ยอมรับใน Alpha

แล้ว document เป็น future balance issue

---

# 29. PlayerRevive Interaction

Main Pack มี:

```text
PlayerRevive
```

เมื่อ player Downed:

```text
Beacon SHOULD continue transmitting
```

Gameplay:

```text
Scout downed
↓
Radio silent
↓
Beacon still active
↓
Rescue team gets location
```

ต้อง test จริง

---

# 30. Corpse Interaction

Main Pack มี:

```text
Corpse
```

Future ideal behavior:

```text
Player dies
↓
Beacon signal lost
↓
Last known position retained
```

แต่:

```text
NOT REQUIRED FOR ALPHA
```

อย่าเขียน custom Java system เพื่อ feature นี้ก่อน core tracker stable

---

# 31. Future Tracker Infrastructure

Future Beta/Season 2 concept:

```text
Beacon
↓
Radio Tower
↓
Repeater
↓
Command Center
```

Potential:

- City antenna
- Mountain repeater
- Frontier relay
- Airbase tower

Goal:

```text
Information requires infrastructure
```

แต่:

```text
OUT OF SCOPE FOR ALPHA
```

---

# 32. No Party HUD

Do not install free teammate-tracking Party HUD as default

Reason:

```text
Free omniscient information
```

contradicts:

```text
equipment-driven technology progression
```

---

# 33. File Structure

Recommended:

```text
industrial-civilization-survival/
│
├── kubejs/
│   ├── server_scripts/
│   │   ├── recipe_qol/
│   │   └── tracker/
│   │       ├── recipes.js
│   │       └── progression.js
│   │
│   └── client_scripts/
│       └── jei/
│           ├── hide_items.js
│           └── categories.js
│
├── config/
│   ├── jei/
│   ├── jade/
│   ├── polymorph/
│   └── playertracker/
│
├── resourcepacks/
│   └── industrial_survival_tracker/
│       └── assets/
│
└── docs/
    ├── recipe-discovery.md
    └── tracker-system.md
```

Actual paths ต้อง inspect หลัง mod generate config

ห้าม assume path จากชื่อ conceptual นี้

---

# 34. Implementation Order

## Phase A0 — Compatibility Matrix

เพิ่ม 7 mods ลง:

```text
docs/compatibility-matrix.md
```

Fields:

```text
Mod
Version
Minecraft
Forge
Side
Dependencies
Known Conflicts
Tested
Notes
```

---

## Phase A1 — Install JEI

Test:

- Client boot
- Dedicated server boot if applicable
- Search
- Vanilla recipe
- Create recipe
- KubeJS recipe

---

## Phase A2 — Jade + Jade Addons

Test:

- Vanilla blocks
- Create machines
- Fluid tanks
- Containers
- Contraptions

Check HUD clutter

---

## Phase A3 — Crafting Tweaks + Mouse Tweaks

Test:

- Vanilla crafting
- Visual Workbench
- Modded crafting
- Multiplayer

---

## Phase A4 — Polymorph

สร้าง intentional recipe collision test

Verify:

```text
Both outputs selectable
```

แล้ว test integration กับ:

- Visual Workbench
- Create
- KubeJS
- Sophisticated storage
- MineColonies

---

## Phase A5 — JEI Cleanup

หลัง Main Pack recipes เริ่มถูก custom:

- Hide disabled items
- Hide obsolete ammo
- Hide intentionally inaccessible machinery
- Verify custom recipes visible

Deliverable:

```text
Clean recipe browser
```

---

## Phase A6 — Player Tracker Base Test

Install Player Microchip

Test:

```text
2 players
same frequency
different frequency
logout/reconnect
death
dimension change
dedicated server
```

---

## Phase A7 — Tracker Re-theme

เปลี่ยน:

- Item names
- Tooltips
- Textures if needed

Target:

```text
Tactical Position Beacon
Personnel Tracking Device
```

---

## Phase A8 — Tracker Recipes

Remove/replace default recipe if necessary

Implement KubeJS progression

Then verify recipe appears correctly in JEI

This interaction is important:

```text
Tracker Custom Recipe
↓
JEI
↓
Player can discover recipe in-game
```

---

## Phase A9 — Curios Prototype

Attempt:

```text
Beacon active while equipped in Curios slot
```

If unstable:

fallback to inventory behavior

Do not delay Alpha

---

# 35. Cross-System Integration

This addon creates the following relationship:

```text
FTB Quests
   ↓
Objectives
   ↓
JEI
   ↓
Recipe Discovery
   ↓
Create / KubeJS Manufacturing
```

และ:

```text
Simple Voice Radio
        +
Tactical Position Beacon
        +
CCTV
        +
Security Room
        ↓
Command & Control
```

ดังนั้น addon นี้ไม่ได้เป็นแค่ QoL

มันเพิ่ม:

```text
Knowledge Infrastructure
+
Information Infrastructure
```

---

# 36. Performance

## JEI

Large item count อาจเพิ่ม:

- Startup time
- Search indexing
- Memory use

ต้อง test หลัง full mod list ถูกติดตั้ง

---

## Jade

Avoid expensive block/entity polling addons ถ้า profiling พบปัญหา

---

## Tracker

ตรวจว่า base mod:

- Polls every player every tick หรือไม่
- Syncs full coordinates every tick หรือไม่
- Creates excessive network packets หรือไม่

Preferred update frequency:

```text
4–10 updates/sec
```

เพียงพอสำหรับ tactical position tracking

ไม่จำเป็นต้อง 20 updates/sec

แต่ห้าม rewrite ก่อน profiling

---

# 37. Definition of Done — Recipe Assistance

ระบบ crafting assistance พร้อมใช้เมื่อ:

- JEI เปิดได้
- Search ของจากทุก core mod ได้
- Create recipes แสดงถูก
- KubeJS recipes แสดงถูก
- Disabled recipes ไม่ทำให้ผู้เล่นสับสน
- Jade แสดง machine information ได้
- Jade Addons ไม่ conflict
- Crafting Tweaks ทำงาน
- Mouse Tweaks ทำงาน
- Polymorph recipe collision ทำงาน
- Visual Workbench ไม่ conflict
- Dedicated server ยังทำงานปกติ

---

# 38. Definition of Done — Tracker

Tracker พร้อมใช้เมื่อ:

- Base mod ใช้งานบน Forge 1.20.1 ได้
- Multiplayer tracking ทำงาน
- Frequency separation ทำงาน
- ไม่มี free tracking ถ้าไม่มี beacon
- Rename/re-theme เป็น tactical equipment แล้ว
- Recipe ถูก custom แล้ว
- JEI แสดง recipe ใหม่
- PlayerRevive interaction ผ่าน test
- Reconnect ผ่าน
- Dedicated server ผ่าน
- Performance impact negligible

---

# 39. Claude Code Hard Rules

## DO

1. Pin exact versions.
2. Update compatibility matrix.
3. Test each mod batch separately.
4. Make JEI reflect actual pack recipes.
5. Hide disabled content when appropriate.
6. Keep tracker equipment-driven.
7. Use KubeJS before Java modifications.
8. Test multiplayer.
9. Test dedicated server.
10. Document conflicts.

## DO NOT

1. Do not add Party HUD free tracking.
2. Do not add another recipe browser without explicit reason.
3. Do not install EMI simultaneously with JEI by default.
4. Do not use Polymorph to hide bad recipe architecture.
5. Do not expose disabled recipes/items misleadingly.
6. Do not turn tracker into cyberpunk implant thematically.
7. Do not create custom Java mod before proving KubeJS/config/resource pack insufficient.
8. Do not invent config paths or keys.
9. Do not assume Curios compatibility.
10. Do not claim success without launch and multiplayer validation.

---

# 40. Final Addon Definition

> **This addon gives Industrial Civilization Survival an integrated in-game knowledge system through JEI/Jade and an equipment-driven tactical position-tracking system through a re-themed Player Microchip tracker. Players should be able to discover every valid crafting path without external websites while teammate location awareness remains a technological capability that requires physical equipment rather than free HUD information.**

Final mod additions:

```text
Just Enough Items (JEI)
Jade
Jade Addons
Crafting Tweaks
Mouse Tweaks
Polymorph
Player Microchip (Tracker)
```

Total:

```text
7 additional mods
```