import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0B1220' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  content: { flex: 1, padding: '24px', overflow: 'auto' },
}

export default function Layout({ children, data, loading, error, onRefresh }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={styles.layout}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.main}>
        <Header data={data} onRefresh={onRefresh} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div style={styles.content}>
          {error && (
            <div style={{ background: '#450A0A', color: '#FCA5A5', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
              Connection Error: {error}
            </div>
          )}
          {React.cloneElement(children, { data, loading })}
        </div>
      </div>
    </div>
  )
}
