import { COLORS } from '../theme'

/** Desktop computer model: monitor + keyboard + tower. Front (screen) faces local +Z. */
export default function Computer() {
  return (
    <group>
      {/* stand */}
      <mesh position={[0, 0.01, -0.05]}>
        <boxGeometry args={[0.18, 0.02, 0.14]} />
        <meshStandardMaterial color={COLORS.monitor} />
      </mesh>
      <mesh position={[0, 0.1, -0.08]}>
        <boxGeometry args={[0.04, 0.18, 0.03]} />
        <meshStandardMaterial color={COLORS.monitor} />
      </mesh>
      {/* monitor */}
      <mesh position={[0, 0.3, -0.06]} castShadow>
        <boxGeometry args={[0.56, 0.34, 0.03]} />
        <meshStandardMaterial color={COLORS.monitor} />
      </mesh>
      <mesh position={[0, 0.3, -0.044]}>
        <planeGeometry args={[0.52, 0.3]} />
        <meshStandardMaterial color={COLORS.monitorScreen} emissive={COLORS.monitorScreen} emissiveIntensity={0.35} />
      </mesh>
      {/* keyboard */}
      <mesh position={[0, 0.01, 0.16]}>
        <boxGeometry args={[0.42, 0.02, 0.13]} />
        <meshStandardMaterial color="#3b3f46" />
      </mesh>
      {/* tower */}
      <mesh position={[0.4, 0.2, -0.04]} castShadow>
        <boxGeometry args={[0.17, 0.4, 0.36]} />
        <meshStandardMaterial color={COLORS.tower} />
      </mesh>
    </group>
  )
}
