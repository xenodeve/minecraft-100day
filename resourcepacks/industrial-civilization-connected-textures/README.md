<!-- lang:en -->
# Industrial Civilization — connected textures

Pack-owned connected textures for Fusion. **This is Visuals Spec V3's answer to "which resource
pack?" — the answer is "ours", so the licence question in #53 does not grow.**

## Status: scaffolded, and it does nothing yet

**Read this before assuming the pack works.** The sheets exist and the metadata is correct, but the
textures live under the namespace `ics_ct`, and **nothing in the game references that namespace.**
Fusion only acts on a texture that some block actually uses.

To make a sheet take effect, it has to sit at the path of a block texture it replaces — for example
`assets/minecraft/textures/block/glass.png`, or a Create/Immersive Engineering block path. **That
mapping is an art-direction decision** (which blocks should read as connected, and whether our art
is better than what the mod already ships) and it has not been made.

So: the format is solved and verified, the art is placeholder, and **the block mapping is the
remaining work**. This file exists so nobody looks at four PNGs and concludes V3 is finished.

## The format, verified from source — not from memory

Fusion ships **no example** in its jar, and a wrong definition **fails silently** — exactly the trap
`Obsidian-minecraft-100day/config-and-kubejs-fail-open.md` describes. Everything below was read out
of Fusion's own repository:

**`json_schemas/fusion-texture-metadata.json`** gives the wrapper and the allowed values:

```json
{
  "fusion": {
    "type": "connecting",
    "layout": "simple",
    "render_type": "cutout"
  }
}
```

| Key | Allowed | Default |
|---|---|---|
| `type` | `connecting` · `scrolling` | — |
| `layout` | `compact` · `full` · `horizontal` · `simple` · `vertical` | `full` |
| `render_type` | `cutout` · `opaque` · `translucent` | `opaque` |

The file is `<texture>.png.mcmeta`, beside the PNG, per Minecraft's normal metadata convention.

**`SimpleLayoutHandler.java`** gives the sheet size: its constructor is `super(4, 4, 4)`, so the
`simple` layout is a **4×4 tile grid** — 64×64 px at 16px tiles.

### The tile mapping, and why it was read rather than inferred

`SimpleLayoutHandler.getTilePos` maps a set of connected sides to a tile. A first version of
`scripts/build/generate-ct-textures.py` **guessed** that mapping and got **5 of 16 entries wrong** —
including all four "three sides connected" cases and the fully-connected centre tile.

Wrong tiles do not error. They render subtly wrong borders forever. The table in the generator is now
transcribed from the source, with the source's own comments preserved.

## What is here

| File | Layout | Render type |
|---|---|---|
| `factory_glass.png` | `simple` | `cutout` |
| `control_room_window.png` | `simple` | `cutout` |
| `station_glass.png` | `simple` | `cutout` |
| `industrial_panel.png` | `simple` | `opaque` |

Regenerate with `python scripts/build/generate-ct-textures.py`.

**The art is placeholder** — flat fills with a frame and a mullion, generated procedurally. It is
geometry that is correct, not art that is good. Nobody has seen it rendered, because nobody has
launched a client.

## Why our own pack rather than a third-party one

*Visuals Spec §12* says *"Fusion + compatible connected-texture resource pack"* and never names the
pack. Picking a third-party one would have meant adding another licence to an audit whose central
question — whether this pack may redistribute other people's files at all — is still open (#53).
**Pack-owned assets have no such question.**

*Visuals Spec §35* singles out connected-texture packs as the category most likely to forbid
redistribution. Writing our own is the cheapest way past that, and it is also the only way to get
textures that match this pack's specific subjects: factory glass, control rooms, station windows,
industrial panels.
<!-- lang:end -->

<!-- lang:th -->
# Industrial Civilization — connected textures

connected texture ที่ pack เป็นเจ้าของเอง สำหรับ Fusion **นี่คือคำตอบของ V3 ต่อคำถาม
"จะใช้ resource pack ตัวไหน?" — คำตอบคือ "ของเราเอง" คำถามเรื่องสัญญาอนุญาตใน #53 จึงไม่โตขึ้น**

## สถานะ: วางโครงแล้ว และมันยังไม่ทำอะไรเลย

**อ่านตรงนี้ก่อนจะสรุปว่า pack ทำงาน** ไฟล์ sheet มีอยู่และ metadata ถูกต้อง แต่ texture
อยู่ใต้ namespace `ics_ct` และ **ไม่มีอะไรในเกมอ้างถึง namespace นั้น** Fusion จะทำงานก็ต่อเมื่อ
texture นั้นถูกบล็อกใดบล็อกหนึ่งใช้อยู่จริง

การจะทำให้ sheet มีผล มันต้องอยู่ที่ path ของ texture ของบล็อกที่มันจะแทนที่ — เช่น
`assets/minecraft/textures/block/glass.png` หรือ path ของบล็อกจาก Create/Immersive Engineering
**การจับคู่นั้นเป็นการตัดสินเชิงศิลป์** (บล็อกไหนควรอ่านออกว่าเชื่อมกัน และงานเราดีกว่าที่มอดนั้นแถมมาไหม)
และยังไม่มีใครตัดสิน

ดังนั้น: รูปแบบแก้จบและยืนยันแล้ว งานศิลป์เป็น placeholder และ **การจับคู่กับบล็อกคืองานที่เหลือ**
ไฟล์นี้มีอยู่เพื่อไม่ให้ใครเห็น PNG สี่ไฟล์แล้วสรุปว่า V3 เสร็จแล้ว

## รูปแบบ ยืนยันจาก source ไม่ใช่จากความจำ

Fusion **ไม่แถมตัวอย่าง**มาใน jar และการเขียน definition ผิดจะ **fail แบบเงียบ ๆ** —
กับดักเดียวกับที่ `Obsidian-minecraft-100day/config-and-kubejs-fail-open.md` อธิบายไว้เป๊ะ
ทุกอย่างข้างล่างอ่านมาจาก repository ของ Fusion เอง

**`json_schemas/fusion-texture-metadata.json`** ให้ตัวห่อหุ้มและค่าที่อนุญาต:

```json
{
  "fusion": {
    "type": "connecting",
    "layout": "simple",
    "render_type": "cutout"
  }
}
```

| คีย์ | ค่าที่อนุญาต | ค่าเริ่มต้น |
|---|---|---|
| `type` | `connecting` · `scrolling` | — |
| `layout` | `compact` · `full` · `horizontal` · `simple` · `vertical` | `full` |
| `render_type` | `cutout` · `opaque` · `translucent` | `opaque` |

ไฟล์คือ `<texture>.png.mcmeta` วางข้าง PNG ตามธรรมเนียม metadata ปกติของ Minecraft

**`SimpleLayoutHandler.java`** ให้ขนาด sheet: constructor ของมันคือ `super(4, 4, 4)`
layout `simple` จึงเป็นตาราง **4×4 ช่อง** — 64×64 พิกเซล ที่ช่องละ 16 พิกเซล

### การจับคู่ช่อง และทำไมถึงต้องอ่านแทนที่จะอนุมาน

`SimpleLayoutHandler.getTilePos` จับคู่ชุดของด้านที่เชื่อมกันเข้ากับช่อง เวอร์ชันแรกของ
`scripts/build/generate-ct-textures.py` **เดา**การจับคู่นั้นและผิดไป **5 จาก 16 รายการ** —
รวมทั้งกรณี "เชื่อมสามด้าน" ทั้งสี่กรณี และช่องกลางที่เชื่อมครบทุกด้าน

ช่องที่ผิดไม่ทำให้เกิด error มันจะเรนเดอร์ขอบที่ผิดแบบแนบเนียนไปตลอด ตอนนี้ตารางใน generator
ถอดมาจาก source พร้อมคอมเมนต์ของ source เอง

## ในนี้มีอะไร

| ไฟล์ | Layout | Render type |
|---|---|---|
| `factory_glass.png` | `simple` | `cutout` |
| `control_room_window.png` | `simple` | `cutout` |
| `station_glass.png` | `simple` | `cutout` |
| `industrial_panel.png` | `simple` | `opaque` |

สร้างใหม่ด้วย `python scripts/build/generate-ct-textures.py`

**งานศิลป์เป็น placeholder** — สีเรียบ ๆ พร้อมกรอบและเส้นแบ่ง สร้างด้วยโปรแกรม
มันคือเรขาคณิตที่ถูกต้อง ไม่ใช่งานศิลป์ที่ดี และยังไม่มีใครเห็นมันตอนเรนเดอร์
เพราะยังไม่มีใครเปิด client

## ทำไมต้องทำ pack เอง แทนที่จะใช้ของคนอื่น

*Visuals Spec §12* บอกว่า *"Fusion + connected-texture resource pack ที่เข้ากันได้"*
และไม่เคยระบุว่า pack ไหน การเลือกของบุคคลที่สามแปลว่าต้องเพิ่มสัญญาอนุญาตอีกฉบับเข้าไปใน audit
ที่คำถามหลักของมัน — ว่า pack นี้จะแจกจ่ายไฟล์ของคนอื่นได้หรือไม่ — ยังไม่มีคำตอบ (#53)
**asset ที่ pack เป็นเจ้าของเองไม่มีคำถามนั้น**

*Visuals Spec §35* แยก connected-texture pack ออกมาเป็นหมวดที่มีโอกาสห้ามแจกจ่ายซ้ำมากที่สุด
การเขียนเองคือทางที่ถูกที่สุดที่จะผ่านเรื่องนั้นไป และเป็นทางเดียวที่จะได้ texture
ที่ตรงกับหัวข้อเฉพาะของ pack นี้: กระจกโรงงาน ห้องควบคุม หน้าต่างสถานี แผงอุตสาหกรรม
<!-- lang:end -->
