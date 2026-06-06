import type { ChartOptions, Plugin } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { chartGrid, chartTicks } from './chartSetup'
import './chartSetup'

interface GridReliabilityBarsProps {
  title: string
  subtitle?: string
  data: Array<{ zone?: string; state?: string; value: number }>
  target?: number
}

const colorFor = (value: number) => (value >= 85 || value >= 8 ? '#10B981' : value >= 70 || value >= 4 ? '#F59E0B' : '#EF4444')

const targetPlugin = (target?: number): Plugin<'bar'> => ({
  id: `target-line-${target ?? 'none'}`,
  afterDatasetsDraw(chart) {
    if (!target) return
    const scale = chart.scales.x
    const x = scale.getPixelForValue(target)
    const { top, bottom } = chart.chartArea
    const ctx = chart.ctx
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = '#7C3AED'
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x, bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#7C3AED'
    ctx.font = '700 12px Inter, system-ui, sans-serif'
    ctx.fillText('Target ratio', x + 6, top + 12)
    ctx.restore()
  },
})

export function GridReliabilityBars({ title, subtitle, data, target }: GridReliabilityBarsProps) {
  const max = target ? 12 : 100
  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 0, max, grid: chartGrid, ticks: chartTicks },
      y: { grid: { display: false }, ticks: chartTicks },
    },
  }

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="chart-canvas">
        <Bar
          data={{
            labels: data.map((item) => item.zone ?? item.state),
            datasets: [
              {
                data: data.map((item) => item.value),
                backgroundColor: data.map((item) => colorFor(item.value)),
                borderRadius: 8,
                barThickness: 18,
              },
            ],
          }}
          options={options}
          plugins={[targetPlugin(target)]}
        />
      </div>
    </section>
  )
}
