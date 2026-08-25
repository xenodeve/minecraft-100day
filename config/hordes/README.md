# `config/hordes/` — the Horde event

**Not shipped to players** (`.packwizignore` excludes `*.md`). A datapack ignores unknown files at
its root, so this sits next to the tables it explains without affecting the pack.

Two things live here: the spawn tables in this folder, and the pacing in `../hordes-common.toml`.
They answer different halves of Main §12.

## Why the whole folder is committed, not just the file we changed

`hordes-info.json` now has `"data_version": -1`.

`DataGenerator` reads that field first and **returns early on any negative value** — the folder is
never regenerated. That is the documented pack-author switch, and the file says so itself:

> for modpack authors: setting the value to -1 will prevent the config folder regenerating when
> updating the mod

Without it, a Hordes update silently rewrites `tables/default.json` back to stock and every number
below disappears. With it, **this folder is ours permanently** — including the parts we did not
change. That is the cost, and it is a real one:

> **After every Hordes update, diff the jar's `config_defaults/` against this folder.** A new file
> the mod starts shipping will not appear here on its own. `hordes-info.json`'s own `changes` array
> is the mod author's changelog for exactly this.

## The spawn table format, verified

`HordeSpawnTable` accepts two forms. The string form is the one the mod's own default file uses,
so it is the one used here:

```
namespace:entity{optional_snbt}-weight-firstDay-lastDay
```

The day filter compiles to precisely this:

```
if (minDay > day)                  skip
if (maxDay != 0 && maxDay < day)   skip
```

so **`lastDay = 0` means no upper bound** — not "expires on day 0". Every persistent entry in the
mod's own shipped table uses it that way (`husk-25-50-0`).

There is also an object form — `entity` · `weight` · `first_day` · `last_day` · `min_spawns` ·
`max_spawns` · `nbt`, all present in `HordeSpawnTable`'s constant pool. It is better documented but
it is not what the shipped file exercises, so the string form was chosen: proven over pretty.

## Tier I and Tier II, and nothing else

§24 Phase 6 is explicit:

> Create Tier I and Tier II first
> Do not create Tier III/IV until baseline stable

So the table stops. There is no Tier III. The last entry starts on day 70 and the composition is
flat from there — deliberately, until the §23 MSPT measurements exist.

**Tier I — from day 0.** Vanilla undead plus the common end of Born in Chaos, weighted so vanilla
still carries the horde. Attrition, not lethality: a wall and a rifle are enough.

**Tier II — from day 45.** Armed and armoured vanilla undead arrive by NBT, and the mid tier of
Born in Chaos joins — `zombie_bruiser`, `door_knight`, `dread_hound`, `skeleton_demoman`,
`siamese_skeletons`. Then `mrs_pumpkin` and `dark_vortex` at 60, `bonescaller` at 70.

Plain `minecraft:zombie` is the only entry with a `lastDay` — it stops at 60, by which point the
armoured variant has been in the pool for fifteen days. The player never sees a night where the
horde changed; they see a season where it did.

**Born in Chaos elites are absent on purpose.** `supreme_bonescaller`, `krampus`, `lifestealer`,
`nightmare_stalker` and the rest are Tier III material. They are also gated in
`config/incontrol/spawn.json` for ambient spawning; a Horde must not be a back door around that.

**Dragons are absent, and this is where that rule is enforced.** Main §3.4: *"Dragon ไม่ใช่ Horde
mob"*, and §9 puts the dragon above Ice & Fire creatures, which are themselves above elite Born in
Chaos. Not listing them here is the whole implementation — no rule, no config flag, just an
absence. A rule in In Control was drafted for this and deleted, because a spawn-deny leaves the
roost standing and empty.

## The pacing, in `../hordes-common.toml`

§12 asks for `Calm → Tension → Crisis → Recovery` and warns against `Crisis → Crisis → Crisis`.
Frequency gives the first and last; duration gives the middle two.

| Setting | Was | Now | Why |
|---|---|---|---|
| `hordeSpawnDays` | 10 | **12** | §12: low enough to *"Build / Repair / Expand / Explore"* |
| `hordeSpawnVariation` | 0 | **3** | At 0 the horde is a calendar entry; see below |
| `hordeStartTime` | 18000 | **14000** | Dusk, not midnight |
| `hordeSpawnDuration` | 6000 | **9000** | 14000 → 23000 is exactly one Minecraft night |
| `spawnAmount` | 25 | **20** | Start of the growth curve |
| `hordeSpawnMultiplier` | 1.05 | **1.12** | The curve itself |
| `hordeSpawnMax` | 160 | **200** | Top of §23's own test ladder |

**The variation is the one that matters most.** At `0`, the horde lands on a day the player can
calculate, and preparation degenerates into a checklist run the afternoon before. Main §2 Rule 6
rejects that shape of rule in as many words. A window instead of a date means the base has to be
*ready*, not ready-by-Tuesday.

**The timing is derived, not chosen.** Minecraft night runs 13000 → 23000. Starting at 14000 and
running 9000 ticks ends the event at first light. The stock 18000 + 6000 covers only the back half
of the night, which reads as an interruption rather than a siege.

**The curve is fitted to §23's test targets**, not invented:

```
20 × 1.12ⁿ        n = hordes survived, ~1 per 12 days
```

| Day | Hordes | Mobs | §23 rung |
|---|---|---|---|
| 50 | ~4 | 31 | — |
| 100 | ~8 | 49 | **50** |
| 150 | ~12 | 78 | — |
| 200 | ~16 | 123 | **100 / 150** |
| 240 | ~20 | 193 | **200** — and `hordeSpawnMax` binds |

It also lands on §18's progression: *"Day 45–70 — first serious Horde"*, *"Day 70–100 — fortified
city, heavy defensive weapons"*. The stock `25 × 1.05ⁿ` reaches only 66 by day 240 — the horde
never becomes an emergency, and the fortified city never has anything to be fortified against.

## Two vanilla mechanics this mod deletes by default

`zombiesBurn = false` and `skeletonsBurn = false` are the mod's own defaults, and they are pinned
here rather than left implicit. They remove daylight as a free reset — undead that survive the
night keep going. That is the pack's premise (*"a world more dangerous than vanilla"*) and it is
now a **decision** rather than an accident of whatever The Hordes ships next release.

A player who has not been told will report it as a bug. It belongs in the pack's player-facing
notes, not only here.

## What is deliberately untouched

**`scripts/default.json`.** It already does the one thing worth doing — swapping to the `drowned`
table in ocean biomes — and the pacing it could also express lives in `hordes-common.toml`, where
one number is one number. Two places to set the wave size is one place too many.

**The infection layer.** `enableMobInfection`, `playerInfectionResistance`, the cure tags, the
conversion lists. No design document mentions infection. It passes §35 on its own merits — a cure
is a supply chain — so it stays at mod defaults, and inventing numbers for it would be inventing
requirements.

**`drowned.json`, `illagers.json`, `mixed_mobs.json`, `skeletons.json`.** Only `default` is
reachable from the shipped script, apart from the ocean branch. Tuning tables nothing selects is
work with no observable.

## How to check this in game

```
/horde spawn          start one now
/horde info           the current day counter and next event
```

**Verified so far:** the tables parse and the server boots with no `hordes` error line. Every
number above is a **design target**, not a measurement — §23 requires MSPT at 50 / 100 / 150 / 200
mobs with automatic gunfire and city NPCs running, and that needs a client. If 200 does not hold on
the target machine, `hordeSpawnMax` is the number that comes down first.
