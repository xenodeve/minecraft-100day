<!-- lang:en -->
# Customization Map

**What still has to be built for the pack to play the way it was designed.**

The five design documents already say which mods need custom work and what kind — 22 of them carry
a status tag, and several state concrete numeric targets. That map was spread across five files;
this is it in one place, with the source cited so nothing here has to be taken on trust.

> **Nothing in this document is implemented.** `config/`, `kubejs/`, `datapacks/` and `ftbquests/`
> do not exist in this repository. The importable pack is **93 mods at their default settings**.
> It runs. It does not yet play like the design.

## The blocker every row shares

§31 rule 11: *"Do not assume config keys from memory; inspect exact generated configs/docs."*

A mod's config file does not exist until the game has run once and written it. So every row below
is gated on the same thing — **launch the client, let the configs generate, then edit them**. That
is why this map is worth writing now and why none of it can be done yet.

The second constraint is §26: mods are tuned and verified in **small batches with a launch between
them**, never all at once.

---

## Heavy — the rows that define the pack

| Mod | Tag | What to change | Source |
|---|---|---|---|
| **TaCZ** | `HEAVY CUSTOM BALANCE` | Six axes, named explicitly: **Damage · Ammo cost · Recipes · Availability · Attachments · Progression** | Main §3.2 |
| **Attract to Sound** | `HEAVY CUSTOM` | The noise ladder: `suppressed pistol < pistol < rifle < shotgun < HMG < cannon`. Gunfire attracts **existing** mobs — it must not spawn them. Watch MSPT under automatic fire; coalesce events if profiling demands it | Main §3.3, §11 |
| **IceAndFire CE** | `HEAVY WORLDGEN CUSTOMIZATION` | Spawn-safe radius **~2000–2500 blocks**; roost and den separation far above default. Tune IceAndFire's own worldgen — **not** In Control | Main §3.4, §10 |
| **The Hordes** | `HEAVY CUSTOM WAVES` | Tier I–IV composition, and the shape `Calm → Tension → Crisis → Recovery`. Dragons are never Horde mobs. Build Tier I and II first | Main §3.4, §12, §24 Phase 6 |
| **Enhanced AI** | `HEAVY CONFIG` | ✅ **DONE (#21)** — it is a **tag**, not a config: `kubejs/data/enhancedai/tags/blocks/miner_blacklist.json`. Wood/dirt/cobble deliberately absent so they stay breachable | Main §3.4 |
| **Improved Mobs** | `HEAVY NERF FROM DEFAULT` | ✅ **DONE (#21)** — `Health Increase Multiplier = 2.75`, `Max Health Increase = 2.5` in `config/improvedmobs/common.toml`, derivation recorded in the file | Main §3.4 |
| **In Control!** | `HEAVY CUSTOM` | Spawn density, day-based threat tier, biome rules, distance rules, enemy restrictions | Main §3.4 |
| **SecurityCraft** | `HEAVY CUSTOM` | Disable or limit anything that makes a base unbreachable — reinforced blocks, sentries, mines | Main §3.10, §14 |
| **Immersive Engineering** | `HEAVY CUSTOM SCOPE` | It owns **electrical infrastructure**, not manufacturing. Disable or gate IE machinery that bypasses Create | Main §3.11 |
| **Carry On** | `HEAVY BLACKLIST` | ✅ **DONE (#21)** — most of it ships by default; appended `railways:*`, the three Create addons, `structurize:*`, `domum_ornamentum:*`, `sophisticatedbackpacks:*`, `sophisticatedcore:*` | Main §3.9 |

## Custom — scoped, smaller

| Mod | Tag | What to change | Source |
|---|---|---|---|
| Create Big Cannons | `CUSTOM BALANCE` | Cannon/artillery damage against the threat tiers | Main §3.1 |
| Create: Diesel Generators | `CUSTOM PROGRESSION` | Where diesel/oil sits on the progression curve | Main §3.1 |
| Born in Chaos | `CUSTOM SPAWN + STATS` | Spawn rules and per-tier stats; common → elite ladder | Main §3.4 |
| MineColonies | `CUSTOM RAID / BALANCE` | Tune raids so they are not event spam. Guards patrol, hold chokepoints, give early warning — they are **not** TaCZ rifle infantry | Main §3.5, §24 Phase 7 |
| Brimm Armors | `CUSTOM BALANCE` | Must not be "TakKit with a bigger number" — every tier needs a use case | Main §3.7, §15 |
| Sophisticated Backpacks | `CUSTOM CAPACITY` | Disable stack/slot upgrades that make warehouses and trains irrelevant | Main §3.7, §16 |
| PlayerRevive | `CUSTOM BLEEDOUT / REVIVE TIME` | Bleedout and revive timings | Main §3.9 |
| TACZ: Durability | `CUSTOM` | Guns need maintenance; jamming must not become an irritation | Main §3.2 |
| Create: New Age | `CUSTOM` | Season 2 only | Main §3.1 |
| Player Microchip | re-theme | Retheme as the tactical tracker — a resourcepack + KubeJS job, **not** a fork | Crafting Spec §17–29 |
| Base Mod | `CUSTOM AESTHETIC` · `CUSTOM RECIPE` | Aesthetic and recipe alignment | Crafting Spec |

## Written from scratch

| Item | Source | Note |
|---|---|---|
| **FTB Quests** | Main §3.6, §17 | `QUESTS WRITTEN FROM SCRATCH`. Twelve chapters, objective-shaped not checklist-shaped — *"Establish Industrial Production"*, not *"Craft Cogwheel"*. **§17 says explicitly: do this after gameplay is stable, not before balance** |
| **Ammunition recipes** | Main §8, §24 Phase 5 | Create Sequenced Assembly: brass sheet → form casing → insert projectile → propellant → crimp. Do **not** invent a failure chance before checking what the API actually supports |
| **JEI hide rules** | Crafting Spec §6 | Must stay in sync with every mod removal |
| **Wildlife roster** | Wildlife Spec §20 | `docs/wildlife-roster.md` — compare **behaviour**, not names, before any KEEP / REDUCE call |

---

## The numeric targets, carried over verbatim

These already exist in the documents. They are **design targets, not measurements** — see
`Obsidian-minecraft-100day/measure-before-you-write-a-number.md`.

**TTK bands** (Main §3 Rule 3) — vanilla mob 2–4 rifle rounds · common modded 8–20 · elite 20–50 ·
large 50–150+ · dragon hundreds, or heavy weapons preferred.

**Ammunition economy** (Main §3 Rule 4) — early: 100 rounds is valuable · mid: 1,000 requires a
workshop · late: 10,000+ requires an industrial plant.

**Mob HP ceiling** (Main §3.4) — Day 1 ~20 · Day 100 ~28–32 · Day 200 ~35–40 · cap ~40–50.

**Dragon distance** (Main §10) — spawn-safe ~2000–2500 blocks; real values require generating
several seeds and measuring.

**Entity density priority under load** (Wildlife Spec §18) — reduce in this order: ambient
decorative → small critters → duplicate species → common passives. Create, MineColonies and hostile
encounter design are cut **last**.

---

## Order of work

The main document's §24 already sequences this, and §26 forbids running ahead of it:

1. **Phase 2** — combat baseline, `docs/combat-baseline.md` TTK matrix. This is the next thing.
2. **Phase 3** — threat director (Enhanced AI, Improved Mobs, In Control)
3. **Phase 4** — sound system, with profiling
4. **Phase 5** — the ammunition economy in KubeJS
5. **Phase 6** — Horde Tier I and II only
6. **Phase 7 onward** — civilization, dragons, gear, city systems
7. **Phase 12** — FTB Quests, *after* mechanics are stable

**Nothing here is startable until a client launch produces the config files.**
<!-- lang:end -->

<!-- lang:th -->
# Customization Map — แผนที่ของงานที่ต้อง custom

**สิ่งที่ยังต้องสร้าง เพื่อให้ pack เล่นได้แบบที่ออกแบบไว้**

เอกสารออกแบบทั้งห้าไฟล์ระบุไว้แล้วว่ามอดตัวไหนต้อง custom และ custom แบบไหน — 22 ตัวมีป้ายสถานะ
และหลายตัวระบุเป้าหมายเป็นตัวเลขไว้ด้วย แผนที่นั้นเคยกระจายอยู่ห้าไฟล์ นี่คือฉบับรวมไว้ที่เดียว
พร้อมอ้างอิงต้นทาง เพื่อไม่ต้องเชื่ออะไรลอย ๆ

> **ไม่มีอะไรในเอกสารนี้ถูก implement แล้ว** `config/`, `kubejs/`, `datapacks/` และ `ftbquests/`
> ยังไม่มีใน repository นี้ pack ที่ import ได้ตอนนี้คือ **มอด 93 ตัวที่ค่าเริ่มต้นล้วน ๆ**
> มันรันได้ แต่ยังไม่ได้เล่นแบบที่ออกแบบ

## ตัวขวางที่ทุกแถวเจอเหมือนกัน

§31 ข้อ 11: *"Do not assume config keys from memory; inspect exact generated configs/docs."*

ไฟล์ config ของมอดจะยังไม่มีจนกว่าเกมจะรันหนึ่งครั้งแล้วเขียนมันออกมา ดังนั้นทุกแถวข้างล่าง
ติดที่เรื่องเดียวกัน — **เปิด client ให้ config ถูกสร้าง แล้วค่อยแก้** นี่คือเหตุผลที่แผนที่นี้ควรเขียน
ตอนนี้ และเหตุผลที่ยังทำอะไรไม่ได้สักข้อ

ข้อจำกัดที่สองคือ §26: มอดถูกจูนและตรวจสอบ**ทีละ batch เล็ก ๆ โดยมีการเปิดเกมคั่น** ไม่ใช่ทำรวดเดียว

---

## หนัก — แถวที่กำหนดตัวตนของ pack

| Mod | ป้าย | ต้องแก้อะไร | ต้นทาง |
|---|---|---|---|
| **TaCZ** | `HEAVY CUSTOM BALANCE` | หกแกน ระบุไว้ตรง ๆ: **Damage · Ammo cost · Recipes · Availability · Attachments · Progression** | Main §3.2 |
| **Attract to Sound** | `HEAVY CUSTOM` | บันไดเสียง: `suppressed pistol < pistol < rifle < shotgun < HMG < cannon` เสียงปืนดึง mob ที่**มีอยู่แล้ว** ห้าม spawn ตัวใหม่ ต้องเฝ้า MSPT ตอนยิงรัว และรวบ event ถ้าผลการ profile บอกให้ทำ | Main §3.3, §11 |
| **IceAndFire CE** | `HEAVY WORLDGEN CUSTOMIZATION` | รัศมีปลอดภัยจาก spawn **~2000–2500 บล็อก** ระยะห่างของ roost และถ้ำสูงกว่า default มาก ให้จูน worldgen ของ IceAndFire เอง **ไม่ใช่** In Control | Main §3.4, §10 |
| **The Hordes** | `HEAVY CUSTOM WAVES` | องค์ประกอบ Tier I–IV และรูปทรง `Calm → Tension → Crisis → Recovery` มังกรไม่เคยเป็น mob ของ Horde ทำ Tier I และ II ก่อน | Main §3.4, §12, §24 Phase 6 |
| **Enhanced AI** | `HEAVY CONFIG` | วัสดุไหน breach ได้ง่าย (ไม้ ดิน cobble) และวัสดุไหนต้องทนได้จริง (หินเสริม แนวป้องกันอุตสาหกรรม) | Main §3.4 |
| **Improved Mobs** | `HEAVY NERF FROM DEFAULT` | เส้นโค้ง HP: **Day 1 ~20 → Day 100 ~28–32 → Day 200 ~35–40 → เพดาน ~40–50** การ scale ต้องมีเพดาน | Main §3.4 |
| **In Control!** | `HEAVY CUSTOM` | ความหนาแน่นของ spawn, threat tier ตามวัน, กฎตาม biome, กฎตามระยะทาง, ข้อจำกัดของศัตรู | Main §3.4 |
| **SecurityCraft** | `HEAVY CUSTOM` | ปิดหรือจำกัดอะไรก็ตามที่ทำให้ฐาน breach ไม่ได้เลย — บล็อกเสริม, sentry, ทุ่นระเบิด | Main §3.10, §14 |
| **Immersive Engineering** | `HEAVY CUSTOM SCOPE` | มันเป็นเจ้าของ **โครงสร้างพื้นฐานไฟฟ้า** ไม่ใช่การผลิต ปิดหรือ gate machinery ของ IE ที่ข้าม Create ไปได้ | Main §3.11 |
| **Carry On** | `HEAVY BLACKLIST` | blacklist เครื่องจักร Create, บล็อก MineColonies, คลังใหญ่, เครื่องจักรอุตสาหกรรม — อะไรก็ตามที่ข้าม logistics | Main §3.9 |

## Custom — ขอบเขตแคบกว่า

| Mod | ป้าย | ต้องแก้อะไร | ต้นทาง |
|---|---|---|---|
| Create Big Cannons | `CUSTOM BALANCE` | ดาเมจของปืนใหญ่/ปืนต่อสู้อากาศยาน เทียบกับ threat tier | Main §3.1 |
| Create: Diesel Generators | `CUSTOM PROGRESSION` | ดีเซล/น้ำมันอยู่ตรงไหนของเส้น progression | Main §3.1 |
| Born in Chaos | `CUSTOM SPAWN + STATS` | กฎ spawn และค่าสถานะรายชั้น บันได common → elite | Main §3.4 |
| MineColonies | `CUSTOM RAID / BALANCE` | จูน raid ไม่ให้กลายเป็นอีเวนต์ถี่จนรำคาญ Guard ลาดตระเวน ยันจุดคอขวด แจ้งเตือนล่วงหน้า — **ไม่ใช่** ทหารราบถือไรเฟิล TaCZ | Main §3.5, §24 Phase 7 |
| Brimm Armors | `CUSTOM BALANCE` | ห้ามเป็น "TakKit ที่ตัวเลขสูงกว่า" ทุก tier ต้องมี use case | Main §3.7, §15 |
| Sophisticated Backpacks | `CUSTOM CAPACITY` | ปิด upgrade เรื่อง stack/ช่อง ที่ทำให้คลังและรถไฟไม่มีความหมาย | Main §3.7, §16 |
| PlayerRevive | `CUSTOM BLEEDOUT / REVIVE TIME` | เวลาเลือดไหลและเวลาชุบ | Main §3.9 |
| TACZ: Durability | `CUSTOM` | ปืนต้องมี maintenance แต่การติดขัดต้องไม่กลายเป็นความน่ารำคาญ | Main §3.2 |
| Create: New Age | `CUSTOM` | Season 2 เท่านั้น | Main §3.1 |
| Player Microchip | re-theme | ทำใหม่ให้เป็น tactical tracker — เป็นงาน resourcepack + KubeJS **ไม่ใช่** การ fork | Crafting Spec §17–29 |
| Base Mod | `CUSTOM AESTHETIC` · `CUSTOM RECIPE` | ปรับความสวยงามและ recipe ให้เข้ากัน | Crafting Spec |

## เขียนใหม่ทั้งหมด

| รายการ | ต้นทาง | หมายเหตุ |
|---|---|---|
| **FTB Quests** | Main §3.6, §17 | `QUESTS WRITTEN FROM SCRATCH` สิบสองบท เป็นรูป objective ไม่ใช่ checklist — *"Establish Industrial Production"* ไม่ใช่ *"Craft Cogwheel"* **§17 บอกชัดว่าให้ทำหลังจาก gameplay นิ่งแล้ว ไม่ใช่ก่อน balance** |
| **Recipe กระสุน** | Main §8, §24 Phase 5 | Create Sequenced Assembly: แผ่นทองเหลือง → ขึ้นรูปปลอก → ใส่หัวกระสุน → ดินขับ → ย้ำปาก **ห้าม**คิดค่าโอกาสล้มเหลวขึ้นมาเองก่อนตรวจว่า API รองรับจริง |
| **กฎซ่อนของ JEI** | Crafting Spec §6 | ต้อง sync กับการถอดมอดทุกครั้ง |
| **Wildlife roster** | Wildlife Spec §20 | `docs/wildlife-roster.md` — เทียบ**พฤติกรรม** ไม่ใช่ชื่อ ก่อนตัดสิน KEEP / REDUCE |

---

## เป้าหมายที่เป็นตัวเลข ยกมาตรงตัว

ค่าเหล่านี้มีอยู่ในเอกสารแล้ว มันคือ **เป้าหมายการออกแบบ ไม่ใช่ค่าที่วัดได้** — ดู
`Obsidian-minecraft-100day/measure-before-you-write-a-number.md`

**ช่วง TTK** (Main §3 Rule 3) — mob vanilla 2–4 นัดไรเฟิล · modded ทั่วไป 8–20 · elite 20–50 ·
ตัวใหญ่ 50–150+ · มังกรหลายร้อยนัด หรือควรใช้อาวุธหนักแทน

**เศรษฐกิจกระสุน** (Main §3 Rule 4) — ช่วงต้น: 100 นัดมีค่า · ช่วงกลาง: 1,000 นัดต้องมีเวิร์กช็อป ·
ช่วงปลาย: 10,000+ นัดต้องมีโรงงานอุตสาหกรรม

**เพดาน HP ของ mob** (Main §3.4) — Day 1 ~20 · Day 100 ~28–32 · Day 200 ~35–40 · เพดาน ~40–50

**ระยะมังกร** (Main §10) — รัศมีปลอดภัยจาก spawn ~2000–2500 บล็อก ค่าจริงต้อง generate หลาย seed
แล้ววัด

**ลำดับการลดความหนาแน่นของ entity เมื่อเครื่องตึง** (Wildlife Spec §18) — ลดตามลำดับนี้: ambient
ประดับ → critter เล็ก → สปีชีส์ซ้ำ → passive ทั่วไป ส่วน Create, MineColonies และการออกแบบการปะทะ
ถูกตัด**เป็นลำดับสุดท้าย**

---

## ลำดับการทำงาน

§24 ของเอกสารหลักเรียงลำดับไว้แล้ว และ §26 ห้ามทำล้ำหน้ามัน:

1. **Phase 2** — combat baseline, ตาราง TTK ใน `docs/combat-baseline.md` นี่คือสิ่งถัดไป
2. **Phase 3** — threat director (Enhanced AI, Improved Mobs, In Control)
3. **Phase 4** — ระบบเสียง พร้อมการ profile
4. **Phase 5** — เศรษฐกิจกระสุนใน KubeJS
5. **Phase 6** — Horde เฉพาะ Tier I และ II
6. **Phase 7 เป็นต้นไป** — อารยธรรม, มังกร, อุปกรณ์, ระบบเมือง
7. **Phase 12** — FTB Quests *หลังจาก* กลไกนิ่งแล้ว

**ยังไม่มีข้อไหนเริ่มได้จนกว่าการเปิด client จะสร้างไฟล์ config ออกมา**
<!-- lang:end -->
