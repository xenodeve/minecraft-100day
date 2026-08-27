# Performance benchmarks

**Required by** *Performance Spec: `PERF-DOCS`*. The zones are defined in `PERF-BENCH-ZONES`, the
recording rules in `PERF-BENCH-RULES`, and the method in `PERF-METHOD-ONEVAR`.

Read `docs/performance-baseline.md` first. **A benchmark without a baseline is a number, not a
measurement.**

---

## Status: no run has been performed

Every table below is empty. That is the state, not an omission — see the baseline file for why.

---

## The rule this file exists to enforce

```text
Baseline → + one mod → measure → keep or revert
```

Not:

```text
+ 8 optimization mods → performance changes → nobody knows which mod caused it
```

Each run gets its own row. A row records **one** changed variable. If two things changed, the row is
void — write two rows or discard the run.

## Run log

| # | Date | Commit | Zone | One variable changed | Client 1% low | Server MSPT p95 | Verdict |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

`Verdict` is `keep`, `revert`, or `inconclusive`. **`inconclusive` is a legal and common answer** —
a run that cannot separate the variable from noise has not shown anything, and recording it as a
`keep` is how an unmeasured change acquires a false provenance.

---

# Zone A — Empty baseline

Low-entity area, no factory, no colony. This is the control every other zone is read against.

| Date | Commit | Variable | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

# Zone B — Create factory

Small / medium / large. Measure kinetic networks, contraptions, items and processing.

> Operational rule from `PERF-BENCH-ZONES`: stop factories when storage is full where practical,
> using Threshold Switches, Clutches and control logic. A factory left running against a full buffer
> measures the absence of that rule, not the pack.

| Date | Commit | Factory size | Kinetic networks | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

# Zone C — MineColonies

| Date | Commit | NPCs | Pathfinding cost | Avg FPS | 1% low | MSPT | Memory | Notes |
|---|---|---|---|---|---|---|---|---|
| | | 10 | | | | | | |
| | | 25 | | | | | | |
| | | 50 | | | | | | |
| | | 75 | | | | | | |

`PERF-DOD-SERVER` requires that MineColonies scaling be *documented*, which means this table having
four filled rows — not a claim that it scales.

# Zone D — Horde arena

**The primary stress benchmark** (`PERF-BENCH-ZONES`).

Scenarios: idle · moving · attacking walls · automatic gunfire · rain · particles.

| Date | Commit | Mobs | Scenario | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|---|
| | | 50 | | | | | |
| | | 100 | | | | | |
| | | 150 | | | | | |
| | | 200 | | | | | |

**200 is where `hordeSpawnMax` binds.** `config/hordes-common.toml` caps the horde at 200 and the
growth curve reaches it around day 240, so the top row is a real ceiling rather than a hypothetical.
That cap is marked PROVISIONAL in the config: **if 200 does not hold on the target machine, that is
the number that comes down.**

# Zone E — Wildlife

| Date | Commit | Entities | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|
| | | 25 | | | | |
| | | 50 | | | | |
| | | 100 | | | | |

`PERF-BUDGET-ENTITY` cuts here first if the server is overloaded — ambient decorative wildlife, then
small critters, then duplicate species.

# Zone F — Dragon

Single dragon plus combat, terrain and particles.

| Date | Commit | Dragon type | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

Cross-check `PERF-SERVER-SERVERCORE`'s critical exclusions: a dragon must not freeze when a player
steps 70 blocks away.

# Zone G — Create train

Fast travel through multiple chunks, biomes and stations.

| Date | Commit | Route length | Chunk gen time | Frame-time spikes | MSPT | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

# Zone H — Season 2 vehicles

Valkyrien / Clockwork / Warium. **After Alpha only**, benchmarked separately.

| Date | Commit | System | Avg FPS | 1% low | MSPT | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

---

# TaCZ / sound-AI stress test — `PERF-BENCH-TACZ`

The named risk:

```text
gunfire
→ many mobs react
→ many path searches
→ MSPT spike
```

Profile Attract to Sound **before** rate-limiting it or writing a custom integration.

| Date | Commit | Fire mode | Players firing | MSPT | Frame time | Path searches | Notes |
|---|---|---|---|---|---|---|---|
| | | semi-auto | | | | | |
| | | burst | | | | | |
| | | full-auto | | | | | |
| | | multiple players | | | | | |

This table is also the gate on `PERF-TACZ-ACCELERATED`. Its promotion path requires the same
scenario measured twice — without the mod, then with it — and promotion only on a result that is
both measurable and compatible.

---

# Long-session runs — `PERF-BENCH-LONGSESSION`

| Date | Commit | Duration | RAM start | RAM end | GC freq | FPS drift | MSPT drift | Entities accumulated | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| | | 30 min | | | | | | | |
| | | 2 h | | | | | | | |
| | | 4 h | | | | | | | |

RAM allocation is itself a variable: test 8 / 10 / 12 GB and choose **the smallest stable
allocation**, because an oversized heap can worsen GC pause behaviour.

---

# Worldgen tournament — `PERF-WORLD-TOURNAMENT`

| Date | Commit | Worldgen set | Chunk gen time | Train stutter | RAM | MSPT | World size | Notes |
|---|---|---|---|---|---|---|---|---|
| | | Base | | | | | | |
| | | Biomes O' Plenty | | | | | | |
| | | Regions Unexplored | | | | | | |
| | | Both | | | | | | |

**ADR 0006 chose Biomes O' Plenty on quality, explicitly not on performance.** The performance half
of that comparison has never been run, so this table is not a re-litigation of the decision — it is
the half of it that is still missing.
