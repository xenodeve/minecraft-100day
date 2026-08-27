# ADR 0006 — Biomes O' Plenty is the one biome expansion

- **Status:** Accepted (2026-08-27) — implemented
- **Area:** Worldgen · Compatibility
- **Related:** #76, #78, `mods/biomes-o-plenty.pw.toml`, `mods/terrablender.pw.toml`,
  Visuals Spec §13, §14, §15, §33, §37 (V6–V8), Main §5

## Context

#76 installed **both** Biomes O' Plenty and Regions Unexplored. Visuals Spec §14 forbids that:

> **Prefer one biome expansion unless testing proves both are worth the cost. Avoid kitchen-sink
> geography.**

Measured from the jars: BOP adds **69** biomes, Regions Unexplored **71**. Vanilla 1.20.1 has ~64.
Both installed is **~204 biomes**, against ~133 with one. TerraBlender divides the world between
providers, so every biome gets rarer — and this pack has things a player **must be able to find**:
oil fields, dragon territory beyond 2250 blocks, settlement sites, buildable rail corridors.

**This decision cannot wait, and it cannot be undone later.** Worldgen is baked into a save at chunk
generation. Remove a biome mod from a world that used it and generated chunks reference biomes that
are no longer registered; add one later and new biomes appear only in fresh chunks, leaving a seam.
That is why §33 has a worldgen-lock rule. Both mods can coexist safely *only* while no world exists,
which is the state right now.

The developer directed that the choice be made **on quality, explicitly not on licence**.

## Decision

**Keep Biomes O' Plenty `19.0.0.96`. Remove Regions Unexplored. Retain TerraBlender `3.0.1.10`,
which BOP requires.**

### 1. Create Steam 'n' Rails supports BOP and not Regions Unexplored

From this pack's own server boot log (`servertest/logs/latest.log`, boot of 2026-08-27):

```
Registering tracks for Biomes O' Plenty
Registering tracks for Blue Skies
Registering tracks for Dreams and Desires
Registering tracks for Hex Casting
Registering tracks for Nature's Spirit
Registering tracks for Oh The Biomes You'll Go
Registering tracks for Quark
Registering tracks for TerraFirmaCraft
Registering tracks for Twilight Forest
```

**Regions Unexplored is absent from that list.** Main §5 builds a travel philosophy on rail; the
quest campaign has a *Railway Age* chapter and a *Build a Freight Corridor* objective
(`config/ftbquests/quests/chapters/railway_age.snbt`).

**The gap is worse for Regions Unexplored than for BOP, not equal.** It ships **82** wood block
models against BOP's **39** — twice the wood variety, and Create Railways supports **none** of it. A
player would keep finding attractive wood they cannot lay track with.

### 2. Better maintained on our exact version

| | BOP | Regions Unexplored |
|---|---|---|
| 1.20.1 releases | **48** | 23 |
| latest 1.20.1 build | **2025-03-29** | 2024-07-23 |

Eight months more recent, twice the release count, on the version §31 pins us to. For a pack meant to
be played 100+ days that is a live-support difference, not trivia.

### 3. Ecosystem gravity

33.4M downloads against 9.2M; 5126 followers against 1847. The Railways list above is the mechanism:
widely-adopted biome mods accumulate explicit compat from other mods. Adoption predicts the
compatibility we cannot test yet.

## Alternatives considered

- **Regions Unexplored instead.** Its tag integration is measurably better — **99** biome tag files
  against 76, **50** `forge:` namespace tags against 31, **22** `has_structure` tags against 19.
  Structures and mobs from other mods likely place better in its biomes. **This is the strongest
  argument against this ADR**, and without Create Railways in the pack it would probably win.

- **Keep both.** What §14 forbids. Rejected on the dilution arithmetic above.

- **Neither.** Legitimate under §14 and not chosen: Main §5 and §24's exploration pressure both
  assume more geography than vanilla plus Ecologics provides. Revisit if V6 shows BOP hurting
  oil-field or settlement discovery.

- **Decide on licence.** BOP is All Rights Reserved and Regions Unexplored is MIT, which under #53
  would favour RU. **Explicitly excluded by the developer's direction.** ADR 0005 had already removed
  the redistribution exposure by not shipping jars at all, so the licence difference costs nothing
  operationally.

## Consequences

- **Positive:** rail construction works with the pack's biome wood, which a design pillar depends on.
  ~133 biomes rather than ~204, so oil, settlement sites and dragon territory stay findable.

- **Positive:** the §14 conflict is closed *before* a world exists, which is the only window in which
  closing it is free.

- **Negative — a real loss.** Regions Unexplored has the better tag integration of the two. Modded
  structures and mobs may place less well in BOP biomes than they would have in RU. **Not measured**,
  and it should be watched during V6.

- **Negative — BOP is All Rights Reserved.** Under ADR 0005 the pack ships no jars, so this costs
  nothing today. It would matter again if self-contained distribution were ever restored.

- **What this does NOT establish:** that BOP's worldgen is *good* for this pack. §15 wants spawn
  safety, settlement locations, oil access, dragon worldgen, rail corridors, biome readability, world
  size, generation time and wildlife distribution compared **across multiple seeds**, and §37 gives
  that its own phase (V6). This ADR picks which mod to test — not whether it passes.

- **Follow-ups.** V6 tests BOP against §15's criteria. If it fails them, the alternatives above are
  on the record with their measurements, and superseding this ADR does not require re-deriving them.

## The irreversibility was demonstrated, not just asserted

While removing Regions Unexplored, the test server reused a world generated **with** it — the reset
script deleted `world/` while `server.properties` names the level `boottest`. Forge logged:

```
[GameData/REGISTRIES]: Unidentified mapping from registry minecraft:block
[GameData/REGISTRIES]: Unidentified mapping from registry minecraft:entity_type
[GameData/REGISTRIES]: Unidentified mapping from registry minecraft:item
[GameData/REGISTRIES]: There are unidentified mappings in this world — we are going to attempt to process anyway
```

with **3120** `regions_unexplored` references in a log from a pack that no longer shipped it.
Deleting `boottest` and re-booting gave **0** of each.

**That is exactly the failure this ADR exists to avoid**, produced by accident on a throwaway world.
On a world someone cared about it would not have been recoverable by deleting the world.

## Verification

Fresh world, `regions-unexplored` removed:

```
Done (44.326s)          — slower because it generated a new world for the first time
Added 83 recipes · 0 failed recipes
0 Unidentified mapping · 0 regions_unexplored references
Registering tracks for Biomes O' Plenty
```

**The ERROR count on that boot was 4, and that is not an improvement** — `config/` was retained, so
Improved Mobs reused its `equipment.json` and never re-ran the scan that produces the 45 known Brimm
lines. Against a fresh `config/` the figure is still 50. See `docs/compatibility-matrix.md`.

## Method, so it can be redone

```bash
# what other mods explicitly support, from our own boot log
grep -oE "Registering tracks for .*" servertest/logs/latest.log | sort -u

# content and integration depth, from the jars
unzip -l <jar> | grep -cE 'data/[a-z_]+/worldgen/biome/.*\.json'      # biomes
unzip -l <jar> | grep -cE 'models/block/.*(_planks|_log)\.json'       # wood types
unzip -l <jar> | grep -cE 'tags/worldgen/biome/.*\.json'              # tag files
unzip -l <jar> | grep -cE 'data/forge/tags/worldgen/biome'            # forge: tags

# maintenance, from the Modrinth API
curl -s "https://api.modrinth.com/v2/project/<slug>/version?game_versions=%5B%221.20.1%22%5D"
```
