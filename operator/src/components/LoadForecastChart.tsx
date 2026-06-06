import type { ChartOptions, Plugin } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { forecast, loadProjection, voltageTrend } from '../data/mockData'
import { chartGrid, chartTicks } from './chartSetup'
import './chartSetup'

const lineMarkerPlugin = (xLabel: string, label: string, color = '#6B7280'): Plugin<'line' | 'bar'> => ({
  id: `marker-${xLabel}-${label}`,
  afterDatasetsDraw(chart) {
    const xScale = chart.scales.x
    const labelIndex = chart.data.labels?.findIndex((item) => item === xLabel) ?? -1
    if (labelIndex < 0) return
    const x = xScale.getPixelForValue(labelIndex)
    const { top, bottom } = chart.chartArea
    const ctx = chart.ctx
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x, bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = color
    ctx.font = '700 12px Inter, system-ui, sans-serif'
    ctx.fillText(label, x + 7, top + 14)
    ctx.restore()
  },
})

const thresholdPlugin: Plugin<'line'> = {
  id: 'outage-threshold',
  afterDatasetsDraw(chart) {
    const y = chart.scales.y.getPixelForValue(180)
    const { left, right } = chart.chartArea
    const ctx = chart.ctx
    ctx.save()
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = '#EF4444'
    ctx.beginPath()
    ctx.moveTo(left, y)
    ctx.lineTo(right, y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#EF4444'
    ctx.font = '700 12px Inter, system-ui, sans-serif'
    ctx.fillText('Outage threshold', right - 122, y - 8)
    ctx.restore()
  },
}

export function VoltageTrendChart() {
  const labels = voltageTrend.map((item) => item.time)

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <h2>Voltage trend - last 30 minutes</h2>
          <p>NGR-LKI-002 decline pattern</p>
        </div>
        <select aria-label="Station selector">
          <option>NGR-LKI-002</option>
        </select>
      </div>
      <div className="chart-canvas">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Voltage',
                data: voltageTrend.map((item) => item.voltage),
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(239, 68, 68, 0.13)',
                fill: true,
                pointBackgroundColor: '#7C3AED',
                pointRadius: 3,
                borderWidth: 3,
                tension: 0.34,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.parsed.y}V` } } },
            scales: {
              x: { grid: { display: false }, ticks: chartTicks },
              y: { min: 160, max: 240, grid: chartGrid, ticks: { ...chartTicks, callback: (value) => `${value}V` } },
            },
          }}
          plugins={[thresholdPlugin]}
        />
      </div>
    </section>
  )
}

export function DemandForecastChart() {
  const labels = forecast.map((item) => item.week)
  const historical = forecast.map((item) => item.historical)
  const projected = forecast.map((item) => item.forecast)

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <h2>Demand forecast · next 30 days</h2>
          <p>Historical and projected weekly sessions</p>
        </div>
      </div>
      <div className="chart-canvas">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Historical',
                data: historical,
                backgroundColor: '#E9D5FF',
                borderRadius: 10,
                barThickness: 28,
              },
              {
                label: 'Forecast',
                data: projected,
                backgroundColor: '#A855F7',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                barThickness: 28,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: chartTicks },
              y: { grid: chartGrid, ticks: chartTicks },
            },
          }}
          plugins={[lineMarkerPlugin('Week 4', 'Today')]}
        />
      </div>
    </section>
  )
}

export function NationalLoadProjection() {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${item.parsed.y}%` } } },
    scales: {
      x: { grid: { display: false }, ticks: chartTicks },
      y: { min: 50, max: 130, grid: chartGrid, ticks: { ...chartTicks, callback: (value) => `${value}%` } },
    },
  }

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <h2>30-day national load projection</h2>
          <p>Projected EV load against current grid capacity</p>
        </div>
      </div>
      <div className="chart-canvas">
        <Line
          data={{
            labels: loadProjection.map((item) => item.week),
            datasets: [
              {
                label: 'Current grid capacity',
                data: loadProjection.map((item) => item.capacity),
                borderColor: '#9CA3AF',
                borderDash: [6, 4],
                pointRadius: 0,
                borderWidth: 2,
              },
              {
                label: 'Projected EV load',
                data: loadProjection.map((item) => item.load),
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                fill: true,
                pointBackgroundColor: '#7C3AED',
                pointRadius: 3,
                borderWidth: 3,
                tension: 0.35,
              },
            ],
          }}
          options={options}
          plugins={[lineMarkerPlugin('Week 6', 'Grid saturation risk', '#EF4444')]}
        />
      </div>
    </section>
  )
}
