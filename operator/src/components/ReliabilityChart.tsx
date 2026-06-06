import { Bar } from 'react-chartjs-2'
import { reliability } from '../data/mockData'
import { chartGrid, chartTicks } from './chartSetup'
import './chartSetup'

const colorFor = (value: number) => (value >= 85 ? '#10B981' : value >= 70 ? '#F59E0B' : '#EF4444')

export function ReliabilityChart() {
  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <h2>7-day reliability</h2>
          <p>Station uptime average</p>
        </div>
      </div>
      <div className="chart-canvas">
        <Bar
          data={{
            labels: reliability.map((item) => item.station),
            datasets: [
              {
                label: 'Uptime',
                data: reliability.map((item) => item.value),
                backgroundColor: reliability.map((item) => colorFor(item.value)),
                borderRadius: 8,
                barThickness: 18,
              },
            ],
          }}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.parsed.x}% uptime` } } },
            scales: {
              x: { min: 0, max: 100, grid: chartGrid, ticks: { ...chartTicks, callback: (value) => `${value}%` } },
              y: { grid: { display: false }, ticks: chartTicks },
            },
          }}
        />
      </div>
    </section>
  )
}
