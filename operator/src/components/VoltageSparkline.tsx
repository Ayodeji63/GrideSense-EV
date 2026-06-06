import { Line } from 'react-chartjs-2'
import './chartSetup'

export function VoltageSparkline({ baseVoltage }: { baseVoltage: number }) {
  const values = Array.from({ length: 12 }, (_, index) =>
    Math.max(0, baseVoltage + Math.round(Math.sin(index / 2) * 4) - (index > 7 ? 3 : 0)),
  )

  return (
    <div className="sparkline">
      <span>Voltage sparkline</span>
      <div className="sparkline-canvas">
        <Line
          data={{
            labels: values.map((_, index) => `${index + 1}`),
            datasets: [
              {
                data: values,
                borderColor: '#7C3AED',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.35,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.parsed.y}V` } } },
            scales: { x: { display: false }, y: { display: false } },
          }}
        />
      </div>
    </div>
  )
}
