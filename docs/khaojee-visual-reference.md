<!-- lang:en -->
# Khaojee visual reference — V0 audit

**What this is.** The source-tracking table *Visuals Spec §36* asks for: every project in the
reference modpack, what we decided about it, and the evidence for the decision.

**What it is not.** A claim that any of these works. Nothing here has been installed and nothing has
been booted. This answers only the cheap questions — *does a Forge 1.20.1 build exist, what does it
need, and what is its licence* — which is exactly the scope *Visuals Spec §37* gives V0.

- **Reference modpack:** <https://modrinth.com/modpack/khaojee-enchanted-visuals>
- **Reference video:** <https://youtu.be/cxahj-PuLb0>
- **Swept:** 2026-08-27 · **all 34** of §3's inventory (24 in the first pass, 10 in #66)
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

## The ten §3 listed and §4 never bucketed (#66)

**V0 swept 24 of §3's 34.** It followed §4's ADOPT / PROTOTYPE / REJECT lists, and §4 does not
mention every project §3 inventories. These are the other ten. **The first sweep did not say it was
partial**, which is the defect being corrected here.

### §12 was right about Continuity — an earlier version of this file said otherwise (#68)

**This section previously claimed §12's premise was false.** It is not. Retracted here rather than
quietly edited, because it was committed and acted on.

A `continuity-3.0.0+1.20.1.forge.jar` does exist. Reading **only** that, I concluded Continuity had a
native Forge build and that §12's *"Do not add Fabric compatibility infrastructure only for
Continuity"* rested on a false assumption. It does not. The build declares two **required**
dependencies:

```
required  Aqlf1Shp  ->  Forgified Fabric API (forgified-fabric-api)
required  u58R1TMW  ->  Sinytra Connector (connector)
```

**It is Fabric code running through a bridge.** `loaders: ["forge"]` describes how it installs, not
what it is. Adopting Continuity would mean adding Connector plus Forgified Fabric API to a 107-mod
Forge pack, for connected textures. **§12's policy is exactly on point.**

### The rule that failed, stated where the next sweep will read it

**Never call a build native from its `loaders` field alone. Read the required dependencies.**

This repo already learned that: `cbc_firepower_components` was removed after a boot, because the
original sweep read only the range pointing at `create` and missed the one pointing at
`createbigcannons`. The compatibility matrix wrote it up as a rule, ADR 0004 applied it to Season 2
— and this sweep did not apply it here.

### Available on Forge 1.20.1, and never decided about

| Project | Slug | Version | Side | Licence | Status |
|---|---|---|---|---|---|
| Pufferfish's Biome Dither | `biome-dither` | `1.0.0` | **`client: unsupported` · `server: required`** | ⚠️ All Rights Reserved | **UNDECIDED** — the only server-side project in this inventory |
| Punchy! | `punchy` | `2.7d` | `client: required` · `server: unsupported` | ⚠️ All Rights Reserved | **UNDECIDED** |
| Better Biome Reblend | `better-biome-reblend` | `1.5.3` | — | LGPL-3.0-only | **SUPERSEDED** — §4 wrote *"Better Biome Blend / equivalent"*; we installed Better Biome **Blend**, a different project. Recorded so nobody re-finds it and assumes it was missed |

Dither being **server-side** is worth flagging: every other visual project here is client-only, so it
is the one entry in the whole inventory that a dedicated-server boot could actually test.

### Not mods — resource packs, or nothing at all

| Project | Slug | Reality | Licence |
|---|---|---|---|
| Connected Paths | `connected-paths` | resource pack (`minecraft`) | ⚠️ **CC-BY-NC-SA-4.0** — non-commercial **and** share-alike |
| Rainbow's Foliage | `rainbows-foliage-polytone` | resource pack, and a **Polytone** pack — useless unless Polytone is adopted first (§19, still PROTOTYPE) | ⚠️ All Rights Reserved |
| Just Expressions | `just-expressions` | resource pack | ⚠️ custom |
| Fresh Animations: Player Extension | `fresh-animations-player-extension` | resource pack — confirms §11's *OFF* decision was about the right kind of thing | ⚠️ All Rights Reserved |
| Client Backpack | `client-backpack` | **no 1.20.1 file at all** | CC-BY-NC-SA-4.0 |
| Connected Texture+ | — | **no Modrinth match.** Like Musgo: *unresolved*, not absent. **Do not guess a slug** | unknown |

**CC-BY-NC-SA on two of them is worth noticing** while #53 is open: `NC` is the only licence class in
this whole audit that restricts *commercial* use, and `SA` would propagate its terms to anything it
is combined with.

### A caveat about the search rule itself

The rule is *search by title, never compose a slug*. It held again — but it is **not infallible**.
Searching `Continuity connected textures` returned **More Connected Textures**, a different project,
as the top hit. The bare title `Continuity` found it immediately.

**So: search the bare title, and check `title` on the hit before trusting it.** An augmented query
can outrank the exact name, and the failure looks identical to "the project does not exist" — which
is precisely how `Musgo` and `Connected Texture+` are currently recorded, and why both stay
*unresolved* rather than *absent*.

### Decided (#74) — both were the only "available and undecided" rows, and neither is adopted

| Project | Decision | Reason |
|---|---|---|
| **Pufferfish's Biome Dither** | **DEFER past Alpha** | It is not a colour-blending mod. It **mutates surface blocks between biomes** — `server: required`, `client: unsupported`, which is what gives it away. `Better Biome Blend` already covers the *visual* seam, client-side and reversibly. Adding a second worldgen mutation before a persistent world exists collides with §33's own rule that worldgen be settled first, and with the Ecologics / Ice & Fire / oil-field geography already in play |
| **Punchy!** | **REJECT for Alpha** | Its 1.20.1 build is real. It adds first-person animation and in-hand physics — which is **the layer this pack already assigned**: *Visuals Spec §10* gives the player to `Smooth Player Animations + NEA`, and TaCZ owns first-person weapon handling. Two mods animating the same hands is a conflict surface bought for nothing |

**Dither's `server: required` is the interesting part.** It made it the only project in this whole
inventory a dedicated-server boot could have tested — the one case where this repo's single
verification tool would have applied. It is still deferred, because "we could test it" is not "we
want it".

Neither decision needs revisiting unless a client launch shows `Better Biome Blend` leaving seams
that only surface-block mixing fixes.

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
- **กวาดเมื่อ:** 2026-08-27 · **ครบทั้ง 34** ตัวใน inventory ของ §3 (24 ตัวในรอบแรก, 10 ตัวใน #66)
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

## สิบตัวที่ §3 ลงไว้และ §4 ไม่เคยจัดกลุ่ม (#66)

**V0 กวาดไป 24 จาก 34 ของ §3** มันเดินตามรายการ ADOPT / PROTOTYPE / REJECT ของ §4
และ §4 ไม่ได้เอ่ยถึงทุกโปรเจกต์ที่ §3 ลงไว้ นี่คืออีกสิบตัว **การกวาดรอบแรกไม่ได้บอกว่ามันไม่ครบ**
ซึ่งคือข้อบกพร่องที่กำลังแก้ตรงนี้

### §12 ถูกเรื่อง Continuity — ไฟล์นี้เวอร์ชันก่อนเขียนตรงข้าม (#68)

**หัวข้อนี้เคยอ้างว่าหลักการของ §12 ผิด** มันไม่ผิด ถอนคืนตรงนี้แทนที่จะแก้เงียบ ๆ
เพราะมันถูก commit ไปแล้วและถูกเอาไปใช้แล้ว

`continuity-3.0.0+1.20.1.forge.jar` มีอยู่จริง การอ่าน**แค่**สิ่งนั้นทำให้ผมสรุปว่า
Continuity มี native Forge build และหลักการของ §12 ตั้งอยู่บนสมมติฐานที่ผิด ซึ่งไม่จริง
build นั้นประกาศ dependency ที่ **บังคับ** สองตัว:

```
required  Aqlf1Shp  ->  Forgified Fabric API (forgified-fabric-api)
required  u58R1TMW  ->  Sinytra Connector (connector)
```

**มันคือโค้ด Fabric ที่วิ่งผ่าน bridge** `loaders: ["forge"]` อธิบายว่ามันติดตั้งยังไง
ไม่ได้อธิบายว่ามันคืออะไร การรับ Continuity มาแปลว่าต้องเพิ่ม Connector บวก Forgified Fabric API
เข้าไปใน pack Forge ที่มี 107 มอด เพียงเพื่อ connected texture **นโยบายของ §12 ตรงประเด็นเป๊ะ**

### กฎที่ล้มเหลว เขียนไว้ในที่ที่การกวาดครั้งหน้าจะอ่านเจอ

**ห้ามเรียก build ว่า native จากฟิลด์ `loaders` อย่างเดียว ให้อ่าน dependency ที่บังคับด้วย**

repo นี้เคยเรียนเรื่อนี้มาแล้ว: `cbc_firepower_components` ถูกถอดออกหลังจากการ boot
เพราะการกวาดครั้งแรกอ่านแค่ช่วงที่ชี้ไป `create` และพลาดช่วงที่ชี้ไป `createbigcannons`
compatibility matrix เขียนมันเป็นกฎ ADR 0004 เอาไปใช้กับ Season 2 —
และการกวาดครั้งนี้ก็ไม่ได้เอามาใช้ตรงนี้

### ใช้ได้บน Forge 1.20.1 และไม่เคยมีใครตัดสิน

| โปรเจกต์ | Slug | เวอร์ชัน | Side | สัญญาอนุญาต | สถานะ |
|---|---|---|---|---|---|
| Pufferfish's Biome Dither | `biome-dither` | `1.0.0` | **`client: unsupported` · `server: required`** | ⚠️ All Rights Reserved | **ยังไม่ตัดสิน** — เป็นโปรเจกต์ฝั่ง server ตัวเดียวใน inventory นี้ |
| Punchy! | `punchy` | `2.7d` | `client: required` · `server: unsupported` | ⚠️ All Rights Reserved | **ยังไม่ตัดสิน** |
| Better Biome Reblend | `better-biome-reblend` | `1.5.3` | — | LGPL-3.0-only | **ถูกแทนที่แล้ว** — §4 เขียนว่า *"Better Biome Blend / equivalent"* เราติดตั้ง Better Biome **Blend** ซึ่งเป็นคนละโปรเจกต์ บันทึกไว้เพื่อไม่ให้ใครไปเจอใหม่แล้วคิดว่าเราพลาด |

การที่ Dither เป็น **ฝั่ง server** ควรถูกเน้น: โปรเจกต์ภาพอื่นทุกตัวในนี้เป็น client อย่างเดียว
มันจึงเป็นรายการเดียวใน inventory ทั้งหมดที่การ boot dedicated server ทดสอบได้จริง

### ไม่ใช่มอด — เป็น resource pack หรือไม่มีอะไรเลย

| โปรเจกต์ | Slug | ความจริง | สัญญาอนุญาต |
|---|---|---|---|
| Connected Paths | `connected-paths` | resource pack (`minecraft`) | ⚠️ **CC-BY-NC-SA-4.0** — ห้ามเชิงพาณิชย์ **และ** ต้องเผยแพร่ต่อด้วยสัญญาเดียวกัน |
| Rainbow's Foliage | `rainbows-foliage-polytone` | resource pack และเป็น pack ของ **Polytone** — ไร้ประโยชน์ถ้าไม่รับ Polytone มาก่อน (§19 ยังเป็น PROTOTYPE) | ⚠️ All Rights Reserved |
| Just Expressions | `just-expressions` | resource pack | ⚠️ custom |
| Fresh Animations: Player Extension | `fresh-animations-player-extension` | resource pack — ยืนยันว่าการตัดสินใจ *ปิด* ของ §11 มองถูกประเภท | ⚠️ All Rights Reserved |
| Client Backpack | `client-backpack` | **ไม่มีไฟล์ 1.20.1 เลย** | CC-BY-NC-SA-4.0 |
| Connected Texture+ | — | **ไม่เจอบน Modrinth** เหมือน Musgo: *ยังหาไม่เจอ* ไม่ใช่ไม่มี **ห้ามเดา slug** | ไม่ทราบ |

**CC-BY-NC-SA บนสองตัวนั้นควรสังเกต** ในขณะที่ #53 ยังเปิดอยู่: `NC` เป็นสัญญาอนุญาตประเภทเดียว
ในการ audit ทั้งหมดที่จำกัดการใช้*เชิงพาณิชย์* และ `SA` จะแพร่เงื่อนไขของมันไปยังทุกอย่างที่เอามารวมด้วย

### ข้อควรระวังเกี่ยวกับกฎการค้นเอง

กฎคือ *ค้นจากชื่อ ห้ามประกอบ slug* มันยังใช้ได้ — แต่มัน **ไม่ได้ไร้ที่ติ**
การค้นด้วย `Continuity connected textures` ได้ **More Connected Textures** ซึ่งเป็นคนละโปรเจกต์
ขึ้นมาเป็นอันดับหนึ่ง พอค้นด้วยชื่อเปล่า ๆ ว่า `Continuity` ก็เจอทันที

**ดังนั้น: ค้นด้วยชื่อเปล่า ๆ และตรวจ `title` ของผลลัพธ์ก่อนเชื่อ** คำค้นที่เติมคำเข้าไป
อาจชนะชื่อที่ตรงเป๊ะได้ และความล้มเหลวแบบนั้นหน้าตาเหมือนกับ "โปรเจกต์นี้ไม่มีอยู่" เป๊ะ ๆ —
ซึ่งคือวิธีที่ `Musgo` กับ `Connected Texture+` ถูกบันทึกไว้ตอนนี้พอดี
และเป็นเหตุผลที่ทั้งคู่ยังเป็น *ยังหาไม่เจอ* ไม่ใช่ *ไม่มี*

### ตัดสินแล้ว (#74) — ทั้งคู่เป็นสองแถวเดียวที่ "ใช้ได้และยังไม่ตัดสิน" และไม่รับทั้งคู่

| โปรเจกต์ | การตัดสิน | เหตุผล |
|---|---|---|
| **Pufferfish's Biome Dither** | **เลื่อนออกไปหลัง Alpha** | มันไม่ใช่มอดไล่สี มัน **เปลี่ยนบล็อกพื้นผิวระหว่างชีวนิเวศ** — `server: required`, `client: unsupported` ซึ่งเป็นสิ่งที่ฟ้องตัวมันเอง `Better Biome Blend` ครอบคลุมรอยต่อเชิง*ภาพ*อยู่แล้ว ทำงานฝั่ง client และย้อนกลับได้ การเพิ่มการกลายพันธุ์ของ worldgen อีกก้อนก่อนจะมีโลกถาวรชนกับกฎของ §33 เองที่ว่า worldgen ต้องนิ่งก่อน และชนกับภูมิศาสตร์ของ Ecologics / Ice & Fire / แหล่งน้ำมันที่มีอยู่แล้ว |
| **Punchy!** | **ปฏิเสธสำหรับ Alpha** | build 1.20.1 ของมันมีจริง มันเพิ่มแอนิเมชันมุมมองบุคคลที่หนึ่งและฟิสิกส์ของของในมือ — ซึ่งเป็น**ชั้นที่ pack นี้มีเจ้าของแล้ว**: *Visuals Spec §10* ยกผู้เล่นให้ `Smooth Player Animations + NEA` และ TaCZ เป็นเจ้าของการถืออาวุธมุมมองบุคคลที่หนึ่ง การมีสองมอดขยับมือเดียวกันคือพื้นที่ขัดแย้งที่ซื้อมาโดยไม่ได้อะไร |

**`server: required` ของ Dither คือส่วนที่น่าสนใจ** มันทำให้ Dither เป็นโปรเจกต์เดียวใน inventory
ทั้งหมดนี้ที่การ boot dedicated server จะทดสอบได้ — กรณีเดียวที่เครื่องมือตรวจสอบชิ้นเดียวของ repo นี้
จะใช้ได้ และมันก็ยังถูกเลื่อนอยู่ดี เพราะ "เราทดสอบมันได้" ไม่เท่ากับ "เราอยากได้มัน"

ทั้งสองการตัดสินไม่ต้องทบทวนใหม่ เว้นแต่การเปิด client จะแสดงว่า `Better Biome Blend`
ทิ้งรอยต่อไว้ในแบบที่มีแต่การผสมบล็อกพื้นผิวเท่านั้นที่แก้ได้

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
