<!-- lang:en -->
# Visuals Spec — what is not in the pack, and why

**One row per project the Visuals Spec's §3 inventory names that this pack does not ship.** The
companion to `docs/khaojee-visual-reference.md`, which records what *was* swept; this one exists so
"why isn't X in?" has an answer that does not require re-deriving it.

**§3 lists 34 projects. 15 are in. 19 are not.** Every one of the 19 is below.

- **Swept:** 2026-08-27 · #52, #66, #74, #76
- **Method:** search by **bare title** through the Modrinth API, then read the version endpoint for a
  file that is both `forge` and `1.20.1`, then read that file's **required dependencies**. Never
  compose a slug; never call a build native from its `loaders` field alone.

## Blocked — cannot be installed on this platform (11)

### Fabric-only, or no 1.20.1 build (6)

| Project | Finding | Licence |
|---|---|---|
| Wakes | 1.20.1 exists — **fabric only** | GPL-3.0-only |
| Particular | 1.20.1 exists — **fabric only** | LGPL-3.0-only |
| Item Interactions | 1.20.1 exists — **fabric only** | LGPL-3.0-only |
| Presence Footsteps | 1.20.1 exists — **fabric/quilt only** | Polyform Shield 1.0 |
| Auditory Continued | 1.20.1 exists — **fabric/quilt only** | MIT |
| Tree Physics | **no 1.20.1 file at all**, any loader | All Rights Reserved |

§44 deferred these on a *compatibility-cost* argument. The measurement is stronger than the
argument: **there is nothing to install.** §41 forbids adding a Fabric bridge for visuals alone.

### Resource packs, not mods (5)

Fusion, EMF and ETF are the mods; these are content that would ride on them.

| Project | Finding | Licence |
|---|---|---|
| Fresh Animations | loader `minecraft` — needs EMF + ETF, both now installed | ⚠️ *see terms of use in description* |
| Fresh Animations: Player Extension | loader `minecraft` — §11 keeps it **OFF**; the player belongs to SPA + NEA | All Rights Reserved |
| 3D World Decorations | loader `minecraft` — §17 treats it as a mod; it is not | All Rights Reserved |
| Lushier Forests | loader `minecraft` | CC-BY-4.0 |
| Just Expressions | loader `minecraft` | custom |
| Connected Paths | loader `minecraft` | ⚠️ **CC-BY-NC-SA-4.0** |
| Rainbow's Foliage | loader `minecraft`, and a **Polytone** pack — Polytone is now installed, so this is unblocked as content | All Rights Reserved |

**CC-BY-NC-SA on Connected Paths is the only non-commercial licence anywhere in this audit**, and
`SA` would propagate its terms to whatever it is combined with. Worth knowing before it is picked up.

### No 1.20.1 build (1)

| Project | Finding | Licence |
|---|---|---|
| Client Backpack | **no 1.20.1 file at all** | CC-BY-NC-SA-4.0 |

**Particle Interactions** also has no 1.20.1 file on any loader. §43 lists it as a PROTOTYPE; there
is nothing to prototype, and it belongs in §44.

## Unresolved — not found, which is not the same as absent (2)

| Project | Finding |
|---|---|
| Musgo | **no Modrinth match.** CurseForge has no search API without a key |
| Connected Texture+ | **no Modrinth match.** Same |

**Do not guess a slug for either.** A guessed slug has pointed at the wrong project three times in
this repo — `smoothplayeranimations`, `create-industry` (a *modpack*, not TFMG), and `snow-imprints`
(whose title is *Soft Imprints*). And a bad *search* looks identical to "does not exist": querying
`Continuity connected textures` returned **More Connected Textures**, a different project, while the
bare title found it at once.

## Decided against — available, and not wanted (4)

| Project | Decision | Reason |
|---|---|---|
| **Continuity** | **replaced by Fusion** | Its `3.0.0+1.20.1.forge` build **requires Sinytra Connector and Forgified Fabric API** — Fabric code through a bridge. §12's policy is exactly on point. *An earlier version of this repo's docs claimed otherwise; retracted in #68.* |
| **Pufferfish's Biome Dither** | **deferred past Alpha** (#74) | Not colour blending — it **mutates surface blocks** (`server: required`). Better Biome Blend covers the visual seam client-side and reversibly |
| **Punchy!** | **rejected for Alpha** (#74) | First-person animation and in-hand physics, a layer §10 already assigned to SPA + NEA with TaCZ owning weapon handling |
| **Better Biome Reblend** | **superseded** | §4 wrote *"Better Biome Blend / equivalent"*; we installed Better Biome **Blend** (Unlicense). Different project. Recorded so nobody re-finds it and assumes it was missed |

## Installed but not yet decided about — the worldgen question (#76)

These **are** in the pack and are **not** blocked. They are listed here because installing them is
not the same as choosing them.

| Project | Version | Side |
|---|---|---|
| Biomes O' Plenty | `19.0.0.96` | `both` · ⚠️ All Rights Reserved |
| Regions Unexplored | `F-0.5.6+1.20.1` | `both` |
| TerraBlender | `3.0.1.10` | `both` — required by both of the above |
| Countered's Terrain Slabs | `4.0.2-beta` | `both` |
| Polytone | `1.20-3.5.26` | `client` |

> **⛔ Do not create a world you intend to keep.**
>
> §14 says *"Prefer one biome expansion unless testing proves both are worth the cost. Avoid
> kitchen-sink geography."* **Both are installed.** That is harmless only because no world has been
> generated — the moment one is, the choice is made for you.
>
> §15 wants multiple seeds compared across Base / BOP / RU / both, and §33 says worldgen must be
> settled **before** persistent play. **V8 picks one. Until then, test worlds only.**

They booted: `Done (9.084s)`, 83 recipes, 0 failed, **50 ERROR lines — the exact baseline, no new
error class**, with BOP, Regions Unexplored, TerraBlender and Terrain Slabs all loading server-side.

**That is real verification, and it is rare here.** Four of these six are server-side, so this repo's
only test tool actually applies to them — unlike every other mod in the visual layer, which is
`client` and therefore invisible to a dedicated-server boot.

## What none of this establishes

**That anything looks right.** §38's criteria are all client measurements. Nobody has launched one.
<!-- lang:end -->

<!-- lang:th -->
# Visuals Spec — อะไรที่ไม่ได้อยู่ใน pack และเพราะอะไร

**หนึ่งแถวต่อหนึ่งโปรเจกต์ที่ inventory §3 ของ Visuals Spec ระบุไว้แต่ pack นี้ไม่ได้ส่ง**
เป็นคู่หูของ `docs/khaojee-visual-reference.md` ซึ่งบันทึกสิ่งที่*ถูกกวาด*ไปแล้ว
ส่วนไฟล์นี้มีไว้ให้คำถาม "ทำไม X ไม่ได้อยู่ในนี้" มีคำตอบโดยไม่ต้องไปไล่หาใหม่

**§3 ลงไว้ 34 โปรเจกต์ อยู่ใน pack 15 ไม่อยู่ 19** ทั้ง 19 ตัวอยู่ด้านล่าง

- **กวาดเมื่อ:** 2026-08-27 · #52, #66, #74, #76
- **วิธี:** ค้นด้วย**ชื่อเปล่า ๆ** ผ่าน Modrinth API แล้วอ่าน version endpoint หาไฟล์ที่เป็นทั้ง `forge`
  และ `1.20.1` แล้วอ่าน **dependency ที่บังคับ** ของไฟล์นั้น ห้ามประกอบ slug เอง
  และห้ามเรียก build ว่า native จากฟิลด์ `loaders` อย่างเดียว

## ติด — ติดตั้งบนแพลตฟอร์มนี้ไม่ได้ (11)

### Fabric เท่านั้น หรือไม่มี build 1.20.1 (6)

| โปรเจกต์ | สิ่งที่พบ | สัญญาอนุญาต |
|---|---|---|
| Wakes | มี 1.20.1 — **fabric เท่านั้น** | GPL-3.0-only |
| Particular | มี 1.20.1 — **fabric เท่านั้น** | LGPL-3.0-only |
| Item Interactions | มี 1.20.1 — **fabric เท่านั้น** | LGPL-3.0-only |
| Presence Footsteps | มี 1.20.1 — **fabric/quilt เท่านั้น** | Polyform Shield 1.0 |
| Auditory Continued | มี 1.20.1 — **fabric/quilt เท่านั้น** | MIT |
| Tree Physics | **ไม่มีไฟล์ 1.20.1 เลย** ไม่ว่า loader ไหน | All Rights Reserved |

§44 เลื่อนพวกนี้ออกด้วยเหตุผลเรื่อง*ต้นทุนความเข้ากันได้* การวัดหนักแน่นกว่าเหตุผลนั้น:
**ไม่มีอะไรให้ติดตั้งเลย** และ §41 ห้ามเพิ่ม Fabric bridge เพื่องานภาพอย่างเดียว

### เป็น resource pack ไม่ใช่มอด (5)

Fusion, EMF และ ETF คือตัวมอด ส่วนพวกนี้คือเนื้อหาที่จะวิ่งบนมัน

| โปรเจกต์ | สิ่งที่พบ | สัญญาอนุญาต |
|---|---|---|
| Fresh Animations | loader `minecraft` — ต้องมี EMF + ETF ซึ่งตอนนี้ติดตั้งแล้วทั้งคู่ | ⚠️ *ดูเงื่อนไขการใช้งานในคำอธิบาย* |
| Fresh Animations: Player Extension | loader `minecraft` — §11 ให้ **ปิด** ไว้; ผู้เล่นเป็นของ SPA + NEA | All Rights Reserved |
| 3D World Decorations | loader `minecraft` — §17 ปฏิบัติกับมันเหมือนมอด แต่มันไม่ใช่ | All Rights Reserved |
| Lushier Forests | loader `minecraft` | CC-BY-4.0 |
| Just Expressions | loader `minecraft` | custom |
| Connected Paths | loader `minecraft` | ⚠️ **CC-BY-NC-SA-4.0** |
| Rainbow's Foliage | loader `minecraft` และเป็น pack ของ **Polytone** — ตอนนี้ Polytone ติดตั้งแล้ว มันจึงไม่ติดในฐานะเนื้อหา | All Rights Reserved |

**CC-BY-NC-SA ของ Connected Paths เป็นสัญญาอนุญาตเดียวใน audit ทั้งหมดที่ห้ามใช้เชิงพาณิชย์**
และ `SA` จะแพร่เงื่อนไขไปยังทุกอย่างที่เอามารวมด้วย ควรรู้ไว้ก่อนจะหยิบมันขึ้นมา

### ไม่มี build 1.20.1 (1)

| โปรเจกต์ | สิ่งที่พบ | สัญญาอนุญาต |
|---|---|---|
| Client Backpack | **ไม่มีไฟล์ 1.20.1 เลย** | CC-BY-NC-SA-4.0 |

**Particle Interactions** ก็ไม่มีไฟล์ 1.20.1 บน loader ไหนเลย §43 ลงมันไว้เป็น PROTOTYPE
แต่ไม่มีอะไรให้ prototype มันควรอยู่ใน §44

## ยังหาไม่เจอ — ซึ่งไม่เท่ากับไม่มี (2)

| โปรเจกต์ | สิ่งที่พบ |
|---|---|
| Musgo | **ไม่เจอบน Modrinth** CurseForge ไม่มี search API ถ้าไม่มีคีย์ |
| Connected Texture+ | **ไม่เจอบน Modrinth** เหมือนกัน |

**ห้ามเดา slug ให้ทั้งสองตัว** slug ที่เดาชี้ไปผิดโปรเจกต์ใน repo นี้มาแล้วสามครั้ง —
`smoothplayeranimations`, `create-industry` (เป็น *modpack* ไม่ใช่ TFMG) และ `snow-imprints`
(ที่ชื่อจริงคือ *Soft Imprints*) และการ*ค้น*ที่ไม่ดีหน้าตาเหมือน "ไม่มีอยู่" เป๊ะ ๆ:
การค้น `Continuity connected textures` ได้ **More Connected Textures** ซึ่งเป็นคนละโปรเจกต์
ส่วนการค้นชื่อเปล่า ๆ เจอทันที

## ตัดสินแล้วว่าไม่เอา — ใช้ได้ แต่ไม่ต้องการ (4)

| โปรเจกต์ | การตัดสิน | เหตุผล |
|---|---|---|
| **Continuity** | **แทนที่ด้วย Fusion** | build `3.0.0+1.20.1.forge` ของมัน **ต้องใช้ Sinytra Connector และ Forgified Fabric API** — เป็นโค้ด Fabric ผ่าน bridge นโยบายของ §12 ตรงประเด็นเป๊ะ *เอกสารของ repo นี้เวอร์ชันก่อนหน้าเคยอ้างตรงข้าม ถอนคืนใน #68 แล้ว* |
| **Pufferfish's Biome Dither** | **เลื่อนหลัง Alpha** (#74) | ไม่ใช่การไล่สี — มัน **เปลี่ยนบล็อกพื้นผิว** (`server: required`) Better Biome Blend ครอบคลุมรอยต่อเชิงภาพฝั่ง client และย้อนกลับได้ |
| **Punchy!** | **ปฏิเสธสำหรับ Alpha** (#74) | แอนิเมชันมุมมองบุคคลที่หนึ่งและฟิสิกส์ของในมือ เป็นชั้นที่ §10 ยกให้ SPA + NEA ไปแล้ว โดย TaCZ เป็นเจ้าของการถืออาวุธ |
| **Better Biome Reblend** | **ถูกแทนที่** | §4 เขียนว่า *"Better Biome Blend / equivalent"* เราติดตั้ง Better Biome **Blend** (Unlicense) เป็นคนละโปรเจกต์ บันทึกไว้เพื่อไม่ให้ใครไปเจอใหม่แล้วคิดว่าเราพลาด |

## ติดตั้งแล้วแต่ยังไม่ได้ตัดสิน — คำถามเรื่อง worldgen (#76)

พวกนี้ **อยู่** ใน pack แล้วและ **ไม่ได้** ติดอะไร ที่ลงไว้ตรงนี้เพราะการติดตั้งไม่เท่ากับการเลือก

| โปรเจกต์ | เวอร์ชัน | Side |
|---|---|---|
| Biomes O' Plenty | `19.0.0.96` | `both` · ⚠️ All Rights Reserved |
| Regions Unexplored | `F-0.5.6+1.20.1` | `both` |
| TerraBlender | `3.0.1.10` | `both` — สองตัวข้างบนต้องใช้ |
| Countered's Terrain Slabs | `4.0.2-beta` | `both` |
| Polytone | `1.20-3.5.26` | `client` |

> **⛔ อย่าสร้างโลกที่ตั้งใจจะเก็บไว้**
>
> §14 บอกว่า *"เลือกการขยายชีวนิเวศแค่ตัวเดียว เว้นแต่การทดสอบพิสูจน์ว่าคุ้มทั้งสอง
> เลี่ยงภูมิศาสตร์แบบครัวรวมมิตร"* **ตอนนี้ติดตั้งไว้ทั้งคู่** มันไม่มีผลเสียก็ต่อเมื่อยังไม่มีโลกถูกสร้าง —
> วินาทีที่มีโลกเกิดขึ้น การเลือกก็ถูกตัดสินไปแทนคุณแล้ว
>
> §15 ต้องการการเทียบหลาย seed ระหว่าง Base / BOP / RU / ทั้งคู่ และ §33 บอกว่า worldgen
> ต้องนิ่ง **ก่อน** เริ่มเล่นถาวร **V8 เป็นตัวเลือกหนึ่งตัว จนกว่าจะถึงตอนนั้น ใช้โลกทดสอบเท่านั้น**

มัน boot ผ่าน: `Done (9.084s)`, recipe 83, fail 0, **บรรทัด ERROR 50 บรรทัด — เท่าเส้นฐานพอดี
ไม่มี error ชนิดใหม่** โดย BOP, Regions Unexplored, TerraBlender และ Terrain Slabs
โหลดฝั่ง server ครบทุกตัว

**นั่นคือการตรวจสอบจริง และมันหายากในโปรเจกต์นี้** สี่ในหกตัวนี้เป็นฝั่ง server
เครื่องมือทดสอบชิ้นเดียวของ repo จึงใช้กับมันได้จริง ต่างจากมอดอื่นทุกตัวในชั้นภาพ
ซึ่งเป็น `client` และมองไม่เห็นจากการ boot dedicated server

## สิ่งที่ทั้งหมดนี้ไม่ได้พิสูจน์

**ว่าอะไรดูดี** เกณฑ์ของ §38 ทุกข้อเป็นการวัดบน client และยังไม่มีใครเปิดเลย
<!-- lang:end -->
