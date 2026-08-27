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
| [0002](0002-operate-without-a-server-side-ci-tier.md) | Operate without a server-side CI tier | Infra | Accepted |
| [0003](0003-self-contained-single-file-distribution.md) | Self-contained single-file distribution | Infra | Accepted |
| [0004](0004-the-create-pin-closes-no-season-2-doors.md) | The Create 6.0.8 pin closes no Season 2 doors | Compatibility | Accepted |
| [0005](0005-thin-distribution-we-do-not-rehost-jars.md) | Thin distribution: we do not rehost other people's jars | Infra · Distribution | Accepted |
| [0006](0006-biomes-o-plenty-is-the-one-biome-expansion.md) | Biomes O' Plenty is the one biome expansion | Worldgen · Compatibility | Accepted |

## Conventions

- Filename: `NNNN-kebab-title.md`, zero-padded. **Numbers must be unique** across *all* branches.
- Body: title line, a status/context bullet block, then `## Context`, `## Decision`,
  `## Alternatives considered`, `## Consequences`.
- Ground every claim in the repo as it is **now**; cite `file:line`.
- Re-adding a mod listed under §6 *Mods Explicitly Rejected* in the handoff doc requires an
  ADR stating the **new** reason. A preference is not a new reason.
