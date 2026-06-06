# GridSense EV

GridSense EV is a mobile-first EV charging intelligence app for Nigeria. It helps drivers discover nearby stations, compare live charger conditions, inspect queue and grid health signals, and navigate to the most suitable charging stop based on battery state, connector compatibility, and live station telemetry.

This repository contains the React frontend for the driver experience. It also integrates with a sibling backend workspace that simulates telemetry, posts live station updates, and supports queue and station-state demos.

## What the app does

- Shows a landing page before the driver enters the app.
- Provides a driver home screen with editable battery and target charge controls for demo scenarios.
- Ranks Lagos charging stations by suitability using battery range, connector compatibility, live station status, estimated wait time, charger speed, and placeholder reliability signals.
- Offers a real map experience built with Mapbox.
- Routes drivers to the nearest suitable or best-ranked station.
- Displays activity, charging-session, and profile views inside a phone-style PWA shell.
- Supports light mode and dark mode.

## Product context

GridSense EV is designed around a real operating problem:

- EV drivers need a single interface to answer where charging stations are, which ones are functional, how long the wait might be, and which station best fits their battery and vehicle.
- Operators and infrastructure teams need a telemetry-backed visibility layer.
- Smart-meter and ESP32 telemetry can be pushed into the cloud and reflected in the driver app.

## Tech stack

Frontend:

- React 19
- TypeScript
- Vite
- `react-map-gl`
- `mapbox-gl`
- `react-icons`

Backend integration:

- AWS API Gateway
- AWS Lambda
- DynamoDB
- ESP32 telemetry posting to `POST /telemetry`

## Project structure

```text
gridsense/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── App.tsx
│   └── App.css
├── package.json
└── README.md
```

Important frontend files:

- `src/App.tsx`: main app state, screen navigation, station polling, and suitability scoring.
- `src/data/stations.ts`: fallback station catalog, API normalization, and wait-time helpers.
- `src/components/StationMap.tsx`: Mapbox map, markers, popups, and route drawing.
- `src/pages/LandingPage.tsx`: first entry screen.
- `src/pages/HomePage.tsx`: driver dashboard.
- `src/pages/MapPage.tsx`: map and nearest-suitable flow.
- `src/pages/ActivitiesPage.tsx`: live charging session UI.
- `src/pages/ProfilePage.tsx`: driver and vehicle profile UI.

## Screens in the app

### Landing

The landing page is the first screen shown. It introduces GridSense EV and provides a clear action to enter the driver app.

### Home

The home screen is built for quick demo exploration:

- battery percentage is editable
- target charge is editable
- vehicle profile is shown
- the best station recommendation is surfaced

### Map

The map screen includes:

- Lagos-centered Mapbox map
- live station markers
- route preview and route drawing
- nearest suitable button
- ranked station carousel
- station detail sheet

The `Nearest suitable` button is distance-first, with wait time and availability as tie-breakers. This is intentionally different from the general ranked list, which optimizes for overall suitability.

### Activities

The activities tab shows an active charging-session view with:

- charging progress
- current station
- duration
- time remaining
- units delivered
- total cost

### Profile

The profile tab includes:

- driver pass
- connected EV profile
- battery capacity
- max charge speed
- connector type
- wallet and preferences

## Station scoring model

The driver recommendation logic combines multiple factors:

- range fit
- distance fit
- wait fit
- charger speed fit
- live charger availability
- reliability placeholder
- outage risk placeholder
- urgency fit
- estimated session duration based on battery target and vehicle charging limits

Queue wait estimation uses:

```text
driversAhead = max(queueCount - chargersAvailable, 0)
estimatedWait = ceil(driversAhead / chargersTotal) * avgSessionMinutes
```

The app also estimates charging session duration using:

- current battery %
- target charge %
- vehicle battery capacity
- effective station charging speed, capped by vehicle max charging speed

## Environment variables

The frontend supports the following environment variables:

```bash
VITE_STATIONS_API_URL
VITE_STATIONS_POLL_INTERVAL_MS
VITE_REACT_MAPBOX_TOKEN
VITE_MAPBOX_TOKEN
VITE_REACT_WS_URL
VITE_WS_URL
```

Notes:

- `VITE_REACT_MAPBOX_TOKEN` is the primary token used by the map.
- `VITE_STATIONS_API_URL` defaults to:

```text
https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/stations
```

- `VITE_STATIONS_POLL_INTERVAL_MS` defaults to `5000`.

Example `.env`:

```bash
VITE_REACT_MAPBOX_TOKEN=your_mapbox_token
VITE_STATIONS_API_URL=https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/stations
VITE_STATIONS_POLL_INTERVAL_MS=5000
VITE_REACT_WS_URL=wss://your-websocket-endpoint
```

## Running the frontend

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Backend workspace

The backend tools used during development live in a sibling folder outside this repo root:

```text
../backend
```

That backend workspace contains:

- telemetry simulators
- demo scripts for station on/off control
- wait-time calculation tests
- queue/session support code

Common backend demo commands:

```bash
cd ../backend
npm run simulate:telemetry-api:once
npm run simulate:telemetry-api
npm run demo:yaba-on
npm run demo:yaba-off
npm run demo:esp-on
npm run demo:esp-off
```

## Real ESP32 integration

The real ESP32 station is represented by:

```text
stationId: NGR-ESP-011
name: ESP32 Station 371
latitude: 6.661302477957246
longitude: 3.25106035421942
```

The real ESP32 code posts directly to:

```text
POST https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry
```

The telemetry payload includes:

- `stationId`
- `timestamp`
- `latitude`
- `longitude`
- `current`
- `voltage`
- `power`
- `energy`
- `avgPowerFactor`
- `avgFrequency`
- `status`
- station metadata such as queue, chargers, connector types, and charge speed

The frontend normalizes that payload in `src/data/stations.ts`.

## Map behavior

The map experience supports:

- live marker selection
- popup details
- route drawing with Mapbox Directions
- auto-fit camera to route or station
- tap-away dismissal of popup and detail sheet

When a marker or nearest-suitable action is selected, the app:

1. selects the station
2. requests a route
3. draws the route
4. fits the camera around the route

## Known integration caveats

At the moment, the main frontend is wired for live updates, but backend availability still depends on the cloud read path returning valid station rows.

Known caveats from integration testing:

- `POST /telemetry` has been observed to succeed while `GET /stations` sometimes returns an empty array.
- When that happens, the frontend falls back to local station metadata.
- The backend read path should return station metadata, current status, voltage and frequency, queue values, charger counts, and the last reading timestamp.

## Demo notes

For a stable UI demo:

- use the real ESP32 publisher for `NGR-ESP-011`
- use `simulate:telemetry-api:once` for calm seeded station data
- avoid running aggressive mixed or stress simulators continuously unless you want grid anomalies in the UI

For anomaly demos:

- set stations like Yaba or the ESP32 station to `OFF`
- use degraded/offline scenarios intentionally

## Design notes

The UI is intentionally mobile-first and built around a phone-frame shell because the driver experience is optimized for mobile use in a hackathon/demo context.

Design principles used here:

- dense but readable data presentation
- live telemetry surfaced as driver-facing language
- strong map-first interaction
- explicit charging suitability rather than distance-only sorting

## Verification

The frontend has been routinely verified with:

```bash
npm run lint
npm run build
```

The backend demo workspace has also been used to test:

- telemetry POST flow
- wait-time calculation logic
- manual station on/off overrides

## Next steps

Likely next improvements:

- restore fully reliable `GET /stations` backend read behavior
- persist station queue/session fields consistently in DynamoDB
- replace placeholder reliability metrics with real uptime analytics
- add investor/operator analytics views
- connect onboarding so vehicle selection is user-driven instead of fixed in app state

## License

No license file is currently included in this repository.
