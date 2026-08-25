# Compatibility Matrix

**This is a record of what has been observed, not of what should work.** A row is marked `PASS` in
**Tested** only after the pack has been launched with that exact version and the boot protocol
(§26) has run.

**Tested cells are still empty, and that is correct.** A **dedicated server** boot has passed
(see *Boot test* below) — every mod loaded, registries built, a world generated. That is not §26.
§26 is the **client** protocol: launch, create a world, join, save, restart, reload, read
`latest.log` and `crash-reports/`. The client has never been launched; it needs the developer's
Microsoft account. Do not fill a Tested cell from the server result.

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

Found in the jars, absent from the design documents. All are `mandatory=true`.

> **Corrected 2026-08-25, same day as written.** The first version of this section said all four
> were CurseForge-only and had to be sourced by hand. Two of them **must not be added at all**,
> and a third is on Modrinth. The correction is load-bearing: acting on the original would have
> installed Flywheel and Ponder twice — once standalone, once from inside Create — which produces
> no warning, only a broken pack.

| Dependency | Required by | Range | How it is actually satisfied |
|---|---|---|---|
| `flywheel` | Create | `[1.0.0,2.0)` | **Bundled inside Create via Forge JarJar** — `META-INF/jarjar/flywheel-forge-1.20.1-1.0.5.jar`. **Do not add separately.** |
| `ponder` | Create | `[0.8,)` | **Bundled inside Create via Forge JarJar** — `META-INF/jarjar/Ponder-Forge-1.20.1-1.0.91.jar`. **Do not add separately.** The projects named `ponder` on *both* Modrinth and CurseForge are *Ponder for KubeJS*, a different mod — adding either is the exact trap this row exists to prevent, and it was walked into once already. |
| `ritchiesprojectilelib` | Create Big Cannons | `[2.1.1,)` | On Modrinth as `rpl`; packwiz resolved it automatically when CBC was added |
| `esl` | Create: New Age | `[1.1.3]` | Unverified — Season 2 only, not in the alpha pack |

Create `6.0.8` bundles `Registrate MC1.20-1.3.3` and `mixinextras-forge 0.4.1` the same way. The
authoritative list is `META-INF/jarjar/metadata.json` inside the Create jar.

**The general rule this establishes:** before hunting for a missing Forge dependency, look in
`META-INF/jarjar/` of the mod that declares it. JarJar satisfies a declared dependency from inside
the jar, and a `mods.toml` entry looks identical whether the dependency is bundled or external.

---

## Create / industry / logistics

| Mod | Version | Source | Side | Status | Required deps | Tested |
|---|---|---|---|---|---|---|
| Create | `mc1.20.1-6.0.8` | MR | COMMON | CORE | flywheel, ponder | |
| Create: Steam 'n' Rails | `1.7.2+forge-mc1.20.1` | MR | COMMON | CORE | create | |
| Create Big Cannons | `5.11.4` | MR | COMMON | CORE | create, ritchiesprojectilelib | |
| ~~CBC: Firepower Components~~ | `0.2.0` | MR | COMMON | **REMOVED** | create-big-cannons `[5.8.0,5.9.0)` | ❌ blocked the server boot — see *Boot test* |
| Create Crafts & Additions | `1.20.1-1.3.3` | MR | COMMON | CORE | create | |
| Create: Diesel Generators | `1.20.1-1.3.12` | MR | COMMON | CORE | create | |
| Create: New Age | `1.2.0+forge-mc1.20.1` | MR | COMMON | SEASON 2 | create, esl | |
| Create: Copycats+ | `3.0.8+mc.1.20.1-forge` | MR | COMMON | DEPENDENCY | create | optional CBC integration |
| FramedBlocks | `9.4.3` | MR | COMMON | DEPENDENCY | — | optional CBC integration |
| Flywheel | bundled in Create | — | — | **DO NOT ADD** | — | inside `create-1.20.1-6.0.8.jar` |
| Ponder | bundled in Create | — | — | **DO NOT ADD** | — | inside `create-1.20.1-6.0.8.jar` |
| Ritchie's Projectile Lib | `2.1.1+mc.1.20.1` | MR (`rpl`) | COMMON | DEPENDENCY | — | auto-resolved with CBC |
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

## Performance stack (Performance Spec §2)

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Embeddium | `0.3.31+mc1.20.1` | MR | CLIENT | CORE | |
| ModernFix | `5.27.77+mc1.20.1` | MR | COMMON | CORE | |
| FerriteCore | `6.0.1` | MR | COMMON | CORE | |
| Entity Culling | `1.10.5` | MR | CLIENT | CORE | |
| ImmediatelyFast | `1.2.7+1.20.2` | MR | CLIENT | CORE | packwiz resolved this, not the `1.5.5+1.20.4` the sweep saw — that build is 1.20.4-first |
| ServerCore | `1.5.2+1.20.1` | MR | SERVER | CORE | |
| FastSuite | `5.1.2` | MR | COMMON | CORE | pulls `Placebo 8.6.3` |
| Clumps | `12.0.0.4` | MR | COMMON | CORE | |
| Chunky | `1.3.146` | MR | COMMON | CORE | |
| **TaCZ: Accelerated** | — | CF (`tacza`) | — | **NOT ADDED** | see below |

**Chunky vs Chunk-Pregenerator resolved itself.** §2 forbids installing both without a reason.
Chunk Pregenerator has a Modrinth project but **no 1.20.1 Forge build**, so there was no choice to
make.

**TaCZ: Accelerated is not in the pack, and the spec contradicts itself about it.** §2 lists it as
item 9 of the *Approved Core Performance Stack*; §19 gives its status as
`CORE CANDIDATE / PROMOTE AFTER BENCHMARK`. The stricter reading wins: it is not promoted until a
benchmark exists, which matches §3's discipline for every other candidate and §33's rule that
measurement precedes tuning. There is no baseline to measure against yet. Re-read §2 against §19
before adding it.

**§3 Experimental mods are all absent by design** — AI Improvements, Let Me Despawn, Alternate
Current, Canary, TaCZ Optimization, Smooth Boot Reloaded. Each needs its own benchmark branch.

## Animation & movement stack (Animation Spec §2)

| Mod | Version | Source | Side | Status | Tested |
|---|---|---|---|---|---|
| Not Enough Animations | `1.12.4` | MR | CLIENT | CORE | already in the pack |
| Better Animations Collection | `v8.0.1-1.20.1-Forge` | MR | CLIENT | CORE | |
| SmoothPlayerAnimations | `1.0.3` | MR | CLIENT | CORE | pulls `playerAnimator`, `Cloth Config` |
| Smooth Movement | `1.20.1-2.6` | CF | COMMON | CORE | pulls `cupboard` |
| **AMF: Better Movement** | — | — | — | **REJECTED** | Animation Spec §3 — excessive inertia, motion-sickness risk. *"Do not re-propose without explicit developer direction."* |
| EMF / ETF / Fresh Animations | — | — | — | **NOT ADDED** | §2 *Optional Selective Layer*, not Core |

**The slug in the sweep was wrong, and the sweep said so.** An early pass recorded
`smooth-player-animations` as CurseForge-only. The real Modrinth slug is **`smoothplayeranimations`**
— no hyphens — and it is on Modrinth. A slug miss reads exactly like an absent mod; only searching
by *title* rather than guessing the slug found it.

**Fresh Animations is a resource pack, not a mod.** That is why it has no 1.20.1 Forge build and
why it can never be added with `packwiz mr add` as a mod. The spec groups it with EMF and ETF under
*Optional Selective Layer* without making the distinction; it belongs in `resourcepacks/`.

## Boot test — 2026-08-25, Forge dedicated server

The first real test of the mod set. Forge 47.4.23 dedicated server, Temurin 17.0.20.1, 6 GB heap,
80 pack mods materialised by `packwiz-installer` (77 jars after client-only mods were filtered out
by `-s server`).

**Result: one mod prevented the whole server from starting. The other 76 loaded.**

| Mod | Verdict | Evidence |
|---|---|---|
| `cbc_firepower_components` `0.2.0` | ❌ **REMOVED from the pack** | `Mod cbc_firepower_components requires createbigcannons 5.8.0 or above, and below 5.9.0 · Currently, createbigcannons is 5.11.4` |
| the other 76 | ✅ loaded | no other `-- MOD` section in the crash report |

**Why it was removed rather than worked around.** `cbc-firepower-components` has three versions on
Modrinth and `0.2.0` is the newest; none supports CBC ≥ 5.9. Keeping it means pinning CBC to
`5.8.2` — a January 2025 build from the Create 0.5.1 era. Its `mods.toml` declares
`create [0.5.1.j,)`, an open range that *would* let Forge load it against Create 6.0.8, which makes
this the dangerous option rather than the safe one: it loads and then breaks at runtime against an
API that changed across a major version.

The design documents list this mod as CORE (compact cannon mounts, autocannon mounts, ammo feeds,
magazine loading). **It is not dropped on merit — it is dropped because it does not support the
Create version the rest of the CORE stack forces.** Re-add it when a version supporting CBC 5.11
exists; that is one `packwiz mr add` away.

### The gap in the sweep method that let this through

The version sweep read the `create` range of every addon and stopped there. It did not read
**second-order** ranges — an addon's range against *another addon*. `cbc-firepower-components`
depends on `createbigcannons`, not on `create`, so nothing in the sweep looked at it.

**Rule for the next sweep: read every `mandatory=true` dependency range in the jar, not only the
one pointing at Create.** The sweep answers "will Forge accept these versions together"; only a
boot answers "does it start".

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

### Boot 3 — with the Performance Spec §2 stack (2026-08-25)

Same server, 83 jars after client-only filtering.

```
[06:05:52] Done (22.295s)! For help, type "help"
```

**Green.** And measurably faster than the same set without it: **27.452s → 22.295s** on identical
hardware and heap.

That is an observation, not a benchmark. It is one cold start on one machine with no world cache,
and startup time is not the metric the Performance Spec cares about — §33–39 define the real ones
(MSPT, TPS, entity tick time, client FPS) across four scenarios. Do not quote 22.295s as evidence
the pack performs well; quote it only as evidence the stack loads and does not regress startup.

### Boot 4 — with the animation & movement stack (2026-08-25)

87 jars after client-only filtering. The three client-only animation mods are **not** exercised by
this test; what it does prove is that `smooth-movement`, `cupboard`, `playeranimator` and
`cloth-config` load on the common side without conflict.

```
[07:04:24] Done (25.183s)! For help, type "help"
```

Green. No errors from any animation-stack mod.

**What a server boot cannot tell you here.** Animation ownership, first-person camera feel and the
mixing rules in Animation Spec §4–14 are entirely client-side and entirely subjective. This batch
is the one where a green boot proves least — the spec's own §12 coverage matrix and §39 benchmark
scene are the real checks, and both need a client.
