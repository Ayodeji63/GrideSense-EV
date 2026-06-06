import { AlertFeed } from '../components/AlertFeed'
import { KPICard } from '../components/KPICard'
import { VoltageTrendChart } from '../components/LoadForecastChart'
import { OutageRiskPanel } from '../components/OutageRiskPanel'
import { ReliabilityChart } from '../components/ReliabilityChart'
import { StationStatusGrid } from '../components/StationStatusGrid'
import type { Alert, Station } from '../data/mockData'

interface OperatorDashboardProps {
  stations: Station[]
  alerts: Alert[]
}

export function OperatorDashboard({ stations, alerts }: OperatorDashboardProps) {
  return (
    <div className="dashboard-page">
      <div className="kpi-grid">
        <KPICard label="Stations online" value="19 / 24" tone="green" subtext="79% fleet uptime" trend="+2 since yesterday" />
        <KPICard label="Active alerts" value="3" tone="red" subtext="2 critical · 1 warning" trend="↑ 1 new" />
        <KPICard label="Avg grid voltage" value="214 V" tone="amber" subtext="Nominal: 220V" trend="↓ 3V" />
        <KPICard label="Sessions today" value="142" subtext="kWh dispensed: 1,840" trend="+18% vs yesterday" />
      </div>
      <div className="content-grid operator-grid">
        <div className="main-column">
          <StationStatusGrid stations={stations} />
          <VoltageTrendChart />
          <ReliabilityChart />
        </div>
        <div className="side-column">
          <OutageRiskPanel />
          <AlertFeed alerts={alerts} />
          <section className="card mini-stats">
            <span><strong>142</strong> sessions today</span>
            <span><strong>1,840</strong> kWh dispensed</span>
            <span><strong>32 min</strong> avg session</span>
          </section>
        </div>
      </div>
    </div>
  )
}
