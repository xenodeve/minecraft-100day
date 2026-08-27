<!-- lang:en -->
# Blocked work — a handoff

**Who this is for.** An agent or person arriving at `xenodeve/minecraft-100day` with no history, asked
to move something forward. Everything easy is done. What is left is blocked, and this file says on
*what*, so you do not spend a session rediscovering it.

**Read this before `docs/OPEN-WORK-LEDGER.md`, not instead of it.** The ledger is the list; this is
the reasoning.

---

## The one-paragraph state

A Minecraft 1.20.1 / Forge modpack, **107 mods**, pinned with hashes. Configs, KubeJS recipes, a
48-quest campaign and a visual layer are all written and all **verified on a dedicated-server boot
only**. Three artifacts build reproducibly and checksum clean. **Nobody has ever launched the
client.** That single fact blocks most of what follows.

---

## Blocked by: nobody has launched a client

**This is the big one.** It gates the release, all balance work, and every visual-layer criterion.

| Work | Why a server boot cannot substitute |
|---|---|
| Distribution Spec §16 twelve-test release gate | it is a human protocol on a running game |
| TTK matrix (Main §24 Phase 2), MSPT under automatic fire (Phase 4) | measurements |
| Horde MSPT at 50/100/150/200 (§23) | measurement |
| Wildlife population (Wildlife Spec W3/W6/W7) | measurement |
| Brimm vs TakKit armour comparison (§15) | Brimm registers stats **in code**; the only way to read them is JEI tooltips |
| JEI active-recipe check (Crafting Spec §5) | JEI is client-only |
| Visuals V1/V2 verification, and V4–V10 entirely | **every visual mod is `side = "client"`** |

### What you must not conclude from the green boots

`Done (12.803s)`, 83 recipes, 0 failed — that is real, and it is **narrow**. The same green boot
carries **45 ERROR lines** saying Improved Mobs cannot read Brimm Armors' defence values, so no Brimm
armour will ever be worn by a mob. **Nothing crashed. Nothing failed. The pack is wrong anyway.**

*(Since #70 that exclusion is deliberate — `brimm` is on Improved Mobs' item blacklist because Brimm
is player gear. The 45 lines remain, measured: the blacklist filters the pool, not the scan that
builds it. 50 ERROR lines is the expected baseline, not a regression.)*

That is this repo's characteristic failure mode, and it is written up in
`Obsidian-minecraft-100day/config-and-kubejs-fail-open.md`: **configs fail open and KubeJS drops
broken files silently.** A green boot is evidence that the server started, and nothing more.

### What would actually unblock it

A Windows machine with the developer's Microsoft account, importing
`build/…-instance.zip` per `INSTALL.md` Option A (Prism Launcher → Add Instance → Import from zip),
launching, creating a world, and posting `latest.log`. **That single artefact unblocks more open work
than anything else in this repo.**

---

## Blocked by: a licensing question nobody has answered

**Do not ship, publish, or hand this pack to anyone until this is resolved.** `INSTALL.md` and
`CHANGELOG.md` both say so.

### The shape of the problem — it is not the licence list

The audit started as *"how many mods are All Rights Reserved"* and that was the wrong question. The
authors who write about modpacks mostly **permit** them, on a condition:

> **Serene Seasons** — "You may include this mod in a Modrinth-hosted modpack **as long as you do not
> rehost the mod and only use builds uploaded directly by us**…"

> **Entity Culling** — "Feel free to use this mod in your Modrinth and CurseForge-hosted modpacks…
> **Do not redistribute the JAR files anywhere else!**"

Both permit a **hosted** modpack, where the platform fetches each mod from the author's own upload.
**ADR 0003 chose self-contained delivery** — every jar inside the zip — because the developer wanted
to ship patches directly. That is exactly what these terms exclude.

**The conflict is between the distribution model and the condition, not between the mod list and the
licences. Swapping mods cannot fix it.** No artifact avoids it either: the CurseForge export is
closest and still bundles 65 jars in `overrides/`, because a CurseForge manifest cannot reference
Modrinth-sourced mods.

### What is already known, so you do not redo it

`docs/distribution-licenses.md` has all 107, read. **59 permissively licensed · 38 read and silent ·
3 explicit grants · 2 known conflicts · 1 page with no description field.**

**Silence is the ordinary case and it is not consent.** 38 project pages simply do not discuss
modpacks; for those the licence alone is operative, and for most of them that licence is All Rights
Reserved.

Two of the three grants ask only for **credit and a link** — which `docs/MODLIST.md` has supplied
since #50, before anyone thought of it as compliance.

### Two claims here were already wrong once — do not re-derive them

1. **"Disabling CurseForge API distribution means the author forbids modpacks."** Retracted in #61.
   All four such mods appear in this pack's own CurseForge manifest by project and file id. The flag
   separates *third-party launchers* from *CurseForge itself*; it is not a modpack prohibition.
2. **"16 CurseForge pages could not be read — the platform renders descriptions unreachably."**
   Retracted in #63. It was a regex bug: a project page carries ~49 `description` fields and the
   extraction matched the first. 19 of 20 parse fine.
3. **"Continuity has a native Forge build, so §12's premise is false."** Retracted in #68. The build
   requires Sinytra Connector and Forgified Fabric API. **Never call a build native from its
   `loaders` field alone — read the required dependencies**, which is the same rule
   `cbc_firepower_components` taught this repo and ADR 0004 applied correctly.

Both went into committed documents unchecked. If you find yourself writing *"the tool cannot reach
it"*, check that it is not *"my extraction is wrong."*

### The questions only the developer can answer

1. **Does the pack stay self-contained?** Keeping it means asking the affected authors, or dropping
   their mods. Changing it means a hosted install where each mod downloads from its author — losing
   the direct-patch property ADR 0003 was chosen for.
2. **Private or public?** Handing a zip to three named friends is a materially different act from
   listing on CurseForge or Modrinth, where Distribution Spec §33/§34 want it and where both
   platforms enforce modpack permissions at upload.

---

## Blocked by: a decision the spec never made

**Visuals V3 — connected textures.** *Visuals Spec §37* says *"Evaluate: Fusion."* But **Fusion is a
library**: by its own description it *"adds additional resource pack features … to be used in
resource packs."* It changes nothing on its own, and §12 specifies *"Fusion + compatible
connected-texture resource pack"* — **without naming the resource pack.**

Choosing it is art direction (§12's use cases are factory glass, control rooms, station windows), and
§35 singles out connected-texture packs as the category most likely to forbid redistribution — while
the licensing question above is open.

**§12's stated reason is correct, and an earlier version of this file said it was not.** Retracted
in #68. Continuity *does* publish `continuity-3.0.0+1.20.1.forge.jar`, but that build **requires
Sinytra Connector and Forgified Fabric API** — it is Fabric code through a bridge. `loaders:
["forge"]` says how it installs, not what it is. Adopting it means adding a Fabric bridge to a
107-mod Forge pack for connected textures, which is exactly what §12 refuses.

---

## Blocked by: waiting on someone else

| Work | Waiting on |
|---|---|
| ~~Three Player Microchip textures (#35)~~ | **no longer blocked.** Placeholders shipped in #74 — readable silhouettes at the mod's own texture paths, so mechanics, recipes and the Curios slot can be exercised now. Real art drops in over them |
| Re-add `cbc_firepower_components` | an **upstream release** supporting CBC ≥ 5.9. Watch the project; one `packwiz mr add` when it exists |

---

## Available and undecided — closed in #74

**Both were decided in #74 and neither is adopted.** Kept here so nobody re-opens them:

| Project | Version | Side | Note |
|---|---|---|---|
| Pufferfish's Biome Dither | `1.0.0` | **`server: required`** | **DEFERRED past Alpha** — it mutates surface blocks, not just colour; Better Biome Blend already covers the visual seam; §33 wants worldgen settled before a persistent world |
| Punchy! | `2.7d` | `client: required` | **REJECTED for Alpha** — first-person animation is already owned by SPA + NEA and TaCZ |

Revisit only if a client launch shows Better Biome Blend leaving seams that surface-block mixing
would fix.

---

## How to work here without tripping over the rig

**Three traps, each of which has cost a boot.** All are in `docs/compatibility-matrix.md`; repeated
because they read like real bugs.

1. **Stale java holds `session.lock`** → `DirectoryLock` `IOException` that reads exactly like a
   corrupt save. `pkill -f` does **not** match these; `Get-Process java | Stop-Process -Force` does.
2. **Stale java holds the port** → `FAILED TO BIND TO PORT`, which reads like a firewall problem.
   Give a second server its own port; `servertest` uses `25577`.
3. **`run.sh` is the Unix launcher** and points at `unix_args.txt`, whose classpath uses `:`
   separators. On Windows the JVM dies with an `InvalidPathException` naming **no mod at all**. Use
   `win_args.txt`. A Forge server install ships both arg files and only `run.sh`.

**Never guess a project slug.** packwiz records ids, not slugs, and a guessed slug has pointed at the
wrong project three times here — `smoothplayeranimations`, `create-industry` (which is a *modpack*,
not TFMG), and `snow-imprints` (whose title is *Soft Imprints*). Search the **bare title** and check
the `title` field of the hit: an augmented query returned the wrong project for `Continuity`, and
that failure looks identical to *"the project does not exist."*

**Run `node scripts/validate/verify.mjs` before anything ships.** It checks 165 indexed files, the
roster's contents **and its stated count**, and that every shipped mod has a recorded licence.

---

## The standard this repo holds itself to

**Evidence before verdict.** *Fixed · works · passes · safe · done* each need the command you ran,
its output, or the `file:line` you read, named alongside them. Otherwise it is a hypothesis, and
saying so is not a weakness in the report — it is the report.

Every gate in `verify.mjs` was **falsified before it was trusted** — made to fail on purpose, then
made to pass. A gate that has never failed is a gate nobody has checked.
<!-- lang:end -->

<!-- lang:th -->
# งานที่ติดอยู่ — เอกสารส่งต่อ

**เขียนให้ใคร** agent หรือคนที่เข้ามาที่ `xenodeve/minecraft-100day` โดยไม่มีประวัติ
แล้วถูกขอให้ผลักงานอะไรสักอย่างต่อ ของง่ายทำหมดแล้ว ที่เหลือติดอยู่ และไฟล์นี้บอกว่าติด*อะไร*
คุณจะได้ไม่ต้องเสียเวลาทั้งเซสชันไปค้นพบมันใหม่

**อ่านไฟล์นี้ก่อน `docs/OPEN-WORK-LEDGER.md` ไม่ใช่แทนมัน** ledger คือรายการ อันนี้คือเหตุผล

---

## สถานะย่อหน้าเดียว

modpack Minecraft 1.20.1 / Forge, **107 มอด** pin ไว้พร้อม hash config, recipe ของ KubeJS,
แคมเปญ quest 48 ข้อ และชั้นภาพ เขียนครบแล้วและ**ตรวจสอบบน dedicated server เท่านั้น**
artifact สามตัว build ซ้ำได้และ checksum สะอาด **ยังไม่เคยมีใครเปิด client เลย**
ข้อเท็จจริงข้อเดียวนั้นขวางเกือบทุกอย่างที่ตามมา

---

## ติดเพราะ: ยังไม่มีใครเปิด client

**นี่คือตัวใหญ่** มันขวางการปล่อยเวอร์ชัน งาน balance ทั้งหมด และเกณฑ์ทุกข้อของชั้นภาพ

| งาน | ทำไม boot server แทนไม่ได้ |
|---|---|
| release gate 12 ข้อของ Distribution Spec §16 | เป็น protocol ที่คนทำบนเกมที่รันอยู่ |
| TTK matrix (Main §24 Phase 2), MSPT ตอนยิงรัว (Phase 4) | เป็นการวัด |
| MSPT ของ Horde ที่ 50/100/150/200 (§23) | เป็นการวัด |
| ประชากรสัตว์ป่า (Wildlife Spec W3/W6/W7) | เป็นการวัด |
| เปรียบเทียบเกราะ Brimm กับ TakKit (§15) | Brimm ลงทะเบียนค่า**ในโค้ด** ทางเดียวที่อ่านได้คือ tooltip ของ JEI |
| ตรวจ recipe ที่ active ใน JEI (Crafting Spec §5) | JEI เป็น client อย่างเดียว |
| การตรวจสอบ Visuals V1/V2 และ V4–V10 ทั้งหมด | **มอดภาพทุกตัวเป็น `side = "client"`** |

### สิ่งที่คุณต้องไม่สรุปจากการ boot ที่เขียว

`Done (12.803s)`, 83 recipes, 0 failed — นั่นจริง และมัน**แคบมาก** boot สีเขียวอันเดียวกันนั้น
มี **บรรทัด ERROR 45 บรรทัด** บอกว่า Improved Mobs อ่านค่าป้องกันของ Brimm Armors ไม่ได้
ดังนั้นจะไม่มีมอบตัวไหนสวมเกราะ Brimm เลย **ไม่มีอะไรแครช ไม่มีอะไร fail และ pack ก็ยังผิดอยู่ดี**

นั่นคือรูปแบบความล้มเหลวประจำตัวของ repo นี้ และมันถูกเขียนไว้ใน
`Obsidian-minecraft-100day/config-and-kubejs-fail-open.md`: **config fail แบบเปิด และ KubeJS
ทิ้งไฟล์ที่พังไปเงียบ ๆ** boot ที่เขียวเป็นหลักฐานว่า server เริ่มทำงานได้ แค่นั้น

### อะไรที่จะปลดล็อกได้จริง

เครื่อง Windows ที่มีบัญชี Microsoft ของผู้พัฒนา import `build/…-instance.zip` ตาม
`INSTALL.md` ทางเลือก A (Prism Launcher → Add Instance → Import from zip) เปิดเกม สร้างโลก
แล้วส่ง `latest.log` มา **ไฟล์เดียวนั้นปลดล็อกงานที่ค้างอยู่ได้มากกว่าอะไรก็ตามใน repo นี้**

---

## ติดเพราะ: คำถามเรื่องสัญญาอนุญาตที่ยังไม่มีใครตอบ

**อย่าส่ง อย่าเผยแพร่ อย่ายื่น pack นี้ให้ใครจนกว่าเรื่องนี้จะจบ** `INSTALL.md` กับ `CHANGELOG.md`
เขียนไว้ทั้งคู่

### รูปร่างของปัญหา — มันไม่ใช่รายการสัญญาอนุญาต

การ audit เริ่มจาก *"มีกี่ตัวที่เป็น All Rights Reserved"* และนั่นเป็นคำถามที่ผิด
ผู้เขียนที่เขียนถึง modpack ส่วนใหญ่**อนุญาต** โดยมีเงื่อนไข:

> **Serene Seasons** — "คุณใส่มอดนี้ใน modpack ที่โฮสต์บน Modrinth ได้ **ตราบใดที่คุณไม่ rehost มอด
> และใช้เฉพาะ build ที่เราอัปโหลดเองโดยตรง**…"

> **Entity Culling** — "ใช้มอดนี้ใน modpack ที่โฮสต์บน Modrinth และ CurseForge ได้เลย…
> **อย่าแจกจ่ายไฟล์ JAR ซ้ำที่อื่น!**"

ทั้งคู่อนุญาต modpack แบบ**โฮสต์** ซึ่งแพลตฟอร์มดึงมอดแต่ละตัวจากที่ผู้เขียนอัปโหลดไว้เอง
**ADR 0003 เลือกการส่งมอบแบบมีทุกอย่างในตัว** — jar ทุกตัวอยู่ใน zip —
เพราะผู้พัฒนาต้องการออก patch ได้ตรง ๆ นั่นคือสิ่งที่เงื่อนไขพวกนี้กันออกพอดี

**ความขัดแย้งอยู่ระหว่างรูปแบบการแจกจ่ายกับเงื่อนไข ไม่ใช่ระหว่างรายชื่อมอดกับสัญญาอนุญาต
การสลับมอดแก้ไม่ได้** และไม่มี artifact ตัวไหนเลี่ยงได้: ตัว CurseForge ใกล้เคียงที่สุด
และก็ยังใส่ jar มา 65 ตัวใน `overrides/` เพราะ manifest ของ CurseForge อ้างถึงมอดจาก Modrinth ไม่ได้

### สิ่งที่รู้แล้ว จะได้ไม่ต้องทำซ้ำ

`docs/distribution-licenses.md` มีครบทั้ง 107 ตัว อ่านแล้ว **สัญญาอนุญาตแบบเปิด 59 ·
อ่านแล้วและเงียบ 38 · ให้สิทธิ์ชัดเจน 3 · ขัดแย้งที่รู้แล้ว 2 · ไม่มีฟิลด์คำอธิบาย 1**

**ความเงียบคือกรณีปกติ และมันไม่ใช่การยินยอม** หน้าโปรเจกต์ 38 หน้าไม่ได้พูดถึง modpack เลย
สำหรับพวกนั้นสัญญาอนุญาตอย่างเดียวคือสิ่งที่มีผล และส่วนใหญ่คือ All Rights Reserved

สองในสามรายที่ให้สิทธิ์ขอแค่ **เครดิตกับลิงก์** — ซึ่ง `docs/MODLIST.md` ให้มาตั้งแต่ #50
ก่อนที่จะมีใครคิดถึงมันในฐานะการปฏิบัติตามเงื่อนไข

### สองคำกล่าวที่เคยผิดมาแล้ว — อย่าไปสรุปใหม่

1. **"การปิด CurseForge API distribution แปลว่าผู้เขียนห้าม modpack"** ถอนคืนใน #61
   มอดทั้งสี่ตัวนั้นอยู่ใน CurseForge manifest ของ pack นี้เองด้วย project และ file id
   แฟล็กนั้นแยก *launcher ของบุคคลที่สาม* ออกจาก *ตัว CurseForge เอง* ไม่ใช่การห้าม modpack
2. **"หน้า CurseForge 16 หน้าอ่านไม่ได้ — แพลตฟอร์มแสดงคำอธิบายในรูปแบบที่เข้าไม่ถึง"**
   ถอนคืนใน #63 มันเป็นบั๊กของ regex: หน้าโปรเจกต์มีฟิลด์ `description` ราว 49 ฟิลด์
   และการดึงข้อมูลไปจับเอาอันแรก 19 จาก 20 หน้า parse ได้ปกติ
3. **"Continuity มี native Forge build หลักการของ §12 จึงผิด"** ถอนคืนใน #68
   build นั้นต้องใช้ Sinytra Connector กับ Forgified Fabric API **ห้ามเรียก build ว่า native
   จากฟิลด์ `loaders` อย่างเดียว ให้อ่าน dependency ที่บังคับด้วย** ซึ่งเป็นกฎเดียวกับที่
   `cbc_firepower_components` สอน repo นี้ และ ADR 0004 เอาไปใช้ได้ถูกต้อง

ทั้งคู่เข้าไปอยู่ในเอกสารที่ commit แล้วโดยไม่ได้ตรวจ ถ้าคุณกำลังจะเขียนว่า *"เครื่องมือเข้าไม่ถึง"*
ให้ตรวจก่อนว่ามันไม่ใช่ *"การดึงข้อมูลของผมผิด"*

### คำถามที่มีแต่ผู้พัฒนาตอบได้

1. **pack จะยังเป็นแบบมีทุกอย่างในตัวต่อไปไหม** ถ้าใช่ ต้องไปขอผู้เขียนที่เกี่ยวข้อง หรือถอดมอดออก
   ถ้าเปลี่ยน ก็ต้องเป็นการติดตั้งแบบโฮสต์ที่มอดแต่ละตัวดาวน์โหลดจากผู้เขียน —
   ซึ่งเสียคุณสมบัติการ patch ตรง ๆ ที่ ADR 0003 ถูกเลือกมาเพราะมัน
2. **ส่วนตัวหรือสาธารณะ** การส่ง zip ให้เพื่อนสามคนที่รู้จักชื่อ ต่างจากการลงบน CurseForge
   หรือ Modrinth อย่างมีนัยสำคัญ ซึ่ง Distribution Spec §33/§34 อยากให้ไป
   และทั้งสองแพลตฟอร์มบังคับใช้สิทธิ์ modpack ตอนอัปโหลด

---

## ติดเพราะ: การตัดสินใจที่ spec ไม่เคยทำ

**Visuals V3 — connected textures** *Visuals Spec §37* บอกว่า *"ประเมิน: Fusion"*
แต่ **Fusion เป็น library**: คำอธิบายของมันเองบอกว่ามัน *"เพิ่มความสามารถของ resource pack …
เพื่อให้ resource pack เอาไปใช้"* มันไม่เปลี่ยนอะไรด้วยตัวเอง และ §12 ระบุว่า *"Fusion +
connected-texture resource pack ที่เข้ากันได้"* — **โดยไม่ระบุว่า resource pack ตัวไหน**

การเลือกมันเป็นการตัดสินเชิงศิลป์ (กรณีใช้งานของ §12 คือกระจกโรงงาน ห้องควบคุม หน้าต่างสถานี)
และ §35 แยก connected-texture pack ออกมาเป็นหมวดที่มีโอกาสห้ามแจกจ่ายซ้ำมากที่สุด —
ในขณะที่คำถามเรื่องสัญญาอนุญาตข้างบนยังเปิดอยู่

**เหตุผลที่ §12 ให้ไว้ถูกต้อง และไฟล์นี้เวอร์ชันก่อนหน้าเขียนว่ามันผิด** ถอนคืนใน #68
Continuity *มี* `continuity-3.0.0+1.20.1.forge.jar` จริง แต่ build นั้น **ต้องใช้ Sinytra Connector
และ Forgified Fabric API** — มันคือโค้ด Fabric ที่วิ่งผ่าน bridge `loaders: ["forge"]`
บอกว่ามันติดตั้งยังไง ไม่ได้บอกว่ามันคืออะไร การรับมันมาแปลว่าต้องเพิ่ม Fabric bridge
เข้าไปใน pack Forge ที่มี 107 มอด เพียงเพื่อ connected texture ซึ่งคือสิ่งที่ §12 ปฏิเสธพอดี

---

## ติดเพราะ: รอคนอื่น

| งาน | รออะไร |
|---|---|
| ~~texture ของ Player Microchip สามไฟล์ (#35)~~ | **ไม่ติดแล้ว** ส่ง placeholder ไปใน #74 — เงาที่อ่านออกได้ วางที่ path texture ของมอดเอง กลไก recipe และช่อง Curios จึงทดสอบได้แล้ว งานศิลป์จริงมาทับทีหลังได้เลย |
| เพิ่ม `cbc_firepower_components` กลับ | **release จากต้นน้ำ** ที่รองรับ CBC ≥ 5.9 เฝ้าโปรเจกต์ไว้ พอมีก็ `packwiz mr add` ครั้งเดียว |

---

## ใช้ได้และยังไม่ถูกตัดสิน — ปิดไปแล้วใน #74

**ทั้งคู่ถูกตัดสินใน #74 และไม่รับทั้งคู่** เก็บไว้ตรงนี้เพื่อไม่ให้ใครไปเปิดใหม่:

| โปรเจกต์ | เวอร์ชัน | Side | หมายเหตุ |
|---|---|---|---|
| Pufferfish's Biome Dither | `1.0.0` | **`server: required`** | **เลื่อนออกไปหลัง Alpha** — มันเปลี่ยนบล็อกพื้นผิว ไม่ใช่แค่สี; Better Biome Blend ครอบคลุมรอยต่อเชิงภาพแล้ว; §33 ต้องการให้ worldgen นิ่งก่อนมีโลกถาวร |
| Punchy! | `2.7d` | `client: required` | **ปฏิเสธสำหรับ Alpha** — แอนิเมชันมุมมองบุคคลที่หนึ่งมีเจ้าของแล้วคือ SPA + NEA และ TaCZ |

ทบทวนใหม่ต่อเมื่อการเปิด client แสดงว่า Better Biome Blend ทิ้งรอยต่อไว้ในแบบที่การผสมบล็อกพื้นผิวจะแก้ได้

---

## วิธีทำงานที่นี่โดยไม่สะดุดกับ rig

**สามกับดัก แต่ละอันเคยทำให้เสียการ boot ไปแล้ว** ทั้งหมดอยู่ใน `docs/compatibility-matrix.md`
เขียนซ้ำตรงนี้เพราะมันหน้าตาเหมือนบั๊กจริง ๆ

1. **java ค้างถือ `session.lock`** → `DirectoryLock` `IOException` ที่อ่านแล้วเหมือน save พัง
   `pkill -f` **ไม่**จับพวกนี้ ต้องใช้ `Get-Process java | Stop-Process -Force`
2. **java ค้างถือ port** → `FAILED TO BIND TO PORT` ซึ่งอ่านแล้วเหมือนปัญหา firewall
   ให้ server ตัวที่สองใช้ port ของตัวเอง `servertest` ใช้ `25577`
3. **`run.sh` เป็นตัวเปิดสำหรับ Unix** และชี้ไปที่ `unix_args.txt` ซึ่ง classpath ใช้ตัวคั่น `:`
   บน Windows ตัว JVM ตายด้วย `InvalidPathException` ที่**ไม่เอ่ยชื่อมอดสักตัว** ให้ใช้
   `win_args.txt` การติดตั้ง Forge server แถมไฟล์ arg มาทั้งสองไฟล์แต่มีแค่ `run.sh`

**ห้ามเดา slug ของโปรเจกต์** packwiz บันทึก id ไม่ใช่ slug และ slug ที่เดาชี้ไปผิดโปรเจกต์มาแล้ว
สามครั้งที่นี่ — `smoothplayeranimations`, `create-industry` (ซึ่งเป็น *modpack* ไม่ใช่ TFMG)
และ `snow-imprints` (ที่ชื่อจริงคือ *Soft Imprints*) ให้ค้นด้วย**ชื่อเปล่า ๆ**
และตรวจฟิลด์ `title` ของผลลัพธ์: คำค้นที่เติมคำเข้าไปให้ผลผิดโปรเจกต์สำหรับ `Continuity`
และความล้มเหลวแบบนั้นหน้าตาเหมือน *"โปรเจกต์นี้ไม่มีอยู่"* เป๊ะ ๆ

**รัน `node scripts/validate/verify.mjs` ก่อนส่งอะไรก็ตาม** มันตรวจไฟล์ใน index 165 ไฟล์
เนื้อหาของ roster **และจำนวนที่ roster ประกาศเอง** และว่ามอดทุกตัวที่ส่งไปมีสัญญาอนุญาตบันทึกไว้

---

## มาตรฐานที่ repo นี้ยึดกับตัวเอง

**หลักฐานมาก่อนคำตัดสิน** *แก้แล้ว · ใช้ได้ · ผ่าน · ปลอดภัย · เสร็จ* แต่ละคำต้องมีคำสั่งที่คุณรัน
ผลลัพธ์ของมัน หรือ `file:line` ที่คุณอ่าน ระบุมาคู่กัน ถ้าไม่มีก็คือสมมติฐาน
และการบอกแบบนั้นไม่ใช่จุดอ่อนของรายงาน — มันคือรายงาน

ทุกด่านตรวจใน `verify.mjs` ถูก **falsify ก่อนที่จะเชื่อถือ** — ทำให้มัน fail โดยตั้งใจ
แล้วค่อยทำให้มันผ่าน ด่านตรวจที่ไม่เคย fail คือด่านตรวจที่ยังไม่มีใครตรวจ
<!-- lang:end -->
