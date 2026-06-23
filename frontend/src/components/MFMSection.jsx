import React from 'react'
import { getMFMData } from '../api'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  mfmCard: { background: '#0B1220', borderRadius: 10, border: '1px solid #1E293B', padding: 16 },
  mfmTitle: { fontSize: 13, fontWeight: 600, color: '#38BDF8', marginBottom: 12 },
  fields: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' },
  field: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1A2332', fontSize: 12 },
  label: { color: '#64748B' },
  value: (color) => ({ color: color || '#E2E8F0', fontWeight: 500 }),
}

const fieldConfig = [
  { key: 'KW', label: 'Active Power', unit: 'kW', div: 1000, color: '#22C55E' },
  { key: 'KVA', label: 'Apparent Power', unit: 'kVA', div: 1000, color: '#38BDF8' },
  { key: 'KVAR', label: 'Reactive Power', unit: 'kVAr', div: 1000, color: '#FACC15' },
  { key: 'PF', label: 'Power Factor', unit: '', div: 1000, color: '#A78BFA' },
  { key: 'HZ', label: 'Frequency', unit: 'Hz', div: 100, color: '#F472B6' },
  { key: 'KWHI', label: 'Import Energy', unit: 'kWh', div: 1, color: '#22C55E' },
  { key: 'KWHE', label: 'Export Energy', unit: 'kWh', div: 1, color: '#FB923C' },
  { key: 'Voltage_RY', label: 'Voltage RY', unit: 'V', div: 10, color: '#38BDF8' },
  { key: 'Voltage_YB', label: 'Voltage YB', unit: 'V', div: 10, color: '#38BDF8' },
  { key: 'Voltage_BR', label: 'Voltage BR', unit: 'V', div: 10, color: '#38BDF8' },
  { key: 'Current_R', label: 'Current R', unit: 'A', div: 1000, color: '#FACC15' },
  { key: 'Current_Y', label: 'Current Y', unit: 'A', div: 1000, color: '#FACC15' },
  { key: 'Current_B', label: 'Current B', unit: 'A', div: 1000, color: '#FACC15' },
]

function fmtVal(val, div) {
  if (val === undefined || val === null) return '--'
  const n = val / div
  if (div >= 1000) return n.toFixed(2)
  if (div >= 10) return n.toFixed(1)
  return Math.round(n).toLocaleString()
}

export default function MFMSection({ data }) {
  const mfmData = getMFMData(data)
  if (!mfmData.length) return null

  return (
    <div style={s.card}>
      <div style={s.title}>Multi Function Meters</div>
      <div style={s.grid}>
        {mfmData.map(mfm => (
          <div key={mfm.mfmIndex} style={s.mfmCard}>
            <div style={s.mfmTitle}>MFM #{mfm.mfmIndex}</div>
            <div style={s.fields}>
              {fieldConfig.map(f => (
                <div key={f.key} style={s.field}>
                  <span style={s.label}>{f.label}</span>
                  <span style={s.value(f.color)}>
                    {fmtVal(mfm.data?.[f.key]?.V, f.div)} {f.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
