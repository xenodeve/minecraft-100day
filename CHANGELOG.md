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

## Unreleased

### Added

- **99 mods**, pinned to exact versions with hashes. Create is `6.0.8` — forced by the addon
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
- **`MODLIST.md`** and a licence record for every mod in it. The pack ships 99 mods by dozens of
  authors; `docs/distribution-licenses.md` says what each one's licence is and where that was read.
- **A mod list you can actually read.** `MODLIST.md` sits at the top of both the client and the
  server download: all 99 mods, the exact jar filename of each, whether it runs on the client, the
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

_Still not released. Everything above is verified on a dedicated-server boot — configs parse,
recipes register, quests load — and **none of it is verified in game**. One known interaction is
already recorded and unfixed: Improved Mobs cannot read Brimm Armors' defence values, so no Brimm
armour will ever be worn by a mob._

_The first release entry below this one will be `v0.1.0-alpha`, and it cannot be cut until the
twelve-test release gate in Distribution Spec §16 passes — which needs a client._

_**And it must not be published anywhere until the redistribution question is answered.** The pack
bundles every jar, and at least two authors permit modpack inclusion only if their jar is not
rehosted. `docs/distribution-licenses.md`._
