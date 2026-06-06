# GridSense EV Wait-Time DynamoDB Setup

This is the backend/cloud setup needed to show driver queue size and estimated wait time in the app.

## Required Tables

### 1. GridSenseStations

Latest station state read by the app.

```txt
Partition key: stationId (String)
```

Important attributes:

```txt
stationId
name
address
lat
lng
gridStatus
voltage
frequency
lastUpdated
chargersTotal
chargersAvailable
activeSessions
queueCount
avgSessionMinutes
estimatedWait
chargeSpeedKw
connectorTypes
```

### 2. GridSenseStationQueue

Drivers waiting for a station.

```txt
Partition key: stationId (String)
Sort key: queueId (String)    # stationId#driverId
```

Attributes:

```txt
driverId
status = WAITING | ARRIVED | CHARGING | CANCELLED | DONE
joinedAt
updatedAt
vehicleModel
connectorType
currentBattery
targetCharge
```

### 3. GridSenseStationSessions

Current charger/session state per port.

```txt
Partition key: stationId (String)
Sort key: chargerId (String)
```

Attributes:

```txt
chargerId
status = AVAILABLE | OCCUPIED | CHARGING | COMPLETE | FAULTED
startedAt
estimatedEndAt
driverId
```

## Wait-Time Formula

The backend recomputes:

```txt
queueCount = number of WAITING/ARRIVED queue rows
activeSessions = number of OCCUPIED/CHARGING charger rows
chargersAvailable = max(chargersTotal - activeSessions, 0)
estimatedWait = time until first port frees + queue batches ahead
```

The result is written back to `GridSenseStations` so the existing `/stations` API can return it to the app.

## Lambda Handlers Added

`handlers/station-queue.js` exports:

```txt
joinQueue(event)
updateQueueStatus(event)
recomputeWaitHandler(event)
```

Suggested API routes:

```txt
POST /queue/join
POST /queue/status
POST /stations/{stationId}/recompute-wait
```

## Required Lambda Environment

```txt
AWS_REGION=us-east-1
STATIONS_TABLE=GridSenseStations
QUEUE_TABLE=GridSenseStationQueue
SESSIONS_TABLE=GridSenseStationSessions
```

## IAM Permissions For Lambda

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:Query"
  ],
  "Resource": [
    "arn:aws:dynamodb:us-east-1:<account-id>:table/GridSenseStations",
    "arn:aws:dynamodb:us-east-1:<account-id>:table/GridSenseStationQueue",
    "arn:aws:dynamodb:us-east-1:<account-id>:table/GridSenseStationSessions"
  ]
}
```

## App Contract

The `/stations` API should include these fields for every station:

```json
{
  "stationId": "NGR-LKI-001",
  "chargersAvailable": 2,
  "chargersTotal": 4,
  "queueCount": 5,
  "activeSessions": 2,
  "avgSessionMinutes": 30,
  "estimatedWait": 28
}
```
