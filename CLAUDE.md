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

Six further specs layer on top of it. All share the same platform constraints and the same
design rules, and each numbers its own sections — **cite them by name, never as a bare `§N`**:

| Document | What it governs | Cite as |
|---|---|---|
| `docs/Addon Spec — Crafting Assistance + Tactical Tracker.md` | JEI, Jade, Jade Addons, Crafting Tweaks, Mouse Tweaks, Polymorph, and a re-themed Player Microchip tracker | *Crafting Spec §N* |
| `docs/Addon Spec — Natural Wildlife & Ecology.md` | Naturalist, Critters and Companions, Ecologics — the ordinary-animal layer that makes monsters read as abnormal. Carries its own phase list, W0–W9 | *Wildlife Spec §N* / *Wildlife Spec W3* |
| `docs/Addon Modpack — Distribution & Updates.md` | **Release engineering, not content.** Source of truth, what counts as the pack, versioning, the release gate, branching, changelog, friend installation and updates | *Distribution Spec §N* |
| `docs/Addon Performance — Optimization & Profiling.md` | The performance stack and the benchmark method. **Canonical**, merged from v1 + v2 (#93); the originals are in `docs/archive/` and are NOT authority. Cite the stable `PERF-*` id on each heading — **never a section number**, because v1 §5 and v2 §5 were different rules | *Performance Spec: `PERF-*`* |
| `docs/Addon Spec — Upscaling + Frame Generation.md` | The optional NVIDIA RTX 40/50 client rendering layer — DLSS-family upscaling and frame generation. **Client-only, opt-in, benchmark-gated**, and it ships as a separate artifact rather than entering the roster. Carries its own stable ids | *Upscaling Spec: `PERF-UPFG-*`* |
| `docs/plan/Benchmark Plan — Performance Benchmark Harness.md` | **How performance is measured**, not what to install — the tool stack, run identity, capture storage, the leave-one-out matrix and the acceptance rules. Adopted with four corrections in #133; zones and identity templates stay in `docs/performance-benchmarks.md` and `docs/performance-baseline.md` | *Benchmark Harness: `PERF-HARNESS-*`* |
| `docs/Addon Spec — Animation & Movement Layer.md` | Animation ownership, movement feel, first-person camera, and per-mod compatibility. §3 rejects **AMF: Better Movement** outright — do not re-propose without explicit direction | *Animation Spec §N* |
| `docs/Addon Spec —  Khaojee Enchanted Visuals Integration.md` | The Vanilla+ visual layer adapted from a reference modpack — grass, biome blending, particles, weather, connected textures, world-block animation. Carries its own phase list, V0–V10. §22 forbids a **required** shader | *Visuals Spec §N* |

The Distribution Spec is the one that constrains **this repository's own process**, not the game.
Its §22 branching model and §16 release gate govern how work ships; see `docs/agents/workflow.md`.

Untamed Wilds and Alex's Mobs are **rejected** by the Wildlife Spec (§2, §54) — high overlap,
unnecessary entity diversity, and Alex's Mobs carries fantasy creatures that collide with the
threat layer.

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
2. **`docs/agents/blocked-work.md`** — *why* the open work is blocked, and the two claims this
   repo has already had to retract. Read before the ledger, not instead of it.
3. **`docs/OPEN-WORK-LEDGER.md`** — current open work. 🔴 UNTRACKED rows are MD-only and will
   not appear in `gh issue list`; they are the highest miss-risk.
4. **The relevant GitHub issue** — `gh issue view <n> --comments`.
5. **`DONE.md`** — only if you need the history of a past change. Not by default.

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
node scripts/validate/verify.mjs lint     # syntax · placeholders · JEI orphans · the packwiz manifest
node scripts/validate/verify.mjs test     # node --check over every kubejs/**/*.js

node scripts/build/build-friend-pack.mjs  # THE ARTIFACT A FRIEND GETS — 123 KB, zero jars (ADR 0005)
node scripts/build/build-instance.mjs     # internal TEST artifact only, 430 MB — never handed out
node scripts/build/build-curseforge-local.mjs  # CurseForge App import, LOCAL ONLY — bundles the 4 blocked mods
node scripts/build/build-server.mjs       # the server pack (341 MB, 91 mods — Distribution Spec §12)
node scripts/build/generate-checksums.mjs # build/SHA256SUMS.txt, and refuses a stale artifact
node scripts/build/generate-modlist.mjs   # docs/MODLIST.md — 114 mods, source URLs resolved from ids
pwsh scripts/collect-client-evidence.ps1  # after a CLIENT launch: log + crashes + mod list → one zip

node scripts/validate/config-drift.mjs <install>   # "friend A works, friend B doesn't" (§38)

sh .githooks/check-tree-budget            # the guards, runnable by hand
sh .githooks/check-gate-ledger
sh .githooks/check-issue-ref
```

**Two rig rules the boot test keeps re-teaching.** Stop every java process before booting
(`Get-Process java | Stop-Process -Force` — `pkill -f` does **not** match them), and give a second
server its own port. A stale server produces a `DirectoryLock` `IOException` that reads exactly like
a corrupt save, and a `FAILED TO BIND TO PORT` that reads like a firewall problem. Neither is.

**`gh` is installed but not on the shell PATH.** Call it as
`"/c/Program Files/GitHub CLI/gh.exe"`. Authenticated as `xenodeve`; scopes include `repo` and
`workflow`. See `Obsidian-minecraft-100day/dev-machine-tooling.md`.

**`packwiz` is installed** at `/c/Users/xenod/go/bin/packwiz.exe`, not on PATH — call it by that
path. `packwiz refresh` after touching any pack file, or `verify` fails on a stale index hash.

**Not installed:** `java`. Nothing can be boot-tested from this session; a launch is the
developer's to run. Tracked in the ledger.

---

## Repo layout

```
CLAUDE.md                     this file
CHANGELOG.md                  one entry per released version — a version without one is not a release
DONE.md                       ship log — newest on top
.gitignore                    mod jars are NEVER committed (see the file for why)

docs/
  Industrial Civilization Survival — ….md    the design document (source of truth for intent)
  Addon Spec — Crafting Assistance ….md      JEI / Jade / tactical tracker
  Addon Spec — Natural Wildlife ….md         Naturalist / Critters / Ecologics, phases W0–W9
  Addon Modpack — Distribution & Updates.md  release engineering — governs THIS repo's process
  Addon Spec —  Khaojee Enchanted ….md      the Vanilla+ visual layer, phases V0–V10
  OPEN-WORK-LEDGER.md         open work, tracked and untracked — read at session start
  MODLIST.md                  GENERATED — the roster a downloader reads. Ships inside both
                              artifacts. `verify` refuses one that disagrees with mods/
  distribution-licenses.md    what the pack may redistribute — and the finding that the
                              conflict is with SELF-CONTAINED delivery, not the mod list
  visuals-not-adopted.md      WHY a Visuals Spec project is NOT in the pack — 19 of §3's 34,
                              grouped by blocked / unresolved / decided-against
  khaojee-visual-reference.md the Visuals Spec §36 source-tracking table — V0 audit results,
                              every version and licence measured, not recalled
  customization-map.md        WHAT STILL HAS TO BE BUILT — the 22 mods the design docs
                              tag for custom work, with their concrete targets
  compatibility-matrix.md     what has been OBSERVED — versions, sources, boot results
  agents/
    blocked-work.md           READ FIRST if you are picking up open work — what is blocked,
                              grouped by what would unblock it, with the evidence already gathered
    domain.md                 domain glossary — WHAT THE WORDS MEAN here
    reading-domain-docs.md    WHICH FILES to read before exploring, and when
    workflow.md               how to plan and implement here, branching, release tags
    issue-tracker.md          GitHub conventions, gh path, bilingual body rule
    triage-labels.md          the 25 labels that exist and what each one means
  adr/
    README.md                 ADR index + conventions
    0001-…                    CI gate scoped to what a modpack repo can check
    0002-…                    operate without a server-side CI tier

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

This repo runs **two tiers, not three** — a deliberate mode, decided in **ADR 0002**, not an
oversight.

| Layer | Binds | Blocks | State |
|---|---|---|---|
| `.claude/hooks/t4-gate` (`PreToolUse`) | Claude only | `gh pr create` with no issue · dangerous git · `gh pr merge` when `verify` fails | ✅ active |
| `.githooks/pre-push` | every agent + human **on this clone** | push with no issue ref · large dirty tree · committed artifacts · missing gate ledger | ✅ active — **this is now the load-bearing tier** |
| `T4 main gate` ruleset | everyone | direct push to `main` · force-push · branch deletion · merge with unresolved threads | ✅ active |
| `.github/workflows/t4-verify.yml` | — | — | 🚫 **disabled** — GitHub Actions is billing-locked and it cannot be resolved (ADR 0002) |

**What is actually unguarded, stated plainly.** A human merging on the GitHub web UI runs nothing:
not `verify`, not the guards, nothing this repo controls. The ruleset still forces the change
through a PR, but nothing inspects the PR's contents. **Merge from the CLI**, where `t4-gate` runs
`verify` first.

**Three things not to "fix":**

- **Do not re-enable the workflow** to "see if it works". It cannot; it will only start producing
  red marks that mean nothing, which is what disabling it prevented.
- **Do not set `"requireGreenCI": true`.** The upstream skill names it as the fallback for a repo
  that cannot have required checks — that fallback assumes CI *runs*. Here `gh pr checks` reports
  non-zero forever, so the flag would deny **every** merge instead of gating any.
- **Do not add `required_status_checks` to the ruleset.** Every PR would sit on *"Expected —
  waiting for status"* permanently.

The re-arming procedure, if the billing lock is ever resolved, is written out in ADR 0002 →
*Consequences → Follow-ups*.

**A fresh clone has no guards.** `core.hooksPath` is per-clone local config and nothing can make a
checkout set it for itself. On any new machine, first command:

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

---

## Agent skills

### Issue tracker

GitHub Issues on `xenodeve/minecraft-100day`, via the `gh` CLI — installed but **not on PATH**
(`"/c/Program Files/GitHub CLI/gh.exe"`). Issue, PRD and PR bodies are bilingual: English plus a
full Thai mirror. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles with their names unchanged, plus this repo's Component / Type /
Severity / Lifecycle groups — 25 labels, all present on the tracker. Every issue takes at least
one triage-state label and exactly one Component. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. Two files, deliberately not one: the **glossary** is `docs/agents/domain.md`
(*what the words mean*), and the **consumer rules** are `docs/agents/reading-domain-docs.md`
(*which files to read before exploring*). The upstream skill wants both at `domain.md`; they were
split because the glossary was there first. See `docs/agents/reading-domain-docs.md`.
