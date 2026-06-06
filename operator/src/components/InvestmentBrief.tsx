export function InvestmentBrief() {
  return (
    <section className="card ai-brief purple">
      <span className="ai-badge">✦ Bedrock AI</span>
      <h2>Investment recommendation</h2>
      <p>
        Top deployment opportunity: Lekki-Epe Expressway. 1,200+ daily trips, zero stations, 83% avg grid
        reliability. Estimated ROI timeline: 14 months at current demand growth rate of +22% MoM.
        Secondary priority: Abuja-Gwagwalada corridor - grid reinforcement required before deployment.
      </p>
      <button type="button" onClick={() => console.log('Investment report requested')}>View full report</button>
    </section>
  )
}
