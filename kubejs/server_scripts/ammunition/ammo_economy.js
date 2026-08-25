// Industrial Civilization Survival — the ammunition economy
//
// Main §2 Rule 4:
//     Early game:  100 rounds   = valuable
//     Mid game:    1,000 rounds = requires workshop
//     Late game:   10,000+      = requires industrial ammunition plant
//     "โรงงานผลิตกระสุนคือ Core Gameplay"
//
// §8 then sketches the production chain it wants:
//     Brass Sheet -> form casing -> insert projectile -> add propellant
//                 -> crimp -> cartridge
//
// THAT CHAIN ALREADY EXISTS, and this file exists because of it.
//
// TaCZ: Creatified (tacz_c, already CORE in this pack) ships 96 recipes that
// are §8 almost line for line:
//     create:brass_sheet -> cutting -> thin_brass_sheet -> cutting -> brass_cup
//       -> brass_cylinder -> annealing -> annealed_brass_cylinder
//       -> cutting -> case_<calibre>
//       -> sequenced_assembly: deploy primer, deploy gunpowder grains
//       -> casefull_<calibre>
//       -> sequenced_assembly: deploy bullet, deploy bullet, press
//       -> tacz:ammo
// plus gunpowder cake / grains / pellets, primers, wads, and separate
// assemblies for 40mm grenades and RPG warheads.
//
// So nothing here needs to BUILD the ammunition plant. What it needs to do is
// make the plant worth building — because the gunsmith table currently hands
// you 50 rounds of 9mm for 10 copper and 2 gunpowder, and no factory competes
// with that.
//
// THE RULE, and it is one rule rather than 24 hand-written tables:
//   hand-loading yields a SIXTH of the rounds for HALF AGAIN the materials.
// About nine times the cost per round. 100 rounds of 9mm goes from 20 copper
// to roughly 190 — which is what Rule 4 means by "valuable" on day 10, and
// what makes the Create line obviously correct by day 40.
//
// Stating it as a transformation rather than a table has one property that
// matters: a calibre TaCZ adds next year is covered on the day it ships, and
// cannot quietly reopen the shortcut.
//
// THE EXCEPTION, and it is evidence, not a fudge:
// tacz_c has no case for .22 WMR or .500 Magnum. For those two the gunsmith
// table is not a shortcut past the factory — it is the ONLY path. Nerfing them
// like the rest would delete the ammunition rather than industrialise it, so
// they take a third of the reduction. If tacz_c adds those cases, delete the
// exception.

const NO_CREATE_PATH = ['tacz:22wmr', 'tacz:500mag']

const DIVISOR_INDUSTRIAL = 6   // a Create line exists for this calibre
const DIVISOR_ORPHAN = 3       // it does not; hand-loading is the only path
const INPUT_MULTIPLIER = 1.5

ServerEvents.recipes(event => {
  const targets = []

  event.forEachRecipe({ type: 'tacz:gun_smith_table_crafting' }, r => {
    const json = JSON.parse(r.json.toString())
    if (!json.result || json.result.type !== 'ammo') return
    targets.push({ id: String(r.getId()), json: json })
  })

  targets.forEach(t => {
    const json = t.json
    const orphan = NO_CREATE_PATH.indexOf(json.result.id) !== -1
    const divisor = orphan ? DIVISOR_ORPHAN : DIVISOR_INDUSTRIAL

    const oldCount = json.result.count || 1
    // never round a small yield UP -- an RPG rocket at 3 per craft must not
    // become 4 because the arithmetic was careless.
    const newCount = Math.max(1, Math.min(oldCount, Math.round(oldCount / divisor)))

    const materials = json.materials.map(m => ({
      item: m.item,
      count: Math.ceil(m.count * INPUT_MULTIPLIER)
    }))

    const result = { type: 'ammo', id: json.result.id, count: newCount }
    if (json.result.group) result.group = json.result.group

    event.remove({ id: t.id })
    event.custom({
      type: 'tacz:gun_smith_table_crafting',
      materials: materials,
      result: result
    }).id(t.id)
  })

  console.info('[ICS] hand-loading recipes re-costed: ' + targets.length)
})
