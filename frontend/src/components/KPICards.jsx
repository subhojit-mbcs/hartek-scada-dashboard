import React from 'react'
import { getInverterData, getPerformanceByParam, getWeatherData } from '../api'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 },
  kpi: {
    background: '#0B1220', borderRadius: 10, border: '1px solid #1E293B',
    padding: '16px', textAlign: 'center',
  },
  icon: { fontSize: 22, marginBottom: 8 },
  value: { fontSize: 22, fontWeight: 700, color: '#F1F5F9', marginBottom: 2 },
  unit: { fontSize: 11, color: '#64748B' },
  label: { fontSize: 10, color: '#475569', marginTop: 6, textTransform: 'uppercase' },
}

const kpiConfig = [
  { key: 'acPower', icon: '⚡', label: 'Plant Load', unit: 'kW', color: '#38BDF8' },
  { key: 'todayGen', icon: '☀️', label: "Today's Gen", unit: 'MWh', color: '#22C55E' },
  { key: 'dailyCUF', icon: '📈', label: 'Daily CUF', unit: '%', color: '#A78BFA' },
  { key: 'acYield', icon: '📊', label: 'Daily AC Yield', unit: 'kWh/kW', color: '#F472B6' },
  { key: 'ghi', icon: '🌞', label: 'GHI', unit: 'W/m²', color: '#FACC15' },
  { key: 'gii', icon: '🌤', label: 'GII', unit: 'W/m²', color: '#FB923C' },
  { key: 'ambientTemp', icon: '🌡', label: 'Ambient Temp', unit: '°C', color: '#F87171' },
  { key: 'windSpeed', icon: '💨', label: 'Wind Speed', unit: 'm/s', color: '#38BDF8' },
]

export default function KPICards({ data }) {
  const inv = getInverterData(data)
  const weather = getWeatherData(data)
  const dailyCUF = getPerformanceByParam(data, 'Daily_CUF')?.data

  const acPower = inv[0]?.data?.AC_active_power ? inv[0].data.AC_active_power.V / 1000 : 0
  const todayGen = inv[0]?.data?.Daily_generation ? inv[0].data.Daily_generation.V / 1000000 : 0
  const acYield = getPerformanceByParam(data, 'DailyACYield')?.data || 0
  const ghi = weather?.GHI?.V || 0
  const gii = weather?.GII?.V || 0
  const ambientTemp = weather?.AmbientTemp?.V || 0
  const windSpeed = weather?.WindSpeed?.V || 0

  const values = {
    acPower: acPower.toFixed(2),
    todayGen: todayGen.toFixed(3),
    dailyCUF: dailyCUF ? dailyCUF.toFixed(2) : '--',
    acYield: acYield.toFixed(2),
    ghi: ghi.toFixed(0),
    gii: gii.toFixed(0),
    ambientTemp: ambientTemp.toFixed(1),
    windSpeed: windSpeed.toFixed(2),
  }

  return (
    <div style={s.card}>
      <div style={s.title}>Key Performance Indicators</div>
      <div style={s.grid}>
        {kpiConfig.map(k => (
          <div key={k.key} style={s.kpi}>
            <div style={s.icon}>{k.icon}</div>
            <div style={{ ...s.value, color: k.color }}>{values[k.key]}</div>
            <div style={s.unit}>{k.unit}</div>
            <div style={s.label}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
