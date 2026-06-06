import { Fragment, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { discoZones, regions } from '../data/mockData'
import './chartSetup'

const statusClass = (status: string) => status.toLowerCase()

export function DisCoPressureTable() {
  const [expanded, setExpanded] = useState('Ikeja Electric Zone B')
  const chartData = [205, 194, 186, 174]

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>DisCo grid stress zones</h2>
          <p>Voltage reliability by distribution company region</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>DisCo region</th>
            <th>Avg voltage</th>
            <th>Uptime %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {discoZones.map((zone) => (
            <Fragment key={zone.region}>
              <tr onClick={() => setExpanded(expanded === zone.region ? '' : zone.region)}>
                <td>{zone.region}</td>
                <td>{zone.avgVoltage}V</td>
                <td>{zone.uptime}%</td>
                <td><span className={`gap-pill ${statusClass(zone.status)}`}>{zone.status}</span></td>
              </tr>
              {expanded === zone.region ? (
                <tr className="expanded-row">
                  <td colSpan={4}>
                    <div className="table-sparkline">
                      <Line
                        data={{
                          labels: ['W1', 'W2', 'W3', 'W4'],
                          datasets: [{ data: chartData, borderColor: '#7C3AED', borderWidth: 2, tension: 0.35 }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.parsed.y}V` } } },
                          scales: { x: { display: false }, y: { display: false } },
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function LgaCoverageTable() {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>LGA coverage gaps · top 10</h2>
          <p>Priority zones for infrastructure expansion</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>LGA</th>
            <th>State</th>
            <th>Est. EV trips/day</th>
            <th>Stations</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.name}>
              <td>{region.name}</td>
              <td>{region.state}</td>
              <td>{region.trips}</td>
              <td>{region.stations}</td>
              <td><span className={`gap-pill ${region.priority.toLowerCase()}`}>{region.priority}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
