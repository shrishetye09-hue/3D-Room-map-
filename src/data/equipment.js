/*
 * IT equipment shown in the room – SAMPLE DATA.
 * Replace these values with the real inventory details.
 *
 * `pos` / `faces` are sketch-px points (see layout.js): where the item sits on its desk,
 * and the point its front turns toward (usually the user's chair).
 */
import { workstations } from './layout'

const DESKTOP_MODELS = [
  { brand: 'Dell', model: 'OptiPlex 7010' },
  { brand: 'HP', model: 'ProDesk 400 G9' },
  { brand: 'Lenovo', model: 'ThinkCentre M70s' },
  { brand: 'Acer', model: 'Veriton M4690G' },
]

const pad = (n) => String(n).padStart(2, '0')
const sampleSerial = (prefix, n) => `${prefix}${(734911 + n * 7919).toString(36).toUpperCase()}`

// One desktop per workstation, numbered like the badges on the plan.
const desktops = workstations.map((w, i) => {
  const { brand, model } = DESKTOP_MODELS[i % DESKTOP_MODELS.length]
  return {
    id: `PC-${pad(w.id)}`,
    type: 'desktop',
    name: `Desktop ${w.id}`,
    brand,
    model,
    inventoryNo: `IT/DT/${pad(w.id)}`,
    serialNo: sampleSerial(brand.slice(0, 2).toUpperCase(), w.id),
    pos: w.pc,
    faces: w.chair,
  }
})

// Placeholder positions in the cabin – move them to where they really are.
const others = [
  {
    id: 'LT-01', type: 'laptop', name: 'Laptop – Cabin',
    brand: 'Apple', model: 'MacBook Air 13" M2',
    inventoryNo: 'IT/LT/01', serialNo: 'C02XK1ABQ6L4',
    pos: [482, 266], faces: [478, 306],
  },
  {
    id: 'PR-01', type: 'printer', name: 'Printer – Cabin',
    brand: 'HP', model: 'LaserJet Pro M404dn',
    inventoryNo: 'IT/PR/01', serialNo: 'PHBQK40512',
    pos: [522, 264], faces: [500, 306],
  },
  {
    id: 'SC-01', type: 'scanner', name: 'Scanner – Cabin',
    brand: 'Canon', model: 'imageFORMULA DR-C225 II',
    inventoryNo: 'IT/SC/01', serialNo: 'GD2-71830',
    pos: [436, 266], faces: [436, 306],
  },
]

export const equipment = [...desktops, ...others]

export const TYPE_LABELS = {
  desktop: 'Desktop computer',
  laptop: 'Laptop',
  printer: 'Printer',
  scanner: 'Scanner',
}
