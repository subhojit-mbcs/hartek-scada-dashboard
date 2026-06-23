import React from 'react'
import { getPerformanceData, getPerformanceByParam } from '../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  perfCard: { background: '#0B1220', borderRadius: 10, border: '1px solid #1E293B', padding: 16 },
  label: { fontSize: 10, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 },
  value: (color) => ({ fontSize: 24, fontWeight: 700, color }),
  sub: { fontSize: 11, color: '#475569', marginTop: 2 },
  chartBox: { marginTop: 16, background: '#0B1220', borderRadius: 8, padding: 16, height: 200 },
}

const perfMetrics = [
  { param: 'PPRatio', label: "Today's PR", unit: '%', color: '#38BDF8' },
  { param: 'PrevPPRatio', label: 'Yesterday PR', unit: '%', color: '#FACC15' },
  { param: 'MonthPPRatio', label: 'Monthly PR', unit: '%', color: '#22C55E' },
  { param: 'CumPR', label: 'Cumulative PR', unit: '%', color: '#A78BFA' },
  { param: 'TodayGen', label: "Today's Gen", unit: 'MWh', color: '#22C55E', div: 1000 },
  { param: 'MonthlyGen', label: 'Monthly Gen', unit: 'MWh', color: '#38BDF8', div: 1000 },
  { param: 'YearlyGen', label: 'Yearly Gen', unit: 'MWh', color: '#A78BFA', div: 1000 },
  { param: 'PeakLoadToday', label: 'Peak Load Today', unit: 'kW', color: '#F472B6' },
]

const monthlyData = [
  { month: 'Jan', gen: 420, export: 410 },
  { month: 'Feb', gen: 480, export: 465 },
  { month: 'Mar', gen: 560, export: 545 },
  { month: 'Apr', gen: 610, export: 598 },
  { month: 'May', gen: 597, export: 624 },
  { month: 'Jun', gen: 540, export: 530 },
]

export default function PerformanceAnalytics({ data }) {
  const perf = getPerformanceData(data)

  return (
    <div style={s.card}>
      <div style={s.title}>Performance Analytics</div>
      <div style={s.grid}>
        {perfMetrics.map(m => {
          const p = perf.find(x => x.paramName === m.param)
          const val = p?.data ?? 0
          const display = m.div ? (val / m.div).toFixed(2) : val.toFixed(1)
          return (
            <div key={m.param} style={s.perfCard}>
              <div style={s.label}>{m.label}</div>
              <div style={s.value(m.color)}>{display}</div>
              <div style={s.sub}>{m.unit}</div>
            </div>
          )
        })}
      </div>

      <div style={s.chartBox}>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>Monthly Generation & Export (MWh)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
            <Bar dataKey="gen" name="Generation" fill="#38BDF8" radius={[4,4,0,0]} />
            <Bar dataKey="export" name="Net Export" fill="#22C55E" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
