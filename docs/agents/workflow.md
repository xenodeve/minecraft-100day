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

## Branching and releases

The target model is Distribution Spec §22:

```
main       stable / playable — what a friend has installed
develop    integration
feature/*  experimental changes
```

**`develop` does not exist yet, deliberately.** Its purpose is to keep unfinished integration away
from a `main` that people are running, and nobody is running anything: there is no pack, no
release, and one person on the repo. It is created — with its own ruleset — in the same change
that cuts the first `v0.x.0-alpha` tag, which is the moment `main` starts meaning something to
someone else. Tracked in the ledger.

**Until then**, work branches off `main` and returns by PR. Name the branch so
`.githooks/check-issue-ref` can see the issue number in the slug position:

```
chore/7-fold-distribution-spec        ✓  number right after the type prefix
chore/fold-spec-7                     ✗  not in the slug position
```

**The Season 2 high-risk stack** — Valkyrien Skies, Clockwork, Warium, advanced TFMG integration —
stays on its own branch (`feature/season2-aviation`) until it boots clean. It is never merged to
`main` on the strength of "it worked once".

**Release tags** are `v0.1.0-alpha`, `v0.4.0-beta`, `v1.0.0`. A tag must match the distributed
artifact exactly, and every version gets a `CHANGELOG.md` entry. A build from `develop` or a
feature branch is a **dev build** and is never handed to a friend as if it were a release.

**Before publishing anything**, the release gate is Distribution Spec §16 — twelve in-game tests.
*"The game launches once"* is explicitly not a release gate. None of it can be automated.

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

## Branch และการปล่อยเวอร์ชัน

โมเดลเป้าหมายคือ Distribution Spec §22:

```
main       stable / playable — สิ่งที่เพื่อนติดตั้งไว้
develop    integration
feature/*  การเปลี่ยนแปลงเชิงทดลอง
```

**`develop` ยังไม่มี โดยตั้งใจ** วัตถุประสงค์ของมันคือกันงาน integration ที่ยังไม่เสร็จออกจาก `main`
ที่คนกำลังเล่นอยู่ และตอนนี้ไม่มีใครเล่นอะไรเลย: ไม่มี pack ไม่มี release และมีคนเดียวใน repo
มันจะถูกสร้าง — พร้อม ruleset ของตัวเอง — ใน change เดียวกับที่ตัด tag `v0.x.0-alpha` แรก ซึ่งเป็น
จังหวะที่ `main` เริ่มมีความหมายกับคนอื่น บันทึกไว้ใน ledger

**จนกว่าจะถึงตอนนั้น** งานแตก branch จาก `main` แล้วกลับมาด้วย PR ตั้งชื่อ branch ให้
`.githooks/check-issue-ref` เห็นเลข issue ในตำแหน่ง slug:

```
chore/7-fold-distribution-spec        ✓  เลขอยู่ถัดจาก type prefix ทันที
chore/fold-spec-7                     ✗  ไม่ได้อยู่ในตำแหน่ง slug
```

**stack ความเสี่ยงสูงของ Season 2** — Valkyrien Skies, Clockwork, Warium, การ integrate TFMG
ขั้นสูง — อยู่บน branch ของตัวเอง (`feature/season2-aviation`) จนกว่าจะ boot ผ่านสะอาด ห้าม merge
เข้า `main` ด้วยเหตุผลว่า "มันเคยทำงานได้ครั้งหนึ่ง"

**Release tag** ใช้รูป `v0.1.0-alpha`, `v0.4.0-beta`, `v1.0.0` tag ต้องตรงกับ artifact ที่แจกจ่าย
เป๊ะ ๆ และทุกเวอร์ชันต้องมีรายการใน `CHANGELOG.md` ส่วน build จาก `develop` หรือ feature branch
คือ **dev build** ห้ามส่งให้เพื่อนราวกับว่าเป็น release

**ก่อน publish อะไรก็ตาม** release gate คือ Distribution Spec §16 — เทสต์ในเกม 12 ข้อ
*"เกมเปิดได้ครั้งหนึ่ง"* ไม่ถือเป็น release gate โดยระบุชัด และไม่มีข้อไหนอัตโนมัติได้

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
