# Architecture Decision Records

Each ADR captures one significant, hard-to-reverse decision: its context, what was chosen,
the alternatives rejected, and the consequences. They document decisions **already in the
repo** (unless marked *pending*), so a new maintainer — human or agent — can recover the
*why* without re-deriving it. A decision that overturns an earlier one marks the old ADR
**Superseded**.

For this pack specifically, an ADR is the right record when a decision **narrows the design
space** — locking a Create major version, rejecting a mod, changing what a required check
means, choosing how a subsystem is tuned. Balance numbers are *not* ADRs; they are
measurements and live in `docs/balance.md`.

| # | Title | Area | Status |
|---|-------|------|--------|
| [0001](0001-ci-gate-scoped-to-modpack-reality.md) | CI gate scoped to what a modpack repo can actually check | Infra | Accepted |

## Conventions

- Filename: `NNNN-kebab-title.md`, zero-padded. **Numbers must be unique** across *all* branches.
- Body: title line, a status/context bullet block, then `## Context`, `## Decision`,
  `## Alternatives considered`, `## Consequences`.
- Ground every claim in the repo as it is **now**; cite `file:line`.
- Re-adding a mod listed under §6 *Mods Explicitly Rejected* in the handoff doc requires an
  ADR stating the **new** reason. A preference is not a new reason.
