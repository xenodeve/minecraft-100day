# Open Work Ledger — consolidated single source (2026-08-25)

> **Why this file exists:** open work is scattered across GitHub issues, ADRs, plans, and MD
> files. Agents read issues but often miss the MD. This ledger consolidates **everything still
> open** — GitHub-tracked **and** MD-only — into one place, deduped, with a phased plan.
> **Read this file at session start (it is linked from `CLAUDE.md`).** When you finish an item,
> update its row here AND its GitHub issue; when you discover new work, add a row here and (for
> anything non-trivial) file an issue so it doesn't vanish back into MD.

**Legend:** ✅ done, pending merge · 🟢 buildable now · 🟡 gated (needs merge / resource /
decision) · 🔴 **UNTRACKED** (MD-only, no GitHub issue — highest miss-risk)

**Current state, stated plainly:** the repo has its operating layer and its two design
documents. It has **no pack** — no `pack.toml`, no mods, no config, no KubeJS.

---

## Track 0 — Bootstrap remainder

| Item | Status | Gate | Next action |
|---|---|---|---|
| `docs/agents/issue-tracker.md` + `docs/agents/triage-labels.md` | 🔴 | `/setup-matt-pocock-skills` is user-invocation-only — an agent cannot write these | Developer runs `/setup-matt-pocock-skills` in this repo, then the T4 delta (Component / Type / Severity groups) is appended |
| Triage labels created on the GitHub repo | ✅ | — | 23 created, 2 already existed, 0 failed. `bug` renamed to `Bug` to match the vocabulary |
| `git config core.hooksPath .githooks` on this clone | 🔴 | developer action, per-clone by design | Run it once; verify with `git config --get core.hooksPath` |
| `T4 main gate` ruleset — PR-only, no force-push, no deletion | ✅ | — | Active. Direct pushes to `main` are blocked |
| `lint` / `test` / `guards` as **required status checks** | 🟡 | **#1** — GitHub Actions is billing-locked, so no check can ever report | Resolve the billing lock, confirm a green run, then add the three contexts to the ruleset |

## Track 1 — Blocking technical unknown

| Item | Status | Gate | Next action |
|---|---|---|---|
| **Which Create major version the pack targets — 6.0.x or 0.5.1.f** | 🔴 | nothing else can be pinned until this resolves | Build `docs/compatibility-matrix.md` from actual CurseForge / Modrinth version data for Create + Steam 'n' Rails + CBC + CBC Firepower + Crafts & Additions + Diesel Generators; the lowest common ceiling decides |
| Season 2 viability under the chosen Create version (VS2 / Clockwork / TFMG / Warium) | 🔴 | downstream of the row above | Record which door the Create choice closes, as an ADR — not as a surprise found in Season 2 |
| `packwiz` not installed on the dev machine | 🔴 | blocks `pack.toml`, and therefore the CI `build` job (ADR 0001) | Install packwiz; then `packwiz init` for MC 1.20.1 / Forge |
| `java` not on PATH | 🔴 | blocks every boot test (§26); does not block bootstrap | Install a Java 17 JDK and confirm the launcher points at it |

## Track 2 — Pack construction (handoff doc §24, in order)

Not startable until Track 1 resolves. Listed so they are visible, not so they are picked up.

| Item | Status | Gate | Next action |
|---|---|---|---|
| Phase 0 — repository bootstrap + packwiz init + the five `docs/` files | 🔴 | packwiz | §32 Task 1–3 |
| Phase 1 — Create baseline batch, one mod at a time | 🔴 | Create version decision | §24 Phase 1 |
| Phase 2 — combat baseline + `docs/combat-baseline.md` TTK matrix | 🔴 | Phase 1 green | §24 Phase 2 |
| Phases 3–13 | 🔴 | strictly sequential | see §24 |

## Track 3 — Addon Spec (Crafting Assistance + Tactical Tracker)

Source: `docs/Addon Spec — Crafting Assistance + Tactical Tracker.md`. Seven mods on top of the
main pack. Not yet folded into the §24 phase list — where each lands is itself an open question.

| Item | Status | Gate | Next action |
|---|---|---|---|
| JEI + Jade + Jade Addons + Crafting Tweaks + Mouse Tweaks + Polymorph | 🔴 | main pack must boot first | Decide which §24 phase each belongs to; they are QoL, so they follow the systems they describe |
| Player Microchip re-themed as the tactical tracker | 🔴 | needs the Curios + radio layers to exist | Addon Spec §17–29; the re-theme is a resource-pack + KubeJS job, not a fork |
| Hide disabled content from JEI | 🔴 | needs KubeJS + a decided mod list | Addon Spec §6 — must stay in sync with every mod removal |

---

## Management Plan — phased execution order

**Phase 0 — Unblock the tooling.** Resolve the GitHub Actions billing lock (**#1**), install
`packwiz` and a Java 17 JDK, run `git config core.hooksPath .githooks`, and run
`/setup-matt-pocock-skills`. Five small actions, and most of Track 0 plus two rows in Track 1
depend on them. Only #1 needs money; the rest are minutes.

**Phase 1 — Tracking hygiene.** File a GitHub issue for every remaining 🔴 row above, so the
ledger stops being the only record. The triage label vocabulary is already installed.

**Phase 2 — Resolve the Create version.** This is the multiplier. Every mod pin, every KubeJS
recipe, and the entire Season 2 branch are downstream of it, and it is answerable today with
research alone — no game launch required.

**Phase 3 onward — the §24 phase list**, one phase per epic, one PRD per phase.

**Gating summary:** Phase 2 is the multiplier and it is *not* blocked by Phase 0 — the version
sweep needs only network access. Phase 0 and Phase 2 can run in parallel; everything after
Phase 2 is strictly sequential, because §26 forbids adding a second mod batch before the first
is confirmed working.
