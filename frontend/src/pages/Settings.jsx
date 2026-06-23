import React from 'react'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 },
  card: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', padding: '24px' },
  cardTitle: { fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1E293B' },
  field: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 13 },
  label: { color: '#94A3B8' },
  value: { color: '#E2E8F0', fontWeight: 500 },
  input: { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px', color: '#E2E8F0', fontSize: 13, width: '100%', marginBottom: 8 },
  btn: { background: '#1D4ED8', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#FFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%', marginTop: 8 },
  textBtn: { background: 'none', border: '1px solid #334155', borderRadius: 8, padding: '10px 20px', color: '#EF4444', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%', marginTop: 8 },
}

export default function Settings() {
  return (
    <div style={s.wrapper}>
      <div style={s.title}>Settings</div>
      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardTitle}>SCADA Connection</div>
          <div style={s.field}><span style={s.label}>Server URL</span><span style={s.value}>mbscada.com/hartek/server</span></div>
          <div style={s.field}><span style={s.label}>Client ID</span><span style={s.value}>HARTEK</span></div>
          <div style={s.field}><span style={s.label}>Username</span><span style={s.value}>userHartek</span></div>
          <div style={s.field}><span style={s.label}>Polling Interval</span><span style={s.value}>5 seconds</span></div>
          <div style={s.field}><span style={s.label}>Connection Status</span><span style={{ color: '#22C55E', fontWeight: 500 }}>● Connected</span></div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Notifications</div>
          <div style={s.field}><span style={s.label}>Email Alerts</span><span style={{ ...s.value, color: '#22C55E' }}>Enabled</span></div>
          <div style={s.field}><span style={s.label}>SMS Alerts</span><span style={{ ...s.value, color: '#64748B' }}>Disabled</span></div>
          <div style={s.field}><span style={s.label}>Critical Alarm Notification</span><span style={{ ...s.value, color: '#22C55E' }}>Enabled</span></div>
          <div style={s.field}><span style={s.label}>Daily Report Email</span><span style={{ ...s.value, color: '#FACC15' }}>Pending</span></div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Display Settings</div>
          <div style={{ marginBottom: 8 }}>
            <div style={s.label}>Temperature Unit</div>
            <select style={s.input}>
              <option>Celsius (°C)</option>
              <option>Fahrenheit (°F)</option>
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={s.label}>Irradiance Unit</div>
            <select style={s.input}>
              <option>W/m²</option>
              <option>kW/m²</option>
            </select>
          </div>
          <div>
            <div style={s.label}>Refresh Rate</div>
            <select style={s.input}>
              <option>5 seconds</option>
              <option>10 seconds</option>
              <option>30 seconds</option>
              <option>60 seconds</option>
            </select>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Account</div>
          <input style={s.input} placeholder="Current Password" type="password" defaultValue="" />
          <input style={s.input} placeholder="New Password" type="password" />
          <input style={s.input} placeholder="Confirm Password" type="password" />
          <button style={s.btn}>Update Password</button>
        </div>
      </div>
    </div>
  )
}
