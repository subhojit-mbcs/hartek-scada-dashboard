import React from 'react'
import { getSiteData } from '../api'
import PlantOverview from '../components/PlantOverview'
import PerformanceGauge from '../components/PerformanceGauge'
import KPICards from '../components/KPICards'
import WeatherDashboard from '../components/WeatherDashboard'
import InverterAnalytics from '../components/InverterAnalytics'
import MFMSection from '../components/MFMSection'
import PerformanceAnalytics from '../components/PerformanceAnalytics'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 },
}

export default function Dashboard({ data, loading }) {
  if (loading || !data) {
    return (
      <div style={s.wrapper}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background: '#111827', borderRadius: 12, padding: 40, border: '1px solid #1E293B' }}>
            <div style={{ height: 20, width: '40%', background: '#1E293B', borderRadius: 4, marginBottom: 16 }} />
            <div style={{ height: 12, width: '60%', background: '#1E293B', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 12, width: '30%', background: '#1E293B', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    )
  }

  const site = getSiteData(data)

  return (
    <div style={s.wrapper}>
      <PlantOverview data={data} />

      <div style={s.grid2}>
        <PerformanceGauge data={data} />
        <KPICards data={data} />
      </div>

      <WeatherDashboard data={data} />

      <InverterAnalytics data={data} />

      <MFMSection data={data} />

      <PerformanceAnalytics data={data} />
    </div>
  )
}
