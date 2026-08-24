# DONE — Agent Session Log

> Newest entry on top. One dated `##` heading per shipped unit so an agent can jump to one.
> When this crosses ~a few hundred lines or a phase closes, move older entries to
> `DONE-archive-<period>.md` and leave a redirect line here.

---

## One self-contained file — import and play (2026-08-25, branch `feat/16-single-file-artifact`)

**Goal:** the pack exported as one file, but importing it was not one step — the manifest carried
38 CurseForge references and four mods sent the user to click links by hand.

**Shipped (#16):**
- `scripts/build/build-instance.mjs` — reads every metafile, downloads each jar, **hash-verifies
  it**, assembles a Prism Launcher instance and zips it. Refuses to emit on any mismatch.
  This is Distribution Spec §14's `scripts/build/`, first entry.
- **ADR 0003** — self-contained over the spec's reference profile, with the developer's stated
  reason (patches authored here; no intent to track upstream updates) and the honest cost
  (388 MB per release, every patch reships all of it).
- `INSTALL.md` restructured: the self-contained file is Option A, one step, offline.

**Validation:**
- `all 93 jars verified — 93 downloaded, 0 from cache`
- `archive verified — 93 jars under .minecraft/mods/, no backslash entries`
- Independent check: extracted the finished artifact, SHA-256 over all 93 jars against the
  verified cache — **93/93 byte-identical**.

**Two defects caught before they shipped:**
1. `Compress-Archive` writes ZIP entry names with **backslashes**, which the spec forbids. Prism
   would have read `.minecraft\mods\create.jar` as one flat filename — 93 oddly-named files and no
   mods directory, looking like a Prism bug. Found by a structural check counting **0** jars under
   `*/mods/`.
2. `build/` in `.gitignore` matched `scripts/build/` — an unanchored directory pattern matches at
   any depth — so the build script **was never committed**. `git add -A` reported success and the
   file was simply absent. All six directory patterns anchored.

**Composition, stated so the "~60 mods" claim is checkable:** 93 metafiles = **66 mods named in
the five design documents** + 27 libraries and dependencies packwiz resolved automatically.

**Not claimed:** the artifact has **not** been imported into Prism. Prism has never been run, so it
has no data directory, and driving its GUI unattended was out of scope. Verified instead: the
archive matches Prism's documented instance format, and this jar set booted a Forge server green.

---

## The pack exists and boots (2026-08-25, `/t4-afk` unattended run, branches `chore/9-*`, `feat/11-*`, `feat/13-*`)

**Goal:** turn five design documents into a modpack a user can import into Minecraft.

**Toolchain installed:** Temurin 17.0.20.1, Prism Launcher 11.0.3, Go 1.26.7, and packwiz built
from source (`~/go/bin/packwiz.exe`) — packwiz publishes no releases, only CI artifacts, so source
was the trustworthy route.

**Shipped:**
- **#9** — `docs/compatibility-matrix.md`. Every mod in five design documents swept against the
  Modrinth API; Create's dependency ranges read from `META-INF/mods.toml` inside the jars.
  **Create pinned to `6.0.8` — forced, not chosen**: the CORE addons intersect at `[6.0.8,6.1.0)`
  and 6.0.8 is the newest 1.20.1 build.
- **#11** — the pack. `pack.toml`, `index.toml`, `.packwizignore`, 83 mods pinned to exact
  versions and hashes, `INSTALL.md`.
- **#13** — the Performance Spec §2 stack: Embeddium, ModernFix, FerriteCore, Entity Culling,
  ImmediatelyFast, ServerCore, FastSuite, Clumps, Chunky. 93 metafiles total.

**Validation — run, not reasoned:**
- Forge 47.4.23 dedicated server, Temurin 17, 6 GB heap. First boot: **failed**, one mod.
  `cbc_firepower_components requires createbigcannons [5.8.0,5.9.0); currently 5.11.4`. Removed —
  no version of it supports CBC ≥ 5.9.
- Second boot, 76 jars: `Done (27.452s)!` — registries built, world generated, server live.
- Third boot with the performance stack, 83 jars: green.
- `node scripts/validate/verify.mjs` → passed; the TOML linter handled 85+ real packwiz metafiles.

**Two of my own claims corrected mid-run, both load-bearing:**
1. The matrix said `flywheel` and `ponder` were CurseForge-only dependencies to source by hand.
   **They are bundled inside Create via Forge JarJar.** Acting on the wrong version put *Ponder for
   KubeJS* — a different mod — into the pack. Removed before commit. Rule recorded: check
   `META-INF/jarjar/` before hunting a Forge dependency.
2. The sweep read every addon's range against `create` and stopped there, so it never saw that
   `cbc_firepower_components` constrains `createbigcannons`. Only the boot caught it.

**Findings that constrain distribution, recorded rather than smoothed:**
- Four mods have third-party downloads disabled by their authors — TakKit, Flashier Flashlights,
  Client Dynamic Light, Player Microchip. The CurseForge App handles them; every other route
  requires the user to click a link. `INSTALL.md` names all four with URLs.
- CameraCraft has no 1.20.1 Forge build anywhere; the CCTV layer needs another answer.
- `TaCZ: Accelerated` is Core in Performance Spec §2 and CORE CANDIDATE in §19. Not added.

**Not done, and not claimed:** the **client** has never been launched — that needs the developer's
Microsoft account. No balance, no KubeJS, no configs. The pack runs; it does not yet play the way
the design documents describe.

**Artifact:** `build/Industrial-Civilization-Survival-0.1.0-alpha.zip` — CurseForge format,
importable by CurseForge App, Prism, ATLauncher. Not committed (`.gitignore`).

---

## Distribution & Updates spec folded in (2026-08-25, branch `chore/7-fold-distribution-spec`)

**Goal:** a fourth design document arrived, and unlike the first three it constrains **this
repository's process** rather than the game. Reconcile it against infrastructure that already
exists in a different shape.

**Shipped (#7):**
- `docs/agents/domain.md` — eight distribution terms in both language halves: Source of truth,
  Pack-owned files, Config ownership (PACK CONTROLLED / USER PREFERENCE), Side classification,
  Server pack, Release gate, Config drift, Dev build.
- `docs/agents/workflow.md` — the §22 branching model, the branch-naming rule the issue-ref guard
  actually enforces, the Season 2 quarantine branch, release tags, and the §16 release gate.
- `CHANGELOG.md` — created, with the section shape and the rule that a version without an entry
  is not a release.
- `scripts/validate/verify.mjs` — header now maps the §15 validation checklist against what is
  implemented and what each missing check is blocked on. Three of ten done; the rest need a
  resolved pack, not effort.
- `CLAUDE.md`, `docs/agents/reading-domain-docs.md`, `docs/OPEN-WORK-LEDGER.md` (Track 5).

**Judgement call, flagged rather than buried:** the spec's `develop` branch was **not** created.
Its purpose is to keep unfinished integration away from a `main` people are running, and nobody is
running anything. It is deferred to the change that cuts the first `v0.x.0-alpha` tag, with the
reasoning written into `docs/agents/workflow.md` and a 🟡 row in Track 5. Stated on #7 so it can be
overruled in one comment.

**Validation:** `node scripts/validate/verify.mjs` → passed. Nothing here is verifiable in game;
no mod exists.

**Next:** unchanged — install `packwiz` and Java 17, then the Create version sweep.

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
