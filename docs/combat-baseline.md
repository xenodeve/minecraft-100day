# Combat Baseline — the gun side

**§24 Phase 2's deliverable, as far as it can be produced without a client.**

Main §2 Rule 3 states the target in rifle rounds:

```text
Vanilla mob            2-4 rifle rounds
Common modded monster  8-20
Elite                  20-50
Large monster          50-150+
Dragon                 hundreds, or heavy weapons preferred
```

A band written in *rounds* carries two unknowns: what a round does, and what the target has.
**This file settles the first one completely.** Every number below is read out of the installed
gun pack's own `*_data.json` — not estimated, not recalled. The second stays open until someone
launches a client and shoots something, which is what §24 Phase 2 actually is.

## The finding that decides `DamageBaseMultiplier`

Rule 3's complaint is specific:

> ปืนไม่ควรรู้สึกเหมือน BB gun
> Vanilla Zombie ไม่ควรต้องใช้ Rifle 20 นัด

A vanilla zombie has 20 HP. At stock damage:

| Rifle | Damage | Rounds to kill a 20 HP zombie | Rule 3 band |
|---|---|---|---|
| `ak47` | 9 | **3** | in band |
| `m16a1` | 8 | **3** | in band |
| `m4a1` | 6.5 | **4** | in band |
| `hk416d` | 6.5 | **4** | in band |
| `scar_h` | 14 | **2** | in band |
| `sks_tactical` | 11 | **2** | in band |

**Every rifle in the pack already lands in Rule 3's 2–4 band against vanilla.** So
`DamageBaseMultiplier` stays at **1.0**. There is nothing here to correct, and moving it would
break the one band that can be checked without a client.

That is a result, not a deferral. What remains open is whether *modded* mob HP lands in the
other four bands — and that is a property of Born in Chaos and Ice & Fire, not of TaCZ.

## What Rule 3's bands imply about mob HP

Inverting the bands against the AK-47 (9 damage, the pack's representative 7.62×39) and the
M4A1 (6.5, the representative 5.56×45):

| Band | Rounds | Implied HP, AK-47 | Implied HP, M4A1 |
|---|---|---|---|
| Vanilla | 2–4 | 18–36 | 13–26 |
| Common modded | 8–20 | 72–180 | 52–130 |
| Elite | 20–50 | 180–450 | 130–325 |
| Large | 50–150 | 450–1350 | 325–975 |
| Dragon | 200–600 | 1800–5400 | 1300–3900 |

**This table is the measurement sheet.** Take it in-game, read each mob's health, and fill in
the right-hand column. Where a mob falls outside its intended band the fix is *that mob's own
config*, never `DamageBaseMultiplier` — a global multiplier cannot move one band without moving
all five.

Improved Mobs is already scaling the left edge: `1 + difficulty * 0.016 * 2.75`, capped at
2.5× (`config/improvedmobs/common.toml`, #21). A 20 HP zombie is 28.8 HP by day 100 and 37.6
by day 200, so an AK goes 3 → 4 → 5 rounds across a full playthrough. The band drifts by design.

## The arsenal, as installed

`Dmg` × `Pel` = `Burst`, which is the number that matters for a shotgun. `DPS` is sustained,
ignoring reload. `AI` is armour ignore (0–1). `HS` is the headshot multiplier.

| Tier | Gun | Type | Cartridge | Dmg | Pel | Burst | RPM | DPS | AI | HS | Mag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| T0 | `b93r` | pistol | 9mm | 7.5 | 1 | 7.5 | 900 | 112.5 | 0.2 | 1.25 | 20 |
| T0 | `cz75` | pistol | 9mm | 5 | 1 | 5 | 900 | 75.0 | 0.2 | 1.3 | 16 |
| T0 | `p320` | pistol | 45acp | 10 | 1 | 10 | 450 | 75.0 | 0.2 | 1.75 | 12 |
| T0 | `m1911` | pistol | 45acp | 11 | 1 | 11 | 350 | 64.2 | 0.2 | 1.5 | 7 |
| T0 | `glock_17` | pistol | 9mm | 6 | 1 | 6 | 400 | 40.0 | 0 | 1.5 | 17 |
| T0 | `m9a4` | pistol | 9mm | 6 | 1 | 6 | 400 | 40.0 | 0 | 1.5 | 17 |
| T0 | `rhino357` | pistol | 357mag | 10.5 | 1 | 10.5 | 200 | 35.0 | 0.3 | 1.75 | 6 |
| T0 | `lonetrail` | pistol | 30_06 | 21.5 | 1 | 21.5 | 90 | 32.2 | 0.4 | 1.75 | 1 |
| T0 | `taurus943` | pistol | 22wmr | 6 | 1 | 6 | 180 | 18.0 | 0.25 | 1.5 | 8 |
| T0 | `hk_mk23` | pistol | 45acp | 12 | 1 | 12 | 50 | 10.0 | 0.2 | 1.75 | 12 |
| T0 | `db_short` | shotgun | 12g | 24 | 16 | 384 | 150 | 960.0 | 0.33 | 1.25 | 2 |
| T0 | `db_long` | shotgun | 12g | 30 | 10 | 300 | 100 | 500.0 | 0.33 | 1.2 | 2 |
| T0 | `kar98` | sniper | 792x57 | 26 | 1 | 26 | 250 | 108.3 | 0.4 | 1.85 | 4 |
| T0 | `m700` | sniper | 30_06 | 24 | 1 | 24 | 180 | 72.0 | 0.5 | 2 | 5 |
| T0 | `springfield1873` | sniper | 45_70 | 35 | 1 | 35 | 90 | 52.5 | 0.25 | 1.5 | 1 |
| T1 | `deagle` | pistol | 50ae | 16 | 1 | 16 | 300 | 80.0 | 0.25 | 1.75 | 7 |
| T1 | `taurus500` | pistol | 500mag | 40 | 1 | 40 | 120 | 80.0 | 0.5 | 2 | 5 |
| T1 | `timeless50` | pistol | 50ae | 15 | 1 | 15 | 300 | 75.0 | 0.25 | 1.5 | 8 |
| T1 | `deagle_golden` | pistol | 357mag | 12 | 1 | 12 | 350 | 70.0 | 0.2 | 1.8 | 9 |
| T1 | `m16a1` | rifle | 556x45 | 8 | 1 | 8 | 750 | 100.0 | 0.25 | 1.5 | 20 |
| T1 | `sks_tactical` | rifle | 762x39 | 11 | 1 | 11 | 510 | 93.5 | 0.25 | 2 | 10 |
| T1 | `spas_12` | shotgun | 12g | 64 | 8 | 512 | 200 | 1706.7 | 0.25 | 1.33 | 5 |
| T1 | `m1014` | shotgun | 12g | 40 | 8 | 320 | 200 | 1066.7 | 0.25 | 1.33 | 6 |
| T1 | `m870` | shotgun | 12g | 36 | 9 | 324 | 180 | 972.0 | 0.25 | 1.33 | 5 |
| T1 | `vector45` | smg | 45acp | 7 | 1 | 7 | 1200 | 140.0 | 0.2 | 1.25 | 20 |
| T1 | `ump45` | smg | 45acp | 9 | 1 | 9 | 660 | 99.0 | 0.2 | 1.5 | 25 |
| T1 | `hk_mp5a5` | smg | 9mm | 6 | 1 | 6 | 820 | 82.0 | 0.15 | 1.25 | 30 |
| T1 | `p90` | smg | 57x28 | 5.5 | 1 | 5.5 | 810 | 74.2 | 0.7 | 1.25 | 50 |
| T1 | `uzi` | smg | 9mm | 6.5 | 1 | 6.5 | 600 | 65.0 | 0.15 | 1.25 | 20 |
| T2 | `spr15hb` | rifle | 556x45 | 10 | 1 | 10 | 700 | 116.7 | 0.3 | 1.75 | 15 |
| T2 | `hk416d` | rifle | 556x45 | 6.5 | 1 | 6.5 | 943 | 102.2 | 0.2 | 1.5 | 30 |
| T2 | `type_81` | rifle | 762x39 | 9 | 1 | 9 | 630 | 94.5 | 0.2 | 1.5 | 30 |
| T2 | `qbz_191` | rifle | 58x42 | 7.5 | 1 | 7.5 | 750 | 93.8 | 0.4 | 1.5 | 30 |
| T2 | `g36k` | rifle | 556x45 | 7 | 1 | 7 | 780 | 91.0 | 0.2 | 1.5 | 30 |
| T2 | `ak47` | rifle | 762x39 | 9 | 1 | 9 | 600 | 90.0 | 0.25 | 1.5 | 30 |
| T2 | `m4a1` | rifle | 556x45 | 6.5 | 1 | 6.5 | 810 | 87.8 | 0.2 | 1.5 | 30 |
| T2 | `aug` | rifle | 556x45 | 7 | 1 | 7 | 710 | 82.8 | 0.25 | 1.5 | 30 |
| T2 | `qbz_95` | rifle | 58x42 | 7.5 | 1 | 7.5 | 660 | 82.5 | 0.4 | 1.5 | 30 |
| T2 | `scar_l` | rifle | 556x45 | 7.5 | 1 | 7.5 | 650 | 81.2 | 0.25 | 1.75 | 30 |
| T2 | `m16a4` | rifle | 556x45 | 8 | 1 | 8 | 400 | 53.3 | 0.25 | 1.35 | 30 |
| T2 | `aa12` | shotgun | 12g | 30 | 10 | 300 | 350 | 1750.0 | 0.0 | 1.33 | 8 |
| T2 | `ai_awp` | sniper | 338 | 42 | 1 | 42 | 171 | 119.7 | 0.6 | 2 | 5 |
| T3 | `minigun` | mg | 308 | 8 | 1 | 8 | 1200 | 160.0 | 0.5 | 1.5 | 0 |
| T3 | `fn_evolys` | mg | 308 | 12 | 1 | 12 | 750 | 150.0 | 0.4 | 1.6 | 75 |
| T3 | `rpk` | mg | 762x39 | 10 | 1 | 10 | 630 | 105.0 | 0.3 | 1.5 | 40 |
| T3 | `m249` | mg | 556x45 | 7.5 | 1 | 7.5 | 750 | 93.8 | 0.3 | 1.5 | 75 |
| T3 | `scar_h` | rifle | 308 | 14 | 1 | 14 | 570 | 133.0 | 0.5 | 1.5 | 20 |
| T3 | `mk14` | rifle | 308 | 16 | 1 | 16 | 300 | 80.0 | 0.5 | 1.75 | 10 |
| T3 | `fn_fal` | rifle | 308 | 13 | 1 | 13 | 350 | 75.8 | 0.4 | 1.8 | 20 |
| T3 | `hk_g3` | rifle | 308 | 12 | 1 | 12 | 350 | 70.0 | 0.5 | 1.5 | 20 |
| T3 | `rpg7` | rpg | rpg_rocket | 20 | 1 | 20 | 150 | 50.0 | 0.0 | 1 | 1 |
| T3 | `m320` | rpg | 40mm | 10 | 1 | 10 | 150 | 25.0 | 0.0 | 1.0 | 1 |
| T3 | `m107` | sniper | 50bmg | 55 | 1 | 55 | 400 | 366.7 | 0.5 | 1.5 | 10 |
| T3 | `m95` | sniper | 50bmg | 75 | 1 | 75 | 151 | 188.8 | 0.75 | 2.5 | 5 |

Tiers are the crafting gates set in `kubejs/server_scripts/guns/gun_progression.js`:
**T0** field-expedient (iron, copper, wood) · **T1** Create workshop (andesite alloy) ·
**T2** industry (precision mechanism, brass) · **T3** heavy industry (steel, electron tubes).

## Rounds to kill, at a glance

Rows are reference weapons with their burst damage in brackets; columns are target HP.

| Gun | 20 | 30 | 40 | 60 | 100 | 150 | 250 | 400 | 800 | 1500 |
|---|---|---|---|---|---|---|---|---|---|---|
| `glock_17` (6) | 4 | 5 | 7 | 10 | 17 | 25 | 42 | 67 | 134 | 250 |
| `hk_mp5a5` (6) | 4 | 5 | 7 | 10 | 17 | 25 | 42 | 67 | 134 | 250 |
| `ak47` (9) | 3 | 4 | 5 | 7 | 12 | 17 | 28 | 45 | 89 | 167 |
| `m4a1` (6.5) | 4 | 5 | 7 | 10 | 16 | 24 | 39 | 62 | 124 | 231 |
| `scar_h` (14) | 2 | 3 | 3 | 5 | 8 | 11 | 18 | 29 | 58 | 108 |
| `m870` (324) | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 3 | 5 |
| `ai_awp` (42) | 1 | 1 | 1 | 2 | 3 | 4 | 6 | 10 | 20 | 36 |
| `m95` (75) | 1 | 1 | 1 | 1 | 2 | 2 | 4 | 6 | 11 | 20 |
| `m249` (7.5) | 3 | 4 | 6 | 8 | 14 | 20 | 34 | 54 | 107 | 200 |

## What this file does NOT establish

- **Any mob's actual HP.** Every band above is an implication, not an observation.
- **Effective damage.** Each gun has a `damage_adjust` falloff — the AK drops 9 → 7.5 past 30 m
  → 6 past 60 m — and armour reduces what lands. This table is point-blank, unarmoured.
- **Time to kill in seconds.** DPS assumes no reload, no recoil, and every shot hitting.
- **Whether the bands feel right.** That is the §24 Phase 2 test, and it needs a client.

Generated from the installed `tacz_default_gun` pack. Regenerate after any TaCZ update — these
are the mod's numbers, and they move when it does.
