# Addon Spec — Modpack Distribution, Updates & Friend Installation
## Claude Code CLI Implementation Handoff

> **Project:** Industrial Civilization Survival  
> **Platform:** Minecraft 1.20.1 Forge / Java 17  
> **Purpose:** สร้างระบบแจกจ่าย ติดตั้ง อัปเดต และทดสอบ modpack ให้เพื่อนสามารถใช้งานได้โดยไม่ต้องลง mod, config, KubeJS, resource pack หรือ compatibility fixes ด้วยตัวเอง
>
> เอกสารนี้ต้องสามารถใช้เป็น standalone implementation context สำหรับ Claude Code CLI ได้โดยไม่ต้องมี conversation history

---

# 1. Core Goal

หลัง custom modpack เสร็จ ผู้เล่นต้องสามารถ:

```text
Receive Pack
↓
Import / Install
↓
Launch
↓
Join Server
```

โดยไม่ต้อง:

```text
Download 70+ mods manually
Configure mods manually
Copy KubeJS scripts manually
Install resource packs manually
Find matching versions manually
Fix recipe configs manually
```

Core principle:

> **The modpack is the product, not the mod list.**

สิ่งที่ต้องแจกจ่ายจึงไม่ใช่เพียง `.jar` files แต่รวมถึง configuration และ custom integration ของทั้ง pack

---

# 2. Source of Truth

ใช้:

```text
Git
+
packwiz
```

เป็น development source of truth

Recommended repository:

```text
industrial-civilization-survival/
├── README.md
├── CHANGELOG.md
├── CLAUDE.md
├── PROJECT_PLAN.md
├── pack.toml
├── index.toml
│
├── mods/
├── config/
├── defaultconfigs/
├── kubejs/
├── resourcepacks/
├── datapacks/
├── ftbquests/
├── scripts/
└── docs/
```

Git repository เป็นแหล่งข้อมูลหลักของ:

- exact mod versions
- configs
- KubeJS
- datapacks
- quests
- custom resource packs
- balance changes
- compatibility fixes
- release metadata

ห้ามใช้ launcher instance ของ developer เป็น source of truth เพียงอย่างเดียว

---

# 3. Why packwiz

packwiz ใช้สำหรับจัดการ:

```text
Mod list
Exact versions
Download metadata
Pack metadata
Updates
Export/build workflow
```

เป้าหมายคือให้ modpack reproducible

กล่าวคือ:

```text
Fresh machine
+
Repository
+
Build process
=
Same pack
```

ไม่ควรเกิด:

```text
Developer PC works
Friend PC missing 4 mods
Server has another config
```

---

# 4. Files That Belong to the Pack

ต้องพิจารณาแจกไฟล์เหล่านี้:

```text
config/
defaultconfigs/
kubejs/
resourcepacks/
datapacks/
ftbquests/
```

รวมถึงไฟล์ custom อื่นที่ pack ใช้จริง

ตัวอย่าง:

```text
Tracker re-theme
JEI hidden item rules
Ammo recipes
Spawn rules
Dragon balance
Horde settings
Carry On blacklist
SecurityCraft restrictions
Immersive Engineering scope changes
Create integration
Wildlife tuning
```

ทั้งหมดนี้เป็นส่วนหนึ่งของ gameplay

---

# 5. Do Not Treat Mods Folder as the Pack

ผิด:

```text
zip mods/
send to friend
```

เพราะเพื่อนอาจได้:

```text
Correct mods
+
Wrong recipes
+
Wrong spawn rules
+
Wrong progression
+
Wrong textures
```

ผลคือ gameplay ไม่ใช่ Industrial Civilization Survival version เดียวกัน

---

# 6. Distribution Targets

รองรับอย่างน้อย 3 ระดับ

## A. Internal Development

ใช้:

```text
Git + packwiz
```

สำหรับ developer

---

## B. Friends / Closed Beta

Preferred:

```text
CurseForge-compatible profile
or
Modrinth .mrpack
or
Prism Launcher + packwiz updater
```

เลือกวิธีตาม compatibility และ licensing ของ mods จริง

---

## C. Public Stable Release

Target:

```text
CurseForge
and/or
Modrinth
```

หลัง pack stable แล้ว

---

# 7. Recommended Friend Workflow

สำหรับกลุ่มเพื่อน:

```text
Developer
↓
Update source repository
↓
Build release
↓
Publish version
↓
Friend imports pack
↓
Launcher downloads required mods
↓
Custom configs/assets included
↓
Launch
```

ครั้งแรก:

```text
Import once
```

ครั้งถัดไป:

```text
Update pack
```

แทนการ install ใหม่ทุกครั้ง

---

# 8. Versioning

ใช้ semantic-ish pack versions:

```text
0.1.0-alpha
0.2.0-alpha
0.5.0-beta
0.9.0-rc1
1.0.0
```

หรือ:

```text
Alpha 1
Alpha 2
Beta 1
Release 1.0
```

แต่ต้อง consistent

Recommended:

```text
MAJOR.MINOR.PATCH
```

ตัวอย่าง:

```text
0.3.0
```

หมายถึง feature/progression update

```text
0.3.1
```

หมายถึง compatibility/bugfix

---

# 9. Exact Mod Version Pinning

ทุก mod ต้อง pin exact version

ไม่ใช้:

```text
latest
```

แบบ runtime assumption

เพราะ update ของ mod หนึ่งตัวอาจทำให้:

```text
Create addon incompatibility
KubeJS recipe break
Entity registry change
Config schema change
World corruption
```

Update mod เป็น intentional operation เท่านั้น

---

# 10. Compatibility Matrix

Maintain:

```text
docs/compatibility-matrix.md
```

Minimum columns:

```text
Mod
Version
Minecraft
Forge
Side
Dependencies
Status
Known Issues
Last Tested
```

ทุก release ต้องอ้างอิง matrix เดียวกัน

---

# 11. Client vs Server Classification

แยก mods เป็น:

```text
COMMON
SERVER
CLIENT
```

ตัวอย่าง:

Client candidates:

```text
Mouse Tweaks
Not Enough Animations
Eating Animation
Client Dynamic Light
```

Common gameplay:

```text
Create
TaCZ
MineColonies
Born in Chaos
IceAndFire CE
```

Server-side logic/config อาจมีบางตัวที่ client ไม่จำเป็น

แต่ต้อง inspect exact mod requirement ก่อน classify

Do not guess.

---

# 12. Server Pack

สร้าง server distribution แยกจาก client pack เมื่อเหมาะสม

Server pack ต้อง:

```text
exclude unnecessary client-only mods
include common mods
include server configs
include KubeJS
include datapacks
include quest data if required
```

Goal:

```text
Client Pack Version
=
Server Pack Version
```

ถ้า mismatch:

server should reject or documentation should make mismatch obvious

---

# 13. Release Build Structure

Recommended output:

```text
dist/
├── client/
├── server/
├── manifests/
└── checksums/
```

Example:

```text
dist/
├── industrial-civilization-survival-0.4.0.mrpack
├── industrial-civilization-survival-0.4.0-curseforge.zip
├── industrial-civilization-survival-server-0.4.0.zip
└── SHA256SUMS.txt
```

Exact output depends on selected platform/export tools

---

# 14. Build Script

Create:

```text
scripts/build/
```

Possible commands:

```text
build-client
build-server
validate-pack
generate-checksums
```

Goal:

one deterministic release command

Concept:

```text
Validate
↓
Resolve pack
↓
Build Client
↓
Build Server
↓
Checksum
↓
Release artifacts
```

---

# 15. Validation Before Build

Validate at minimum:

```text
pack metadata valid
missing mods = 0
duplicate mods = 0
missing dependencies = 0
unexpected client/server mods = 0
KubeJS startup errors = 0
broken config references = 0
```

If possible also validate:

```text
duplicate recipes
missing resource pack assets
invalid datapacks
FTB Quests parse errors
```

---

# 16. Release Gate

ห้าม publish release เพราะแค่:

```text
Game launches once
```

Minimum gate:

```text
Clean client install
Dedicated server boot
Fresh world creation
Client join
Existing world load
Recipe test
Create machine test
TaCZ test
MineColonies test
Threat spawn test
Tracker test
JEI/Jade test
```

---

# 17. Clean Install Test

ทุก release candidate ต้อง test บน clean instance

ไม่ใช้ developer instance ที่มี cache เก่าเป็นหลักฐานเพียงอย่างเดียว

Test:

```text
Empty launcher profile
↓
Import release artifact
↓
Launch
↓
Join test server
```

นี่จำลอง experience ของเพื่อนจริงที่สุด

---

# 18. Existing World Upgrade Test

ถ้า release ใช้กับ world เดิม:

copy test world

แล้ว test:

```text
Old Pack Version
↓
Backup
↓
New Pack Version
↓
Load world
↓
Inspect critical systems
```

Critical systems:

```text
Create contraptions
Trains
MineColonies
Storage
Oil infrastructure
KubeJS items
FTB Quests
IceAndFire worldgen/entities
```

---

# 19. World Backup Rule

ก่อน update multiplayer server:

```text
STOP SERVER
↓
BACKUP WORLD
↓
BACKUP CONFIG
↓
UPDATE
↓
BOOT
↓
VALIDATE
```

ไม่ update production world แบบไม่มี backup

---

# 20. Backup Retention

Recommended minimum:

```text
Latest
Previous release
Known-good milestone
```

ตัวอย่าง:

```text
world-current
world-before-0.4.0
world-before-0.3.0
```

ถ้า storage พอ:

ใช้ rolling backups เพิ่ม

---

# 21. Packwiz Update Workflow

Concept:

```text
Change mod/config
↓
Update packwiz metadata
↓
Commit
↓
Test
↓
Tag release
↓
Build
```

อย่าแก้ไฟล์ใน launcher แล้วลืม sync กลับ repository

Repository ต้อง reflect runtime state

---

# 22. Git Branching

Simple strategy:

```text
main
=
stable / playable

develop
=
integration

feature/*
=
experimental changes
```

Season 2 high-risk stack:

```text
Valkyrien Skies
Clockwork
Warium
TFMG advanced integration
```

ควรอยู่ branch แยกจนกว่าจะ stable

ตัวอย่าง:

```text
feature/season2-aviation
```

---

# 23. Release Tags

Tag stable builds:

```text
v0.1.0-alpha
v0.4.0-beta
v1.0.0
```

Tag ต้องตรงกับ distributed artifact

---

# 24. Changelog

ทุก version ต้องมี:

```text
CHANGELOG.md
```

Example:

```text
## 0.4.0

Added
- Naturalist
- Critters and Companions
- Ecologics

Changed
- Reduced Born in Chaos forest spawn
- Rebalanced 5.56 production

Fixed
- Tracker frequency persistence
- Polymorph recipe conflict
```

---

# 25. Friend-Facing Release Notes

อย่าให้เพื่อนอ่าน technical changelog อย่างเดียว

สร้าง concise notes:

```text
What changed
Do I need a new world?
Do I need to update server?
Any controls changed?
Known issues?
```

Example:

```text
Version 0.4.0

- Adds wildlife ecosystem.
- Existing worlds supported; explore new chunks for some content.
- Server and clients must both update.
- Backup recommended.
```

---

# 26. Import Experience

Target friend UX:

```text
Download file
↓
Open launcher
↓
Import Modpack
↓
Choose RAM
↓
Launch
```

ไม่ควรมี manual post-install steps

ถ้า manual step หลีกเลี่ยงไม่ได้:

automation should be investigated first

---

# 27. Resource Packs

Custom resource packs เช่น:

```text
Tactical Tracker re-theme
Custom pack UI
Item naming
Textures
```

ควรถูก enabled automatically if platform allows

ผู้เล่นไม่ควรต้อง:

```text
Options
↓
Resource Packs
↓
Enable 4 packs manually
```

ทุก install

ถ้ามี multiple packs:

พิจารณารวม pack-owned assets เป็น:

```text
Industrial Civilization Resources
```

หนึ่งชุด

---

# 28. Datapacks

Pack-owned datapacks ควร distribute ผ่าน pack-controlled location

ต้องมั่นใจว่า:

```text
new world
existing world
dedicated server
```

โหลด datapack ตรงกัน

Do not require friends to manually copy into individual saves.

---

# 29. KubeJS

KubeJS เป็น critical runtime component

Release validation ต้อง inspect:

```text
latest.log
KubeJS startup log
server scripts
client scripts
```

Release gate:

```text
0 fatal KubeJS errors
```

Warnings ต้อง review ไม่ใช่ ignore ทั้งหมด

---

# 30. Config Ownership

Classify config files:

```text
PACK CONTROLLED
USER PREFERENCE
```

Pack-controlled examples:

```text
Spawn balance
Horde settings
Recipe/progression
SecurityCraft restrictions
Carry On blacklist
Weapon durability
Oil balancing
```

User preference examples:

```text
HUD position
Audio volume
Some visual settings
Keybinds
```

อย่า overwrite personal preferences โดยไม่จำเป็น

---

# 31. Config Migration

เมื่อ mod update เปลี่ยน config schema:

```text
Compare old config
↓
Generate new default
↓
Migrate intentional settings
↓
Test
```

อย่า copy old file blindly

---

# 32. Licensing and Redistribution

ก่อน public distribution:

inspect license/download policy ของทุก mod

Prefer launcher manifests ที่ให้ launcher ดาวน์โหลด mod จาก official platform

Do not assume every `.jar` may legally be bundled directly.

Record unusual redistribution constraints in:

```text
docs/distribution-licenses.md
```

---

# 33. CurseForge Distribution

Target use:

```text
Easy installation for CurseForge users
```

Export must include pack overrides/custom files while dependencies/mod downloads follow platform-supported mechanisms where applicable.

Test import on fresh CurseForge profile before publishing.

---

# 34. Modrinth Distribution

Target artifact:

```text
.mrpack
```

Advantages:

```text
portable pack format
Prism-compatible ecosystem
clear metadata
```

But every included mod/source must be validated for availability/permissions.

---

# 35. Prism Launcher

Prism is recommended for technical friends/testers

Potential workflow:

```text
Prism instance
+
packwiz updater
```

Benefits:

```text
easy instance management
logs accessible
multiple pack versions
good debugging workflow
```

---

# 36. Automatic Update Philosophy

For closed testing, ideal behavior:

```text
Friend launches/updater
↓
Checks pack version
↓
Downloads changed files/mods
↓
Launch
```

Do not implement a custom launcher unless existing tooling is insufficient.

Use existing pack/update ecosystem first.

---

# 37. Update Safety

Automatic update must never silently destroy:

```text
world saves
screenshots
options
keybinds
personal servers list
```

Pack updater should update pack-owned files only

where tooling permits.

---

# 38. Config Drift Detection

Potential validation tool:

```text
scripts/validate/config-drift
```

Goal:

detect accidental local edits to pack-controlled config

Useful for debugging:

```text
Friend A works
Friend B behaves differently
```

Check whether pack-controlled configs differ

---

# 39. Checksums

Generate SHA-256 for release artifacts where practical:

```text
SHA256SUMS.txt
```

Useful for:

```text
corrupted download
wrong version
release verification
```

---

# 40. Server Join Version Check

If practical, add a visible pack version string

Examples:

```text
Industrial Civilization Survival 0.4.0
```

Possible locations:

```text
Main menu
Server MOTD
Quest intro
Pack metadata
```

Goal:

easy debugging

```text
"What version are you on?"
```

should have simple answer

---

# 41. Server Update Procedure

Recommended documented procedure:

```text
1. Announce maintenance
2. Stop server cleanly
3. Backup world
4. Backup current pack
5. Deploy new server pack
6. Start server
7. Inspect logs
8. Run smoke tests
9. Allow players to join
```

---

# 42. Friend Update Procedure

Ideal:

```text
1. Download/import new release
2. Keep existing saves if local
3. Launch
4. Confirm version
5. Join server
```

No individual mod replacement instructions

except emergency hotfix cases.

---

# 43. Hotfixes

Example:

```text
0.4.0
→ crash discovered
→ 0.4.1
```

Hotfix should be full reproducible pack release

not:

```text
"just send this one jar in Discord"
```

except temporary diagnosis

Final fix belongs in source and release pipeline.

---

# 44. Development Builds

Development releases should be clearly marked:

```text
DEV
ALPHA
BETA
RC
STABLE
```

Friends should know whether world safety is guaranteed.

Example:

```text
0.3.0-alpha.4
```

---

# 45. World Compatibility Labels

Each release notes must specify one:

```text
SAFE FOR EXISTING WORLDS
BACKUP STRONGLY RECOMMENDED
NEW CHUNKS REQUIRED
NEW WORLD RECOMMENDED
NEW WORLD REQUIRED
```

Do not leave users guessing.

---

# 46. Performance Profiles

Optional later:

provide recommended profiles:

```text
Client Standard
Client Low
Server 2–4 players
Server 5–8 players
```

Do not fork gameplay configs

Only visual/performance options should differ where possible.

---

# 47. Recommended Memory Documentation

README should tell friends recommended RAM allocation

But measure before locking value.

Do not use:

```text
allocate all available RAM
```

Provide tested range after full pack profiling.

---

# 48. README Friend Section

Create:

```text
README.md
```

with:

```text
How to install
Supported launchers
Required Java
Recommended RAM
How to update
How to join server
Known issues
Where to report bugs
```

Keep user-facing instructions short.

---

# 49. Bug Report Template

Create:

```text
.github/ISSUE_TEMPLATE/
```

or equivalent

Ask for:

```text
Pack version
Launcher
Java version
RAM
Singleplayer/server
Steps to reproduce
latest.log
Crash report
```

Never ask friends to paste entire mod folder manually.

---

# 50. Release Artifact Naming

Use consistent names:

```text
industrial-civilization-survival-0.4.0.mrpack

industrial-civilization-survival-0.4.0-curseforge.zip

industrial-civilization-survival-server-0.4.0.zip
```

Avoid:

```text
final.zip
final2.zip
final-real.zip
pack-new.zip
```

---

# 51. Build Reproducibility

A release must be buildable again from:

```text
Git tag
```

If tag:

```text
v0.4.0
```

cannot reproduce distributed pack:

release process is incomplete.

---

# 52. Secrets

Never commit:

```text
server passwords
API keys
tokens
private addresses if sensitive
```

Use:

```text
.env
environment variables
server deployment secrets
```

where appropriate

Add secret patterns to `.gitignore`

---

# 53. Server-Specific Data

Do not accidentally distribute:

```text
world/
logs/
playerdata/
whitelist with unnecessary private info
server backups
```

inside public client pack.

---

# 54. Custom Assets Ownership

Pack-authored assets should be organized separately

Example:

```text
resourcepacks/
└── industrial-civilization-resources/
```

Document origin/license for any third-party asset

Do not copy textures from mods unless permission allows it.

---

# 55. CI — Optional but Recommended

After local workflow is stable, add CI for:

```text
metadata validation
packwiz validation
script linting
artifact build
checksum generation
```

Do not automate release publication before local build is deterministic.

---

# 56. Suggested Repository Structure

```text
industrial-civilization-survival/
│
├── .github/
│   └── workflows/
│
├── mods/
├── config/
├── defaultconfigs/
├── kubejs/
├── datapacks/
├── ftbquests/
├── resourcepacks/
│
├── docs/
│   ├── compatibility-matrix.md
│   ├── distribution-licenses.md
│   ├── progression.md
│   ├── testing.md
│   └── release-process.md
│
├── scripts/
│   ├── build/
│   ├── validate/
│   └── release/
│
├── dist/
│
├── pack.toml
├── index.toml
├── README.md
├── CHANGELOG.md
└── CLAUDE.md
```

`dist/` may be ignored in Git if artifacts are attached to releases instead.

---

# 57. Initial Implementation Phases

## Phase D0 — Bootstrap

Set up:

```text
Git
packwiz
pack metadata
directory structure
```

---

## Phase D1 — Import Current Modpack

Represent all currently approved mods through pack management

Pin versions

Resolve dependencies

---

## Phase D2 — Import Custom Layer

Add:

```text
configs
KubeJS
resource packs
quests
datapacks
```

Verify source control coverage

---

## Phase D3 — Validation Scripts

Create validation for:

```text
missing files
duplicate mods
pack metadata
client/server classification
```

---

## Phase D4 — Friend Build

Produce first importable closed-beta artifact

Test on fresh machine/instance

---

## Phase D5 — Server Build

Generate server pack

Test dedicated server

---

## Phase D6 — Update Test

Install old version

then update to new version

Verify:

```text
world preserved
options preserved where appropriate
pack files updated
server join succeeds
```

---

## Phase D7 — Public Distribution Preparation

Only after stable:

```text
license audit
project metadata
screenshots
description
release notes
platform packaging
```

---

# 58. Closed Beta Definition of Done

Distribution system is ready for friends when:

- A clean client can install from one package/import process.
- No manual mod downloads are required.
- Correct configs are included.
- Correct KubeJS scripts are included.
- Correct resource pack is included/enabled where possible.
- FTB Quests are included.
- Client can join dedicated server.
- Pack versions can be identified easily.
- Updating does not require replacing individual mods manually.
- Existing saves survive supported updates.
- Server backup procedure is documented.
- Exact mod versions are pinned.
- Build can be reproduced from Git.

---

# 59. Public Release Definition of Done

Public release additionally requires:

- Redistribution/license review complete.
- Public README complete.
- Changelog complete.
- Clean install tested.
- Server pack tested.
- Existing-world compatibility documented.
- Known issues documented.
- No fatal KubeJS/config errors.
- No development-only files included.
- No secrets included.
- Release artifacts use deterministic names.
- Release tag corresponds to artifact.
- Checksums generated where appropriate.

---

# 60. Claude Code Hard Rules

## DO

1. Use Git as source of truth.
2. Use packwiz for pack dependency/version management.
3. Pin exact versions.
4. Keep custom configuration in source control.
5. Build client and server distributions deliberately.
6. Test on a clean instance.
7. Backup worlds before upgrades.
8. Document world compatibility for every release.
9. Keep release artifacts reproducible.
10. Prefer existing launcher/update ecosystems over custom launcher development.
11. Audit mod redistribution rules before public release.
12. Keep server/client version synchronized.

## DO NOT

1. Do not distribute only the `mods/` folder.
2. Do not ask friends to configure the pack manually.
3. Do not use `latest` versions automatically.
4. Do not update production server without backup.
5. Do not ship untested mod updates.
6. Do not let developer launcher state become undocumented source of truth.
7. Do not distribute secrets or server player data.
8. Do not manually hotfix Discord copies without merging the change into source.
9. Do not overwrite user preferences unnecessarily.
10. Do not publish a public pack before licensing/redistribution review.

---

# 61. Final Distribution Architecture

```text
                 Git Repository
                       │
                       ▼
                    packwiz
                       │
               ┌───────┴────────┐
               │                │
               ▼                ▼
          Client Build      Server Build
               │                │
      ┌────────┼────────┐       │
      │        │        │       │
      ▼        ▼        ▼       ▼
CurseForge  Modrinth   Prism  Dedicated
 Profile    .mrpack   Update   Server
      │        │        │       │
      └────────┴────┬───┘       │
                   ▼            │
                Players ────────┘
```

---

# 62. Final Feature Definition

> **Industrial Civilization Survival must be distributed as a reproducible, versioned modpack where mods, configs, KubeJS integration, datapacks, quests and custom resources are treated as one product. Friends should be able to install or update the complete experience through a launcher/import workflow without manually recreating the developer's environment.**

Target player experience:

```text
Import Pack
↓
Launch
↓
Play
```

Target developer experience:

```text
Change
↓
Commit
↓
Validate
↓
Build
↓
Test
↓
Release
```

This workflow ensures that every player receives the same Industrial Civilization Survival experience.
