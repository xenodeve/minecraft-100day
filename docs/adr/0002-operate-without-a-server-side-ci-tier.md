# ADR 0002 — Operate without a server-side CI tier

- **Status:** Accepted (2026-08-25) — implemented
- **Area:** Infra
- **Related:** ADR 0001 (scoped the gate; assumed this tier was merely pending), #1, `.github/workflows/t4-verify.yml`, `.githooks/`, `.claude/t4.json`

## Context

ADR 0001 built a three-tier enforcement stack and its postscript recorded that the third tier —
GitHub Actions — could not run because the account is billing-locked. It framed that as a delay:
*"only its third tier is pending."*

It is not pending. The developer has stated the billing lock cannot be resolved. So the question
is no longer *when* the server-side tier arrives, but how this repo behaves given that it never
will.

Leaving the situation as-is is the worst of the options. The workflow stays `active`, fails on
every single push with *"The job was not started because your account is locked due to a billing
issue"*, and the repository accumulates a permanent column of red X's that mean nothing. The T4
CI reference names that outcome directly: *"a perpetually-red gate gets ignored, which is worse
than none"*, and *"A permanently red check trains everyone to ignore red."* A red mark nobody is
expected to act on teaches everybody to stop reading red marks — including the ones that matter.

The upstream skill does document a fallback for a repo that cannot have required checks:

> ```jsonc
> // .claude/t4.json
> { "requireGreenCI": true }
> ```

That fallback does not fit this case, and following it literally would break the repo. It is
written for a repo whose **CI runs** but whose **plan forbids required checks** — a private repo
on the free tier. Ours is the inverse: rulesets are available (the repo is public), and CI is what
is missing. With `requireGreenCI` set, `t4-gate` runs `gh pr checks` before every `gh pr merge`;
with no check ever reporting, that call exits non-zero and **every merge is denied, forever**. The
same reference's troubleshooting table says exactly this: *"In a repo with no CI at all the same
call reports non-zero → drop the flag."*

## Decision

Operate deliberately in a two-tier mode, and make the absence of the third tier visible rather
than noisy.

1. **The `T4 verify` workflow is disabled, not deleted.**
   `gh workflow disable 341588663` — state is now `disabled_manually`. The file
   `.github/workflows/t4-verify.yml` is kept, correct and ready, because the cost of re-enabling
   is one command and the cost of rewriting it later is a session.

2. **`.claude/t4.json` `"requireGreenCI"` stays `false`.** Reasoning above. Setting it would deny
   every merge rather than gate any.

3. **The guards tier is promoted from optional to load-bearing.**
   `git config core.hooksPath .githooks` is now enabled on this clone. Previously it was one of
   three overlapping tiers and its absence merely weakened the stack; with CI gone it is the
   **only** tier that binds anything other than Claude's own tool calls. Enabling it is no longer
   housekeeping — it is the enforcement.

4. **The `T4 main gate` ruleset keeps every rule that does not depend on a check reporting**:
   direct pushes to `main` blocked, no force-push, no branch deletion, unresolved review threads
   block merge. `required_status_checks` remains absent.

5. **Re-arming is a documented three-step procedure**, so a future session does not have to
   re-derive it — see *Consequences → Follow-ups*.

## Alternatives considered

- **Leave the workflow enabled and let it fail.** Rejected — this is the permanently-red gate the
  CI reference warns about. The failures carry no information (they are all the same billing
  error) and they train the reader to skip the checks column.

- **Set `"requireGreenCI": true`, following the skill's literal fallback.** Rejected — it denies
  every merge, as the skill's own troubleshooting table states. Following the letter of a rule
  written for a different failure mode is not compliance.

- **Delete `.github/workflows/t4-verify.yml`.** Rejected — it is correct, it cost real work to
  scope (ADR 0001), and `gh workflow enable` restores it instantly. A disabled workflow is an
  honest "not running"; a deleted one is a decision a future session would have to rediscover.

- **Add a self-hosted runner.** Rejected on security grounds, not convenience. Self-hosted
  runners on a **public** repository let anyone who opens a pull request execute code on the
  runner host — GitHub documents this as a recommendation against the configuration. The only
  available host is the developer's own workstation, which is also where the Minecraft instance,
  the `gh` token and the git credentials live. The blast radius is the entire development
  machine, to gate two lint checks.

- **Move CI to another provider** (a free tier elsewhere). Not rejected on merit — deferred. It is
  a genuine option and the right one if this repo ever gains a second contributor. Today it means
  a whole new integration, a second place for the gate config to drift from
  `scripts/validate/verify.mjs`, and a second set of credentials, in exchange for running two
  checks that the local gate already runs before every merge. Revisit when the repo has someone
  who is not the person running the local gate.

## Consequences

- **Positive:** no red checks that mean nothing, and no PR deadlocked on a status that will never
  report. The two tiers that *can* work are both armed: the local ship gate runs
  `node scripts/validate/verify.mjs` before `gh pr merge` and blocks on failure, and the pre-push
  guards now run on every push from this clone.

- **Negative / limits — state this plainly and do not soften it.** What is lost is the only tier
  that binds **a human merging on the GitHub web UI**. That path is now completely unguarded: the
  web merge button does not run `verify`, does not run the guards, and does not consult anything
  this repo controls. The ruleset still forces the change through a PR, but nothing checks the
  PR's contents.

- **Negative / limits:** `core.hooksPath` is per-clone local config. A fresh clone — a second
  machine, a CI container, another contributor — has **no** guards until someone runs the command.
  There is no mechanism that can make a checkout enforce this on itself, by design.

- **Negative / limits:** the guards are `--no-verify`-able. They raise the cost of skipping a
  rule; they do not make it impossible. With CI gone, nothing in this repo is un-bypassable.

- **Follow-ups — how to re-arm, if the billing lock is ever resolved:**
  1. `gh workflow enable 341588663`, then push once so the check names become selectable.
  2. Add `{ "context": "lint" }`, `{ "context": "test" }`, `{ "context": "guards" }` to the
     `required_status_checks` block of the `T4 main gate` ruleset (`gh api repos/xenodeve/minecraft-100day/rulesets`).
  3. Leave `"requireGreenCI"` at `false` — with real required checks the ruleset is the stronger
     mechanism and the flag adds only a redundant local denial.

  This ADR is then **superseded**, not edited.
