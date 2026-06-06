import { CorridorTable } from '../components/CorridorTable'
import { DemandHeatmap } from '../components/DemandHeatmap'
import { GridReliabilityBars } from '../components/GridReliabilityBars'
import { InvestmentBrief } from '../components/InvestmentBrief'
import { KPICard } from '../components/KPICard'
import { DemandForecastChart } from '../components/LoadForecastChart'
import { zoneReliability } from '../data/mockData'

export function InvestorDashboard() {
  return (
    <div className="dashboard-page">
      <div className="kpi-grid">
        <KPICard label="Monthly sessions" value="4,821" tone="green" subtext="Last 30 days" trend="+22% MoM" />
        <KPICard label="Avg utilisation" value="34%" tone="amber" subtext="Capacity headroom: 66%" trend="↑ 4% MoM" />
        <KPICard label="Underserved zones" value="7" tone="red" subtext="High demand, no stations" trend="Unchanged" />
        <KPICard label="kWh dispensed" value="18,440" tone="green" subtext="Across all stations" trend="+31% MoM" />
      </div>
      <div className="content-grid investor-grid">
        <div className="main-column">
          <DemandHeatmap />
          <DemandForecastChart />
        </div>
        <div className="side-column">
          <CorridorTable />
          <GridReliabilityBars title="Grid reliability · 30-day avg" data={zoneReliability} />
          <InvestmentBrief />
        </div>
      </div>
    </div>
  )
}
