
# Addon Spec — Natural Wildlife & Ecology
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Platform:** Minecraft 1.20.1 Forge  
> **Purpose:** เพิ่มระบบสัตว์ธรรมชาติและ ecology ให้โลกมีชีวิตมากขึ้น โดยไม่เปลี่ยน modpack ให้กลายเป็น zoo simulator, fantasy RPG หรือ entity-heavy kitchen sink pack
>
> เอกสารนี้ต้องสามารถใช้เป็น standalone implementation context สำหรับ Claude Code CLI ได้โดยไม่ต้องมี conversation history

---

# 1. Feature Summary

เพิ่ม wildlife/ecology layer ให้โลกของ Industrial Civilization Survival

เป้าหมายคือทำให้โลกมี contrast ระหว่าง:

```text
Natural World
vs
Hostile / Anomalous World
```

เช่น:

```text
Deer
Birds
Fish
Otters
Small animals
Normal wildlife

        ↓

Vanilla hostile mobs

        ↓

Born in Chaos anomalies

        ↓

Horde crisis

        ↓

Ice & Fire territorial creatures

        ↓

Dragon territory
```

สัตว์ธรรมดามีความสำคัญต่อ atmosphere ของ pack

เพราะโลกที่มีเพียง:

```text
Zombie
Skeleton
Monster
Dragon
```

จะทำให้ monster กลายเป็นเรื่องปกติ

แต่โลกที่มี:

```text
Deer
Birds
Fish
Otter
Livestock
Normal forest

↓

สิ่งผิดธรรมชาติปรากฏขึ้น
```

จะทำให้ hostile encounters มี impact มากกว่า

---

# 2. Mods Added By This Addon

เพิ่ม 3 mods:

```text
1. Naturalist
2. Critters and Companions
3. Ecologics
```

สถานะ:

```text
Naturalist
→ CORE

Critters and Companions
→ CORE

Ecologics
→ CORE
```

ไม่เพิ่ม:

```text
Untamed Wilds
Alex's Mobs
```

ใน Core Pack ณ ตอนนี้

เหตุผล:

- overlap สูง
- เพิ่ม entity diversity เกินความจำเป็น
- มีโอกาสทำให้ spawn ecosystem รก
- เพิ่มภาระ AI/pathfinding
- Alex's Mobs มี fantasy creatures จำนวนหนึ่งที่ overlap กับ threat layer

สามารถ reconsider ได้ภายหลังหากพบ ecological niche ที่ยังขาดจริง

---

# 3. Naturalist

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/naturalist
```

## Status

```text
CORE
SPAWN BALANCE REQUIRED
PERFORMANCE TEST REQUIRED
```

## Role

Naturalist เป็น wildlife backbone หลักของ modpack

ใช้เติมสัตว์ธรรมชาติขนาดกลางและใหญ่ เช่น:

```text
Deer
Birds
Predators
Large mammals
Reptiles
Aquatic animals
Biome-specific wildlife
```

Exact roster ต้อง inspect จาก version ที่เลือกจริง

อย่า hard-code assumptions จาก wiki/version อื่น

---

# 4. Naturalist Design Role

Naturalist ไม่ควรเป็น:

```text
อีกหนึ่ง progression mod
```

และไม่ควรเป็น:

```text
mob collection game
```

หน้าที่หลักคือ:

```text
World Ecology
Atmosphere
Environmental Identity
Natural Food Chain
Exploration Flavor
```

สัตว์ควรรู้สึกว่า:

> พวกมันอยู่ในโลกเพราะ biome นั้นเหมาะกับมัน

ไม่ใช่:

> ทุก biome มีสัตว์ 15 ตัวเดินเต็มพื้นที่

---

# 5. Critters and Companions

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/critters-and-companions
```

## Status

```text
CORE
LIGHTWEIGHT ECOLOGY LAYER
SPAWN BALANCE REQUIRED
```

## Role

เติมสัตว์ขนาดเล็กและ ambient creatures ที่ Naturalist ไม่ได้เน้น

ตัวอย่างประเภท:

```text
Otters
Ferrets
Small mammals
Small aquatic life
Insects
Small reptiles
Companion-like creatures
```

Exact entities ต้อง inspect registry จริง

---

# 6. Critters and Companions Design Role

Naturalist:

```text
Major Wildlife
```

Critters and Companions:

```text
Small Wildlife
+
Environmental Detail
```

สอง mod ต้อง complement กัน

ไม่ควรเกิด:

```text
Naturalist Animal A
+
Critters Animal B

ที่ทำ ecosystem role เดียวกัน
และ spawn พร้อมกันจำนวนมาก
```

หาก overlap ให้:

1. เปรียบเทียบ behavior
2. เปรียบเทียบ visuals
3. เปรียบเทียบ compatibility
4. เลือกตัวหลัก
5. ลดหรือปิด spawn อีกตัว

---

# 7. Ecologics

## Source

```text
https://www.curseforge.com/minecraft/mc-mods/ecologics
```

## Status

```text
CORE
VANILLA+ ECOLOGY
WORLDGEN TEST REQUIRED
```

## Role

Ecologics ไม่ใช่ wildlife mod แบบตรง ๆ

มันเติม:

```text
Biome detail
Vegetation
Environmental features
Small wildlife
Vanilla-like ecosystem content
```

หน้าที่คือทำให้โลกธรรมชาติดูสมบูรณ์ขึ้น

โดยไม่ดึง visual identity ไปไกลจาก Minecraft

---

# 8. Ecology Philosophy

Core principle:

> Wildlife should make the world feel alive, not crowded.

เป้าหมายไม่ใช่ maximize entity count

ต้องการ:

```text
Forest
→ Deer occasionally
→ Birds frequently
→ Small animals

River
→ Fish
→ Otter / aquatic wildlife

Plains
→ Herd animals occasionally

Coast
→ Marine wildlife

Remote Wilderness
→ More natural wildlife
```

ไม่ต้องการ:

```text
เดิน 20 blocks
→ Deer 8 ตัว
→ Birds 20 ตัว
→ Ferrets 6 ตัว
→ Elephants 4 ตัว
→ Monster 15 ตัว
```

---

# 9. Natural vs Hostile Density

Daytime ecosystem:

```text
Wildlife dominant
Hostile mobs low
```

Night:

```text
Wildlife activity reduced where appropriate
Hostile pressure increases
```

Deep Frontier:

```text
Normal wildlife
↓
gradually less predictable
↓
Anomalous creatures more common
```

Dragon territory:

```text
Normal wildlife density significantly reduced
```

Conceptually:

```text
Normal Region

Wildlife: █████
Monsters: ██
Apex:     ░


Frontier

Wildlife: ████
Monsters: ████
Apex:     █


Danger Zone

Wildlife: ██
Monsters: █████
Apex:     ██


Dragon Territory

Wildlife: █
Monsters: ███
Dragon:   █████
```

Exact implementation depends on available spawn controls

Do not invent config capabilities.

---

# 10. Relationship With Existing Threat Mods

Existing threat stack:

```text
Vanilla Hostiles
Born in Chaos
The Hordes
Enhanced AI
Improved Mobs
IceAndFire Community Edition
In Control!
```

Wildlife mods must coexist with this stack.

---

# 11. Born in Chaos Relationship

Born in Chaos represents:

```text
Anomalous / Corrupted / Horror Wildlife
```

Naturalist/Critters/Ecologics represent:

```text
Normal Ecology
```

Contrast is intentional.

Example:

```text
Healthy Forest

Birds
Deer
Small mammals

↓

Night falls

↓

Normal animal activity decreases

↓

Born in Chaos creature appears
```

That contrast is desirable.

Do not make Born in Chaos spawn so densely that normal wildlife becomes irrelevant.

---

# 12. IceAndFire Relationship

IceAndFire Community Edition represents:

```text
Mythical Wildlife
Regional Predators
Apex Creatures
```

Examples conceptually include:

```text
Troll
Cyclops
Sea Serpent
Hydra
Dragon
```

These should not behave like common wildlife.

Natural wildlife should help communicate territorial danger.

Example:

```text
Normal Forest

many signs of wildlife

↓

Approaching Dragon Territory

fewer animals

↓

burned terrain / destruction

↓

Dragon encounter
```

This is preferred environmental storytelling.

---

# 13. Dragon Territory Ecology

If technically feasible through config/In Control/datapack:

reduce normal animal spawning near areas associated with Dragon territories.

Do not hard-code complicated integration in Alpha.

Phase 1:

```text
Tune globally/by biome
```

Future:

```text
Regional ecosystem suppression
```

Possible desirable behavior:

```text
Dragon territory

↓ Passive animals
↓ Herd frequency
↓ Ambient wildlife

↑ Signs of danger
```

But only implement if technically reliable.

---

# 14. The Hordes Relationship

Horde events must not permanently destroy wildlife ecology.

Problem to avoid:

```text
Horde spawns
↓
kills every passive mob
↓
area remains biologically empty forever
```

Test:

- Horde AI interaction with animals
- Passive mob collateral deaths
- Respawn rates
- Long-term local population

If wildlife is wiped too easily:

adjust:

```text
Horde targeting
spawn recovery
animal density
```

using available configuration.

---

# 15. Enhanced AI / Improved Mobs

Verify whether these mods affect passive animals.

Desired:

```text
Enhanced hostile intelligence
```

Not:

```text
Every deer running expensive AI logic
```

Inspect exact entity/tag behavior.

If passive entities are unnecessarily modified:

exclude them where configurable.

---

# 16. In Control!

In Control should eventually become the primary high-level spawn director for the pack where appropriate.

Use it for:

```text
Spawn restrictions
Biome rules
Dimension rules
Density management
Threat zoning
```

But:

> Do not assume configuration keys.

Claude Code must inspect exact documentation/version being installed.

No invented keys.

---

# 17. Spawn Budget

Server performance is more important than having maximum wildlife density.

Define an approximate conceptual budget:

```text
Passive Wildlife
+
MineColonies NPCs
+
Hostile Monsters
+
Horde Entities
+
Projectiles
+
Create Contraptions
+
Valkyrien Skies Physics
```

ทั้งหมดแชร์ CPU budget เดียวกัน

Natural wildlife is the easiest layer to reduce when entity count becomes excessive.

---

# 18. Entity Density Priority

If server performance is under pressure, reduce in this order:

```text
1. Ambient decorative wildlife density
2. Small critter density
3. Duplicate species
4. Common passive animal density
```

Before reducing:

```text
Important hostile encounter design
MineColonies core functionality
Create systems
```

Wildlife must enhance the game

not consume the server.

---

# 19. Spawn Cap Philosophy

Avoid a world where passive mob cap is constantly saturated.

Investigate:

- Vanilla mob categories
- Naturalist spawn categories
- Critters spawn categories
- Ecologics entities
- Per-mod spawn configs
- Biome modifiers

Need to know whether mods share:

```text
CREATURE
AMBIENT
WATER_CREATURE
WATER_AMBIENT
```

or use custom behavior.

Do not guess.

---

# 20. Duplicate Species Audit

Create:

```text
docs/wildlife-roster.md
```

Recommended table:

```text
Species / Role
Source Mod
Biome
Spawn Weight
Gameplay Role
Overlap
Decision
```

Example:

```text
Deer
Naturalist
Forest
Medium
Ambient / Food
None
KEEP
```

For duplicates:

```text
Duck
Mod A
Mod B

↓

Compare

↓

KEEP A
REDUCE B
```

---

# 21. Wildlife Roster Categories

Classify all new animals into:

## Ambient

```text
Birds
Insects
Small decorative animals
```

## Small Wildlife

```text
Ferrets
Otters
Small mammals
```

## Medium Wildlife

```text
Deer
Boars
Predators
```

## Large Wildlife

```text
Large mammals
Large reptiles
```

## Aquatic

```text
Fish
Marine mammals
Aquatic reptiles
```

Purpose:

easy spawn-budget management later.

---

# 22. Dangerous Normal Animals

Not every dangerous creature needs to be supernatural.

If Naturalist contains predators:

allow them to remain dangerous.

Examples conceptually:

```text
Bear
Alligator
Large predator
```

But damage must remain believable.

Do not transform ordinary wildlife into bullet sponges.

Example desired combat:

```text
Large predator
→ dangerous at close range
→ several rifle rounds
→ dies normally
```

Not:

```text
Bear
→ 80 rifle rounds
```

---

# 23. Gun Interaction

Main combat system:

```text
TaCZ
```

Wildlife must respond sensibly to firearms.

Test:

```text
9mm
5.56
7.62
Shotgun
```

against representative animals.

Goal:

Firearms should feel like firearms.

Normal wildlife should generally have much lower TTK than:

```text
Born in Chaos elites
IceAndFire creatures
Dragons
```

---

# 24. Attract to Sound Interaction

Existing mod:

```text
Attract to Sound
```

Gunfire can attract monsters.

Need to verify whether wildlife reacts to sound.

Possible desirable future behavior:

```text
Gunshot
↓
Nearby wildlife flees
↓
Nearby monsters investigate
```

This would be excellent ecology behavior.

But:

```text
DO NOT assume supported
```

If base mods do not support wildlife sound reactions:

do not build custom system in Alpha.

Document as future enhancement.

---

# 25. Hunting

Wildlife naturally introduces hunting.

Desired:

```text
Hunting = optional survival activity
```

Not:

```text
Mandatory grinding progression
```

Potential:

- Meat
- Leather
- Food diversity
- Early survival resources

Farmer's Delight can provide downstream food usage if compatible.

But agriculture must remain valuable.

---

# 26. Hunting vs Farming Balance

Avoid:

```text
Hunting produces infinite superior food
```

or:

```text
Farming makes wildlife pointless
```

Ideal:

```text
Early Game
Hunting useful

Settlement
Farming more reliable

Industrial Civilization
Agriculture becomes main supply

Hunting remains exploration/survival option
```

This supports civilization progression.

---

# 27. No Trophy-Grind Focus

Do not turn wildlife into:

```text
rare drop hunting
legendary animal grind
RPG loot farming
```

unless the mod itself requires minimal unavoidable mechanics.

The pack is not Monster Hunter.

---

# 28. Animal Breeding

Audit which added creatures can be:

```text
bred
tamed
domesticated
```

Prevent unintended economy exploits.

Potential issue:

```text
Rare resource
↓
breed animal infinitely
↓
bypass industrial production
```

If discovered:

adjust recipe/drop/breeding behavior with config/datapack/KubeJS where appropriate.

---

# 29. Companion Animals

Critters and Companions may contain tameable animals.

Keep if they provide:

```text
Atmosphere
Companionship
Minor utility
```

Avoid allowing companion animals to become:

```text
OP combat army
infinite transport
major logistics bypass
```

---

# 30. Biome Identity

Wildlife should reinforce biome identity.

Example desired mapping:

```text
Forest
→ deer / birds / forest wildlife

River
→ otters / aquatic creatures

Wetlands
→ reptiles / amphibious wildlife

Savanna
→ large grazing animals

Ocean
→ marine wildlife

Cold regions
→ cold-adapted wildlife
```

Exact animals must follow actual mod biome tags/config.

Do not manually force inaccurate biome placement without reason.

---

# 31. Civilization Interaction

As cities expand:

```text
Wilderness
↓
Farms
↓
Settlements
↓
Industrial City
```

animal distribution should naturally shift due to terrain/building activity where vanilla spawning mechanics already cause it.

No need for complicated custom urban ecology simulation in Alpha.

Potential emergent result:

```text
City Center
→ almost no large wildlife

Suburbs / farmland
→ livestock/small wildlife

Frontier
→ full wildlife ecosystem
```

Perfectly acceptable.

---

# 32. MineColonies Interaction

Test wildlife around MineColonies settlements.

Potential issues:

```text
Animals blocking NPC paths
NPC guards attacking harmless animals
Farmers interacting unexpectedly
Animal entities accumulating inside colony
```

Profile large colony + wildlife population.

If necessary:

reduce wildlife spawn around heavily populated chunks.

Do not implement until measured.

---

# 33. Road / Railway Interaction

Create rail network will cross wilderness.

Wildlife near tracks is desirable aesthetically.

However monitor:

```text
Animals standing on rails
Train collision spam
Entity accumulation
Pathfinding around trains
```

Do not add artificial rail avoidance unless actual problem occurs.

---

# 34. Ecologics Worldgen

Ecologics can affect environment/world generation.

Before adding to existing production world:

test:

```text
New world generation
Biome transitions
Structures/features
Create resources
TFMG resources
Oil generation
IceAndFire worldgen
MineColonies
```

Primary concern:

worldgen compatibility.

---

# 35. World Generation Rule

Worldgen-affecting mods must be locked before public survival world begins where possible.

Once pack enters persistent multiplayer:

avoid removing worldgen content casually.

Document exact version.

---

# 36. Implementation Strategy

Preferred order:

```text
Config
↓
Datapack
↓
In Control
↓
KubeJS
↓
Custom Java compatibility code
```

Custom Java mod is last resort.

---

# 37. KubeJS Scope

KubeJS may be used for:

```text
Recipe integration
Drop adjustments
Item cleanup
Food integration
Disabled items
Tooltip clarification
```

Do not try to reproduce full mob AI/spawn systems in KubeJS unless absolutely necessary.

---

# 38. Phase W0 — Install & Registry Audit

Install:

```text
Naturalist
Critters and Companions
Ecologics
```

Record:

```text
Exact version
Dependencies
Forge compatibility
Client/server requirement
Config locations
Entity registry IDs
Biome tags
```

Update:

```text
docs/compatibility-matrix.md
```

---

# 39. Phase W1 — Basic Compatibility

Create clean test world.

Verify:

```text
Client boot
Dedicated server boot
World creation
World reload
Multiplayer join
```

No crashes.

---

# 40. Phase W2 — Wildlife Roster Audit

Generate:

```text
docs/wildlife-roster.md
```

For every significant creature record:

```text
Entity ID
Mod
Biome
Category
Spawn behavior
Hostile/Neutral/Passive
Tameable
Breedable
Drops
Overlap
Decision
```

---

# 41. Phase W3 — Spawn Baseline

Observe multiple test regions:

```text
Forest
Plains
River
Ocean
Swamp/Wetland
Cold biome
Hot biome
```

Record:

```text
Passive entity count
Species diversity
Spawn frequency
Visual density
```

No custom tuning yet.

First measure defaults.

---

# 42. Phase W4 — Duplicate Cleanup

Identify duplicated ecological roles.

Decisions:

```text
KEEP
REDUCE
RARE
DISABLE
```

Goal:

each species should contribute something distinct.

---

# 43. Phase W5 — Threat Integration

Install/test simultaneously with:

```text
Born in Chaos
IceAndFire CE
The Hordes
Enhanced AI
Improved Mobs
In Control
```

Check:

```text
Passive vs hostile density
Day/night balance
Predator interactions
Horde collateral
Dragon-region behavior
```

---

# 44. Phase W6 — Performance Test

Representative scenario:

```text
MineColonies settlement
+
50–100 wildlife entities
+
Hostile mobs
+
Create factory
+
TaCZ gunfire
```

Measure:

```text
MSPT
TPS
Entity tick time
Memory
Client FPS
```

Use Spark or equivalent profiler already chosen for pack performance work.

---

# 45. Phase W7 — Density Tuning

Only after profiling:

adjust:

```text
Spawn weights
Group sizes
Biome restrictions
Rare species
Passive density
```

Do not randomly reduce every value.

Tune based on measured population.

---

# 46. Phase W8 — Food / Drop Integration

Test drops against:

```text
Farmer's Delight
Vanilla food
Existing farming
```

Prevent:

```text
duplicate meats
useless items
overpowered food
```

Where necessary:

use tags/KubeJS recipes to unify equivalent resources.

---

# 47. Phase W9 — Persistent World Test

Run long-term world simulation/playtest.

Check after:

```text
10 Minecraft days
25 Minecraft days
50 Minecraft days
```

Questions:

- Is wildlife still present?
- Is one species dominating?
- Are passive caps saturated?
- Do Horde events wipe local ecology?
- Are animals accumulating around cities?
- Is server performance degrading?

---

# 48. Performance Budget

Wildlife feature must remain subordinate to core gameplay.

Core gameplay priority:

```text
Create
Combat
MineColonies
Threats
Infrastructure
Logistics
```

Wildlife priority:

```text
Atmosphere
Ecology
Exploration
```

If wildlife costs too much performance:

reduce wildlife.

Never sacrifice core industrial systems just to keep 100 decorative animals loaded.

---

# 49. Recommended Density Philosophy

Do not attempt exact values until testing.

General rule:

```text
Small Ambient Creatures
→ individually common
→ small group sizes

Medium Wildlife
→ moderate

Large Wildlife
→ uncommon

Large Exotic Wildlife
→ rare
```

This creates scale.

---

# 50. Rare Encounter Principle

Seeing a large animal should sometimes feel noteworthy.

Example:

```text
Bird
→ common

Otter
→ occasional

Deer herd
→ notable

Large exotic animal
→ memorable
```

Avoid every creature appearing within five minutes of spawn.

---

# 51. Safe Region Philosophy

Spawn region should feel relatively natural and understandable.

Preferred:

```text
Normal animals
Vanilla threats
A few weaker anomalies
```

Deep Frontier:

```text
More unusual threats
More dangerous wildlife
Mythical territorial creatures
```

This supports progression geographically.

---

# 52. Relationship With Seasons

Main Pack has:

```text
Serene Seasons
```

Test whether wildlife behavior/spawn changes automatically.

Do not assume integration.

Future enhancement could include:

```text
Winter
→ fewer insects
→ reduced some wildlife activity

Spring
→ increased wildlife

```

but:

```text
OUT OF SCOPE FOR ALPHA
```

unless mods already provide it reliably.

---

# 53. Do Not Add Survival Tax

Do not use wildlife expansion as excuse to add:

```text
hunger overhaul
thirst
disease
parasites
animal diseases
butchering minigame
```

unless explicitly approved later.

Wildlife should increase immersion, not micromanagement.

---

# 54. Approved Wildlife Stack

Final approved stack:

```text
Naturalist
+
Critters and Companions
+
Ecologics
```

Optional / not approved for Core:

```text
Untamed Wilds
Alex's Mobs
```

Do not install optional mods without explicit decision.

---

# 55. Definition of Done

Natural Wildlife & Ecology addon is Alpha-ready when:

- All three mods run on exact Minecraft 1.20.1 Forge environment.
- Client launches.
- Dedicated server launches.
- New world generates correctly.
- Major biomes contain appropriate wildlife.
- No severe duplicate-species problem.
- Passive population does not overwhelm mob caps.
- Wildlife and Born in Chaos coexist correctly.
- IceAndFire ecosystem is not overwhelmed by normal animals.
- Horde events do not permanently destroy wildlife population.
- MineColonies remains functional.
- Create infrastructure remains performant.
- TaCZ combat with normal animals feels believable.
- No significant MSPT regression.
- Mod versions/configs are pinned.
- Wildlife roster is documented.

---

# 56. Claude Code Hard Rules

## DO

1. Verify exact Forge 1.20.1 builds.
2. Pin exact versions.
3. Inspect dependencies.
4. Inspect entity registry IDs.
5. Measure default spawn behavior before tuning.
6. Build a wildlife roster.
7. Test multiple biomes.
8. Test dedicated server.
9. Profile entity performance.
10. Use config/datapack/In Control before custom Java.
11. Keep wildlife density restrained.
12. Preserve contrast between normal nature and supernatural threats.

## DO NOT

1. Do not add Alex's Mobs automatically.
2. Do not add Untamed Wilds automatically.
3. Do not install more animal mods just for species count.
4. Do not assume configuration keys.
5. Do not make normal animals bullet sponges.
6. Do not make every large animal hostile.
7. Do not turn wildlife into mandatory grind.
8. Do not let passive entities saturate server capacity.
9. Do not create custom AI systems before profiling.
10. Do not remove species merely because similar names exist without comparing behavior first.
11. Do not allow wildlife systems to replace farming/logistics progression.
12. Do not sacrifice core server performance for ambient density.

---

# 57. Final Feature Definition

> **Natural Wildlife & Ecology adds a believable layer of ordinary animals and environmental life to Industrial Civilization Survival, creating a living natural world against which anomalous monsters, hordes and dragons feel genuinely abnormal and threatening.**

The purpose is not:

```text
More mobs = better
```

The purpose is:

```text
Normal ecosystem
      +
Dangerous frontier
      +
Industrial civilization
      =
A world worth living in
and therefore worth defending
```

Final additions:

```text
Naturalist
Critters and Companions
Ecologics
```

Total:

```text
3 additional Core mods
```