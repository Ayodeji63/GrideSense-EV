interface KPICardProps {
  label: string
  value: string
  tone?: 'default' | 'green' | 'amber' | 'red'
  subtext: string
  trend: string
}

export function KPICard({ label, value, tone = 'default', subtext, trend }: KPICardProps) {
  return (
    <article className="kpi-card">
      <div className={`kpi-value ${tone}`}>{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-subtext">{subtext}</div>
      <span className={`trend-chip ${tone}`}>{trend}</span>
    </article>
  )
}
