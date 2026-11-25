import { useState } from 'react'
import { useCursor } from '@react-three/drei'
import Computer from './Computer'
import { facing } from './Furniture'
import { toWorld } from '../data/layout'
import { COLORS, HEIGHTS } from '../theme'

function Laptop() {
  return (
    <group>
      <mesh position={[0, 0.01, 0.02]} castShadow>
        <boxGeometry args={[0.34, 0.02, 0.24]} />
        <meshStandardMaterial color="#b8bcc4" />
      </mesh>
      {/* lid, opened ~105° */}
      <group position={[0, 0.02, -0.1]} rotation-x={-0.25}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.34, 0.22, 0.012]} />
          <meshStandardMaterial color="#b8bcc4" />
        </mesh>
        <mesh position={[0, 0.11, 0.007]}>
          <planeGeometry args={[0.31, 0.19]} />
          <meshStandardMaterial color={COLORS.monitorScreen} emissive={COLORS.monitorScreen} emissiveIntensity={0.35} />
        </mesh>
      </group>
    </group>
  )
}

function Printer() {
  return (
    <group>
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.38]} />
        <meshStandardMaterial color="#e4e6ea" />
      </mesh>
      <mesh position={[0, 0.265, -0.04]}>
        <boxGeometry args={[0.36, 0.012, 0.24]} />
        <meshStandardMaterial color="#3b3f46" />
      </mesh>
      {/* output tray */}
      <mesh position={[0, 0.12, 0.22]}>
        <boxGeometry args={[0.3, 0.015, 0.08]} />
        <meshStandardMaterial color="#c9ccd2" />
      </mesh>
    </group>
  )
}

function Scanner() {
  return (
    <group>
      <mesh position={[0, 0.045, 0]} castShadow>
        <boxGeometry args={[0.46, 0.09, 0.32]} />
        <meshStandardMaterial color="#d4d7dc" />
      </mesh>
      <mesh position={[0, 0.092, 0]}>
        <boxGeometry args={[0.4, 0.006, 0.26]} />
        <meshStandardMaterial color="#2a2d33" />
      </mesh>
    </group>
  )
}

// Model + invisible click target size [w, h, d] + target centre offset per type.
const TYPES = {
  desktop: { Model: Computer, hit: [1.05, 0.5, 0.55], hitAt: [0.15, 0.25, 0] },
  laptop: { Model: Laptop, hit: [0.42, 0.3, 0.34], hitAt: [0, 0.15, 0] },
  printer: { Model: Printer, hit: [0.48, 0.32, 0.5], hitAt: [0, 0.16, 0] },
  scanner: { Model: Scanner, hit: [0.52, 0.16, 0.38], hitAt: [0, 0.08, 0] },
}

/** One clickable piece of equipment, placed on a desk. */
export function EquipmentItem({ item, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const { Model, hit, hitAt } = TYPES[item.type]
  const [x, z] = toWorld(item.pos)
  const ring = Math.max(hit[0], hit[2]) / 2 + 0.06

  return (
    <group
      position={[x, HEIGHTS.desk, z]}
      rotation-y={facing(item.pos, item.faces)}
      onClick={(e) => {
        if (e.delta > 4) return // ignore the end of a camera drag
        e.stopPropagation()
        onSelect(item.id)
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <Model />
      {/* generous invisible hit box so small items are easy to click */}
      <mesh position={hitAt}>
        <boxGeometry args={hit} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {(hovered || selected) && (
        <mesh position={[hitAt[0], 0.006, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[ring - 0.05, ring, 48]} />
          <meshBasicMaterial color={COLORS.accent} transparent opacity={selected ? 0.95 : 0.5} />
        </mesh>
      )}
    </group>
  )
}
