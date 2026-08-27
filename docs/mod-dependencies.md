<!-- GENERATED FILE - do not edit by hand.
     Run: python scripts/build/generate-mod-dependencies.py
     Every line is read out of that mod's own META-INF/mods.toml. -->
<!-- mod-count: 114 -->
<!-- dependency-edges: 293 -->

# Mod requirements · มอดแต่ละตัวต้องการอะไร

**114 mods** and **293 declared dependencies** between them. Every line was read out of that
mod's own `META-INF/mods.toml` - the same file Forge reads when it decides whether to boot.

**114 มอด** และ **293 dependency** ที่ประกาศไว้ระหว่างกัน ทุกบรรทัดอ่านมาจาก `META-INF/mods.toml`
ในตัว jar เอง ซึ่งเป็นไฟล์เดียวกับที่ Forge อ่านตอนตัดสินใจว่าจะ boot ให้หรือไม่

## What the checkbox means · เครื่องหมายถูกแปลว่าอะไร

`[x]` - the requirement is satisfied by something this pack ships.  
`[ ]` - it is not.

**A ticked box does not promise the mod reaches a player.** `side` decides that, and the gap is
real - see *Never reaches a client install* below.

`[x]` คือแพ็คนี้มีของที่มันต้องการ · `[ ]` คือไม่มี

**ติดถูกไม่ได้แปลว่ามอดจะไปถึงเครื่องผู้เล่น** เรื่องนั้น `side` เป็นตัวตัดสิน และช่องว่างตรงนี้มีจริง
ดูหัวข้อ *Never reaches a client install* ด้านล่าง

## Summary · สรุป

| | Count |
|---|---:|
| Mods in the pack | 114 |
| Declared dependencies | 293 |
| **Mandatory and unsatisfied** | **0** |
| Satisfied but outside the declared version range | 0 |
| Version unresolvable from the jar alone | 0 |
| Optional integrations this pack does not have | 30 |
| Libraries bundled at conflicting versions | 1 |
| Bundled libraries where one choice would leave a mod short | 1 |

## Mandatory requirements this pack does not satisfy

**None.** Every mandatory dependency of every mod resolves to something in the pack.

**ไม่มี** dependency ที่บังคับของทุกมอด หาเจอในแพ็คครบทุกตัว

## Never reaches a client install

packwiz omits a `side = "server"` mod from every client artifact, and singleplayer runs an
*integrated* server inside the client - so a mod marked this way is absent from the exact place
a solo or LAN-hosting player needs it.

packwiz ตัดมอดที่ `side = "server"` ออกจาก artifact ฝั่ง client ทุกแบบ และ singleplayer รัน
integrated server อยู่ในตัว client เอง มอดที่ mark แบบนี้จึงหายไปจากที่ที่คนเล่นคนเดียวหรือคนเปิด LAN ต้องใช้พอดี

- [ ] **ServerCore** (`servercore`) - `side = "server"`

`side = "client"` is the harmless direction: 20 mods, none of which a dedicated server needs.

## Libraries bundled by more than one mod, at different versions

Forge loads exactly one copy of a jar-in-jar library for the whole pack. Two mods bundling
different versions is therefore one library and one loser, and the loser is silent - nothing
in the log says a mod is running against a version older than the one it asked for.

Forge โหลด library แบบ jar-in-jar แค่ชุดเดียวต่อทั้งแพ็ค ถ้าสองมอดฝังคนละเวอร์ชันมา ผลคือได้
library ชุดเดียวกับผู้แพ้หนึ่งราย และผู้แพ้จะเงียบ ไม่มีบรรทัดไหนใน log บอกว่ามอดกำลังรันกับ
เวอร์ชันที่เก่ากว่าที่มันขอไว้

**Which copy Forge keeps is not derivable from these files** and is not guessed here - read
it out of a boot log. What *is* derivable is which choice would leave which mod short, so
that is what is listed.

**ตัวไหนที่ Forge เก็บไว้ อ่านจากไฟล์พวกนี้ไม่ได้** และจะไม่เดาในนี้ ให้ไปอ่านจาก boot log
สิ่งที่อ่านออกได้คือ ถ้าเลือกเวอร์ชันไหน มอดตัวไหนจะขาด — เลยเขียนเฉพาะส่วนนั้น

**`midnightlib`** - 2 versions bundled: `1.4.2-forge`, `1.9.2+1.20.1-forge`

- [x] **countereds-terrain-slabs** bundles `1.9.2+1.20.1-forge`, declares `[1.9.2+1.20.1-forge,)`
- [x] **naturalist** bundles `1.4.2-forge`, declares `[1.4.2-forge,)`

- [ ] if Forge keeps `1.4.2-forge`, it is below the range declared by **countereds-terrain-slabs**

A mod running against a library older than the range it declares produces **no boot
error** - Forge had to pick one copy and does not fail on the choice. It surfaces only as
a `NoSuchMethodError` at the moment the newer API is actually called, which may be never.

## Every mod, and what it asks for

### [EMF] Entity Model Features

`entity_model_features` 3.2.4 · loader `javafml` · `entity_model_features-3.2.4-1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `entity_texture_features` `[7,)` - entitytexturefeatures `7.1`
- [x] `forge` `[33,)` - Forge itself
- [x] `minecraft` `[1,)` - Minecraft itself

### [ETF] Entity Texture Features

`entity_texture_features` 7.1 · loader `javafml` · `entity_texture_features_1.20.1-forge-7.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[33,)` - Forge itself
- [x] `minecraft` `[1,)` - Minecraft itself

### [TACZ] Durability

`gundb` 2.1.0 · loader `javafml` · `gundb-2.1.0-all.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

### [TaCZ] Timeless and Classics Zero Guns

`tacz` 1.1.8-hotfix · loader `javafml` · `tacz-1.20.1-1.1.8-hotfix.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.20.2)` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `shouldersurfing`

### AmbientSounds

`ambientsounds` 6.3.8 · loader `javafml` · `AmbientSounds_FORGE_v6.3.8_mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `creativecore` `[2.12.36,)` - creativecore `2.12.39`
- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Architectury API

`architectury` 9.2.14 · loader `javafml` · `architectury-9.2.14-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,)` - Minecraft itself

### Atlas Lib

`atlaslib` 1.1.12 · loader `javafml` · `Atlas Lib-1.20.1-1.1.12.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### Attract to Sound ([NEO]Forge/Fabric): Sound & Stealth.

`soundattract` 6.3.8 · loader `javafml` · `forge_soundattract_1.20.1-6.3.8.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.4.0,]` - Forge itself
- [x] `minecraft` `[1.20.1,1.20.2)` - Minecraft itself

**Optional, and present**

- [x] `enhancedai` - enhanced-ai `3.3.7.3`
- [x] `voicechat` - simple-voice-chat `1.20.1-2.6.22`

**Optional, and absent** - the mod runs without these

- [ ] `csgrenades`
- [ ] `hotbath`
- [ ] `origins`
- [ ] `plasmovoice`
- [ ] `pointblank`
- [ ] `quantified`
- [ ] `relentlessundead`
- [ ] `smartbrainlib`
- [ ] `superbwarfare`
- [ ] `teammanagement`

### Balm

`balm` 7.3.42 · loader `javafml` · `balm-forge-1.20.1-7.3.42.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46.0.0,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Better Animations Collection

`betteranimationscollection` 8.0.1 · loader `javafml` · `BetterAnimationsCollection-v8.0.1-1.20.1-Forge.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47.0.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `puzzleslib` `[8.0.0,)` - puzzles-lib `8.1.33`

### Better Biome Blend

`betterbiomeblend` 1.4.0 · loader `javafml` · `betterbiomeblend-forge-1.20.1-1.4.0.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[41,)` - Forge itself
- [x] `minecraft` `[1.19.2,)` - Minecraft itself

### Biomes O' Plenty

`biomesoplenty` 19.0.0.96 · loader `javafml` · `BiomesOPlenty-forge-1.20.1-19.0.0.96.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.0,)` - Forge itself
- [x] `glitchcore` `[0.0.1.0,)` - glitchcore `0.0.1.1`
- [x] `terrablender` `[3.0.1.7,)` - terrablender `3.0.1.10`

### BlockUI

`blockui` 1.20.1-1.0.194-snapshot · loader `javafml` · `blockui-1.20.1-1.0.194-snapshot.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.0,)` - Forge itself
- [x] `minecraft` `[1.20.1, 1.21)` - Minecraft itself

### Born in Chaos

`born_in_chaos_v1` 1.7.5 · loader `javafml` · `born_in_chaos_[Forge]1.20.1_1.7.5.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `geckolib` - geckolib `4.8.4`
- [x] `jei` - jei `15.49.0.191`

### Brimm Armors | Tactical Military Armors

`brimm` 2.0.3 · loader `javafml` · `brimm-2.0.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

### built in this repo

`militarybackpack_refmap_shim` 1.0.1-pre-release-hotfix · loader `lowcodefml` · `militarybackpack-refmap-shim-1.0.1-pre-release-hotfix.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### CAPS_Awim - TACTICAL_GEAR

`caps_awim_tactical_gear_rework` 3.0.0408.26 · loader `javafml` · `caps_awim_tactical_gear_rework-3.0.0408.26_en-forge-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `geckolib` - geckolib `4.8.4`
- [x] `jei` - jei `15.49.0.191`
- [x] `playeranimator` - playeranimator `1.0.2-rc1+1.20`

**Optional, and absent** - the mod runs without these

- [ ] `curios_api`

### Carry On

`carryon` 2.1.2.7 · loader `javafml` · `carryon-forge-1.20.1-2.1.2.7.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,47.1.3],[47.1.43,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Chunky

`chunky` 1.3.146 · loader `javafml` · `Chunky-1.3.146.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Client Dynamic Light

`clientdynamiclight` 3.2.1 · loader `javafml` · `clientdynamiclight-1.20.1-3.2.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

### Cloth Config API

`cloth_config` 11.1.136 · loader `javafml` · `cloth-config-11.1.136-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[45,)` - Forge itself

### ClothingCraft

`clothingcraft` 1.0.0 · loader `javafml` · `clothingcraft-1.0.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

### Clumps

`clumps` 12.0.0.4 · loader `javafml` · `Clumps-forge-1.20.1-12.0.0.4.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### Corpse

`corpse` 1.20.1-1.0.23 · loader `javafml` · `corpse-forge-1.20.1-1.0.23.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.0.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `jade` - jade `11.13.3+forge`
- [x] `jei` - jei `15.49.0.191`

### Countered's Terrain Slabs

`terrain_slabs` 4.0.2-beta · loader `javafml` · `terrain_slabs-forge-4.0.2-beta.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.2.14,)` - architectury-api `9.2.14`
- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Crafting Tweaks

`craftingtweaks` 18.2.9 · loader `javafml` · `craftingtweaks-forge-1.20.1-18.2.9.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `balm` `[7.3.33,)` - balm `7.3.42`
- [x] `forge` `[46.0.0,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Create

`create` 6.0.8 · loader `javafml` · `create-1.20.1-6.0.8.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `flywheel` `[1.0.0,2.0)` - create (bundled inside it) `1.0.5`
- [x] `forge` `[47.1.3,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `ponder` `[0.8,)` - create (bundled inside it) `1.0.91`

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

### Create Big Cannons

`createbigcannons` 5.11.4 · loader `javafml` · `createbigcannons-5.11.4-mc.1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `create` `[6.0.7,6.1.0)` - create `6.0.8`
- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `ritchiesprojectilelib` `[2.1.1,)` - rpl `2.1.1`

**Optional, and present**

- [x] `curios` - curios `5.14.1+1.20.1`

**Optional, and absent** - the mod runs without these

- [ ] `cbc_at`
- [ ] `copycats`
- [ ] `framedblocks`

### Create Crafts & Additions

`createaddition` 1.20.1-1.3.3 · loader `javafml` · `createaddition-1.20.1-1.3.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `create` `[6.0.3,)` - create `6.0.8`
- [x] `forge` `[40,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

**Optional, and absent** - the mod runs without these

- [ ] `computercraft`

### Create: Diesel Generators

`createdieselgenerators` 1.20.1-1.3.12 · loader `javafml` · `createdieselgenerators-1.20.1-1.3.12.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `create` `[6.0.7,6.1.0)` - create `6.0.8`
- [x] `forge` `[40.2.4,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Create: Steam 'n' Rails

`railways` 1.7.2+forge-mc1.20.1 · loader `javafml` · `Steam_Rails-1.7.2+forge-mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `create` `[6.0.7,)` - create `6.0.8`
- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `voicechat` - simple-voice-chat `1.20.1-2.6.22`

**Optional, and absent** - the mod runs without these

- [ ] `hexcasting`

### Create: Timeless and Classics Zero [TaCZ]

`tacz_c` 1.0.2 · loader `javafml` · `tacz_c-1.0.2-forge-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

### CreativeCore

`creativecore` 2.12.39 · loader `javafml` · `CreativeCore_FORGE_v2.12.39_mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Critters and Companions

`crittersandcompanions` 2.7.1 · loader `javafml` · `crittersandcompanions-forge-1.20.1-2.7.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.2.14,)` - architectury-api `9.2.14`
- [x] `forge` `[47,)` - Forge itself
- [x] `geckolib` `[4.2.3,)` - geckolib `4.8.4`
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `yet_another_config_lib_v3` `[3.6.1+1.20.1,)` - yacl `3.6.6+1.20.1-forge`

### Cupboard

`cupboard` 1.20.1-4.0 · loader `javafml` · `cupboard-1.20.1-4.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[30,)` - Forge itself
- [x] `minecraft` `[1.19,1.30)` - Minecraft itself

### Curios API

`curios` 5.14.1+1.20.1 · loader `javafml` · `curios-forge-5.14.1+1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Domum Ornamentum

`domum_ornamentum` 1.20.1-1.0.303-snapshot · loader `javafml` · `domum_ornamentum-1.20.1-1.0.303-snapshot-universal.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### Eating Animation [Neo/Forge]

`eatinganimation` 5.1.0 · loader `gml` · `eatinganimation-1.20.1-5.1.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `gml` `[4.0.0,)` - gml (bundled inside it) `4.0.11`
- [x] `minecraft` `[1.20,)` - Minecraft itself

### Ecologics

`ecologics` 2.2.7 · loader `javafml` · `ecologics-forge-1.20.1-2.2.7.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.3,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.20.3)` - Minecraft itself

### Embeddium

`embeddium` 0.3.31+mc1.20.1, `rubidium` 0.7.1 · loader `javafml` · `embeddium-0.3.31+mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Optional, and absent** - the mod runs without these

- [ ] `oculus`
- [ ] `textrues_embeddium_options`

### Enhanced AI

`enhancedai` 3.3.7.3 · loader `javafml` · `enhancedai-3.3.7.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `insanelib` `[1.21.19,)` - insanelib `1.23.4.6`
- [x] `minecraft` `1.20.1` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `mobspropertiesrandomness`

### Entity Culling

`entityculling` 1.10.5 · loader `javafml` · `entityculling-forge-1.10.5-mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `minecraft` `1.20.1` - Minecraft itself

### Fancy World Animations

`fwa` 1.2.31 · loader `javafml` · `fwa+1.20.1-forge-1.2.31.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.20.2)` - Minecraft itself

**Optional, and present**

- [x] `embeddium` - embeddium `0.3.31+mc1.20.1`

### Farmer's Delight

`farmersdelight` 1.20.1-1.3.3 · loader `javafml` · `FarmersDelight-1.20.1-1.3.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.0,)` - Forge itself
- [x] `minecraft` `[1.20,1.20.1]` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `crafttweaker`

### FastSuite

`fastsuite` 5.1.2 · loader `javafml` · `FastSuite-1.20.1-5.1.2.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1,)` - Minecraft itself
- [x] `placebo` `[8.2.0,)` - placebo `8.6.3`

### FerriteCore

`ferritecore` 6.0.1 · loader `javafml` · `ferritecore-6.0.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46.0.1,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Flashier Flashlights

`flashlightmod` 1.2.0 · loader `javafml` · `Flashier Flashlights 1.2.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

### Framework

`framework` 0.8.0 · loader `javafml` · `framework-forge-1.20.1-0.8.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.47,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### FTB Library (NeoForge)

`ftblibrary` 2001.2.13 · loader `javafml` · `ftb-library-forge-2001.2.13.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.0.8,)` - architectury-api `9.2.14`
- [x] `forge` `[47.3,)` - Forge itself
- [x] `minecraft` `[1.20,)` - Minecraft itself

**Optional, and present**

- [x] `ftbquests` - ftb-quests-forge `2001.4.22`

### FTB Quests (NeoForge)

`ftbquests` 2001.4.22 · loader `javafml` · `ftb-quests-forge-2001.4.22.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.0.8,)` - architectury-api `9.2.14`
- [x] `ftblibrary` `[2001.2.1,)` - ftb-library-forge `2001.2.13`
- [x] `ftbteams` `[2001.1.4,)` - ftb-teams-forge `2001.3.2`
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `itemfilters`

### FTB Teams (NeoForge)

`ftbteams` 2001.3.2 · loader `javafml` · `ftb-teams-forge-2001.3.2.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.1.12,)` - architectury-api `9.2.14`
- [x] `forge` `[47.1.47,)` - Forge itself
- [x] `ftblibrary` `[2001.2.0,)` - ftb-library-forge `2001.2.13`
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Fusion (Connected Textures)

`fusion` 1.3.14+a · loader `javafml` · `fusion-1.3.14a-forge-mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.20.2)` - Minecraft itself

### Fzzy Config

`fzzy_config` 0.7.6+1.20.1+forge · loader `javafml` · `fzzy_config-0.7.6+1.20.1+forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `kotlinforforge` `[4.11.0,4.99.0]` - kotlin-for-forge (bundled inside it) `4.12.0`
- [x] `minecraft` `[1.20.1]` - Minecraft itself

### GeckoLib

`geckolib` 4.8.4 · loader `javafml` · `geckolib-forge-1.20.1-4.8.4.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `geckoanimfix`

### GlitchCore

`glitchcore` 0.0.1.1 · loader `javafml` · `GlitchCore-forge-1.20.1-0.0.1.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.0,)` - Forge itself

### Grassier Grass

`grassiergrass` 1.4.5 · loader `javafml` · `grassiergrass-forge-1.4.5+mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `embeddium` - embeddium `0.3.31+mc1.20.1`

### Grillo's Clothes

`clothes_mod` 1.4.10-1.20.1 · loader `javafml` · `clothes_mod-1.4.10-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.20.2)` - Minecraft itself

### GroovyModLoader (GML)

- · loader `-` · `gml-4.0.11-all.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

> FMLModType=LANGPROVIDER - a library, registers no modId of its own

Declares no dependencies beyond Forge and Minecraft.

### IceAndFire Community Edition

`iceandfire` 1.2.7 · loader `javafml` · `IceAndFireCE-1.2.7-1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `jupiter` `[2,)` - jupiter `2.3.7`
- [x] `minecraft` `[1.20.1,)` - Minecraft itself
- [x] `uranus` `[2,)` - uranus `2.2.6-bugfix.2`

### ImmediatelyFast

`immediatelyfast` 1.2.7+1.20.2 · loader `javafml` · `ImmediatelyFast-1.2.7+1.20.2.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.20.2]` - Minecraft itself

### Immersive Engineering

`immersiveengineering` 1.20.1-10.2.0-183 · loader `javafml` · `ImmersiveEngineering-1.20.1-10.2.0-183.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

### Immersive Posts

`immersiveposts` 4.3.0-15 · loader `javafml` · `ImmersivePosts-1.20.1-4.3.0-15.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.0,)` - Forge itself
- [x] `immersiveengineering` `[1.20.1-10.1.0-171,)` - immersive-engineering `1.20.1-10.2.0-183`
- [x] `minecraft` `[1.20.1]` - Minecraft itself

### Improved Mobs

`improvedmobs` 1.20.1-1.13.7 · loader `javafml` · `improvedmobs-1.20.1-1.13.7-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.3,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself
- [x] `tenshilib` `[1.20.1-1.7.2,)` - tenshilib `1.20.1-1.7.6`

### In Control!

`incontrol` 1.20-9.4.7 · loader `javafml` · `incontrol-1.20-9.4.7.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[43.1.30,)` - Forge itself

**Optional, and absent** - the mod runs without these

- [ ] `lostcities`

### InsaneLib

`insanelib` 1.23.4.6 · loader `javafml` · `insanelib-1.23.4.6.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.33,)` - Forge itself
- [x] `minecraft` `1.20.1` - Minecraft itself

### ItemPhysic

`itemphysic` 1.8.13 · loader `javafml` · `ItemPhysic_FORGE_v1.8.13_mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `creativecore` `2.12.14` - creativecore `2.12.39`
- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Jade Addons (Neo/Forge)

`jadeaddons` 5.5.1+forge · loader `javafml` · `JadeAddons-1.20.1-Forge-5.5.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `jade` `[11.13.1, )` - jade `11.13.3+forge`

**Optional, and present**

- [x] `create` - create `6.0.8`

### Jade 🔍

`jade` 11.13.3+forge · loader `javafml` · `Jade-1.20.1-Forge-11.13.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46, )` - Forge itself

### Jupiter

`jupiter` 2.3.7 · loader `javafml` · `jupiter-2.3.7-1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[1,)` - Forge itself
- [x] `minecraft` `[1.20],[1.20.1]` - Minecraft itself

### Just Enough Items (JEI)

`jei` 15.49.0.191 · loader `javafml` · `jei-1.20.1-forge-15.49.0.191.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.0,)` - Forge itself
- [x] `minecraft` `[1.20.1, 1.20.2)` - Minecraft itself

### Kotlin for Forge

- · loader `-` · `kotlinforforge-4.12.0-all.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

> FMLModType=LIBRARY - a library, registers no modId of its own

Declares no dependencies beyond Forge and Minecraft.

### KubeJS

`kubejs` 2001.6.5-build.26 · loader `javafml` · `kubejs-forge-2001.6.5-build.26.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.1.12,)` - architectury-api `9.2.14`
- [x] `forge` `[47.1.0,)` - Forge itself
- [x] `rhino` `[2001.2.2-build.1,)` - rhino `2001.2.3-build.10`

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

**Optional, and absent** - the mod runs without these

- [ ] `roughlyenoughitems`

### Lexiconfig

`lexiconfig` 1.4.21-epic · loader `javafml` · `lexiconfig-forge-1.4.21-epic.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[1,)` - Forge itself
- [x] `minecraft` `[1.18,1.20.6]` - Minecraft itself

### Macaw's Lights and Lamps

`mcwlights` 1.1.5 · loader `javafml` · `mcw-lights-1.1.5-mc1.20.1forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### MineColonies

`minecolonies` 1.20.1-1.1.1278-snapshot · loader `javafml` · `minecolonies-1.20.1-1.1.1278-snapshot.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `blockui` `[1.20.1-1.0.190-snapshot, )` - blockui `1.20.1-1.0.194-snapshot`
- [x] `domum_ornamentum` `[1.20.1-1.0.288-snapshot, )` - domum-ornamentum `1.20.1-1.0.303-snapshot`
- [x] `forge` `[46.0.1,)` - Forge itself
- [x] `minecraft` `[1.20.1, 1.21)` - Minecraft itself
- [x] `structurize` `[1.20.1-1.0.818, )` - structurize `1.20.1-1.0.818`

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

**Optional, and absent** - the mod runs without these

- [ ] `dynamictrees`
- [ ] `journeymap`

### ModernFix

`modernfix` 5.27.77+mc1.20.1 · loader `javafml` · `modernfix-forge-5.27.77+mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46.0.1,)` - Forge itself
- [x] `minecraft` `[1.20, 1.21)` - Minecraft itself

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

### Mouse Tweaks

`mousetweaks` 2.25.1 · loader `javafml` · `MouseTweaks-forge-mc1.20.1-2.25.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

Declares no dependencies beyond Forge and Minecraft.

### MrCrayfish's Furniture Mod: Refurbished

`refurbished_furniture` 1.0.20 · loader `javafml` · `refurbished_furniture-forge-1.20.1-1.0.20.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.47,)` - Forge itself
- [x] `framework` `[0.7.15,)` - framework `0.8.0`
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Multi-Piston

`multipiston` 1.20-0.0.47-snapshot · loader `javafml` · `multipiston-1.20-0.0.47-snapshot.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `blockui` `[0.0.59-ALPHA,)` - blockui `1.20.1-1.0.194-snapshot`
- [x] `forge` `[41.0.94,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself
- [x] `structurize` `[1.19-1.0.420-ALPHA, )` - structurize `1.20.1-1.0.818`

### Naturalist

`naturalist` 5.0pre4 · loader `javafml` · `naturalist-5.0pre4+forge-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[41.0.98,)` - Forge itself
- [x] `geckolib` `[4.0.0,)` - geckolib `4.8.4`
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Not Enough Animations

`notenoughanimations` 1.12.4 · loader `javafml` · `notenoughanimations-forge-1.12.4-mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `minecraft` `1.20.1` - Minecraft itself

### Particle Rain

`particlerain` 4.0.0-beta.11 · loader `javafml` · `particlerain-4.0.0-beta.11+1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[43,50)` - Forge itself
- [x] `minecraft` `[1.20,1.20.1]` - Minecraft itself

### Placebo

`placebo` 8.6.3 · loader `javafml` · `Placebo-1.20.1-8.6.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Player Microchip (Tracker)

`player_tracking_chip` 1.0.2 · loader `javafml` · `player_tracking_chip-1.0.2-forge-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

### playerAnimator

`playeranimator` 1.0.2-rc1+1.20 · loader `javafml` · `player-animation-lib-forge-1.0.2-rc1+1.20.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20,)` - Minecraft itself

### PlayerRevive

`playerrevive` 2.0.31 · loader `javafml` · `PlayerRevive_FORGE_v2.0.31_mc1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `creativecore` `2.11.20` - creativecore `2.12.39`
- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Polymorph

`polymorph` 0.49.10+1.20.1 · loader `javafml` · `polymorph-forge-0.49.10+1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[46,)` - Forge itself
- [x] `minecraft` `[1.20,)` - Minecraft itself

### Polytone

`polytone` 1.20-3.5.26 · loader `javafml` · `polytone-1.20-3.5.26.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47.1,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Puzzles Lib

`puzzleslib` 8.1.33 · loader `javafml` · `PuzzlesLib-v8.1.33-1.20.1-Forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `puzzlesaccessapi` `*` - puzzles-lib (bundled inside it) `20.1.1`

### Rhino

`rhino` 2001.2.3-build.10 · loader `javafml` · `rhino-forge-2001.2.3-build.10.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

### Ritchie's Projectile Library

`ritchiesprojectilelib` 2.1.1 · loader `javafml` · `ritchiesprojectilelib-2.1.1+mc.1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `1.20.1` - Minecraft itself

### Security Craft

`securitycraft` 1.10.2.1 · loader `javafml` · `[1.20.1] SecurityCraft v1.10.2.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.30,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### Serene Seasons

`sereneseasons` 9.1.0.3 · loader `javafml` · `SereneSeasons-forge-1.20.1-9.1.0.3.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.3.0,)` - Forge itself
- [x] `glitchcore` `[0.0.1.1,)` - glitchcore `0.0.1.1`

### ServerCore

`servercore` 1.5.2+1.20.1 · loader `javafml` · `servercore-forge-1.5.2+1.20.1.jar`

- [x] in the pack
- [ ] **on a client install** - `side = "server"` keeps it off every client artifact

**Requires**

- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Simple Voice Chat

`voicechat` 1.20.1-2.6.22, `voicechat_api` 2.6.20 · loader `javafml` · `voicechat-forge-1.20.1-2.6.22.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.0.1,)` - Forge itself
- [x] `minecraft` `[1.20,1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `cloth_config` - cloth-config `11.1.136`

### Simple Voice Radio

`simpleradio` 1.20.1-4.5.7.9 · loader `javafml` · `simpleradio-forge-1.20.1-4.5.7.9.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `lexiconfig` `[1.4,1.5)` - lexiconfig `1.4.21-epic`
- [x] `minecraft` `[1.20,1.20.1]` - Minecraft itself
- [x] `voicechat` `[1.20.1-2.6.0,)` - simple-voice-chat `1.20.1-2.6.22`

### Smooth Movement

`smoothmovement` 1.20.1-2.6 · loader `javafml` · `smoothmovement-1.20.1-2.6.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[30,)` - Forge itself
- [x] `minecraft` `[1.20,1.21)` - Minecraft itself

### SmoothPlayerAnimations

`smoothplayeranimations` 1.0.3+1.20.1 · loader `javafml` · `SmoothPlayerAnimations_Forge_1.20.1_1.0.3.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `cloth_config` `[11,)` - cloth-config `11.1.136`
- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself
- [x] `playeranimator` `[1.0,)` - playeranimator `1.0.2-rc1+1.20`

**Optional, and absent** - the mod runs without these

- [ ] `bettercombat`

### Soft Imprints

`softimprints` 2.8.0 · loader `javafml` · `softimprints-forge-1.20.1-2.8.0.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1, 1.21)` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `eclipticseasons`

### Sophisticated Backpacks

`sophisticatedbackpacks` 3.24.67.2109 · loader `javafml` · `sophisticatedbackpacks-1.20.1-3.24.67.2109.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1,)` - Forge itself
- [x] `sophisticatedcore` `[1.3.80.+,)` - sophisticated-core `1.3.84.2308`

### Sophisticated Core

`sophisticatedcore` 1.3.84.2308 · loader `javafml` · `sophisticatedcore-1.20.1-1.3.84.2308.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1,)` - Forge itself

**Optional, and present**

- [x] `jei` - jei `15.49.0.191`

### Sophisticated Tactical Backpacks

`militarybackpack` 1.0.0 · loader `javafml` · `militarybackpack-1.0.0-all.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself

### Sound Physics Remastered

`sound_physics_remastered` 1.20.1-1.5.1 · loader `javafml` · `sound-physics-remastered-forge-1.20.1-1.5.1.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47.0.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and present**

- [x] `cloth_config` - cloth-config `11.1.136`
- [x] `voicechat` - simple-voice-chat `1.20.1-2.6.22`

### Structurize

`structurize` 1.20.1-1.0.818 · loader `javafml` · `structurize-1.20.1-1.0.818.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `blockui` `[1.20.1-0.0.98-ALPHA,)` - blockui `1.20.1-1.0.194-snapshot`
- [x] `domum_ornamentum` `[1.20-1.0.93-ALPHA,)` - domum-ornamentum `1.20.1-1.0.303-snapshot`
- [x] `forge` `[47.1.0,)` - Forge itself
- [x] `minecraft` `[1.20.1, 1.20.2)` - Minecraft itself

### Subtle Effects

`subtle_effects` 1.14.3 · loader `javafml` · `SubtleEffects-forge-1.20.1-1.14.3.jar`

- [x] in the pack
- [x] on a client install
- [ ] on a dedicated server - `side = "client"`, and a server has no use for it

**Requires**

- [x] `forge` `[47.4.14,)` - Forge itself
- [x] `fzzy_config` `[0.7.3+1.20.1+forge,)` - fzzy-config `0.7.6+1.20.1+forge`
- [x] `minecraft` `[1.20.1, 1.20.2)` - Minecraft itself

### TaCZ Additions

`taczadditions` 1.3.0 · loader `javafml` · `taczadditions-1.20.1-1.3.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[6,)` - Forge itself
- [x] `minecraft` `[1.20,)` - Minecraft itself

### TaCZ x Guns Lights Addon [NEW] - Update 2.5.0

`tacz_x_guns_lights_addon` 2.5.0 · loader `javafml` · `tacz_x_guns_lights_addon-2.5.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,1.21)` - Minecraft itself
- [x] `tacz` `[1.1.0,)` - timeless-and-classics-zero `1.1.8-hotfix`

### TakKit

`takkit` 1.3.1 · loader `javafml` · `takkit-1.3.1-1.20.1.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `minecraft` `[1.20.1]` - Minecraft itself

**Optional, and absent** - the mod runs without these

- [ ] `curios_api`

### TenshiLib

`tenshilib` 1.20.1-1.7.6 · loader `javafml` · `tenshilib-1.20.1-1.7.6-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.3,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### TerraBlender

`terrablender` 3.0.1.10 · loader `javafml` · `TerraBlender-forge-1.20.1-3.0.1.10.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.1.0,)` - Forge itself

### The Hordes

`hordes` 1.6.3g · loader `javafml` · `The-Hordes-1.20.1-1.6.3g-all.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `atlaslib` `[1.1.12,)` - atlas-lib `1.1.12`

### TownTalk

`towntalk` 1.1.0 · loader `javafml` · `towntalk-1.20.1-1.1.0.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[43.1.0,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Uranus

`uranus` 2.2.6-bugfix.2 · loader `javafml` · `uranus-2.2.6-bugfix.2-1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `architectury` `[9.2.14,)` - architectury-api `9.2.14`
- [x] `forge` `[47,)` - Forge itself
- [x] `minecraft` `[1.20.1,)` - Minecraft itself

### Visual Workbench

`visualworkbench` 8.0.1 · loader `javafml` · `VisualWorkbench-v8.0.1-1.20.1-Forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

**Requires**

- [x] `forge` `[47.0.0,)` - Forge itself
- [x] `minecraft` `[1.20.1]` - Minecraft itself
- [x] `puzzleslib` `[8.0.0,)` - puzzles-lib `8.1.33`

### YetAnotherConfigLib (YACL)

`yet_another_config_lib_v3` 3.6.6+1.20.1-forge · loader `javafml` · `yet_another_config_lib_v3-3.6.6+1.20.1-forge.jar`

- [x] in the pack
- [x] on a client install
- [x] on a dedicated server

Declares no dependencies beyond Forge and Minecraft.

