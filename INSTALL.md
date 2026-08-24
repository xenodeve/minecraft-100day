<!-- lang:en -->
# Installing Industrial Civilization Survival

**What you get:** a CurseForge-format modpack zip — `Industrial Civilization Survival 0.1.0-alpha`,
Minecraft **1.20.1**, Forge **47.4.23**, **83 mods**.

**The official Minecraft launcher cannot import a modpack.** You need one of the launchers below.
This is not a limitation of this pack; the official launcher has no modpack support at all.

---

## Before you start

- **Java 17.** Forge 47.x for 1.20.1 requires it. Both launchers below can install it for you.
- **8 GB of RAM allocated to the game**, 6 GB minimum. 83 mods with Create contraptions,
  MineColonies pathfinding and Born in Chaos is not a light pack.
- **~2 GB of disk** for the instance once mods are downloaded.

---

## Option A — CurseForge App *(recommended: fully automatic)*

1. Open the CurseForge App → **Minecraft** → **Create Custom Profile** → **Import**.
2. Select `Industrial-Civilization-Survival-0.1.0-alpha.zip`.
3. Wait for it to download the mods, then **Play**.

**Why this one is recommended:** four of the mods have third-party downloads disabled by their
authors. The CurseForge App is first-party, so it downloads them normally. Every other route
requires you to fetch those four by hand — see below.

## Option B — Prism Launcher

1. **Add Instance** → **Import from zip** → select the same zip → **OK**.
2. Prism resolves what it can and will tell you that **four mods must be downloaded manually**.
3. Download each of these and drop the `.jar` into the instance's `mods/` folder:

   | Mod | Download |
   |---|---|
   | TakKit | <https://www.curseforge.com/minecraft/mc-mods/takkit/files/7013819> |
   | Flashier Flashlights | <https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights/files/8453760> |
   | Client Dynamic Light | <https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light/files/8627850> |
   | Player Microchip (Tracker) | <https://www.curseforge.com/minecraft/mc-mods/player-microchip/files/7782898> |

4. **Edit Instance → Settings → Memory**, set max to 8 GB.
5. **Launch.**

> The four mods above are not optional and not broken — their authors turned off API distribution,
> which is their right. Any tool that is not the CurseForge App has to ask you to click the link.

## Option C — for development, tracking the repo

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

Expect **3–6 minutes** on first launch. Forge is loading 83 mods, and Create, MineColonies and
KubeJS all build registries and recipes on startup.

**If it crashes**, the useful file is `logs/latest.log` in the instance folder — the last few
hundred lines name the mod. `crash-reports/` has the same information formatted for reading.

---

## What is in the pack, and what is not

This is `0.1.0-alpha`. It is **the mod set, resolved and pinned** — and nothing else yet.

- ✅ 83 mods at exact, verified versions; Create pinned to `6.0.8`
- ❌ **No balance work.** Gun damage, mob health, spawn rates and ammunition costs are all at their
  mod defaults. The design intent — ammunition as an industrial resource, monsters that are
  dangerous through AI rather than health — is **not implemented yet**.
- ❌ No KubeJS recipes, no quests, no custom configs.

So it will run, and it will not yet play the way the design documents describe. See
`docs/OPEN-WORK-LEDGER.md` for what is next.
<!-- lang:end -->

<!-- lang:th -->
# วิธีติดตั้ง Industrial Civilization Survival

**สิ่งที่คุณได้:** modpack zip รูปแบบ CurseForge — `Industrial Civilization Survival 0.1.0-alpha`,
Minecraft **1.20.1**, Forge **47.4.23**, **83 mods**

**Launcher ทางการของ Minecraft import modpack ไม่ได้** ต้องใช้ launcher ตัวใดตัวหนึ่งด้านล่าง
นี่ไม่ใช่ข้อจำกัดของ pack นี้ แต่ launcher ทางการไม่มีฟีเจอร์ modpack เลย

---

## ก่อนเริ่ม

- **Java 17** Forge 47.x สำหรับ 1.20.1 ต้องใช้ launcher ทั้งสองตัวด้านล่างติดตั้งให้ได้
- **แรมที่จัดให้เกม 8 GB** ขั้นต่ำ 6 GB — 83 mod ที่มีทั้ง contraption ของ Create, pathfinding ของ
  MineColonies และ Born in Chaos ไม่ใช่ pack เบา ๆ
- **พื้นที่ดิสก์ ~2 GB** สำหรับ instance หลังโหลด mod ครบ

---

## ทางเลือก A — CurseForge App *(แนะนำ: อัตโนมัติทั้งหมด)*

1. เปิด CurseForge App → **Minecraft** → **Create Custom Profile** → **Import**
2. เลือกไฟล์ `Industrial-Civilization-Survival-0.1.0-alpha.zip`
3. รอโหลด mod เสร็จ แล้วกด **Play**

**ทำไมถึงแนะนำตัวนี้:** มี mod สี่ตัวที่ผู้เขียนปิดการดาวน์โหลดจากบุคคลที่สาม CurseForge App เป็น
first-party จึงโหลดได้ตามปกติ ส่วนทางอื่นทั้งหมดคุณต้องไปโหลดสี่ตัวนั้นเองด้วยมือ — ดูด้านล่าง

## ทางเลือก B — Prism Launcher

1. **Add Instance** → **Import from zip** → เลือกไฟล์ zip เดิม → **OK**
2. Prism จะ resolve เท่าที่ทำได้ และจะแจ้งว่ามี **mod สี่ตัวที่ต้องโหลดเอง**
3. โหลดแต่ละตัวแล้วเอาไฟล์ `.jar` ไปวางในโฟลเดอร์ `mods/` ของ instance:

   | Mod | ลิงก์ดาวน์โหลด |
   |---|---|
   | TakKit | <https://www.curseforge.com/minecraft/mc-mods/takkit/files/7013819> |
   | Flashier Flashlights | <https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights/files/8453760> |
   | Client Dynamic Light | <https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light/files/8627850> |
   | Player Microchip (Tracker) | <https://www.curseforge.com/minecraft/mc-mods/player-microchip/files/7782898> |

4. **Edit Instance → Settings → Memory** ตั้งค่าสูงสุดเป็น 8 GB
5. **Launch**

> mod สี่ตัวข้างบนไม่ใช่ของเสริม และไม่ได้พัง — ผู้เขียนปิดการแจกจ่ายผ่าน API ซึ่งเป็นสิทธิ์ของเขา
> เครื่องมือใดก็ตามที่ไม่ใช่ CurseForge App จำเป็นต้องให้คุณกดลิงก์เอง

## ทางเลือก C — สำหรับพัฒนา ตามการเปลี่ยนแปลงของ repo

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

คาดว่าจะใช้เวลา **3–6 นาที** ในการเปิดครั้งแรก Forge กำลังโหลด 83 mod และ Create, MineColonies
กับ KubeJS ต่างก็สร้าง registry และ recipe ตอนเริ่มระบบ

**ถ้ามันแครช** ไฟล์ที่มีประโยชน์คือ `logs/latest.log` ในโฟลเดอร์ instance — สองสามร้อยบรรทัดสุดท้าย
จะบอกว่า mod ตัวไหน ส่วน `crash-reports/` มีข้อมูลเดียวกันในรูปแบบที่อ่านง่ายกว่า

---

## ใน pack มีอะไร และยังไม่มีอะไร

นี่คือ `0.1.0-alpha` มันคือ **ชุด mod ที่ resolve และ pin เรียบร้อยแล้ว** — และยังไม่มีอย่างอื่น

- ✅ 83 mod ที่เวอร์ชันเป๊ะและตรวจสอบแล้ว Create pin ที่ `6.0.8`
- ❌ **ยังไม่มีงาน balance เลย** ดาเมจปืน เลือดม็อบ อัตรา spawn และต้นทุนกระสุน ยังเป็นค่า default
  ของแต่ละ mod ทั้งหมด เจตนาการออกแบบ — กระสุนเป็นทรัพยากรอุตสาหกรรม, สัตว์ประหลาดอันตราย
  เพราะ AI ไม่ใช่เพราะเลือดเยอะ — **ยังไม่ได้ถูกทำ**
- ❌ ยังไม่มี KubeJS recipe ไม่มี quest ไม่มี config ที่ปรับเอง

ดังนั้นมันรันได้ แต่ยังไม่ได้เล่นแบบที่เอกสารออกแบบบรรยายไว้ ดูสิ่งที่จะทำต่อได้ที่
`docs/OPEN-WORK-LEDGER.md`
<!-- lang:end -->
