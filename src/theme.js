export const COLORS = {
  background: '#eef1f5',
  plinth: '#d5dae1',
  floor: '#f2efea',
  tile: '#e0dbd3',
  wall: '#fbfbfa',
  partition: '#c9ced6',
  screen: '#d9c7a3', // cubicle fabric
  cubicleFrame: '#5e3d2b',
  wood: '#8a5a3b',
  glass: '#15181d',
  pillar: '#3a3f47',
  door: '#a06a43',
  doorFrame: '#6b4a33',
  accent: '#2f6fed',
  deskTop: '#eadfc6',
  deskBody: '#6b4733',
  cupboard: '#d9cbb6',
  cupboardLine: '#a8977f',
  chair: '#2f3540',
  sofa: '#46607a',
  monitor: '#1b1d21',
  monitorScreen: '#324a6e',
  tower: '#2a2d33',
}

// Heights in metres. Walls are kept low ("cut-away" model) so the room stays readable.
export const HEIGHTS = {
  outerWall: 1.2,
  partition: 1.2,
  lowPartition: 0.95,
  desk: 0.75,
  glassWall: { wall: 1.4, woodBase: 0.75, glass: 0.55, top: 0.1 },
}
