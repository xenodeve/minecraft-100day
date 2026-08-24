---
name: rejected-mods-are-a-boundary-not-a-backlog
description: §6 of the handoff doc lists mods excluded by design; re-adding one requires a new stated reason as an ADR, not a preference
type: project
---

The handoff doc §6 rejects Waystones, Mekanism / Digital Miner, jetpacks and trivial flight,
Apotheosis, and the major magic systems (Ars Nouveau, Botania, Occultism) — plus TaCZ Juggernaut
Armoury, CCTVCraft, No Mindless Shooting and Scorched Guns 2 for narrower reasons.

Each rejection is a load-bearing design decision, not a shortlist that lost. Waystones and
jetpacks exist to be rejected: the whole railway, road, outpost and frontier-danger layer only
has meaning because travel is expensive. Mekanism's Digital Miner is rejected because it
bypasses the Consumption Economy the pack is built around.

**Why:** these are exactly the mods a future session will be tempted to add, because each one
individually solves a real friction the player is complaining about. The friction is the design.

**How to apply:** treat §6 as a boundary. Adding one back needs a **new** reason — something that
changed about the pack, not a preference — recorded as an ADR per `docs/adr/README.md`.
Related: [[create-version-is-the-pin]].
