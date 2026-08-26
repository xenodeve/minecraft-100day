<!-- lang:en -->
# Side Classification

**Distribution Spec §11.** Which mods a server install needs, which a client install needs, and the
evidence for every one-sided call.

§11 ends with three words that decide how this file is written:

> แต่ต้อง inspect exact mod requirement ก่อน classify
> **Do not guess.**

So no mod is classified by what its name suggests. Every row below cites something a reviewer can
re-derive from the jar in about ten seconds.

## Why the reason is mandatory, not documentation

`scripts/validate/verify.mjs` **fails the ship gate** if a metafile carries `side = "client"` or
`side = "server"` and the slug is not named in this file. That is deliberate: the cost of the two
errors is wildly asymmetric.

- A mod wrongly left `both` costs a few megabytes on a server that ignores it.
- A mod wrongly marked `client` is **a server that does not start**, on a friend's machine, with a
  stack trace that names a missing class rather than a missing mod.

The gate cannot check whether the reason is *good*. It can check that someone was made to write one
down, which is the part that stops a guess from looking identical to an inspection.

## The census

| Side | Count |
|---|---|
| `both` | 89 |
| `client` | 16 |
| `server` | 2 |

## The decisive shared fact

**All twelve one-sided mods register nothing into a synced registry** — no
`assets/<id>/models/{item,block}`, no `data/<id>/{recipes,loot_tables,tags}`. That is what makes a
one-sided classification safe at all: a mod that registers a block or an item *must* be on both
sides or the registry sync fails on join, and none of these does.

Everything below is graded by how strong the evidence is on top of that.

---

## Tier 1 — the author declares it and **Forge enforces it**

`META-INF/mods.toml` supports `clientSideOnly = true`, and Forge skips the mod on a dedicated
server regardless of what the pack says. This is the strongest signal available: not an inference
about the mod, a statement by its author that the loader acts on.

| Mod | Slug | Declaration |
|---|---|---|
| Client Dynamic Light | `client-dynamic-light` | `clientSideOnly = true` |
| Entity Culling | `entityculling` | `clientSideOnly = true` |
| Not Enough Animations | `not-enough-animations` | `clientSideOnly = true` |

**`client-dynamic-light` was marked `both` and was wrong.** Forge would have skipped it on a server
anyway, so nothing was broken — but packwiz was downloading it into every server install, and the
compatibility matrix recorded its side as `—` while its *status* column already said `CORE CLIENT`.
Two records in this repo both knew, and neither was consulted.

Re-derive:

```
unzip -p mods/<jar> META-INF/mods.toml | grep clientSideOnly
```

## Tier 2 — the author declares indifference to the other side

`displayTest = "IGNORE_ALL_VERSION"` is the author saying the mod does not care what is on the
other end of the connection. Combined with zero registry content, that is a mod that can be absent
from a server without consequence.

| Mod | Slug | Declaration |
|---|---|---|
| Better Animations Collection | `better-animations-collection` | `displayTest = "IGNORE_ALL_VERSION"` |
| SmoothPlayerAnimations | `smoothplayeranimations` | `displayTest = "IGNORE_ALL_VERSION"` |
| Sound Physics Remastered | `sound-physics-remastered` | `displayTest = "IGNORE_ALL_VERSION"` |
| Subtle Effects | `subtle-effects` | `displayTest = "IGNORE_ALL_VERSION"` **and** `side = "CLIENT"` in its own `mods.toml`, with **zero** `data/` entries |

**`sound-physics-remastered` was marked `both` and was wrong.** The compatibility matrix had it as
`CLIENT` since the original sweep; the metafile disagreed and the metafile is what
`packwiz-installer -s server` actually reads. Found by cross-referencing the two records against
each other.

## Tier 3 — structural, plus boot evidence

No declaration, but two independent facts:

1. **Zero `data/` entries.** A mod with no datapack content contributes no recipes, tags, loot
   tables or worldgen — there is nothing for a server to load from it.
2. **Thirteen green dedicated-server boots** with these mods filtered out by
   `packwiz-installer -s server`. Not proof they are *unneeded*, but proof the server runs without
   them, which is the property that matters.

| Mod | Slug | `assets/` | `data/` | Role |
|---|---|---|---|---|
| AmbientSounds | `ambientsounds` | 229 | **0** | ambient audio |
| Embeddium | `embeddium` | 35 | **0** | rendering |
| ImmediatelyFast | `immediatelyfast` | 4 | **0** | rendering |
| Mouse Tweaks | `mouse-tweaks` | 0 | **0** | input handling |

Named in §11's own example list of client candidates: **Mouse Tweaks**, **Not Enough Animations**,
**Client Dynamic Light**.

## Server-side — nothing to draw

The mirror of Tier 3: zero `assets/`, so the mod cannot render anything a client would miss.

| Mod | Slug | `assets/` | `data/` | Role |
|---|---|---|---|---|
| In Control! | `in-control` | **0** | 5 | spawn director — pure server logic |
| ServerCore | `servercore` | **0** | 0 | server tick optimisation |

---

## The Visuals V1 layer (#56) — declared client, and checked anyway

*Visuals Spec §37* V1 added five client mods and two libraries. Modrinth's `client_side` /
`server_side` fields are what `packwiz mr add` derives `side` from, and for one of them that
derivation was **wrong for this pack**.

| Mod | Slug | Modrinth says | Jar says | Ours |
|---|---|---|---|---|
| Grassier Grass | `grassier-grass` | server `unsupported` | — | `client` |
| Better Biome Blend | `better-biome-blend` | server `unsupported` | — | `client` |
| Soft Imprints | `snow-imprints` | server `unsupported` | — | `client` |
| Fancy World Animations | `fwa` | server `unsupported` | — | `client` |
| **Subtle Effects** | `subtle-effects` | server **`optional`** → packwiz wrote `both` | `displayTest = "IGNORE_ALL_VERSION"`, `side = "CLIENT"`, **zero** `data/` | **`client`** |
| Particle Rain (V2, #58) | `particle-rain` | server `unsupported` | **`side = "CLIENT"`** in its own `mods.toml`, **zero** `data/`, 46 `assets/` | `client` |
| Fzzy Config | `fzzy-config` | server `required` | **`side = "BOTH"`** declared three times | `both` |
| Kotlin for Forge | `kotlin-for-forge` | server `required` | 0 `assets/`, language provider for Fzzy Config | `both` |

**`optional` is not `client`, and it is not `both` either** — it means the author will not stop you
either way. §11 says *"inspect exact mod requirement before classify — Do not guess"*, and the jar
answers what the API field cannot: Subtle Effects declares itself CLIENT and ships no datapack.

**The two libraries stay `both` on their authors' own declaration**, even though their only dependent
in this pack is now client-side. A library marked `client` that a future server mod needs is a server
that will not start; the failure is asymmetric, so the declaration wins.

**Kotlin for Forge was not in the plan.** It arrived as a transitive dependency of Fzzy Config, one
level deeper than the V0 sweep looked — the same second-order-dependency lesson
`cbc_firepower_components` taught, in a new place.

## What was checked and rejected

**`improved-mobs` stays `both`.** The compatibility matrix recorded it as `SERVER`, and that is
wrong: the jar ships `assets/improvedmobs/textures/gui/difficulty_bar.png` and a lang file. It draws
a HUD element, so a client without it loses that element. The matrix row is corrected rather than
the metafile.

That makes two errors found by cross-referencing the two records — **one in each direction**. Which
is the argument for keeping both records and checking them against each other, rather than
generating one from the other.

## The 87 `both`, and why none of them is investigated further

`both` is the safe default and it is where a mod belongs unless there is evidence to move it. Of the
87, most are libraries (Architectury, Balm, GeckoLib, Rhino, Cloth Config…) and the rest are
gameplay mods that plainly register content.

**No jar among the 99 declares `clientSideOnly` without already being marked `client`**, which is
the one automated sweep that could have promoted more of them. Anything further would be inference
from the mod's *name*, which is the thing §11 forbids.

## Re-deriving this whole table

```bash
# Tier 1
for j in build/.jar-cache/*.jar; do
  unzip -p "$j" META-INF/mods.toml 2>/dev/null | grep -q 'clientSideOnly *= *true' && echo "$j"
done

# Tier 2
for j in build/.jar-cache/*.jar; do
  unzip -p "$j" META-INF/mods.toml 2>/dev/null | grep -q 'IGNORE_ALL_VERSION' && echo "$j"
done

# Tier 3 / server: assets and data counts
unzip -l <jar> | grep -c 'assets/'
unzip -l <jar> | grep -c ' data/'
```

## What this does NOT establish

- **That the 87 `both` are all genuinely needed on both sides.** Some are certainly client-only and
  simply do not declare it. Moving them needs evidence, and none is available without a client.
- **That a `client` mod is unneeded rather than merely absent.** Thirteen green boots prove the
  server runs without them. A mod could still be one whose absence a *player* would notice on a
  server, which is a different question and not one a dedicated server can answer.
- **Anything about the four API-blocked mods on a real install.** `takkit`,
  `flashier-flashlights`, `client-dynamic-light` and `player-microchip` are excluded from the test
  pack, so their side classifications have never been exercised by a boot.
<!-- lang:end -->

<!-- lang:th -->
# Side Classification — การจำแนกฝั่ง

**Distribution Spec §11** มอดตัวไหนที่ server ต้องมี ตัวไหนที่ client ต้องมี และหลักฐานของทุกการ
ตัดสินว่าเป็นฝั่งเดียว

§11 จบด้วยสามคำที่กำหนดวิธีเขียนไฟล์นี้:

> แต่ต้อง inspect exact mod requirement ก่อน classify
> **Do not guess.**

ไม่มีมอดตัวไหนถูกจำแนกจากสิ่งที่ชื่อของมันบอกใบ้ ทุกแถวข้างล่างอ้างสิ่งที่ผู้ตรวจสอบหาซ้ำได้จาก jar
ในเวลาราวสิบวินาที

## ทำไมเหตุผลถึงบังคับ ไม่ใช่แค่เอกสาร

`scripts/validate/verify.mjs` **ทำให้ ship gate ล้มเหลว** ถ้า metafile มี `side = "client"` หรือ
`side = "server"` แล้ว slug ไม่ถูกระบุในไฟล์นี้ นั่นตั้งใจ เพราะราคาของความผิดสองแบบต่างกันมหาศาล

- มอดที่ถูกทิ้งไว้เป็น `both` ผิด ๆ เสียพื้นที่ไม่กี่เมกะไบต์บน server ที่ไม่สนใจมัน
- มอดที่ถูกทำเครื่องหมาย `client` ผิด ๆ คือ **server ที่ start ไม่ขึ้น** บนเครื่องของเพื่อน
  พร้อม stack trace ที่บอกชื่อคลาสที่หายไป ไม่ใช่ชื่อมอดที่หายไป

gate ตรวจไม่ได้ว่าเหตุผล*ดี*หรือเปล่า แต่มันตรวจได้ว่ามีคนถูกบังคับให้เขียนมันลงมา ซึ่งเป็นส่วนที่
หยุดไม่ให้การเดาดูเหมือนการตรวจสอบ

## สำมะโน

| ฝั่ง | จำนวน |
|---|---|
| `both` | 89 |
| `client` | 16 |
| `server` | 2 |

## ข้อเท็จจริงร่วมที่ชี้ขาด

**มอดฝั่งเดียวทั้งสิบสองตัวไม่ลงทะเบียนอะไรเข้า registry ที่ sync กันเลย** — ไม่มี
`assets/<id>/models/{item,block}` ไม่มี `data/<id>/{recipes,loot_tables,tags}` นั่นคือสิ่งที่ทำให้
การจำแนกเป็นฝั่งเดียวปลอดภัยตั้งแต่แรก: มอดที่ลงทะเบียนบล็อกหรือไอเทม *ต้อง* อยู่ทั้งสองฝั่ง
ไม่งั้น registry sync จะพังตอน join และไม่มีตัวไหนในนี้ทำแบบนั้น

ทุกอย่างข้างล่างถูกจัดชั้นตามความแข็งแรงของหลักฐานที่ทับอยู่บนข้อนั้น

---

## ชั้นที่ 1 — ผู้เขียนประกาศเอง และ **Forge บังคับให้**

`META-INF/mods.toml` รองรับ `clientSideOnly = true` และ Forge จะข้ามมอดนั้นบน dedicated server
ไม่ว่า pack จะบอกอะไร นี่คือสัญญาณที่แข็งที่สุดที่มี: ไม่ใช่การอนุมานเกี่ยวกับมอด แต่เป็นคำแถลง
ของผู้เขียนที่ loader ลงมือทำตาม

| มอด | Slug | คำประกาศ |
|---|---|---|
| Client Dynamic Light | `client-dynamic-light` | `clientSideOnly = true` |
| Entity Culling | `entityculling` | `clientSideOnly = true` |
| Not Enough Animations | `not-enough-animations` | `clientSideOnly = true` |

**`client-dynamic-light` เคยถูกทำเครื่องหมายเป็น `both` และมันผิด** Forge จะข้ามมันบน server
อยู่แล้ว จึงไม่มีอะไรพัง — แต่ packwiz ดาวน์โหลดมันเข้าไปในทุก server install และ compatibility
matrix บันทึกฝั่งของมันเป็น `—` ขณะที่คอลัมน์ *status* เขียนว่า `CORE CLIENT` ไว้แล้ว
บันทึกสองอันใน repo นี้รู้ทั้งคู่ และไม่มีอันไหนถูกเปิดดู

หาซ้ำ:

```
unzip -p mods/<jar> META-INF/mods.toml | grep clientSideOnly
```

## ชั้นที่ 2 — ผู้เขียนประกาศว่าไม่สนใจอีกฝั่ง

`displayTest = "IGNORE_ALL_VERSION"` คือผู้เขียนบอกว่ามอดไม่สนใจว่าอีกปลายของการเชื่อมต่อมีอะไร
เมื่อรวมกับการไม่มีเนื้อหา registry เลย นั่นคือมอดที่หายไปจาก server ได้โดยไม่มีผลอะไร

| มอด | Slug | คำประกาศ |
|---|---|---|
| Better Animations Collection | `better-animations-collection` | `displayTest = "IGNORE_ALL_VERSION"` |
| SmoothPlayerAnimations | `smoothplayeranimations` | `displayTest = "IGNORE_ALL_VERSION"` |
| Sound Physics Remastered | `sound-physics-remastered` | `displayTest = "IGNORE_ALL_VERSION"` |

**`sound-physics-remastered` เคยถูกทำเครื่องหมายเป็น `both` และมันผิด** compatibility matrix
บันทึกมันเป็น `CLIENT` มาตั้งแต่การกวาดครั้งแรก metafile ไม่ตรงกัน และ metafile คือสิ่งที่
`packwiz-installer -s server` อ่านจริง เจอด้วยการเอาบันทึกสองอันมาชนกัน

## ชั้นที่ 3 — เชิงโครงสร้าง บวกหลักฐานจากการ boot

ไม่มีคำประกาศ แต่มีข้อเท็จจริงอิสระสองข้อ:

1. **ไม่มี `data/` เลย** มอดที่ไม่มีเนื้อหา datapack ไม่ให้ recipe, tag, loot table หรือ worldgen
   อะไรเลย — ไม่มีอะไรให้ server โหลดจากมัน
2. **การ boot dedicated server เขียวสิบสามครั้ง** โดยมอดเหล่านี้ถูกกรองออกด้วย
   `packwiz-installer -s server` ไม่ใช่การพิสูจน์ว่ามัน*ไม่จำเป็น* แต่พิสูจน์ว่า server รันได้
   โดยไม่มีมัน ซึ่งเป็นคุณสมบัติที่สำคัญ

| มอด | Slug | `assets/` | `data/` | บทบาท |
|---|---|---|---|---|
| AmbientSounds | `ambientsounds` | 229 | **0** | เสียงบรรยากาศ |
| Embeddium | `embeddium` | 35 | **0** | การเรนเดอร์ |
| ImmediatelyFast | `immediatelyfast` | 4 | **0** | การเรนเดอร์ |
| Mouse Tweaks | `mouse-tweaks` | 0 | **0** | การจัดการอินพุต |

ที่ §11 ระบุชื่อไว้เองในรายการตัวอย่างของ client candidate: **Mouse Tweaks**,
**Not Enough Animations**, **Client Dynamic Light**

## ฝั่ง server — ไม่มีอะไรให้วาด

ภาพสะท้อนของชั้นที่ 3: ไม่มี `assets/` เลย มอดจึงเรนเดอร์อะไรที่ client จะพลาดไม่ได้

| มอด | Slug | `assets/` | `data/` | บทบาท |
|---|---|---|---|---|
| In Control! | `in-control` | **0** | 5 | spawn director — ตรรกะฝั่ง server ล้วน |
| ServerCore | `servercore` | **0** | 0 | การปรับ tick ของ server |

---

## สิ่งที่ตรวจแล้วปฏิเสธ

**`improved-mobs` คงเป็น `both`** compatibility matrix บันทึกมันเป็น `SERVER` และนั่นผิด: jar
แจก `assets/improvedmobs/textures/gui/difficulty_bar.png` และไฟล์ lang มาด้วย มันวาด HUD
ดังนั้น client ที่ไม่มีมันจะเสียองค์ประกอบนั้นไป แถวใน matrix ถูกแก้ ไม่ใช่ metafile

นั่นทำให้เจอความผิดพลาดสองข้อจากการชนบันทึกสองอัน — **ข้อละทิศทาง** ซึ่งคือเหตุผลที่ควรเก็บบันทึก
ทั้งสองอันไว้และเอามาตรวจกัน แทนที่จะสร้างอันหนึ่งจากอีกอัน

## 87 ตัวที่เป็น `both` และทำไมไม่มีตัวไหนถูกสืบต่อ

`both` คือค่าปริยายที่ปลอดภัย และเป็นที่ของมอดจนกว่าจะมีหลักฐานให้ย้าย ในจำนวน 87 ตัว ส่วนใหญ่
เป็นไลบรารี (Architectury, Balm, GeckoLib, Rhino, Cloth Config…) ที่เหลือเป็นมอด gameplay
ที่ลงทะเบียนเนื้อหาอย่างชัดเจน

**ไม่มี jar ตัวไหนใน 99 ตัวที่ประกาศ `clientSideOnly` โดยยังไม่ได้ถูกทำเครื่องหมายเป็น `client`**
ซึ่งเป็นการกวาดอัตโนมัติอย่างเดียวที่จะเลื่อนชั้นเพิ่มได้ อะไรที่มากกว่านั้นคือการอนุมานจาก*ชื่อ*มอด
ซึ่งเป็นสิ่งที่ §11 ห้าม

## การหาตารางนี้ซ้ำทั้งหมด

```bash
# ชั้นที่ 1
for j in build/.jar-cache/*.jar; do
  unzip -p "$j" META-INF/mods.toml 2>/dev/null | grep -q 'clientSideOnly *= *true' && echo "$j"
done

# ชั้นที่ 2
for j in build/.jar-cache/*.jar; do
  unzip -p "$j" META-INF/mods.toml 2>/dev/null | grep -q 'IGNORE_ALL_VERSION' && echo "$j"
done

# ชั้นที่ 3 / server: นับ assets และ data
unzip -l <jar> | grep -c 'assets/'
unzip -l <jar> | grep -c ' data/'
```

## สิ่งที่ไฟล์นี้**ไม่ได้**ยืนยัน

- **ว่า 87 ตัวที่เป็น `both` จำเป็นทั้งสองฝั่งจริง** บางตัวเป็น client-only แน่ ๆ แต่ไม่ประกาศ
  การย้ายมันต้องมีหลักฐาน และไม่มีหลักฐานให้ได้โดยไม่มี client
- **ว่ามอด `client` ไม่จำเป็น มากกว่าแค่ไม่อยู่** การ boot เขียวสิบสามครั้งพิสูจน์ว่า server
  รันได้โดยไม่มีมัน มอดตัวหนึ่งอาจยังเป็นตัวที่*ผู้เล่น*จะสังเกตเห็นว่าหายไปบน server ได้
  ซึ่งเป็นคนละคำถาม และไม่ใช่คำถามที่ dedicated server ตอบได้
- **อะไรก็ตามเกี่ยวกับมอดสี่ตัวที่ถูกบล็อกจาก API บนการติดตั้งจริง** `takkit`,
  `flashier-flashlights`, `client-dynamic-light` และ `player-microchip` ถูกตัดออกจาก test pack
  การจำแนกฝั่งของพวกมันจึงไม่เคยถูกใช้งานจริงในการ boot
<!-- lang:end -->
