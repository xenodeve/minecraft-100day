# ADR 0001 — CI gate scoped to what a modpack repo can actually check

- **Status:** Accepted (2026-08-25) — implemented
- **Area:** Infra
- **Related:** `.github/workflows/t4-verify.yml`, `scripts/validate/verify.mjs`, `.claude/t4.json`

## Context

The T4 operating standard ships a server-side ship gate with four required status checks on
`main` — `lint`, `typecheck`, `test`, `build` — plus a fast local prefix of the same suite
run by `t4-gate` before `gh pr merge`. The standard was written for a TypeScript application
repo, where all four map onto commands that exist.

This repo is a Minecraft 1.20.1 Forge modpack. At bootstrap time it contains documentation,
config, and (later) KubeJS scripts, datapacks, and a packwiz manifest. There is no compiler,
no test runner, and no package manifest. `packwiz` is not installed on the development
machine yet, so even the eventual `build` command cannot run.

The T4 CI reference states the constraint plainly: *"a `typecheck` job that runs a script
that doesn't exist is a red check that teaches everyone to ignore red checks."* A required
check that can never pass is worse than no check, because the first time someone disables a
rule to land a PR, it stays disabled.

At the same time, this repo has a real and unusually severe silent-failure mode. KubeJS does
not halt on a malformed script — it logs and drops the file — so a syntax error removes an
entire batch of recipes with no crash and no obvious symptom. The same is true of config:
an unrecognised key is ignored rather than rejected, so a typo and a working setting are
indistinguishable without launching the game.

## Decision

The gate is scoped to checks that can fail for a real reason today, and grown as the repo
grows.

1. **Two required checks instead of four.** `.github/workflows/t4-verify.yml` defines `lint`
   and `test`, plus a `guards` job wrapping the three `.githooks/` scripts. `typecheck` and
   `build` are omitted, with the reason stated in the workflow header so their absence reads
   as a decision rather than an oversight.

2. **One script backs both the local and server gate.** `scripts/validate/verify.mjs` takes a
   phase argument (`lint` | `test` | omitted for both). `.claude/t4.json` `"verify"` is set to
   `node scripts/validate/verify.mjs`, making the local gate a literal superset-in-one-process
   of the two CI jobs. They cannot drift, which the CI reference names as the failure that
   erodes trust in a local gate fastest.

3. **`lint` covers JSON syntax, TOML syntax, and unfilled bootstrap placeholders.** The TOML
   check is deliberately conservative — it flags only unambiguously broken structure — because
   a false positive on `pack.toml` would block every PR in the repo.

4. **`test` runs `node --check` over every `kubejs/**/*.js`.** This is the one check that
   catches the silent-drop failure described above before it reaches a world.

5. **`build` is added in the same commit that adds `pack.toml`**, wired to
   `packwiz refresh` plus an export, and added to the ruleset at the same time.

## Alternatives considered

- **Install all four jobs and let `typecheck` / `build` fail.** Rejected — it produces a
  permanently red gate on day one, which trains everyone (agent and human) to merge past red.
  That habit is far more expensive than the coverage the jobs would eventually add.

- **Install all four but mark `typecheck` / `build` `continue-on-error: true`.** Rejected —
  the CI reference permits a report-only check only when its header names an exact flip
  condition. Here the honest flip condition is "when the command exists", which is the same as
  "when we add the job", so the placeholder buys nothing and hides an empty check behind a
  green tick.

- **Skip CI entirely at Seed tier and rely on the local `t4-gate`.** Rejected — the local gate
  binds only commands the agent runs through the hook. A human merging on the GitHub web UI
  bypasses it completely, and the bootstrap skill names exactly this shape as the trap: a repo
  with the local gate and no CI has the appearance of enforcement with none of the guarantee.

- **Add a Java/Gradle-based mod-loading smoke test in CI.** Rejected for now — launching a
  Forge instance in Actions requires the mod jars, which this repo deliberately does not
  commit (see `.gitignore`), and CurseForge distribution terms do not permit re-hosting them.
  Boot testing stays a local, human-run protocol (§26 of the handoff doc).

## Consequences

- **Positive:** every required check on `main` can fail for a real reason and can pass today.
  The KubeJS syntax check closes the pack's worst silent-failure mode. One script serving both
  gates removes the local/CI drift class of bug entirely.

- **Negative / limits:** the gate proves nothing about whether the pack *runs*. A green CI on
  this repo means "the files parse and nothing is obviously unfilled", not "the modpack
  launches". Nothing mechanical enforces the launch protocol; it stays agent and human
  discipline, recorded in `docs/agents/workflow.md` and in the compatibility matrix.

- **Negative / limits:** the TOML checker is hand-rolled and conservative by design. It will
  miss semantically invalid but structurally plausible TOML. It is a smoke check, not a parser,
  and should be replaced with a real parser if packwiz manifest corruption ever costs a session.

- **Follow-ups:** add the `build` job and the `{ "context": "build" }` ruleset entry in the
  commit that introduces `pack.toml`. Revisit the TOML checker if it produces a false positive.

## Postscript — the gate is armed, the checks are not (2026-08-25)

Discovered immediately after the first push, and recorded here rather than in a second ADR
because it does not overturn the decision above — it delays half of it.

**GitHub Actions cannot run on this account** ([run 32779529796](https://github.com/xenodeve/minecraft-100day/actions/runs/32779529796)):
*"The job was not started because your account is locked due to a billing issue."* Both jobs
reported failure without executing a single step.

So the `T4 main gate` ruleset was created **without** `required_status_checks`. It still blocks
direct pushes to `main`, force-pushes, branch deletion, and merging with unresolved review
threads — the parts that do not depend on a check reporting. `.claude/t4.json`
`"requireGreenCI"` stays `false`, because with no CI at all `gh pr checks` reports non-zero and
would deny every merge.

Adding the required checks now would have been worse than omitting them: every PR would sit on
*"Expected — waiting for status"* forever, and the first person who needs to land a PR disables
the rule. A rule disabled once stays disabled, which is the exact failure this ADR set out to
avoid.

**Tracked as #1.** The decision above is unchanged; only its third tier is pending.
