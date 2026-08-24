<!-- lang:en -->
# Domain Glossary

Canonical vocabulary for this repo. When a term appears in **bold**, use it exactly as
written — in issue titles, PR descriptions, config comments, KubeJS identifiers, and
conversation. Drifting to an "alias to avoid" is a defect, because the alias usually carries
a design assumption this pack rejected.

> This is the **glossary** — what the words mean here. The full design rationale lives in
> `docs/Industrial Civilization Survival — Claude Code Handoff & Implementation Plan.md`,
> which is the source of truth for intent; this file is the source of truth for naming.
> If a term is missing, that is a signal: either you are inventing language the project does
> not use, or there is a real gap worth adding.

## The pack

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Industrial Civilization Survival** | The modpack. Minecraft 1.20.1, Forge, Java 17. The player is an ordinary human building an industrial civilization to survive a world more dangerous than vanilla. | "the Create pack", "the gun pack", "100 Day pack" |
| **Consumption Economy** | The pack's core loop and its highest-order design rule: threat forces weapon use, weapon use consumes ammunition, ammunition demands industry, industry grows the settlement, the settlement creates more to defend. Every feature is judged against it. | "the progression", "the gameplay loop" |
| **Kitchen sink** | An anti-reference, never a description of this pack. A mod that is here only because it is popular fails the test in §35. | — |
| **Season 1** / **Season 2** | Release scopes, not time periods. Season 1 is the Alpha/Beta target (§29–30). Season 2 is the physics-vehicle and heavy-industry tier (VS2, Clockwork, TFMG, Warium) and lives on a separate branch until it boots clean. | "phase 2", "v2", "late game" |

## Mod status vocabulary

Every mod in the master list carries exactly one status. These are the words used in
`docs/compatibility-matrix.md` and in issue titles.

| Status | Meaning |
|--------|---------|
| **CORE** | Ships in the Alpha. Its absence is a broken pack. |
| **CORE-LITE** | Ships, but heavily nerfed from defaults; carries its own balance issue. |
| **CORE CLIENT** | Client-side only — must be marked as such in packwiz side metadata. |
| **DEPENDENCY** | Present only because another mod requires it; no gameplay claim of its own. |
| **SEASON 2** | Deliberately excluded from Alpha. Lives on the Season 2 branch. |
| **EXPERIMENTAL** / **PROTOTYPE** | Installed for evaluation. Must not be depended on by a quest or a recipe. |
| **HIGH RISK** | Known to threaten startup, MSPT, or Create compatibility. Never batched with another HIGH RISK mod. |
| **REJECTED** | Excluded with a stated reason (§6). Re-adding one requires a *new* reason recorded as an ADR, not a preference. |

## Threat

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Tier** | A threat band (I–IV) driving Horde composition and In Control spawn rules. Tier is about *composition and behaviour*, never about multiplying HP. | "difficulty level", "wave level" |
| **Horde** | A scheduled invasion event from The Hordes, with a Calm → Tension → Crisis → Recovery shape. A **Major Horde** is a rare set-piece, not a frequent one. | "raid" (that is MineColonies' own event and a different system), "blood moon" |
| **Apex Predator** | A territorial Ice & Fire creature, dragons chiefly. Never a Horde participant. Encounters are rare, regional, and memorable. | "boss", "elite" |
| **Breach** | An enemy defeating a wall by mining or pathing through it (Enhanced AI). The defence answer is better material and layout, never an unbreakable block. | "griefing" |
| **Noise** | The attraction value a sound emits (Attract to Sound). Noise attracts **existing** mobs; it does not spawn them. | "aggro range", "sound spawn" |
| **HP sponge** | An anti-pattern, never a target. Difficulty comes from armour, AI, abilities, mobility, numbers, noise, territory, and logistics cost — see §3 Rule 3. | — |
| **TTK** | Time-to-kill: the measured rounds-and-seconds figure for a weapon against a target class. A TTK is a **measurement**, so it is only ever recorded after being observed in game. | "DPS", "damage number" |

## Industry & logistics

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Backbone** | Create's role. Manufacturing, processing, rail logistics and heavy engineering route through Create. A mod that lets the player bypass it is rejected regardless of merit. | "main tech mod" |
| **Sequenced Assembly** | The Create mechanic ammunition manufacturing is built on. The intended shape is in §8. | "assembly line" |
| **Ammunition economy** | The industrial cost curve for rounds: 100 rounds is valuable early, 10,000+ requires a plant (§3 Rule 4). Ammunition is a *resource*, not a consumable that regenerates. | "ammo crafting" |
| **Frontier** | Territory beyond the settlement's safe radius. Danger scales with distance travelled and days survived, not with a calendar rule. | "endgame area" |
| **Outpost** | A remote holding connected by rail or road, reachable only by travelling. Nothing in this pack teleports. | "waypoint", "base 2" |
| **Grid** | The city electrical hierarchy: Power Plant → HV → Substation → MV → Transformer → LV (§13). Immersive Engineering owns the grid; it does not own manufacturing. | "power network", "RF system" |

## Process

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Batch** | A small group of mods added together and launched before the next group. The unit of the boot-test protocol (§26). A batch is small enough that a failure names its own cause. | "the mod list", "an update" |
| **Compatibility matrix** | `docs/compatibility-matrix.md`. A record of what has been **run**, not of what should work. A row is only marked PASS after a launch. | "the mod list", "supported versions" |
| **Block-built vehicle** | A vehicle the player engineers block by block (VS2 / Clockwork). The pack has no vehicle spawn eggs and no vehicle items. | "car mod", "vehicle entity" |
<!-- lang:end -->

<!-- lang:th -->
# Domain Glossary — คำศัพท์มาตรฐาน

คำศัพท์มาตรฐานของ repo นี้ เวลาเจอคำที่เป็น **ตัวหนา** ให้ใช้ตามนั้นเป๊ะ ๆ — ทั้งใน issue title,
PR description, comment ใน config, identifier ของ KubeJS และในบทสนทนา การเลื่อนไปใช้คำใน
ช่อง "ห้ามใช้" ถือเป็น defect เพราะคำเหล่านั้นมักพ่วงสมมติฐานเชิงดีไซน์ที่ pack นี้ปฏิเสธไปแล้ว

> ไฟล์นี้คือ **glossary** — คำแต่ละคำแปลว่าอะไรที่นี่ ส่วนเหตุผลเชิงดีไซน์เต็ม ๆ อยู่ใน
> `docs/Industrial Civilization Survival — Claude Code Handoff & Implementation Plan.md`
> ซึ่งเป็น source of truth ของเจตนา ส่วนไฟล์นี้เป็น source of truth ของการตั้งชื่อ
> ถ้าไม่มีคำที่ต้องการ นั่นคือสัญญาณ: ไม่คุณกำลังคิดคำใหม่ที่โปรเจกต์ไม่ได้ใช้ ก็มีช่องว่างจริง
> ที่ควรเติมเข้ามา

## ตัว pack

| คำ | ความหมาย | ห้ามใช้ |
|------|-----------|-----------------|
| **Industrial Civilization Survival** | ตัว modpack เอง Minecraft 1.20.1, Forge, Java 17 ผู้เล่นคือมนุษย์ธรรมดาที่ต้องสร้างอารยธรรมอุตสาหกรรมเพื่อเอาตัวรอดในโลกที่อันตรายกว่า vanilla | "the Create pack", "แพ็คปืน", "แพ็ค 100 วัน" |
| **Consumption Economy** | loop หลักของ pack และกฎดีไซน์ที่ใหญ่ที่สุด: ภัยคุกคามบังคับให้ใช้อาวุธ → ใช้อาวุธกินกระสุน → กระสุนต้องการอุตสาหกรรม → อุตสาหกรรมทำให้นิคมโต → นิคมโตแล้วมีของให้ปกป้องมากขึ้น ทุก feature ถูกตัดสินด้วยเกณฑ์นี้ | "ระบบ progression", "gameplay loop" |
| **Kitchen sink** | เป็น anti-reference เท่านั้น ห้ามใช้บรรยาย pack นี้ mod ที่อยู่ที่นี่เพียงเพราะมันดัง คือ mod ที่สอบตกเกณฑ์ §35 | — |
| **Season 1** / **Season 2** | คือขอบเขตของการปล่อย ไม่ใช่ช่วงเวลา Season 1 คือเป้า Alpha/Beta (§29–30) ส่วน Season 2 คือชั้นของยานพาหนะ physics และอุตสาหกรรมหนัก (VS2, Clockwork, TFMG, Warium) ซึ่งอยู่คนละ branch จนกว่าจะ boot ผ่านสะอาด | "phase 2", "v2", "late game" |

## คำศัพท์สถานะของ mod

ทุก mod ในลิสต์หลักมีสถานะได้สถานะเดียว คำเหล่านี้คือคำที่ใช้ใน `docs/compatibility-matrix.md`
และใน issue title

| สถานะ | ความหมาย |
|--------|---------|
| **CORE** | อยู่ใน Alpha ถ้าไม่มีแปลว่า pack พัง |
| **CORE-LITE** | อยู่ใน pack แต่ถูก nerf หนักจากค่า default มี balance issue ของตัวเองแยกต่างหาก |
| **CORE CLIENT** | ฝั่ง client เท่านั้น — ต้อง mark side ใน packwiz metadata ให้ถูก |
| **DEPENDENCY** | อยู่เพราะ mod อื่นต้องการเท่านั้น ไม่มีข้อกล่าวอ้างเรื่อง gameplay ของตัวเอง |
| **SEASON 2** | ตั้งใจกันออกจาก Alpha อยู่บน branch Season 2 |
| **EXPERIMENTAL** / **PROTOTYPE** | ลงไว้เพื่อประเมิน ห้ามให้ quest หรือ recipe ไปพึ่งพา |
| **HIGH RISK** | รู้อยู่แล้วว่าเสี่ยงต่อ startup, MSPT หรือความเข้ากันได้กับ Create ห้ามลง batch เดียวกับ HIGH RISK ตัวอื่น |
| **REJECTED** | ถูกกันออกพร้อมเหตุผลที่ระบุไว้ (§6) การเอากลับเข้ามาต้องมีเหตุผล*ใหม่*ที่บันทึกเป็น ADR ไม่ใช่ความชอบส่วนตัว |

## ภัยคุกคาม

| คำ | ความหมาย | ห้ามใช้ |
|------|-----------|-----------------|
| **Tier** | ระดับของภัยคุกคาม (I–IV) ที่กำหนดองค์ประกอบของ Horde และกฎ spawn ของ In Control — Tier พูดถึง*องค์ประกอบและพฤติกรรม* ไม่เคยหมายถึงการคูณ HP | "ระดับความยาก", "wave level" |
| **Horde** | อีเวนต์บุกที่ถูกกำหนดเวลาจาก The Hordes มีรูปทรง Calm → Tension → Crisis → Recovery ส่วน **Major Horde** คือ set-piece ที่นาน ๆ ครั้ง ไม่ใช่ของบ่อย | "raid" (นั่นคืออีเวนต์ของ MineColonies เอง คนละระบบ), "blood moon" |
| **Apex Predator** | สิ่งมีชีวิตที่หวงถิ่นจาก Ice & Fire โดยเฉพาะมังกร ไม่เคยเป็นส่วนหนึ่งของ Horde การเจอต้องหายาก ผูกกับพื้นที่ และน่าจดจำ | "บอส", "elite" |
| **Breach** | ศัตรูเอาชนะกำแพงด้วยการขุดหรือหาทางลอด (Enhanced AI) คำตอบของฝ่ายป้องกันคือวัสดุและผังที่ดีกว่า ไม่ใช่บล็อกที่ทำลายไม่ได้ | "griefing" |
| **Noise** | ค่าการดึงดูดที่เสียงหนึ่ง ๆ ปล่อยออกมา (Attract to Sound) Noise ดึง mob ที่**มีอยู่แล้ว** ไม่ได้ spawn ตัวใหม่ | "aggro range", "sound spawn" |
| **HP sponge** | เป็น anti-pattern ไม่ใช่เป้าหมาย ความยากมาจาก armour, AI, ความสามารถ, การเคลื่อนที่, จำนวน, เสียง, พื้นที่ และต้นทุน logistics — ดู §3 Rule 3 | — |
| **TTK** | Time-to-kill: ตัวเลขจำนวนนัดและเวลาที่วัดได้ของอาวุธหนึ่งต่อเป้าหมายกลุ่มหนึ่ง TTK คือ**ค่าที่วัดได้** ดังนั้นบันทึกได้ก็ต่อเมื่อสังเกตในเกมจริงแล้วเท่านั้น | "DPS", "ตัวเลขดาเมจ" |

## อุตสาหกรรมและ logistics

| คำ | ความหมาย | ห้ามใช้ |
|------|-----------|-----------------|
| **Backbone** | บทบาทของ Create การผลิต, การแปรรูป, rail logistics และวิศวกรรมหนักทั้งหมดวิ่งผ่าน Create — mod ที่ทำให้ผู้เล่นข้ามมันไปได้ถูกปฏิเสธ ไม่ว่าจะดีแค่ไหน | "tech mod หลัก" |
| **Sequenced Assembly** | กลไกของ Create ที่การผลิตกระสุนถูกสร้างอยู่บนนั้น รูปทรงที่ตั้งใจไว้อยู่ใน §8 | "สายพานประกอบ" |
| **Ammunition economy** | เส้นต้นทุนอุตสาหกรรมของกระสุน: 100 นัดมีค่าในช่วงต้น, 10,000+ นัดต้องมีโรงงาน (§3 Rule 4) กระสุนคือ*ทรัพยากร* ไม่ใช่ของสิ้นเปลืองที่งอกเองได้ | "การคราฟต์กระสุน" |
| **Frontier** | ดินแดนที่พ้นรัศมีปลอดภัยของนิคม ความอันตรายขึ้นกับระยะทางที่เดินทางและจำนวนวันที่รอดมา ไม่ใช่กฎตามปฏิทิน | "พื้นที่ endgame" |
| **Outpost** | ที่มั่นห่างไกลที่เชื่อมด้วยรางหรือถนน ไปถึงได้ด้วยการเดินทางเท่านั้น ไม่มีอะไรใน pack นี้ที่ teleport ได้ | "waypoint", "ฐานสอง" |
| **Grid** | ลำดับชั้นไฟฟ้าของเมือง: Power Plant → HV → Substation → MV → Transformer → LV (§13) Immersive Engineering เป็นเจ้าของ Grid แต่ไม่ได้เป็นเจ้าของการผลิต | "power network", "ระบบ RF" |

## กระบวนการ

| คำ | ความหมาย | ห้ามใช้ |
|------|-----------|-----------------|
| **Batch** | กลุ่ม mod เล็ก ๆ ที่ลงพร้อมกันแล้วเปิดเกมทดสอบก่อนลงกลุ่มถัดไป เป็นหน่วยของ boot-test protocol (§26) batch ต้องเล็กพอที่ความล้มเหลวจะบอกสาเหตุของตัวเองได้ | "ลิสต์ mod", "การอัปเดต" |
| **Compatibility matrix** | `docs/compatibility-matrix.md` เป็นบันทึกของสิ่งที่**รันจริงแล้ว** ไม่ใช่ของสิ่งที่ควรจะทำงานได้ แถวหนึ่งจะถูก mark PASS ได้ก็ต่อเมื่อเปิดเกมแล้วเท่านั้น | "ลิสต์ mod", "เวอร์ชันที่รองรับ" |
| **Block-built vehicle** | ยานพาหนะที่ผู้เล่นออกแบบทีละบล็อก (VS2 / Clockwork) pack นี้ไม่มี spawn egg ของยานพาหนะ และไม่มียานพาหนะที่เป็น item | "mod รถ", "vehicle entity" |
<!-- lang:end -->
