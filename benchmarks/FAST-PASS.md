# Fast pass — one hour, two sessions, one answer

The full harness (`PERF-HARNESS-ORDER`) is five phases and a frozen world. This is the shortcut that
gets **which mod, which shader, which thread** from **two in-game sessions and no new tooling**,
using spark, which is already in the pack.

It does not replace the harness. It produces the first real attribution this repo has ever had, and
it tells you where the harness should aim.

---

## Before anything: the mistake that made the last profile useless

The profile taken on 2026-08-28 (`QoHXwezfza`) sampled **the Server thread and nothing else** —
confirmed from its own JSON: `threads: ['Server thread']`. The conclusion drawn from it, *"no mod is
above 2.1%, so the problem is the environment"*, is therefore a statement about **server tick cost
only**. It could not have seen a render-thread cost, and **the reported problem — FPS in a dense
area — is a render-thread question.**

**So: `--thread *`.** Without it you profile the wrong half of the game and the output looks
authoritative anyway.

---

## Session 1 — shaders OFF

The baseline `PERF-HARNESS-SETTINGS` requires, and it answers two open questions for free.

**Settings first, and write them down:** VSync **off**, FPS cap **unlimited**, shader pack **none**,
and leave render/simulation distance wherever they are — just record the numbers. Changing them now
would mean the two sessions measure different things.

**Stand at the exact spot where FPS drops.** Press F3, write down the coordinates and the FPS. That
spot is the benchmark for both sessions; approximate is worthless.

Then, in chat:

```
/spark profiler --thread * --timeout 60
```

Stand still and look at the same thing for the full 60 seconds. It prints a link when it finishes.

```
/spark health
```

**Hold a TaCZ gun for two minutes and keep playing normally.** With shaders off, `C9` predicts the
client does **not** die. If it crashes anyway, that hypothesis is dead and that is a result.

Quit the game. Do not delete the log.

## Session 2 — shaders ON

Same spot, same coordinates, same everything, one variable changed: enable the shader pack.

```
/spark profiler --thread * --timeout 60
/spark health
```

Note the FPS at the same spot. **Hold a gun again — and expect this one to crash** (`C9`: a vertex
buffer reaches 2 GB in about a minute). If it does not, that is also a result.

## Optional third — the stutter, not the average

If the complaint is hitching rather than low average FPS, this finds the cause the other two cannot:

```
/spark profiler --thread * --only-ticks-over 100 --timeout 120
```

It records only the ticks that took over 100 ms, so the output is entirely made of the worst moments.

---

## What to send back

- the two (or three) spark links
- `logs/latest.log` from each session
- the coordinates, and the render / simulation distance you recorded

## What comes out

```bash
node scripts/analyze/spark-profile.mjs <spark-code> --top 20
```

Per-thread, per-mod CPU share, from spark's own `classSources` map rather than a guess at package
names, plus the hottest class inside each top mod. It prints
`self-time reconstructs NNN% of the thread total` as its own correctness check — if that is not
~100%, the parse is wrong and the table is not to be trusted.

Two lines to read out of each `latest.log`, both free:

```bash
grep "OpenGL Renderer"   logs/latest.log    # must say RTX 4070 SUPER (C-UPFG-07)
grep "Flywheel Backend\|Flywheel backend"  logs/latest.log    # C10 / C12
```

`Flywheel Backend: flywheel:off` **with shaders off** would mean Colorwheel cannot help at all.
Anything else means the shader pack is the whole problem, and swapping it is free.

---

## What this pass can and cannot conclude

**Can:** which thread is saturated; which mods own measurable CPU on each; whether the shader costs
GPU time or render-thread time; whether Flywheel is running; whether `C9` reproduces.

**Cannot:** what any single one of the seven mods added in #129 is worth. That needs the
leave-one-out matrix in `PERF-HARNESS-LEAVEONEOUT`, which needs a frozen world and a run per mod.
A share in this table is CPU time on a thread, **not frames** — a mod at 3% of the server thread is
not 3% of the frame rate.
