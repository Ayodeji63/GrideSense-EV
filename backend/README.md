# GridSense EV Telemetry Simulator

This backend folder contains local simulators and queue/wait-time helpers for the GridSense EV demo.

## Recommended demo flow: API Gateway telemetry endpoint

This path behaves like the ESP32 demo flow and does not need local AWS credentials. It posts smart-meter-shaped JSON to API Gateway, then the cloud backend writes DynamoDB.

Run once:

```bash
cd backend
npm run simulate:telemetry-api:once
```

Continuously stream all 10 Lagos stations:

```bash
cd backend
npm run simulate:telemetry-api
```

Optional environment:

```bash
export TELEMETRY_API_URL=https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry
export SIM_INTERVAL_MS=5000
```

## Direct DynamoDB simulator

This older path writes live telemetry directly into DynamoDB. Use it only when AWS credentials for the target account are available locally.

Required environment:

```bash
export AWS_REGION=us-east-1
export STATIONS_TABLE=GridSenseStations
```

AWS credentials must be available through your normal AWS chain:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

Optional environment:

```bash
export HISTORY_TABLE=GridSenseStationTelemetryHistory
export SIM_INTERVAL_MS=5000
```

Run once:

```bash
cd backend
npm install
npm run simulate:dynamodb:once
```

Run continuously:

```bash
cd backend
npm install
npm run simulate:dynamodb
```

## Tables

Recommended latest-state table:

```txt
Table: GridSenseStations
Partition key: stationId
```

Optional history table:

```txt
Table: GridSenseStationTelemetryHistory
Partition key: pk
Sort key: sk
```

The app API reads from `GridSenseStations` through `/stations`.

## Simulator scenarios

The API simulator defaults to a stable mobile-demo scenario:

```bash
npm run simulate:telemetry-api:once
```

Stable mode sends all stations as `ON` with healthy voltage/frequency and bounded queue values, so the mobile UI does not bounce between Grid stable, Voltage dip, and Grid off.

Use explicit scenarios when you want to demo anomaly handling:

```bash
SIM_SCENARIO=mixed npm run simulate:telemetry-api:once
SIM_SCENARIO=stress npm run simulate:telemetry-api:once
```

`mixed` sends a small number of degraded/offline stations. `stress` sends several degraded/offline stations.
