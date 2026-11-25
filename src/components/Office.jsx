import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import Room from './Room'
import { EquipmentItem } from './Equipment'
import { Desk, CornerDesk, Cupboard, Sofa, Table, Chair } from './Furniture'
import {
  toWorld, desks, cornerDesks, cupboards, storageBoxes, sofas, teapoys, stands,
  looseChairs, workstations, areaLabels,
} from '../data/layout'
import { equipment } from '../data/equipment'

function Label({ at, y = 1.9, children, variant = 'area' }) {
  const [x, z] = toWorld(at)
  return (
    <Html position={[x, y, z]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`label label-${variant}`}>{children}</div>
    </Html>
  )
}

// Labels mount one tick after the scene: drei <Html> drops the very first
// instance if it mounts before the canvas is attached to the page.
function Labels() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return (
    <>
      {workstations.map((w) => <Label key={w.id} at={w.pc} y={1.35} variant="pc">{w.id}</Label>)}
      {areaLabels.map((l) => <Label key={l.text} at={l.at}>{l.text}</Label>)}
    </>
  )
}

export default function Office({ showLabels, selectedId, onSelect }) {
  return (
    <group>
      <Room />

      {desks.map((r, i) => <Desk key={`d${i}`} rect={r} />)}
      {cornerDesks.map((pts, i) => <CornerDesk key={`cd${i}`} points={pts} />)}
      {cupboards.map((c, i) => <Cupboard key={`c${i}`} rect={c.rect} h={c.h} />)}
      {storageBoxes.map((s, i) => <Cupboard key={`s${i}`} rect={s.rect} h={s.h} />)}
      {sofas.map((s, i) => <Sofa key={`so${i}`} rect={s.rect} />)}
      {teapoys.map((t, i) => <Table key={`t${i}`} rect={t.rect} />)}
      {stands.map((r, i) => <Table key={`st${i}`} rect={r} h={0.7} color="#cfc8bc" />)}
      {looseChairs.map((c, i) => <Chair key={`lc${i}`} pos={c.pos} faces={c.faces} />)}

      {workstations.map((w) => (
        <group key={w.id}>
          {w.desk && <Desk rect={w.desk} />}
          <Chair pos={w.chair} faces={w.pc} />
        </group>
      ))}

      {equipment.map((item) => (
        <EquipmentItem key={item.id} item={item} selected={item.id === selectedId} onSelect={onSelect} />
      ))}

      {showLabels && <Labels />}
    </group>
  )
}
