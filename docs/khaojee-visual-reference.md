<!-- lang:en -->
# Khaojee visual reference — V0 audit

**What this is.** The source-tracking table *Visuals Spec §36* asks for: every project in the
reference modpack, what we decided about it, and the evidence for the decision.

**What it is not.** A claim that any of these works. Nothing here has been installed and nothing has
been booted. This answers only the cheap questions — *does a Forge 1.20.1 build exist, what does it
need, and what is its licence* — which is exactly the scope *Visuals Spec §37* gives V0.

- **Reference modpack:** <https://modrinth.com/modpack/khaojee-enchanted-visuals>
- **Reference video:** <https://youtu.be/cxahj-PuLb0>
- **Swept:** 2026-08-27 · 24 projects
- **Related:** issue #52, and the licence risk this audit surfaced — issue #53

## Method, so it can be redone

Search by **title**, never by a guessed slug. The design document's TFMG URL was a CurseForge slug
and `create-industry` on Modrinth is a *modpack* (ADR 0004); the compatibility matrix records the
same trap for `smoothplayeranimations`. This sweep hit it again in a quieter form: **Soft Imprints
lives at the slug `snow-imprints`.** A composed URL would have 404ed at best.

```bash
# 1. find the project by title; the API returns the slug as data
curl -s "https://api.modrinth.com/v2/search?query=Soft%20Imprints&limit=5"

# 2. ask for a file that is BOTH forge AND 1.20.1 — a project can carry both
#    facets without any single file carrying both, which is how a resource pack
#    ends up looking like a Forge mod
curl -s "https://api.modrinth.com/v2/project/<slug>/version\
?loaders=%5B%22forge%22%5D&game_versions=%5B%221.20.1%22%5D"

# 3. the project endpoint carries licence, client_side and server_side
curl -s "https://api.modrinth.com/v2/project/<slug>"
```

## ADOPT — *Visuals Spec §42* initial adoption set

Six of seven are real Forge 1.20.1 mods. None is installed.

| Reference project | Our choice | Version | Platform | Status | Reason | Licence |
|---|---|---|---|---|---|---|
| Grassier Grass | `grassier-grass` | `1.4.5` | Forge 1.20.1 | **ADOPT** | §5 core visual candidate; denser grass without losing vanilla readability | ⚠️ All Rights Reserved |
| Better Biome Blend | `better-biome-blend` | `1.20.1-1.4.0-forge` | Forge 1.20.1 | **ADOPT** | §6; smooths grass/leaf/water transitions during train travel and long exploration | Unlicense |
| Soft Imprints | `snow-imprints` ⚠️ *slug ≠ title* | `2.8.0` | Forge 1.20.1 | **ADOPT** | §7; footprints in snow and sand, for tactical atmosphere | MIT |
| Subtle Effects | `subtle-effects` | `1.14.3` | Forge 1.20.1 | **ADOPT** | §8; more feedback, not more noise | ⚠️ All Rights Reserved |
| Particle Rain | `particle-rain` | `v4-beta.11+1.20.1-forge` | Forge 1.20.1 | **ADOPT** | §9; weather feel alongside Serene Seasons | MIT |
| Fancy World Animations | `fwa` | `1.2.31` | Forge 1.20.1 | **ADOPT** | §10; animated doors, levers, chests — reads well in factories and control rooms | MIT |
| Continuity *(reference)* | **Fusion** `fusion-connected-textures` | `1.3.14a-forge-mc1.20.1` | Forge 1.20.1 | **ADOPT WITH REPLACEMENT** | §12; Fusion is Forge-native, so no Fabric bridge is needed | ⚠️ All Rights Reserved |

**§12's reasoning is confirmed, not merely accepted.** Fusion ships a Forge 1.20.1 build, so the
spec's refusal to add a Fabric compatibility bridge just for Continuity costs nothing.

**One new dependency:** Subtle Effects requires **Fzzy Config**, which is not in the pack.

## ANIM — governed by the *Animation Spec*, not by this one

| Reference project | Our choice | Version | Platform | Status | Reason | Licence |
|---|---|---|---|---|---|---|
| EMF | `entity-model-features` | `3.2.4-forge-1.20.1` | Forge 1.20.1 | **SELECTIVE** | §11; the loader Fresh Animations needs. Requires ETF | LGPL-3.0-only |
| ETF | `entitytexturefeatures` | `7.1-forge-1.20.1` | Forge 1.20.1 | **SELECTIVE** | §11; required by EMF | LGPL-3.0-only |
| Fresh Animations | `fresh-animations` | **no Forge file** — loader `minecraft` | **resource pack** | **SELECTIVE, vanilla entities only** | §11; it is a resource pack, which is *why* it needs EMF + ETF | ⚠️ *See terms of use in description* |
| Fresh Animations: Player Extension | — | — | — | **OFF** | §11; the player already belongs to SPA + NEA | — |

**The pack's animation architecture is already complete.** *Visuals Spec §10* describes
SPA + NEA + BAC + Smooth Movement, and all four are installed: `SmoothPlayerAnimations`,
`Not Enough Animations`, `Better Animations Collection`, `Smooth Movement`. V4 adds a selective
layer to a finished stack, it does not build one.

## PROTOTYPE — *Visuals Spec §43*

| Reference project | Our choice | Version | Platform | Status | Reason | Licence |
|---|---|---|---|---|---|---|
| Biomes O' Plenty | `biomes-o-plenty` | `19.0.0.96` | Forge 1.20.1 | **PROTOTYPE** | §13; changes geography, travel, oil search, rail planning. Needs **TerraBlender** (absent) and **GlitchCore** (already in the pack) | ⚠️ All Rights Reserved |
| Regions Unexplored | `regions-unexplored` | `F-0.5.6+1.20.1` | Forge 1.20.1 | **PROTOTYPE** | §14; same worldgen concerns. Needs **TerraBlender** (absent) | MIT |
| Countered's Terrain Slabs | `countereds-terrain-slabs` | `4.0.2-beta` | Forge 1.20.1 | **PROTOTYPE** | §16; risk to MineColonies pathfinding, rails and Create contraptions | MIT |
| Polytone | `polytone` | `1.20-3.5.26` | Forge 1.20.1 | **PROTOTYPE** | §19; keep only if it works with Serene Seasons | GPL-3.0-or-later |
| 3D World Decorations | `3ddecorations` | **no Forge file** — loader `minecraft` | **resource pack** | **PROTOTYPE, reclassified** | §17 treats it as a mod; it is a resource pack | ⚠️ All Rights Reserved |
| Lushier Forests | `lushier-forests` | **no Forge file** — loader `minecraft` | **resource pack** | **PROTOTYPE, reclassified** | §18; a resource pack, and redistributable with attribution | CC-BY-4.0 |
| Musgo | **unresolved** | — | — | **UNRESOLVED** | No Modrinth match. CurseForge has no search API without a key, so this is *not found*, not *absent*. **Do not guess a slug** | unknown |
| Particle Interactions | `particle-interactions` | **no 1.20.1 file at all** | — | **→ REJECT** | §43 lists it as a prototype; there is nothing to prototype on any loader | CC-BY-NC-4.0 |

## REJECT — *Visuals Spec §44*, and the reason is now measured

The spec deferred these on a *compatibility-cost* argument. The measurement is stronger than the
argument: on Forge 1.20.1 there is nothing to install.

| Reference project | Finding | Licence |
|---|---|---|
| Wakes | 1.20.1 exists — **fabric only** | GPL-3.0-only |
| Particular | 1.20.1 exists — **fabric only** | LGPL-3.0-only |
| Item Interactions | 1.20.1 exists — **fabric only** | LGPL-3.0-only |
| Presence Footsteps | 1.20.1 exists — **fabric/quilt only** | Polyform Shield 1.0 |
| Auditory Continued | 1.20.1 exists — **fabric/quilt only** | MIT |
| Tree Physics | **no 1.20.1 file at all** | All Rights Reserved |

## ALREADY COVERED

*Visuals Spec §21* and §24 both describe stacks this pack already owns, and the audit confirms it:

- **Sound** — AmbientSounds, Sound Physics Remastered, Simple Voice Chat, Simple Voice Radio.
- **Performance** — all six of §24's required stack are installed: Embeddium, ModernFix, FerriteCore,
  Entity Culling, ImmediatelyFast, ServerCore.
- **Animation** — SPA, NEA, BAC, Smooth Movement.

## What V0 does not decide

**Whether any of this works.** *Visuals Spec §41* rule 11 is *"Do not claim compatibility without
launch testing"*, and §38's done-criteria are all measurements on a running client: FPS, 1% lows,
combat readability under Horde-in-rain, NVG usability. This repo has never launched one.

**Whether we may ship them.** Three of the seven adoption-set mods are All Rights Reserved. That is
the ordinary default on both hosts and many such authors permit modpack inclusion — but nobody has
read the terms, for these or for the mods already in the pack. Issue **#53**, which has since
read all 107.

**The worldgen question.** §33 says worldgen must be settled before persistent play begins, and
§15 requires multiple seeds. That is V6–V8 and it is a decision, not a lookup.
<!-- lang:end -->

<!-- lang:th -->
# Khaojee visual reference — การ audit V0

**นี่คืออะไร** ตารางติดตามต้นทางที่ *Visuals Spec §36* ขอไว้: ทุกโปรเจกต์ใน modpack อ้างอิง
สิ่งที่เราตัดสินใจกับมัน และหลักฐานของการตัดสินใจนั้น

**ไม่ใช่อะไร** ไม่ใช่การอ้างว่าอันไหนใช้งานได้ ไม่มีอะไรถูกติดตั้งและไม่มีอะไรถูก boot
เอกสารนี้ตอบเฉพาะคำถามที่ถูกที่สุด — *มี build สำหรับ Forge 1.20.1 ไหม มันต้องใช้อะไร
และสัญญาอนุญาตของมันคืออะไร* — ซึ่งเป็นขอบเขตที่ *Visuals Spec §37* ให้ V0 พอดี

- **modpack อ้างอิง:** <https://modrinth.com/modpack/khaojee-enchanted-visuals>
- **วิดีโออ้างอิง:** <https://youtu.be/cxahj-PuLb0>
- **กวาดเมื่อ:** 2026-08-27 · 24 โปรเจกต์
- **เกี่ยวข้อง:** issue #52 และความเสี่ยงเรื่องสัญญาอนุญาตที่ audit นี้เปิดโปงออกมา — issue #53

## วิธีทำ เพื่อให้ทำซ้ำได้

ค้นด้วย**ชื่อ** ห้ามเดา slug เด็ดขาด URL ของ TFMG ในเอกสารออกแบบเป็น slug ของ CurseForge
และ `create-industry` บน Modrinth คือ *modpack* (ADR 0004) ส่วน compatibility matrix
ก็บันทึกกับดักเดียวกันไว้สำหรับ `smoothplayeranimations` การกวาดรอบนี้เจอมันอีกในรูปแบบที่เงียบกว่า:
**Soft Imprints อยู่ที่ slug ชื่อ `snow-imprints`** URL ที่ประกอบขึ้นเองจะ 404 อย่างดีที่สุด

```bash
# 1. หาโปรเจกต์จากชื่อ API จะคืน slug มาเป็นข้อมูล
curl -s "https://api.modrinth.com/v2/search?query=Soft%20Imprints&limit=5"

# 2. ขอไฟล์ที่เป็นทั้ง forge และ 1.20.1 — โปรเจกต์หนึ่งมี facet ทั้งสองได้
#    โดยไม่มีไฟล์ไหนมีครบทั้งคู่ ซึ่งเป็นวิธีที่ resource pack ดูเหมือนมอด Forge
curl -s "https://api.modrinth.com/v2/project/<slug>/version\
?loaders=%5B%22forge%22%5D&game_versions=%5B%221.20.1%22%5D"

# 3. project endpoint มีสัญญาอนุญาต client_side และ server_side
curl -s "https://api.modrinth.com/v2/project/<slug>"
```

## ADOPT — ชุดรับมาเริ่มต้นตาม *Visuals Spec §42*

หกจากเจ็ดเป็นมอด Forge 1.20.1 จริง ยังไม่มีตัวไหนถูกติดตั้ง

| โปรเจกต์อ้างอิง | สิ่งที่เราเลือก | เวอร์ชัน | แพลตฟอร์ม | สถานะ | เหตุผล | สัญญาอนุญาต |
|---|---|---|---|---|---|---|
| Grassier Grass | `grassier-grass` | `1.4.5` | Forge 1.20.1 | **ADOPT** | §5; หญ้าหนาขึ้นโดยไม่เสียความอ่านง่ายแบบ vanilla | ⚠️ All Rights Reserved |
| Better Biome Blend | `better-biome-blend` | `1.20.1-1.4.0-forge` | Forge 1.20.1 | **ADOPT** | §6; ไล่สีหญ้า/ใบไม้/น้ำให้เนียนตอนนั่งรถไฟและสำรวจไกล | Unlicense |
| Soft Imprints | `snow-imprints` ⚠️ *slug ≠ ชื่อ* | `2.8.0` | Forge 1.20.1 | **ADOPT** | §7; รอยเท้าบนหิมะและทราย เพื่อบรรยากาศเชิงยุทธวิธี | MIT |
| Subtle Effects | `subtle-effects` | `1.14.3` | Forge 1.20.1 | **ADOPT** | §8; feedback มากขึ้น ไม่ใช่สัญญาณรบกวนมากขึ้น | ⚠️ All Rights Reserved |
| Particle Rain | `particle-rain` | `v4-beta.11+1.20.1-forge` | Forge 1.20.1 | **ADOPT** | §9; ความรู้สึกของสภาพอากาศ คู่กับ Serene Seasons | MIT |
| Fancy World Animations | `fwa` | `1.2.31` | Forge 1.20.1 | **ADOPT** | §10; ประตู คันโยก หีบ มีแอนิเมชัน เข้ากับโรงงานและห้องควบคุม | MIT |
| Continuity *(อ้างอิง)* | **Fusion** `fusion-connected-textures` | `1.3.14a-forge-mc1.20.1` | Forge 1.20.1 | **ADOPT WITH REPLACEMENT** | §12; Fusion เป็น Forge โดยกำเนิด จึงไม่ต้องใช้ Fabric bridge | ⚠️ All Rights Reserved |

**เหตุผลของ §12 ได้รับการยืนยัน ไม่ใช่แค่ยอมรับ** Fusion มี build สำหรับ Forge 1.20.1
การที่ spec ปฏิเสธการเพิ่ม Fabric compatibility bridge เพียงเพื่อ Continuity จึงไม่มีต้นทุนอะไรเลย

**dependency ใหม่หนึ่งตัว:** Subtle Effects ต้องใช้ **Fzzy Config** ซึ่งไม่มีใน pack

## ANIM — อยู่ใต้ *Animation Spec* ไม่ใช่ spec นี้

| โปรเจกต์อ้างอิง | สิ่งที่เราเลือก | เวอร์ชัน | แพลตฟอร์ม | สถานะ | เหตุผล | สัญญาอนุญาต |
|---|---|---|---|---|---|---|
| EMF | `entity-model-features` | `3.2.4-forge-1.20.1` | Forge 1.20.1 | **SELECTIVE** | §11; ตัวโหลดที่ Fresh Animations ต้องใช้ ต้องมี ETF | LGPL-3.0-only |
| ETF | `entitytexturefeatures` | `7.1-forge-1.20.1` | Forge 1.20.1 | **SELECTIVE** | §11; EMF ต้องการ | LGPL-3.0-only |
| Fresh Animations | `fresh-animations` | **ไม่มีไฟล์ Forge** — loader `minecraft` | **resource pack** | **SELECTIVE เฉพาะ entity ของ vanilla** | §11; มันเป็น resource pack ซึ่งเป็น*เหตุผล*ที่ต้องมี EMF + ETF | ⚠️ *ดูเงื่อนไขการใช้งานในคำอธิบาย* |
| Fresh Animations: Player Extension | — | — | — | **ปิด** | §11; ผู้เล่นเป็นของ SPA + NEA อยู่แล้ว | — |

**สถาปัตยกรรมแอนิเมชันของ pack ครบอยู่แล้ว** *Visuals Spec §10* อธิบาย SPA + NEA + BAC +
Smooth Movement และทั้งสี่ตัวติดตั้งอยู่แล้ว: `SmoothPlayerAnimations`, `Not Enough Animations`,
`Better Animations Collection`, `Smooth Movement` V4 เพิ่มชั้นแบบเลือกสรรลงบนกองที่เสร็จแล้ว
ไม่ใช่การสร้างกองขึ้นมาใหม่

## PROTOTYPE — *Visuals Spec §43*

| โปรเจกต์อ้างอิง | สิ่งที่เราเลือก | เวอร์ชัน | แพลตฟอร์ม | สถานะ | เหตุผล | สัญญาอนุญาต |
|---|---|---|---|---|---|---|
| Biomes O' Plenty | `biomes-o-plenty` | `19.0.0.96` | Forge 1.20.1 | **PROTOTYPE** | §13; เปลี่ยนภูมิศาสตร์ ระยะเดินทาง การหาแหล่งน้ำมัน การวางราง ต้องใช้ **TerraBlender** (ไม่มี) และ **GlitchCore** (มีใน pack แล้ว) | ⚠️ All Rights Reserved |
| Regions Unexplored | `regions-unexplored` | `F-0.5.6+1.20.1` | Forge 1.20.1 | **PROTOTYPE** | §14; ข้อกังวลเรื่อง worldgen แบบเดียวกัน ต้องใช้ **TerraBlender** (ไม่มี) | MIT |
| Countered's Terrain Slabs | `countereds-terrain-slabs` | `4.0.2-beta` | Forge 1.20.1 | **PROTOTYPE** | §16; เสี่ยงต่อ pathfinding ของ MineColonies ราง และ contraption ของ Create | MIT |
| Polytone | `polytone` | `1.20-3.5.26` | Forge 1.20.1 | **PROTOTYPE** | §19; เก็บไว้ต่อเมื่อมันทำงานร่วมกับ Serene Seasons ได้ | GPL-3.0-or-later |
| 3D World Decorations | `3ddecorations` | **ไม่มีไฟล์ Forge** — loader `minecraft` | **resource pack** | **PROTOTYPE จัดประเภทใหม่** | §17 ปฏิบัติกับมันเหมือนเป็นมอด แต่มันเป็น resource pack | ⚠️ All Rights Reserved |
| Lushier Forests | `lushier-forests` | **ไม่มีไฟล์ Forge** — loader `minecraft` | **resource pack** | **PROTOTYPE จัดประเภทใหม่** | §18; เป็น resource pack และแจกซ้ำได้ถ้าให้เครดิต | CC-BY-4.0 |
| Musgo | **ยังหาไม่เจอ** | — | — | **UNRESOLVED** | ไม่เจอบน Modrinth CurseForge ไม่มี search API ถ้าไม่มีคีย์ ดังนั้นนี่คือ *ยังหาไม่เจอ* ไม่ใช่ *ไม่มี* **ห้ามเดา slug** | ไม่ทราบ |
| Particle Interactions | `particle-interactions` | **ไม่มีไฟล์ 1.20.1 เลย** | — | **→ REJECT** | §43 ลงมันไว้เป็น prototype แต่ไม่มีอะไรให้ prototype บน loader ไหนเลย | CC-BY-NC-4.0 |

## REJECT — *Visuals Spec §44* และตอนนี้เหตุผลวัดมาแล้ว

spec เลื่อนพวกนี้ออกไปด้วยเหตุผลเรื่อง*ต้นทุนความเข้ากันได้* การวัดหนักแน่นกว่าเหตุผลนั้น:
บน Forge 1.20.1 ไม่มีอะไรให้ติดตั้งเลย

| โปรเจกต์อ้างอิง | สิ่งที่พบ | สัญญาอนุญาต |
|---|---|---|
| Wakes | มี 1.20.1 — **fabric เท่านั้น** | GPL-3.0-only |
| Particular | มี 1.20.1 — **fabric เท่านั้น** | LGPL-3.0-only |
| Item Interactions | มี 1.20.1 — **fabric เท่านั้น** | LGPL-3.0-only |
| Presence Footsteps | มี 1.20.1 — **fabric/quilt เท่านั้น** | Polyform Shield 1.0 |
| Auditory Continued | มี 1.20.1 — **fabric/quilt เท่านั้น** | MIT |
| Tree Physics | **ไม่มีไฟล์ 1.20.1 เลย** | All Rights Reserved |

## ALREADY COVERED

*Visuals Spec §21* และ §24 อธิบายกองที่ pack นี้เป็นเจ้าของอยู่แล้ว และ audit ยืนยันแล้ว:

- **เสียง** — AmbientSounds, Sound Physics Remastered, Simple Voice Chat, Simple Voice Radio
- **ประสิทธิภาพ** — ครบทั้งหกตัวที่ §24 บังคับ: Embeddium, ModernFix, FerriteCore,
  Entity Culling, ImmediatelyFast, ServerCore
- **แอนิเมชัน** — SPA, NEA, BAC, Smooth Movement

## สิ่งที่ V0 ไม่ได้ตัดสิน

**ว่าอันไหนใช้งานได้** กฎข้อ 11 ของ *Visuals Spec §41* คือ *"อย่าอ้างความเข้ากันได้โดยไม่ทดสอบการเปิด"*
และเกณฑ์ done ของ §38 ทุกข้อเป็นการวัดบน client ที่รันอยู่: FPS, 1% lows,
ความชัดในการต่อสู้ตอน horde ในสายฝน การใช้งาน NVG repo นี้ไม่เคยเปิด client เลย

**ว่าเราแจกจ่ายมันได้หรือเปล่า** สามจากเจ็ดในชุด adoption เป็น All Rights Reserved
นั่นคือค่าเริ่มต้นปกติของทั้งสองเจ้า และผู้เขียนจำนวนมากก็อนุญาตให้ใส่ modpack —
แต่ยังไม่มีใครไปอ่านเงื่อนไข ทั้งของพวกนี้และของมอดที่อยู่ใน pack แล้ว issue **#53** ซึ่งตอนนี้อ่านครบทั้ง 107 ตัวแล้ว

**คำถามเรื่อง worldgen** §33 บอกว่า worldgen ต้องนิ่งก่อนเริ่มเล่นโลกถาวร และ §15 ต้องการหลาย seed
นั่นคือ V6–V8 และมันเป็นการตัดสินใจ ไม่ใช่การเปิดดู
<!-- lang:end -->
