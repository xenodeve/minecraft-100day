<!-- lang:en -->
# Agent Workflow

How agents plan and implement in this repo, and which skills to invoke automatically.

## Development workflow

When planning or implementing a change, follow this order:

1. **`/grill-me`** — stress-test the concept first (interview-style)
2. **`/grill-with-docs`** — challenge the plan against existing ADRs in `docs/adr/`
3. **Survey the change sites** — enumerate every place the change touches, before the plan exists
4. **`/to-prd`** — create a PRD from the grilled plan (one PRD per epic), carrying the survey as its change inventory
5. **`/to-issues`** — break the PRD into GitHub issues on `xenodeve/minecraft-100day` with triage labels (one issue per deliverable)
6. **`/tdd`** — implement test-first, then make the tests pass

Hard ordering: **PRD → issues → PR**. Never open a PR without a referenced issue.

## What "test-first" means in a modpack repo

This repo has no unit-test runner, so `/tdd` maps onto the pack's own evidence loop — the
boot/regression protocol in `docs/Industrial Civilization Survival — Claude Code Handoff &
Implementation Plan.md` (§26 Boot Testing Strategy, §27 Regression Tests). The order is the
same and the discipline is the same: **state the observable that must change, before
changing it.**

| TDD step | What it is here |
|---|---|
| **Red** | Write down the observable you expect to be wrong today — a recipe that resolves, a mob that spawns at a given distance, a TTK number, a `latest.log` line. Confirm it is actually wrong by launching and looking. |
| **Green** | Make the smallest config / KubeJS / datapack change that flips it. |
| **Refactor** | Fold the measured value into `docs/balance.md` and delete any duplicate that now disagrees with it. |

**"It should work" is not Green.** A config key you did not observe taking effect is a
hypothesis. Mod config schemas differ per build, and the pack fails open: an unknown key is
ignored silently, so a typo looks exactly like a working setting.

## Verification mandate

Run `node scripts/validate/verify.mjs` before every push — it is what the local ship gate
and the CI `lint` / `test` checks both run.

It does not launch the game. A change to `config/`, `kubejs/`, or `datapacks/` is not
verified until the pack has been launched, a fresh world created, the world reloaded, and
`latest.log` plus `crash-reports/` checked (§26). Record what you observed, not what you
expected.

**Add mods in small batches, and never more than one batch between launches.** The
compatibility matrix in `docs/compatibility-matrix.md` is the record of what has actually
been run, not of what ought to work.

## Auto-triggered skills

| Trigger | Skill | Condition |
|---|---|---|
| Bug / error / stack trace / crash report | `/debug-mantra` | Start a debug session every time |
| After fixing a bug | `/post-mortem` | Record root cause + fix + validation |
| After writing or changing code | `/simplify` | Before committing — check over-engineering |
| Before merge / ship | `/code-review` + `/scrutinize` | Correctness + outsider perspective |
| Touching a security boundary | `/security-review` | Every time code crosses auth / secret / token |
| After implementation | `/verify` | Confirm the change works in the actual pack |

## Delegation

`clink-subagents` is the delegation default in this repo — see `CLAUDE.md`. Two rules do not
relax: **verify everything a subagent returns**, and **never delegate the final verification**
or a security-boundary change.

Note that most work here is game config that cannot be verified without launching the game,
which a subagent cannot do. Delegate research (reading a mod's config schema, sweeping
CurseForge / Modrinth for exact versions) and bulk mechanical edits; keep every balance
judgment and every "it actually works" claim.
<!-- lang:end -->

<!-- lang:th -->
# Agent Workflow — ภาษาไทย

Agent วางแผนและลงมือทำงานใน repo นี้อย่างไร และต้องเรียก skill ไหนโดยอัตโนมัติ

## ลำดับการทำงาน

เวลาวางแผนหรือลงมือทำ change ให้ทำตามลำดับนี้:

1. **`/grill-me`** — เค้นแนวคิดให้หนักก่อน (แบบสัมภาษณ์)
2. **`/grill-with-docs`** — ท้าทายแผนกับ ADR ที่มีอยู่ใน `docs/adr/`
3. **Survey the change sites** — ไล่ให้ครบว่า change นี้ไปแตะตรงไหนบ้าง ก่อนที่แผนจะถูกเขียน
4. **`/to-prd`** — แปลงแผนที่ผ่านการเค้นแล้วเป็น PRD (หนึ่ง PRD ต่อหนึ่ง epic) โดยเอา survey ไปเป็น change inventory ของมัน
5. **`/to-issues`** — แตก PRD ออกเป็น GitHub issue บน `xenodeve/minecraft-100day` พร้อม triage label (หนึ่ง issue ต่อหนึ่ง deliverable)
6. **`/tdd`** — เขียน test ก่อน แล้วค่อยทำให้ test ผ่าน

ลำดับที่ห้ามสลับ: **PRD → issues → PR** ห้ามเปิด PR โดยไม่มี issue อ้างอิงเด็ดขาด

## "test-first" ใน repo แบบ modpack แปลว่าอะไร

repo นี้ไม่มี unit-test runner ดังนั้น `/tdd` จึง map ลงบน evidence loop ของ pack เอง — คือ
boot/regression protocol ใน `docs/Industrial Civilization Survival — Claude Code Handoff &
Implementation Plan.md` (§26 Boot Testing Strategy, §27 Regression Tests) ลำดับเหมือนกันและ
วินัยเหมือนกัน: **ระบุสิ่งที่ต้องสังเกตเห็นว่าเปลี่ยน ก่อนจะลงมือเปลี่ยน**

| ขั้นของ TDD | ในที่นี้คืออะไร |
|---|---|
| **Red** | เขียนลงไปก่อนว่าวันนี้สิ่งที่ต้องสังเกตนั้นผิดยังไง — recipe ที่ resolve ได้, mob ที่ spawn ที่ระยะเท่าไหร่, ตัวเลข TTK, บรรทัดใน `latest.log` แล้วยืนยันว่ามันผิดจริงด้วยการเปิดเกมดู |
| **Green** | แก้ config / KubeJS / datapack ให้น้อยที่สุดเท่าที่จะพลิกผลนั้นได้ |
| **Refactor** | ย้ายค่าที่วัดได้เข้าไปใน `docs/balance.md` แล้วลบตัวซ้ำที่ตอนนี้ขัดกับมันทิ้ง |

**"น่าจะทำงาน" ไม่ใช่ Green** config key ที่ยังไม่ได้เห็นกับตาว่ามีผลจริง คือ hypothesis —
schema ของ config แต่ละ mod ต่างกันไปตาม build และ pack นี้ fail open: key ที่ไม่รู้จักจะถูก
ข้ามไปเงียบ ๆ ดังนั้นพิมพ์ผิดกับตั้งค่าสำเร็จหน้าตาเหมือนกันเป๊ะ

## ข้อบังคับเรื่องการ verify

รัน `node scripts/validate/verify.mjs` ก่อน push ทุกครั้ง — นี่คือสิ่งที่ทั้ง local ship gate
และ CI check `lint` / `test` รันเหมือนกัน

มันไม่ได้เปิดเกมให้ การแก้ `config/`, `kubejs/` หรือ `datapacks/` จะยังไม่ถือว่า verified
จนกว่าจะเปิด pack, สร้าง world ใหม่, โหลด world ซ้ำ แล้วเช็ค `latest.log` กับ `crash-reports/`
(§26) ให้บันทึกสิ่งที่สังเกตเห็นจริง ไม่ใช่สิ่งที่คาดว่าจะเห็น

**ลง mod ทีละ batch เล็ก ๆ และห้ามลงเกินหนึ่ง batch ระหว่างการเปิดเกมสองครั้ง**
compatibility matrix ใน `docs/compatibility-matrix.md` คือบันทึกของสิ่งที่รันจริงแล้ว ไม่ใช่
ของสิ่งที่ควรจะทำงานได้

## Skill ที่ trigger อัตโนมัติ

| Trigger | Skill | เงื่อนไข |
|---|---|---|
| Bug / error / stack trace / crash report | `/debug-mantra` | เริ่ม debug session ทุกครั้ง |
| หลังแก้ bug เสร็จ | `/post-mortem` | บันทึก root cause + fix + validation |
| หลังเขียนหรือแก้โค้ด | `/simplify` | ก่อน commit — เช็คว่า over-engineer ไหม |
| ก่อน merge / ship | `/code-review` + `/scrutinize` | ความถูกต้อง + มุมมองคนนอก |
| แตะ security boundary | `/security-review` | ทุกครั้งที่โค้ดข้าม auth / secret / token |
| หลัง implement เสร็จ | `/verify` | ยืนยันว่า change ทำงานจริงใน pack |

## การ delegate

`clink-subagents` เป็น default ของการ delegate ใน repo นี้ — ดู `CLAUDE.md` มีสองกฎที่ไม่ผ่อน:
**verify ทุกอย่างที่ subagent ส่งกลับมา** และ **ห้าม delegate การ verify ครั้งสุดท้าย** หรือ
change ที่แตะ security boundary

พึงระวังว่างานส่วนใหญ่ที่นี่คือ game config ที่ verify ไม่ได้ถ้าไม่เปิดเกม ซึ่ง subagent ทำไม่ได้
ให้ delegate งานค้นคว้า (อ่าน config schema ของ mod, กวาดเวอร์ชันจาก CurseForge / Modrinth)
กับงานแก้เชิงกลจำนวนมาก แต่เก็บทุกการตัดสินใจเรื่อง balance และทุกคำกล่าวอ้างว่า
"มันทำงานจริง" ไว้กับตัวเอง
<!-- lang:end -->
