// Industrial Civilization Survival — TaCZ gun progression
//
// Main §3.2 tags TaCZ `HEAVY CUSTOM BALANCE` and names six axes that must be
// customised: Damage · Ammo cost · Recipes · Availability · Attachments ·
// Progression. This file is three of them — Recipes, Availability and
// Progression — because in TaCZ they are the same lever: a gun you cannot
// build is a gun you do not have.
//
// WHY KUBEJS AND NOT THE GUN PACK
// TaCZ ships its recipes inside tacz/tacz_default_gun/, and tacz-pre.toml
// `DefaultPackDebug = false` means the mod REWRITES that folder on every
// launch. Owning it would mean committing 84 MB of models and textures and
// flipping a debug flag. Measured instead: 173 gunsmith-table recipes are
// visible to the vanilla recipe manager, so KubeJS controls them outright and
// none of that is necessary.
//
// THE LADDER, and where it comes from
// §18's own progression, one tier per phase:
//   Day 1–20    "Survival / Casual gear / Primitive guns"
//   Day 20–45   "MineColonies / Create workshop / Basic ammunition"
//   Day 45–70   "Ammunition industry / Better firearms"
//   Day 70–100  "Railway / Fortified city / Heavy defensive weapons"
// Rule 1 makes Create the backbone, so each tier is gated on the Create item
// that phase is actually about — andesite alloy, then precision mechanism,
// then steel and electron tubes. A gun is not gated by a number; it is gated
// by a factory the player had to build.
//
// Stock AK-47: 38 iron, 6 lapis, 10 logs. Buildable on day two with a stone
// pickaxe, which is the whole problem.

const IRON = { tag: 'forge:ingots/iron' }
const COPPER = { tag: 'forge:ingots/copper' }
const STEEL = { tag: 'forge:ingots/steel' }
const LOGS = { tag: 'minecraft:logs' }
const ANDESITE = { item: 'create:andesite_alloy' }
const IRON_SHEET = { item: 'create:iron_sheet' }
const BRASS_SHEET = { item: 'create:brass_sheet' }
const PRECISION = { item: 'create:precision_mechanism' }
const ELECTRON = { item: 'create:electron_tube' }
const IE_STEEL_PART = { item: 'immersiveengineering:component_steel' }

const COST = {
  // Tier 0 — field-expedient. Iron, copper, wood. No Create at all: this is
  // what an ordinary human makes before there is a factory.
  t0_sidearm: [[IRON, 16], [COPPER, 4]],
  t0_long: [[IRON, 24], [COPPER, 4], [LOGS, 10]],

  // Tier 1 — workshop. Andesite alloy is the first thing a Create player
  // makes in bulk, so it is the first honest gate.
  t1_sidearm: [[IRON, 20], [ANDESITE, 4], [IRON_SHEET, 4]],
  t1_long: [[IRON, 28], [ANDESITE, 6], [IRON_SHEET, 8]],

  // Tier 2 — industry. A precision mechanism needs a whole assembly line.
  t2: [[IRON, 32], [BRASS_SHEET, 10], [PRECISION, 2]],

  // Tier 3 — heavy industry. Steel means Immersive Engineering is running,
  // which means §3.11's electrical layer exists.
  t3: [[STEEL, 24], [BRASS_SHEET, 12], [PRECISION, 4], [ELECTRON, 2], [IE_STEEL_PART, 4]],
  t3_heavy: [[STEEL, 32], [BRASS_SHEET, 16], [PRECISION, 6], [ELECTRON, 4], [IE_STEEL_PART, 8]]
}

const TIERS = {
  // Day 1–20 — revolvers, break-action, bolt-action. Slow, simple, honest.
  t0_sidearm: ['taurus943', 'rhino357', 'glock_17', 'm9a4', 'cz75', 'b93r', 'm1911', 'p320', 'hk_mk23'],
  t0_long: ['db_short', 'db_long', 'springfield1873', 'kar98', 'lonetrail', 'm700'],

  // Day 20–45 — magnums, submachine guns, pump shotguns, the first semi-autos.
  t1_sidearm: ['deagle', 'deagle_golden', 'timeless50', 'taurus500'],
  t1_long: ['uzi', 'hk_mp5a5', 'ump45', 'vector45', 'p90', 'sks_tactical', 'm16a1', 'm870', 'm1014', 'spas_12'],

  // Day 45–70 — assault rifles and the first precision optic platform.
  t2: ['ak47', 'type_81', 'm4a1', 'm16a4', 'hk416d', 'aug', 'g36k', 'scar_l', 'qbz_95', 'qbz_191', 'spr15hb', 'aa12', 'ai_awp'],

  // Day 70–100 — battle rifles and belt-fed. §18: "heavy defensive weapons".
  t3: ['hk_g3', 'fn_fal', 'scar_h', 'mk14', 'm249', 'rpk', 'fn_evolys'],

  // The four that end an argument. Anti-materiel and explosive.
  t3_heavy: ['m95', 'm107', 'minigun', 'm320', 'rpg7']
}

ServerEvents.recipes(event => {
  let rebuilt = 0

  Object.keys(TIERS).forEach(tier => {
    const materials = COST[tier].map(pair => ({ item: pair[0], count: pair[1] }))

    TIERS[tier].forEach(gun => {
      const id = 'tacz:gun/' + gun
      event.remove({ id: id })
      event.custom({
        type: 'tacz:gun_smith_table_crafting',
        materials: materials,
        result: { type: 'gun', id: 'tacz:' + gun }
      }).id(id)
      rebuilt++
    })
  })

  console.info('[ICS] TaCZ gun recipes re-tiered: ' + rebuilt)
})
