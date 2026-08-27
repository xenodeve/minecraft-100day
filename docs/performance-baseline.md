# Performance baseline

**Required by** *Performance Spec: `PERF-DOCS`*. Filled by *Performance Spec: `PERF-PRIORITY`*
item 2.

---

## Status: no baseline exists

Every table in this file is empty, and that is the accurate state rather than an oversight.

**Nobody has played this pack.** A client was launched on 2026-08-27 and reaches the main menu
(#84, #86); nothing past that has been exercised. A dedicated server has booted eighteen times,
which proves configs parse and registries build — it produces **no** FPS, no frame time, no MSPT
under load and no memory curve.

`PERF-PRIORITY` items 3–10 are all gated on this file having numbers in it. Until then, adding an
optimiser produces a change nobody can evaluate, which is the failure `PERF-METHOD-ONEVAR` names.

---

## How to fill this in

`PERF-BENCH-RULES` requires that a run record all of the following. **Do not compare from memory.**
A run missing any field is not comparable to another run and should be discarded rather than
half-trusted.

### Run identity

| Field | Value |
|---|---|
| Date | |
| Commit (`git rev-parse --short HEAD`) | |
| Pack version (`pack-version.txt`) | |
| Mod list (`docs/MODLIST.md` digest) | |
| Config state — fresh or reused | |
| Client or server role | |

> **Fresh vs reused `config/` is load-bearing here, not bookkeeping.** A fresh-config boot logs
> **50 ERROR lines**; a boot reusing `config/` logs **4**, because Improved Mobs skips rebuilding
> `equipment.json`. Comparing one against the other reads as a 92% improvement that did not happen.
> Recorded in `docs/compatibility-matrix.md`.

### World identity

| Field | Value |
|---|---|
| Seed | |
| Coordinates | |
| Benchmark zone (`PERF-BENCH-ZONES` A–H) | |
| Entity count at the sample | |
| Render distance | |
| Simulation distance | |

### Machine identity

| Field | Value |
|---|---|
| CPU | |
| GPU + driver version | |
| RAM allocated to the JVM | |
| Java args | |
| Java runtime | |

---

## Client baseline

`PERF-DOD-CLIENT` judges against these. **Frame-time stability and 1% lows matter more than peak
FPS** — a run that records only an average has not produced a baseline.

| Metric | Value | Notes |
|---|---|---|
| Average FPS | | |
| **1% low** | | the number that decides `PERF-DOD-CLIENT` |
| Frame time (ms, median) | | |
| Frame time (ms, 99th) | | |
| CPU utilisation | | |
| GPU utilisation | | |
| RAM (heap used) | | |
| VRAM | | |

**Known cost carried into any client baseline:** Oculus sets three Embeddium mixins to `false`
whether or not a shaderpack is selected (`PERF-RENDER-OCULUS`). A baseline taken with Oculus present
is not the same as one taken without it. Record which, or the number cannot answer what Oculus
costs. See `docs/performance-conflicts.md`.

---

## Server baseline

`PERF-DOD-SERVER` judges against these.

| Metric | Value | Notes |
|---|---|---|
| TPS | | target 20 |
| MSPT (median) | | |
| MSPT (95th percentile) | | |
| Entity tick time | | |
| Chunk generation time | | |
| Pathfinding cost | | the TaCZ / Attract to Sound risk, `PERF-BENCH-TACZ` |
| Memory (heap used) | | |
| GC frequency and pause | | |

---

## Rig traps that invalidate a run

All four have cost a boot in this project. They are in `docs/compatibility-matrix.md` and repeated
here because each one produces a plausible wrong number rather than an error.

1. **A stale java process holds `session.lock`** → `DirectoryLock` `IOException` that reads like a
   corrupt save. `pkill -f` does not match them; `Get-Process java | Stop-Process -Force` does.
2. **A stale java process holds the port** → `FAILED TO BIND TO PORT`, which reads like a firewall
   problem.
3. **`run.sh` is the Unix launcher.** On Windows use `win_args.txt`, or the JVM dies with an
   `InvalidPathException` naming no mod.
4. **The test world directory is `boottest`, not `world`.** Deleting `world/` matches nothing, and
   every boot silently reuses a world built under an older mod list.

## Evidence collection

After a client run:

```
pwsh scripts/collect-client-evidence.ps1
```

which bundles `latest.log`, crash reports, the installed mod list, a config inventory and an
extracted error list into one zip.
