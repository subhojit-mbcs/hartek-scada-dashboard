import React from 'react'
import { getMFMData } from '../api'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 },
  mfmCard: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' },
  mfmHeader: { padding: '16px 20px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mfmTitle: { fontSize: 15, fontWeight: 600, color: '#38BDF8' },
  mfmStatus: { fontSize: 12, color: '#22C55E', background: 'rgba(34,197,94,0.15)', padding: '2px 10px', borderRadius: 8 },
  body: { padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1A2332', fontSize: 13 },
  label: { color: '#64748B' },
  val: (c) => ({ color: c || '#E2E8F0', fontWeight: 500 }),
}

const fields = [
  { key: 'KW', label: 'Active Power (kW)', div: 1000, color: '#22C55E' },
  { key: 'KVA', label: 'Apparent Power (kVA)', div: 1000, color: '#38BDF8' },
  { key: 'KVAR', label: 'Reactive Power (kVAr)', div: 1000, color: '#FACC15' },
  { key: 'PF', label: 'Power Factor', div: 1000, color: '#A78BFA' },
  { key: 'HZ', label: 'Frequency (Hz)', div: 100, color: '#F472B6' },
  { key: 'KWHI', label: 'Import Energy (kWh)', div: 1, color: '#22C55E' },
  { key: 'KWHE', label: 'Export Energy (kWh)', div: 1, color: '#FB923C' },
  { key: 'Voltage_RY', label: 'V RY (V)', div: 10, color: '#38BDF8' },
  { key: 'Voltage_YB', label: 'V YB (V)', div: 10, color: '#38BDF8' },
  { key: 'Voltage_BR', label: 'V BR (V)', div: 10, color: '#38BDF8' },
  { key: 'Current_R', label: 'I R (A)', div: 1000, color: '#FACC15' },
  { key: 'Current_Y', label: 'I Y (A)', div: 1000, color: '#FACC15' },
  { key: 'Current_B', label: 'I B (A)', div: 1000, color: '#FACC15' },
]

export default function EnergyMeter({ data, loading }) {
  const mfm = getMFMData(data)
  return (
    <div style={s.wrapper}>
      <div style={s.title}>Energy Meters</div>
      <div style={s.grid}>
        {mfm.map(m => (
          <div key={m.mfmIndex} style={s.mfmCard}>
            <div style={s.mfmHeader}>
              <span style={s.mfmTitle}>MFM #{m.mfmIndex}</span>
              <span style={s.mfmStatus}>● Online</span>
            </div>
            <div style={s.body}>
              {fields.map(f => (
                <div key={f.key} style={s.row}>
                  <span style={s.label}>{f.label}</span>
                  <span style={s.val(f.color)}>
                    {m.data?.[f.key]?.V !== undefined ? (m.data[f.key].V / f.div).toFixed(f.div >= 1000 ? 2 : f.div >= 10 ? 1 : 0) : '--'}
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
