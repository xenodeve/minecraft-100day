# DONE — Agent Session Log

> Newest entry on top. One dated `##` heading per shipped unit so an agent can jump to one.
> When this crosses ~a few hundred lines or a phase closes, move older entries to
> `DONE-archive-<period>.md` and leave a redirect line here.

---

## Switched to the two-tier enforcement mode (2026-08-25, `/t4-project-bootstrap` follow-up, branch `chore/1-operate-without-ci`)

**Goal:** the billing lock on GitHub Actions cannot be resolved, so stop treating the missing CI
tier as a pending task and decide how the repo behaves permanently without it.

**Shipped:**
- **ADR 0002** — operate without a server-side CI tier. Records why the upstream skill's literal
  fallback (`"requireGreenCI": true`) would break this repo rather than help it, and why a
  self-hosted runner was rejected on security grounds rather than convenience.
- **`T4 verify` workflow disabled** (`gh workflow disable 341588663` → `disabled_manually`). File
  kept, correct and ready; re-enabling is one command.
- **Guards promoted to the load-bearing tier** — `git config core.hooksPath .githooks` enabled on
  this clone. It is now the only tier binding anything other than Claude's own tool calls.
- **ADR 0001 corrected** — its postscript claimed the third tier was "pending". It was not.
- `CLAUDE.md`, `docs/agents/issue-tracker.md`, `docs/OPEN-WORK-LEDGER.md` (Track 0 closed, new ⛔
  legend entry), and a memory note `ci-tier-is-absent-by-decision`.

**Validation:** `node scripts/validate/verify.mjs` → passed. `gh workflow list --all` →
`T4 verify  disabled_manually`. `git config --get core.hooksPath` → `.githooks`. The pre-push
guards ran for real on the push of this branch — first time they have been live.

**The honest cost, recorded because it is easy to lose:** a human merging on the GitHub web UI now
runs nothing at all. The ruleset still forces a PR; nothing inspects its contents. Merge from the
CLI, where `t4-gate` runs `verify` first.

**Report:** `docs/adr/0002-operate-without-a-server-side-ci-tier.md`.

**Next:** ledger Phase 0 is down to two installs — `packwiz` and a Java 17 JDK — and Phase 2, the
Create version sweep, which needs neither.

---

## docs/agents layer completed + third design doc folded in (2026-08-25, `/setup-matt-pocock-skills`, branch `chore/3-land-agents-docs-layer`)

**Goal:** close the one hole the bootstrap could not fill itself, and stop the operating layer
from being silently out of date the moment a new design document lands.

**Shipped (#3 — the pocock hand-off):**
- `docs/agents/issue-tracker.md` — GitHub conventions, the `gh` full path (it is not on PATH),
  the bilingual-body rule, the merge gate's real state, and `/wayfinder` operations.
- `docs/agents/triage-labels.md` — the five canonical roles (identity mapping) plus this repo's
  Component / Type / Severity / Lifecycle groups, and what each Component owns.
- `docs/agents/reading-domain-docs.md` — pocock's consumer rules, at a path that does not
  destroy the glossary. The collision is upstream as `xeno-skills#334`.
- `CLAUDE.md` — an `## Agent skills` block pointing at all three.

**Shipped (#4 — Natural Wildlife & Ecology):**
- `docs/agents/domain.md` — seven new terms: Natural/Anomalous world, Spawn Budget, Entity
  Density Priority, Duplicate Species Audit, Wildlife Roster, Survival tax, W-phase. Both
  language halves.
- `CLAUDE.md` — the two addon specs now have a citation convention (*Crafting Spec §N* /
  *Wildlife Spec W3*) because three documents with independent `§N` numbering were about to
  make every reference ambiguous.
- `docs/OPEN-WORK-LEDGER.md` — Track 4 (W0–W9), Track 0 reconciled, and Phase 2 rescoped to
  sweep all three documents in one pass rather than three.

**Validation:** `node scripts/validate/verify.mjs` → passed. Not verified: nothing here can be —
no mod was installed and no world was launched. Every claim in these files is about the repo, not
about the pack.

**Report:** none warranted — no bug fixed, no architectural decision reversed. ADR 0001 stands.

**Next:** unchanged — ledger Phase 0 and Phase 2.

---

## T4 operating layer bootstrapped (2026-08-25, `/t4-project-bootstrap`, branch `main`)

**Goal:** turn a directory holding one design document into an agent-primary repo — one where a
fresh session recovers state from files rather than from the developer's memory, and where the
checkable rules are enforced by machines rather than by discipline.

**Shipped (Seed tier):**
- `.claude/hooks/` + `.claude/t4.json` + `.claude/settings.json` — session-start `using-t4`
  injection, per-turn rails reminder, `PreToolUse` gate (blocks `gh pr create` with no issue,
  blocks dangerous git, runs `verify` before `gh pr merge`).
- `.githooks/` — `pre-push` running `check-issue-ref`, `check-tree-budget`, `check-gate-ledger`.
  Agent-agnostic tier; binds any agent or human on this clone. **Opt-in: not yet enabled** —
  see the ledger.
- `.github/workflows/t4-verify.yml` — `lint` / `test` / `guards`. Scoped per ADR 0001.
- `scripts/validate/verify.mjs` — JSON + TOML + placeholder lint, `node --check` over KubeJS.
- `docs/agents/{workflow,domain}.md`, `docs/adr/README.md` + ADR 0001, `docs/OPEN-WORK-LEDGER.md`,
  `DONE.md`, `Obsidian-minecraft-100day/` vault, `CLAUDE.md`, `.gitignore`.

**Validation:** `node scripts/validate/verify.mjs` → passed. Verified *by observation*, not by
assumption, that the script actually fails: the first run exited 1 on two unfilled ORG and
DIST_DIR placeholders left in the upstream CI template, which is what prompted rewriting that
workflow for this repo. Stripped `using-t4.snapshot.md` measured at 8609 B against the 9000 B
injection budget.

(The token names above are written without their angle brackets on purpose — spelling them
literally would trip the placeholder check this very entry is describing.)

**Not done, deliberately:** `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md`.
`/setup-matt-pocock-skills` owns them and refuses model invocation
(`disable-model-invocation`), and its refusal text forbids reproducing its workflow by other
means. Left absent rather than written wrong. Tracked in the ledger, Track 0.

**Report:** `docs/adr/0001-ci-gate-scoped-to-modpack-reality.md`.

**Remote state:** `xenodeve/minecraft-100day` (public). 23 triage labels created, 2 already
existed (`wontfix`, and GitHub's default `bug`, renamed to `Bug`), 0 failed. Ruleset
`T4 main gate` active — PR-only, no force-push, no deletion, unresolved threads block merge.
Secret scanning and push protection enabled; Dependabot alerts and security PRs enabled.
`secret_scanning_validity_checks` and `secret_scanning_non_provider_patterns` were **not**
enabled — the API accepts the PATCH, returns 200, and leaves both `disabled`.

**Blocked:** GitHub Actions is billing-locked on the account, so `T4 verify` cannot run and the
three checks are not required by the ruleset. Filed as #1 with the reasoning for omitting them
rather than adding checks that would deadlock every PR.

**Next:** ledger Phase 0 — resolve #1, install packwiz + Java 17, enable `core.hooksPath`, run
`/setup-matt-pocock-skills` — and Phase 2 (resolve the Create major version), which is not
blocked by any of them.

---
