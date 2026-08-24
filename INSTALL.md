<!-- lang:en -->
# Installing Industrial Civilization Survival

**What you get:** `Industrial Civilization Survival 0.1.0-alpha` — Minecraft **1.20.1**,
Forge **47.4.23**, **93 mods**.

Two files are built. **Use the first one.**

| File | What it is |
|---|---|
| `…-0.1.0-alpha-instance.zip` (388 MB) | **Self-contained.** Every mod is inside it. Import and play — nothing is downloaded, nothing is fetched by hand |
| `…-0.1.0-alpha.zip` (130 MB) | CurseForge format. The launcher resolves most mods itself; four must be downloaded manually |

**The official Minecraft launcher cannot import a modpack.** You need Prism or the CurseForge App.
This is not a limitation of this pack; the official launcher has no modpack support at all.

---

## Before you start

- **Java 17.** Forge 47.x for 1.20.1 requires it. Both launchers below can install it for you.
- **8 GB of RAM allocated to the game**, 6 GB minimum. 93 mods with Create contraptions,
  MineColonies pathfinding and Born in Chaos is not a light pack.
- **~2 GB of disk** for the instance.

---

## Option A — Prism Launcher, self-contained *(recommended — one step)*

1. **Add Instance** → **Import from zip**
2. Select **`Industrial-Civilization-Survival-0.1.0-alpha-instance.zip`**
3. **Launch.**

That is the whole procedure. Memory is preset to 4–8 GB and Forge 47.4.23 is pinned in the file.
**No mods are downloaded during import** — every jar is already inside, and each one was checked
against its recorded hash when the file was built.

This works offline, and it works when a mod's download page is unreachable.

## Option B — CurseForge App

1. **Minecraft** → **Create Custom Profile** → **Import**
2. Select `Industrial-Civilization-Survival-0.1.0-alpha.zip` *(the 130 MB one)*
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

Expect **3–6 minutes** on first launch. Forge is loading 93 mods, and Create, MineColonies and
KubeJS all build registries and recipes on startup.

**If it crashes**, the useful file is `logs/latest.log` in the instance folder — the last few
hundred lines name the mod. `crash-reports/` has the same information formatted for reading.

---

## What is in the pack, and what is not

This is `0.1.0-alpha`. It is **the mod set, resolved and pinned** — and nothing else yet.

- ✅ 93 mods at exact, verified versions; Create pinned to `6.0.8`
- ❌ **No balance work.** Gun damage, mob health, spawn rates and ammunition costs are all at their
  mod defaults. The design intent — ammunition as an industrial resource, monsters that are
  dangerous through AI rather than health — is **not implemented yet**.
- ❌ No KubeJS recipes, no quests, no custom configs.

So it will run, and it will not yet play the way the design documents describe. See
`docs/OPEN-WORK-LEDGER.md` for what is next.
<!-- lang:end -->

<!-- lang:th -->
# วิธีติดตั้ง Industrial Civilization Survival

**สิ่งที่คุณได้:** `Industrial Civilization Survival 0.1.0-alpha` — Minecraft **1.20.1**,
Forge **47.4.23**, **93 mods**

มีไฟล์ที่ build ออกมาสองตัว **ใช้ตัวแรก**

| ไฟล์ | คืออะไร |
|---|---|
| `…-0.1.0-alpha-instance.zip` (388 MB) | **มีทุกอย่างในตัว** mod ทุกตัวอยู่ข้างใน import แล้วเล่นได้เลย — ไม่โหลดอะไร ไม่ต้องไปหยิบอะไรเอง |
| `…-0.1.0-alpha.zip` (130 MB) | รูปแบบ CurseForge launcher ไป resolve mod ส่วนใหญ่เอง แต่มีสี่ตัวที่ต้องโหลดด้วยมือ |

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
2. เลือก **`Industrial-Civilization-Survival-0.1.0-alpha-instance.zip`**
3. **Launch**

จบแค่นั้น แรมถูกตั้งไว้ให้แล้ว 4–8 GB และ Forge 47.4.23 ถูก pin อยู่ในไฟล์
**ไม่มีการดาวน์โหลด mod ระหว่าง import** — jar ทุกตัวอยู่ข้างในแล้ว และแต่ละตัวถูกตรวจ hash
ตอน build

วิธีนี้ทำงานได้แม้ออฟไลน์ และทำงานได้แม้หน้าดาวน์โหลดของ mod บางตัวเข้าไม่ได้

## ทางเลือก B — CurseForge App

1. **Minecraft** → **Create Custom Profile** → **Import**
2. เลือก `Industrial-Civilization-Survival-0.1.0-alpha.zip` *(ตัว 130 MB)*
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

นี่คือ `0.1.0-alpha` มันคือ **ชุด mod ที่ resolve และ pin เรียบร้อยแล้ว** — และยังไม่มีอย่างอื่น

- ✅ 93 mod ที่เวอร์ชันเป๊ะและตรวจสอบแล้ว Create pin ที่ `6.0.8`
- ❌ **ยังไม่มีงาน balance เลย** ดาเมจปืน เลือดม็อบ อัตรา spawn และต้นทุนกระสุน ยังเป็นค่า default
  ของแต่ละ mod ทั้งหมด เจตนาการออกแบบ — กระสุนเป็นทรัพยากรอุตสาหกรรม, สัตว์ประหลาดอันตราย
  เพราะ AI ไม่ใช่เพราะเลือดเยอะ — **ยังไม่ได้ถูกทำ**
- ❌ ยังไม่มี KubeJS recipe ไม่มี quest ไม่มี config ที่ปรับเอง

ดังนั้นมันรันได้ แต่ยังไม่ได้เล่นแบบที่เอกสารออกแบบบรรยายไว้ ดูสิ่งที่จะทำต่อได้ที่
`docs/OPEN-WORK-LEDGER.md`
<!-- lang:end -->
