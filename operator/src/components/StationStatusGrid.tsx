import { useMemo, useState } from 'react'
import type { Station, Status } from '../data/mockData'
import { VoltageSparkline } from './VoltageSparkline'

interface StationStatusGridProps {
  stations: Station[]
}

const filters: Array<'All' | Status> = ['All', 'Online', 'Degraded', 'Offline']

export function StationStatusGrid({ stations }: StationStatusGridProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [expanded, setExpanded] = useState('NGR-LKI-002')

  const rows = useMemo(() => {
    return stations.filter((station) => {
      const matchesQuery = `${station.name} ${station.city}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || station.status === filter
      return matchesQuery && matchesFilter
    })
  }, [stations, query, filter])

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Fleet status</h2>
          <p>Live station telemetry by location</p>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search station" />
      </div>
      <div className="pill-tabs">
        {filters.map((item) => (
          <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>
            {item}
          </button>
        ))}
      </div>
      <div className="station-list">
        {rows.map((station) => (
          <div className="station-wrap" key={station.id}>
            <button type="button" className="station-row" onClick={() => setExpanded(expanded === station.id ? '' : station.id)}>
              <span className={`status-dot ${station.status.toLowerCase()}`} />
              <span className="station-name">
                <strong>{station.name}</strong>
                <small>{station.city}</small>
              </span>
              <span>{station.voltage}V</span>
              <span>{station.frequency.toFixed(station.frequency % 1 ? 2 : 0)}Hz</span>
              <span className="uptime-badge">{station.uptime}%</span>
              <span className={`status-pill ${station.status.toLowerCase()}`}>{station.status}</span>
            </button>
            {expanded === station.id && (
              <div className="station-detail">
                <VoltageSparkline baseVoltage={station.voltage} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
