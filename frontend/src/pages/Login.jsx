import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const LOGO_URL = 'https://www.mbcontrol.com/wp-content/uploads/2025/09/mb-contorl-01-logo.svg'

const s = {
  wrapper: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0B1220', padding: 20,
  },
  card: {
    background: '#111827', borderRadius: 16, border: '1px solid #1E293B',
    padding: '48px 40px', width: '100%', maxWidth: 420,
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logoWrap: { textAlign: 'center', marginBottom: 32 },
  logo: { height: 48, width: 'auto', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 700, color: '#F1F5F9', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: {},
  label: { fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' },
  input: {
    width: '100%', background: '#0B1220', border: '1px solid #1E293B',
    borderRadius: 8, padding: '12px 16px', color: '#E2E8F0', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', background: '#1D4ED8', border: 'none', borderRadius: 8,
    padding: '12px', color: '#FFF', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', marginTop: 8,
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8, padding: '10px 14px', color: '#FCA5A5', fontSize: 13,
    textAlign: 'center',
  },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 11, color: '#475569' },
  credBox: {
    marginTop: 20, background: '#0B1220', borderRadius: 8,
    border: '1px solid #1E293B', padding: '12px 16px', fontSize: 11, color: '#64748B',
  },
  credRow: { display: 'flex', justifyContent: 'space-between', padding: '2px 0' },
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = login(username, password)
    if (result.ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <img src={LOGO_URL} alt="MB Control" style={s.logo} onError={e => { e.target.style.display = 'none' }} />
          <div style={s.title}>MB Solar SCADA</div>
          <div style={s.subtitle}>Sign in to your account</div>
        </div>

        <form style={s.form} onSubmit={handleSubmit}>
          {error && <div style={s.error}>{error}</div>}
          <div style={s.field}>
            <label style={s.label}>Username</label>
            <input style={s.input} type="text" placeholder="Enter username" value={username}
              onChange={e => setUsername(e.target.value)} autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="Enter password" value={password}
              onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={s.credBox}>
          <div style={{ fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>Demo Credentials</div>
          <div style={s.credRow}><span>Admin</span><span>admin / admin123</span></div>
          <div style={s.credRow}><span>Operator</span><span>userHartek / Hartek@123</span></div>
        </div>

        <div style={s.footer}>© 2026 M.B. Control & Systems Pvt. Ltd.</div>
      </div>
    </div>
  )
}
