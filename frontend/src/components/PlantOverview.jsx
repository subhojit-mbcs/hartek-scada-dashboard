import React from 'react'
import { getSiteData } from '../api'

const s = {
  card: {
    background: 'linear-gradient(135deg, #111827 0%, #1a2332 100%)',
    borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute', inset: 0, opacity: 0.03,
    background: 'radial-gradient(circle at 20% 50%, #38BDF8 0%, transparent 60%)',
  },
  content: { padding: '24px', position: 'relative', zIndex: 1 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 16 },
  name: { fontSize: 22, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 },
  location: { fontSize: 13, color: '#64748B' },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: (bg, color) => ({
    padding: '4px 14px', borderRadius: 12, fontSize: 12, fontWeight: 500,
    background: bg, color,
  }),
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 },
  statItem: { padding: '12px 16px', background: '#0B1220', borderRadius: 8, border: '1px solid #1E293B' },
  statLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 700, color: '#E2E8F0' },
}

export default function PlantOverview({ data }) {
  const site = getSiteData(data)
  if (!site) return null

  return (
    <div style={s.card}>
      <div style={s.overlay} />
      <div style={s.content}>
        <div style={s.top}>
          <div>
            <div style={s.name}>{site.siteName}</div>
            <div style={s.location}>📍 {site.latitude}, {site.longitude}</div>
          </div>
          <div style={s.badges}>
            <span style={s.badge(site.siteStatus === 'G' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', site.siteStatus === 'G' ? '#22C55E' : '#EF4444')}>
              ● {site.siteStatus === 'G' ? 'Good' : 'Offline'}
            </span>
            <span style={s.badge('rgba(56,189,248,0.15)', '#38BDF8')}>
              ⟳ Online
            </span>
          </div>
        </div>

        <div style={s.stats}>
          <div style={s.statItem}>
            <div style={s.statLabel}>Site ID</div>
            <div style={s.statValue}>{site.siteId}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Capacity</div>
            <div style={s.statValue}>5 MW</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Service Start</div>
            <div style={s.statValue}>{new Date(site.serviceStart).toLocaleDateString()}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Service End</div>
            <div style={s.statValue}>{new Date(site.serviceEnd).toLocaleDateString()}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Inverters</div>
            <div style={s.statValue}>{site.devices?.inverter || 0}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Last Active</div>
            <div style={s.statValue}>{new Date(site.lastActiveTime).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
