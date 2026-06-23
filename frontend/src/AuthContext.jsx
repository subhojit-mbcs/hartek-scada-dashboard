import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'Administrator', name: 'Admin User' },
  { username: 'userHartek', password: 'Hartek@123', role: 'Operator', name: 'Plant Operator' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('scada_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (username, password) => {
    const found = VALID_CREDENTIALS.find(c => c.username === username && c.password === password)
    if (found) {
      const userData = { username: found.username, role: found.role, name: found.name }
      sessionStorage.setItem('scada_user', JSON.stringify(userData))
      setUser(userData)
      return { ok: true }
    }
    return { ok: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    sessionStorage.removeItem('scada_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
