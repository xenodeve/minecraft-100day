<!-- lang:en -->
# Reading Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring.

> **Why this file is not called `domain.md`.** `/setup-matt-pocock-skills` writes these consumer
> rules to `docs/agents/domain.md`. In this repo that path already holds the **domain glossary** —
> a different document that happens to share the filename. They live side by side:
>
> - **`docs/agents/domain.md`** — *what the words mean here*. The glossary.
> - **`docs/agents/reading-domain-docs.md`** — *which files to read, and when*. This file.
>
> Reported upstream as [xenodeve/xeno-skills#334](https://github.com/xenodeve/xeno-skills/issues/334).

## Before exploring, read these

- **`docs/agents/domain.md`** — the canonical glossary for this repo. This is the one that
  actually exists; read it first.
- **`CONTEXT.md`** at the repo root — **does not exist yet**, and that is deliberate. The Seed
  tier defers it until a bounded context is worth writing down. If it appears later it becomes
  the system-context doc and defers to the glossary on any conflict.
- **`docs/adr/`** — read the ADRs that touch the area you are about to work in, before proposing
  an alternative. The index is `docs/adr/README.md`.
- **The design documents** — for a modpack, intent lives in prose, not in code:
  - `docs/Industrial Civilization Survival — Claude Code Handoff & Implementation Plan.md`
  - `docs/Addon Spec — Crafting Assistance + Tactical Tracker.md`
  - `docs/Addon Spec — Natural Wildlife & Ecology.md`
  - `docs/Addon Modpack — Distribution & Updates.md` — governs this repo's own release process

If any of these do not exist, **proceed silently**. Do not flag their absence; do not suggest
creating them upfront. They are created lazily, when a term or a decision actually resolves.

## File structure

Single-context repo — one glossary and one ADR directory for the whole repo:

```
/
├── docs/
│   ├── agents/
│   │   ├── domain.md               ← the glossary
│   │   └── reading-domain-docs.md  ← this file
│   ├── adr/
│   │   ├── README.md
│   │   └── 0001-ci-gate-scoped-to-modpack-reality.md
│   └── <the design documents>
└── (config/, kubejs/, datapacks/ — created by the pack work, not yet present)
```

There is no `CONTEXT-MAP.md`, and no reason to expect one: a modpack is a single bounded context
by nature. Revisit only if the repo ever gains a genuinely separate second deliverable — a
Season 2 pack maintained in parallel would be the plausible case.

## Use the glossary's vocabulary

When your output names a domain concept — an issue title, a refactor proposal, a hypothesis, a
config comment, a KubeJS identifier — use the term exactly as `docs/agents/domain.md` defines it.
Do not drift to a synonym listed under "aliases to avoid".

**In this repo the aliases are not stylistic.** Each one carries a design assumption the pack
rejected. Calling a Horde a "raid" imports MineColonies' event as if it were the same system;
calling the Create layer "the main tech mod" invites a second one; "HP sponge" is named in the
glossary specifically so that proposing one is recognisable as a proposal to break Rule 3.

If the concept you need is not in the glossary yet, that is a signal — either you are inventing
language the project does not use (reconsider), or there is a real gap worth adding.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently
overriding:

> *Contradicts ADR-0001 (CI gate scoped to what a modpack repo can check) — but worth reopening
> because…*

The same applies to the design documents, which function as ADRs the pack was born with. §6 of
the handoff doc lists mods rejected by design; re-adding one is a decision that needs a new
stated reason recorded as an ADR, not a preference expressed in a PR body.
<!-- lang:end -->

<!-- lang:th -->
# Reading Domain Docs — ภาษาไทย

skill ด้านวิศวกรรมควรอ่านเอกสาร domain ของ repo นี้อย่างไรตอนสำรวจ

> **ทำไมไฟล์นี้ไม่ได้ชื่อ `domain.md`** `/setup-matt-pocock-skills` เขียน consumer rules เหล่านี้
> ลงที่ `docs/agents/domain.md` แต่ใน repo นี้ path นั้นเก็บ **domain glossary** อยู่แล้ว —
> เป็นคนละเอกสารที่บังเอิญชื่อไฟล์เหมือนกัน ทั้งสองอยู่คู่กัน:
>
> - **`docs/agents/domain.md`** — *คำแต่ละคำแปลว่าอะไรที่นี่* คือ glossary
> - **`docs/agents/reading-domain-docs.md`** — *ต้องอ่านไฟล์ไหน และอ่านเมื่อไร* คือไฟล์นี้
>
> รายงานไปที่ต้นทางแล้วที่ [xenodeve/xeno-skills#334](https://github.com/xenodeve/xeno-skills/issues/334)

## ก่อนสำรวจ ให้อ่านสิ่งเหล่านี้

- **`docs/agents/domain.md`** — glossary มาตรฐานของ repo นี้ เป็นตัวที่มีอยู่จริง อ่านตัวนี้ก่อน
- **`CONTEXT.md`** ที่ราก repo — **ยังไม่มี** และนั่นเป็นความตั้งใจ Seed tier เลื่อนมันไว้จนกว่าจะมี
  bounded context ที่คุ้มค่าจะเขียนลงไป ถ้ามันปรากฏขึ้นภายหลัง มันจะกลายเป็นเอกสาร
  system-context และยอมให้ glossary ชนะเมื่อขัดกัน
- **`docs/adr/`** — อ่าน ADR ที่แตะพื้นที่ที่คุณกำลังจะทำงาน ก่อนจะเสนอทางเลือกอื่น ดัชนีอยู่ที่
  `docs/adr/README.md`
- **เอกสารออกแบบ** — สำหรับ modpack เจตนาอยู่ในความเรียง ไม่ได้อยู่ในโค้ด:
  - `docs/Industrial Civilization Survival — Claude Code Handoff & Implementation Plan.md`
  - `docs/Addon Spec — Crafting Assistance + Tactical Tracker.md`
  - `docs/Addon Spec — Natural Wildlife & Ecology.md`
  - `docs/Addon Modpack — Distribution & Updates.md` — governs this repo's own release process

ถ้าไฟล์ใดไม่มี ให้ **ทำต่อไปเงียบ ๆ** อย่าไปทักว่ามันหายไป อย่าเสนอให้สร้างล่วงหน้า มันถูกสร้าง
แบบ lazy เมื่อคำศัพท์หรือการตัดสินใจได้ข้อสรุปจริง ๆ

## โครงสร้างไฟล์

repo แบบ single-context — glossary หนึ่งตัวและไดเรกทอรี ADR หนึ่งตัวสำหรับทั้ง repo:

```
/
├── docs/
│   ├── agents/
│   │   ├── domain.md               ← glossary
│   │   └── reading-domain-docs.md  ← ไฟล์นี้
│   ├── adr/
│   │   ├── README.md
│   │   └── 0001-ci-gate-scoped-to-modpack-reality.md
│   └── <เอกสารออกแบบ>
└── (config/, kubejs/, datapacks/ — ถูกสร้างโดยงานทำ pack ยังไม่มีตอนนี้)
```

ไม่มี `CONTEXT-MAP.md` และไม่มีเหตุให้คาดว่าจะมี: modpack เป็น bounded context เดียวโดยธรรมชาติ
จะกลับมาทบทวนก็ต่อเมื่อ repo มี deliverable ที่แยกกันจริง ๆ ตัวที่สอง — กรณีที่เป็นไปได้คือ pack
Season 2 ที่ดูแลคู่ขนานกันไป

## ใช้คำศัพท์ตาม glossary

เมื่อผลลัพธ์ของคุณเอ่ยถึงแนวคิดใน domain — หัวข้อ issue, ข้อเสนอ refactor, สมมติฐาน, comment ใน
config, identifier ของ KubeJS — ให้ใช้คำตามที่ `docs/agents/domain.md` นิยามไว้เป๊ะ ๆ อย่าเลื่อน
ไปใช้คำพ้องที่อยู่ในรายการ "ห้ามใช้"

**ใน repo นี้ คำที่ห้ามใช้ไม่ใช่เรื่องสไตล์** แต่ละคำพ่วงสมมติฐานเชิงดีไซน์ที่ pack ปฏิเสธไปแล้ว
การเรียก Horde ว่า "raid" คือการลากอีเวนต์ของ MineColonies เข้ามาราวกับเป็นระบบเดียวกัน การเรียก
ชั้นของ Create ว่า "tech mod หลัก" คือการเปิดช่องให้มีตัวที่สอง ส่วน "HP sponge" ถูกใส่ไว้ใน
glossary โดยเฉพาะ เพื่อให้การเสนอมันถูกจับได้ว่าเป็นการเสนอให้ละเมิด Rule 3

ถ้าแนวคิดที่ต้องการยังไม่อยู่ใน glossary นั่นคือสัญญาณ — ไม่คุณกำลังคิดคำใหม่ที่โปรเจกต์ไม่ได้ใช้
(ให้ทบทวน) ก็มีช่องว่างจริงที่ควรเติมเข้าไป

## ทักเมื่อขัดกับ ADR

ถ้าผลลัพธ์ของคุณขัดกับ ADR ที่มีอยู่ ให้พูดออกมาตรง ๆ แทนที่จะ override เงียบ ๆ:

> *ขัดกับ ADR-0001 (CI gate scoped to what a modpack repo can check) — แต่คุ้มที่จะรื้อกลับมาคุย
> เพราะ…*

ใช้กับเอกสารออกแบบด้วยเช่นกัน เพราะมันทำหน้าที่เหมือน ADR ที่ pack เกิดมาพร้อมกับมัน §6 ของ
handoff doc ระบุ mod ที่ถูกปฏิเสธโดยการออกแบบไว้ การเอากลับเข้ามาคือการตัดสินใจที่ต้องมีเหตุผล
ใหม่ที่ระบุชัดและบันทึกเป็น ADR ไม่ใช่ความชอบที่แสดงออกใน body ของ PR
<!-- lang:end -->
