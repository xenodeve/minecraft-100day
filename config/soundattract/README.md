# `config/soundattract/` — the noise ladder

**Not shipped to players** (`.packwizignore` excludes `*.md`). Two of the mod's nine files are
pack-controlled; the other seven are left exactly as generated.

| File | Owned by | Why |
|---|---|---|
| `guns.toml` | **pack** | The §3.3 noise ladder lives here |
| `raid.toml` | **pack** | One flag would break a named design rule |
| `general.toml` `stealth.toml` `scent.toml` `pathfinding.toml` `performance.toml` `integration.toml` `voice.toml` | mod | Nothing in the design asks for a change, and see *Performance* below |

## The finding that made this batch worth doing

`taczGunShootDecibels` is not decibels. It is **the attraction radius in blocks**.

`TaczIntegration.calculateShootRangeWeight` decompiles to exactly two lines of arithmetic:

```
range  = Math.max(0.0, configuredValue - muzzleAttachmentReduction)
weight = range / 10.0
```

There is no dB curve, no logarithm, no distance model — the number is passed straight through.
`server-rules.toml` corroborates it from the other end: its `[safety] maxClientSoundRange` is
documented as *"the final resolved range (blocks)"* and carries the same `1.0 ~ 256.0` bound as
`taczShootRange`.

So the stock table was setting every gun in the game to a **155–180 block** attraction radius. Two
consequences, both invisible until you look:

- **The ladder did not exist.** Pistol 157, rifle 159, shotgun 165, HMG 165. A 5 % spread across
  the entire arsenal is not `suppressed pistol < pistol < rifle < shotgun < HMG < cannon`; it is
  one sound with cosmetic variation.
- **Most of it was wasted anyway.** A dedicated server's default simulation distance is 10 chunks
  — 160 blocks. Mobs past that are not ticking, so a 180-block radius and a 160-block radius are
  the same radius.

Had the numbers been read as decibels, the natural "fix" would have been to spread them 120–190,
which changes nothing and looks like a balance pass.

## The ladder is built on calibre, not on taste

Each gun's cartridge comes from its own `*_data.json` `"ammo"` field in the installed gun pack.
Two guns firing the same cartridge get the same number. A belt-fed machine gun gets +16 over its
cartridge, for sustained fire.

| Blocks | What |
|---|---|
| 28 | .22 WMR |
| 40 / 44 | 9mm / .45 ACP, pistol |
| 52 / 56 | 9mm · 5.7×28 / .45 ACP, submachine gun |
| 60 / 68 / 76 | .357 Magnum / .50 AE / .500 Magnum |
| 80 | 5.56×45 · 5.8×42 |
| 88 | 7.62×39 |
| 96 / 104 | 5.56 · 7.62×39 belt-fed |
| 100 / 104 | .45-70 / .308 · .30-06 · 7.92×57 |
| 112 | 12 gauge |
| 120 | .338 Lapua · .308 belt-fed |
| 144 | .50 BMG |
| 160 | minigun |
| 176 | 40mm · RPG |

The design's ordering holds on the representative cases: **suppressed pistol 8 < pistol 40 <
rifle 88 < shotgun 112 < HMG 120 < cannon 176.**

Using the cartridge rather than a judgement call means the table is checkable — anyone can open
`ak47_data.json`, see `tacz:762x39`, and find 88 here. It also means a gun pack added later
classifies itself.

**The absolute values are provisional and §11 says so:** *"อย่า hardcode radius ก่อน benchmark
gameplay"*. The **ordering** is a design requirement and is settled. The **numbers** are anchored
to Minecraft's 128-block simulation baseline and stay open until §24 Phase 4 measures them in a
real firefight. See `Obsidian-minecraft-100day/measure-before-you-write-a-number.md`.

## Suppressors, and five attachments the stock config forgot

Every silencer is `32.0`. That is what makes the ladder's first rung real: a suppressed 9mm pistol
lands at **8 blocks** — quieter than a sprinting player, who generates 16 — while a suppressed
.308 is still 72 and will not save anyone.

The stock list named eleven muzzle attachments. The installed gun pack ships **sixteen**. The five
it missed —

```
muzzle_silencer_sg        muzzle_silencer_wraith
muzzle_brake_mastiff_sg   muzzle_brake_timeless50
muzzle_choke_sg
```

— fell through to `taczAttachmentReductionDefault = 20.0`. So a shotgun **choke**, which shapes a
pattern and does nothing to noise, was quieting the gun by 20 blocks, and two genuine silencers
were getting *less* suppression than the ones that made the list. All five are named now.

`taczAttachmentReductionDefault` is set to **0.0**, not 20.0. An attachment nobody has classified
should be neutral. At 20.0, a TaCZ gun pack installed next year silently makes every gun it ships
20 blocks quieter — a balance change arriving through a mod update, which is precisely what
Distribution Spec §30's ownership map exists to prevent.

Brakes and compensators are **negative** (louder). They redirect propellant gas sideways, toward
everyone who is not holding the gun.

## `raid.toml` — one flag, one design rule

Main §3.3:

> Gunfire should generally attract **existing mobs**
> ไม่ควร magically spawn mobs ทุกครั้งที่ยิง

`[raid.reinforcements] enableRaidReinforcements` is the only setting in the pack that would break
that. It is **already** `false` by default, and it is pinned here anyway — because a default is a
promise the mod author can revoke in a patch release, and this mod has already deprecated four
config keys in the version we run.

## Performance — the addon §11 asks about is not needed

§11 raises a real risk and then names a mitigation:

> หากทุก bullet trigger expensive mob search อาจทำลาย MSPT
> ถ้า mod ไม่มี built-in rate limit: consider compatibility addon/event coalescing

**It has one, and more than one.** `performance.toml` and `general.toml` already ship:

- `scanCooldownTicks = 25` — a mob rescans at most every 1.25 s, not every bullet
- `cooldownTicksPerMob = 0.15` — the cooldown grows with the crowd, so a horde self-throttles
- `minTpsForScanCooldown = 15` / `maxTpsForScanCooldown = 19` — TPS-adaptive backoff
- `enableTieredStealthPerformance` — four degradation tiers down to vanilla behaviour at 15 TPS
- `skipSoundScanWhenHasTarget = true` — documented as *"dramatically reduces lag when mobs chase a
  player who fires a gun"*, which is the exact scenario §11 describes
- `maxMufflingRaycastsPerTick = 50`, `losBatchBudgetPerTick = 64` — hard per-tick ceilings
- `raidLeaderOnlySoundScan`, `raidFollowerInheritTarget` — one scanner per group during a raid

So no coalescing addon, and no change to `performance.toml`. §11's condition — *"ถ้า mod ไม่มี
built-in rate limit"* — is false. **This is a reading of the config, not a measurement**; the MSPT
number still has to come from §24 Phase 4 with automatic fire running.

## What is deliberately absent

**`stealth.toml` and `scent.toml`.** Both are large, both are interesting, and neither is named by
the design documents. Touching them would be inventing requirements.

**The Point Blank block in `guns.toml`.** Point Blank is not in this pack. Its sixty dead gun
entries were emptied so the file reads as the design artifact it is, and the block is otherwise
left as generated so a future update can rewrite it freely.

**The `suffuse:` entries.** Sixty of the stock table's entries were for the `suffuse` namespace,
which no mod in this pack registers. Removed for the same reason.

## How to check this in game

Set `debugLogging = true` in `general.toml` and fire. The mod logs

```
[TaczIntegration] Shot: range={}, weight={}
```

per shot, which is the direct readout of the two lines above. An AK-47 must print `range=88.0,
weight=8.8`, and the same gun with a `muzzle_silencer_vulture` must print `range=56.0`.

**Verified so far:** the files parse and the server boots with no `soundattract` error line. Every
range in the table is a **design target**, not an observation.
