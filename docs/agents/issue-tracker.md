<!-- lang:en -->
# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues on `xenodeve/minecraft-100day`. Use the `gh`
CLI for all operations.

> **`gh` path and auth.** `gh` is installed but **not on the shell PATH**. Call it as
> `"/c/Program Files/GitHub CLI/gh.exe"` (v2.95.0). Authenticated as `xenodeve`; token scopes
> include `repo` and `workflow`. `command -v gh` returns nothing — that is expected and does not
> mean gh is missing. See `Obsidian-minecraft-100day/dev-machine-tooling.md`.

## Language: bilingual bodies (English + Thai)

Every issue body, PRD body, and PR description must be **bilingual**:

- **Title**: English, conventional-commit style — e.g. `fix(combat): …`, `chore(pack-infra): …`.
  The scope is normally the Component label.
- **Body**: each section in English, then a mirrored Thai version — a `## สรุปภาษาไทย` section
  covering the whole body, or `EN / TH` paired sections for long documents.
- **The Thai must mirror the English exactly** — same detail, same sentence count, same bullets,
  same tables. "สรุป" is not a summary; never shorten or omit.
- Code identifiers, filenames, log excerpts, mod names, and acceptance-criteria checkboxes stay
  English; the Thai explains them, never translates them.
- **Review-reply comments may be English-only.** Anything a teammate reads in order to *decide*
  gets both languages.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body-file <file>`. Use a file rather than
  `--body` for anything multi-line — bilingual bodies contain characters that do not survive
  shell quoting well.
- **Read an issue**: `gh issue view <n> --comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`, with
  `--label` and `--state` filters as needed.
- **Comment**: `gh issue comment <n> --body-file <file>`.
- **Apply / remove labels**: `gh issue edit <n> --add-label "..."` / `--remove-label "..."`.
- **Close, always with a reason**: `gh issue close <n> --comment "<reason + evidence>"`. Valid
  reasons: completed-with-evidence · cancelled · duplicate · wontfix · stale. Never close
  silently, and never leave finished work open.

`gh` infers the repo from `git remote -v` when run inside the clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** *(Set to `yes` if this repo starts treating external PRs as
feature requests; `/triage` reads this flag.)*

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr`
equivalents:

- **Read a PR**: `gh pr view <n> --comments`, and `gh pr diff <n>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`,
  then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE`
  (drop `OWNER` / `MEMBER` / `COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label` / `--remove-label`,
  `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve
with `gh pr view 42` and fall back to `gh issue view 42`.

## Merge gate

`main` is protected by the `T4 main gate` ruleset: direct pushes are blocked, `main` cannot be
force-pushed or deleted, and an unresolved review thread blocks merge. **Required status checks
are permanently absent** — GitHub Actions is billing-locked and that cannot be resolved, so the
`T4 verify` workflow is disabled rather than left failing on every push. See
`docs/adr/0002-operate-without-a-server-side-ci-tier.md`.

**Merge from the CLI, not the web UI.** `gh pr merge` passes through `t4-gate`, which runs
`node scripts/validate/verify.mjs` first and blocks on failure. The web merge button runs nothing
at all — with no CI tier, it is the one path where a broken change can reach `main` unchecked.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <n> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog
  body. `gh issue create --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue (`gh api` on the sub-issues
  endpoint). Where sub-issues are not enabled, add the child to a task list in the map body and
  put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>`
  (`research` / `prototype` / `grilling` / `task`). Once claimed, the ticket is assigned to the
  driving dev.
- **Blocking**: GitHub's **native issue dependencies**. Add an edge with
  `gh api --method POST repos/xenodeve/minecraft-100day/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`,
  where `<blocker-db-id>` is the blocker's numeric **database id**
  (`gh api repos/xenodeve/minecraft-100day/issues/<n> --jq .id` — *not* the `#number` or
  `node_id`). GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only). Where
  dependencies are unavailable, fall back to a `Blocked by: #<n>, #<n>` line at the top of the
  child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children, drop any with an open blocker
  (`issue_dependencies_summary.blocked_by > 0`) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me` — the session's first write.
- **Resolve**: `gh issue comment <n>`, then `gh issue close <n>`, then append a context pointer
  to the map's Decisions-so-far.

## Labels for wayfinding

The `wayfinder:*` labels above are **not created yet** — this repo has not used `/wayfinder`.
Create them with `gh label create` at first use rather than pre-creating a vocabulary nothing
applies. See `docs/agents/triage-labels.md` for the labels that *do* exist.
<!-- lang:end -->

<!-- lang:th -->
# Issue tracker: GitHub — ภาษาไทย

Issue และ PRD ของ repo นี้อยู่ในรูปของ GitHub issue บน `xenodeve/minecraft-100day` ใช้ `gh` CLI
สำหรับทุกการทำงาน

> **path และ auth ของ `gh`** `gh` ติดตั้งแล้วแต่ **ไม่อยู่ใน PATH ของ shell** ให้เรียกเป็น
> `"/c/Program Files/GitHub CLI/gh.exe"` (v2.95.0) login ในชื่อ `xenodeve` scope ของ token
> มี `repo` และ `workflow` `command -v gh` จะไม่คืนอะไร — นั่นเป็นเรื่องปกติและไม่ได้แปลว่า
> gh หายไป ดู `Obsidian-minecraft-100day/dev-machine-tooling.md`

## ภาษา: body สองภาษา (อังกฤษ + ไทย)

ทุก issue body, PRD body และ PR description ต้องเป็น **สองภาษา**:

- **หัวข้อ**: อังกฤษ สไตล์ conventional-commit เช่น `fix(combat): …`, `chore(pack-infra): …`
  โดยปกติ scope คือ Component label
- **เนื้อหา**: แต่ละหัวข้อเป็นอังกฤษ แล้วตามด้วยฉบับไทยที่สะท้อนกัน — จะเป็นหัวข้อ
  `## สรุปภาษาไทย` ที่ครอบทั้ง body หรือจับคู่ `EN / TH` รายหัวข้อสำหรับเอกสารยาวก็ได้
- **ภาษาไทยต้องสะท้อนภาษาอังกฤษเป๊ะ ๆ** — รายละเอียดเท่ากัน จำนวนประโยคเท่ากัน bullet เท่ากัน
  ตารางเท่ากัน "สรุป" ไม่ได้แปลว่าย่อ ห้ามตัดทอนหรือละ
- Code identifier, ชื่อไฟล์, ท่อน log, ชื่อ mod และ checkbox ของ acceptance criteria คงเป็น
  ภาษาอังกฤษ ภาษาไทยอธิบายรอบ ๆ มัน ไม่ใช่แปลมัน
- **comment ที่ตอบ review เป็นอังกฤษอย่างเดียวได้** สิ่งใดที่เพื่อนร่วมทีมอ่านเพื่อ*ตัดสินใจ*
  ต้องมีสองภาษา

## ธรรมเนียมการใช้งาน

- **สร้าง issue**: `gh issue create --title "..." --body-file <file>` ใช้ไฟล์แทน `--body`
  สำหรับอะไรที่หลายบรรทัด — body สองภาษามีอักขระที่ผ่านการ quote ของ shell ได้ไม่ดี
- **อ่าน issue**: `gh issue view <n> --comments`
- **ลิสต์ issue**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`
  พร้อม `--label` และ `--state` ตามต้องการ
- **comment**: `gh issue comment <n> --body-file <file>`
- **ใส่ / ถอด label**: `gh issue edit <n> --add-label "..."` / `--remove-label "..."`
- **ปิดพร้อมเหตุผลเสมอ**: `gh issue close <n> --comment "<เหตุผล + หลักฐาน>"` เหตุผลที่ใช้ได้:
  completed-with-evidence · cancelled · duplicate · wontfix · stale ห้ามปิดเงียบ ๆ และห้ามปล่อย
  งานที่เสร็จแล้วเปิดค้างไว้

`gh` เดา repo จาก `git remote -v` ให้เองเมื่อรันอยู่ใน clone

## Pull request ในฐานะช่องทาง triage

**PR เป็นช่องทางรับคำขอ: ไม่** *(ตั้งเป็น `yes` ถ้า repo นี้เริ่มถือว่า PR จากภายนอกคือคำขอ
feature; `/triage` อ่าน flag นี้)*

เมื่อตั้งเป็น `yes` PR จะเดินผ่าน label และสถานะชุดเดียวกับ issue โดยใช้คำสั่ง `gh pr` ที่เทียบเท่า:

- **อ่าน PR**: `gh pr view <n> --comments` และ `gh pr diff <n>` สำหรับดู diff
- **ลิสต์ PR จากภายนอกเพื่อ triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`
  แล้วเก็บเฉพาะ `authorAssociation` ที่เป็น `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR` หรือ `NONE`
  (ตัด `OWNER` / `MEMBER` / `COLLABORATOR` ออก)
- **comment / label / close**: `gh pr comment`, `gh pr edit --add-label` / `--remove-label`,
  `gh pr close`

GitHub ใช้เลขชุดเดียวกันทั้ง issue และ PR ดังนั้น `#42` เปล่า ๆ อาจเป็นอย่างใดอย่างหนึ่ง —
แก้ด้วยการลอง `gh pr view 42` ก่อน แล้วค่อยตกไปที่ `gh issue view 42`

## ด่านก่อน merge

`main` ถูกป้องกันด้วย ruleset `T4 main gate`: push ตรงถูกบล็อก `main` ถูก force-push หรือลบไม่ได้
และ review thread ที่ยังไม่ resolve จะบล็อกการ merge **required status checks ไม่มีอย่างถาวร** —
GitHub Actions ถูกล็อกเรื่อง billing และแก้ไม่ได้ workflow `T4 verify` จึงถูก disable ไว้ แทนที่จะ
ปล่อยให้ fail ทุกครั้งที่ push ดู `docs/adr/0002-operate-without-a-server-side-ci-tier.md`

**merge จาก CLI ไม่ใช่จากหน้าเว็บ** `gh pr merge` วิ่งผ่าน `t4-gate` ซึ่งจะรัน
`node scripts/validate/verify.mjs` ก่อนและบล็อกถ้าไม่ผ่าน ส่วนปุ่ม merge บนหน้าเว็บไม่รันอะไรเลย —
เมื่อไม่มีชั้น CI นั่นคือทางเดียวที่ของเสียจะเข้า `main` ได้โดยไม่ถูกตรวจ

## เมื่อ skill บอกว่า "publish to the issue tracker"

ให้สร้าง GitHub issue

## เมื่อ skill บอกว่า "fetch the relevant ticket"

ให้รัน `gh issue view <n> --comments`

## การทำงานแบบ wayfinding

ใช้โดย `/wayfinder` ตัว **map** คือ issue เดียวที่มี issue **ลูก** เป็น ticket

- **Map**: issue เดียวที่ติด label `wayfinder:map` เก็บเนื้อหา Notes / Decisions-so-far / Fog
  สร้างด้วย `gh issue create --label wayfinder:map`
- **Ticket ลูก**: issue ที่ผูกกับ map ในฐานะ sub-issue ของ GitHub (`gh api` ที่ endpoint
  sub-issues) ถ้าใช้ sub-issue ไม่ได้ ให้เพิ่มลูกลงใน task list ใน body ของ map แล้วใส่
  `Part of #<map>` ไว้บนสุดของ body ลูก label: `wayfinder:<type>`
  (`research` / `prototype` / `grilling` / `task`) เมื่อมีคนรับงานแล้ว ticket จะถูก assign ให้
  dev ที่ขับงานนั้น
- **การบล็อก**: ใช้ **native issue dependencies** ของ GitHub เพิ่มเส้นด้วย
  `gh api --method POST repos/xenodeve/minecraft-100day/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`
  โดย `<blocker-db-id>` คือ **database id** ที่เป็นตัวเลขของตัวบล็อก
  (`gh api repos/xenodeve/minecraft-100day/issues/<n> --jq .id` — *ไม่ใช่* `#number` หรือ
  `node_id`) GitHub รายงานผ่าน `issue_dependencies_summary.blocked_by` (นับเฉพาะตัวบล็อกที่ยัง
  เปิดอยู่) ถ้าใช้ dependencies ไม่ได้ ให้ตกไปใช้บรรทัด `Blocked by: #<n>, #<n>` บนสุดของ body
  ลูก ticket จะหลุดบล็อกเมื่อตัวบล็อกทุกตัวถูกปิด
- **Frontier query**: ลิสต์ลูกที่ยังเปิดของ map ตัดตัวที่มีตัวบล็อกเปิดอยู่
  (`issue_dependencies_summary.blocked_by > 0`) หรือมีคน assign แล้วออก ตัวแรกตามลำดับใน map ชนะ
- **รับงาน**: `gh issue edit <n> --add-assignee @me` — เป็นการเขียนครั้งแรกของเซสชัน
- **ปิดงาน**: `gh issue comment <n>` แล้ว `gh issue close <n>` แล้วต่อท้าย pointer ของบริบทลงใน
  Decisions-so-far ของ map

## Label สำหรับ wayfinding

label `wayfinder:*` ข้างบน **ยังไม่ถูกสร้าง** — repo นี้ยังไม่เคยใช้ `/wayfinder` ให้สร้างด้วย
`gh label create` ตอนใช้ครั้งแรก แทนที่จะสร้าง vocabulary ล่วงหน้าที่ไม่มีอะไรไปติดมัน ดู label
ที่*มีอยู่จริง*ได้ที่ `docs/agents/triage-labels.md`
<!-- lang:end -->
