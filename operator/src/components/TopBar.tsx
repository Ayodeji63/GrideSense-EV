interface TopBarProps {
  title: string
  alertCount: number
}

export function TopBar({ title, alertCount }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>Grid telemetry, demand intelligence, and infrastructure risk monitoring.</p>
      </div>
      <div className="topbar-actions">
        <select aria-label="Date range">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 30 Days</option>
        </select>
        <button className="icon-button" type="button" aria-label="Notifications">
          <span>●</span>
          <b>{alertCount}</b>
        </button>
        <button className="export-button" type="button">Export PDF</button>
      </div>
    </header>
  )
}
