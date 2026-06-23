import React, { useState } from 'react'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9' },
  toolbar: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  input: { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px', color: '#E2E8F0', fontSize: 13, flex: 1, minWidth: 200 },
  select: { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px', color: '#E2E8F0', fontSize: 13 },
  tableCard: { background: '#111827', borderRadius: 12, border: '1px solid #1E293B', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #1E293B', fontWeight: 600 },
  td: (c) => ({ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #1A2332', color: c || '#E2E8F0' }),
  badge: (bg, color) => ({ padding: '2px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: bg, color }),
  empty: { textAlign: 'center', padding: 40, color: '#64748B', fontSize: 14 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 },
  statCard: (border) => ({ background: '#111827', borderRadius: 12, border: `1px solid ${border}`, padding: '20px', textAlign: 'center' }),
  statNum: (c) => ({ fontSize: 28, fontWeight: 700, color: c }),
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 4, textTransform: 'uppercase' },
}

const mockAlarms = [
  { id: 1, type: 'High Voltage', severity: 'Critical', site: 'HARTEK01', timestamp: '2026-06-23 11:15:23', status: 'Active', ack: false },
  { id: 2, type: 'Low PF', severity: 'Warning', site: 'HARTEK01', timestamp: '2026-06-23 10:45:12', status: 'Active', ack: false },
  { id: 3, type: 'Communication Lost', severity: 'Critical', site: 'HARTEK01', timestamp: '2026-06-23 09:30:00', status: 'Closed', ack: true },
  { id: 4, type: 'High Temperature', severity: 'Major', site: 'HARTEK01', timestamp: '2026-06-23 08:15:44', status: 'Active', ack: false },
  { id: 5, type: 'Low Insulation', severity: 'Warning', site: 'HARTEK01', timestamp: '2026-06-22 23:00:00', status: 'Closed', ack: true },
]

export default function Annunciator({ data }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [alarms, setAlarms] = useState(mockAlarms)

  const filtered = alarms.filter(a => {
    if (filter !== 'All' && a.severity !== filter) return false
    if (search && !a.type.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const active = alarms.filter(a => a.status === 'Active').length
  const critical = alarms.filter(a => a.severity === 'Critical').length
  const unack = alarms.filter(a => !a.ack).length

  const toggleAck = (id) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, ack: !a.ack } : a))
  }

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Annunciator</div>

      <div style={s.statsRow}>
        <div style={s.statCard('#EF4444')}>
          <div style={s.statNum('#EF4444')}>{active}</div>
          <div style={s.statLabel}>Active Alarms</div>
        </div>
        <div style={s.statCard('#FACC15')}>
          <div style={s.statNum('#FACC15')}>{critical}</div>
          <div style={s.statLabel}>Critical</div>
        </div>
        <div style={s.statCard('#22C55E')}>
          <div style={s.statNum('#22C55E')}>{unack}</div>
          <div style={s.statLabel}>Unacknowledged</div>
        </div>
        <div style={s.statCard('#38BDF8')}>
          <div style={s.statNum('#38BDF8')}>{alarms.length}</div>
          <div style={s.statLabel}>Total</div>
        </div>
      </div>

      <div style={s.toolbar}>
        <input style={s.input} placeholder="Search alarms..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={s.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Major">Major</option>
          <option value="Warning">Warning</option>
        </select>
      </div>

      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Alarm Type</th>
              <th style={s.th}>Severity</th>
              <th style={s.th}>Timestamp</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Ack</th>
              <th style={s.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={s.td()}>{a.id}</td>
                <td style={s.td()}>{a.type}</td>
                <td style={s.td()}>
                  <span style={s.badge(
                    a.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : a.severity === 'Major' ? 'rgba(251,146,60,0.15)' : 'rgba(250,204,21,0.15)',
                    a.severity === 'Critical' ? '#EF4444' : a.severity === 'Major' ? '#FB923C' : '#FACC15'
                  )}>{a.severity}</span>
                </td>
                <td style={s.td('#94A3B8')}>{a.timestamp}</td>
                <td style={s.td()}>
                  <span style={s.badge(
                    a.status === 'Active' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                    a.status === 'Active' ? '#EF4444' : '#22C55E'
                  )}>{a.status}</span>
                </td>
                <td style={s.td()}>{a.ack ? '✓' : '✗'}</td>
                <td style={s.td()}>
                  <button onClick={() => toggleAck(a.id)}
                    style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: '4px 12px', color: '#38BDF8', cursor: 'pointer', fontSize: 12 }}>
                    {a.ack ? 'Reactivate' : 'Acknowledge'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={s.empty}>No alarms found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
