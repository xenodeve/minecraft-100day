# Changelog

Every released version gets an entry here — required by Distribution Spec §24. A version with no
entry is not a release.

**Sections**, in this order, omitting any that is empty: `Added` · `Changed` · `Fixed` ·
`Removed`.

**Write it for the person installing it, not for the person who wrote it.** *"Reduced Born in
Chaos forest spawn"* is an entry; *"tuned incontrol.json"* is not — it names the file instead of
the effect.

**A version number here must match a git tag and the distributed artifact** (`v0.1.0-alpha`,
`v0.4.0-beta`, `v1.0.0`). A build from `develop` or a feature branch is a **dev build**: it gets
no entry, no tag, and is never handed to a friend as if it were a release.

---

## v0.2.0-alpha — pre-release, 2026-08-28

**This is a pre-release for testing, not a release.** The twelve-test gate in *Distribution Spec
§16* has never run, because it needs a client somebody has actually played on. Treat everything
below as untested in game.

**One artifact is published: `Industrial-Civilization-Survival-0.2.0-alpha-friend.zip`** — 132 KB,
a manifest plus our own configs, scripts and quests, with **zero third-party jars**. It installs a
client, and the same file installs a server with `-s server`.

**The other four artifacts are not published and will not be.** `-instance.zip`, `-server.zip`,
`-alpha.zip` and `-curseforge-local.zip` each bundle 83–120 jars, and two authors permit modpack
inclusion only if their jar is not rehosted. `docs/distribution-licenses.md` has the per-artifact
table; **ADR 0005** is why the friend pack exists at all.

### Fixed

- **Monsters no longer swarm the first days.** The spawn director — the thing that holds elite
  monsters back until day 20, mid-tier until day 6, and trolls until day 25 — was never installed
  on anyone's game. It was marked server-only, and singleplayer runs its own server inside the
  client, so it was missing from the two ways people actually play. Early game should be markedly
  lighter. Reported from a real playtest.
- **The game starts.** Sophisticated Tactical Backpacks asks for a file under one name and ships it
  under another, which killed the client during model loading, every time. A 1 KB shim supplies it
  under the expected name.
- **The game starts, again — shaders broke it and now do not.** Adding Oculus made ImmediatelyFast
  try to reach into a part of Iris that newer versions renamed, and ImmediatelyFast responds to that
  by shutting the game down on purpose. There is no crash report because nothing crashed. Fixed by
  updating ImmediatelyFast, which now understands both the old and the new names. Both mods stay.

### Added

- **Shaders are possible, and still optional.** Oculus is included — it is Iris, built for Forge.
  Nothing changes until you pick a shaderpack; none ships. **Do not install OptiFine**: it collides
  with the renderer this pack uses, and the README says so where a player will see it.
- **A profiler.** spark ships with the pack, because a profiler you have to install after the
  problem starts is a profiler you do not have.
- **Four performance mods, none of them measured yet.** BadOptimizations, AllTheLeaks, Dynamic FPS
  and Legendary Block Entities. They are installed, not accepted — nobody has a frame-time number
  for this pack, so nothing here claims they help.

### Changed

- **114 → 120 mods.**
- **The version number identifies a build again.** Two different archives were both called
  `0.1.0-alpha`, which made the "compare `pack-version.txt`" instruction in the README useless.

### Known, and unfixed

- **Nobody has played this.** A client reaches the main menu; nothing past that is tested. Damage
  numbers, difficulty and spawn rates are all design targets.
- **Do not keep a world you care about.** Worldgen is Biomes O' Plenty, chosen on quality and never
  tested across seeds. If it has to change, existing worlds go with it.
- Improved Mobs cannot read Brimm Armors' defence values, so no Brimm armour will ever be worn by a
  mob.
- Three of the four performance mods are client-only and have never been run at all.

---

## Unreleased

> **The pack version is now `0.2.0-alpha`, and this is still not a release.**
>
> The number moved because it had stopped identifying a build. `build/README.md` tells every friend
> to compare `pack-version.txt` and treat a mismatch as the problem — advice that is useless when
> two materially different archives both say `0.1.0-alpha`. Since the last one was handed out the
> pack gained In Control on clients (#88), Oculus (#91), spark (#94), four performance candidates
> (#97), and went 114 → 120 mods. A bug report against "0.1.0-alpha" would name an ambiguous
> artifact.
>
> `0.2.0-alpha` is the next rung on *Distribution Spec §8*'s own ladder
> (`0.1.0-alpha → 0.2.0-alpha → 0.5.0-beta → 0.9.0-rc1 → 1.0.0`), and six new mods plus a
> gameplay-affecting fix is a MINOR step rather than a PATCH.
>
> **No tag, no GitHub Release, no release entry** — the rule below still holds, and §16 has never
> run. The one release this repository has is `militarybackpack-refmap-shim-v1.0.1`, which is a
> 1 KB shim jar on its own version line and **not** the pack (#101).

### Added

- **114 mods**, pinned to exact versions with hashes. Create is `6.0.8` — forced by the addon
  version ranges, not chosen.
- **A twelve-chapter quest campaign**, 48 quests. Objectives rather than a crafting checklist:
  *Establish Industrial Production*, *Build a Freight Corridor*, *Survive a Major Siege*.
- **A firearm progression.** Guns are built at four tiers gated on what your factory can make —
  iron and wood, then andesite alloy, then precision mechanisms and brass, then steel and electron
  tubes. The .22 revolver, which previously had no recipe at all, is now craftable.
- **An ammunition industry.** The Create production line — brass sheet, casing, primer, propellant,
  crimp — is now the sensible way to make ammunition. Hand-loading at the gunsmith table still
  works and costs about nine times as much per round.
- **A wildlife layer**, with the roster documented in `docs/wildlife-roster.md`.
- **A tactical position beacon.** Renamed from "microchip" and moved onto the electronics chain —
  it clips to a plate carrier, it is not implanted.
- **A server pack**, built from the same pinned list as the client pack and stamped with the same
  version. It carries the four mods CurseForge's API will not serve, so a host does not have to
  hunt them down by hand.
- **`SHA256SUMS.txt`** next to the downloads, so you can check that what you got is what was built.
- **A visual layer.** Denser, more natural grass; smooth colour transitions between biomes instead
  of hard seams; footprints in snow and sand; sparks, smoke and impact particles where the game
  previously showed nothing; doors, chests, levers and lanterns that animate when you use them; and
  weather you can feel — rain and snow as real particles, wind, and ripples where rain hits water.
  **None of it is verified** — see the note at the end.
- **A bigger world to explore.** Biomes O' Plenty adds 69 biomes on top of vanilla's. It was chosen
  over the alternative because Create's railway mod supports its wood types and the alternative's it
  does not — you can lay track through what you find. **The world generation is not tested yet**, so
  treat any world you make right now as a test world.
- **`MODLIST.md`** and a licence record for every mod in it. The pack ships 107 mods by dozens of
  authors; `docs/distribution-licenses.md` says what each one's licence is and where that was read.
- **A mod list you can actually read.** `MODLIST.md` sits at the top of both the client and the
  server download: all 107 mods, the exact jar filename of each, whether it runs on the client, the
  server or both, and a link to the page it came from. Every mod in this pack is somebody else's
  work and this is where they are credited.

### Changed

- **Guns are heard at different distances.** A suppressed pistol carries 8 blocks; an AK-47 carries
  88; a shotgun 112; an RPG 176. Previously every gun in the game was heard at roughly 160.
- **Monsters follow a ladder.** Elites and mid-tier Born in Chaos fade in over days rather than
  appearing at once, and a hostile density ceiling keeps the ambient world from sitting at the cap.
- **Dragons are properly dangerous and properly far away.** 1600 HP instead of 500, and no dragon
  territory within 2250 blocks of world spawn.
- **Hordes are less frequent and much bigger.** Every 12 days give or take three, starting at dusk
  and ending at dawn, growing from 20 mobs to nearly 200 across a long game.
- **Colony raids no longer collide with hordes.** Raids moved from every 14 nights to every 24, so
  the two systems interleave instead of stacking.
- **Undead do not burn at dawn.** Daylight is a shift change, not a reset. *This is deliberate and
  players should be told.*
- **Guns need maintenance.** They wear, and below 25 % durability they can jam. Above that they
  never do. Repairing a rifle needs brass; a sniper or a machine gun needs steel.
- **Bleeding out takes two minutes and reviving takes ten seconds**, and you come back with three
  hearts instead of one.
- **Backpacks are luggage, not warehouses.** One stack upgrade per backpack instead of three.
- **Reinforced blocks and Block Pockets are factory products**, arriving with heavy industry rather
  than a fortnight in.

### Fixed

- **`.packwizignore` was silently dropping a Hordes config file.** A bare `scripts/` pattern matched
  `config/hordes/.../horde_data/scripts/`, so the script that swaps to the drowned spawn table in
  oceans would never have reached a player.
- **Three mods were marked for the wrong side.** Sound Physics Remastered and Client Dynamic Light
  are client-side and were being installed on servers that cannot use them; Improved Mobs ships a
  HUD element, so a client without it loses the difficulty bar. A server install is now two jars
  lighter.
- **The tactical beacon's recipes are confirmed to register.** They shipped unverified because the
  only test server available excluded the mod itself; the server pack includes it, and all four
  recipes resolve.

_**The visual layer is the one part nothing has checked.** All five visual mods are client-side, and
this repo's only test is a dedicated-server boot — which is structurally blind to them. The server
boots green with them in the pack (`Done (15.037s)`, 83 recipes, 0 failed, no new error class), and
that says only that they were correctly kept off the server._

_Still not released. Everything above is verified on a dedicated-server boot — configs parse,
recipes register, quests load — and **none of it is verified in game**. One known interaction is
already recorded and unfixed: Improved Mobs cannot read Brimm Armors' defence values, so no Brimm
armour will ever be worn by a mob._

_The first release entry below this one will be `v0.1.0-alpha`, and it cannot be cut until the
twelve-test release gate in Distribution Spec §16 passes — which needs a client._

_**And it must not be published anywhere until the redistribution question is answered.** The pack
bundles every jar, and at least two authors permit modpack inclusion only if their jar is not
rehosted. `docs/distribution-licenses.md`._
