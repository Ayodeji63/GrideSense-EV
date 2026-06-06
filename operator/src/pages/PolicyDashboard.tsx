import { DisCoPressureTable, LgaCoverageTable } from '../components/DisCoPressureTable'
import { GridReliabilityBars } from '../components/GridReliabilityBars'
import { KPICard } from '../components/KPICard'
import { NationalLoadProjection } from '../components/LoadForecastChart'
import { NationalCoverageMap } from '../components/NationalCoverageMap'
import { PolicyBrief } from '../components/PolicyBrief'
import { adequacy } from '../data/mockData'

export function PolicyDashboard() {
  return (
    <div className="dashboard-page">
      <div className="kpi-grid">
        <KPICard label="National stations" value="24" subtext="Monitored by GridSense" trend="+3 this quarter" />
        <KPICard label="Coverage gaps" value="31" tone="red" subtext="LGAs with zero stations" trend="31 of 774 LGAs" />
        <KPICard label="Grid stress zones" value="9" tone="amber" subtext="Below 70% avg uptime" trend="2 critical" />
        <KPICard label="EV registrations" value="2,140" tone="green" subtext="Lagos + Abuja" trend="+38% YoY" />
      </div>
      <div className="content-grid policy-grid">
        <div className="main-column">
          <NationalCoverageMap />
          <GridReliabilityBars title="Infrastructure adequacy ratio · by state" data={adequacy} target={5} />
          <NationalLoadProjection />
        </div>
        <div className="side-column">
          <DisCoPressureTable />
          <LgaCoverageTable />
          <PolicyBrief />
        </div>
      </div>
    </div>
  )
}
