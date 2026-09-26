// src/components/RegionPicker.jsx
import { useRegion } from '../context/RegionContext'

export default function RegionPicker() {
  const { pickerOpen, setPickerOpen, chooseRegion, regionCode, REGIONS } = useRegion()

  if (!pickerOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={() => setPickerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()} // don't close when clicking the card itself
        style={{
          background: '#0b0b0a',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10,
          padding: '32px 28px',
          width: 320,
          maxWidth: '90vw',
        }}
      >
        <h3 style={{ margin: '0 0 4px', fontSize: 18, color: '#fff' }}>
          Choose your region
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#999' }}>
          Prices will be shown in your local currency.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REGIONS.map((r) => (
            <button
              key={r.code}
              onClick={() => chooseRegion(r.code)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 6,
                border: r.code === regionCode
                  ? '1px solid #fff'
                  : '1px solid rgba(255,255,255,0.15)',
                background: r.code === regionCode ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{r.label}</span>
              <span style={{ color: '#999', fontSize: 12 }}>{r.currency}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}