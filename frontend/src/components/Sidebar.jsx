import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '◉' },
  { path: '/inverters', label: 'Inverters', icon: '⚡' },
  { path: '/weather', label: 'Weather Station', icon: '🌤' },
  { path: '/energy-meter', label: 'Energy Meter', icon: '🔋' },
  { path: '/annunciator', label: 'Annunciator', icon: '⚠' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
]

const styles = {
  sidebar: (open) => ({
    width: open ? 240 : 0,
    minWidth: open ? 240 : 0,
    background: '#0F172A',
    borderRight: open ? '1px solid #1E293B' : 'none',
    transition: 'all 0.3s',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }),
  logo: {
    padding: '20px 20px 16px', borderBottom: '1px solid #1E293B',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  logoIcon: { width: 32, height: 32, borderRadius: 8, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: 14 },
  logoText: { fontSize: 14, fontWeight: 700, color: '#F1F5F9' },
  logoSub: { fontSize: 10, color: '#64748B' },
  nav: { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 },
  item: (active) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 14px', borderRadius: 8,
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
    background: active ? '#1E293B' : 'transparent',
    color: active ? '#38BDF8' : '#94A3B8',
    transition: 'all 0.15s',
    border: 'none', width: '100%', textAlign: 'left',
  }),
  itemIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  footer: {
    padding: '16px 20px', borderTop: '1px solid #1E293B',
    fontSize: 10, color: '#475569', lineHeight: 1.5,
  },
}

export default function Sidebar({ open, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={styles.sidebar(open)}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>MB</div>
        <div>
          <div style={styles.logoText}>M.B. Control & Systems</div>
          <div style={styles.logoSub}>Industrial Automation</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map(item => (
          <button
            key={item.path}
            style={styles.item(location.pathname === item.path)}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.itemIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={styles.footer}>
        © 2026 M.B. Control & Systems<br />
        All rights reserved.
      </div>
    </div>
  )
}
