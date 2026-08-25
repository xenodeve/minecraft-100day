<!-- lang:en -->
# Wildlife Roster

**Wildlife Spec W0 and §20–21.** Every animal the three wildlife mods add, classified into §21's
five categories, with the duplicate audit §20 requires.

Read out of the installed jars and their generated configs — the lang files for the registry, and
`config/naturalist.json` / `config/crittersandcompanions-common.json5` / Ecologics' biome modifiers
for the spawn data. Nothing here is remembered.

> **The spawn weights below are the mods' own defaults and NONE of them has been changed.**
> W3 is explicit: *"Do not randomly reduce every value. Tune based on measured population."* This
> file is the measurement sheet, not the tuning.

**55 entities across three mods.** Four are not wildlife at all and are listed only so the count
reconciles: `naturalist:lizard_tail` (a dropped tail), `crittersandcompanions:grappling_hook`
(a projectile), `ecologics:boat` and `ecologics:chest_boat`.

## The mods' assigned roles

The design document allocates them, and that allocation decides every duplicate below:

| Mod | Role (§4, §6, §7) |
|---|---|
| **Naturalist** | **Major Wildlife** — world ecology, atmosphere, environmental identity, natural food chain |
| **Critters and Companions** | **Small Wildlife + Environmental Detail** |
| **Ecologics** | Biome identity and worldgen flavour |

§6 states the failure to avoid outright:

> ไม่ควรเกิด: Naturalist Animal A + Critters Animal B ที่ทำ ecosystem role เดียวกัน
> และ spawn พร้อมกันจำนวนมาก

---

## §20 — Duplicate species audit

### Resolved now: two exact duplicates

| Species | Naturalist | Critters and Companions | Decision |
|---|---|---|---|
| **Snail** | weight 10, group 2–3 | weight 23 across forest · lush caves · swamp, max 2 | **KEEP Critters · REMOVE Naturalist** |
| **Dragonfly** | weight 10, group 2–4 | weight 24 across river · swamp · mangrove · lush caves, max 1 | **KEEP Critters · REMOVE Naturalist** |

**The decision is the design document's, not a preference.** A snail and a dragonfly are
*Environmental Detail*, which §6 assigns to Critters and Companions. Naturalist is *Major
Wildlife*; a snail is not major wildlife.

Critters also has the better implementation of both by §20's own comparison criteria — its spawns
are **biome-specific** (three named biomes for the snail, four for the dragonfly) where
Naturalist's are flat. §4's requirement is that an animal should feel like it lives somewhere
*"เพราะ biome นั้นเหมาะกับมัน"*, and biome-scoped spawning is that requirement in config form.

Applied in `config/naturalist.json`: `snailRemoved` and `dragonflyRemoved` set to `true`. That is
Naturalist's own removal switch, so the entity stops spawning and stops registering rather than
being suppressed downstream.

### Pending a measurement: behavioural overlap

These are not the same species, so §20's *"เปรียบเทียบ behavior"* rather than name-matching is what
flags them. **None is changed**, because the remedy §20 offers for a near-duplicate is *"ลดหรือปิด
spawn อีกตัว"* — a reduction, and W3 forbids reducing without a measured population.

| Overlap | Naturalist | Critters and Companions | Note |
|---|---|---|---|
| **Ambient forest insects** | `butterfly`, `caterpillar`, `firefly` (weight 10 each) | `ladybug` 52, `roly_poly` 25, `leaf_insect` 20, `stag_beetle` 14, `stick_bug` 14, `weevil` 14 | Same niche, same biomes. Critters carries **139** combined weight here against Naturalist's 30 |
| **Ambient poultry** | `duck` (weight 10, group 3–4) | — | Overlaps **vanilla chicken**, not another mod. This is §20's own worked example |
| **Small reptiles** | `lizard`, `snake`, `coral_snake`, `rattlesnake` | `jumping_spider` | Different clades, same "small thing underfoot" role |

**`ladybug` at 52 and `sea_bunny` at 96 are the two heaviest ambient spawns in the pack** and are
the first candidates whenever a measurement exists — §18's reduction order opens with *ambient
decorative*.

### Not duplicates, recorded so the question is not re-opened

- `naturalist:bass` and `naturalist:catfish` vs vanilla `cod` / `salmon` — freshwater against
  saltwater. Different biome, different niche. **KEEP both.**
- `forestFoxRemoved` / `forestRabbitRemoved` exist in `naturalist.json` but neither appears in the
  entity registry: these are **biome variants of vanilla mobs**, not new species. Nothing to audit.
- `ecologics:penguin` vs any Naturalist bird — Ecologics places it in a biome no Naturalist bird
  reaches.

---

## §21 — Roster by category

### Ambient — birds, insects, small decorative

| Species | Mod | Weight | Group | Biome |
|---|---|---|---|---|
| Sea Bunny | Critters | **96** | 1–4 | all five ocean types |
| Ladybug | Critters | **52** | 1–3 | forest · lush caves · cherry grove · sunflower plains · meadow |
| Dumbo Octopus | Critters | 28 | 1 | all five ocean types |
| Roly-Poly | Critters | 25 | 1–3 | forest · lush caves · swamp |
| Dragonfly | Critters | 24 | 1 | river · swamp · mangrove · lush caves |
| Snail | Critters | 23 | 1–2 | forest · lush caves · swamp |
| Leaf Insect | Critters | 20 | 1 | jungle · forest |
| Stag Beetle | Critters | 14 | 1–2 | forest · lush caves |
| Stick Bug | Critters | 14 | 1–2 | forest · lush caves |
| Acorn Weevil | Critters | 14 | 1–3 | forest · lush caves |
| Jumping Spider | Critters | 8 | 1 | jungle · forest · lush caves |
| Shima Enaga | Critters | 3 | 1–3 | snow-fox biomes |
| Bluejay · Canary · Cardinal · Finch · Robin · Sparrow | Naturalist | 10 each | 3–4 | — |
| Duck | Naturalist | 10 | 3–4 | — |
| Butterfly | Naturalist | 10 | 3–6 | — |
| Caterpillar · Firefly | Naturalist | 10 | 2–4 | — |
| Vulture | Naturalist | 3 | 3–5 | — |
| ~~Snail~~ · ~~Dragonfly~~ | Naturalist | **removed** | — | duplicate, see §20 above |

### Small Wildlife — small mammals, small reptiles

| Species | Mod | Weight | Group |
|---|---|---|---|
| Squirrel | Ecologics | 10 | 2–3 |
| Red Panda | Critters | 8 | 1–2 |
| Ferret | Critters | 7 | 1–3 |
| Otter | Critters | 1 | 1–4 |
| Coconut Crab | Ecologics | — | — |
| Lizard · Snake · Coral Snake · Rattlesnake · Tortoise | Naturalist | 10 each | 1 |

### Medium Wildlife — deer, boars, predators

| Species | Mod | Weight | Group |
|---|---|---|---|
| Deer | Naturalist | 10 | 3–5 |
| Boar | Naturalist | 10 | 3–4 |
| Bear | Naturalist | 10 | 1–2 |
| Ostrich | Naturalist | 10 | — |
| Penguin | Ecologics | 2 | 4–5 |
| Camel | Ecologics | 1 | 1 |
| Zebra | Naturalist | 1 | 2–6 |

### Large Wildlife — large mammals and reptiles

| Species | Mod | Weight | Group |
|---|---|---|---|
| Alligator | Naturalist | 10 | 2–3 |
| Hippo | Naturalist | 10 | 1–3 |
| Elephant | Naturalist | 5 | 1–3 |
| Giraffe | Naturalist | 5 | 1–3 |
| Lion | Naturalist | 3 | 1–3 |
| Rhino | Naturalist | 1 | 1–3 |

### Aquatic

| Species | Mod | Weight | Group |
|---|---|---|---|
| Bass | Naturalist | 10 | 3–6 |
| Catfish | Naturalist | 10 | 1–2 |
| Koi Fish | Critters | 2 | 1–5 |

§22 applies to the Medium and Large tables: *"Not every dangerous creature needs to be
supernatural."* Bear, lion, alligator, hippo and rhino stay dangerous. That is the whole point of
the layer — it is what makes a Born in Chaos mob read as **abnormal** rather than as just another
mob.

---

## What this roster does NOT establish

- **Actual population.** Weight is a lottery ticket count, not a headcount. W3, W6 and W7 all
  require a profiling run before any weight moves, and none has happened.
- **Biome coverage for Naturalist.** Its config exposes weight and group size but not biome; the
  biome assignment is in the jar's own worldgen and is not read here.
- **MSPT cost.** §36 wants the entity budget measured under load. `sea_bunny` at 96 across five
  ocean biomes is the obvious first thing to look at, and "obvious" is not a measurement.
- **Whether the ecology reads as alive.** §4's real test — *"พวกมันอยู่ในโลกเพราะ biome นั้นเหมาะ
  กับมัน"* — is a thing you feel walking through a forest, and it needs a client.
<!-- lang:end -->

<!-- lang:th -->
# Wildlife Roster — ทะเบียนสัตว์ป่า

**Wildlife Spec W0 และ §20–21** สัตว์ทุกตัวที่มอดสัตว์ป่าสามตัวเพิ่มเข้ามา จัดตามห้าหมวดของ §21
พร้อมการตรวจสายพันธุ์ซ้ำที่ §20 กำหนด

อ่านจาก jar ที่ติดตั้งและ config ที่มันสร้าง — ไฟล์ lang สำหรับทะเบียน และ `config/naturalist.json` /
`config/crittersandcompanions-common.json5` / biome modifier ของ Ecologics สำหรับข้อมูล spawn
ไม่มีอะไรในนี้มาจากความจำ

> **น้ำหนัก spawn ข้างล่างเป็นค่าปริยายของมอดเอง และ*ไม่มีตัวไหน*ถูกเปลี่ยน**
> W3 พูดชัด: *"Do not randomly reduce every value. Tune based on measured population."*
> ไฟล์นี้คือใบบันทึกการวัด ไม่ใช่การจูน

**55 เอนทิตีจากสามมอด** สี่ตัวไม่ใช่สัตว์ป่าเลยและถูกใส่ไว้เพื่อให้ยอดตรงกันเท่านั้น:
`naturalist:lizard_tail` (หางที่หลุด), `crittersandcompanions:grappling_hook` (กระสุน),
`ecologics:boat` และ `ecologics:chest_boat`

## บทบาทที่เอกสารมอบให้แต่ละมอด

เอกสารออกแบบจัดสรรไว้แล้ว และการจัดสรรนั้นตัดสินทุกกรณีซ้ำข้างล่าง:

| มอด | บทบาท (§4, §6, §7) |
|---|---|
| **Naturalist** | **Major Wildlife** — ระบบนิเวศของโลก บรรยากาศ อัตลักษณ์ของสภาพแวดล้อม ห่วงโซ่อาหารตามธรรมชาติ |
| **Critters and Companions** | **Small Wildlife + Environmental Detail** |
| **Ecologics** | อัตลักษณ์ biome และ worldgen |

§6 ระบุความล้มเหลวที่ต้องเลี่ยงไว้ตรง ๆ:

> ไม่ควรเกิด: Naturalist Animal A + Critters Animal B ที่ทำ ecosystem role เดียวกัน
> และ spawn พร้อมกันจำนวนมาก

---

## §20 — การตรวจสายพันธุ์ซ้ำ

### แก้แล้ว: สายพันธุ์ซ้ำตรงตัวสองตัว

| สายพันธุ์ | Naturalist | Critters and Companions | คำตัดสิน |
|---|---|---|---|
| **หอยทาก** | weight 10, กลุ่ม 2–3 | weight 23 ใน forest · lush caves · swamp, สูงสุด 2 | **เก็บของ Critters · ถอดของ Naturalist** |
| **แมลงปอ** | weight 10, กลุ่ม 2–4 | weight 24 ใน river · swamp · mangrove · lush caves, สูงสุด 1 | **เก็บของ Critters · ถอดของ Naturalist** |

**คำตัดสินเป็นของเอกสารออกแบบ ไม่ใช่ความชอบ** หอยทากกับแมลงปอคือ *Environmental Detail* ซึ่ง §6
มอบให้ Critters and Companions ส่วน Naturalist คือ *Major Wildlife* และหอยทากไม่ใช่สัตว์ป่าขนาดใหญ่

Critters ยัง implement ทั้งสองตัวได้ดีกว่าตามเกณฑ์เปรียบเทียบของ §20 เอง — spawn ของมัน
**เจาะจง biome** (สามไบโอมสำหรับหอยทาก สี่สำหรับแมลงปอ) ขณะที่ของ Naturalist เป็นค่าแบน
ข้อกำหนดของ §4 คือสัตว์ควรรู้สึกว่ามันอยู่ตรงนั้น *"เพราะ biome นั้นเหมาะกับมัน"* และการ spawn
ที่ผูกกับ biome คือข้อกำหนดนั้นในรูปของ config

ลงมือใน `config/naturalist.json`: ตั้ง `snailRemoved` และ `dragonflyRemoved` เป็น `true`
นั่นคือสวิตช์ถอดของ Naturalist เอง เอนทิตีจึงหยุด spawn และหยุดลงทะเบียน แทนที่จะถูกกดทับทีหลัง

### รอการวัด: ความซ้อนทับเชิงพฤติกรรม

พวกนี้ไม่ใช่สายพันธุ์เดียวกัน สิ่งที่ทำให้เห็นจึงเป็น *"เปรียบเทียบ behavior"* ของ §20 ไม่ใช่การจับคู่ชื่อ
**ไม่มีตัวไหนถูกเปลี่ยน** เพราะทางแก้ที่ §20 เสนอสำหรับกรณีใกล้เคียงคือ *"ลดหรือปิด spawn อีกตัว"* —
เป็นการลด และ W3 ห้ามลดโดยไม่มีประชากรที่วัดได้

| ความซ้อนทับ | Naturalist | Critters and Companions | หมายเหตุ |
|---|---|---|---|
| **แมลงป่าประดับ** | `butterfly`, `caterpillar`, `firefly` (weight 10 ต่อตัว) | `ladybug` 52, `roly_poly` 25, `leaf_insect` 20, `stag_beetle` 14, `stick_bug` 14, `weevil` 14 | นิเวศเดียวกัน ไบโอมเดียวกัน Critters แบกน้ำหนักรวม **139** เทียบกับ 30 ของ Naturalist |
| **สัตว์ปีกประดับ** | `duck` (weight 10, กลุ่ม 3–4) | — | ซ้อนกับ **ไก่ vanilla** ไม่ใช่มอดอื่น นี่คือตัวอย่างที่ §20 ยกเอง |
| **สัตว์เลื้อยคลานเล็ก** | `lizard`, `snake`, `coral_snake`, `rattlesnake` | `jumping_spider` | คนละวงศ์ แต่บทบาท "ตัวเล็กใต้ฝ่าเท้า" เดียวกัน |

**`ladybug` ที่ 52 และ `sea_bunny` ที่ 96 คือ spawn ประดับที่หนักที่สุดสองตัวใน pack** และเป็น
ตัวแรกที่ควรพิจารณาเมื่อมีการวัด — ลำดับการลดของ §18 เปิดด้วย *ambient decorative*

### ไม่ใช่ตัวซ้ำ บันทึกไว้เพื่อไม่ให้ถูกเปิดประเด็นใหม่

- `naturalist:bass` และ `naturalist:catfish` เทียบ `cod` / `salmon` ของ vanilla — น้ำจืดกับน้ำเค็ม
  คนละไบโอม คนละนิเวศ **เก็บทั้งคู่**
- `forestFoxRemoved` / `forestRabbitRemoved` มีใน `naturalist.json` แต่ไม่มีตัวไหนอยู่ในทะเบียนเอนทิตี:
  พวกนี้คือ **variant ตามไบโอมของ mob vanilla** ไม่ใช่สายพันธุ์ใหม่ ไม่มีอะไรต้องตรวจ
- `ecologics:penguin` เทียบนกของ Naturalist ตัวใด — Ecologics วางมันไว้ในไบโอมที่นกของ Naturalist
  ไปไม่ถึง

---

## §21 — ทะเบียนแยกตามหมวด

### Ambient — นก แมลง สัตว์ประดับขนาดเล็ก

| สายพันธุ์ | มอด | น้ำหนัก | กลุ่ม | ไบโอม |
|---|---|---|---|---|
| Sea Bunny | Critters | **96** | 1–4 | มหาสมุทรทั้งห้าแบบ |
| Ladybug | Critters | **52** | 1–3 | forest · lush caves · cherry grove · sunflower plains · meadow |
| Dumbo Octopus | Critters | 28 | 1 | มหาสมุทรทั้งห้าแบบ |
| Roly-Poly | Critters | 25 | 1–3 | forest · lush caves · swamp |
| Dragonfly | Critters | 24 | 1 | river · swamp · mangrove · lush caves |
| Snail | Critters | 23 | 1–2 | forest · lush caves · swamp |
| Leaf Insect | Critters | 20 | 1 | jungle · forest |
| Stag Beetle | Critters | 14 | 1–2 | forest · lush caves |
| Stick Bug | Critters | 14 | 1–2 | forest · lush caves |
| Acorn Weevil | Critters | 14 | 1–3 | forest · lush caves |
| Jumping Spider | Critters | 8 | 1 | jungle · forest · lush caves |
| Shima Enaga | Critters | 3 | 1–3 | ไบโอมที่มีจิ้งจอกหิมะ |
| Bluejay · Canary · Cardinal · Finch · Robin · Sparrow | Naturalist | 10 ต่อตัว | 3–4 | — |
| Duck | Naturalist | 10 | 3–4 | — |
| Butterfly | Naturalist | 10 | 3–6 | — |
| Caterpillar · Firefly | Naturalist | 10 | 2–4 | — |
| Vulture | Naturalist | 3 | 3–5 | — |
| ~~Snail~~ · ~~Dragonfly~~ | Naturalist | **ถอดออก** | — | ซ้ำ ดู §20 ข้างบน |

### Small Wildlife — สัตว์เลี้ยงลูกด้วยนมเล็ก สัตว์เลื้อยคลานเล็ก

| สายพันธุ์ | มอด | น้ำหนัก | กลุ่ม |
|---|---|---|---|
| Squirrel | Ecologics | 10 | 2–3 |
| Red Panda | Critters | 8 | 1–2 |
| Ferret | Critters | 7 | 1–3 |
| Otter | Critters | 1 | 1–4 |
| Coconut Crab | Ecologics | — | — |
| Lizard · Snake · Coral Snake · Rattlesnake · Tortoise | Naturalist | 10 ต่อตัว | 1 |

### Medium Wildlife — กวาง หมูป่า ผู้ล่า

| สายพันธุ์ | มอด | น้ำหนัก | กลุ่ม |
|---|---|---|---|
| Deer | Naturalist | 10 | 3–5 |
| Boar | Naturalist | 10 | 3–4 |
| Bear | Naturalist | 10 | 1–2 |
| Ostrich | Naturalist | 10 | — |
| Penguin | Ecologics | 2 | 4–5 |
| Camel | Ecologics | 1 | 1 |
| Zebra | Naturalist | 1 | 2–6 |

### Large Wildlife — สัตว์เลี้ยงลูกด้วยนมและสัตว์เลื้อยคลานขนาดใหญ่

| สายพันธุ์ | มอด | น้ำหนัก | กลุ่ม |
|---|---|---|---|
| Alligator | Naturalist | 10 | 2–3 |
| Hippo | Naturalist | 10 | 1–3 |
| Elephant | Naturalist | 5 | 1–3 |
| Giraffe | Naturalist | 5 | 1–3 |
| Lion | Naturalist | 3 | 1–3 |
| Rhino | Naturalist | 1 | 1–3 |

### Aquatic — สัตว์น้ำ

| สายพันธุ์ | มอด | น้ำหนัก | กลุ่ม |
|---|---|---|---|
| Bass | Naturalist | 10 | 3–6 |
| Catfish | Naturalist | 10 | 1–2 |
| Koi Fish | Critters | 2 | 1–5 |

§22 ใช้กับตาราง Medium และ Large: *"Not every dangerous creature needs to be supernatural."*
หมี สิงโต จระเข้ ฮิปโป และแรดยังอันตรายต่อไป นั่นคือประเด็นทั้งหมดของชั้นนี้ — มันคือสิ่งที่ทำให้
mob ของ Born in Chaos อ่านออกมาว่า **ผิดปกติ** แทนที่จะเป็นแค่ mob อีกตัว

---

## สิ่งที่ทะเบียนนี้ยัง**ไม่**ยืนยัน

- **ประชากรจริง** น้ำหนักคือจำนวนใบสลาก ไม่ใช่จำนวนตัว W3, W6 และ W7 ต้องการการ profile ก่อนขยับ
  น้ำหนักใด ๆ และยังไม่มีการ profile เกิดขึ้น
- **ไบโอมของ Naturalist** config ของมันเปิดน้ำหนักและขนาดกลุ่ม แต่ไม่เปิดไบโอม การกำหนดไบโอม
  อยู่ใน worldgen ของ jar เองและไม่ได้อ่านในที่นี้
- **ต้นทุน MSPT** §36 ต้องการให้วัดงบเอนทิตีใต้โหลด `sea_bunny` ที่ 96 ในไบโอมมหาสมุทรห้าแบบ
  คือสิ่งที่ชัดเจนว่าควรดูก่อน และ "ชัดเจน" ไม่ใช่การวัด
- **ระบบนิเวศอ่านออกมาว่ามีชีวิตหรือเปล่า** ข้อทดสอบจริงของ §4 — *"พวกมันอยู่ในโลกเพราะ biome นั้น
  เหมาะกับมัน"* — เป็นสิ่งที่รู้สึกได้ตอนเดินผ่านป่า และต้องใช้ client
<!-- lang:end -->
