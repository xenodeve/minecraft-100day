# kubejs/ — the pack's global data layer

**What is here right now:** `data/enhancedai/tags/blocks/miner_blacklist.json` — the blocks a
breaching mob **cannot** mine.

## Why this lives under `kubejs/data/` and not `datapacks/`

The design document's §7 repo layout lists a `datapacks/` directory, and that is where a datapack
*file* belongs — but Minecraft does not load a `datapacks/` folder at the pack root. Vanilla only
reads `<world>/datapacks/`, which is **per-world**: a datapack placed there applies to the world it
sits in and to no world the player creates afterwards. For a pack rule that must hold in every
world, that is the wrong place.

KubeJS — CORE in this pack — loads `kubejs/data/<namespace>/…` as a global datapack for every
world. So that is where a pack-wide tag goes.

If a `datapacks/` directory appears later it should hold things that are genuinely per-world, or a
mod that provides global datapack loading should be added deliberately and recorded.

## Why the tag is a datapack and not a config

Enhanced AI's generated `common.toml` says so itself:

> Mobs can mine blocks to reach the target. Uses offhand item to mine. Only mobs in the entity type
> tag `enhancedai:mobs/can_mine` can spawn with the ability to mine and blocks in the tag
> `enhancedai:miner_blacklist` cannot be mined.

The mod exposes the behaviour through tags, so the customization the design document files under
`HEAVY CONFIG` (Main §3.4) is really a datapack. Read from the generated config, not assumed —
§31 rule 11.

## The design intent this encodes

Main §3.4:

> Wood/Dirt/Cobblestone สามารถ breach ได้ง่ายกว่า
> Fortified Stone / Industrial defenses ต้องดีขึ้นจริง

So wood, dirt, cobblestone and ordinary stone are **deliberately absent** from the blacklist — a
mob is supposed to get through them. What is listed is the tier a player has to actually build
toward: obsidian, netherite, steel, and Immersive Engineering's concrete and steel scaffolding.

**SecurityCraft's reinforced blocks are deliberately NOT here.** §14 says the opposite for them:
*"SecurityCraft ต้องถูก nerf หากมี block ที่ทำให้ enemy ไม่สามารถ breach ได้เลย"* — making them
unmineable is the failure this pack is avoiding, not the goal.

## `"required": false`

Every mod-provided entry is wrapped as `{ "id": "...", "required": false }`. A tag entry that names
a block which does not exist is a **hard datapack error** in 1.20.1 — it fails the whole tag and
takes the reload with it. `required: false` makes a missing entry a no-op instead.

That matters here because the Immersive Engineering block ids have **not** been verified against
the registry. They are the mod's conventional names; if one is wrong, this file degrades to
ignoring that line rather than breaking the world load. Verify them against `/data get` or a
registry dump before relying on any single one.

## Verifying it took effect

```
/datapack list
```
should show `file/ics-threat` under enabled packs. Then, in game, have a breaching mob path at a
wall of one of the listed blocks and confirm it does not mine through.

**Not yet verified in game.** The server boots with this datapack loaded; that proves it parses,
not that the behaviour is what the design wants.
