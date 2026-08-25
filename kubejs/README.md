# `kubejs/` — the pack's global data layer

**Not shipped to players** (`.packwizignore` excludes `*.md`).

| Path | What | Issue |
|---|---|---|
| `data/enhancedai/tags/blocks/miner_blacklist.json` | blocks a breaching mob cannot mine | #21 |
| `data/ics/tags/entity_types/*.json` | the threat tiers, referenced by In Control | #27 |
| `data/gundb/gundb/*.json` | gun durability, repair and jamming | #30 |
| `server_scripts/guns/gun_progression.js` | TaCZ gun recipes, re-tiered onto the Create ladder | #30 |
| `server_scripts/ammunition/ammo_economy.js` | hand-loading re-costed so the Create line is worth building | #31 |

## Why this lives under `kubejs/data/` and not `datapacks/`

The design document's §7 repo layout lists a `datapacks/` directory, and that is where a datapack
*file* belongs — but Minecraft does not load a `datapacks/` folder at the pack root. Vanilla only
reads `<world>/datapacks/`, which is **per-world**: a datapack placed there applies to the world it
sits in and to no world the player creates afterwards. For a pack rule that must hold in every
world, that is the wrong place.

KubeJS — CORE in this pack — loads `kubejs/data/<namespace>/…` as a global datapack for every
world. So that is where a pack-wide tag goes.

## `"required": false`, everywhere

Every mod-provided tag entry is wrapped as `{ "id": "...", "required": false }`. A tag entry naming
a block or entity that does not exist is a **hard datapack error** in 1.20.1 — it fails the whole
tag and takes the reload with it. `required: false` makes a missing entry a no-op instead.

That matters because a mod can leave this pack. It also means an id typo degrades silently, so ids
still have to be read from the mod rather than remembered.

---

# The Enhanced AI breach tag

Enhanced AI's generated `common.toml` says so itself:

> Mobs can mine blocks to reach the target. Uses offhand item to mine. Only mobs in the entity type
> tag `enhancedai:mobs/can_mine` can spawn with the ability to mine and blocks in the tag
> `enhancedai:miner_blacklist` cannot be mined.

The mod exposes the behaviour through tags, so the customization the design document files under
`HEAVY CONFIG` (Main §3.4) is really a datapack. Read from the generated config, not assumed —
§31 rule 11.

Main §3.4:

> Wood/Dirt/Cobblestone สามารถ breach ได้ง่ายกว่า
> Fortified Stone / Industrial defenses ต้องดีขึ้นจริง

So wood, dirt, cobblestone and ordinary stone are **deliberately absent** from the blacklist — a
mob is supposed to get through them. What is listed is the tier a player has to actually build
toward: obsidian, netherite, steel, and Immersive Engineering's concrete and steel scaffolding.

**SecurityCraft's reinforced blocks are deliberately NOT here.** §14 says the opposite for them:
*"SecurityCraft ต้องถูก nerf หากมี block ที่ทำให้ enemy ไม่สามารถ breach ได้เลย"* — making them
unmineable is the failure this pack is avoiding, not the goal.

The Immersive Engineering block ids have **not** been verified against the registry. They are the
mod's conventional names; `required: false` makes a wrong one a no-op rather than a broken world
load. Verify them against a registry dump before relying on any single one.

---

# The threat tiers

`data/ics/tags/entity_types/` holds five entity-type tags that `config/incontrol/spawn.json`
references by name. They exist because In Control's `mob` key accepts a `#tag`, and without that
the elite tier's fourteen entity ids would appear verbatim in three separate rules — where editing
one copy and not the others silently breaks the day ramp with nothing to report it.

The tier boundaries come from Born in Chaos' own declared spawn weights. See
`config/incontrol/README.md` for the derivation.

---

# Gun durability, repair and jamming

`data/gundb/gundb/*.json` overrides seven of TACZ: Durability's own class files. The schema was
read out of `mod/cdv/gdb/resource/ResourceLoader` — `Jam`, `JamChance`, `JamThreshold`,
`JamTimeMS`, `RepairItem`, `RepairCost`, `XpCost`, `MaxDurability`, `FireOnZero`, `Stats`.

## Jamming is a consequence of neglect, not a tax

Main §3.2 sets two requirements that pull against each other:

> ปืนต้องมี maintenance
> แต่ห้าม jam จนน่ารำคาญ

The shipped data resolves this badly: `Jam: true` on the **pistol only**, with `JamChance` and
`JamThreshold` left unset. A jamming sidearm is the single most irritating place to put the
mechanic — the pistol is what you reach for when the rifle is empty.

`JamThreshold` is what makes both requirements satisfiable at once. It is set to **0.25** on every
class, so **a gun above 25 % durability never jams**. Jamming stops being a random tax on shooting
and becomes the specific consequence of taking a worn weapon into a fight — which is a maintenance
problem, solved by maintenance. That is §35's test: a new problem answered by preparation.

Per-class chance reflects the mechanism. Belt-fed weapons jam most (`mg` 0.07), bolt-actions least
(`sniper` 0.03). **The RPG does not jam at all** (`Jam: false`): it is single-shot, so a jam is not
a setback you play around, it is a dead weapon and nothing else.

## Repair items follow the industrial ladder

Rule 1 makes Create the backbone, so what a gun costs to *keep* tracks what it cost to *build*:

| Class | Repair item | Reads as |
|---|---|---|
| pistol | `#forge:ingots/copper` | pre-industrial |
| smg · shotgun | `#forge:ingots/iron` | pre-industrial |
| rifle | `#forge:ingots/brass` | Create is running |
| sniper · mg | `#forge:ingots/steel` | Immersive Engineering is running |
| rpg | `minecraft:netherite_scrap` | unchanged; a genuine apex gate |

Both `forge:ingots/brass` and `forge:ingots/steel` were checked to exist and be populated — Create
provides the first, Immersive Engineering and Create Big Cannons the second. An empty repair tag
would make a gun unrepairable, silently.

`MaxDurability` and the `Stats` degradation curves are left exactly as shipped. No design document
gives a number for them, and inventing one would be inventing a requirement.

---

# TaCZ gun progression

## Why KubeJS rather than a gun pack

TaCZ keeps its recipes in `tacz/tacz_default_gun/`, and `tacz-pre.toml` `DefaultPackDebug = false`
means **the mod rewrites that folder on every launch**. Owning it would mean committing 84 MB of
models and textures and flipping a debug flag.

Measured instead: **173 gunsmith-table recipes are visible to the vanilla recipe manager**, so
KubeJS controls them outright and none of that is necessary. The probe that established this is in
the #30 history; it printed the stock AK-47 recipe verbatim from inside `ServerEvents.recipes`.

## The ladder

Stock AK-47: **38 iron, 6 lapis, 10 logs** — buildable on day two with a stone pickaxe. That is
the problem the `HEAVY CUSTOM BALANCE` tag is about.

Four tiers, one per phase of §18's own progression, each gated on the Create item that phase is
actually about:

| Tier | §18 | Gate | Guns |
|---|---|---|---|
| **T0** field-expedient | Day 1–20, *"Primitive guns"* | iron · copper · logs, no Create | revolvers, break-action, bolt-action |
| **T1** workshop | Day 20–45, *"Create workshop"* | `create:andesite_alloy` | magnums, SMGs, pump shotguns, first semi-autos |
| **T2** industry | Day 45–70, *"Better firearms"* | `create:precision_mechanism`, brass | assault rifles, `ai_awp`, `aa12` |
| **T3** heavy industry | Day 70–100, *"Heavy defensive weapons"* | steel, `create:electron_tube`, IE steel components | battle rifles, belt-fed, .50 BMG, explosive |

A gun is not gated by a number. It is gated by a factory the player had to build.

## One deliberate change to the mod's intent

**`taurus943` had no crafting recipe at all.** The .22 revolver is obtainable only from the
`spawn_bonus_chest_taurus943` loot injector — one at world spawn, never another. The script gives
it a T0 recipe (16 iron, 4 copper).

That is a change to what the mod author decided, made on purpose: §18 opens with *"Survival /
Casual gear / Primitive guns"*, and a cheap, weak, craftable revolver is exactly that tier. A
one-off gift is not a progression rung.

---

# The ammunition economy

## §8's production chain already exists

Main §8 sketches what ammunition should require:

> Brass Sheet → Form casing → Insert projectile → Add propellant → Crimp → Cartridge

**TaCZ: Creatified (`tacz_c`), already CORE in this pack, ships 96 recipes that are that chain
almost line for line:**

```
create:brass_sheet
  → cutting → thin_brass_sheet → cutting → brass_cup → brass_cylinder
  → annealing → annealed_brass_cylinder → cutting → case_<calibre>
  → sequenced assembly: deploy primer, deploy gunpowder grains
  → casefull_<calibre>
  → sequenced assembly: deploy bullet, deploy bullet, press
  → tacz:ammo
```

plus gunpowder cake / grains / pellets, primers, wads, and separate assemblies for 40 mm grenades
and RPG warheads. Nothing here needs to *build* the ammunition plant.

## So the job is to make the plant worth building

The gunsmith table hands you **50 rounds of 9 mm for 10 copper and 2 gunpowder**. No factory
competes with that, so Rule 4's *"โรงงานผลิตกระสุนคือ Core Gameplay"* never happens.

One rule, not 24 hand-written tables:

> **Hand-loading yields a sixth of the rounds for half again the materials.**

About nine times the cost per round. 100 rounds of 9 mm goes from 20 copper to roughly 190 — which
is what Rule 4 means by *"100 rounds = valuable"* on day 10, and what makes the Create line
obviously correct by day 40.

Stating it as a transformation rather than a table has one property that matters: **a calibre TaCZ
adds next year is covered on the day it ships**, and cannot quietly reopen the shortcut.

## The exception, which is evidence rather than a fudge

`tacz_c` has no case for **.22 WMR** or **.500 Magnum**. For those two the gunsmith table is not a
shortcut past the factory — it is the only path. Nerfing them like the rest would delete the
ammunition rather than industrialise it, so they take a third of the reduction instead of a sixth.

If `tacz_c` adds those cases, delete the exception.

---

# Verifying any of this

```
/reload
```

then read the log. The two scripts announce themselves:

```
[ICS] hand-loading recipes re-costed: 24
[ICS] TaCZ gun recipes re-tiered: 54
```

and KubeJS reports the totals it applied — the batch that landed all of this read
`Added 78 recipes, removed 77 recipes, modified 0 recipes, with 0 failed recipes`. The 78 is
54 + 24; the 77 is one fewer because `taurus943` had no recipe to replace.

**`0 failed recipes` is the load-bearing part of that line.** It is what proves the Create items
resolve and the `tacz:gun_smith_table_crafting` JSON is well-formed — a malformed recipe is dropped
silently and the gun simply becomes uncraftable.

**Not yet verified in game.** A green boot proves the recipes parse and register. It does not prove
the ladder feels right, and it cannot: that is §24 Phase 2 and it needs a client.
