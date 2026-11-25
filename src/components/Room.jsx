import { useMemo } from 'react'
import {
  toWorld, rectToWorld, outerWalls, glassWalls, partitions, lowPartitions,
  pillars, darkPanels, door,
} from '../data/layout'
import { COLORS, HEIGHTS } from '../theme'

/** A straight box running from sketch point `a` to sketch point `b`. */
export function Segment({ a, b, height, thickness, color, y = 0, ...mat }) {
  const { pos, len, rot } = useMemo(() => {
    const [ax, az] = toWorld(a)
    const [bx, bz] = toWorld(b)
    const dx = bx - ax
    const dz = bz - az
    return {
      pos: [(ax + bx) / 2, y + height / 2, (az + bz) / 2],
      len: Math.hypot(dx, dz) + thickness, // overlap corners
      rot: Math.atan2(-dz, dx),
    }
  }, [a, b, height, thickness, y])

  return (
    <mesh position={pos} rotation-y={rot} castShadow receiveShadow>
      <boxGeometry args={[len, height, thickness]} />
      <meshStandardMaterial color={color} {...mat} />
    </mesh>
  )
}

const segmentsOf = (polyline) => polyline.slice(1).map((p, i) => [polyline[i], p])

function Polyline({ points, ...props }) {
  return segmentsOf(points).map(([a, b], i) => <Segment key={i} a={a} b={b} {...props} />)
}

/** Wooden wall, lower half solid wood, upper half black privacy glass. */
function GlassWall({ points }) {
  const { wall, woodBase, glass, top } = HEIGHTS.glassWall
  return segmentsOf(points).map(([a, b], i) => (
    <group key={i}>
      <Segment a={a} b={b} height={woodBase} thickness={0.12} color={COLORS.wood} />
      <Segment a={a} b={b} y={woodBase} height={glass} thickness={0.05}
        color={COLORS.glass} transparent opacity={0.82} roughness={0.08} metalness={0.4} />
      <Segment a={a} b={b} y={wall - top} height={top} thickness={0.12} color={COLORS.wood} />
    </group>
  ))
}

function Door() {
  const [ax, az] = toWorld(door.from)
  const [bx] = toWorld(door.to)
  const width = bx - ax
  return (
    <group>
      {/* threshold */}
      <mesh position={[ax + width / 2, 0.006, az]} receiveShadow>
        <boxGeometry args={[width, 0.012, 0.2]} />
        <meshStandardMaterial color={COLORS.doorFrame} />
      </mesh>
      {/* leaf, swung open inward, hinged on the left jamb (as drawn) */}
      <group position={[ax, 0, az]} rotation-y={-Math.PI / 2 + 0.25}>
        <mesh position={[width / 2, 0.6, 0.025]} castShadow>
          <boxGeometry args={[width, 1.2, 0.05]} />
          <meshStandardMaterial color={COLORS.door} />
        </mesh>
      </group>
      {/* floor marker showing the entrance */}
      <mesh position={[ax + width / 2, 0.004, az + 0.45]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.22, 3]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
    </group>
  )
}

function Floor() {
  const { cx, cz, w, d } = rectToWorld([138, 242, 865, 770])
  return (
    <group>
      {/* plinth under the model */}
      <mesh position={[cx, -0.15, cz]} receiveShadow>
        <boxGeometry args={[w + 0.6, 0.3, d + 0.6]} />
        <meshStandardMaterial color={COLORS.plinth} />
      </mesh>
      <mesh position={[cx, 0.001, cz]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={COLORS.floor} />
      </mesh>
    </group>
  )
}

export default function Room() {
  const H = HEIGHTS
  return (
    <group>
      <Floor />
      {outerWalls.map((pts, i) => (
        <Polyline key={i} points={pts} height={H.outerWall} thickness={0.18} color={COLORS.wall} />
      ))}
      {glassWalls.map((pts, i) => <GlassWall key={i} points={pts} />)}
      {partitions.map((pts, i) => (
        <Polyline key={i} points={pts} height={H.partition} thickness={0.08} color={COLORS.partition} />
      ))}
      {lowPartitions.map((pts, i) => (
        <group key={i}>
          <Polyline points={pts} height={H.lowPartition} thickness={0.05} color={COLORS.screen} />
          {/* dark wood top rail, as on the real cubicles */}
          <Polyline points={pts} y={H.lowPartition} height={0.04} thickness={0.07} color={COLORS.cubicleFrame} />
        </group>
      ))}
      {pillars.map((r, i) => {
        const { cx, cz, w, d } = rectToWorld(r)
        return (
          <mesh key={i} position={[cx, H.outerWall / 2, cz]} castShadow>
            <boxGeometry args={[w, H.outerWall, d]} />
            <meshStandardMaterial color={COLORS.pillar} />
          </mesh>
        )
      })}
      {darkPanels.map((r, i) => {
        const { cx, cz, w, d } = rectToWorld(r)
        return (
          <mesh key={i} position={[cx, H.partition / 2, cz]} castShadow>
            <boxGeometry args={[w, H.partition, d]} />
            <meshStandardMaterial color={COLORS.pillar} />
          </mesh>
        )
      })}
      <Door />
    </group>
  )
}
