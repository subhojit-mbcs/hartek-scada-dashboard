import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Inverters from './pages/Inverters'
import Weather from './pages/Weather'
import EnergyMeter from './pages/EnergyMeter'
import Annunciator from './pages/Annunciator'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { fetchScadaData } from './api'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const d = await fetchScadaData()
        setData(d)
        setError(null)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [user])

  const refresh = async () => {
    setLoading(true)
    try {
      const d = await fetchScadaData()
      setData(d)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout data={data} loading={loading} error={error} onRefresh={refresh}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard data={data} loading={loading} />} />
        <Route path="/inverters" element={<Inverters data={data} loading={loading} />} />
        <Route path="/weather" element={<Weather data={data} loading={loading} />} />
        <Route path="/energy-meter" element={<EnergyMeter data={data} loading={loading} />} />
        <Route path="/annunciator" element={<Annunciator data={data} />} />
        <Route path="/reports" element={<Reports data={data} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}
