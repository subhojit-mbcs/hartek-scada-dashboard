import React, { useState } from 'react'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  toolbar: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  label: { fontSize: 12, color: '#64748B' },
  input: { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px', color: '#E2E8F0', fontSize: 13 },
  btn: (bg = '#1D4ED8') => ({
    background: bg, border: 'none', borderRadius: 8, padding: '8px 20px',
    color: '#FFF', fontSize: 13, fontWeight: 500, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
  }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' },
  cardTitle: { fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginBottom: 8 },
  cardDesc: { fontSize: 12, color: '#64748B', lineHeight: 1.5 },
  cardIcon: { fontSize: 32, marginBottom: 12 },
}

export default function Reports({ data }) {
  const [range, setRange] = useState({ from: '', to: '' })

  const reportTypes = [
    { icon: '📋', title: 'Daily Report', desc: 'Complete daily generation, performance, and alarm summary' },
    { icon: '📊', title: 'Monthly Report', desc: 'Monthly generation analysis, CUF, PR trends, and comparisons' },
    { icon: '📈', title: 'Yearly Report', desc: 'Annual performance review, energy accounting, and benchmarks' },
    { icon: '⚡', title: 'Inverter Report', desc: 'Individual inverter performance, efficiency, and fault logs' },
    { icon: '🌤', title: 'Weather Report', desc: 'Weather correlation analysis with generation patterns' },
    { icon: '⚠', title: 'Alarm Report', desc: 'Alarm frequency analysis, MTTR, and severity distribution' },
  ]

  const handleExport = (format) => {
    alert(`Export ${format} - Feature coming soon`)
  }

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Reports</div>

      <div style={s.toolbar}>
        <div>
          <div style={s.label}>From</div>
          <input type="date" style={s.input} value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} />
        </div>
        <div>
          <div style={s.label}>To</div>
          <input type="date" style={s.input} value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} />
        </div>
        <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 8 }}>
          <button style={s.btn()} onClick={() => handleExport('PDF')}>📄 Export PDF</button>
          <button style={s.btn('#059669')} onClick={() => handleExport('Excel')}>📗 Export Excel</button>
        </div>
      </div>

      <div style={s.grid}>
        {reportTypes.map((r, i) => (
          <div key={i} style={s.card} onMouseEnter={e => e.currentTarget.style.borderColor = '#38BDF8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1E293B'}>
            <div style={s.cardIcon}>{r.icon}</div>
            <div style={s.cardTitle}>{r.title}</div>
            <div style={s.cardDesc}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
