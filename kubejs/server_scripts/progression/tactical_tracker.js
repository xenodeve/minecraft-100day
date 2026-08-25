// Industrial Civilization Survival — the tactical tracker
//
// Crafting Spec §17 brings Player Microchip in as the tracker base mod, tagged
// `CUSTOM AESTHETIC` + `CUSTOM RECIPE`, and §19 says why:
//
//     Base mod concept เดิม: Microchip implant
//     ไม่ตรง aesthetic ของ pack
//     ให้ reinterpret เป็น: Tactical Position Beacon
//
// §20 is blunter — the thing should look like it clips to a plate carrier,
// a belt or a radio pouch. "ไม่ใช่ cybernetic implant".
//
// The rename lives in kubejs/assets/player_tracking_chip/lang/en_us.json,
// which KubeJS applies as an always-on resource pack. A pack in
// resourcepacks/ would need the player to enable it, and a tracker whose name
// depends on someone ticking a checkbox is not re-themed.
//
//     tracking_chip   Microchip       -> Tactical Position Beacon
//     player_tracker  Player Tracker  -> Personnel Tracking Device
//     scalpel         Scalpel         -> Beacon Programmer
//
// The scalpel matters most. A scalpel IS the implant aesthetic §20 rejects; as
// a programmer it becomes the thing that pairs a beacon to whoever is wearing
// it, which is what §21's frequency system already describes.
//
// RECIPES — §25 gives the ingredients outright, and then warns:
//
//     Exact item IDs: DO NOT ASSUME
//     ต้อง inspect registry จริงหลัง mods ถูกติดตั้ง
//
// So every id below was read out of the installed jars' own lang files:
// create:copper_sheet, create:electron_tube, create:precision_mechanism,
// create:brass_casing, immersiveengineering:component_electronic and
// immersiveengineering:circuit_board all exist. "Display Component" is not a
// registered name in either mod — circuit_board is the closest real item and
// is named here rather than guessed at.
//
// Stock recipes were iron, redstone and echo shards. An echo shard is an
// Ancient City trip, which is a real gate but the wrong KIND: §25 requires
// "Industrial Electronics Progression", and §24 puts the beacon at Mid Game,
// after the radio. Iron and a souvenir from a cave is not that.

// GUARDED, and the boot test is why.
//
// Player Microchip is one of the four mods CurseForge blocks from its API,
// so a friend installs it BY HAND (see INSTALL.md). A player who skips that
// step used to get three red lines in their log:
//
//   [ERROR] tactical_tracker.js#55: Failed to create recipe for type
//           'kubejs:shaped': ItemStack 'result' can't be empty!
//
// KubeJS reported "3 failed recipes" and carried on, which is the worst shape
// of failure: nothing breaks, the log looks broken, and the player has no way
// to tell an optional mod from a corrupt pack.
//
// Platform.isLoaded is checked at the top rather than per recipe, because if
// the mod is absent there is nothing here worth running at all.

ServerEvents.recipes(event => {
  if (!Platform.isLoaded('player_tracking_chip')) return

  // The programmer — pairs a beacon to a wearer. Cheap on purpose: it is a
  // tool, not a tier.
  event.remove({ id: 'player_tracking_chip:scalpel_recipe' })
  event.shaped('player_tracking_chip:scalpel', [
    'CI',
    'RI',
    ' I'
  ], {
    C: 'create:copper_sheet',
    I: '#forge:ingots/iron',
    R: '#forge:dusts/redstone'
  }).id('player_tracking_chip:scalpel_recipe')

  // Tactical Position Beacon — §24 "Mid Game: เริ่ม transmit position".
  // Needs a precision mechanism, so it arrives with the same factory that
  // builds the T2 rifles (#30).
  event.remove({ id: 'player_tracking_chip:tracking_chip_recipe' })
  event.shaped('player_tracking_chip:tracking_chip', [
    'CTC',
    'EPE',
    'CRC'
  ], {
    C: 'create:copper_sheet',
    T: 'create:electron_tube',
    E: 'immersiveengineering:component_electronic',
    P: 'create:precision_mechanism',
    R: '#forge:dusts/redstone'
  }).id('player_tracking_chip:tracking_chip_recipe')

  // Personnel Tracking Device — §24 "Mid/Late", carried by squad leader,
  // recon, command, rescue. The reader is rarer than the beacon it reads:
  // brass casing and circuit boards mean Create AND Immersive Engineering are
  // both running.
  event.remove({ id: 'player_tracking_chip:tracker_recipe' })
  event.shaped('player_tracking_chip:player_tracker', [
    'BTB',
    'DPD',
    'BRB'
  ], {
    B: 'create:brass_casing',
    T: 'create:electron_tube',
    D: 'immersiveengineering:circuit_board',
    P: 'create:precision_mechanism',
    R: '#forge:dusts/redstone'
  }).id('player_tracking_chip:tracker_recipe')

  console.info('[ICS] tactical tracker re-themed and re-costed')
})
