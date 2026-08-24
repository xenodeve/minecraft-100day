# Changelog

Every released version gets an entry here — required by Distribution Spec §24. A version with no
entry is not a release.

**Sections**, in this order, omitting any that is empty: `Added` · `Changed` · `Fixed` ·
`Removed`.

**Write it for the person installing it, not for the person who wrote it.** *"Reduced Born in
Chaos forest spawn"* is an entry; *"tuned incontrol.json"* is not — it names the file instead of
the effect.

**A version number here must match a git tag and the distributed artifact** (`v0.1.0-alpha`,
`v0.4.0-beta`, `v1.0.0`). A build from `develop` or a feature branch is a **dev build**: it gets
no entry, no tag, and is never handed to a friend as if it were a release.

---

## Unreleased

### Added

- Repository operating layer: agent memory (ledger, ship log, memory vault), enforcement hooks and
  guards, domain glossary, workflow and tracker conventions, ADRs.
- Four design documents under `docs/` — the main handoff plan plus the Crafting Assistance,
  Natural Wildlife & Ecology, and Distribution & Updates specs.

_No pack yet. There is no `pack.toml`, no mods, no config and no KubeJS, so there is nothing
installable and nothing to release. The first entry below this one will be `v0.1.0-alpha`, and it
cannot be cut until the release gate in Distribution Spec §16 passes._
