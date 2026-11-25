import { useMemo } from 'react'
import * as THREE from 'three'
import { toWorld, rectToWorld } from '../data/layout'
import { COLORS, HEIGHTS } from '../theme'

/** Angle (around Y) that turns an object's local +Z toward sketch point `to`. */
export const facing = (from, to) => {
  const [ax, az] = toWorld(from)
  const [bx, bz] = toWorld(to)
  return Math.atan2(bx - ax, bz - az)
}

function Box({ rect, y = 0, h, color, ...rest }) {
  const { cx, cz, w, d } = rectToWorld(rect)
  return (
    <mesh position={[cx, y + h / 2, cz]} castShadow receiveShadow {...rest}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Desk({ rect }) {
  const H = HEIGHTS.desk
  return (
    <group>
      <Box rect={rect} y={H - 0.04} h={0.04} color={COLORS.deskTop} />
      <Box rect={rect} y={0} h={H - 0.04} color={COLORS.deskBody} scale={[0.94, 1, 0.9]} />
    </group>
  )
}

export function CornerDesk({ points }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map((p) => {
      const [x, z] = toWorld(p)
      return new THREE.Vector2(x, -z)
    }))
    return new THREE.ExtrudeGeometry(shape, { depth: HEIGHTS.desk, bevelEnabled: false })
  }, [points])
  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} castShadow receiveShadow>
      <meshStandardMaterial color={COLORS.deskTop} />
    </mesh>
  )
}

export function Cupboard({ rect, h }) {
  const { cx, cz, w, d } = rectToWorld(rect)
  return (
    <group>
      <Box rect={rect} h={h} color={COLORS.cupboard} />
      {/* top trim */}
      <mesh position={[cx, h + 0.01, cz]}>
        <boxGeometry args={[w + 0.02, 0.02, d + 0.02]} />
        <meshStandardMaterial color={COLORS.cupboardLine} />
      </mesh>
    </group>
  )
}

export function Sofa({ rect }) {
  const { cx, cz, w, d } = rectToWorld(rect)
  // Sofa sits against the right wall, facing west (−X).
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[w, 0.44, d]} />
        <meshStandardMaterial color={COLORS.sofa} />
      </mesh>
      <mesh position={[w / 2 - 0.08, 0.5, 0]} castShadow>
        <boxGeometry args={[0.16, 0.6, d]} />
        <meshStandardMaterial color={COLORS.sofa} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.34, s * (d / 2 - 0.07)]} castShadow>
          <boxGeometry args={[w, 0.24, 0.14]} />
          <meshStandardMaterial color={COLORS.sofa} />
        </mesh>
      ))}
    </group>
  )
}

export function Table({ rect, h = 0.45, color = COLORS.wood }) {
  const { cx, cz, w, d } = rectToWorld(rect)
  const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {legs.map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (w / 2 - 0.04), (h - 0.04) / 2, sz * (d / 2 - 0.04)]}>
          <boxGeometry args={[0.04, h - 0.04, 0.04]} />
          <meshStandardMaterial color={COLORS.pillar} />
        </mesh>
      ))}
    </group>
  )
}

export function Chair({ pos, faces }) {
  const [x, z] = toWorld(pos)
  return (
    <group position={[x, 0, z]} rotation-y={facing(pos, faces)}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.44]} />
        <meshStandardMaterial color={COLORS.pillar} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 5]} />
        <meshStandardMaterial color={COLORS.pillar} />
      </mesh>
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.46, 0.07, 0.44]} />
        <meshStandardMaterial color={COLORS.chair} />
      </mesh>
      <mesh position={[0, 0.78, -0.21]} castShadow>
        <boxGeometry args={[0.44, 0.52, 0.06]} />
        <meshStandardMaterial color={COLORS.chair} />
      </mesh>
    </group>
  )
}
