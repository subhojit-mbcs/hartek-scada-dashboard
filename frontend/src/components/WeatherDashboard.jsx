import React from 'react'
import { getWeatherData } from '../api'

const s = {
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  title: { fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 },
  item: { background: '#0B1220', borderRadius: 10, border: '1px solid #1E293B', padding: '16px' },
  header: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  icon: { fontSize: 18 },
  label: { fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 22, fontWeight: 700, marginBottom: 2 },
  sub: { fontSize: 11, color: '#475569' },
  todayRow: { display: 'flex', gap: 12, marginTop: 12 },
  todayBox: { background: '#0B1220', borderRadius: 8, padding: '8px 12px', flex: 1, textAlign: 'center' },
  todayLabel: { fontSize: 10, color: '#64748B' },
  todayVal: { fontSize: 14, fontWeight: 600, color: '#E2E8F0' },
}

const config = [
  { key: 'AmbientTemp', icon: '🌡', label: 'Ambient Temp', color: '#F87171', unit: '°C' },
  { key: 'PVModuleTemp1', icon: '🔥', label: 'Module Temp', color: '#FB923C', unit: '°C' },
  { key: 'GHI', icon: '☀️', label: 'GHI', color: '#FACC15', unit: 'W/m²' },
  { key: 'GII', icon: '🌤', label: 'GII', color: '#FB923C', unit: 'W/m²' },
  { key: 'WindSpeed', icon: '💨', label: 'Wind Speed', color: '#38BDF8', unit: 'm/s' },
  { key: 'WindDirection', icon: '🧭', label: 'Wind Dir', color: '#A78BFA', unit: '°' },
  { key: 'RainFall', icon: '🌧', label: 'Rainfall', color: '#60A5FA', unit: 'mm' },
]

export default function WeatherDashboard({ data }) {
  const weather = getWeatherData(data)
  if (!weather) {
    return (
      <div style={s.card}>
        <div style={s.title}>Weather Station</div>
        <div style={{ color: '#64748B', fontSize: 14, textAlign: 'center', padding: 20 }}>No weather data</div>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.title}>Weather Station</div>
      <div style={s.grid}>
        {config.map(c => (
          <div key={c.key} style={s.item}>
            <div style={s.header}>
              <span style={s.icon}>{c.icon}</span>
              <span style={s.label}>{c.label}</span>
            </div>
            <div style={{ ...s.value, color: c.color }}>
              {weather[c.key]?.V?.toFixed?.(c.key === 'WindSpeed' ? 2 : 1) ?? weather[c.key]?.V ?? '--'}
            </div>
            <div style={s.sub}>{c.unit}</div>
          </div>
        ))}
      </div>

      <div style={s.todayRow}>
        <div style={s.todayBox}>
          <div style={s.todayLabel}>Today GHI</div>
          <div style={s.todayVal}>{(weather.TodayGHI?.V || 0).toFixed(0)} Wh/m²</div>
        </div>
        <div style={s.todayBox}>
          <div style={s.todayLabel}>Today GII</div>
          <div style={s.todayVal}>{(weather.TodayGII?.V || 0).toFixed(0)} Wh/m²</div>
        </div>
        <div style={s.todayBox}>
          <div style={s.todayLabel}>Today Rainfall</div>
          <div style={s.todayVal}>{(weather.TodayRainFall?.V || 0).toFixed(1)} mm</div>
        </div>
      </div>
    </div>
  )
}
