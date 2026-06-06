import 'mapbox-gl/dist/mapbox-gl.css'
import type { FeatureCollection, Point } from 'geojson'
import Map, { Layer, Marker, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'
import { demandPoints } from '../data/mockData'

const token =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  ((globalThis as unknown as { process?: { env?: { REACT_APP_MAPBOX_TOKEN?: string } } }).process?.env?.REACT_APP_MAPBOX_TOKEN ?? '')

const heatmapData: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: demandPoints.map((point) => ({
    type: 'Feature',
    properties: {
      sessions: point.sessions,
      name: point.name,
    },
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude],
    },
  })),
}

const heatmapLayer: LayerProps = {
  id: 'lagos-demand-heat',
  type: 'heatmap',
  source: 'lagos-demand',
  maxzoom: 14,
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'sessions'], 100, 0.15, 1840, 1],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 9, 0.85, 13, 2.1],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 24, 13, 58],
    'heatmap-opacity': 0.78,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(16,185,129,0)',
      0.25,
      '#10B981',
      0.5,
      '#F59E0B',
      0.75,
      '#FB7185',
      1,
      '#EF4444',
    ],
  },
}

const circleLayer: LayerProps = {
  id: 'lagos-demand-circles',
  type: 'circle',
  source: 'lagos-demand',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'sessions'], 120, 7, 1840, 22],
    'circle-color': ['interpolate', ['linear'], ['get', 'sessions'], 120, '#9CA3AF', 480, '#10B981', 960, '#F59E0B', 1840, '#EF4444'],
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 2,
    'circle-opacity': 0.9,
  },
}

export function DemandHeatmap() {
  return (
    <section className="card map-card">
      <div className="card-header">
        <div>
          <h2>Charging demand heatmap - Lagos corridors</h2>
          <p>Mapbox density layer by session volume</p>
        </div>
      </div>
      <div className="map-frame">
        {token ? (
          <Map
            mapboxAccessToken={token}
            initialViewState={{ latitude: 6.5244, longitude: 3.3792, zoom: 10.7 }}
            mapStyle="mapbox://styles/mapbox/light-v11"
          >
            <Source id="lagos-demand" type="geojson" data={heatmapData}>
              <Layer {...heatmapLayer} />
              <Layer {...circleLayer} />
            </Source>
            {demandPoints.map((point) => (
              <Marker latitude={point.latitude} longitude={point.longitude} anchor="bottom" key={point.name}>
                <span className="map-label">{point.name}</span>
              </Marker>
            ))}
          </Map>
        ) : (
          <div className="map-token-panel">Add VITE_MAPBOX_TOKEN to render the Mapbox demand heatmap.</div>
        )}
        <div className="map-legend">
          <span><i className="legend-dot green" /> Low density</span>
          <span><i className="legend-dot amber" /> Medium</span>
          <span><i className="legend-dot red" /> High demand</span>
        </div>
      </div>
      <div className="region-summary">
        <span><strong>Lekki-VI</strong>1,840 sessions/mo</span>
        <span><strong>Ikeja</strong>960 sessions/mo</span>
        <span><strong>Ajah</strong>720 sessions/mo</span>
      </div>
    </section>
  )
}
