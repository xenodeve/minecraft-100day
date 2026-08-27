<!-- lang:en -->
# Installing Industrial Civilization Survival

> ## ⚠ This is the **internal** install guide
>
> **If you are giving the pack to someone, they need
> [`docs/friend-download-readme.md`](docs/friend-download-readme.md) instead** — shipped beside the
> friend archive as `build/README.md`. It is written for them, in Thai, and it points at the one
> artifact that may leave this machine.
>
> **The self-contained `-instance.zip` described below must not be handed to anyone.** It bundles
> every third-party jar, and at least two authors permit modpack inclusion only if their jar is not
> rehosted — **ADR 0005** demoted it to an internal test artifact for exactly that reason, and
> `docs/distribution-licenses.md` carries the per-mod table. Nothing here overrides that.

**What you get:** `Industrial Civilization Survival 0.2.0-alpha` — Minecraft **1.20.1**,
Forge **47.4.23**, **120 mods**.

Five artifacts are built; `build/SHA256SUMS.txt` lists the four that are checksummed and their exact
sizes. Sizes are deliberately not repeated here — they went stale twice.

| File | What it is | May leave this machine |
|---|---|---|
| `…-0.2.0-alpha-friend.zip` | manifest plus our own layer, **zero third-party jars** | **yes** — this is the one |
| `…-0.2.0-alpha-instance.zip` | **Self-contained.** Every mod is inside it. Import and play — nothing is downloaded | no |
| `…-0.2.0-alpha.zip` | CurseForge format. The launcher resolves most mods itself; four must be downloaded manually | no |
| `…-0.2.0-alpha-server.zip` | dedicated server | no |
| `…-0.2.0-alpha-curseforge-local.zip` | CurseForge App import, bundles the 4 API-blocked mods | **never** |

**The official Minecraft launcher cannot import a modpack.** You need Prism or the CurseForge App.
This is not a limitation of this pack; the official launcher has no modpack support at all.

---

## Before you start

- **Java 17.** Forge 47.x for 1.20.1 requires it. Both launchers below can install it for you.
- **8 GB of RAM allocated to the game**, 6 GB minimum. 120 mods with Create contraptions,
  MineColonies pathfinding and Born in Chaos is not a light pack.
- **~2 GB of disk** for the instance.

---

> **Sharing this pack?** Upload **only** `…-friend.zip`, with `build/README.md` beside it.
> Every other artifact bundles other people's jars — see `docs/distribution-licenses.md`.

## Option A — Prism Launcher, self-contained *(recommended — one step)*

1. **Add Instance** → **Import from zip**
2. Select **`Industrial-Civilization-Survival-0.2.0-alpha-instance.zip`**
3. **Launch.**

That is the whole procedure. Memory is preset to 4–8 GB and Forge 47.4.23 is pinned in the file.
**No mods are downloaded during import** — every jar is already inside, and each one was checked
against its recorded hash when the file was built.

This works offline, and it works when a mod's download page is unreachable.

## Option B — CurseForge App

**Use `…-alpha-curseforge-local.zip`**, not the plain `…-alpha.zip`. The plain one references four
mods whose authors disabled third-party downloading, and whether the CurseForge App resolves them is
untested. The `-local` build carries those four directly, so the import is one step.

**It is named `local` because it must not be shared** — two of those four are All Rights Reserved.
To give the pack to someone, send the friend pack.


1. **Minecraft** → **Create Custom Profile** → **Import**
2. Select `Industrial-Civilization-Survival-0.2.0-alpha.zip`
3. Wait for it to download the mods, then **Play**.

Use this if you want the CurseForge App to manage the instance. It resolves the four
API-restricted mods itself, because it is first-party.

## Option C — CurseForge-format zip in Prism

Only if you specifically want launcher-managed mod updates. Prism will tell you **four mods must
be downloaded manually**:

| Mod | Download |
|---|---|
| TakKit | <https://www.curseforge.com/minecraft/mc-mods/takkit/files/7013819> |
| Flashier Flashlights | <https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights/files/8453760> |
| Client Dynamic Light | <https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light/files/8627850> |
| Player Microchip (Tracker) | <https://www.curseforge.com/minecraft/mc-mods/player-microchip/files/7782898> |

> Those four are not optional and not broken — their authors turned off third-party API
> distribution, which is their right. The self-contained build in Option A includes them, fetched
> from CurseForge's own public download page. **Keep that file within your group**; publishing it
> publicly is a different act from handing it to friends.

## Option D — for development, tracking the repo

The pack's source of truth is `pack.toml` in this repository, managed by
[packwiz](https://github.com/packwiz/packwiz).

```bash
packwiz serve                 # serves the pack on :8080
# in the instance directory:
java -jar packwiz-installer-bootstrap.jar http://localhost:8080/pack.toml
```

Re-running the installer updates an existing instance in place without touching your world saves,
options or keybinds. The same four mods above still need manual download.

---

## First launch

Expect **3–6 minutes** on first launch. Forge is loading 120 mods, and Create, MineColonies and
KubeJS all build registries and recipes on startup.

**If it crashes**, the useful file is `logs/latest.log` in the instance folder — the last few
hundred lines name the mod. `crash-reports/` has the same information formatted for reading.

---

## What is in the pack, and what is not

This is `0.2.0-alpha`.

- ✅ **107 mods** at exact, verified versions; Create pinned to `6.0.8`. **`MODLIST.md`, at the top
  of this download, lists every one of them with a link to where it came from.**
- ✅ **The balance work is done.** Guns are gated behind four tiers of factory output, ammunition is
  an industrial product, hordes arrive roughly every twelve days and grow, monsters fade in over
  time rather than all at once, and undead do not burn at dawn.
- ✅ **A twelve-chapter quest campaign**, 48 quests, written around objectives rather than a
  crafting checklist.
- ⚠️ **None of it has been verified in a running game.** Every check so far has been a dedicated
  server boot: configs parse, recipes register, quests load. That is not the same as playing it, and
  numbers may be wrong in ways only play reveals.
- ❌ **One known problem, unfixed:** Improved Mobs cannot read the defence values of Brimm Armors,
  so no Brimm armour will ever be worn by a mob.

- ✅ **We no longer redistribute anyone else's mod files.** **ADR 0005**: the archive you receive is
  **123 KB** — our configs, scripts, quests and the manifest — and each mod downloads from its own
  author when you install. Several authors ask exactly that: use a pack, do not rehost the jar.
- ⚠️ **Public release is still a separate question.** CurseForge and Modrinth each enforce their own
  modpack rules at upload. `docs/distribution-licenses.md` has the detail.

See `docs/OPEN-WORK-LEDGER.md` for what is next, `docs/distribution-licenses.md` for what the pack
may and may not redistribute, and `CHANGELOG.md` for what changed.
<!-- lang:end -->

<!-- lang:th -->
# วิธีติดตั้ง Industrial Civilization Survival

**สิ่งที่คุณได้:** `Industrial Civilization Survival 0.2.0-alpha` — Minecraft **1.20.1**,
Forge **47.4.23**, **120 mods**

> ## ⚠ นี่คือคู่มือติดตั้งสำหรับ**ภายใน**
>
> **ถ้าจะส่ง pack ให้คนอื่น เขาต้องใช้**
> [`docs/friend-download-readme.md`](docs/friend-download-readme.md) แทน — ไฟล์นั้นถูกส่งไป
> คู่กับ friend archive ในชื่อ `build/README.md` มันเขียนสำหรับเขา
> และชี้ไปที่ artifact ตัวเดียวที่ออกจากเครื่องนี้ได้
>
> **`-instance.zip` ที่อธิบายข้างล่างห้ามส่งให้ใคร** มันบรรจุ jar ของคนอื่น
> ไว้ทั้งหมด และมีผู้เขียนอย่างน้อยสองคนที่อนุญาตให้ใส่ modpack ได้
> เฉพาะถ้าไม่เอา jar ของเขาไปแจกซ้ำ — **ADR 0005** ลดสถานะมันเป็น artifact
> สำหรับทดสอบภายในด้วยเหตุผลนั้น และ `docs/distribution-licenses.md` มีตารางรายมอด

artifact ที่ build ออกมามีห้าตัว `build/SHA256SUMS.txt` ระบุสี่ตัวที่มี checksum พร้อมขนาดจริง
ขนาดไม่ถูกเขียนซ้ำที่นี่โดยตั้งใจ เพราะมันค้างเก่ามาแล้วสองครั้ง

| ไฟล์ | คืออะไร |
|---|---|
| `…-0.2.0-alpha-instance.zip` | **มีทุกอย่างในตัว** mod ทุกตัวอยู่ข้างใน import แล้วเล่นได้เลย — **ห้ามแจกไฟล์นี้ ดู ADR 0005** |
| `…-0.2.0-alpha.zip` | รูปแบบ CurseForge launcher ไป resolve mod ส่วนใหญ่เอง แต่มีสี่ตัวที่ต้องโหลดด้วยมือ |

**Launcher ทางการของ Minecraft import modpack ไม่ได้** ต้องใช้ Prism หรือ CurseForge App
นี่ไม่ใช่ข้อจำกัดของ pack นี้ แต่ launcher ทางการไม่มีฟีเจอร์ modpack เลย

---

## ก่อนเริ่ม

- **Java 17** Forge 47.x สำหรับ 1.20.1 ต้องใช้ launcher ทั้งสองตัวด้านล่างติดตั้งให้ได้
- **แรมที่จัดให้เกม 8 GB** ขั้นต่ำ 6 GB — 93 mod ที่มีทั้ง contraption ของ Create, pathfinding ของ
  MineColonies และ Born in Chaos ไม่ใช่ pack เบา ๆ
- **พื้นที่ดิสก์ ~2 GB** สำหรับ instance

---

## ทางเลือก A — Prism Launcher แบบมีทุกอย่างในตัว *(แนะนำ — ขั้นตอนเดียว)*

1. **Add Instance** → **Import from zip**
2. เลือก **`Industrial-Civilization-Survival-0.2.0-alpha-instance.zip`**
3. **Launch**

จบแค่นั้น แรมถูกตั้งไว้ให้แล้ว 4–8 GB และ Forge 47.4.23 ถูก pin อยู่ในไฟล์
**ไม่มีการดาวน์โหลด mod ระหว่าง import** — jar ทุกตัวอยู่ข้างในแล้ว และแต่ละตัวถูกตรวจ hash
ตอน build

วิธีนี้ทำงานได้แม้ออฟไลน์ และทำงานได้แม้หน้าดาวน์โหลดของ mod บางตัวเข้าไม่ได้

## ทางเลือก B — CurseForge App

1. **Minecraft** → **Create Custom Profile** → **Import**
2. เลือก `Industrial-Civilization-Survival-0.2.0-alpha.zip`
3. รอโหลด mod เสร็จ แล้วกด **Play**

ใช้ทางนี้ถ้าอยากให้ CurseForge App เป็นคนจัดการ instance มันจัดการ mod สี่ตัวที่ถูกจำกัดด้วย API
ได้เอง เพราะมันเป็น first-party

## ทางเลือก C — zip รูปแบบ CurseForge ใน Prism

ใช้เฉพาะเมื่อคุณต้องการให้ launcher จัดการอัปเดต mod ให้จริง ๆ Prism จะแจ้งว่ามี
**mod สี่ตัวที่ต้องโหลดเอง**:

| Mod | ลิงก์ดาวน์โหลด |
|---|---|
| TakKit | <https://www.curseforge.com/minecraft/mc-mods/takkit/files/7013819> |
| Flashier Flashlights | <https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights/files/8453760> |
| Client Dynamic Light | <https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light/files/8627850> |
| Player Microchip (Tracker) | <https://www.curseforge.com/minecraft/mc-mods/player-microchip/files/7782898> |

> สี่ตัวนั้นไม่ใช่ของเสริม และไม่ได้พัง — ผู้เขียนปิดการแจกจ่ายผ่าน API ของบุคคลที่สาม ซึ่งเป็นสิทธิ์
> ของเขา ส่วน build แบบมีทุกอย่างในตัวในทางเลือก A รวมมันมาด้วย โดยดึงจากหน้าดาวน์โหลดสาธารณะ
> ของ CurseForge เอง **เก็บไฟล์นั้นไว้ในกลุ่มของคุณ** การเผยแพร่สู่สาธารณะเป็นคนละเรื่องกับ
> การส่งให้เพื่อน

## ทางเลือก D — สำหรับพัฒนา ตามการเปลี่ยนแปลงของ repo

source of truth ของ pack คือ `pack.toml` ใน repository นี้ จัดการด้วย
[packwiz](https://github.com/packwiz/packwiz)

```bash
packwiz serve                 # เสิร์ฟ pack ที่พอร์ต :8080
# ในโฟลเดอร์ instance:
java -jar packwiz-installer-bootstrap.jar http://localhost:8080/pack.toml
```

การรัน installer ซ้ำจะอัปเดต instance ที่มีอยู่โดยไม่แตะ world save, ตัวเลือก หรือปุ่มที่คุณตั้งไว้
ส่วน mod สี่ตัวข้างบนยังต้องโหลดเองอยู่ดี

---

## การเปิดครั้งแรก

คาดว่าจะใช้เวลา **3–6 นาที** ในการเปิดครั้งแรก Forge กำลังโหลด 93 mod และ Create, MineColonies
กับ KubeJS ต่างก็สร้าง registry และ recipe ตอนเริ่มระบบ

**ถ้ามันแครช** ไฟล์ที่มีประโยชน์คือ `logs/latest.log` ในโฟลเดอร์ instance — สองสามร้อยบรรทัดสุดท้าย
จะบอกว่า mod ตัวไหน ส่วน `crash-reports/` มีข้อมูลเดียวกันในรูปแบบที่อ่านง่ายกว่า

---

## ใน pack มีอะไร และยังไม่มีอะไร

นี่คือ `0.2.0-alpha`

- ✅ **107 mod** ที่เวอร์ชันเป๊ะและตรวจสอบแล้ว Create pin ที่ `6.0.8`
  **`MODLIST.md` ที่อยู่บนสุดของไฟล์ที่โหลดมา ลงชื่อทุกตัวพร้อมลิงก์ไปยังที่มาของมัน**
- ✅ **งาน balance ทำเสร็จแล้ว** ปืนถูกกั้นด้วยสี่ขั้นของกำลังการผลิต กระสุนเป็นของที่ต้องผลิต
  ในโรงงาน horde มาทุก ๆ สิบสองวันโดยประมาณและใหญ่ขึ้นเรื่อย ๆ สัตว์ประหลาดโผล่มาทีละนิด
  แทนที่จะมาพร้อมกัน และผีดิบไม่ไหม้ตอนเช้า
- ✅ **แคมเปญ quest สิบสองบท** 48 quest เขียนรอบเป้าหมาย ไม่ใช่ checklist การคราฟต์
- ⚠️ **ยังไม่มีอะไรถูกตรวจสอบในเกมจริง** การตรวจทุกอย่างที่ผ่านมาเป็นการ boot
  บน dedicated server: config parse ได้ recipe ลงทะเบียนได้ quest โหลดได้ นั่นไม่เท่ากับการเล่นจริง
  และตัวเลขอาจผิดในแบบที่มีแต่การเล่นเท่านั้นที่จะเผย
- ❌ **ปัญหาที่รู้แล้วหนึ่งข้อ ยังไม่ได้แก้:** Improved Mobs อ่านค่าป้องกันของ Brimm Armors ไม่ได้
  ดังนั้นจะไม่มีมอบตัวไหนสวมเกราะ Brimm เลย
- ✅ **เราไม่แจกจ่ายไฟล์มอดของคนอื่นซ้ำอีกแล้ว** **ADR 0005**: ไฟล์ที่คุณได้รับมีขนาด
  **123 KB** — config, script, quest และ manifest ของเรา — ส่วนมอดแต่ละตัวจะดาวน์โหลด
  จากผู้เขียนของมันเองตอนคุณติดตั้ง ผู้เขียนหลายคนขอแบบนั้นเป๊ะ: ใช้ใน pack ได้ แต่อย่า rehost ตัว jar
- ⚠️ **การเผยแพร่สาธารณะยังเป็นอีกคำถามหนึ่ง** CurseForge กับ Modrinth ต่างก็บังคับใช้กฎ modpack
  ของตัวเองตอนอัปโหลด `docs/distribution-licenses.md` มีรายละเอียด

ดังนั้นมันรันได้ แต่ยังไม่ได้เล่นแบบที่เอกสารออกแบบบรรยายไว้ ดูสิ่งที่จะทำต่อได้ที่
`docs/OPEN-WORK-LEDGER.md`
<!-- lang:end -->
