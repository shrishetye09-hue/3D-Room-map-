// Isometric-style default view: looking from the bottom-right of the sketch,
// so the top of the paper (entrance wall) is at the back.
export const DEFAULT_VIEW = {
  position: [7, 21, 17],
  target: [0, 0, 0],
  // fit the ~15 m room to the window
  zoom: () => Math.max(20, Math.min(window.innerWidth / 19, window.innerHeight / 14.5)),
}

const TOP_VIEW = { position: [0, 30, 0.001] }

function setView(controls, position, zoom) {
  const c = controls.current
  if (!c) return
  c.object.position.set(...position)
  c.target.set(...DEFAULT_VIEW.target)
  if (zoom) c.object.zoom = zoom
  c.object.updateProjectionMatrix()
  c.update()
}

function zoomBy(controls, factor) {
  const c = controls.current
  if (!c) return
  c.object.zoom = Math.min(c.maxZoom, Math.max(c.minZoom, c.object.zoom * factor))
  c.object.updateProjectionMatrix()
  c.update()
}

export default function ViewControls({ controls, showLabels, onToggleLabels }) {
  return (
    <div className="view-controls">
      <div className="btn-group">
        <button title="Zoom in" onClick={() => zoomBy(controls, 1.25)}>+</button>
        <button title="Zoom out" onClick={() => zoomBy(controls, 0.8)}>−</button>
      </div>
      <div className="btn-group">
        <button onClick={() => setView(controls, DEFAULT_VIEW.position, DEFAULT_VIEW.zoom())}>3D view</button>
        <button onClick={() => setView(controls, TOP_VIEW.position, DEFAULT_VIEW.zoom())}>Top view</button>
        <button onClick={() => setView(controls, DEFAULT_VIEW.position, DEFAULT_VIEW.zoom())}>Reset</button>
      </div>
      <button className={showLabels ? 'active' : ''} onClick={onToggleLabels}>Labels</button>
      <p className="hint">Drag to rotate · Right-drag to pan · Scroll to zoom</p>
    </div>
  )
}
