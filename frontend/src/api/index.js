const BASE = '/api'

let cachedData = null

export async function fetchScadaData() {
  const res = await fetch(`${BASE}/data`)
  if (!res.ok) throw new Error('Failed to fetch')
  cachedData = await res.json()
  return cachedData
}

export async function refreshScadaData() {
  const res = await fetch(`${BASE}/refresh`)
  if (!res.ok) throw new Error('Failed to refresh')
  cachedData = null
  return fetchScadaData()
}

export function getCachedData() {
  return cachedData
}

export function getInverterData(data) {
  return data?.inverter || []
}

export function getMFMData(data) {
  return data?.mfm || []
}

export function getWeatherData(data) {
  return data?.weather?.[0]?.data || null
}

export function getSiteData(data) {
  return data?.site?.[0] || null
}

export function getPerformanceData(data) {
  return data?.performance || []
}

export function getPerformanceByParam(data, paramName) {
  return data?.performance?.find(p => p.paramName === paramName) || null
}
