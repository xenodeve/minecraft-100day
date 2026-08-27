# ADR 0005 — Thin distribution: we do not rehost other people's jars

- **Status:** Accepted (2026-08-27) — implemented
- **Area:** Infra · Distribution
- **Supersedes:** **ADR 0003** (self-contained single-file distribution), in part
- **Related:** #53, #72, `scripts/build/build-friend-pack.mjs`, `docs/distribution-licenses.md`,
  Distribution Spec §6, §14, §33–34, §36–37

## Context

ADR 0003 chose a self-contained 405 MB zip containing every jar, and **named its own revisit
trigger**:

> **Reference profile plus a small "custom layer" patch file.** This is the right shape *later*,
> once `config/` and `kubejs/` exist and are the thing changing between versions. It is not
> rejected — it is premature. Revisit when the custom layer is larger than a rounding error against
> 388 MB of jars.

and, under Follow-ups:

> revisit the layered-patch alternative once a custom layer exists. If the pack is ever published
> beyond a private group, revisit the redistribution question first.

**Both conditions have arrived**, and a third has appeared that ADR 0003 could not have known.

### 1. The custom layer exists

`config/` · `kubejs/` · `defaultconfigs/` · `resourcepacks/` — 72 files, **192 KB**.

By ADR 0003's own test that is **still** a rounding error: 0.05 % of 405 MB. **But the test was the
wrong one.** The custom layer is a rounding error by *size* and it is essentially **100 % of what
changes between versions**, because the mod list is deliberately pinned and hand-patched — which was
ADR 0003's own point 3.

So every patch reships **405 MB to deliver 192 KB**. That is a **~2000× amplification**, and it does
not improve as the pack matures; it gets worse.

### 2. The licence audit found the thing that actually settles it

#53 read all 108 project pages. The finding was **not** the licence list — it was that the authors
who write about modpacks mostly *permit* them, on a condition:

> **Serene Seasons** — "You may include this mod in a Modrinth-hosted modpack **as long as you do not
> rehost the mod and only use builds uploaded directly by us**…"

> **Entity Culling** — "Feel free to use this mod in your Modrinth and CurseForge-hosted modpacks…
> **Do not redistribute the JAR files anywhere else!**"

> **Subtle Effects** — ✅ *"Use this mod in modpacks with credit and one or more links"* · ❌
> *"Reupload/publish this mod to any website without explicit permission"*

**A self-contained zip rehosts every jar in it.** The conflict is between the *distribution model*
and the condition — not between the mod list and the licences — so it cannot be fixed by swapping
mods. ADR 0003 anticipated the *question* ("publishing this artifact publicly is a different act")
but treated it as a future problem for public release. It is not: `INSTALL.md` already described
handing the zip to friends.

### 3. ADR 0003's decisive argument has weakened

Its point 1 was that a reference profile means *"one file to download and then four manual steps to
finish."* That was a real cost when the alternative bought nothing. It is now the **cheaper** side of
a trade against a licensing exposure across 108 mods — and the four are a **one-time** step, while
patches recur.

## Decision

**Stop shipping other people's jars. Ship the manifest and our own layer; let each mod come from its
author.**

1. **`scripts/build/build-friend-pack.mjs` produces the artifact a friend receives.** It contains
   the packwiz manifest (`pack.toml`, `index.toml`, 108 metafiles with exact versions and hashes) and
   the pack-owned layer. **It contains zero jars**, and the build **refuses to emit** if any appear —
   that is the check, not a comment. **123 KB.**

2. **`packwiz-installer` resolves the mods on the friend's machine**, from each author's own upload,
   as a Prism pre-launch step. We rehost nothing.

3. **The four API-blocked mods become an explicit one-time manual step**, named with links in the
   archive's `README.txt`. Working around an author's own setting is not something to automate
   quietly — #61 already had to retract an overclaim about what that setting means, and the honest
   reading is that it is *at minimum* a signal to ask rather than route around.

4. **ADR 0003's self-contained instance is demoted, not deleted.** `build-instance.mjs` stays and
   still hash-verifies every jar. It is now the **internal test artifact** — the thing we boot and
   benchmark. It is not handed to anyone.

5. **Public release stays out of scope and must not block a private beta.** Modrinth's `.mrpack`
   restricts download URLs to its own CDN, GitHub and GitLab, so CurseForge-sourced mods cannot be
   referenced by URL there; CurseForge's own format needs its mods in the manifest and applies its
   platform rules to anything in `overrides/`. Both are real problems and **neither is a reason to
   delay three or four friends.**

## Alternatives considered

- **Keep self-contained and ask the affected authors.** Not rejected — it is simply slower, and it
  is the developer's call to make, not an agent's. Nothing here forecloses it.

- **Keep self-contained and drop the conflicting mods.** Rejected: it treats a distribution problem
  as a content problem, and the pack would lose Serene Seasons and Entity Culling — both structural.

- **Ship a `.mrpack`.** Correct for the Modrinth-hosted majority and unable to reference the
  CurseForge ones. Revisit at public release, not now.

- **Bundle only the permissively-licensed jars.** A 60/48 split whose boundary moves whenever an
  author edits a page, producing an artifact nobody can reason about.

## Consequences

- **Positive — the licensing conflict is gone by construction**, not by argument. There is nothing
  to permit, because we distribute nothing of theirs.

- **Positive — patches are ~123 KB.** What we author is what we ship. The `pre-launch` step
  reconciles the mod list, so a friend updating gets only the diff.

- **Positive — the install is now honest about its four manual steps** instead of routing around
  four authors' expressed settings.

- **Negative — the first install needs network and takes longer.** ADR 0003 bought "no network at
  import" and this gives it back. For a first install, once, against a recurring 405 MB patch cost.

- **Negative — a friend must configure a Prism pre-launch command.** One paste, written out in
  `README.txt`, and it is what makes updates cheap afterwards.

- **Negative — packwiz-installer is another moving part**, and it is fetched by the friend rather
  than bundled. Bundling it would reintroduce exactly the thing this ADR removes.

- **Unresolved and still the developer's — #53.** This makes the *friend* path defensible. It does
  not decide whether the pack may ever be published, and it does not obtain any author's permission.

- **Follow-ups.** Revisit at public release, when §33–34 need a platform format. If the developer
  obtains explicit permission from the affected authors, the self-contained artifact could be
  promoted back — this ADR would then be the record of why it was demoted, not a prohibition.
