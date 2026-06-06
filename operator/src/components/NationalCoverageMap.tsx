import 'mapbox-gl/dist/mapbox-gl.css'
import type { FeatureCollection, Point } from 'geojson'
import Map, { Layer, Marker, Source } from 'react-map-gl/mapbox'
import type { LayerProps } from 'react-map-gl/mapbox'

const token =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  ((globalThis as unknown as { process?: { env?: { REACT_APP_MAPBOX_TOKEN?: string } } }).process?.env?.REACT_APP_MAPBOX_TOKEN ?? '')

const stationPoints = [
  { name: 'Lekki', latitude: 6.4281, longitude: 3.4219 },
  { name: 'Ikeja', latitude: 6.6018, longitude: 3.3515 },
  { name: 'Abuja CBD', latitude: 9.0765, longitude: 7.3986 },
  { name: 'Port Harcourt', latitude: 4.8156, longitude: 7.0498 },
  { name: 'Victoria Island', latitude: 6.4474, longitude: 3.3903 },
  { name: 'Enugu', latitude: 6.5244, longitude: 7.5189 },
]

const gapPoints = [
  { name: 'Lekki-Epe', latitude: 6.498, longitude: 3.78, priority: 90 },
  { name: 'Abuja-Gwagwalada', latitude: 8.94, longitude: 7.08, priority: 84 },
  { name: 'Aba', latitude: 5.1066, longitude: 7.3667, priority: 78 },
  { name: 'Enugu-Onitsha corridor', latitude: 6.18, longitude: 7.06, priority: 76 },
  { name: 'Kano', latitude: 12.0022, longitude: 8.592, priority: 68 },
]

const gapHeatmapData: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: gapPoints.map((point) => ({
    type: 'Feature',
    properties: { priority: point.priority, name: point.name },
    geometry: { type: 'Point', coordinates: [point.longitude, point.latitude] },
  })),
}

const gapHeatmapLayer: LayerProps = {
  id: 'national-gap-heat',
  type: 'heatmap',
  source: 'national-gaps',
  maxzoom: 9,
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'priority'], 50, 0.25, 95, 1],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 4, 0.85, 7, 1.9],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 4, 30, 8, 72],
    'heatmap-opacity': 0.76,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(239,68,68,0)',
      0.35,
      '#FDE68A',
      0.65,
      '#FB923C',
      1,
      '#EF4444',
    ],
  },
}

const gapCircleLayer: LayerProps = {
  id: 'national-gap-points',
  type: 'circle',
  source: 'national-gaps',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'priority'], 60, 8, 95, 20],
    'circle-color': '#EF4444',
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 2,
    'circle-opacity': 0.85,
  },
}

export function NationalCoverageMap() {
  return (
    <section className="card map-card">
      <div className="card-header">
        <div>
          <h2>National infrastructure heatmap</h2>
          <p>Mapbox gap density with monitored station markers</p>
        </div>
      </div>
      <div className="map-frame nigeria">
        {token ? (
          <Map
            mapboxAccessToken={token}
            initialViewState={{ latitude: 9.082, longitude: 8.6753, zoom: 5.35 }}
            mapStyle="mapbox://styles/mapbox/light-v11"
          >
            <Source id="national-gaps" type="geojson" data={gapHeatmapData}>
              <Layer {...gapHeatmapLayer} />
              <Layer {...gapCircleLayer} />
            </Source>
            {stationPoints.map((station) => (
              <Marker latitude={station.latitude} longitude={station.longitude} anchor="bottom" key={station.name}>
                <span className="pin green" title={station.name} />
              </Marker>
            ))}
          </Map>
        ) : (
          <div className="map-token-panel">Add VITE_MAPBOX_TOKEN to render the Mapbox national heatmap.</div>
        )}
        <div className="map-legend">
          <span><i className="legend-dot green" /> Monitored station</span>
          <span><i className="legend-dot red" /> Coverage gap heat</span>
        </div>
      </div>
    </section>
  )
}
