// Industrial Civilization Survival — JEI hide list
//
// Crafting Spec §6 forbids one specific piece of UX:
//
//     JEI shows item -> Player clicks recipe -> No valid recipe
//
// and the rule that prevents it:
//
//     ถ้า item intentionally unavailable:  Hide from JEI
//
// with three exceptions that should stay VISIBLE and carry a tooltip instead —
// loot-only, quest reward, worldgen-only.
//
// THIS LIST IS EMPTY, AND THAT IS THE CORRECT STATE TODAY.
//
// Nothing in this pack has been made unavailable. Every recipe this repo
// touches was RE-COSTED or RE-GATED, never deleted:
//
//   #30  54 TaCZ guns   removed and re-added at a different tier
//   #31  24 hand-loads  removed and re-added at a different cost
//   #32  2 SecurityCraft items  removed and re-added behind Create
//
// The boot log corroborates it: "Added 80 recipes, removed 79 recipes". The
// 80th is `taurus943`, which had NO recipe at all and now has one — the
// loot-only case from §6, resolved by making it craftable rather than by
// adding a tooltip.
//
// WHEN THIS FILE STOPS BEING EMPTY
// The moment a recipe is removed without a replacement. That is not a matter
// of remembering: `scripts/validate/verify.mjs` fails the ship gate when a
// literal recipe id is removed in kubejs/server_scripts/ and neither re-added
// nor named here. Add the item below AND leave the id in a comment so the
// guard can see it.
//
// Example, for when it is needed:
//     JEIEvents.hideItems(event => {
//       event.hide('somemod:removed_item')   // recipe id: somemod:removed_item
//     })

JEIEvents.hideItems(event => {
  // Nothing is hidden. See above — this is a claim about the pack, not an
  // oversight, and the ship gate enforces it.
})
