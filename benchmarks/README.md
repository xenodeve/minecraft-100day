# benchmarks/

Evidence **about** the pack, not part of it. `.packwizignore` excludes this whole directory — without
that line `packwiz refresh` would index `results.csv`, every scenario and every capture, and a friend
downloading the pack would receive our CapFrameX exports.

Governed by *Benchmark Harness: `PERF-HARNESS-*`*
(`docs/plan/Benchmark Plan — Performance Benchmark Harness.md`). Zone definitions and the A/B
recovery plan live in `docs/performance-benchmarks.md`; identity templates in
`docs/performance-baseline.md`.

## Status: nothing here is a measurement

No benchmark has been run. `captures/` is empty, `results.csv` has a header and no rows, and every
`scenarios/zone-*.json` says `NOT DEFINED — no world, no coordinates, never run`.

**That is the accurate state and it should stay accurate.** A scenario file with coordinates in it
but no world behind it is worse than an empty one, because the next person will believe it.

## Layout

```
benchmarks/
├─ README.md
├─ results.csv              one row per accepted run — the index, not the evidence
├─ scenarios/zone-a..h.json what each zone IS: world, coordinates, what to measure
└─ captures/
   └─ <date>/<commit>/<zone>/<variant>/
      ├─ metadata.json      stamped by scripts/build/new-benchmark-run.mjs
      ├─ capframex.csv      the frame capture
      ├─ spark-profile.txt  diagnostic runs only
      ├─ minecraft-profiler.zip
      └─ notes.md
```

Minimum for a final capture: `metadata.json`, the frame capture, `notes.md`. Diagnostic runs add
spark / JFR / F3+L.

## Starting a run

```bash
node scripts/build/new-benchmark-run.mjs \
  --zone A --variant baseline --date 2026-08-29 \
  --log "<instance>/logs/latest.log" --expect-gpu "RTX 4070 SUPER"
```

It fills in the commit, the pack version and the MODLIST roster digest — the three identity fields
most likely to be wrong when copied by hand — and prints every field still empty, because
`PERF-HARNESS-IDENTITY` says a run missing any of them is not comparable.

**It refuses a dirty working tree.** A commit hash does not describe a directory that has been edited
since, and `PERF-HARNESS-VARIANTS` requires every result to point at a commit.

**It refuses the wrong GPU** when `--expect-gpu` is given. `C-UPFG-07` was a client bound to an
RTX 5060 Ti on a x4 link while an RTX 4070 SUPER sat idle; the identity schema *records* the GPU,
which catches that after the run rather than before. That binding is fixed as of 2026-08-28 — the log
now reads `NVIDIA GeForce RTX 4070 SUPER/PCIe/SSE2` — and the check stays because it moved once.

## Two things to read out of the log on the first run

Both are free, both are open questions, and both are answered by the shaders-off baseline
`PERF-HARNESS-SETTINGS` already requires:

- **`C9`** — with shaders off and a TaCZ gun in hand for five minutes, does the client still die with
  `OutOfMemoryError: Failed to resize buffer from 2146435072`? If it does, that hypothesis is dead.
- **`C10` / `C12`** — what does `Flywheel Backend:` say? With shaders off it should not be
  `flywheel:off`. With shaders on it currently is, because Colorwheel reports the loaded pack
  unsupported.

## What is not here yet

No benchmark world. `PERF-HARNESS-DONE` needs **one frozen world** with fixed coordinates per zone
before any of this is comparable between runs, and building it is the first real task.
