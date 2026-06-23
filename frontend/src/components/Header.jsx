import React, { useState, useEffect } from 'react'
import { getSiteData } from '../api'
import { useAuth } from '../AuthContext'

const LOGO_URL = 'https://www.mbcontrol.com/wp-content/uploads/2025/09/mb-contorl-01-logo.svg'

const s = {
  header: {
    background: '#111827', borderBottom: '1px solid #1E293B',
    padding: '0 24px', height: 64, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 50,
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  menuBtn: {
    background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer',
    padding: 8, borderRadius: 6, fontSize: 20,
  },
  logoImg: { height: 36, width: 'auto' },
  divider: { width: 1, height: 32, background: '#1E293B', margin: '0 8px' },
  plantInfo: {},
  plantName: { fontSize: 14, fontWeight: 600, color: '#F1F5F9' },
  plantSub: { fontSize: 11, color: '#64748B' },
  center: { display: 'flex', alignItems: 'center', gap: 24 },
  timeBox: { textAlign: 'center' },
  time: { fontSize: 14, fontWeight: 600, color: '#E2E8F0' },
  date: { fontSize: 11, color: '#64748B' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  badge: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 500,
  },
  badgeOnline: { background: 'rgba(34,197,94,0.15)', color: '#22C55E' },
  badgeOffline: { background: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  iconBtn: {
    background: '#1E293B', border: '1px solid #334155', borderRadius: 8,
    width: 36, height: 36, display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', fontSize: 16,
    position: 'relative',
  },
  userBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1E293B', border: '1px solid #334155', borderRadius: 8,
    padding: '4px 12px 4px 4px', cursor: 'pointer', color: '#E2E8F0',
  },
  avatar: {
    width: 28, height: 28, borderRadius: 6, background: '#1D4ED8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#FFF', fontWeight: 600, fontSize: 12,
  },
  dropdown: {
    position: 'absolute', top: '100%', right: 0, marginTop: 4,
    background: '#1E293B', border: '1px solid #334155', borderRadius: 8,
    minWidth: 180, overflow: 'hidden', zIndex: 100,
  },
  dropdownItem: {
    padding: '10px 16px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8, border: 'none',
    background: 'none', width: '100%', textAlign: 'left',
  },
  dropdownDivider: { height: 1, background: '#1E293B' },
}

export default function Header({ data, onRefresh, onMenuClick }) {
  const [time, setTime] = useState(new Date())
  const [showUserMenu, setShowUserMenu] = useState(false)
  const site = getSiteData(data)
  const online = site?.siteStatus === 'G'
  const { user, logout } = useAuth()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header style={s.header}>
      <div style={s.left}>
        <button style={s.menuBtn} onClick={onMenuClick}>☰</button>
        <img src={LOGO_URL} alt="MB Control" style={s.logoImg} onError={e => { e.target.style.display = 'none' }} />
        <div style={s.divider} />
        <div style={s.plantInfo}>
          <div style={s.plantName}>MB Solar SCADA</div>
          <div style={s.plantSub}>Hartek 5 MW Plant</div>
        </div>
      </div>

      <div style={s.center}>
        <div style={s.timeBox}>
          <div style={s.time}>{time.toLocaleTimeString()}</div>
          <div style={s.date}>{time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
        <div style={{ ...s.badge, ...(online ? s.badgeOnline : s.badgeOffline) }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: online ? '#22C55E' : '#EF4444' }} />
          {online ? 'Online' : 'Offline'}
        </div>
      </div>

      <div style={s.right}>
        <button style={s.iconBtn} onClick={onRefresh} title="Refresh">⟳</button>
        <div style={s.iconBtn}>
          🔔
          <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: '#FFF', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </div>
        <div style={{ position: 'relative' }} onClick={() => setShowUserMenu(!showUserMenu)}>
          <div style={s.userBtn}>
            <div style={s.avatar}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <span style={{ fontSize: 13 }}>{user?.username || 'User'}</span>
            <span style={{ fontSize: 10, color: '#64748B' }}>▼</span>
          </div>
          {showUserMenu && (
            <div style={s.dropdown}>
              <button style={s.dropdownItem}>👤 Profile</button>
              <button style={s.dropdownItem}>⚙ Settings</button>
              <div style={s.dropdownDivider} />
              <button style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={logout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
