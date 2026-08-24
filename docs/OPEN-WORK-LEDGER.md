# Open Work Ledger — consolidated single source (2026-08-25)

> **Why this file exists:** open work is scattered across GitHub issues, ADRs, plans, and MD
> files. Agents read issues but often miss the MD. This ledger consolidates **everything still
> open** — GitHub-tracked **and** MD-only — into one place, deduped, with a phased plan.
> **Read this file at session start (it is linked from `CLAUDE.md`).** When you finish an item,
> update its row here AND its GitHub issue; when you discover new work, add a row here and (for
> anything non-trivial) file an issue so it doesn't vanish back into MD.

**Legend:** ✅ done · 🟢 buildable now · 🟡 gated (needs merge / resource / decision) ·
🔴 **UNTRACKED** (MD-only, no GitHub issue — highest miss-risk) · ⛔ decided won't-do (kept
visible so it is not re-proposed as if it were open)

**Current state, stated plainly:** the repo has its operating layer and its four design documents.
It has **no pack** — no `pack.toml`, no mods, no config, no KubeJS. The mod list now stands at the
main pack plus 7 QoL mods (Track 3) plus 3 wildlife mods (Track 4), and none of them has been
version-checked against a Create major yet. Track 5 is the release machinery, which has nothing to
release.

---

## Track 0 — Bootstrap remainder

| Item | Status | Gate | Next action |
|---|---|---|---|
| `docs/agents/issue-tracker.md` + `docs/agents/triage-labels.md` + `reading-domain-docs.md` | ✅ | — | Developer ran `/setup-matt-pocock-skills`; output landed with the T4 delta appended (**#3**). Consumer rules went to `reading-domain-docs.md` so the glossary at `domain.md` survived |
| Triage labels created on the GitHub repo | ✅ | — | 23 created, 2 already existed, 0 failed. `bug` renamed to `Bug` to match the vocabulary |
| `git config core.hooksPath .githooks` on this clone | ✅ | — | Enabled 2026-08-25. **Redo on every new clone** — it is per-clone local config and nothing can set it for you |
| `T4 main gate` ruleset — PR-only, no force-push, no deletion | ✅ | — | Active. Direct pushes to `main` are blocked |
| `lint` / `test` / `guards` as **required status checks** | ⛔ | closed as won't-do — the billing lock cannot be resolved | **ADR 0002**: workflow disabled, guards promoted to the load-bearing tier. Not open work; re-arming steps are in the ADR should that ever change |

**Track 0 is closed.** Bootstrap is done. The one thing it could not deliver — a server-side CI
tier — is now a decided operating mode rather than a pending task, which is why the row above is
⛔ and not 🟡.

## Track 1 — Blocking technical unknown — **RESOLVED**

| Item | Status | Gate | Next action |
|---|---|---|---|
| **Which Create major version the pack targets** | ✅ | — | **Create `6.0.8` — forced, not chosen.** The CORE addons' declared ranges intersect to `[6.0.8,6.1.0)` and 6.0.8 is the newest 1.20.1 build. Read from `META-INF/mods.toml` inside the jars (**#9**), see `docs/compatibility-matrix.md` |
| Season 2 viability under the chosen Create version (VS2 / Clockwork / TFMG / Warium) | 🔴 | now answerable — the Create pin is known | Sweep the four Season 2 mods against Create 6.0.8 and record which doors the pin closes, as an ADR |
| `packwiz` not installed on the dev machine | ✅ | — | Built from source with Go 1.26.7 → `~/go/bin/packwiz.exe` (2026-08-25) |
| `java` not on PATH | ✅ | — | Temurin **17.0.20.1** at `C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot`. **Prism Launcher 11.0.3** also installed — the official Minecraft launcher cannot import a modpack, so it was never a path to the goal |
| 17 CORE mods are CurseForge-only, four of them hard Create dependencies | 🟢 | none — packwiz resolves both sources | Constrains distribution, not feasibility. Recorded in the matrix |

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
| Hide disabled content from JEI | 🔴 | needs KubeJS + a decided mod list | Crafting Spec §6 — must stay in sync with every mod removal |

## Track 4 — Addon Spec (Natural Wildlife & Ecology)

Source: `docs/Addon Spec — Natural Wildlife & Ecology.md`. Three CORE mods and a phase list of
its own, W0–W9, gated behind the main pack. Folded into the operating layer under **#4**; the
implementation work below is not started.

| Item | Status | Gate | Next action |
|---|---|---|---|
| Naturalist + Critters and Companions + Ecologics | 🔴 | main pack must boot first | Wildlife Spec W0 — install, then dump the entity registry before touching a single spawn value |
| `docs/wildlife-roster.md` + duplicate species audit | 🔴 | W0 registry dump | Wildlife Spec W2/W4 — compare **behaviour**, not names, before any KEEP / REDUCE call |
| Spawn baseline + density tuning | 🔴 | must follow a profiling run, never precede it | Wildlife Spec W3/W6/W7 — *"Do not randomly reduce every value. Tune based on measured population."* |
| Threat-layer coexistence (Born in Chaos, Ice & Fire, The Hordes) | 🔴 | needs the threat layer to exist | Wildlife Spec W5 — a Horde must not permanently wipe local ecology |
| Serene Seasons interaction | 🔴 | out of scope for Alpha unless the mods already provide it | Wildlife Spec §52 — test, do not assume integration |

**Standing constraint from this spec, applies outside Track 4:** under performance pressure the
reduction order is ambient → small critters → duplicate species → common passives, and Create /
MineColonies / hostile encounter design are cut **last**. Any future tuning session inherits this.

## Track 5 — Distribution & release engineering

Source: `docs/ADDON-MODPACK-DISTRIBUTION-AND-UPDATES.md`. Unlike Tracks 3 and 4 this one adds no
mods — it governs how the pack ships, and parts of it constrain this repository's own process.
Folded into the operating layer under **#7**.

| Item | Status | Gate | Next action |
|---|---|---|---|
| Create `develop`, with its own ruleset | 🟡 | deliberately deferred — nothing to integrate and nobody running `main` | Create it in the same change that cuts the first `v0.x.0-alpha` tag. Distribution Spec §22; reasoning in `docs/agents/workflow.md` |
| `scripts/build/` — `build-client`, `build-server`, `validate-pack`, `generate-checksums` | 🔴 | needs `pack.toml` | Distribution Spec §14. One deterministic release command, not four remembered ones |
| Grow `verify.mjs` into `validate-pack` | 🔴 | each check is gated on its own prerequisite | Distribution Spec §15 — the seven-item checklist is mapped against what exists in the script's own header |
| COMMON / SERVER / CLIENT side classification | 🔴 | needs the mod list | Distribution Spec §11 — **read each mod's actual requirement, never guess** |
| Server pack, version-locked to the client pack | 🔴 | needs a built client pack | Distribution Spec §12 |
| Config ownership map — PACK CONTROLLED vs USER PREFERENCE | 🔴 | needs `config/` to exist | Distribution Spec §30. Decides what an update may overwrite; getting it wrong destroys a player's keybinds |
| `scripts/validate/config-drift` | 🔴 | needs the ownership map above | Distribution Spec §38 — the tool for "friend A works, friend B doesn't" |
| Release gate — the 12 in-game tests | 🔴 | needs a launchable pack | Distribution Spec §16. **Not automatable.** Human protocol, sibling of §26–27 |
| Checksums (`SHA256SUMS.txt`) + release tags + CurseForge / Modrinth publishing | 🔴 | needs a release | Distribution Spec §23, §33, §34, §39 |

**Standing constraint from this spec, applies outside Track 5:** the pack is Git + packwiz — the
manifest **plus** `config/`, `kubejs/`, `datapacks/`, `resourcepacks/`, `ftbquests/`. Zipping
`mods/` and sending it gives someone the right jars and the wrong game (§5). `CHANGELOG.md` exists
and every released version gets an entry.

---

## Management Plan — phased execution order

**Phase 0 — Unblock the tooling.** Install `packwiz` and a Java 17 JDK. That is the whole of it
now: `/setup-matt-pocock-skills` is done, the guards are enabled, and the CI tier is settled as a
decision rather than a blocker (ADR 0002). Without `java` no boot test can run, and §26 makes the
boot test the unit of progress — so these two installs gate all of Track 2.

**Phase 1 — Tracking hygiene.** File a GitHub issue for every remaining 🔴 row above, so the
ledger stops being the only record. The triage label vocabulary is already installed.

**Phase 2 — Resolve the Create version.** This is the multiplier. Every mod pin, every KubeJS
recipe, and the entire Season 2 branch are downstream of it, and it is answerable today with
research alone — no game launch required. **Scope it to all three documents at once:** the
Crafting and Wildlife specs add 10 more mods, and sweeping them separately means doing the same
CurseForge / Modrinth pass three times and reconciling three partial answers.

**Phase 3 onward — the §24 phase list**, one phase per epic, one PRD per phase. The addon specs'
own phases (Crafting Spec, and Wildlife Spec W0–W9) slot in behind the main-pack phase they
depend on; deciding where each lands is itself open work in Tracks 3 and 4.

**Gating summary:** Phase 2 is the multiplier and it is *not* blocked by Phase 0 — the version
sweep needs only network access. Phase 0 and Phase 2 can run in parallel; everything after
Phase 2 is strictly sequential, because §26 forbids adding a second mod batch before the first
is confirmed working.
