import { outageRisks } from '../data/mockData'

const riskTone = (risk: number) => (risk >= 70 ? 'red' : risk >= 35 ? 'amber' : 'green')

export function OutageRiskPanel() {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Outage risk · next 6 hours</h2>
          <p>Powered by SageMaker</p>
        </div>
      </div>
      <div className="risk-list">
        {outageRisks.map((item) => (
          <div className="risk-row" key={item.station}>
            <div>
              <strong>{item.station}</strong>
              <span>{item.risk}% {item.label}</span>
            </div>
            <div className="risk-track">
              <span className={riskTone(item.risk)} style={{ width: `${item.risk}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
