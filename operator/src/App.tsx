import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { initialAlerts, stations as seedStations, type Alert, type Role, type Station } from './data/mockData'
import { InvestorDashboard } from './pages/InvestorDashboard'
import { OperatorDashboard } from './pages/OperatorDashboard'
import { PolicyDashboard } from './pages/PolicyDashboard'

const titles: Record<Role, string> = {
  operator: 'Operations Control Center',
  investor: 'Market Opportunity Intelligence',
  policy: 'Policy & Infrastructure Planning',
}

const roleFromPath = (): Role => {
  const path = window.location.pathname
  if (path.includes('investor')) return 'investor'
  if (path.includes('policy')) return 'policy'
  return 'operator'
}

function App() {
  const [activeRole, setActiveRole] = useState<Role>(roleFromPath)
  const [stations, setStations] = useState<Station[]>(seedStations)
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  useEffect(() => {
    const onPopState = () => setActiveRole(roleFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleRoleChange = (role: Role) => {
    setActiveRole(role)
    window.history.pushState({}, '', `/${role}`)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStations((current) => {
        const candidates = current.filter((station) => station.status !== 'Offline')
        const selected = candidates[Math.floor(Math.random() * candidates.length)]
        const delta = Math.random() > 0.5 ? 2 : -2

        return current.map((station) =>
          station.id === selected.id ? { ...station, voltage: Math.max(160, station.voltage + delta) } : station,
        )
      })

      setAlerts((current) => {
        const station = seedStations[Math.floor(Math.random() * seedStations.length)]
        const now = new Date()
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        const nextAlert: Alert = {
          id: Date.now(),
          severity: station.status === 'Offline' ? 'critical' : station.voltage < 200 ? 'warning' : 'success',
          station: station.id,
          message: `${station.city} telemetry refreshed. Voltage variance detected within live grid feed.`,
          timestamp,
        }
        return [nextAlert, ...current].slice(0, 8)
      })
    }, 8000)

    return () => window.clearInterval(timer)
  }, [])

  const page = useMemo(() => {
    if (activeRole === 'investor') return <InvestorDashboard />
    if (activeRole === 'policy') return <PolicyDashboard />
    return <OperatorDashboard stations={stations} alerts={alerts} />
  }, [activeRole, stations, alerts])

  return (
    <div className="app-shell">
      <Sidebar activeRole={activeRole} onRoleChange={handleRoleChange} />
      <main className="main-content">
        <TopBar title={titles[activeRole]} alertCount={alerts.filter((alert) => alert.severity !== 'success').length} />
        {page}
      </main>
    </div>
  )
}

export default App
