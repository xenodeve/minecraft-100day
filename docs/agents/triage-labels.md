<!-- lang:en -->
# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the
actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding
label string from this table.

The mapping is identity here — this repo adopted the canonical names unchanged. Edit the
right-hand column if that ever stops being true.

**`ready-for-human` carries extra weight in this repo.** Most of the verification that matters
here requires launching Minecraft, which no agent can do. An issue whose acceptance criteria
include an observed in-game behaviour is `ready-for-human` even if every file change is
mechanical.

## Additional label groups

Beyond the five roles, this repo uses four groups. They are the T4 delta — the canonical five
come from the pocock skills, these do not.

- **Component** — exactly one per issue:
  `pack-infra` · `create` · `combat` · `threat` · `civilization` · `city-systems` ·
  `progression` · `qol`
- **Type** — one or more:
  `Bug` · `Feature` · `tech-debt` · `security` · `Optimization` · `Cleanup` · `Test`
- **Severity** — exactly one on any `Bug` or `security` issue:
  `critical` · `Major` · `Minor`
- **Lifecycle** — optional:
  `Latent` (exists in the config or code but has not manifested yet) ·
  `Dormant` (real, deliberately deprioritised)

### What each Component owns

| Label | Owns |
|---|---|
| `pack-infra` | packwiz, CI, hooks, guards, repo layout, tooling |
| `create` | Create and its addons — the technological backbone |
| `combat` | TaCZ, guns, ammunition, TTK, tactical gear |
| `threat` | Mobs, Hordes, spawn director, Enhanced AI, dragons |
| `civilization` | MineColonies, food, seasons, NPC settlement |
| `city-systems` | Electricity, security, CCTV, lighting, radio |
| `progression` | KubeJS recipes, quests, the balance curve |
| `qol` | Immersion and quality-of-life, including both Addon Specs |

## Conventions

- Every issue carries **at least one triage-state label** and **exactly one Component label**.
- **A `security` issue must be `critical` or `Major`.** A `Minor` security label is not valid.
- A `Latent` bug that activates is upgraded to a full `Bug` issue with a severity.
- `Optimization` in this repo usually means MSPT, TPS, entity count, chunk load, or client FPS —
  see the performance sections of the design documents before opening one.

## Installed state

All 25 labels exist on `xenodeve/minecraft-100day` as of 2026-08-25 — **23 created, 2
pre-existing** (`wontfix`, and GitHub's default `bug`, renamed to `Bug` so the tracker matches
this file). GitHub's other default labels (`documentation`, `duplicate`, `enhancement`,
`good first issue`, `help wanted`, `invalid`, `question`, `accessibility`) were left in place but
are **not** part of this vocabulary; `enhancement` in particular duplicates `Feature` — prefer
`Feature`.

The `wayfinder:*` labels named in `docs/agents/issue-tracker.md` are **not** created. Create them
at first use of `/wayfinder`.
<!-- lang:end -->

<!-- lang:th -->
# Triage Labels — ภาษาไทย

skill ต่าง ๆ พูดถึง triage role มาตรฐานห้าตัว ไฟล์นี้แม็ป role เหล่านั้นเข้ากับสตริง label จริงที่
issue tracker ของ repo นี้ใช้

| Label ใน mattpocock/skills | Label ใน tracker ของเรา | ความหมาย                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | maintainer ต้องประเมิน issue นี้  |
| `needs-info`               | `needs-info`         | รอข้อมูลเพิ่มจากผู้รายงาน |
| `ready-for-agent`          | `ready-for-agent`    | ระบุครบแล้ว พร้อมให้ agent ทำแบบ AFK  |
| `ready-for-human`          | `ready-for-human`    | ต้องให้คนลงมือ            |
| `wontfix`                  | `wontfix`            | จะไม่ดำเนินการ                       |

เมื่อ skill พูดถึง role ตัวใด (เช่น "apply the AFK-ready triage label") ให้ใช้สตริง label ที่ตรงกัน
จากตารางนี้

การแม็ปที่นี่เป็นซ้าย=ขวา — repo นี้รับชื่อมาตรฐานมาใช้ตรง ๆ ให้แก้คอลัมน์ขวาถ้าวันหนึ่งมันไม่จริง
อีกต่อไป

**`ready-for-human` มีน้ำหนักพิเศษใน repo นี้** การ verify ที่สำคัญส่วนใหญ่ที่นี่ต้องเปิด Minecraft
ซึ่งไม่มี agent ตัวไหนทำได้ issue ที่เกณฑ์การปิดงานมีพฤติกรรมที่ต้องสังเกตในเกม ถือเป็น
`ready-for-human` แม้ว่าการแก้ไฟล์ทุกจุดจะเป็นงานเชิงกลก็ตาม

## กลุ่ม label เพิ่มเติม

นอกจาก role ทั้งห้า repo นี้ใช้อีกสี่กลุ่ม กลุ่มเหล่านี้คือส่วนต่างของ T4 — ห้าตัวมาตรฐานมาจาก
skill ของ pocock ส่วนพวกนี้ไม่ใช่

- **Component** — หนึ่งตัวต่อ issue เท่านั้น:
  `pack-infra` · `create` · `combat` · `threat` · `civilization` · `city-systems` ·
  `progression` · `qol`
- **Type** — หนึ่งตัวหรือมากกว่า:
  `Bug` · `Feature` · `tech-debt` · `security` · `Optimization` · `Cleanup` · `Test`
- **Severity** — หนึ่งตัวเท่านั้นบน issue ที่เป็น `Bug` หรือ `security`:
  `critical` · `Major` · `Minor`
- **Lifecycle** — ใส่หรือไม่ใส่ก็ได้:
  `Latent` (มีอยู่ใน config หรือโค้ดแล้วแต่ยังไม่แสดงอาการ) ·
  `Dormant` (เป็นเรื่องจริง แต่จงใจลดความสำคัญ)

### แต่ละ Component ดูแลอะไร

| Label | ดูแล |
|---|---|
| `pack-infra` | packwiz, CI, hooks, guards, ผังของ repo, เครื่องมือ |
| `create` | Create และ addon ของมัน — กระดูกสันหลังทางเทคโนโลยี |
| `combat` | TaCZ, ปืน, กระสุน, TTK, อุปกรณ์ tactical |
| `threat` | Mob, Horde, spawn director, Enhanced AI, มังกร |
| `civilization` | MineColonies, อาหาร, ฤดูกาล, นิคมของ NPC |
| `city-systems` | ไฟฟ้า, ความปลอดภัย, CCTV, แสงสว่าง, วิทยุ |
| `progression` | KubeJS recipe, quest, เส้นโค้งของ balance |
| `qol` | ความสมจริงและความสะดวก รวมถึง Addon Spec ทั้งสองใบ |

## ธรรมเนียม

- ทุก issue ต้องมี **triage-state label อย่างน้อยหนึ่งตัว** และ **Component label หนึ่งตัวพอดี**
- **issue ที่เป็น `security` ต้องมี `critical` หรือ `Major`** label `security` ที่เป็น `Minor`
  ถือว่าไม่ถูกต้อง
- bug ที่เป็น `Latent` แล้วเกิดขึ้นจริง ให้อัปเกรดเป็น issue `Bug` เต็มตัวพร้อม severity
- `Optimization` ใน repo นี้มักหมายถึง MSPT, TPS, จำนวน entity, การโหลด chunk หรือ FPS ฝั่ง
  client — อ่านหัวข้อเรื่อง performance ในเอกสารออกแบบก่อนเปิด issue ประเภทนี้

## สถานะที่ติดตั้งแล้ว

label ทั้ง 25 ตัวมีอยู่บน `xenodeve/minecraft-100day` แล้ว ณ วันที่ 2026-08-25 — **สร้างใหม่ 23
มีอยู่ก่อน 2** (`wontfix` และ `bug` ที่เป็นค่าเริ่มต้นของ GitHub ซึ่งถูกเปลี่ยนชื่อเป็น `Bug` เพื่อให้
tracker ตรงกับไฟล์นี้) label เริ่มต้นอื่น ๆ ของ GitHub (`documentation`, `duplicate`,
`enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `accessibility`) ถูกทิ้ง
ไว้ตามเดิม แต่ **ไม่ใช่** ส่วนหนึ่งของ vocabulary นี้ โดยเฉพาะ `enhancement` ที่ซ้ำกับ `Feature` —
ให้ใช้ `Feature`

label `wayfinder:*` ที่ระบุไว้ใน `docs/agents/issue-tracker.md` **ยังไม่ถูกสร้าง** ให้สร้างตอนใช้
`/wayfinder` ครั้งแรก
<!-- lang:end -->
