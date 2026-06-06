import { Fragment, useState } from 'react'
import { corridors } from '../data/mockData'

export function CorridorTable() {
  const [expanded, setExpanded] = useState('Lekki-Epe Expressway')

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Underserved corridors</h2>
          <p>Ranked by demand gap score</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Corridor</th>
            <th>Est. daily trips</th>
            <th>Stations</th>
            <th>Gap</th>
          </tr>
        </thead>
        <tbody>
          {corridors.map((corridor) => (
            <Fragment key={corridor.name}>
              <tr onClick={() => setExpanded(expanded === corridor.name ? '' : corridor.name)}>
                <td>{corridor.name}</td>
                <td>{corridor.dailyTrips.toLocaleString()}</td>
                <td>{corridor.stations}</td>
                <td><span className={`gap-pill ${corridor.gap.toLowerCase()}`}>{corridor.gap}</span></td>
              </tr>
              {expanded === corridor.name ? (
                <tr className="expanded-row" key={`${corridor.name}-detail`}>
                  <td colSpan={4}>Grid reliability score: {corridor.reliability}% · Nearest existing station: {corridor.nearestKm}km</td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  )
}
