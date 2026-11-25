import { useEffect } from 'react'
import { TYPE_LABELS } from '../data/equipment'

const FIELDS = [
  ['Name', 'name'],
  ['Brand', 'brand'],
  ['Model', 'model'],
  ['Inventory No.', 'inventoryNo'],
  ['Serial No.', 'serialNo'],
]

export default function DetailsPanel({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null
  return (
    <aside className="details" aria-label="Equipment details">
      <header>
        <span className={`type-badge type-${item.type}`}>{TYPE_LABELS[item.type]}</span>
        <button className="close" onClick={onClose} aria-label="Close details">×</button>
      </header>
      <dl>
        {FIELDS.map(([label, key]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{item[key]}</dd>
          </div>
        ))}
      </dl>
      <p className="sample-note">Sample data</p>
    </aside>
  )
}
