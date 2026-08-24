---
name: ci-tier-is-absent-by-decision
description: The disabled T4 verify workflow is a decision, not a broken setup — do not re-enable it, do not set requireGreenCI, do not add required status checks
type: project
---

`.github/workflows/t4-verify.yml` exists, is correct, and is **disabled**
(`disabled_manually`, id `341588663`). GitHub Actions is billing-locked on the `xenodeve` account
and that cannot be resolved, so every run would fail with *"The job was not started because your
account is locked due to a billing issue"* without executing a step.

The repo therefore runs **two enforcement tiers, not three** — `t4-gate` (Claude's tool calls) and
`.githooks/pre-push` (everything on this clone). Decided in
`docs/adr/0002-operate-without-a-server-side-ci-tier.md`.

**Why:** a workflow file that looks active plus a red checks column reads as "CI is broken, someone
should fix it", and the obvious fixes all make things worse. Re-enabling produces red marks that
carry no information and teach the reader to stop reading red marks. `"requireGreenCI": true` —
which the upstream skill names as *the* fallback for a repo without required checks — assumes CI
runs; here `gh pr checks` reports non-zero forever, so it denies **every** merge instead of gating
any. Adding `required_status_checks` to the ruleset parks every PR on *"Expected — waiting for
status"*.

**How to apply:** leave all three alone. Two things follow from the missing tier and are worth
acting on instead:

- **Merge from the CLI.** `gh pr merge` passes through `t4-gate`, which runs
  `node scripts/validate/verify.mjs` first. The web merge button runs nothing — with no CI it is
  the only path into `main` that is checked by nothing at all.
- **Run `git config core.hooksPath .githooks` on any new clone.** It is per-clone local config;
  a checkout cannot set it for itself, and without it the second tier is absent too.

Re-arming steps, if the billing lock ever changes, are written out in ADR 0002. Related:
[[dev-machine-tooling]], [[config-and-kubejs-fail-open]].
