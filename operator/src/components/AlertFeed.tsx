import type { Alert } from '../data/mockData'

export function AlertFeed({ alerts }: { alerts: Alert[] }) {
  return (
    <section className="card alert-card">
      <div className="card-header">
        <div>
          <h2>AI alert feed</h2>
          <p>Real-time anomaly detection</p>
        </div>
        <span className="live-badge"><span className="pulse-dot" />Live</span>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <article className={`alert-item ${alert.severity}`} key={alert.id}>
            <strong>{alert.station}</strong>
            <p>{alert.message}</p>
            <small>{alert.timestamp} · Bedrock</small>
          </article>
        ))}
      </div>
    </section>
  )
}
