import { useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Office from './components/Office'
import ViewControls, { DEFAULT_VIEW } from './components/ViewControls'
import DetailsPanel from './components/DetailsPanel'
import { equipment } from './data/equipment'
import { COLORS } from './theme'

export default function App() {
  const controls = useRef()
  const [showLabels, setShowLabels] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const closeDetails = useCallback(() => setSelectedId(null), [])
  const pointerDown = useRef([0, 0])
  const selected = equipment.find((e) => e.id === selectedId)

  return (
    <div className="app" onPointerDown={(e) => { pointerDown.current = [e.clientX, e.clientY] }}>
      <header className="title">
        <h1>IT Department</h1>
        <p>3D floor plan</p>
      </header>

      <Canvas
        orthographic
        shadows
        dpr={[1, 2]}
        onPointerMissed={(e) => {
          // clicking empty space closes the panel, but finishing a camera drag does not
          const [x, y] = pointerDown.current
          if (Math.hypot(e.clientX - x, e.clientY - y) < 5) closeDetails()
        }}
        camera={{ position: DEFAULT_VIEW.position, zoom: DEFAULT_VIEW.zoom(), near: -100, far: 200 }}
      >
        <color attach="background" args={[COLORS.background]} />
        <hemisphereLight args={['#ffffff', '#c9ced6', 1.4]} />
        <directionalLight
          position={[8, 18, 10]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0005}
        />
        <Office showLabels={showLabels} selectedId={selectedId} onSelect={setSelectedId} />
        <OrbitControls
          ref={controls}
          makeDefault
          enableDamping
          dampingFactor={0.12}
          minZoom={15}
          maxZoom={400}
          maxPolarAngle={Math.PI / 2.15}
          target={DEFAULT_VIEW.target}
        />
      </Canvas>

      <DetailsPanel item={selected} onClose={closeDetails} />
      <ViewControls controls={controls} showLabels={showLabels} onToggleLabels={() => setShowLabels((v) => !v)} />
    </div>
  )
}
