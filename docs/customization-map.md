<!-- lang:en -->
# Customization Map

**What the design documents said had to be built, and where each of it now stands.**

The five design documents tag 22 mods for custom work plus four things written from scratch. This
file was a plan; it is now a **status report**, because every row has been either implemented,
deliberately declined with a reason, or parked against a named blocker.

> **Nothing here is verified in game.** Every row below was proven on a **dedicated server boot** —
> configs parse, recipes register, quests load, tags resolve. A server cannot prove the pack is
> *balanced*, and §24 Phase 2 says so. Read `docs/combat-baseline.md` for what is derived versus
> what is measured.

## Scoreboard

| | Rows |
|---|---|
| ✅ Implemented | **20** |
| ⛔ Considered and declined, with reasons | **3** |
| 🟡 Parked against a named blocker | **2** |
| — Out of scope (Season 2) | **1** |

---

## Heavy — the rows that define the pack

| Mod | Status | What was done |
|---|---|---|
| **TaCZ** | ✅ **#30** | Recipes · Availability · Progression re-tiered onto the Create ladder, 54 guns. Damage settled at `1.0` with the reason: every rifle already lands in Rule 3's 2–4 band against a vanilla zombie. Attachments left alone — no document says what to change |
| **Attract to Sound** | ✅ **#28** | The §3.3 ladder, built on calibre. The config's "decibels" turned out to be **blocks** |
| **IceAndFire CE** | ✅ **#33** | §10's spawn-safe radius `1000 → 2250`; dragon roost/cave chances `0.5 → 0.2`; §9's hierarchy restored — the dragon went 500 → 1600 HP |
| **The Hordes** | ✅ **#29** | Tier I and II only, per §24 Phase 6. Pacing fitted to §23's own MSPT test ladder |
| **Enhanced AI** | ✅ **#21** | A **tag**, not a config — `kubejs/data/enhancedai/tags/blocks/miner_blacklist.json` |
| **Improved Mobs** | ✅ **#21** | `Health Increase Multiplier = 2.75`, capped at `2.5` — the stock `5.0` allowed twice the documented HP ceiling |
| **In Control!** | ✅ **#27** | Density ceiling, three-tier ladder from the mod's own spawn weights, day windows that fade rather than switch |
| **SecurityCraft** | ✅ **#32** | The reinforcer and the Block Pocket Manager moved onto the Create ladder. **No config setting lets a mob break a reinforced block** — the nerf had to be scarcity |
| **Immersive Engineering** | ⛔ **#32** | **Considered and declined.** No per-machine flag exists; a recipe gate would take §13's city grid with it; and the excavator is not Rule 5's "box that makes ore appear" — survey, 4096 FE/t, finite 38400 per chunk |
| **Carry On** | ✅ **#21** | Blacklist extended with the mod ids read out of the jars |

## Custom — scoped, smaller

| Mod | Status | What was done |
|---|---|---|
| **Create Big Cannons** | ⛔ **#33** | **Projectile damage is not in the config** — it is per-projectile data. The failure/fuze mechanics already carry the §35 half that is reachable |
| **Create: Diesel Generators** | ⛔ **#33** | The config is oil-chunk amounts; §18 already places oil at Day 100–150 and no number carries a design target |
| **Born in Chaos** | ✅ spawns **#27** · ⛔ stats **#33** | Spawns tiered. **Stats deliberately unchanged**: Rule 3 forbids fixing a band with a health multiplier, and armour, numbers and the Improved Mobs curve are the levers it names instead |
| **MineColonies** | ✅ **#33** | Raid cadence `14 → 24` nights. The Hordes fires every 12 — two systems on near-identical periods meant an attack every six nights, which is the `Crisis → Crisis → Crisis` §12 rejects |
| **Brimm Armors** | 🟡 **#32** | **Parked, blocker named.** §15 requires a *comparison* against TakKit; Brimm registers stats in code so the current values cannot be read, and its XML override format ships no example and fails open. Needs a client and JEI tooltips. **Narrowed by the server-pack boot:** Improved Mobs cannot read Brimm's defence values (`Unexpected armor type (HELMET) for this material`, 45 items), so no Brimm armour will ever be worn by a mob — whatever the comparison decides |
| **Sophisticated Backpacks** | ✅ **#32** | `stack_upgrades` `3 → 1`. Slot counts untouched on purpose — they scale linearly; the superlinear knob is the one that moved |
| **PlayerRevive** | ✅ **#32** | Bleedout 60 s → 120 s, revive 5 s → 10 s, revived health 1 → 3 hearts |
| **TACZ: Durability** | ✅ **#30** | `JamThreshold = 0.25` on every class, so a gun above 25 % durability **never** jams. Repair items follow the industrial ladder |
| **Create: New Age** | — | Season 2 only. Out of scope by the design document's own sequencing |
| **Player Microchip** (Base Mod) | ✅ names + recipes **#35** · 🟡 art | Re-themed to Tactical Position Beacon / Personnel Tracking Device / Beacon Programmer via an always-on asset override; recipes moved to §25's Industrial Electronics chain. **Textures parked** — §20 wants art, and inventing pixels from a spec paragraph is not a thing to do |

## Written from scratch

| Item | Status | What was done |
|---|---|---|
| **FTB Quests** | ✅ **#36** | Twelve chapters, 48 quests, objective-shaped. Verified: `Loaded 1 chapter groups, 12 chapters, 48 quests` |
| **Ammunition recipes** | ✅ **#31** | §8's Create chain **already existed** in `tacz_c`. The work was making it worth building: hand-loading yields a sixth for half again the materials |
| **JEI hide rules** | ✅ **#34** | Empty by design — nothing was removed — and now enforced by a ship-gate check rather than by memory |
| **Wildlife roster** | ✅ **#35** | `docs/wildlife-roster.md`, 55 entities, §21's categories, §20's duplicate audit. **No spawn weight changed** — W3 requires a measured population first |

---

## The numeric targets, and which ones are now met

These came from the documents. They are **design targets, not measurements** — see
`Obsidian-minecraft-100day/measure-before-you-write-a-number.md`.

| Target | Source | State |
|---|---|---|
| Mob HP ceiling: Day 1 ~20 · Day 100 ~28–32 · Day 200 ~35–40 · cap ~40–50 | Main §3.4 | ✅ **#21** — the multiplier derives exactly these |
| TTK bands: vanilla 2–4 · common 8–20 · elite 20–50 · large 50–150 · dragon hundreds | Main §3 Rule 3 | ✅ vanilla band verified · dragon band set at 178 rounds (**#33**) · modded bands **derived, not measured** |
| Ammunition: 100 rounds valuable · 1,000 needs a workshop · 10,000+ needs a plant | Main §3 Rule 4 | ✅ **#31** — 100 rounds of 9 mm went from 20 copper to ~190 |
| Dragon spawn-safe radius ~2000–2500 blocks | Main §10 | ✅ **#33** at 2250 — §10 still wants several seeds and a tape measure |
| Noise ladder: suppressed pistol < pistol < rifle < shotgun < HMG < cannon | Main §3.3 | ✅ **#28** — 8 < 40 < 88 < 112 < 120 < 176 blocks |
| Entity density: ambient → small critters → duplicate species → common passives | Wildlife Spec §18 | 🟡 the order is recorded; **no reduction applied**, W3 requires measurement |

## What is left, and it is all the same thing

Every remaining item needs a **client**:

- §24 **Phase 2** — the TTK matrix, measured rather than derived
- §24 **Phase 4** — MSPT under automatic fire, which decides the noise radii
- §23 — MSPT at 50 / 100 / 150 / 200 horde mobs, which decides `hordeSpawnMax`
- Wildlife **W3/W6/W7** — measured population, which decides every spawn weight
- **Brimm** — reading two armour sets off JEI tooltips
- ~~**Player Microchip textures** — art~~ — **placeholders shipped (#74)**; real art replaces them without touching anything else
- Crafting Spec **§5** — confirming JEI shows the active recipe for `tacz:ak47`, not the stale one
- Distribution Spec **§16** — the twelve-test release gate, explicitly not automatable
<!-- lang:end -->

<!-- lang:th -->
# Customization Map — แผนที่ของงานที่ต้อง custom

**สิ่งที่เอกสารออกแบบบอกว่าต้องสร้าง และตอนนี้แต่ละอย่างอยู่ตรงไหน**

เอกสารออกแบบทั้งห้าติดป้ายมอด 22 ตัวว่าต้อง custom บวกอีกสี่อย่างที่ต้องเขียนใหม่ทั้งหมด ไฟล์นี้เคยเป็น
แผน ตอนนี้มันเป็น **รายงานสถานะ** เพราะทุกแถวถูก implement แล้ว ถูกปฏิเสธพร้อมเหตุผล หรือถูกพัก
พร้อมตัวขวางที่ระบุชื่อได้

> **ไม่มีอะไรในนี้ถูกตรวจในเกม** ทุกแถวข้างล่างถูกพิสูจน์บน **การ boot dedicated server** — config
> parse ได้ recipe ลงทะเบียนได้ quest โหลดได้ tag แก้ไขได้ server พิสูจน์ไม่ได้ว่า pack *สมดุล*
> และ §24 Phase 2 ก็บอกไว้เอง อ่าน `docs/combat-baseline.md` เพื่อดูว่าอะไรอนุมานและอะไรวัดได้

## สรุปคะแนน

| | จำนวนแถว |
|---|---|
| ✅ ทำแล้ว | **20** |
| ⛔ พิจารณาแล้วปฏิเสธ พร้อมเหตุผล | **3** |
| 🟡 พักไว้ พร้อมตัวขวางที่ระบุชื่อได้ | **2** |
| — นอกขอบเขต (Season 2) | **1** |

---

## หนัก — แถวที่กำหนดตัวตนของ pack

| Mod | สถานะ | ทำอะไรไป |
|---|---|---|
| **TaCZ** | ✅ **#30** | Recipes · Availability · Progression จัดชั้นใหม่บนบันได Create ปืน 54 กระบอก Damage ปิดที่ `1.0` พร้อมเหตุผล: ไรเฟิลทุกกระบอกอยู่ในช่วง 2–4 ของ Rule 3 กับซอมบี้ vanilla อยู่แล้ว Attachments ไม่แตะ — ไม่มีเอกสารไหนบอกว่าต้องเปลี่ยนอะไร |
| **Attract to Sound** | ✅ **#28** | บันไดของ §3.3 สร้างจากขนาดกระสุน "เดซิเบล" ใน config กลายเป็น **บล็อก** |
| **IceAndFire CE** | ✅ **#33** | รัศมีปลอดภัยของ §10 `1000 → 2250` โอกาสเกิดรัง/ถ้ำมังกร `0.5 → 0.2` ลำดับของ §9 ถูกคืน — มังกรจาก 500 → 1600 HP |
| **The Hordes** | ✅ **#29** | Tier I และ II เท่านั้น ตาม §24 Phase 6 จังหวะฟิตกับบันไดทดสอบ MSPT ของ §23 เอง |
| **Enhanced AI** | ✅ **#21** | เป็น **tag** ไม่ใช่ config — `kubejs/data/enhancedai/tags/blocks/miner_blacklist.json` |
| **Improved Mobs** | ✅ **#21** | `Health Increase Multiplier = 2.75` เพดาน `2.5` — ค่าเดิม `5.0` ให้ HP สองเท่าของเพดานที่เอกสารระบุ |
| **In Control!** | ✅ **#27** | เพดานความหนาแน่น บันไดสามชั้นจากน้ำหนัก spawn ของมอดเอง หน้าต่างวันที่จางแทนที่จะสวิตช์ |
| **SecurityCraft** | ✅ **#32** | reinforcer และ Block Pocket Manager ย้ายขึ้นบันได Create **ไม่มีค่าตั้งไหนให้ mob ทำลาย reinforced block ได้** การ nerf จึงต้องเป็นความหายาก |
| **Immersive Engineering** | ⛔ **#32** | **พิจารณาแล้วปฏิเสธ** ไม่มีแฟล็กรายเครื่อง การ gate ด้วย recipe จะพากริดเมืองของ §13 ไปด้วย และ excavator ไม่ใช่ "กล่องที่ทำให้แร่โผล่" ของ Rule 5 — ต้องสำรวจ ใช้ 4096 FE/t และผลผลิตจำกัดที่ 38400 ต่อ chunk |
| **Carry On** | ✅ **#21** | blacklist ขยายด้วย mod id ที่อ่านจาก jar |

## Custom — ขอบเขตแคบกว่า

| Mod | สถานะ | ทำอะไรไป |
|---|---|---|
| **Create Big Cannons** | ⛔ **#33** | **ดาเมจกระสุนไม่ได้อยู่ใน config** มันเป็นข้อมูลรายกระสุน กลไกความล้มเหลว/ชนวนก็แบกครึ่งของ §35 ที่เอื้อมถึงอยู่แล้ว |
| **Create: Diesel Generators** | ⛔ **#33** | config เป็นเรื่องปริมาณน้ำมันต่อ chunk §18 วางน้ำมันไว้ที่ Day 100–150 แล้ว และไม่มีตัวเลขไหนมีเป้าหมายการออกแบบผูกอยู่ |
| **Born in Chaos** | ✅ spawn **#27** · ⛔ stats **#33** | spawn ถูกจัดชั้น **ค่าสถานะจงใจไม่เปลี่ยน**: Rule 3 ห้ามแก้ช่วงด้วยตัวคูณเลือด และเกราะ จำนวน กับเส้นโค้งของ Improved Mobs คือคันโยกที่มันระบุแทน |
| **MineColonies** | ✅ **#33** | จังหวะ raid `14 → 24` คืน The Hordes มาทุก 12 — สองระบบที่คาบใกล้กันแปลว่าถูกโจมตีทุกหกคืน ซึ่งคือ `Crisis → Crisis → Crisis` ที่ §12 ปฏิเสธ |
| **Brimm Armors** | 🟡 **#32** | **พักไว้ ระบุตัวขวางแล้ว** §15 ต้องการการ*เปรียบเทียบ*กับ TakKit; Brimm ลงทะเบียนค่าไว้ในโค้ด อ่านค่าปัจจุบันไม่ได้ และรูปแบบ override แบบ XML ของมันไม่แจกตัวอย่างมาและ fail-open ต้องใช้ client กับ tooltip ของ JEI. **แคบลงจาก boot ของ server pack:** Improved Mobs อ่านค่าป้องกันของ Brimm ไม่ได้ (`Unexpected armor type (HELMET) for this material` 45 ชิ้น) ดังนั้นจะไม่มีมอบตัวไหนสวมเกราะ Brimm เลย ไม่ว่าการเปรียบเทียบจะสรุปอย่างไร |
| **Sophisticated Backpacks** | ✅ **#32** | `stack_upgrades` `3 → 1` จำนวนช่องไม่แตะโดยตั้งใจ — มันโตเชิงเส้น ปุ่มที่โตเร็วกว่าคือปุ่มที่ถูกขยับ |
| **PlayerRevive** | ✅ **#32** | เลือดไหล 60 → 120 วิ ชุบ 5 → 10 วิ เลือดหลังชุบ 1 → 3 หัวใจ |
| **TACZ: Durability** | ✅ **#30** | `JamThreshold = 0.25` ทุกชั้น ปืนที่ความทนทานเหนือ 25 % **ไม่มีวัน**ติดขัด ไอเทมซ่อมไล่ตามบันไดอุตสาหกรรม |
| **Create: New Age** | — | Season 2 เท่านั้น นอกขอบเขตตามลำดับของเอกสารเอง |
| **Player Microchip** (Base Mod) | ✅ ชื่อ + recipe **#35** · 🟡 งานศิลป์ | re-theme เป็น Tactical Position Beacon / Personnel Tracking Device / Beacon Programmer ผ่าน asset override ที่เปิดตลอด recipe ย้ายไปสาย Industrial Electronics ของ §25 **เท็กซ์เจอร์พักไว้** — §20 ต้องการงานศิลป์ และการคิดพิกเซลจากย่อหน้าใน spec ไม่ใช่สิ่งที่ควรทำ |

## เขียนใหม่ทั้งหมด

| รายการ | สถานะ | ทำอะไรไป |
|---|---|---|
| **FTB Quests** | ✅ **#36** | สิบสองบท 48 เควสต์ รูป objective ตรวจแล้ว: `Loaded 1 chapter groups, 12 chapters, 48 quests` |
| **Recipe กระสุน** | ✅ **#31** | สาย Create ของ §8 **มีอยู่แล้ว** ใน `tacz_c` งานจริงคือทำให้มันคุ้มสร้าง: การอัดมือได้หนึ่งในหกโดยใช้วัสดุมากขึ้นครึ่งหนึ่ง |
| **กฎซ่อนของ JEI** | ✅ **#34** | ว่างโดยตั้งใจ — ไม่มีอะไรถูกลบ — และตอนนี้ถูกบังคับด้วยการตรวจใน ship gate แทนความจำ |
| **Wildlife roster** | ✅ **#35** | `docs/wildlife-roster.md` 55 เอนทิตี หมวดของ §21 การตรวจตัวซ้ำของ §20 **ไม่มีน้ำหนัก spawn ตัวไหนถูกเปลี่ยน** — W3 ต้องการประชากรที่วัดได้ก่อน |

---

## เป้าหมายที่เป็นตัวเลข และอันไหนบรรลุแล้ว

ค่าเหล่านี้มาจากเอกสาร มันคือ **เป้าหมายการออกแบบ ไม่ใช่การวัด** — ดู
`Obsidian-minecraft-100day/measure-before-you-write-a-number.md`

| เป้าหมาย | ต้นทาง | สถานะ |
|---|---|---|
| เพดาน HP: Day 1 ~20 · Day 100 ~28–32 · Day 200 ~35–40 · เพดาน ~40–50 | Main §3.4 | ✅ **#21** — ตัวคูณให้ค่าเหล่านี้พอดี |
| ช่วง TTK: vanilla 2–4 · ทั่วไป 8–20 · elite 20–50 · ตัวใหญ่ 50–150 · มังกรหลายร้อย | Main §3 Rule 3 | ✅ ช่วง vanilla ตรวจแล้ว · ช่วงมังกรตั้งที่ 178 นัด (**#33**) · ช่วง modded **อนุมาน ไม่ได้วัด** |
| กระสุน: 100 นัดมีค่า · 1,000 ต้องมีเวิร์กช็อป · 10,000+ ต้องมีโรงงาน | Main §3 Rule 4 | ✅ **#31** — 9 มม. 100 นัด จาก 20 ทองแดง เป็น ~190 |
| รัศมีปลอดภัยจากมังกร ~2000–2500 บล็อก | Main §10 | ✅ **#33** ที่ 2250 — §10 ยังต้องการหลาย seed และตลับเมตร |
| บันไดเสียง: suppressed pistol < pistol < rifle < shotgun < HMG < cannon | Main §3.3 | ✅ **#28** — 8 < 40 < 88 < 112 < 120 < 176 บล็อก |
| ลำดับความหนาแน่น: ambient → critter เล็ก → สปีชีส์ซ้ำ → passive ทั่วไป | Wildlife Spec §18 | 🟡 ลำดับถูกบันทึกแล้ว **ยังไม่มีการลด** W3 ต้องการการวัด |

## เหลืออะไร และทั้งหมดเป็นเรื่องเดียวกัน

ทุกอย่างที่เหลือต้องใช้ **client**:

- §24 **Phase 2** — ตาราง TTK ที่วัดจริง ไม่ใช่อนุมาน
- §24 **Phase 4** — MSPT ใต้การยิงรัว ซึ่งตัดสินรัศมีเสียง
- §23 — MSPT ที่ 50 / 100 / 150 / 200 mob ซึ่งตัดสิน `hordeSpawnMax`
- Wildlife **W3/W6/W7** — ประชากรที่วัดได้ ซึ่งตัดสินน้ำหนัก spawn ทุกตัว
- **Brimm** — อ่านค่าเกราะสองชุดจาก tooltip ของ JEI
- **เท็กซ์เจอร์ Player Microchip** — งานศิลป์
- Crafting Spec **§5** — ยืนยันว่า JEI แสดง recipe ที่ใช้งานอยู่ของ `tacz:ak47` ไม่ใช่ของเก่า
- Distribution Spec **§16** — release gate สิบสองข้อ ซึ่งระบุชัดว่าอัตโนมัติไม่ได้
<!-- lang:end -->
