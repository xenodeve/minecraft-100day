---
name: spark-profiles-lie-twice
description: A spark profile answers only for the threads it sampled, and its JSON is a flat node pool that double-counts if summed naively — both mistakes were made here and both produced confident wrong numbers
type: feedback
---

Two independent traps, both hit in one session (#135), both of which produced a number that looked
authoritative and was not.

**It only knows the threads it sampled.** `/spark profiler` with no `--thread` argument samples the
**server thread alone**. The profile `QoHXwezfza` contains exactly one thread, and the conclusion
drawn from it — *"no mod is above 2.1%, so the problem is the environment"* — was then applied to an
**FPS** complaint, which is a render-thread question. The profile was not wrong. It was asked
something it had never looked at.

> Always `--thread *`. A profile that did not sample the thread you are asking about cannot exonerate
> anything on it.

**Its JSON double-counts if you sum it.** `thread.children` is a **flat pool** of every node in the
tree; each node's `childrenRefs` are **indices into that pool**, and `node.time` is always `0` — the
real values live in `node.times`, one per time window. Summing every node therefore counts the whole
tree once per level: on that profile, 49,908 samples against a real total of 1,896, and percentages
over 2000%.

The correct reading is **self time**: a node's own total minus the totals of its children, attributed
via spark's `classSources` map, which already records which mod owns which class — so nothing has to
guess from package names.

> The check that catches it: the self times must reconstruct the thread total. If they do not sum to
> ~100%, the parse is wrong. `scripts/analyze/spark-profile.mjs` prints that percentage on every run
> for exactly this reason.

**What generalises past spark.** Both failures share a shape with
[[measure-before-you-write-a-number]]: the output was well-formed, plausible and confidently
formatted, and nothing in it announced that it was answering a different question than the one asked.
The defence is not care — it is a control case. Every parser written here is now pointed at an
artifact whose answer is already known before it is trusted on one whose answer is not.
