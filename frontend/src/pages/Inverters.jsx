import React from 'react'
import InverterAnalytics from '../components/InverterAnalytics'
import InverterGraph from '../components/InverterGraph'

const s = { wrapper: { display: 'flex', flexDirection: 'column', gap: 20 } }

export default function Inverters({ data, loading }) {
  return (
    <div style={s.wrapper}>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>Inverters</div>
      <InverterAnalytics data={data} />
      <InverterGraph data={data} />
    </div>
  )
}
