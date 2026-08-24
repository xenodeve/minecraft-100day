# CLAUDE.md — minecraft-100day

Operating manual for the agent working in this repo. Read it before acting.

> **Language of this file.** Written in English because it is read by the agent, not by the
> developer, and it is dense with commands and identifiers. **Reports to the developer are in
> Thai** — see *Writing conventions* below. Governed docs under `docs/agents/` carry a full Thai
> mirror; this one does not.

---

## What this repo is

**Industrial Civilization Survival** — a Minecraft **1.20.1 / Forge / Java 17** modpack. The
player is an ordinary human who must build an industrial civilization to survive a world more
dangerous than vanilla.

The design document is the source of truth for intent:
**`docs/Industrial Civilization Survival — Claude Code Handoff & Implementation Plan.md`**
(read it before any pack work; unqualified `§N` references throughout this repo are to it).

A second, standalone spec layers on top of it:
**`docs/Addon Spec — Crafting Assistance + Tactical Tracker.md`** — adds JEI, Jade, Jade Addons,
Crafting Tweaks, Mouse Tweaks, Polymorph and a re-themed Player Microchip tracker. It shares the
same platform constraints and the same design rules; cite it as *Addon Spec §N*.

**Engineering north-star.** Every change is judged by §35: *does this create another meaningful
problem for the player to solve through engineering, logistics, preparation or teamwork?* A
change that only adds power with no new trade-off is rejected, however well built.

**Two hard platform rules** (§31): do not move off Minecraft 1.20.1, and do not migrate Forge →
NeoForge. Neither is negotiable without an explicit instruction from the developer.

**The trap this repo sets for you.** Configs fail open and KubeJS drops broken files silently
(`Obsidian-minecraft-100day/config-and-kubejs-fail-open.md`). Nothing crashes when you get it
wrong. Reporting a config change as working without having launched the game is therefore not
optimism — it is a false statement about the repo.

---

## Session start — read protocol

In order, and stop pulling detail once you have enough for the task:

1. **`Obsidian-minecraft-100day/Home.md`** — the team memory index. Skim the one-line
   descriptions; open only the notes this task touches.
2. **`docs/OPEN-WORK-LEDGER.md`** — current open work. 🔴 UNTRACKED rows are MD-only and will
   not appear in `gh issue list`; they are the highest miss-risk.
3. **The relevant GitHub issue** — `gh issue view <n> --comments`.
4. **`DONE.md`** — only if you need the history of a past change. Not by default.

---

## `using-t4` is a standing default, not a pointer

Route every task through the `using-t4` map before acting, and **re-route at every phase
boundary**:

| Boundary just crossed | Invoke |
|---|---|
| Wrote or changed code / config / KubeJS | `/simplify` |
| About to merge | `/code-review` + `/scrutinize` |
| Touched auth, secrets, tokens, or any trust boundary | `/security-review` |
| Hit a bug, error, stack trace, or crash report | `/debug-mantra` |
| Finished an implementation | `/verify` |
| About to write down what you will change | the change-site survey (`t4-dev-workflow`) |

**A check at task start does not discharge a later trigger.** Reading the map once at session
start and never returning to it is the single behaviour the map forbids of itself — and it fails
invisibly, because nothing breaks when it happens.

State every judgment gate on the branch, whether or not you ran it:

```
T4-Gates: simplify=ran code-review=ran scrutinize=not-run security-review=n-a verify=ran
```

`not-run` is a legal answer; `.githooks/check-gate-ledger` accepts it. Saying *nothing* about a
gate is what it refuses.

---

## Delegation

**`clink-subagents` is the delegation default here.** The orchestrator's context window is the
scarce resource; the clink back-ends bill against flat subscriptions and the master does not. So
delegation is the normal move, not an optimisation.

Two rules do not relax:

- **Verify everything a subagent returns.** A report is a hypothesis until you check it. A worker
  in this family's history claimed a merged PR that did not exist.
- **Never delegate the final verification**, and never delegate a security-boundary change.

**`clink-masteragent` is wired as: invoke it before any `clink` call.** This was chosen
deliberately over loading it at session start — sessions that never delegate pay nothing.
(Recorded here so a later reader can tell a decision from an omission.)

**What is safe to delegate in this repo specifically:** research (reading a mod's config schema,
sweeping CurseForge / Modrinth for exact versions and dependencies) and bulk mechanical edits.
**What is not:** balance judgments, and any claim that something works in game — a subagent
cannot launch Minecraft, so it cannot produce that evidence.

---

## Development workflow

Full detail in **`docs/agents/workflow.md`**. The shape:

**`/grill-me` → `/grill-with-docs` → survey the change sites → `/to-prd` → `/to-issues` → `/tdd`**

Hard ordering: **PRD → issues → PR.** Never open a PR without a referenced issue — the
`PreToolUse` gate denies it, and `.githooks/check-issue-ref` denies the push.

`/tdd` in a repo with no test runner means the boot/regression protocol (§26–27): state the
observable that must change, confirm it is wrong today by launching, change one thing, observe
the flip. See `docs/agents/workflow.md`.

---

## Commands

```bash
node scripts/validate/verify.mjs          # both phases — this is the local ship gate
node scripts/validate/verify.mjs lint     # JSON + TOML syntax, unfilled placeholders
node scripts/validate/verify.mjs test     # node --check over every kubejs/**/*.js

sh .githooks/check-tree-budget            # the guards, runnable by hand
sh .githooks/check-gate-ledger
sh .githooks/check-issue-ref
```

**`gh` is installed but not on the shell PATH.** Call it as
`"/c/Program Files/GitHub CLI/gh.exe"`. Authenticated as `xenodeve`; scopes include `repo` and
`workflow`. See `Obsidian-minecraft-100day/dev-machine-tooling.md`.

**Not installed yet:** `packwiz`, `java`. Both are needed before any pack work; tracked in the
ledger.

---

## Repo layout

```
CLAUDE.md                     this file
DONE.md                       ship log — newest on top
.gitignore                    mod jars are NEVER committed (see the file for why)

docs/
  Industrial Civilization Survival — ….md    the design document (source of truth for intent)
  OPEN-WORK-LEDGER.md         open work, tracked and untracked — read at session start
  agents/
    domain.md                 domain glossary — what the words mean here
    workflow.md               how to plan and implement here
    issue-tracker.md          ⚠ NOT YET WRITTEN — see the ledger, Track 0
    triage-labels.md          ⚠ NOT YET WRITTEN — see the ledger, Track 0
  adr/
    README.md                 ADR index + conventions
    0001-…                    CI gate scoped to what a modpack repo can check

Obsidian-minecraft-100day/    team memory vault; Home.md is the index

.claude/
  t4.json                     marker + the armed verify command
  settings.json               registers the three hooks
  hooks/                      session-start · prompt-reminder · PreToolUse gate
.githooks/                    pre-push guards (opt-in per clone — see below)
.github/workflows/            t4-verify.yml — lint · test · guards
scripts/validate/verify.mjs   the one script both gates run
```

**Directories that do not exist yet** and are created by the pack work, not by hand:
`mods/`, `config/`, `kubejs/`, `datapacks/`, `ftbquests/`, `resourcepacks/`, `pack.toml`.
The intended shape is in §7 of the design document.

---

## What is mechanically enforced

| Layer | Binds | Blocks |
|---|---|---|
| `.claude/hooks/t4-gate` (`PreToolUse`) | Claude only | `gh pr create` with no issue · dangerous git · `gh pr merge` when `verify` fails |
| `.githooks/pre-push` | every agent + human on this clone | push with no issue ref · large dirty tree · committed artifacts · missing gate ledger |
| `.github/workflows/t4-verify.yml` | everyone, including a human merging on the web | a red `lint`, `test`, or `guards` check |

**The pre-push guards are opt-in per clone and not yet enabled.** Run once:

```bash
git config core.hooksPath .githooks
```

Everything else — TDD discipline, the depth of a review, whether you actually launched the game —
is agent discipline. Hooks raise the cost of skipping a judgment gate; they cannot verify the
reasoning.

---

## Writing conventions

- **Reports to the developer: Thai.** Identifiers, filenames, commands, log excerpts and mod
  names stay English; the Thai explains around them, never translates them.
- **GitHub issue / PRD / PR bodies: bilingual.** English, then a **full Thai mirror** — same
  detail, same bullets, same tables. "สรุป" is not a summary. Titles are English,
  conventional-commit style. Review-reply comments may be English-only.
- **Governed docs** (`docs/agents/*`, and `CONTEXT.md` / `PRODUCT.md` / `DESIGN.md` when they
  exist): `<!-- lang:en -->` … `<!-- lang:end -->` then `<!-- lang:th -->` … `<!-- lang:end -->`,
  full mirror.
- **Code, commit messages, inline comments: English.**
- **Use the glossary's exact terms** (`docs/agents/domain.md`). Drifting to an "alias to avoid" is
  a defect — those aliases carry design assumptions this pack rejected.

---

## Dev notifications

The developer runs the agent for long stretches. Surface a toast on: a long task or TDD cycle
complete, needing a confirmation (before closing an issue or merging), or an unattended batch
finishing. Not for routine sub-progress.

---

## Session end

**Report every `xeno-skills` rule that did not hold**, as an issue on `xenodeve/xeno-skills` —
one issue per *rule*, one comment per *session*, so the comment count is the failure rate.
Search `--state all` first; comment on an existing issue rather than opening a second.
`--repo xenodeve/xeno-skills` is not optional. Include the skips, especially the embarrassing
ones — a record of only the memorable sessions is a failure-selected sample. If a session had
none, say so in one line. Full procedure in the `t4-agent-memory` skill.

**Reconcile before you stop.** Session-local todos go back to the ledger and to their issues.
New work discovered mid-session gets a ledger row and, if non-trivial, an issue — otherwise it
vanishes into MD, which is the failure the ledger exists to prevent.
