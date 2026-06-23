import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'
import { getInverterData, getPerformanceByParam } from '../api'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  flex: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  invCard: (border) => ({
    flex: '1 1 280px', background: '#0B1220', borderRadius: 10,
    border: `1px solid ${border}`, padding: 16,
  }),
  invHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  invName: { fontSize: 14, fontWeight: 600, color: '#E2E8F0' },
  status: (ok) => ({
    padding: '2px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500,
    background: ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
    color: ok ? '#22C55E' : '#EF4444',
  }),
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  field: { padding: '6px 0' },
  fieldLabel: { fontSize: 10, color: '#64748B' },
  fieldVal: { fontSize: 15, fontWeight: 600, color: '#E2E8F0' },
  chartBox: { marginTop: 16, background: '#0B1220', borderRadius: 8, padding: 12 },
  efficiency: {
    marginTop: 12, background: '#0B1220', borderRadius: 8, padding: '12px 16px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  effLabel: { fontSize: 12, color: '#64748B' },
  effVal: { fontSize: 20, fontWeight: 700, color: '#22C55E' },
}

const chartData = [
  { time: '00:00', power: 0, gen: 0 },
  { time: '04:00', power: 0.2, gen: 0.5 },
  { time: '06:00', power: 1.8, gen: 3.2 },
  { time: '08:00', power: 3.5, gen: 8.1 },
  { time: '10:00', power: 4.2, gen: 12.5 },
  { time: '12:00', power: 3.8, gen: 16.2 },
  { time: '14:00', power: 3.2, gen: 19.8 },
  { time: '16:00', power: 2.1, gen: 22.5 },
  { time: '18:00', power: 0.8, gen: 24.2 },
  { time: '20:00', power: 0.1, gen: 24.8 },
  { time: '23:00', power: 0, gen: 25.1 },
]

export default function InverterAnalytics({ data }) {
  const inverters = getInverterData(data)
  if (!inverters.length) return null

  const [selectedParam, setSelectedParam] = useState('AC_active_power')

  return (
    <div style={s.card}>
      <div style={s.title}>Inverter Analytics</div>
      <div style={s.flex}>
        {inverters.map(inv => {
          const d = inv.data || {}
          const acPower = d.AC_active_power ? d.AC_active_power.V / 1000 : 0
          const dcPower = d.DC_Power ? d.DC_Power.V / 1000 : 0
          const dailyGen = d.Daily_generation ? d.Daily_generation.V / 1000000 : 0
          const totalGen = d.Total_generation ? d.Total_generation.V / 1000000 : 0
          const efficiency = acPower > 0 && dcPower > 0 ? (acPower / dcPower * 100) : 0

          return (
            <div key={inv.inverterIndex} style={s.invCard('#1E293B')}>
              <div style={s.invHeader}>
                <span style={s.invName}>Inverter #{inv.inverterIndex}</span>
                <span style={s.status(true)}>● Online</span>
              </div>
              <div style={s.grid2}>
                <div style={s.field}><div style={s.fieldLabel}>AC Power</div><div style={{ ...s.fieldVal, color: '#38BDF8' }}>{acPower.toFixed(2)} kW</div></div>
                <div style={s.field}><div style={s.fieldLabel}>DC Power</div><div style={{ ...s.fieldVal, color: '#FACC15' }}>{dcPower.toFixed(2)} kW</div></div>
                <div style={s.field}><div style={s.fieldLabel}>Daily Gen</div><div style={{ ...s.fieldVal, color: '#22C55E' }}>{dailyGen.toFixed(3)} MWh</div></div>
                <div style={s.field}><div style={s.fieldLabel}>Total Gen</div><div style={{ ...s.fieldVal, color: '#A78BFA' }}>{totalGen.toFixed(2)} MWh</div></div>
                <div style={s.field}><div style={s.fieldLabel}>Voltage</div><div style={{ ...s.fieldVal, color: '#F472B6' }}>{d.Voltage_AB ? (d.Voltage_AB.V / 10).toFixed(1) : '--'} V</div></div>
                <div style={s.field}><div style={s.fieldLabel}>Current</div><div style={{ ...s.fieldVal, color: '#FB923C' }}>{d.Current_R ? (d.Current_R.V / 1000).toFixed(2) : '--'} A</div></div>
              </div>
              <div style={s.efficiency}>
                <span style={s.effLabel}>Efficiency</span>
                <span style={s.effVal}>{efficiency.toFixed(1)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={s.chartBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Today's Generation Trend</span>
          <select value={selectedParam} onChange={e => setSelectedParam(e.target.value)}
            style={{ background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155', borderRadius: 6, padding: '4px 10px', fontSize: 12 }}>
            <option value="AC_active_power">AC Power</option>
            <option value="DC_Power">DC Power</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
            <Area type="monotone" dataKey={selectedParam === 'AC_active_power' ? 'power' : 'power'} stroke="#38BDF8" fillOpacity={1} fill="url(#colorP)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
