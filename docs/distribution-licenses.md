<!-- lang:en -->
# Redistribution licences

**What this is.** One row per mod the pack ships, its licence, and where that licence was read.
*Visuals Spec §35* asks for it before shipping; ADR 0003 made the pack self-contained, which means
it has been redistributing 99 jars since the first build (107 as of Visuals V2).

**What it is not.** A legal opinion, and not a clean bill of health. **42 of 107 have not been read
yet.** A licence that could not be determined is recorded as unread, never assumed.

- **Swept:** 2026-08-27 · issue #53
- **Method:** Modrinth `/v2/project/{slug}` for licence id, name and body text; CurseForge project
  pages for `licenseType` and licence body. Source URLs taken from `docs/MODLIST.md`, which resolved
  all 99 from project ids — no slug was guessed.

## The finding that matters is not the licence list

The audit began as *"how many mods are All Rights Reserved."* That turned out to be the wrong
question. The authors who wrote about modpacks mostly **permit** them — and attach a condition:

> *Serene Seasons* — "You may include this mod in a Modrinth-hosted modpack **as long as you do not
> rehost the mod and only use builds uploaded directly by us**…"

> *Entity Culling* — "Feel free to use this mod in your Modrinth and CurseForge-hosted modpacks…
> **Do not redistribute the JAR files anywhere else!**"

Both permit modpack inclusion. Both forbid **rehosting the jar**. A *hosted* modpack satisfies that
because the platform downloads each mod from the author's own upload at install time.

**This pack does not do that.** ADR 0003 chose self-contained distribution — every jar is inside the
zip — for a reason the developer stated plainly: *"we can ship a patch directly."* That decision is
sound for the reasons it was made. It also happens to be the exact thing these terms exclude.

**The conflict is between our distribution model and their condition, not between our mod list and
their licences.** Swapping mods will not fix it; only changing how the pack is delivered will.

### Neither artifact avoids it

| Artifact | How mods reach the player | Rehosts a jar? |
|---|---|---|
| `…-instance.zip` (389 MB) | all 99 jars inside the zip | **yes, 99** |
| `…-server.zip` (332 MB) | all 89 jars inside the zip | **yes, 89** |
| `…-alpha.zip` (CurseForge, 132 MB) | **40** referenced by project/file id · **57** bundled in `overrides/mods/` | **yes, 57** |

The CurseForge-format export is closest to compliant, and still bundles 57 jars — packwiz puts
Modrinth-sourced mods in `overrides/` because a CurseForge manifest cannot reference them.

## Four authors switched off third-party distribution

`scripts/build/lib/pack.mjs` fetches these through the endpoint the website's Download button uses,
because the CurseForge API refuses to serve them:

| Mod | Source | Licence | Read from |
|---|---|---|---|
| Client Dynamic Light | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light) | Mozilla Public License 2.0 | project page |
| Flashier Flashlights | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights) | All Rights Reserved | project page |
| Player Microchip (Tracker) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/player-microchip) | All Rights Reserved | project page |
| TakKit | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/takkit) | MIT License | project page |

**That claim was too strong when this file first said it, and it is corrected here.**

The original wording was *"disabling API distribution is how an author says 'not in someone else's
pack'"*. What the flag **demonstrably** does is narrower: the third-party CurseForge API stops
returning a download URL, which is why `pack.mjs` falls back to the website endpoint. It is not by
itself a statement about modpacks.

The measurement that forces the correction: **all four appear in this pack's own CurseForge manifest
by project and file id**, which is the form CurseForge's own installer resolves —

```
takkit                1269552   IN MANIFEST
flashier-flashlights  1604184   IN MANIFEST
client-dynamic-light  1302060   IN MANIFEST
player-microchip      1488872   IN MANIFEST
```

So the flag distinguishes *third-party launchers* from *CurseForge itself*, and reading it as "no
modpacks" conflates the two. **What the author actually intended still has to be read off the
project page** — which for these four has not been done. They stay in the unread column; they are
just no longer described as prohibited.

**But the four are not one case.** *TakKit* is **MIT** and *Client Dynamic Light* is **MPL-2.0** —
both licences grant redistribution in their own text, so for those two the opt-out reads as a
platform preference rather than a prohibition. *Flashier Flashlights* and *Player Microchip* are
**All Rights Reserved**: no licence grant, plus an explicit opt-out. Those two are the ones with
nothing to stand on.

## Known conflicts with self-contained distribution

| Mod | Source | Licence | Read from |
|---|---|---|---|
| Entity Culling | [Modrinth](https://modrinth.com/mod/entityculling) | tr7zw Protective License | Modrinth API |
| Serene Seasons | [Modrinth](https://modrinth.com/mod/serene-seasons) | All Rights Reserved | Modrinth API |

Both **permit hosted modpacks** and both **forbid rehosting the jar**. Quoted above.

## Read and permitted — with conditions

Two authors state modpack terms plainly. Both were **misread by the abandoned classifier** and are
recorded here from the prose itself.

| Mod | What the author wrote | Reading |
|---|---|---|
| **Subtle Effects** | ✅ *"Use this mod in modpacks with credit and one or more links to any of the project pages"* · ❌ *"Reupload/publish this mod to any website without explicit permission"* | **modpack use permitted**, and `docs/MODLIST.md` already supplies the credit and the link. The reupload clause is the same rehosting question as Serene Seasons and Entity Culling |
| **Immersive Posts** | *"Do not redistribute this mod unless as part of a pack!"* | **permitted for packs**, explicitly. The classifier read this as a prohibition — it is the opposite |

## What the CurseForge half of this audit could not read

Descriptions on 16 CurseForge project pages did not yield any modpack-permission prose to the
scraper. That is a **limit of the method, not a finding about the mods** — CurseForge renders
descriptions in a form this extraction did not reach. Those rows stay unread and need a browser.

## Permissively licensed — 59 mods

Redistribution is granted by the licence text itself. GPL/LGPL/MPL additionally require that the
licence and source remain available; shipping the jars unmodified with `docs/MODLIST.md` linking
every project satisfies notice and source-location in the ordinary way, and no jar in this pack has
been modified.

| Mod | Source | Licence | Read from |
|---|---|---|---|
| [TACZ] Durability | [Modrinth](https://modrinth.com/mod/tacz-durability) | GNU General Public License v3.0 only | Modrinth API |
| AmbientSounds | [Modrinth](https://modrinth.com/mod/ambientsounds) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Architectury API | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/architectury-api) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Atlas Lib | [Modrinth](https://modrinth.com/mod/atlas-lib) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Attract to Sound ([NEO]Forge/Fabric): Sound & Stealth. | [Modrinth](https://modrinth.com/mod/attract-to-sound) | GNU General Public License v3.0 only | Modrinth API |
| Better Animations Collection | [Modrinth](https://modrinth.com/mod/better-animations-collection) | Mozilla Public License 2.0 | Modrinth API |
| BlockUI | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/blockui) | GNU General Public License version 3 (GPLv3) | project page |
| Carry On | [Modrinth](https://modrinth.com/mod/carry-on) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Chunky | [Modrinth](https://modrinth.com/mod/chunky) | GNU General Public License v3.0 only | Modrinth API |
| Cloth Config API | [Modrinth](https://modrinth.com/mod/cloth-config) | GNU Lesser General Public License v3.0 only | Modrinth API |
| ClothingCraft | [Modrinth](https://modrinth.com/mod/clothingcraft) | MIT License | Modrinth API |
| Clumps | [Modrinth](https://modrinth.com/mod/clumps) | MIT License | Modrinth API |
| Create Crafts & Additions | [Modrinth](https://modrinth.com/mod/createaddition) | MIT License | Modrinth API |
| Create: Diesel Generators | [Modrinth](https://modrinth.com/mod/create-diesel-generators) | MIT License | Modrinth API |
| Create: Steam 'n' Rails | [Modrinth](https://modrinth.com/mod/create-steam-n-rails) | GNU Lesser General Public License v3.0 only | Modrinth API |
| CreativeCore | [Modrinth](https://modrinth.com/mod/creativecore) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Curios API | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/curios) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Domum Ornamentum | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/domum-ornamentum) | GNU General Public License version 3 (GPLv3) | project page |
| Eating Animation [Neo/Forge] | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/eating-animation-forge) | MIT License | project page |
| Embeddium | [Modrinth](https://modrinth.com/mod/embeddium) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Farmer's Delight | [Modrinth](https://modrinth.com/mod/farmers-delight) | MIT License | Modrinth API |
| FastSuite | [Modrinth](https://modrinth.com/mod/fastsuite) | MIT License | Modrinth API |
| FerriteCore | [Modrinth](https://modrinth.com/mod/ferrite-core) | MIT License | Modrinth API |
| Framework | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/framework) | GNU Lesser General Public License version 2.1 (LGPLv2.1) | project page |
| GeckoLib | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/geckolib) | MIT License | project page |
| GroovyModLoader (GML) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/gml) | MIT License | project page |
| IceAndFire Community Edition | [Modrinth](https://modrinth.com/mod/iceandfire-ce) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| ImmediatelyFast | [Modrinth](https://modrinth.com/mod/immediatelyfast) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| In Control! | [Modrinth](https://modrinth.com/mod/in-control) | MIT License | Modrinth API |
| ItemPhysic | [Modrinth](https://modrinth.com/mod/itemphysic) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Jupiter | [Modrinth](https://modrinth.com/mod/jupiter) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Just Enough Items (JEI) | [Modrinth](https://modrinth.com/mod/jei) | MIT License | Modrinth API |
| KubeJS | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/kubejs) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Lexiconfig | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/lexiconfig) | GNU General Public License version 3 (GPLv3) | project page |
| ModernFix | [Modrinth](https://modrinth.com/mod/modernfix) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Mouse Tweaks | [Modrinth](https://modrinth.com/mod/mouse-tweaks) | BSD 3 Clause "New" or "Revised" License | Modrinth API |
| Multi-Piston | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/multi-piston) | GNU General Public License version 3 (GPLv3) | project page |
| Placebo | [Modrinth](https://modrinth.com/mod/placebo) | MIT License | Modrinth API |
| playerAnimator | [Modrinth](https://modrinth.com/mod/playeranimator) | MIT License | Modrinth API |
| PlayerRevive | [Modrinth](https://modrinth.com/mod/playerrevive) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Polymorph | [Modrinth](https://modrinth.com/mod/polymorph) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Puzzles Lib | [Modrinth](https://modrinth.com/mod/puzzles-lib) | Mozilla Public License 2.0 | Modrinth API |
| Rhino | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/rhino) | Mozilla Public License 2.0 | project page |
| Ritchie's Projectile Library | [Modrinth](https://modrinth.com/mod/rpl) | MIT License | Modrinth API |
| Security Craft | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/security-craft) | MIT License | project page |
| ServerCore | [Modrinth](https://modrinth.com/mod/servercore) | MIT License | Modrinth API |
| Simple Voice Radio | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/simple-voice-radio) | GNU General Public License version 3 (GPLv3) | project page |
| Sound Physics Remastered | [Modrinth](https://modrinth.com/mod/sound-physics-remastered) | GNU General Public License v3.0 only | Modrinth API |
| Structurize | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/structurize) | GNU General Public License version 3 (GPLv3) | project page |
| TaCZ x Guns Lights Addon [NEW] - Update 2.5.0 | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/tacz-x-gunslightsaddon-addon) | Academic Free License v3.0 | project page |
| The Hordes | [Modrinth](https://modrinth.com/mod/the-hordes) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Uranus | [Modrinth](https://modrinth.com/mod/uranus) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Visual Workbench | [Modrinth](https://modrinth.com/mod/visual-workbench) | Mozilla Public License 2.0 | Modrinth API |
| YetAnotherConfigLib (YACL) | [Modrinth](https://modrinth.com/mod/yacl) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Better Biome Blend | [Modrinth](https://modrinth.com/mod/better-biome-blend) | Unlicense | Modrinth API |
| Fancy World Animations | [Modrinth](https://modrinth.com/mod/fwa) | MIT | Modrinth API |
| Kotlin for Forge | [Modrinth](https://modrinth.com/mod/kotlin-for-forge) | LGPL 2.1 only | Modrinth API |
| Soft Imprints | [Modrinth](https://modrinth.com/mod/snow-imprints) | MIT | Modrinth API |
| Particle Rain | [Modrinth](https://modrinth.com/mod/particle-rain) | MIT | Modrinth API |

## Not read yet — 42 mods

These carry a custom or All-Rights-Reserved licence, or a licence whose body says nothing about
modpacks. **Nothing is claimed about them.** Each needs its project page read by a person; the
answer is usually in prose, not in a field.

| Mod | Source | Licence | Read from |
|---|---|---|---|
| [TaCZ] Timeless and Classics Zero Guns | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/timeless-and-classics-zero) | — | project page |
| Balm | [Modrinth](https://modrinth.com/mod/balm) | All Rights Reserved | Modrinth API |
| Born in Chaos | [Modrinth](https://modrinth.com/mod/borninchaos) | All Rights Reserved | Modrinth API |
| Brimm Armors \| Tactical Military Armors | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/brimm-armors-tactical-military-armors) | Custom License | project page |
| CAPS_Awim - TACTICAL_GEAR | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/caps-awim-tactical-gear) | All Rights Reserved | project page |
| Corpse | [Modrinth](https://modrinth.com/mod/corpse) | All Rights Reserved | Modrinth API |
| Crafting Tweaks | [Modrinth](https://modrinth.com/mod/crafting-tweaks) | All Rights Reserved | Modrinth API |
| Create | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/create) | — | project page |
| Create Big Cannons | [Modrinth](https://modrinth.com/mod/create-big-cannons) | Create Big Cannons License | Modrinth API |
| Create: Timeless and Classics Zero [TaCZ] | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/tacz-create) | — | project page |
| Critters and Companions | [Modrinth](https://modrinth.com/mod/critters-and-companions) | All Rights Reserved | Modrinth API |
| Cupboard | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/cupboard) | — | project page |
| Ecologics | [Modrinth](https://modrinth.com/mod/ecologics) | Multiple | Modrinth API |
| Enhanced AI | [Modrinth](https://modrinth.com/mod/enhanced-ai) | All Rights Reserved | Modrinth API |
| FTB Library (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-library-forge) | All Rights Reserved | project page |
| FTB Quests (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-quests-forge) | All Rights Reserved | project page |
| FTB Teams (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-teams-forge) | All Rights Reserved | project page |
| GlitchCore | [Modrinth](https://modrinth.com/mod/glitchcore) | All Rights Reserved | Modrinth API |
| Grillo's Clothes | [Modrinth](https://modrinth.com/mod/grillos-clothes) | All Rights Reserved | Modrinth API |
| Immersive Engineering | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/immersive-engineering) | Custom License | project page |
| Immersive Posts | [Modrinth](https://modrinth.com/mod/immersiveposts) | Custom | Modrinth API |
| Improved Mobs | [Modrinth](https://modrinth.com/mod/improved-mobs) | All Rights Reserved | Modrinth API |
| InsaneLib | [Modrinth](https://modrinth.com/mod/insanelib) | All Rights Reserved | Modrinth API |
| Jade Addons (Neo/Forge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/jade-addons) | All Rights Reserved | project page |
| Jade 🔍 | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/jade) | Custom License | project page |
| Macaw's Lights and Lamps | [Modrinth](https://modrinth.com/mod/macaws-lights-and-lamps) | All Rights Reserved | Modrinth API |
| MineColonies | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/minecolonies) | Custom License | project page |
| MrCrayfish's Furniture Mod: Refurbished | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/refurbished-furniture) | Custom License | project page |
| Naturalist | [Modrinth](https://modrinth.com/mod/naturalist) | Custom | Modrinth API |
| Not Enough Animations | [Modrinth](https://modrinth.com/mod/not-enough-animations) | tr7zw Protective License | Modrinth API |
| Simple Voice Chat | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat) | All Rights Reserved | project page |
| Smooth Movement | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/smooth-movement) | All Rights Reserved | project page |
| SmoothPlayerAnimations | [Modrinth](https://modrinth.com/mod/smoothplayeranimations) | All Rights Reserved | Modrinth API |
| Sophisticated Backpacks | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks) | All Rights Reserved | project page |
| Sophisticated Core | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-core) | All Rights Reserved | project page |
| Sophisticated Tactical Backpacks | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-tactical-backpacks) | All Rights Reserved | project page |
| TaCZ Additions | [Modrinth](https://modrinth.com/mod/tacz-additions) | All Rights Reserved | Modrinth API |
| TenshiLib | [Modrinth](https://modrinth.com/mod/tenshilib) | All Rights Reserved | Modrinth API |
| TownTalk | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/towntalk) | All Rights Reserved | project page |
| Fzzy Config | [Modrinth](https://modrinth.com/mod/fzzy-config) | TDL M | Modrinth API |
| Grassier Grass | [Modrinth](https://modrinth.com/mod/grassier-grass) | All Rights Reserved | Modrinth API |
| Subtle Effects | [Modrinth](https://modrinth.com/mod/subtle-effects) | All Rights Reserved | Modrinth API |

## Decisions this needs, which are not the agent's to make

1. **Does the pack stay self-contained?** Keeping it means asking the affected authors for
   permission, or dropping their mods. Changing it means a packwiz/CurseForge-style install where
   each mod downloads from its author — which loses the direct-patch property ADR 0003 was chosen
   for.
2. **Private or public?** Handing a zip to three named friends is a materially different act from
   listing it on CurseForge or Modrinth, where §33/§34 want it and where both platforms enforce
   modpack permissions at upload.
3. **The two All-Rights-Reserved opt-outs** — Flashier Flashlights and Player Microchip. Ask, or
   remove them from the bundled build and make them a manual install step.

Until those are answered, the honest description of the pack's redistribution basis is
**unestablished** — not permitted, not prohibited.

## What was not done

**The 39 unread project pages.** That is the bulk of the remaining work and it is reading, not
scripting.

**Anything about resource packs or datapacks**, and anything about the mods the Visuals Spec
proposes but has not installed. `docs/khaojee-visual-reference.md` records their licences.
<!-- lang:end -->

<!-- lang:th -->
# สัญญาอนุญาตในการแจกจ่ายซ้ำ

**นี่คืออะไร** หนึ่งแถวต่อหนึ่งมอดที่ pack ส่งไป สัญญาอนุญาตของมัน และอ่านมาจากไหน
*Visuals Spec §35* ขอไว้ให้ทำก่อนส่งมอบ ส่วน ADR 0003 ทำให้ pack เป็นแบบมีทุกอย่างในตัว
ซึ่งแปลว่ามันแจกจ่าย jar 99 ตัวซ้ำมาตั้งแต่ build แรก (107 ตัวนับตั้งแต่ Visuals V2)

**ไม่ใช่อะไร** ไม่ใช่ความเห็นทางกฎหมาย และไม่ใช่ใบรับรองว่าทุกอย่างสะอาด **42 จาก 107 ยังไม่ได้อ่าน**
สัญญาอนุญาตที่หาไม่ได้ถูกบันทึกว่ายังไม่ได้อ่าน ไม่ใช่สมมติเอา

- **กวาดเมื่อ:** 2026-08-27 · issue #53
- **วิธี:** Modrinth `/v2/project/{slug}` สำหรับ id ชื่อ และเนื้อความของสัญญาอนุญาต;
  หน้าโปรเจกต์ CurseForge สำหรับ `licenseType` และเนื้อความ URL ต้นทางเอามาจาก `docs/MODLIST.md`
  ซึ่ง resolve มาครบ 99 ตัวจาก project id — ไม่มีการเดา slug

## สิ่งที่สำคัญไม่ใช่รายการสัญญาอนุญาต

การ audit เริ่มจากคำถามว่า *"มีกี่ตัวที่เป็น All Rights Reserved"* ปรากฏว่านั่นเป็นคำถามที่ผิด
ผู้เขียนที่เขียนถึง modpack ส่วนใหญ่**อนุญาต** — และแนบเงื่อนไขมาด้วย:

> *Serene Seasons* — "คุณใส่มอดนี้ใน modpack ที่โฮสต์บน Modrinth ได้ **ตราบใดที่คุณไม่ rehost มอด
> และใช้เฉพาะ build ที่เราอัปโหลดเองโดยตรง**…"

> *Entity Culling* — "ใช้มอดนี้ใน modpack ที่โฮสต์บน Modrinth และ CurseForge ได้เลย…
> **อย่าแจกจ่ายไฟล์ JAR ซ้ำที่อื่น!**"

ทั้งคู่อนุญาตให้ใส่ modpack ทั้งคู่ห้าม **rehost ตัว jar** modpack แบบ*โฮสต์*ทำตามเงื่อนไขนั้นได้
เพราะแพลตฟอร์มดาวน์โหลดมอดแต่ละตัวจากที่ผู้เขียนอัปโหลดไว้เองตอนติดตั้ง

**pack นี้ไม่ได้ทำแบบนั้น** ADR 0003 เลือกการแจกจ่ายแบบมีทุกอย่างในตัว — jar ทุกตัวอยู่ใน zip —
ด้วยเหตุผลที่ผู้พัฒนาพูดไว้ตรง ๆ ว่า *"เราออก patch ได้ตรง ๆ"* การตัดสินใจนั้นสมเหตุสมผลตามเหตุผลของมัน
และมันก็บังเอิญเป็นสิ่งที่เงื่อนไขพวกนี้กันออกพอดี

**ความขัดแย้งอยู่ระหว่างรูปแบบการแจกจ่ายของเรากับเงื่อนไขของเขา ไม่ใช่ระหว่างรายชื่อมอดกับสัญญาอนุญาต**
การสลับมอดแก้ไม่ได้ มีแต่การเปลี่ยนวิธีส่งมอบเท่านั้น

### ไม่มี artifact ตัวไหนเลี่ยงมันได้

| Artifact | มอดไปถึงผู้เล่นยังไง | rehost jar ไหม |
|---|---|---|
| `…-instance.zip` (389 MB) | jar ทั้ง 99 ตัวอยู่ใน zip | **ใช่ 99 ตัว** |
| `…-server.zip` (332 MB) | jar ทั้ง 89 ตัวอยู่ใน zip | **ใช่ 89 ตัว** |
| `…-alpha.zip` (CurseForge, 132 MB) | **40** อ้างด้วย project/file id · **57** ใส่ไว้ใน `overrides/mods/` | **ใช่ 57 ตัว** |

ตัว export รูปแบบ CurseForge ใกล้เคียงกับที่ถูกต้องที่สุด และก็ยังใส่ jar มา 57 ตัว —
packwiz เอามอดที่มาจาก Modrinth ไปไว้ใน `overrides/` เพราะ manifest ของ CurseForge อ้างถึงมันไม่ได้

## ผู้เขียนสี่คนปิดการแจกจ่ายผ่านบุคคลที่สาม

`scripts/build/lib/pack.mjs` ดึงพวกนี้ผ่าน endpoint เดียวกับที่ปุ่มดาวน์โหลดบนเว็บใช้
เพราะ CurseForge API ปฏิเสธที่จะให้:

| Mod | Source | Licence | Read from |
|---|---|---|---|
| Client Dynamic Light | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/client-dynamic-light) | Mozilla Public License 2.0 | project page |
| Flashier Flashlights | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/flashier-flashlights) | All Rights Reserved | project page |
| Player Microchip (Tracker) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/player-microchip) | All Rights Reserved | project page |
| TakKit | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/takkit) | MIT License | project page |

**คำกล่าวนั้นแรงเกินไปตอนที่ไฟล์นี้เขียนครั้งแรก และแก้ตรงนี้แล้ว**

ถ้อยคำเดิมคือ *"การปิดการแจกจ่ายผ่าน API คือวิธีที่ผู้เขียนบอกว่าไม่เอาไปใส่ pack ของคนอื่น"*
สิ่งที่แฟล็กนั้นทำ**ได้จริง**แคบกว่านั้น: CurseForge API ของบุคคลที่สามจะหยุดคืน URL ดาวน์โหลด
ซึ่งเป็นเหตุผลที่ `pack.mjs` ถอยไปใช้ endpoint ของเว็บ มันไม่ใช่คำแถลงเรื่อง modpack ในตัวมันเอง

การวัดที่บังคับให้ต้องแก้: **ทั้งสี่ตัวปรากฏใน CurseForge manifest ของ pack นี้เองด้วย project
และ file id** ซึ่งเป็นรูปแบบที่ตัวติดตั้งของ CurseForge เองอ่าน —

```
takkit                1269552   IN MANIFEST
flashier-flashlights  1604184   IN MANIFEST
client-dynamic-light  1302060   IN MANIFEST
player-microchip      1488872   IN MANIFEST
```

แฟล็กนั้นจึงแยก *launcher ของบุคคลที่สาม* ออกจาก *ตัว CurseForge เอง* และการอ่านมันว่า "ห้าม modpack"
คือการรวมสองเรื่องเข้าด้วยกัน **เจตนาจริงของผู้เขียนยังต้องไปอ่านจากหน้าโปรเจกต์อยู่ดี** —
ซึ่งสำหรับสี่ตัวนี้ยังไม่ได้ทำ พวกมันจึงยังอยู่ในคอลัมน์ที่ยังไม่ได้อ่าน แค่ไม่ได้ถูกอธิบายว่าต้องห้ามอีกต่อไป

**แต่ทั้งสี่ไม่ใช่กรณีเดียวกัน** *TakKit* เป็น **MIT** และ *Client Dynamic Light* เป็น **MPL-2.0** —
สัญญาอนุญาตทั้งสองให้สิทธิ์แจกจ่ายซ้ำในตัวข้อความเอง สำหรับสองตัวนี้การปิด API
จึงอ่านได้ว่าเป็นความชอบส่วนตัวเรื่องแพลตฟอร์ม ไม่ใช่ข้อห้าม ส่วน *Flashier Flashlights*
กับ *Player Microchip* เป็น **All Rights Reserved**: ไม่มีการให้สิทธิ์ บวกกับการปิดอย่างชัดเจน
สองตัวนี้คือตัวที่ไม่มีอะไรรองรับเลย

## ความขัดแย้งที่รู้แล้วกับการแจกจ่ายแบบมีทุกอย่างในตัว

| Mod | Source | Licence | Read from |
|---|---|---|---|
| Entity Culling | [Modrinth](https://modrinth.com/mod/entityculling) | tr7zw Protective License | Modrinth API |
| Serene Seasons | [Modrinth](https://modrinth.com/mod/serene-seasons) | All Rights Reserved | Modrinth API |

ทั้งคู่**อนุญาต modpack แบบโฮสต์** และทั้งคู่**ห้าม rehost ตัว jar** อ้างข้อความไว้ข้างบนแล้ว

## อ่านแล้วและอนุญาต — โดยมีเงื่อนไข

ผู้เขียนสองคนระบุเงื่อนไข modpack ไว้ตรง ๆ ทั้งคู่**ถูกตัวจัดประเภทที่เลิกใช้แล้วอ่านผิด**
และบันทึกตรงนี้จากตัวข้อความเอง

| มอด | ผู้เขียนเขียนว่า | การอ่าน |
|---|---|---|
| **Subtle Effects** | ✅ *"ใช้มอดนี้ใน modpack ได้โดยให้เครดิตและใส่ลิงก์ไปยังหน้าโปรเจกต์อย่างน้อยหนึ่งลิงก์"* · ❌ *"ห้ามอัปโหลดซ้ำ/เผยแพร่มอดนี้ไปยังเว็บไซต์ใด ๆ โดยไม่ได้รับอนุญาตชัดแจ้ง"* | **อนุญาตให้ใช้ใน modpack** และ `docs/MODLIST.md` ให้เครดิตกับลิงก์ไว้แล้ว ส่วนข้อห้ามอัปโหลดซ้ำคือคำถามเรื่อง rehost เดียวกับ Serene Seasons และ Entity Culling |
| **Immersive Posts** | *"อย่าแจกจ่ายมอดนี้ซ้ำ เว้นแต่เป็นส่วนหนึ่งของ pack!"* | **อนุญาตสำหรับ pack** อย่างชัดเจน ตัวจัดประเภทอ่านมันเป็นข้อห้าม — ซึ่งตรงข้ามกัน |

## สิ่งที่ฝั่ง CurseForge ของ audit นี้อ่านไม่ได้

คำอธิบายบนหน้าโปรเจกต์ CurseForge 16 หน้าไม่ได้ให้ข้อความเรื่องสิทธิ์ modpack กับตัวดึงข้อมูลเลย
นั่นเป็น**ข้อจำกัดของวิธี ไม่ใช่สิ่งที่พบเกี่ยวกับมอด** — CurseForge แสดงคำอธิบายในรูปแบบที่การดึงนี้เข้าไม่ถึง
แถวเหล่านั้นยังเป็นยังไม่ได้อ่าน และต้องใช้เบราว์เซอร์

## สัญญาอนุญาตแบบเปิด — 59 มอด

สิทธิ์แจกจ่ายซ้ำมาจากตัวข้อความสัญญาอนุญาตเอง GPL/LGPL/MPL ต้องการเพิ่มว่าสัญญาอนุญาตและซอร์ส
ต้องยังเข้าถึงได้ การส่ง jar ไปโดยไม่ดัดแปลงพร้อม `docs/MODLIST.md` ที่ลิงก์ทุกโปรเจกต์
ก็ตอบเรื่องการแจ้งและที่อยู่ของซอร์สตามปกติ และไม่มี jar ตัวไหนใน pack นี้ถูกดัดแปลง

| Mod | Source | Licence | Read from |
|---|---|---|---|
| [TACZ] Durability | [Modrinth](https://modrinth.com/mod/tacz-durability) | GNU General Public License v3.0 only | Modrinth API |
| AmbientSounds | [Modrinth](https://modrinth.com/mod/ambientsounds) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Architectury API | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/architectury-api) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Atlas Lib | [Modrinth](https://modrinth.com/mod/atlas-lib) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Attract to Sound ([NEO]Forge/Fabric): Sound & Stealth. | [Modrinth](https://modrinth.com/mod/attract-to-sound) | GNU General Public License v3.0 only | Modrinth API |
| Better Animations Collection | [Modrinth](https://modrinth.com/mod/better-animations-collection) | Mozilla Public License 2.0 | Modrinth API |
| BlockUI | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/blockui) | GNU General Public License version 3 (GPLv3) | project page |
| Carry On | [Modrinth](https://modrinth.com/mod/carry-on) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Chunky | [Modrinth](https://modrinth.com/mod/chunky) | GNU General Public License v3.0 only | Modrinth API |
| Cloth Config API | [Modrinth](https://modrinth.com/mod/cloth-config) | GNU Lesser General Public License v3.0 only | Modrinth API |
| ClothingCraft | [Modrinth](https://modrinth.com/mod/clothingcraft) | MIT License | Modrinth API |
| Clumps | [Modrinth](https://modrinth.com/mod/clumps) | MIT License | Modrinth API |
| Create Crafts & Additions | [Modrinth](https://modrinth.com/mod/createaddition) | MIT License | Modrinth API |
| Create: Diesel Generators | [Modrinth](https://modrinth.com/mod/create-diesel-generators) | MIT License | Modrinth API |
| Create: Steam 'n' Rails | [Modrinth](https://modrinth.com/mod/create-steam-n-rails) | GNU Lesser General Public License v3.0 only | Modrinth API |
| CreativeCore | [Modrinth](https://modrinth.com/mod/creativecore) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Curios API | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/curios) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Domum Ornamentum | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/domum-ornamentum) | GNU General Public License version 3 (GPLv3) | project page |
| Eating Animation [Neo/Forge] | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/eating-animation-forge) | MIT License | project page |
| Embeddium | [Modrinth](https://modrinth.com/mod/embeddium) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Farmer's Delight | [Modrinth](https://modrinth.com/mod/farmers-delight) | MIT License | Modrinth API |
| FastSuite | [Modrinth](https://modrinth.com/mod/fastsuite) | MIT License | Modrinth API |
| FerriteCore | [Modrinth](https://modrinth.com/mod/ferrite-core) | MIT License | Modrinth API |
| Framework | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/framework) | GNU Lesser General Public License version 2.1 (LGPLv2.1) | project page |
| GeckoLib | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/geckolib) | MIT License | project page |
| GroovyModLoader (GML) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/gml) | MIT License | project page |
| IceAndFire Community Edition | [Modrinth](https://modrinth.com/mod/iceandfire-ce) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| ImmediatelyFast | [Modrinth](https://modrinth.com/mod/immediatelyfast) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| In Control! | [Modrinth](https://modrinth.com/mod/in-control) | MIT License | Modrinth API |
| ItemPhysic | [Modrinth](https://modrinth.com/mod/itemphysic) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Jupiter | [Modrinth](https://modrinth.com/mod/jupiter) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Just Enough Items (JEI) | [Modrinth](https://modrinth.com/mod/jei) | MIT License | Modrinth API |
| KubeJS | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/kubejs) | GNU Lesser General Public License version 3 (LGPLv3) | project page |
| Lexiconfig | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/lexiconfig) | GNU General Public License version 3 (GPLv3) | project page |
| ModernFix | [Modrinth](https://modrinth.com/mod/modernfix) | GNU Lesser General Public License v3.0 only | Modrinth API |
| Mouse Tweaks | [Modrinth](https://modrinth.com/mod/mouse-tweaks) | BSD 3 Clause "New" or "Revised" License | Modrinth API |
| Multi-Piston | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/multi-piston) | GNU General Public License version 3 (GPLv3) | project page |
| Placebo | [Modrinth](https://modrinth.com/mod/placebo) | MIT License | Modrinth API |
| playerAnimator | [Modrinth](https://modrinth.com/mod/playeranimator) | MIT License | Modrinth API |
| PlayerRevive | [Modrinth](https://modrinth.com/mod/playerrevive) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Polymorph | [Modrinth](https://modrinth.com/mod/polymorph) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Puzzles Lib | [Modrinth](https://modrinth.com/mod/puzzles-lib) | Mozilla Public License 2.0 | Modrinth API |
| Rhino | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/rhino) | Mozilla Public License 2.0 | project page |
| Ritchie's Projectile Library | [Modrinth](https://modrinth.com/mod/rpl) | MIT License | Modrinth API |
| Security Craft | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/security-craft) | MIT License | project page |
| ServerCore | [Modrinth](https://modrinth.com/mod/servercore) | MIT License | Modrinth API |
| Simple Voice Radio | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/simple-voice-radio) | GNU General Public License version 3 (GPLv3) | project page |
| Sound Physics Remastered | [Modrinth](https://modrinth.com/mod/sound-physics-remastered) | GNU General Public License v3.0 only | Modrinth API |
| Structurize | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/structurize) | GNU General Public License version 3 (GPLv3) | project page |
| TaCZ x Guns Lights Addon [NEW] - Update 2.5.0 | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/tacz-x-gunslightsaddon-addon) | Academic Free License v3.0 | project page |
| The Hordes | [Modrinth](https://modrinth.com/mod/the-hordes) | GNU Lesser General Public License v2.1 only | Modrinth API |
| Uranus | [Modrinth](https://modrinth.com/mod/uranus) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Visual Workbench | [Modrinth](https://modrinth.com/mod/visual-workbench) | Mozilla Public License 2.0 | Modrinth API |
| YetAnotherConfigLib (YACL) | [Modrinth](https://modrinth.com/mod/yacl) | GNU Lesser General Public License v3.0 or later | Modrinth API |
| Better Biome Blend | [Modrinth](https://modrinth.com/mod/better-biome-blend) | Unlicense | Modrinth API |
| Fancy World Animations | [Modrinth](https://modrinth.com/mod/fwa) | MIT | Modrinth API |
| Kotlin for Forge | [Modrinth](https://modrinth.com/mod/kotlin-for-forge) | LGPL 2.1 only | Modrinth API |
| Soft Imprints | [Modrinth](https://modrinth.com/mod/snow-imprints) | MIT | Modrinth API |
| Particle Rain | [Modrinth](https://modrinth.com/mod/particle-rain) | MIT | Modrinth API |

## ยังไม่ได้อ่าน — 42 มอด

พวกนี้มีสัญญาอนุญาตแบบ custom หรือ All Rights Reserved หรือมีเนื้อความที่ไม่ได้พูดถึง modpack เลย
**ไม่มีการอ้างอะไรเกี่ยวกับพวกมัน** แต่ละตัวต้องให้คนไปอ่านหน้าโปรเจกต์ คำตอบมักอยู่ในข้อความ ไม่ใช่ในฟิลด์

| Mod | Source | Licence | Read from |
|---|---|---|---|
| [TaCZ] Timeless and Classics Zero Guns | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/timeless-and-classics-zero) | — | project page |
| Balm | [Modrinth](https://modrinth.com/mod/balm) | All Rights Reserved | Modrinth API |
| Born in Chaos | [Modrinth](https://modrinth.com/mod/borninchaos) | All Rights Reserved | Modrinth API |
| Brimm Armors \| Tactical Military Armors | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/brimm-armors-tactical-military-armors) | Custom License | project page |
| CAPS_Awim - TACTICAL_GEAR | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/caps-awim-tactical-gear) | All Rights Reserved | project page |
| Corpse | [Modrinth](https://modrinth.com/mod/corpse) | All Rights Reserved | Modrinth API |
| Crafting Tweaks | [Modrinth](https://modrinth.com/mod/crafting-tweaks) | All Rights Reserved | Modrinth API |
| Create | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/create) | — | project page |
| Create Big Cannons | [Modrinth](https://modrinth.com/mod/create-big-cannons) | Create Big Cannons License | Modrinth API |
| Create: Timeless and Classics Zero [TaCZ] | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/tacz-create) | — | project page |
| Critters and Companions | [Modrinth](https://modrinth.com/mod/critters-and-companions) | All Rights Reserved | Modrinth API |
| Cupboard | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/cupboard) | — | project page |
| Ecologics | [Modrinth](https://modrinth.com/mod/ecologics) | Multiple | Modrinth API |
| Enhanced AI | [Modrinth](https://modrinth.com/mod/enhanced-ai) | All Rights Reserved | Modrinth API |
| FTB Library (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-library-forge) | All Rights Reserved | project page |
| FTB Quests (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-quests-forge) | All Rights Reserved | project page |
| FTB Teams (NeoForge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/ftb-teams-forge) | All Rights Reserved | project page |
| GlitchCore | [Modrinth](https://modrinth.com/mod/glitchcore) | All Rights Reserved | Modrinth API |
| Grillo's Clothes | [Modrinth](https://modrinth.com/mod/grillos-clothes) | All Rights Reserved | Modrinth API |
| Immersive Engineering | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/immersive-engineering) | Custom License | project page |
| Immersive Posts | [Modrinth](https://modrinth.com/mod/immersiveposts) | Custom | Modrinth API |
| Improved Mobs | [Modrinth](https://modrinth.com/mod/improved-mobs) | All Rights Reserved | Modrinth API |
| InsaneLib | [Modrinth](https://modrinth.com/mod/insanelib) | All Rights Reserved | Modrinth API |
| Jade Addons (Neo/Forge) | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/jade-addons) | All Rights Reserved | project page |
| Jade 🔍 | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/jade) | Custom License | project page |
| Macaw's Lights and Lamps | [Modrinth](https://modrinth.com/mod/macaws-lights-and-lamps) | All Rights Reserved | Modrinth API |
| MineColonies | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/minecolonies) | Custom License | project page |
| MrCrayfish's Furniture Mod: Refurbished | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/refurbished-furniture) | Custom License | project page |
| Naturalist | [Modrinth](https://modrinth.com/mod/naturalist) | Custom | Modrinth API |
| Not Enough Animations | [Modrinth](https://modrinth.com/mod/not-enough-animations) | tr7zw Protective License | Modrinth API |
| Simple Voice Chat | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/simple-voice-chat) | All Rights Reserved | project page |
| Smooth Movement | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/smooth-movement) | All Rights Reserved | project page |
| SmoothPlayerAnimations | [Modrinth](https://modrinth.com/mod/smoothplayeranimations) | All Rights Reserved | Modrinth API |
| Sophisticated Backpacks | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks) | All Rights Reserved | project page |
| Sophisticated Core | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-core) | All Rights Reserved | project page |
| Sophisticated Tactical Backpacks | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/sophisticated-tactical-backpacks) | All Rights Reserved | project page |
| TaCZ Additions | [Modrinth](https://modrinth.com/mod/tacz-additions) | All Rights Reserved | Modrinth API |
| TenshiLib | [Modrinth](https://modrinth.com/mod/tenshilib) | All Rights Reserved | Modrinth API |
| TownTalk | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/towntalk) | All Rights Reserved | project page |
| Fzzy Config | [Modrinth](https://modrinth.com/mod/fzzy-config) | TDL M | Modrinth API |
| Grassier Grass | [Modrinth](https://modrinth.com/mod/grassier-grass) | All Rights Reserved | Modrinth API |
| Subtle Effects | [Modrinth](https://modrinth.com/mod/subtle-effects) | All Rights Reserved | Modrinth API |

## การตัดสินใจที่ต้องใช้ และไม่ใช่หน้าที่ของ agent

1. **pack จะยังเป็นแบบมีทุกอย่างในตัวต่อไปไหม** ถ้าใช่ ต้องไปขออนุญาตผู้เขียนที่เกี่ยวข้อง หรือถอดมอดออก
   ถ้าเปลี่ยน ก็ต้องเป็นการติดตั้งแบบ packwiz/CurseForge ที่มอดแต่ละตัวดาวน์โหลดจากผู้เขียน —
   ซึ่งจะเสียคุณสมบัติการ patch ตรง ๆ ที่ ADR 0003 ถูกเลือกมาเพราะมัน
2. **ส่วนตัวหรือสาธารณะ** การส่ง zip ให้เพื่อนสามคนที่รู้จักชื่อ เป็นคนละเรื่องกับการลงบน CurseForge
   หรือ Modrinth ที่ §33/§34 อยากให้ไป และที่ทั้งสองแพลตฟอร์มบังคับใช้สิทธิ์ modpack ตอนอัปโหลด
3. **สองตัวที่เป็น All Rights Reserved และปิด API** — Flashier Flashlights กับ Player Microchip
   ไปขอ หรือถอดออกจาก build ที่รวมทุกอย่างแล้วทำเป็นขั้นตอนติดตั้งด้วยมือ

จนกว่าจะตอบสามข้อนี้ได้ คำอธิบายที่ตรงที่สุดของฐานการแจกจ่ายซ้ำของ pack คือ **ยังไม่ได้ถูกกำหนด** —
ไม่ใช่อนุญาต และไม่ใช่ห้าม

## สิ่งที่ยังไม่ได้ทำ

**หน้าโปรเจกต์ 39 หน้าที่ยังไม่ได้อ่าน** นั่นคือเนื้องานที่เหลือส่วนใหญ่ และมันคือการอ่าน ไม่ใช่การเขียนสคริปต์

**ทุกอย่างที่เกี่ยวกับ resource pack หรือ datapack** และทุกอย่างที่เกี่ยวกับมอดที่ Visuals Spec เสนอ
แต่ยังไม่ได้ติดตั้ง `docs/khaojee-visual-reference.md` บันทึกสัญญาอนุญาตของพวกนั้นไว้
<!-- lang:end -->
