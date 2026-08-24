---
name: create-version-is-the-pin
description: The Create major version decides the entire mod stack; do not pin any addon version before it is resolved
type: project
---

The pack targets Create as its technological backbone, and every Create addon in the CORE list
(Steam 'n' Rails, Create Big Cannons, CBC Firepower Components, Crafts & Additions, Diesel
Generators, New Age) links against the Create API, which breaks across major versions. The
handoff doc names Create 6.0.x as the target but explicitly refuses to lock it: *"ห้าม assume ว่า
Create addon ทุกตัวรองรับ Create 6.0.8 เพียงเพราะรองรับ Minecraft 1.20.1"*.

If any single CORE addon has no build for the chosen major version, the whole pack falls back —
there is no per-mod escape. Season 2 (Valkyrien Skies, Clockwork, TFMG) is downstream of the
same choice and narrows it further.

**Why:** pinning an addon before the ceiling is known produces a version set that looks resolved
and is not, and the failure surfaces as a startup crash several batches later, when the batch
that introduced it is no longer obvious.

**How to apply:** resolve the ceiling from actual CurseForge / Modrinth version data before any
`packwiz add`. Record it in `docs/compatibility-matrix.md` and, once chosen, as an ADR naming
which Season 2 doors the choice closes. See [[rejected-mods-are-a-boundary-not-a-backlog]] for
the shape of that record.
