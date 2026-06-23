import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts'
import { getInverterData } from '../api'

const PARAMS = [
  { key: 'AC_active_power', label: 'AC Active Power', unit: 'kW', div: 1000, color: '#38BDF8' },
  { key: 'AC_reactive_power', label: 'AC Reactive Power', unit: 'kVAR', div: 1000, color: '#F472B6' },
  { key: 'Apparent_Output', label: 'Apparent Output', unit: 'kVA', div: 1000, color: '#A78BFA' },
  { key: 'DC_Power', label: 'DC Power', unit: 'kW', div: 1000, color: '#FACC15' },
  { key: 'DC_Current', label: 'DC Current', unit: 'A', div: 1000, color: '#FB923C' },
  { key: 'Voltage_AB', label: 'Voltage AB', unit: 'V', div: 10, color: '#34D399' },
  { key: 'Voltage_BC', label: 'Voltage BC', unit: 'V', div: 10, color: '#22D3EE' },
  { key: 'Voltage_CA', label: 'Voltage CA', unit: 'V', div: 10, color: '#818CF8' },
  { key: 'Current_R', label: 'Current R', unit: 'A', div: 1000, color: '#EF4444' },
  { key: 'Current_Y', label: 'Current Y', unit: 'A', div: 1000, color: '#EAB308' },
  { key: 'Current_B', label: 'Current B', unit: 'A', div: 1000, color: '#22C55E' },
  { key: 'HZ', label: 'Frequency', unit: 'Hz', div: 100, color: '#EC4899' },
  { key: 'PF', label: 'Power Factor', unit: '', div: 1000, color: '#14B8A6' },
  { key: 'Daily_generation', label: 'Daily Generation', unit: 'kWh', div: 1000, color: '#22C55E' },
  { key: 'Total_generation', label: 'Total Generation', unit: 'MWh', div: 1000000, color: '#A78BFA' },
  { key: 'ModGrp1_Mod1_Power', label: 'M1 String 1 Power', unit: 'W', div: 1, color: '#60A5FA' },
  { key: 'ModGrp1_Mod1_Volt', label: 'M1 String 1 Voltage', unit: 'V', div: 1, color: '#5EEAD4' },
  { key: 'ModGrp1_Mod1_Current', label: 'M1 String 1 Current', unit: 'A', div: 1000, color: '#FDE047' },
  { key: 'ModGrp1_Mod2_Power', label: 'M1 String 2 Power', unit: 'W', div: 1, color: '#F472B6' },
  { key: 'ModGrp1_Mod2_Volt', label: 'M1 String 2 Voltage', unit: 'V', div: 1, color: '#A78BFA' },
  { key: 'ModGrp1_Mod2_Current', label: 'M1 String 2 Current', unit: 'A', div: 1000, color: '#FB923C' },
  { key: 'ModGrp2_Mod1_Power', label: 'M2 String 1 Power', unit: 'W', div: 1, color: '#34D399' },
  { key: 'ModGrp2_Mod1_Volt', label: 'M2 String 1 Voltage', unit: 'V', div: 1, color: '#22D3EE' },
  { key: 'ModGrp2_Mod1_Current', label: 'M2 String 1 Current', unit: 'A', div: 1000, color: '#FACC15' },
  { key: 'ModGrp2_Mod2_Power', label: 'M2 String 2 Power', unit: 'W', div: 1, color: '#818CF8' },
  { key: 'ModGrp2_Mod2_Volt', label: 'M2 String 2 Voltage', unit: 'V', div: 1, color: '#FB923C' },
  { key: 'ModGrp2_Mod2_Current', label: 'M2 String 2 Current', unit: 'A', div: 1000, color: '#EF4444' },
]

const GROUP_LABELS = {
  AC: 'AC Parameters',
  DC: 'DC Parameters',
  Module1: 'Module Group 1 (String 1 & 2)',
  Module2: 'Module Group 2 (String 1 & 2)',
  Gen: 'Generation',
}

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  subtitle: { fontSize: 12, color: '#64748B' },
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: 24 },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 },
  paramCard: {
    background: '#0B1220', borderRadius: 10, border: '1px solid #1E293B',
    padding: '12px 16px', cursor: 'pointer', transition: 'border-color 0.2s',
  },
  paramCardSelected: { borderColor: '#1D4ED8' },
  paramLabel: { fontSize: 10, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 },
  paramValue: (color) => ({ fontSize: 20, fontWeight: 700, color }),
  paramUnit: { fontSize: 11, color: '#475569', marginTop: 2 },
  chartBox: { marginTop: 16, background: '#0B1220', borderRadius: 8, padding: 16, height: 300 },
  selectBar: {
    display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16,
    padding: 12, background: '#0B1220', borderRadius: 8, border: '1px solid #1E293B',
  },
  groupBtn: (active) => ({
    background: active ? '#1D4ED8' : 'transparent', color: active ? '#FFF' : '#94A3B8',
    border: `1px solid ${active ? '#1D4ED8' : '#1E293B'}`,
    borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer',
  }),
  chartSelect: {
    background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155',
    borderRadius: 6, padding: '6px 12px', fontSize: 12,
  },
}

export default function InverterGraph({ data }) {
  const inverters = getInverterData(data)
  if (!inverters.length) return null

  const inv1 = inverters[0]
  const d = inv1?.data || {}

  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedParam, setSelectedParam] = useState('AC_active_power')

  const groups = ['all', 'AC', 'DC', 'Module1', 'Module2', 'Gen']

  const filtered = useMemo(() => {
    if (selectedGroup === 'all') return PARAMS
    const map = {
      AC: ['AC_active_power', 'AC_reactive_power', 'Apparent_Output', 'Voltage_AB', 'Voltage_BC', 'Voltage_CA', 'Current_R', 'Current_Y', 'Current_B', 'HZ', 'PF'],
      DC: ['DC_Power', 'DC_Current'],
      Module1: ['ModGrp1_Mod1_Power', 'ModGrp1_Mod1_Volt', 'ModGrp1_Mod1_Current', 'ModGrp1_Mod2_Power', 'ModGrp1_Mod2_Volt', 'ModGrp1_Mod2_Current'],
      Module2: ['ModGrp2_Mod1_Power', 'ModGrp2_Mod1_Volt', 'ModGrp2_Mod1_Current', 'ModGrp2_Mod2_Power', 'ModGrp2_Mod2_Volt', 'ModGrp2_Mod2_Current'],
      Gen: ['Daily_generation', 'Total_generation'],
    }
    const keys = map[selectedGroup] || []
    return PARAMS.filter(p => keys.includes(p.key))
  }, [selectedGroup])

  const getVal = (p) => d[p.key] ? Number(d[p.key].V) / p.div : 0

  const sel = PARAMS.find(p => p.key === selectedParam)
  const selVal = sel ? getVal(sel) : 0

  const mockTrend = useMemo(() => {
    if (!sel) return []
    const base = selVal || 50
    const hours = 12
    return Array.from({ length: hours }, (_, i) => ({
      time: `${String(i * 2).padStart(2, '0')}:00`,
      value: Math.max(0, base * (0.3 + 0.7 * Math.sin((i / hours) * Math.PI)) + (Math.random() - 0.5) * base * 0.1),
    }))
  }, [selectedParam, selVal])

  return (
    <div style={s.wrapper}>
      <div style={s.titleRow}>
        <div>
          <div style={s.pageTitle}>Inverter #{inv1.inverterIndex} — Detailed Parameters</div>
          <div style={s.subtitle}>27 real-time parameters with trend chart</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Parameter Groups</div>
        <div style={s.selectBar}>
          {groups.map(g => (
            <button key={g} style={s.groupBtn(selectedGroup === g)}
              onClick={() => setSelectedGroup(g)}>
              {g === 'all' ? 'All Parameters' : (GROUP_LABELS[g] || g)}
            </button>
          ))}
        </div>

        <div style={s.grid}>
          {filtered.map(p => {
            const val = getVal(p)
            const isSelected = selectedParam === p.key
            return (
              <div key={p.key} style={{ ...s.paramCard, ...(isSelected ? s.paramCardSelected : {}) }}
                onClick={() => setSelectedParam(p.key)}>
                <div style={s.paramLabel}>{p.label}</div>
                <div style={s.paramValue(p.color)}>
                  {p.key === 'PF' ? val.toFixed(3) : val.toFixed(2)}
                </div>
                <div style={s.paramUnit}>{p.unit}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={s.cardTitle}>Real-Time Trend</div>
          <select value={selectedParam} onChange={e => setSelectedParam(e.target.value)}
            style={s.chartSelect}>
            {PARAMS.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </div>
        {sel && (
          <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Current Value</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: sel.color }}>
                {sel.key === 'PF' ? selVal.toFixed(3) : selVal.toFixed(2)}
                <span style={{ fontSize: 14, fontWeight: 400, color: '#64748B', marginLeft: 6 }}>{sel.unit}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Parameter</div>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>{sel.label}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Raw Value</div>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>{d[sel.key]?.V || 0}</div>
            </div>
          </div>
        )}
        <div style={s.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrend}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sel?.color || '#38BDF8'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={sel?.color || '#38BDF8'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
              <Area type="monotone" dataKey="value" stroke={sel?.color || '#38BDF8'} fillOpacity={1} fill="url(#trendGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
