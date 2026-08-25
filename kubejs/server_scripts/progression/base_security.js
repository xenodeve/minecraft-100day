// Industrial Civilization Survival — base breachability
//
// Main §14, in one sentence:
//     SecurityCraft ต้องถูก nerf หากมี block ที่ทำให้ enemy ไม่สามารถ breach ได้เลย
//
// WHAT WAS LOOKED FOR FIRST, AND IS NOT THERE
// `securitycraft-server.toml` has 40+ settings and NOT ONE of them lets a mob
// break a reinforced block. `allow_breaking_non_owned_blocks` is about other
// PLAYERS, and this pack has no PvP. There is no "mobs can breach" toggle to
// turn on, so §14 cannot be satisfied in config at all — which is worth
// writing down, because "we set the config" would otherwise read as done.
//
// SO THE NERF GOES WHERE IT CAN WORK: SCARCITY
// Two items make a base categorically unbreachable rather than merely tough:
//
//   universal_block_reinforcer_lvl1 — turns any block into a reinforced one,
//     which mobs cannot break by any means. Stock cost is 2 diamonds, a laser
//     block, redstone and glass: reachable around day 15, and from then on the
//     player has unlimited unbreachable walls.
//
//   block_pocket_manager — seals a whole cube. This is §14's case in its
//     purest form: not a strong wall, an absence of a wall to attack.
//
// Both move onto the same Create ladder as the guns (#30), so a fortified base
// is something the FACTORY produces, arriving at the point §18 actually calls
// for it — "Day 70-100: Railway, Fortified city, Heavy defensive weapons" —
// rather than fifty days early.
//
// lvl2 and lvl3 need reinforced blocks to build, so they are gated
// transitively by lvl1 and are left alone.
//
// WHAT IS DELIBERATELY NOT NERFED
// Sentries, lasers, mines, tasers and cameras are all untouched. §14's own
// diagram ENDS in "Defensive Response" — automated defence is the design, and
// the thing it forbids is a base with nothing to defend, not a base that
// defends itself.

ServerEvents.recipes(event => {
  // Reinforced blocks become an industrial product: T2, alongside the assault
  // rifles that arrive in the same phase.
  event.remove({ id: 'securitycraft:universal_block_reinforcer_lvl1' })
  event.shaped('securitycraft:universal_block_reinforcer_lvl1', [
    ' DG',
    'RLD',
    'SR '
  ], {
    D: 'create:precision_mechanism',
    G: '#forge:ingots/steel',
    L: 'securitycraft:laser_block',
    R: '#forge:dusts/redstone',
    S: '#forge:rods/wooden'
  }).id('securitycraft:universal_block_reinforcer_lvl1')

  // The sealed cube is T3 — the last thing a civilisation builds, not the
  // first.
  event.remove({ id: 'securitycraft:block_pocket_manager' })
  event.shaped('securitycraft:block_pocket_manager', [
    'CIC',
    'IRI',
    'CIC'
  ], {
    C: 'securitycraft:reinforced_crystal_quartz_block',
    I: 'immersiveengineering:component_steel',
    R: 'create:electron_tube'
  }).id('securitycraft:block_pocket_manager')

  console.info('[ICS] base-security recipes gated onto the Create ladder')
})
