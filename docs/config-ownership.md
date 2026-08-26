<!-- lang:en -->
# Config Ownership

**Distribution Spec §30.** Which config files the pack owns and may overwrite on update, and which
belong to the player and must never be touched.

§30's warning is the whole point:

> อย่า overwrite personal preferences โดยไม่จำเป็น

Getting this wrong does not break the pack. It destroys somebody's keybinds, and they find out at
the worst possible moment.

## The rule, in one line

**The pack owns exactly the files it ships. Everything else belongs to the player.**

That is not a convention someone has to remember — it is what `packwiz-installer` already does. It
writes the files listed in `index.toml` and touches nothing else. A config the pack does not ship is
a config the pack cannot overwrite, because it is not in the index to be written.

So the ownership map is a list of 39 files, and a statement about everything not on it.

## PACK CONTROLLED — 39 files

Overwritten on every update, on purpose. All of them encode balance, progression or content
decisions that the design documents specify; a local edit to any of them means the player is no
longer running the pack.

| Area | Files | What it decides |
|---|---|---|
| Threat director | `config/incontrol/spawn.json` | spawn density, the three-tier ladder, day windows (#27) |
| | `config/improvedmobs/common.toml` | the HP curve (#21) |
| | `config/iceandfire/iaf-common.json` | §9's hierarchy, §10's spawn-safe radius (#33) |
| | `config/naturalist.json` | wildlife spawn weights and the two removed duplicates (#35) |
| Horde | `config/hordes-common.toml` | pacing, the growth curve, `hordeSpawnMax` (#29) |
| | `config/hordes/**` (14 files) | the Tier I/II spawn tables, and the folder is ours because `data_version: -1` |
| Combat | `config/soundattract/guns.toml` | the §3.3 noise ladder (#28) |
| | `config/soundattract/raid.toml` | one flag that would break "gunfire attracts existing mobs" (#28) |
| Logistics | `config/carryon-common.toml` | the machine blacklist (#21) |
| Survival | `config/playerrevive.json` | bleedout and revive timings (#32) |
| Quests | `config/ftbquests/quests/**` (15 files) | the twelve-chapter campaign (#36) |
| Server defaults | `defaultconfigs/minecolonies-server.toml` | raid cadence (#33) |
| | `defaultconfigs/sophisticatedbackpacks-server.toml` | the stack-upgrade cap (#32) |

## USER PREFERENCE — everything else, by omission

Every other config a mod generates. The pack has never written them and never will:

- **Keybinds** — every mod's own client config
- **Audio** — AmbientSounds, Sound Physics Remastered, Simple Voice Chat volumes and device choice
- **HUD and visuals** — Jade placement, JEI layout, Embeddium's render settings, YACL screens
- **Performance** — render distance, particle limits, anything the player tuned for their machine

§30's own examples — HUD position, audio volume, visual settings, keybinds — are all in this
category, and all of them are safe for the structural reason above rather than because someone
remembered.

**The one thing that would break this** is shipping a config file that mixes both. `playerrevive.json`
is the closest: it carries `hasShaderEffect` and `shouldGlow` alongside the bleedout timings. Those
two are visual, and shipping the file overwrites them.

That is accepted deliberately — they are two booleans on a mechanic the pack tunes as a whole — but
it is the shape to watch for. If a future config needs both halves, packwiz's index supports
`preserve = true` on a file entry, which makes the installer skip a file that already exists locally.
Nothing uses it yet.

---

## The measurement that decides how drift is detected

**Every TOML config the pack ships differs from its index hash after a single launch. Every JSON one
is byte-identical.**

Measured on a server that had booted once:

| File | Repo | After one boot | |
|---|---|---|---|
| `config/improvedmobs/common.toml` | `a8364ac6a95a` | `4a45e508e6e6` | **drifted** |
| `config/carryon-common.toml` | `9549d1d5bbf5` | `0cf664da7703` | **drifted** |
| `config/hordes-common.toml` | `b4ed64668c93` | `1bcf977ee291` | **drifted** |
| `config/soundattract/guns.toml` | `8a7a6ae2a763` | `f0ff2c2bff25` | **drifted** |
| `config/naturalist.json` | `883bfe335f55` | `883bfe335f55` | same |
| `config/incontrol/spawn.json` | `852e9a7e1ebc` | `852e9a7e1ebc` | same |

**4 of 4 TOML drifted. 2 of 2 JSON did not.**

Forge owns `.toml` — it parses each file against the mod's `ForgeConfigSpec`, corrects it, and
rewrites it, stripping comments and normalising formatting. It never touches `.json`, because those
are read by each mod's own loader.

And the drift is **format only**. Comparing key/value pairs with comments and whitespace removed:

```
config/improvedmobs/common.toml -> VALUES IDENTICAL (drift is comments/format only)
config/soundattract/guns.toml   -> VALUES IDENTICAL
config/hordes-common.toml       -> VALUES IDENTICAL
config/carryon-common.toml      -> VALUES IDENTICAL
```

### What that means for §38's tool

**A hash-comparing drift detector would report every TOML config as drifted on every install.** It
would be wrong 100 % of the time on the files it most needs to check — which is precisely the gate
people learn to ignore.

So `scripts/validate/config-drift.mjs` compares **parsed key/value pairs**, not bytes. It reports a
value that changed and stays silent about a comment Forge deleted.

### And it means the comments never reach a player

Every `# PACK CONTROLLED` comment written into a `.toml` in this repo is deleted by Forge on the
player's first launch. The **values** survive; the **reasoning** does not.

That is why `config/incontrol/`, `config/soundattract/` and `config/hordes/` each carry a README
instead — repository documentation, kept out of the shipped pack by `.packwizignore`.
<!-- lang:end -->

<!-- lang:th -->
# Config Ownership — ความเป็นเจ้าของไฟล์ config

**Distribution Spec §30** ไฟล์ config ไหนที่ pack เป็นเจ้าของและเขียนทับได้ตอนอัปเดต และไฟล์ไหน
เป็นของผู้เล่นและห้ามแตะ

คำเตือนของ §30 คือประเด็นทั้งหมด:

> อย่า overwrite personal preferences โดยไม่จำเป็น

การทำพลาดตรงนี้ไม่ได้ทำให้ pack พัง แต่มันทำลายปุ่มลัดของใครบางคน และเขาจะรู้ตัวในจังหวะที่แย่ที่สุด

## กฎ ในบรรทัดเดียว

**pack เป็นเจ้าของเฉพาะไฟล์ที่มันส่งไป ที่เหลือทั้งหมดเป็นของผู้เล่น**

นั่นไม่ใช่ธรรมเนียมที่ใครต้องจำ — มันคือสิ่งที่ `packwiz-installer` ทำอยู่แล้ว มันเขียนไฟล์ที่อยู่ใน
`index.toml` และไม่แตะอย่างอื่นเลย config ที่ pack ไม่ได้ส่งไปคือ config ที่ pack เขียนทับไม่ได้
เพราะมันไม่ได้อยู่ใน index ให้เขียน

ผังความเป็นเจ้าของจึงเป็นรายการไฟล์ 39 ไฟล์ บวกคำแถลงเกี่ยวกับทุกอย่างที่ไม่อยู่ในรายการ

## PACK CONTROLLED — 39 ไฟล์

ถูกเขียนทับทุกครั้งที่อัปเดต โดยตั้งใจ ทั้งหมดเข้ารหัสการตัดสินใจเรื่องสมดุล progression หรือเนื้อหา
ที่เอกสารออกแบบระบุไว้ การแก้ไฟล์เหล่านี้ในเครื่องแปลว่าผู้เล่นไม่ได้เล่น pack นี้แล้ว

| ส่วน | ไฟล์ | ตัดสินอะไร |
|---|---|---|
| Threat director | `config/incontrol/spawn.json` | ความหนาแน่น spawn บันไดสามชั้น หน้าต่างวัน (#27) |
| | `config/improvedmobs/common.toml` | เส้นโค้ง HP (#21) |
| | `config/iceandfire/iaf-common.json` | ลำดับของ §9 รัศมีปลอดภัยของ §10 (#33) |
| | `config/naturalist.json` | น้ำหนัก spawn สัตว์ป่าและตัวซ้ำสองตัวที่ถอดออก (#35) |
| Horde | `config/hordes-common.toml` | จังหวะ เส้นโค้งการเติบโต `hordeSpawnMax` (#29) |
| | `config/hordes/**` (14 ไฟล์) | ตาราง spawn Tier I/II และโฟลเดอร์เป็นของเราเพราะ `data_version: -1` |
| Combat | `config/soundattract/guns.toml` | บันไดเสียงของ §3.3 (#28) |
| | `config/soundattract/raid.toml` | แฟล็กเดียวที่จะทำลาย "เสียงปืนดึง mob ที่มีอยู่แล้ว" (#28) |
| Logistics | `config/carryon-common.toml` | blacklist เครื่องจักร (#21) |
| Survival | `config/playerrevive.json` | เวลาเลือดไหลและเวลาชุบ (#32) |
| Quests | `config/ftbquests/quests/**` (15 ไฟล์) | แคมเปญสิบสองบท (#36) |
| Server defaults | `defaultconfigs/minecolonies-server.toml` | จังหวะ raid (#33) |
| | `defaultconfigs/sophisticatedbackpacks-server.toml` | เพดาน stack upgrade (#32) |

## USER PREFERENCE — ที่เหลือทั้งหมด โดยการไม่อยู่ในรายการ

config อื่นทุกไฟล์ที่มอดสร้างขึ้น pack ไม่เคยเขียนมันและจะไม่เขียน:

- **ปุ่มลัด** — client config ของทุกมอด
- **เสียง** — ระดับเสียงและการเลือกอุปกรณ์ของ AmbientSounds, Sound Physics Remastered, Simple Voice Chat
- **HUD และภาพ** — ตำแหน่ง Jade, เลย์เอาต์ JEI, ค่าเรนเดอร์ของ Embeddium, หน้าจอ YACL
- **ประสิทธิภาพ** — ระยะเรนเดอร์ ขีดจำกัดพาร์ทิเคิล อะไรก็ตามที่ผู้เล่นจูนให้เข้ากับเครื่องตัวเอง

ตัวอย่างของ §30 เอง — ตำแหน่ง HUD ระดับเสียง ค่าภาพ ปุ่มลัด — อยู่ในหมวดนี้ทั้งหมด และปลอดภัยด้วย
เหตุผลเชิงโครงสร้างข้างบน ไม่ใช่เพราะมีใครจำได้

**สิ่งเดียวที่จะทำลายกฎนี้** คือการส่งไฟล์ config ที่ผสมทั้งสองแบบ `playerrevive.json` ใกล้เคียงที่สุด:
มันมี `hasShaderEffect` และ `shouldGlow` อยู่ปนกับเวลาเลือดไหล สองตัวนั้นเป็นเรื่องภาพ และการส่งไฟล์
ไปก็เขียนทับมัน

นั่นถูกยอมรับโดยตั้งใจ — มันเป็นบูลีนสองตัวบนกลไกที่ pack จูนทั้งก้อน — แต่มันคือรูปแบบที่ต้องเฝ้าระวัง
ถ้า config ในอนาคตต้องการทั้งสองครึ่ง index ของ packwiz รองรับ `preserve = true` บนรายการไฟล์
ซึ่งทำให้ installer ข้ามไฟล์ที่มีอยู่ในเครื่องแล้ว ตอนนี้ยังไม่มีอะไรใช้มัน

---

## การวัดที่ตัดสินว่าจะตรวจ drift อย่างไร

**ไฟล์ TOML ทุกไฟล์ที่ pack ส่งไป ต่างจาก hash ใน index หลังเปิดเกมครั้งเดียว ส่วน JSON ทุกไฟล์
เหมือนกันทุกไบต์**

วัดบน server ที่ boot ไปหนึ่งครั้ง:

| ไฟล์ | repo | หลัง boot หนึ่งครั้ง | |
|---|---|---|---|
| `config/improvedmobs/common.toml` | `a8364ac6a95a` | `4a45e508e6e6` | **ต่าง** |
| `config/carryon-common.toml` | `9549d1d5bbf5` | `0cf664da7703` | **ต่าง** |
| `config/hordes-common.toml` | `b4ed64668c93` | `1bcf977ee291` | **ต่าง** |
| `config/soundattract/guns.toml` | `8a7a6ae2a763` | `f0ff2c2bff25` | **ต่าง** |
| `config/naturalist.json` | `883bfe335f55` | `883bfe335f55` | เหมือน |
| `config/incontrol/spawn.json` | `852e9a7e1ebc` | `852e9a7e1ebc` | เหมือน |

**TOML ต่าง 4 จาก 4 · JSON ไม่ต่างเลย 2 จาก 2**

Forge เป็นเจ้าของ `.toml` — มัน parse แต่ละไฟล์เทียบกับ `ForgeConfigSpec` ของมอด แก้ให้ถูก แล้วเขียนใหม่
โดยลบคอมเมนต์และจัดรูปแบบใหม่ มันไม่แตะ `.json` เลย เพราะไฟล์พวกนั้นถูกอ่านโดยตัวโหลดของแต่ละมอดเอง

และความต่างเป็นเรื่อง **รูปแบบล้วน ๆ** เมื่อเทียบคู่ key/value โดยตัดคอมเมนต์และช่องว่างออก:

```
config/improvedmobs/common.toml -> ค่าเหมือนกันทุกตัว (ต่างแค่คอมเมนต์/รูปแบบ)
config/soundattract/guns.toml   -> ค่าเหมือนกันทุกตัว
config/hordes-common.toml       -> ค่าเหมือนกันทุกตัว
config/carryon-common.toml      -> ค่าเหมือนกันทุกตัว
```

### นั่นแปลว่าอะไรกับเครื่องมือของ §38

**เครื่องมือตรวจ drift ที่เทียบ hash จะรายงานว่า config TOML ทุกไฟล์ drift ในทุกการติดตั้ง** มันจะผิด
100 % บนไฟล์ที่มันจำเป็นต้องตรวจมากที่สุด — ซึ่งคือ gate ที่คนเรียนรู้ที่จะเมินพอดี

`scripts/validate/config-drift.mjs` จึงเทียบ **คู่ key/value ที่ parse แล้ว** ไม่ใช่ไบต์
มันรายงานค่าที่เปลี่ยน และเงียบกับคอมเมนต์ที่ Forge ลบ

### และมันแปลว่าคอมเมนต์ไม่มีวันไปถึงผู้เล่น

คอมเมนต์ `# PACK CONTROLLED` ทุกบรรทัดที่เขียนลง `.toml` ใน repo นี้ถูก Forge ลบตอนผู้เล่นเปิดเกม
ครั้งแรก **ค่า** รอด **เหตุผล** ไม่รอด

นั่นคือเหตุผลที่ `config/incontrol/`, `config/soundattract/` และ `config/hordes/` แต่ละอันมี README
แทน — เป็นเอกสารของ repository ที่ `.packwizignore` กันไม่ให้ติดไปกับ pack ที่แจก
<!-- lang:end -->
