# ADR 0003 — Self-contained single-file distribution

- **Status:** **Superseded in part by ADR 0005** (2026-08-27). The self-contained artifact still
  exists and is still built — it is now the *internal test* artifact, not the one a friend
  receives. The revisit trigger this ADR named for itself is what fired; see ADR 0005.
- **Originally:** Accepted (2026-08-25) — implemented
- **Area:** Infra
- **Related:** #16, `scripts/build/build-instance.mjs`, `INSTALL.md`, Distribution Spec §6, §14, §36–37

## Context

The Distribution Spec's friend-installation path (§6 B, §36) assumes a **reference profile**: a
manifest listing mods, which the launcher resolves and downloads, plus an `overrides/` directory
carrying the pack's own gameplay files. `packwiz curseforge export` produces exactly that, and it
is what the pack shipped first.

Three facts made that route worse than it looks for this pack specifically:

1. **Four mods have third-party downloads disabled by their authors** — TakKit, Flashier
   Flashlights, Client Dynamic Light, Player Microchip. `packwiz-installer` cannot fetch them; it
   stops and prints four URLs for the user to open by hand. So "one file" was one file to
   *download* and then four manual steps to *finish*.
2. **The `overrides/` half is empty of the thing it exists for.** The pack has no `config/`, no
   `kubejs/`, no quests yet — the custom layer that a reference profile is designed to ship
   cheaply does not exist. The 45 embedded jars in the export are there because those mods are not
   on CurseForge, not because they are ours.
3. **The developer does not intend to track upstream mod updates.** Stated directly:
   *"เราไม่ได้กะจะ update ตาม mod list ที่เรานำมาใช้อยู่แล้ว"* — patches will be authored here and
   shipped directly, not pulled from mod authors.

Point 3 is what settles it. A reference profile's main advantage is a small file that stays current
as mods update. If the pack is deliberately pinned and patched by hand, that advantage is not being
bought — only its costs are being paid.

## Decision

Ship **two artifacts** with different jobs, and make the self-contained one the primary.

1. **`scripts/build/build-instance.mjs` produces a Prism Launcher instance zip** containing every
   jar. Import is one step with no network access. This is the artifact a friend receives.

2. **Every jar is verified against the hash in its `mods/*.pw.toml`** before it enters the archive,
   and the build **refuses to emit** on any mismatch or missing file. A silently corrupt jar inside
   a 388 MB file is not something anyone finds until someone cannot launch.

3. **CurseForge-sourced jars are fetched from
   `https://www.curseforge.com/api/v1/mods/{project}/files/{file}/download`** — the endpoint the
   website's own Download button uses, not the third-party API those four mods opted out of.

4. **`packwiz curseforge export` stays**, unchanged, as the second output. It remains correct for
   the CurseForge App and for anyone who wants launcher-managed updates.

5. **`pack.toml` remains the single source of truth.** Both artifacts are derived from it; neither
   is edited by hand, and no jar is committed to git.

## Alternatives considered

- **Reference profile only** — the spec's default. Rejected for this pack: four manual downloads
  is not one step, and the update advantage is not one this pack is buying.

- **Reference profile plus a small "custom layer" patch file.** This is the right shape *later*,
  once `config/` and `kubejs/` exist and are the thing changing between versions. It is not
  rejected — it is premature. Revisit when the custom layer is larger than a rounding error against
  388 MB of jars.

- **A merged "one jar" mod.** What "MasterMod, one file" might suggest literally. Not possible:
  Forge loads mods as separate jars with their own metadata, mixins and coremods; merging 93 of
  them would break mixin targets, duplicate shaded libraries, and violate every licence that
  requires the mod be distributed as published.

- **`Compress-Archive` for the zip.** Tried, and it produced a broken artifact — see below.

## Consequences

- **Positive:** one file, one step, no manual downloads, no network at import. Every jar is
  hash-verified at build time, so a corrupt artifact fails loudly at build rather than quietly at
  someone else's launch.

- **Negative / limits — the honest cost.** 388 MB per release, and **every patch reships all of
  it**. That is acceptable only because the developer stated updates will be hand-authored and
  infrequent. If release cadence rises, this decision should be reopened, not worked around.

- **Negative / limits — redistribution.** The artifact contains four mods whose authors disabled
  *third-party API* distribution. The jars are fetched from CurseForge's own public download path,
  which is what a user clicking Download receives. Bundling them for a private group is ordinary
  practice; **publishing this artifact publicly is a different act** and is not covered by that
  reasoning. `INSTALL.md` names all four so the choice is visible rather than buried.

- **A defect this caught, recorded because it would have shipped silently.** PowerShell's
  `Compress-Archive` writes entry names with **backslashes**, which the ZIP spec forbids (4.4.17.1:
  the separator MUST be `/`). Prism would have read `.minecraft\mods\create.jar` as one flat
  filename — an instance with 93 oddly-named files and no mods directory. Found by a structural
  check that counted **0** jars under `*/mods/`. The build now writes entries explicitly via
  `ZipFileExtensions::CreateEntryFromFile` and then **re-opens its own output** to confirm the jar
  count and that no entry contains a backslash.

- **Follow-ups:** revisit the layered-patch alternative once a custom layer exists. If the pack is
  ever published beyond a private group, revisit the redistribution question first.
