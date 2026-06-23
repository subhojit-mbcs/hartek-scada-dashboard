import React from 'react'
import WeatherDashboard from '../components/WeatherDashboard'
import { getWeatherData } from '../api'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  extraGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 8 },
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  item: { background: '#0B1220', borderRadius: 8, padding: '12px 16px' },
  label: { fontSize: 10, color: '#64748B' },
  value: (c) => ({ fontSize: 18, fontWeight: 600, color: c, marginTop: 4 }),
}

export default function Weather({ data, loading }) {
  const weather = getWeatherData(data)
  const extraParams = weather ? [
    { label: 'Peak Radiation Today', value: data?.performance?.find(p => p.paramName === 'PeakRadiation')?.data || '--', unit: 'W/m²', color: '#FACC15' },
    { label: 'Cumulative GHI', value: data?.performance?.find(p => p.paramName === 'CumGHI')?.data || '--', unit: 'kWh/m²', color: '#FB923C' },
    { label: 'Cumulative GII', value: data?.performance?.find(p => p.paramName === 'CumGII')?.data || '--', unit: 'kWh/m²', color: '#38BDF8' },
    { label: 'Module Temp 2', value: weather.PVModuleTemp2?.V || '--', unit: '°C', color: '#F87171' },
  ] : []

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Weather Station</div>
      <WeatherDashboard data={data} />
      {extraParams.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>Additional Weather Metrics</div>
          <div style={s.extraGrid}>
            {extraParams.map((p, i) => (
              <div key={i} style={s.item}>
                <div style={s.label}>{p.label}</div>
                <div style={s.value(p.color)}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} <span style={{ fontSize: 12, color: '#64748B' }}>{p.unit}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
