/*
 * Room layout traced from the hand-drawn reference sketch.
 *
 * All coordinates are in SKETCH PIXELS (x → right, y → down, as on the paper),
 * so every item can be checked directly against the drawing.
 * `toWorld` converts them to metres: 50 sketch px ≈ 1 m  → room ≈ 14.5 m × 10.6 m.
 *
 * Rects are [x1, y1, x2, y2]. Points are [x, y]. Polylines are arrays of points.
 */

export const SCALE = 0.02 // metres per sketch pixel
const ORIGIN = [501.5, 506] // centre of the room in sketch px

export const toWorld = ([x, y]) => [(x - ORIGIN[0]) * SCALE, (y - ORIGIN[1]) * SCALE]

export const rectToWorld = ([x1, y1, x2, y2]) => {
  const [ax, az] = toWorld([x1, y1])
  const [bx, bz] = toWorld([x2, y2])
  return { cx: (ax + bx) / 2, cz: (az + bz) / 2, w: Math.abs(bx - ax), d: Math.abs(bz - az) }
}

/*
 * RIGHT SIDE – traced from the second reference drawing (right-side close-up).
 * Its coordinates are converted into main-sketch px with fixed anchors, so the
 * left compartment keeps its coordinates untouched:
 *   x: centre-block left wall (70) → 390, right wall (722) → 865
 *   y: top wall (265) → 242, centre-block top (660) → 495, bottom wall (895) → 770
 */
const rx = (x) => 390 + (x - 70) * (475 / 652)
const ry = (y) => (y <= 660 ? 242 + (y - 265) * (253 / 395) : 495 + (y - 660) * (275 / 235))
const R = ([x, y]) => [Math.round(rx(x)), Math.round(ry(y))]
const RR = ([x1, y1, x2, y2]) => [...R([x1, y1]), ...R([x2, y2])]
const RP = (points) => points.map(R)

// Third drawing (close-up of 10 / 13 / 14): block wall (145) → 390, block top (190) → 495, bottom wall (400) → 770.
const B = ([x, y]) => [Math.round(390 + (x - 145) * 0.885), Math.round(495 + (y - 190) * (275 / 210))]
const BP = (points) => points.map(B)

/* ---------------------------------------------------------------- walls */

// Outer room walls. Gap between x=328 and x=382 on the top wall is the entrance door.
// Bottom-right corner is square (right-side drawing).
export const outerWalls = [
  [[328, 242], [138, 242], [138, 770], [865, 770], [865, 242], [382, 242]],
]

export const door = { from: [328, 242], to: [382, 242] }

// Wooden wall with half black privacy glass (left side of the top cabin).
export const glassWalls = [[[390, 242], [390, 442]]]

// Full-height office partitions.
export const partitions = [
  // centre block: left wall (shared with the left compartment) and top wall
  [[390, 495], [390, 770]],
  RP([[70, 660], [272, 660]]),
]

// Low workstation dividers (desk screens).
export const lowPartitions = [
  // left wall workstations
  [[140, 325], [205, 325]],
  [[140, 405], [205, 405]],
  [[140, 485], [205, 485]],
  [[140, 580], [205, 580]],
  [[140, 662], [205, 662]],
  // middle-left
  [[330, 600], [390, 600]],
  // right side: brown plank (third drawing)
  BP([[415, 285], [457, 285], [457, 400]]), // L around 14
  // side of compartment 16, and divider between 16 and 17
  RP([[675, 625], [675, 665]]),
  RP([[578, 747], [722, 747]]),
]

// Black filled marks in the sketch – rendered as dark columns / panels.
export const pillars = [
  RR([530, 265, 555, 325]), // between 18 and 19
  [...B([320, 355]), ...B([331, 400])], // bottom wall, in the 13–14 desk
]
export const darkPanels = [
  RR([283, 265, 295, 420]), // black partition: cabin | 18, down to the cupboards
  RR([630, 455, 722, 465]), // below compartment 19
  RR([570, 668, 582, 828]), // left side of 16 / 17
]

/* ------------------------------------------------------------ furniture */

export const desks = [
  // top cabin L-desk
  [418, 252, 547, 282], // extended right to meet 18's black partition
  [525, 282, 547, 342],
]

// Shaped desks (angled fronts, as drawn).
export const cornerDesks = [
  // 18 + 19: one long desk along the top wall, return beside the black partition and down the right wall
  RP([[296, 268], [296, 395], [350, 395], [350, 365], [375, 335], [430, 325], [610, 325],
    [670, 370], [678, 445], [719, 445], [719, 268]]),
  // 13 + 14: one long desk along the bottom wall around the pillar (like 18 + 19), angled ends
  BP([[147, 345], [215, 330], [235, 358], [385, 358], [415, 292], [455, 292], [455, 398], [147, 398]]),
  // continuation along the centre-block wall from 13's corner up to 10's desk (one complete desk)
  [[392, 498], [447, 498], [447, 539], [432, 539], [432, 685], [392, 698]],
  // 16
  RP([[583, 705], [650, 705], [675, 682], [675, 668], [719, 668], [719, 744], [583, 744]]),
  // 17
  RP([[583, 750], [719, 750], [719, 892], [690, 892], [690, 800], [670, 772], [583, 772]]),
]

export const cupboards = [
  { rect: [393, 337, 446, 440], h: 2.0, label: 'Cupboard' },
  { rect: RR([272, 622, 305, 700]), h: 1.8, label: 'Cupboard' }, // right of centre block
  { rect: RR([220, 420, 290, 475]), h: 1.8, label: 'Cupboard' }, // back-to-back pair under the black partition
  { rect: RR([290, 420, 380, 475]), h: 1.8, label: 'Cupboard' },
  { rect: [283, 705, 298, 768], h: 2.0, label: 'Cabinet' },
]

export const storageBoxes = [{ rect: [393, 252, 416, 335], h: 1.1, label: 'Storage box' }]

export const sofas = [{ rect: RR([682, 488, 720, 600]), facing: 'west', label: 'Sofa' }]
export const teapoys = [{ rect: RR([570, 512, 602, 572]), label: 'Teapoy' }]

// Small tables with legs (none on the right-side drawing; the cabin stand became cupboards).
export const stands = []

// Extra chair in the top cabin (at the L-desk).
export const looseChairs = [
  { pos: [478, 306], faces: [478, 270] },
]

/* --------------------------------------------------------- workstations */
// Each workstation: a desk rect, the computer position and the chair position.
// The monitor turns to face its chair and the chair turns to face the monitor.

export const workstations = [
  // Left wall, top → bottom
  { id: 1, desk: [140, 262, 188, 318], pc: [160, 285], chair: [212, 285] },
  { id: 2, desk: [140, 338, 188, 398], pc: [160, 368], chair: [212, 368] },
  { id: 3, desk: [140, 415, 188, 475], pc: [160, 440], chair: [212, 440] },
  { id: 4, desk: [140, 500, 188, 565], pc: [160, 527], chair: [210, 527] },
  { id: 5, desk: [140, 592, 188, 650], pc: [162, 622], chair: [210, 622] },
  { id: 6, desk: [140, 690, 195, 748], pc: [172, 720], chair: [218, 720] },
  // Middle-left, against the centre block
  { id: 7, desk: [345, 522, 388, 570], pc: [366, 545], chair: [315, 545] },
  { id: 8, desk: [345, 612, 388, 660], pc: [366, 638], chair: [315, 636] },
  { id: 9, desk: [328, 728, 376, 766], pc: [352, 742], chair: [348, 704] },
  // Right side (second drawing). No desktops 11 & 12.
  { id: 10, desk: RR([148, 664, 216, 698]), pc: R([182, 678]), chair: R([190, 740]) },
  { id: 13, pc: B([197, 360]), chair: B([260, 315]) },
  { id: 14, pc: B([432, 362]), chair: B([370, 335]) },
  // (no desktop 15)
  { id: 16, pc: R([690, 712]), chair: R([612, 652]) },
  { id: 17, pc: R([694, 805]), chair: R([655, 818]) },
  { id: 18, pc: R([338, 300]), chair: R([395, 372]) },
  { id: 19, pc: R([684, 298]), chair: R([600, 376]) },
]

/* --------------------------------------------------------------- labels */
export const areaLabels = [
  { at: [355, 232], text: 'Entrance' },
  { at: [455, 318], text: 'Cabin' },
  { at: R([701, 544]), text: 'Sofa' },
  { at: R([586, 542]), text: 'Teapoy' },
  { at: [404, 292], text: 'Storage' },
  { at: [420, 388], text: 'Cupboard' },
]
