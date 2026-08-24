# Compatibility Matrix

**This is a record of what has been observed, not of what should work.** A row is marked `PASS` in
**Tested** only after the pack has been launched with that exact version and the boot protocol
(§26) has run. Every Tested cell below is empty, because nothing has been launched yet.

- **Platform:** Minecraft `1.20.1` · Forge · Java 17
- **Create:** pinned to **`6.0.8`** — see *The Create pin* below
- **Swept:** 2026-08-25, against the Modrinth API. Dependency ranges were read out of
  `META-INF/mods.toml` **inside the downloaded jars**, which is what Forge enforces at load time.
- **Source column:** `MR` = Modrinth · `CF` = CurseForge only (no 1.20.1 Forge build on Modrinth)
- **Side column:** as **declared** by the project's own metadata. Declared is not verified — the
  Distribution Spec §11 rule is *"inspect exact mod requirement before you classify. Do not guess."*
  Treat these as a starting point for the packwiz side flags, not as the answer.

---

## The Create pin

Every CORE Create addon declares a required range on `create`. The intersection is what the pack
can target, and it admits exactly one version.

| Mod | Version swept | Declared `create` range |
|---|---|---|
| Create: Steam 'n' Rails | `1.7.2+forge-mc1.20.1` | `[6.0.7,)` |
| Create Big Cannons | `5.11.4` | `[6.0.7,6.1.0)` |
| Create Crafts & Additions | `1.20.1-1.3.3` | `[6.0.3,)` |
| Create: Diesel Generators | `1.20.1-1.3.12` | `[6.0.7,6.1.0)` |
| Create: New Age | `1.2.0+forge-mc1.20.1` | `[6.0.8,6.1.0)` |

**Intersection = `[6.0.8, 6.1.0)`.** Create's newest 1.20.1 build is `6.0.8`, so the range admits
one version and the pin is forced rather than chosen.

The 0.5.1.f fallback the handoff document allowed for is **not needed**. Do not reopen it without a
new reason recorded as an ADR — every addon above would have to be downgraded with it.

---

## Undocumented required dependencies

Found in the jars, absent from the design documents. All are `mandatory=true`; the pack does not
load without them. All four are **CurseForge-only**.

| Dependency | Required by | Range | Note |
|---|---|---|---|
| `flywheel` | Create | `[1.0.0,2.0)` | The Modrinth project `flywheel` is *Flywheel (Legacy)* with no 1.20.1 Forge build — not this |
| `ponder` | Create | `[0.8,)` | The Modrinth project `ponder` is *Ponder for KubeJS* — a different mod, do not substitute |
| `ritchiesprojectilelib` | Create Big Cannons | `[2.1.1,)` | |
| `esl` | Create: New Age | `[1.1.3]` | An exact pin, not a range — Season 2 only |

---

## Create / industry / logistics

| Mod | Version | Source | Side | Status | Required deps | Tested |
|---|---|---|---|---|---|---|
| Create | `mc1.20.1-6.0.8` | MR | COMMON | CORE | flywheel, ponder | |
| Create: Steam 'n' Rails | `1.7.2+forge-mc1.20.1` | MR | COMMON | CORE | create | |
| Create Big Cannons | `5.11.4` | MR | COMMON | CORE | create, ritchiesprojectilelib | |
| CBC: Firepower Components | `0.2.0` | MR | COMMON | CORE | create-big-cannons | |
| Create Crafts & Additions | `1.20.1-1.3.3` | MR | COMMON | CORE | create | |
| Create: Diesel Generators | `1.20.1-1.3.12` | MR | COMMON | CORE | create | |
| Create: New Age | `1.2.0+forge-mc1.20.1` | MR | COMMON | SEASON 2 | create, esl | |
| Create: Copycats+ | `3.0.8+mc.1.20.1-forge` | MR | COMMON | DEPENDENCY | create | optional CBC integration |
| FramedBlocks | `9.4.3` | MR | COMMON | DEPENDENCY | — | optional CBC integration |
| Flywheel | *see note* | CF | — | DEPENDENCY | — | |
| Ponder | *see note* | CF | — | DEPENDENCY | — | |
| Ritchie's Projectile Lib | *see note* | CF | — | DEPENDENCY | — | |
| Electric Sheep Library (`esl`) | *see note* | CF | — | DEPENDENCY | — | Season 2 only |

## Guns / tactical combat

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| TaCZ — Timeless and Classics Zero | `1.1.8-hotfix` | MR | COMMON | CORE | |
| TACZ: Durability | `2.1.0` | MR | COMMON | CORE | |
| TaCZ Additions | `1.3.0` | MR | COMMON | CORE | |
| Create: TaCZ | — | CF | — | CORE | |
| TaCZ x Guns Lights Addon | — | CF | — | CORE | not yet swept |
| TakKit | — | CF | — | CORE | |
| Brimm Armors | — | CF | — | CORE | |
| CAPS_Awim — Tactical Gear | — | CF | — | CORE | not yet swept |
| Sophisticated Backpacks | `1.20.1-3.24.67.2109` | MR | COMMON | CORE | |
| Sophisticated Tactical Backpacks | — | CF | — | EXPERIMENTAL | |
| ClothingCraft | `1.0.0` | MR | COMMON | CORE | |
| Grillo's Clothes | `1.4.10-1.20.1` | MR | COMMON | PROTOTYPE | |
| Curios API | `5.14.1+1.20.1` | MR | COMMON | DEPENDENCY | |

## Threat layer

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Attract to Sound | `6.3.8` | MR | COMMON | CORE | |
| Born in Chaos | `1.7.5` | MR | COMMON | CORE | |
| IceAndFire Community Edition | `1.2.7` | MR | COMMON | CORE | |
| The Hordes | `1.20.1-1.6.3g` | MR | COMMON | CORE | |
| Enhanced AI | `3.3.7.3` | MR | COMMON | CORE | |
| Improved Mobs | `1.20.1-1.13.7-forge` | MR | SERVER | CORE-LITE | |
| In Control! | `1.20-9.4.7` | MR | SERVER | CORE | |

## Civilization / progression

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| MineColonies | — | CF | — | CORE | no 1.20.1 Forge build on Modrinth |
| Farmer's Delight | `1.20.1-1.3.3` | MR | COMMON | CORE | |
| Serene Seasons | `9.1.0.3` | MR | COMMON | CORE | |
| FTB Quests | — | CF | — | CORE | |
| KubeJS | `2001.6.5-build.26+forge` | MR | COMMON | CORE | |

## City systems

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Immersive Engineering | — | CF | — | CORE | |
| Immersive Posts | `4.3.0-15` | MR | COMMON | CORE | |
| Macaw's Lights and Lamps | `1.1.5` | MR | COMMON | CORE | |
| SecurityCraft | — | CF | — | CORE | |
| CameraCraft / CCTV Camera | — | CF | — | CORE | Modrinth project exists, **no 1.20.1 Forge build** |
| MrCrayfish's Furniture: Refurbished | — | CF | — | CORE | |

## Immersion / QoL

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Sound Physics Remastered | `forge-1.20.1-1.5.1` | MR | CLIENT | CORE | |
| AmbientSounds | `6.3.8` | MR | CLIENT | CORE | |
| Simple Voice Chat | `forge-1.20.1-2.6.22` | MR | COMMON | CORE | |
| Simple Voice Radio | — | CF | — | CORE | Modrinth project exists, **no 1.20.1 Forge build** |
| PlayerRevive | `2.0.31` | MR | COMMON | CORE | |
| ItemPhysic | `1.8.13` | MR | COMMON | CORE | |
| Not Enough Animations | `1.12.4` | MR | CLIENT | CORE CLIENT | |
| Eating Animation | — | CF | — | CORE CLIENT | Modrinth project exists, **no 1.20.1 Forge build** |
| Visual Workbench | `v8.0.1-1.20.1-Forge` | MR | COMMON | CORE | |
| Corpse | `forge-1.20.1-1.0.23` | MR | COMMON | CORE | |
| Carry On | `2.1.2.7` | MR | COMMON | CORE | |
| Client Dynamic Light | — | CF | — | CORE CLIENT | |

## Crafting assistance (Crafting Spec)

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Just Enough Items (JEI) | `15.49.0.191` | MR | COMMON | CORE | |
| Jade | `11.13.3+forge` | MR | COMMON | CORE | |
| Jade Addons | — | CF | — | CORE | |
| Crafting Tweaks | `18.2.9+forge-1.20.1` | MR | COMMON | CORE | |
| Mouse Tweaks | `1.20.1-2.25.1-forge` | MR | CLIENT | CORE | |
| Polymorph | `0.49.10+1.20.1` | MR | COMMON | CORE | |
| Player Microchip (tracker) | — | CF | — | CORE | not yet swept |

## Wildlife (Wildlife Spec)

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Naturalist | `5.0pre4+forge-1.20.1` | MR | COMMON | CORE | a **prerelease** — pin deliberately or wait for 5.0 |
| Critters and Companions | `2.7.1` | MR | COMMON | CORE | |
| Ecologics | `2.2.7-Forge` | MR | COMMON | CORE | |

---

## What this sweep constrains

**A pure-Modrinth `.mrpack` is impossible.** Seventeen mods have no 1.20.1 Forge build on
Modrinth, and four of them — `flywheel`, `ponder`, `ritchiesprojectilelib`, `esl` — are hard
dependencies of the Create stack. This is not a matter of dropping optional mods; the pack does not
load without them. Every distribution path must resolve CurseForge, which is what packwiz does
(Distribution Spec §3).

**Three mods have a Modrinth project but no 1.20.1 Forge file** — Eating Animation, Simple Voice
Radio, CCTV Camera. They are marked `CF` above on the assumption a CurseForge build exists; that
assumption is **unverified** and each needs checking before it is added.

**Three CORE mods were never swept** — TaCZ x Guns Lights Addon, CAPS_Awim Tactical Gear, Player
Microchip. They are named in the design documents but were not in the sweep list. Add them.

**Naturalist's newest 1.20.1 build is `5.0pre4`, a prerelease.** Pinning a prerelease into a CORE
slot is a decision, not a default.
