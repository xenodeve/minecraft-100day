# `config/incontrol/` — the global spawn director

**Not shipped to players.** `.packwizignore` excludes `*.md`, so this file lives in the repository
next to the rules it explains and never reaches a friend's install. JSON has no comments and In
Control **rejects** an unknown key — finding 4 below — so this is the only place the
reasoning can go.

Only `spawn.json` is written. The other thirteen files In Control generates are still `[]` and
that is deliberate: an empty rule file is a rule file that does nothing, which is exactly right
until there is a reason for it to do something.

## Where the syntax came from

Main §3.4 says of this mod, in its own words:

> อย่า assume config syntax
> อ่าน documentation ของ exact installed version ก่อน generate config

The installed jar (`incontrol-1.20-9.4.7.jar`) ships no documentation at all — no README, no
example rules, nothing but classes and an empty block tag. So the vocabulary was read out of the
bytecode with `javap`, which is a stronger source than documentation anyway: it is the code that
will actually run.

| What | Where | Result |
|---|---|---|
| Legal keys | `mcjty/incontrol/rules/support/RuleKeys.class` | 190 keys in the constant pool |
| `result` values | `mcjty/incontrol/rules/support/ICResult.class` | `deny` · `allow` · `default` · `deny_with_actions` |
| `mob` / `mod` type | `GenericRuleEvaluator.addMobsCheck(List<String>)` | list of strings; `mob` also takes a tag |
| Count object keys | `CountInfo.parseCountInfo` | `amount` · `mob` · `mod` · `all` · `passive` · `hostile` · `perchunk` · `perplayer` |
| Day source | `DataStorage.getDaycounter()` | In Control's own counter, **not** world time |

## Four findings that would have been wrong from memory

### 1. `maxcount` is not a cap

`lambda$addMaxCountCheck$117` compiles to `if_icmpge` — the check is **true while the count is
still below the amount**. It is an *"am I under the ceiling"* test, not a ceiling.

Written the way it reads, `{"maxcount": 60, "result": "deny"}` denies every spawn *until* there
are 60 mobs and then allows everything, which is precisely backwards. A ceiling has to be
`mincount` (`if_icmplt` — true when count ≥ amount) plus `result: deny`.

This one fails open and looks fine: the file parses, the server boots, and the pack has no
density control at all.

### 2. `minspawndist` / `maxspawndist` take a **squared** distance

Both compile down to `BlockPos.m_123331_(Vec3i)` — `distSqr`, returning a `double` — compared
directly against the configured float. No square root is taken anywhere.

So `"maxspawndist": 2000` means **45 blocks**, not 2000. The Ice & Fire exclusion in `spawn.json`
uses `250000.0`, which is a 500-block radius (500² = 250 000).

### 3. `mob` takes a tag, and that is what keeps this file maintainable

`addMobsCheck` tests each entry for a leading `#` and, when it finds one, builds a
`TagKey` on the entity-type registry. So `"#ics:bic_elite"` is legal.

That matters more than it sounds. The elite tier is gated by **three** rules — a hard floor and
two fade-in windows — and the first draft of this file listed all fourteen entity ids in each of
them, verbatim. Fourteen ids times three copies, with no way for JSON to share them. Editing one
copy and not the others would have silently broken the ramp, and nothing would have reported it.

The lists now live in `kubejs/data/ics/tags/entity_types/`:

| Tag | What |
|---|---|
| `#ics:bic_elite` | Born in Chaos, declared weight 1–8 |
| `#ics:bic_mid` | Born in Chaos, declared weight 8–16 |
| `#ics:bic_swarm` | entries whose `maxCount` multiplies them per spawn |
| `#ics:iaf_apex` | Ice & Fire apex predators, all |
| `#ics:iaf_apex_ground` | the ground-based subset |

They live under `kubejs/data/` for the same reason the Enhanced AI blacklist does — see
`kubejs/README.md`: Minecraft does not load a `datapacks/` folder at the pack root, and KubeJS
loads `kubejs/data/` as a global datapack for every world.

Every entry carries `"required": false`, so a mod removed from the pack degrades that line to a
no-op instead of failing the whole tag and taking the reload with it.

### 4. An unknown key is an error, not a no-op

`GenericAttributeMapFactory` routes an unrecognised key to `ErrorHandler.error`. That rules out
the usual JSON workaround of a `"//"` or `"comment"` key — it would put a red line in every
player's log on every world load. Hence this file.

## What `spawn.json` actually does

**1 — Hostile density ceiling.** 60 hostiles per player. Vanilla's own mob cap is about 70 in
spawn range; Born in Chaos adds 44 naturally-spawning hostiles on top of that, so without a
ceiling the ambient world sits near the cap permanently and a Horde stops reading as an event.
The Hordes' own `hordeSpawnMax` is 160, so 60 leaves the event most of the room.

**2 — Born in Chaos share.** 16 per player. Keeps the mod a *layer* on the vanilla threat set
rather than a replacement for it.

**3–5 — The elite tier fades in.** Hard floor at day 20, then 80 % denied to day 45, 45 % denied
to day 70, full rate after. Main §2 Rule 6 rejects the alternative in as many words:

> ไม่ควรใช้ artificial rule แบบ:
> `Day 49 = ไม่มี Dragon`
> `Day 50 = Dragon spawn everywhere`

A decaying `random` deny is the cheapest shape that has no cliff in it — the player meets their
first elite on a day the config does not know about.

**6–7 — The mid tier fades in**, same shape, floor at day 6 and 55 % denied to day 20. Day 1–20
is *"Survival / Casual gear / Primitive guns"* in §18, and a `door_knight` on night two is not
that.

**8 — Swarm types thinned 40 %.** `baby_spider` (3–5 per spawn), `dread_hound` (3–5),
`corpse_fish` (3–5), `corpse_fly` (1–3), `firelight` (1–3), `mr_pumpkin` (1–3). These are the
entries whose `maxCount` multiplies them, so they dominate the entity budget out of proportion to
their weight. Wildlife Spec §18's reduction order — ambient → small critters → duplicate species →
common passives — is about the same failure mode from the other side.

**9 — Ice & Fire apex predators kept 500 blocks off world spawn**, and the ground-based ones
(`cyclops`, `hydra`, `dread_lich`, `dread_queen`, `gorgon`, `troll`, `deathworm`) held back to day
25. §9's threat hierarchy puts them one rung under the dragon; meeting a cyclops while still on
stone tools is not that hierarchy.

## Where the tier boundaries came from

Not from taste. Born in Chaos declares its own spawn weights in
`data/born_in_chaos_v1/forge/biome_modifier/*.json` inside its jar, and they sort the roster on
their own:

| Tier | Weight | Read as |
|---|---|---|
| Common | 15–30 | the mod's intended baseline — `decaying_zombie` 30, `zombie_fisherman` 30, `baby_skeleton` 25 |
| Mid | 8–16 | already uncommon by the mod's own hand — `bonescaller` 11, `door_knight` 13 |
| Elite | 1–8 | rare on purpose — `supreme_bonescaller` 1, `krampus` 2, `lifestealer` 3 |

Using the author's weights rather than a fresh judgement means the tiers agree with how the mod
was designed to feel, and it makes the boundary checkable by anyone who opens the jar.

## What is deliberately absent

**Dragon distance.** Main §10 is explicit:

> อย่าใช้ In Control เป็นวิธีหลักในการสร้าง/ลบ Dragon structures

Dragons are tied to roosts, dens and worldgen. Denying the spawn event leaves the structure
standing and empty, which is worse than not touching it. That work belongs to IceAndFire's own
config.

**`eventspawn`.** A rule using it was written and then removed: its exact semantics could not be
established from the bytecode without more digging than the rule was worth, and "dragons are never
Horde mobs" is enforced where it actually belongs — by not listing them in the Horde spawn tables.

**The other thirteen rule files.** `loot.json`, `experience.json`, `summonaid.json` and the rest
stay empty until something in the design asks for them.

## How to check this in game

```
/incontrol debug
/incontrol reload
```

`reload` re-reads the rule files without a restart, which makes iterating on density cheap. The
numbers above are **design targets, not measurements** — see
`Obsidian-minecraft-100day/measure-before-you-write-a-number.md`. The real check is a night spent
counting with MSPT on screen, and that needs a client.

**Verified so far:** the file parses and the server boots with no `incontrol` error line. That is
all a server boot can prove.
