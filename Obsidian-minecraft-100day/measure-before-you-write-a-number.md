---
name: measure-before-you-write-a-number
description: Every balance figure in this repo is a measurement or it is fiction — never carry a number forward from the design doc as if it were observed
type: feedback
---

The handoff doc is full of numbers: 2–4 rifle rounds for a vanilla mob, a ~20 HP day-one zombie
capped at 40–50 late, a 2000–2500 block dragon-safe radius, Horde tests at 50/100/150/200 mobs.
**Those are design targets, not measurements.** The doc says so itself for the worldgen figures:
*"ค่าจริงต้อง generate worlds หลาย seed แล้ววัด"*.

`docs/balance.md` and `docs/compatibility-matrix.md` are records of what was **observed**. A row
in either that was copied from a target rather than measured is worse than an empty row, because
the next agent will trust it and tune against a number nobody ever saw.

**Why:** a target that gets restated often enough starts reading as a fact. In a repo where the
only source of truth is a game session somebody actually ran, an unmeasured number can survive
indefinitely because nothing ever contradicts it.

**How to apply:** when writing a number into a doc, write next to it how it was obtained, or
write `not measured`. Both are acceptable; a bare number is not. Related:
[[config-and-kubejs-fail-open]].
