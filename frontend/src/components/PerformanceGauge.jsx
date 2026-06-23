import React from 'react'
import { getPerformanceByParam } from '../api'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px', textAlign: 'center' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  gaugeWrap: { position: 'relative', width: 220, height: 120, margin: '0 auto', overflow: 'hidden' },
  gauge: { width: 220, height: 110 },
  needle: {
    position: 'absolute', bottom: 0, left: '50%', width: 2, height: 90,
    background: '#38BDF8', borderRadius: 2, transformOrigin: 'bottom center',
    transition: 'transform 1s ease-out',
  },
  centerVal: { position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 32, fontWeight: 800, color: '#F1F5F9' },
  centerUnit: { fontSize: 11, color: '#64748B', marginTop: 4 },
  legend: { display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 },
  legendItem: (color) => ({ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94A3B8' }),
  dot: (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color }),
  values: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 },
  valItem: { background: '#0B1220', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 },
  valLabel: { color: '#64748B' },
  valNum: (color) => ({ color, fontWeight: 600 }),
}

export default function PerformanceGauge({ data }) {
  const todayPR = getPerformanceByParam(data, 'PPRatio')?.data || 76.7
  const yesterdayPR = getPerformanceByParam(data, 'PrevPPRatio')?.data || 82.87
  const monthlyPR = getPerformanceByParam(data, 'MonthPPRatio')?.data || 86.3
  const angle = Math.min((todayPR / 100) * 180, 180)

  function arcPath(color, start, end, radius = 100) {
    const sx = 110 + radius * Math.cos((start - 90) * Math.PI / 180)
    const sy = 110 + radius * Math.sin((start - 90) * Math.PI / 180)
    const ex = 110 + radius * Math.cos((end - 90) * Math.PI / 180)
    const ey = 110 + radius * Math.sin((end - 90) * Math.PI / 180)
    const large = end - start > 180 ? 1 : 0
    return `<path d="M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`
  }

  const arcs = [
    { color: '#22C55E', start: 0, end: 126 },
    { color: '#FACC15', start: 126, end: 162 },
    { color: '#EF4444', start: 162, end: 180 },
  ]

  return (
    <div style={s.card}>
      <div style={s.title}>Plant Performance Ratio</div>
      <div style={s.gaugeWrap}>
        <svg viewBox="0 0 220 130" style={s.gauge}>
          {arcs.map((a, i) => (
            <path key={i} d={`M ${110 + 100 * Math.cos((a.start - 90) * Math.PI / 180)} ${110 + 100 * Math.sin((a.start - 90) * Math.PI / 180)} A 100 100 0 ${a.end - a.start > 180 ? 1 : 0} 1 ${110 + 100 * Math.cos((a.end - 90) * Math.PI / 180)} ${110 + 100 * Math.sin((a.end - 90) * Math.PI / 180)}`}
                fill="none" stroke={a.color} strokeWidth="10" strokeLinecap="round" opacity="0.3" />
          ))}
        </svg>
        <div style={{
          ...s.needle,
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }} />
        <div style={s.centerVal}>
          {todayPR.toFixed(1)}
          <div style={s.centerUnit}>%</div>
        </div>
      </div>
      <div style={s.legend}>
        <div style={s.legendItem()}><span style={s.dot('#22C55E')} /> 0-70% Good</div>
        <div style={s.legendItem()}><span style={s.dot('#FACC15')} /> 70-90% Avg</div>
        <div style={s.legendItem()}><span style={s.dot('#EF4444')} /> 90-100% Poor</div>
      </div>
      <div style={s.values}>
        <div style={s.valItem}><span style={s.valLabel}>Today</span><span style={s.valNum('#38BDF8')}>{todayPR.toFixed(1)}%</span></div>
        <div style={s.valItem}><span style={s.valLabel}>Yesterday</span><span style={s.valNum('#FACC15')}>{yesterdayPR.toFixed(1)}%</span></div>
        <div style={s.valItem}><span style={s.valLabel}>Monthly</span><span style={s.valNum('#22C55E')}>{monthlyPR.toFixed(1)}%</span></div>
        <div style={s.valItem}><span style={s.valLabel}>Annual Target</span><span style={s.valNum('#94A3B8')}>85.0%</span></div>
      </div>
    </div>
  )
}
