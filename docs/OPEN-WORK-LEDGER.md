# Open Work Ledger — consolidated single source (2026-08-25)

> **Why this file exists:** open work is scattered across GitHub issues, ADRs, plans, and MD
> files. Agents read issues but often miss the MD. This ledger consolidates **everything still
> open** — GitHub-tracked **and** MD-only — into one place, deduped, with a phased plan.
> **Read this file at session start (it is linked from `CLAUDE.md`).** When you finish an item,
> update its row here AND its GitHub issue; when you discover new work, add a row here and (for
> anything non-trivial) file an issue so it doesn't vanish back into MD.

**Legend:** ✅ done · 🟢 buildable now · 🟡 gated (needs merge / resource / decision) ·
🔴 **UNTRACKED** (MD-only, no GitHub issue — highest miss-risk) · ⛔ decided won't-do (kept
visible so it is not re-proposed as if it were open)

**Current state, stated plainly:** the pack is **built and customized**. 107 mods pinned with
exact versions and hashes, `config/` · `defaultconfigs/` · `kubejs/` · `config/ftbquests/` all
written, and **20 of the 22 customization rows implemented** with 3 declined-with-reasons and 2
parked against named blockers (`docs/customization-map.md`). Every change was proven on a
dedicated-server boot.

**Release engineering is now done too.** Side classification, the server pack, checksums, the
config ownership map and drift detection all landed (#41, #42, #43), and `verify.mjs` covers 7 of
Distribution Spec §15's 10 checks.

**What is left is one thing wearing several hats: nobody has launched a client.** The TTK matrix
(§24 Phase 2), MSPT under automatic fire (Phase 4), horde MSPT at 50/100/150/200 (§23), wildlife
population (W3/W6/W7), the Brimm-vs-TakKit comparison (§15), the JEI active-recipe check (Crafting
Spec §5) and the twelve-test release gate (Distribution Spec §16) are all **measurements**, and a
dedicated server cannot produce any of them.

**Three rows need no client, and none is blocked on us.** That is a different
statement from *"everything left needs a client"*, and the difference is the point:

| Row | What it actually waits on |
|---|---|
| **Redistribution licences (#53)** | **nothing — but all 107 pages are now read; what is left is a *decision*** |
| **Decide on Biome Dither / Punchy (#66)** | **nothing — available and undecided** |
| ~~The three Player Microchip textures (#35)~~ | **done — placeholders shipped (#74)**, real art can replace them any time |
| Re-add `cbc_firepower_components` | an **upstream release** supporting CBC ≥ 5.9 |
| Re-evaluate `TaCZ: Accelerated` | a **benchmark baseline** — which does need a client to profile with |

Two more needed neither and are now done: the **Season 2 viability sweep** (ADR 0004, #44) and the
**Visuals V0 reference audit** (#52).

**Why this is spelled out rather than summarised.** An earlier version of this paragraph claimed
*everything* left was downstream of a client launch. That was false when it was written: seven Track
5 rows were buildable and none had been touched. The correction then claimed the Microchip textures
were *"the whole list"*, which was also false, by two rows (#48). A claim of completeness in this
file is load-bearing — it is what a session reads instead of the table — so it is now written to be
checkable against the table rather than trusted.

Everything else in the pack is a design target derived from the documents until a client says
otherwise.

---

## Track 0 — Bootstrap remainder

| Item | Status | Gate | Next action |
|---|---|---|---|
| `docs/agents/issue-tracker.md` + `docs/agents/triage-labels.md` + `reading-domain-docs.md` | ✅ | — | Developer ran `/setup-matt-pocock-skills`; output landed with the T4 delta appended (**#3**). Consumer rules went to `reading-domain-docs.md` so the glossary at `domain.md` survived |
| Triage labels created on the GitHub repo | ✅ | — | 23 created, 2 already existed, 0 failed. `bug` renamed to `Bug` to match the vocabulary |
| `git config core.hooksPath .githooks` on this clone | ✅ | — | Enabled 2026-08-25. **Redo on every new clone** — it is per-clone local config and nothing can set it for you |
| `T4 main gate` ruleset — PR-only, no force-push, no deletion | ✅ | — | Active. Direct pushes to `main` are blocked |
| `lint` / `test` / `guards` as **required status checks** | ⛔ | closed as won't-do — the billing lock cannot be resolved | **ADR 0002**: workflow disabled, guards promoted to the load-bearing tier. Not open work; re-arming steps are in the ADR should that ever change |

**Track 0 is closed.** Bootstrap is done. The one thing it could not deliver — a server-side CI
tier — is now a decided operating mode rather than a pending task, which is why the row above is
⛔ and not 🟡.

## Track 1 — Blocking technical unknown — **RESOLVED**

| Item | Status | Gate | Next action |
|---|---|---|---|
| **Which Create major version the pack targets** | ✅ | — | **Create `6.0.8` — forced, not chosen.** The CORE addons' declared ranges intersect to `[6.0.8,6.1.0)` and 6.0.8 is the newest 1.20.1 build. Read from `META-INF/mods.toml` inside the jars (**#9**), see `docs/compatibility-matrix.md` |
| Season 2 viability under the chosen Create version (VS2 / Clockwork / TFMG / Warium) | ✅ | — | **ADR 0004** (#44). The pin closes **nothing** — all six Season 2 mods admit 6.0.8, and TFMG's `[6.0.6, 6.1.0)` is the same window Season 1 forces. Season 2 stays out of Alpha on scope, not compatibility |
| `packwiz` not installed on the dev machine | ✅ | — | Built from source with Go 1.26.7 → `~/go/bin/packwiz.exe` (2026-08-25) |
| `java` not on PATH | ✅ | — | Temurin **17.0.20.1** at `C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot`. **Prism Launcher 11.0.3** also installed — the official Minecraft launcher cannot import a modpack, so it was never a path to the goal |
| 17 CORE mods are CurseForge-only, four of them hard Create dependencies | 🟢 | none — packwiz resolves both sources | Constrains distribution, not feasibility. Recorded in the matrix |

## Track 2 — Pack construction (handoff doc §24, in order)

| Item | Status | Gate | Next action |
|---|---|---|---|
| Phase 0 — packwiz init, `pack.toml`, `index.toml`, `.packwizignore` | ✅ | — | MC 1.20.1 / Forge 47.4.23. **#11** |
| Phase 1 — the Create stack | ✅ | — | Create pinned `6.0.8`; `cbc_firepower_components` removed — it cannot load with CBC 5.11 (**#11**) |
| Mod set resolved and pinned | ✅ | — | 93 metafiles incl. the §2 performance stack (**#13**). Server boot green |
| **Phase 2 — combat baseline, `docs/combat-baseline.md` TTK matrix** | 🟡 | the **gun side is done**; the mob side needs a client | `docs/combat-baseline.md` exists with all 54 guns and 84 Born in Chaos entities read from bytecode. What is missing is *measured* mob HP, and `DamageBaseMultiplier` stays 1.0 until it exists (**#30**, **#33**) |
| **All 22 mods tagged for custom work** | ✅ | — | **20 implemented, 3 declined with reasons, 2 parked with named blockers.** `docs/customization-map.md` is now a status report rather than a plan (**#21**, **#27**–**#36**) |
| Phases 3–12 | ✅ | — | Threat director **#27** · Sound **#28** · Consumption economy **#31** · Horde **#29** · Civilization **#33** · Dragon frontier **#33** · Tactical gear **#30** · City infrastructure **#32** · Quest campaign **#36** |
| **Visuals V0** — reference audit | ✅ | — | **#52**. `docs/khaojee-visual-reference.md` — 24 projects swept by title, versions and licences read from the Modrinth API. Six of the seven adoption-set mods have real Forge 1.20.1 builds |
| **Visuals V1** — safe visual baseline | ⚠️ **staged, unverified** | **needs a client** | **#56**. Five client mods + Fzzy Config + Kotlin for Forge added and pinned; 99 → 106 mods. Server pack 89 → 91 and still boots green. **Not one §38 criterion is testable without a client** — every visual mod is `side = "client"` and the server boot cannot see them |
| **Visuals V2** — weather | ⚠️ **staged, unverified** | **needs a client** | **#58**. Particle Rain, MIT, `side = "CLIENT"` by its own declaration. §9's mandatory stress test and §32's ADS/NVG visibility rule are both client measurements |
| **Pufferfish's Biome Dither** and **Punchy!** — decide | ✅ | — | **#74**. Dither **deferred past Alpha**: it mutates surface blocks (`server: required`), Better Biome Blend already covers the visual seam, and §33 wants worldgen settled first. Punchy **rejected for Alpha**: first-person animation is already owned by SPA + NEA and TaCZ |
| **Visuals V3** — connected textures | ⚠️ **decided and scaffolded** | **needs block mapping + art, then a client** | **#68**. Fusion added (`client`). Own pack at `resourcepacks/industrial-civilization-connected-textures/` so #53 does not grow. Format verified from Fusion's own `json_schemas/` and `SimpleLayoutHandler.java` — **a first, guessed tile mapping was 5 of 16 wrong and would have failed silently.** The sheets are placeholder art under a namespace nothing references, so **the pack changes nothing yet** |
| **Visuals V4** — selective Fresh Animations | ⚠️ **loaders staged** | **needs `docs/animation-coverage.md`, which needs a client** | **#76**. EMF `3.2.4` and ETF `7.1` installed, both `client`. **Fresh Animations itself is NOT installed** — it is a resource pack whose licence says *see terms of use in description*, and §11 wants it selective per entity. The loaders are in place; the coverage matrix is the decision |
| **Visuals V5–V8** — decorative and worldgen prototypes | ⚠️ **installed, one expansion chosen** | needs multiple seeds and a client | **ADR 0006 (#78)**. **Biomes O' Plenty kept, Regions Unexplored removed** — Create Steam 'n' Rails registers tracks for BOP and not for RU, and RU ships twice the wood with none of it supported. TerraBlender retained. Also installed: Countered's Terrain Slabs, Polytone. §15 still wants BOP tested across seeds (V6) — this picked which mod to test, not whether it passes |
| **Visuals V9–V10** — multiplayer benchmark, visual profiles | 🔴 | needs 3–4 players | Visuals Spec §34. Standard / Enhanced / Cinematic Optional |
| `docs/animation-coverage.md` | 🔴 | needs a client | Visuals Spec §11 and the Animation Spec both cite it and it does not exist. Decides which vanilla entities Fresh Animations may own |
| **Redistribution licences** — `docs/distribution-licenses.md` | ✅ **friend path resolved** · 🔴 public release open | public release needs a platform format and its rules | **#53 → ADR 0005 (#72)**. We no longer redistribute anyone's jars: the friend artifact is 123 KB of manifest plus our own layer, and packwiz-installer fetches each mod from its author. The 405 MB self-contained zip is demoted to an internal test artifact. All 108 licences read |
| Phase 13 — Season 2 prototype | 🔴 | out of scope until Season 1 is played | §24 Phase 13. Create: New Age, VS2, Clockwork, TFMG, Warium |
| **Brimm Armors balance** | 🟡 | **needs a client** — §15 wants a comparison against TakKit and Brimm registers its stats in code | Read both armour sets off JEI tooltips, then write `config/brimm/overrides/*.xml` (root tag `config`; keys `defense` · `durability` · `toughness` · `knockback-resistance` · `rarity`). The format ships no example and fails open (**#32**) |
| **Player Microchip textures** | 🟡 | needs an artist | §20 wants the beacon to look like it clips to a plate carrier. Names and recipes are done (**#35**); the three 16×16 PNGs are not |
| Client boot test (§26 full protocol) | 🟡 | needs the developer's Microsoft account | Import per `INSTALL.md`, launch, create a world, reload, read `latest.log` |
| Re-add `cbc_firepower_components` | 🟡 | needs an upstream release supporting CBC ≥ 5.9 | Watch the project; one `packwiz mr add` when it exists |
| Re-evaluate `TaCZ: Accelerated` | 🟡 | needs a benchmark baseline | Performance Spec §2 calls it Core, §19 calls it CORE CANDIDATE. Resolve the contradiction with a measurement, not a reading |

## Track 3 — Addon Spec (Crafting Assistance + Tactical Tracker)

Source: `docs/Addon Spec — Crafting Assistance + Tactical Tracker.md`. Seven mods on top of the
main pack. Not yet folded into the §24 phase list — where each lands is itself an open question.

| Item | Status | Gate | Next action |
|---|---|---|---|
| JEI + Jade + Jade Addons + Crafting Tweaks + Mouse Tweaks + Polymorph | ✅ | — | All installed and booting. They are QoL and need no per-phase placement |
| Player Microchip re-themed as the tactical tracker | ✅ names + recipes · 🟡 art | textures need an artist | **#35** — renamed via an always-on `kubejs/assets/` override, recipes on §25's Industrial Electronics chain |
| Hide disabled content from JEI | ✅ | — | **#34** — the list is empty *because nothing was removed*, and `verify.mjs` now fails the ship gate if a recipe is removed without being re-added or hidden |
| Crafting Spec §5 — confirm JEI shows the ACTIVE pack recipe | 🟡 | **needs a client** | Open JEI, look up `tacz:ak47`, confirm the cost is `create:precision_mechanism` and not the stale 38 iron |

## Track 4 — Addon Spec (Natural Wildlife & Ecology)

Source: `docs/Addon Spec — Natural Wildlife & Ecology.md`. Three CORE mods and a phase list of
its own, W0–W9, gated behind the main pack. Folded into the operating layer under **#4**; the
implementation work below is not started.

| Item | Status | Gate | Next action |
|---|---|---|---|
| Naturalist + Critters and Companions + Ecologics | ✅ | — | Installed, booting, registry dumped (**#35**) |
| `docs/wildlife-roster.md` + duplicate species audit | ✅ | — | **#35** — 55 entities, §21's five categories, two exact duplicates resolved at source by §6's own role allocation |
| Spawn baseline + density tuning | 🟡 | **needs a profiling run** — W3 forbids reducing without one | The roster records every weight so the measurement has a sheet to fill in. `ladybug` 52 and `sea_bunny` 96 are the first candidates under §18's order |
| Threat-layer coexistence (Born in Chaos, Ice & Fire, The Hordes) | 🟡 | needs a played world | Wildlife Spec W5 — a Horde must not permanently wipe local ecology. Nothing in config expresses this; it is an observation |
| Serene Seasons interaction | 🔴 | out of scope for Alpha unless the mods already provide it | Wildlife Spec §52 — test, do not assume integration |

**Standing constraint from this spec, applies outside Track 4:** under performance pressure the
reduction order is ambient → small critters → duplicate species → common passives, and Create /
MineColonies / hostile encounter design are cut **last**. Any future tuning session inherits this.

## Track 5 — Distribution & release engineering

Source: `docs/Addon Modpack — Distribution & Updates.md`. Unlike Tracks 3 and 4 this one adds no
mods — it governs how the pack ships, and parts of it constrain this repository's own process.
Folded into the operating layer under **#7**.

| Item | Status | Gate | Next action |
|---|---|---|---|
| Create `develop`, with its own ruleset | 🟡 | deliberately deferred — nothing to integrate and nobody running `main` | Create it in the same change that cuts the first `v0.x.0-alpha` tag. Distribution Spec §22; reasoning in `docs/agents/workflow.md` |
| `scripts/build/build-instance.mjs` — the self-contained client artifact | ✅ | — | 93 jars, each hash-verified; Prism instance zip, one-step offline import (**#16**, ADR 0003) |
| `scripts/build/` — `build-server`, `generate-checksums` | ✅ | — | **#42**. Both written, plus `lib/pack.mjs` extracted so the two builds cannot disagree about a hash check. `build-instance` went 222 → 149 lines |
| Grow `verify.mjs` into `validate-pack` | ✅ 7 of 10 · 🟡 3 | the rest need a launched game or a dependency graph packwiz does not record | **#41**. Added pack metadata (incl. a stale `[index]` hash), missing mods, duplicate mods, unexpected client/server. Still open: missing dependencies, KubeJS startup errors, broken config references |
| COMMON / SERVER / CLIENT side classification | ✅ | — | **#41**, corrected by **#88**. `docs/side-classification.md` — now 93 `both` · 20 `client` · 1 `server`. #41 found three errors by cross-referencing; #88 found a **fourth class** of error the tier tests could not see: `side = "server"` also removes a mod from singleplayer, because a client runs an integrated server. In Control moved to `both` |
| **ServerCore — decide whether it belongs on clients too** | 🔴 **UNTRACKED** | a Performance Spec judgment, not a bug | The same reasoning error as #88 applies (zero `assets/` does not mean a singleplayer world does not want it), but the consequence is performance, not gameplay, so it was deliberately left out of #88's scope. Its own `mods.toml` declares `side = "BOTH"`, so nothing blocks the move. Decide under *Performance Spec* §2 vs §3 and benchmark before moving |
| **`build-instance.mjs` ignores `side`** | 🔴 **UNTRACKED** | none — decide whether that is correct | Measured during #88: the instance zip bundles all 114 jars including `servercore` (`side = "server"`). Defensible for an internal test artifact, but it means **that build could never have exposed #88** — only `packwiz curseforge export` and `packwiz-installer` filter by side. If the instance zip is meant to represent a client, it should filter; if not, say so in the script |
| Server pack, version-locked to the client pack | ✅ | — | **#42**. 89 mods / 332 MB **as shipped then** — 91 / 341 MB today after Visuals V1. `pack-version.txt` in both artifacts. Booted green from a **fresh** Forge install — and that boot verified the tracker recipes and found the Brimm × Improved Mobs interaction |
| Config ownership map — PACK CONTROLLED vs USER PREFERENCE | ✅ | — | **#43**. `docs/config-ownership.md`. The rule is structural, not a list: the pack owns exactly the 39 files it ships, because those are the only ones in the index for packwiz to write |
| `scripts/validate/config-drift` | ✅ | — | **#43**. Compares **values**, not hashes — measured: 4 of 4 TOML configs drift at byte level after one boot and 2 of 2 JSON do not, so a hash check would be wrong on every install |
| Release gate — the 12 in-game tests | 🔴 | needs a launchable pack | Distribution Spec §16. **Not automatable.** Human protocol, sibling of §26–27 |
| Checksums (`SHA256SUMS.txt`) | ✅ | — | **#42**. All three artifacts pass `sha256sum -c`, and the script refuses to write the file if any artifact was built from a stale version |
| Release tags + CurseForge / Modrinth publishing | 🔴 | **needs a release**, which needs the §16 gate, which needs a client | Distribution Spec §33, §34 |

**Standing constraint from this spec, applies outside Track 5:** the pack is Git + packwiz — the
manifest **plus** `config/`, `kubejs/`, `datapacks/`, `resourcepacks/`, `ftbquests/`. Zipping
`mods/` and sending it gives someone the right jars and the wrong game (§5). `CHANGELOG.md` exists
and every released version gets an entry.

---

## Management Plan — what is left

Phases 0–2 of the old plan are closed: the tooling is installed, every remaining item is tracked
as a GitHub issue, and the Create version resolved to `6.0.8` (forced by addon ranges, not chosen).
The §24 phase list ran to Phase 12.

**Everything that remains is downstream of one act: launching a client.** That is not a
scheduling opinion, it is what the design documents say — §24 Phase 2's TTK matrix, §23's MSPT
ladder, W3's *"tune based on measured population"*, §16's twelve in-game tests. A dedicated server
proves a config parses; it cannot prove a number is right.

**The order to do it in, once a client exists:**

1. **Boot protocol §26–27** — launch, create a world, reload, read `latest.log`. Everything else
   assumes this passed.
2. **Crafting Spec §5** — open JEI, look up `tacz:ak47`, confirm it shows `create:precision_mechanism`
   and not the stale 38 iron. Two minutes, and it validates every recipe change in #30, #31 and #32
   at once.
3. **§24 Phase 2** — the TTK matrix. `docs/combat-baseline.md` already carries the gun side and the
   HP each Rule 3 band implies; fill in the measured column. Where a mob falls outside its band the
   fix is *that mob's* config, never `DamageBaseMultiplier`.
4. **§24 Phase 4 + §23** — MSPT under automatic fire, then at 50 / 100 / 150 / 200 horde mobs.
   These decide the noise radii (#28) and `hordeSpawnMax` (#29), both of which are currently
   design targets anchored to Minecraft's simulation distance rather than to a measurement.
5. **Wildlife W3/W6/W7** — count a population before touching a single spawn weight.
   `docs/wildlife-roster.md` is the sheet; `ladybug` at 52 and `sea_bunny` at 96 are where §18's
   reduction order starts.
6. **§15 Brimm** — read both armour sets off JEI tooltips, then write the XML overrides.
7. **Distribution Spec §16** — the twelve-test release gate, and then a `v0.x.0-alpha` tag, which
   is also when `develop` gets created (§22, deferred deliberately in #7).

**One thing needs no client and is worth doing whenever:** the three Player Microchip textures
(§20). That is an art task, not an engineering one.
