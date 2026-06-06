#!/usr/bin/env node

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.AWS_REGION ?? 'us-east-1'
const STATIONS_TABLE = process.env.STATIONS_TABLE ?? 'GridSenseStations'
const HISTORY_TABLE = process.env.HISTORY_TABLE
const INTERVAL_MS = Number(process.env.SIM_INTERVAL_MS ?? 5000)
const RUN_ONCE = process.argv.includes('--once')

const stations = [
  {
    stationId: 'NGR-VI-002',
    name: 'Victoria Island ChargePark',
    address: 'Akin Adesola Street, Victoria Island',
    latitude: 6.4281,
    longitude: 3.4219,
    chargersTotal: 5,
    chargeSpeedKw: 90,
    connectorTypes: ['CCS2'],
  },
  {
    stationId: 'NGR-YBA-003',
    name: 'Yaba Fleet Depot',
    address: 'Herbert Macaulay Way, Yaba',
    latitude: 6.5158,
    longitude: 3.3843,
    chargersTotal: 4,
    chargeSpeedKw: 60,
    connectorTypes: ['Type 2'],
  },
  {
    stationId: 'NGR-IKJ-004',
    name: 'Ikeja GridSense Point',
    address: 'Allen Avenue, Ikeja',
    latitude: 6.6018,
    longitude: 3.3515,
    chargersTotal: 3,
    chargeSpeedKw: 75,
    connectorTypes: ['CCS2', 'Type 2'],
  },
  {
    stationId: 'NGR-SUR-005',
    name: 'Surulere EV Plaza',
    address: 'Adeniran Ogunsanya Street, Surulere',
    latitude: 6.5012,
    longitude: 3.358,
    chargersTotal: 4,
    chargeSpeedKw: 80,
    connectorTypes: ['CCS2'],
  },
  {
    stationId: 'NGR-AJA-006',
    name: 'Ajah Express Charge',
    address: 'Lekki-Epe Expressway, Ajah',
    latitude: 6.4698,
    longitude: 3.5852,
    chargersTotal: 6,
    chargeSpeedKw: 150,
    connectorTypes: ['CCS2', 'Type 2'],
  },
  {
    stationId: 'NGR-EBT-007',
    name: 'Ebutte Metta Charge Yard',
    address: 'Murtala Muhammed Way, Ebute Metta',
    latitude: 6.4889,
    longitude: 3.3847,
    chargersTotal: 3,
    chargeSpeedKw: 50,
    connectorTypes: ['Type 2'],
  },
  {
    stationId: 'NGR-GBG-008',
    name: 'Gbagada Smart Charger',
    address: 'Gbagada Expressway, Lagos',
    latitude: 6.5582,
    longitude: 3.3889,
    chargersTotal: 4,
    chargeSpeedKw: 100,
    connectorTypes: ['CCS2'],
  },
  {
    stationId: 'NGR-FES-009',
    name: 'Festac Charging Bay',
    address: '2nd Avenue, Festac Town',
    latitude: 6.4694,
    longitude: 3.2847,
    chargersTotal: 3,
    chargeSpeedKw: 70,
    connectorTypes: ['CCS2', 'Type 2'],
  },
  {
    stationId: 'NGR-IKO-010',
    name: 'Ikorodu EV Hub',
    address: 'Lagos Road, Ikorodu',
    latitude: 6.6194,
    longitude: 3.5105,
    chargersTotal: 5,
    chargeSpeedKw: 90,
    connectorTypes: ['CCS2'],
  },
]

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

function numberBetween(min, max, decimals = 2) {
  return Number((min + Math.random() * (max - min)).toFixed(decimals))
}

function chooseStatus() {
  const chance = Math.random()

  if (chance < 0.78) return 'ON'
  if (chance < 0.9) return 'DEGRADED'
  if (chance < 0.97) return 'OFF'
  return 'UNKNOWN'
}

function gridStatusFromMeterStatus(status) {
  if (status === 'ON') return 'ONLINE'
  if (status === 'OFF') return 'OFFLINE'
  return status
}

function buildTelemetry(station) {
  const status = chooseStatus()
  const degraded = status === 'DEGRADED'
  const offline = status === 'OFF'
  const unknown = status === 'UNKNOWN'
  const voltageBase = offline ? 0 : degraded ? numberBetween(180, 199) : numberBetween(214, 235)
  const frequency = offline || unknown ? 0 : degraded ? numberBetween(48.8, 49.4) : numberBetween(49.8, 50.8)
  const realPower = offline || unknown ? 0 : numberBetween(2.1, Math.min(28, station.chargeSpeedKw / 4))
  const currentL1 = offline || unknown ? 0 : numberBetween(8, 36)
  const chargersAvailable =
    offline || unknown ? 0 : Math.max(0, Math.floor(numberBetween(0, station.chargersTotal + 0.99, 0)))
  const estimatedWait = chargersAvailable > 0 ? numberBetween(0, 6, 0) : numberBetween(8, 32, 0)
  const timestamp = new Date().toISOString()

  return {
    stationId: station.stationId,
    timestamp,
    latitude: station.latitude,
    longitude: station.longitude,
    current: {
      I1: currentL1,
      I2: offline || unknown ? 0 : numberBetween(0, 2),
      I3: offline || unknown ? 0 : numberBetween(0, 1),
    },
    voltage: {
      V1: voltageBase,
      V2: offline || unknown ? 0 : numberBetween(voltageBase - 2, voltageBase + 2),
      V3: offline || unknown ? 0 : numberBetween(voltageBase - 2, voltageBase + 2),
    },
    power: {
      realTotal: realPower,
      reactiveTotal: offline || unknown ? 0 : numberBetween(0.05, 0.45),
      apparentTotal: offline || unknown ? 0 : Number((realPower + numberBetween(0.05, 0.55)).toFixed(2)),
    },
    energy: {
      active: numberBetween(1400, 1800),
      reactive: numberBetween(180, 260),
      apparent: numberBetween(1450, 1850),
    },
    avgPowerFactor: offline || unknown ? 0 : numberBetween(0.93, 0.999, 3),
    avgFrequency: frequency,
    status,
    gridStatus: gridStatusFromMeterStatus(status),
    name: station.name,
    address: station.address,
    lat: station.latitude,
    lng: station.longitude,
    lastUpdated: timestamp,
    voltageV1: voltageBase,
    frequency,
    estimatedWait,
    chargersAvailable,
    chargersTotal: station.chargersTotal,
    chargeSpeedKw: station.chargeSpeedKw,
    connectorTypes: station.connectorTypes,
  }
}

async function writeTelemetry(telemetry) {
  await client.send(
    new PutCommand({
      TableName: STATIONS_TABLE,
      Item: telemetry,
    }),
  )

  if (HISTORY_TABLE) {
    await client.send(
      new PutCommand({
        TableName: HISTORY_TABLE,
        Item: {
          ...telemetry,
          pk: telemetry.stationId,
          sk: telemetry.timestamp,
        },
      }),
    )
  }
}

async function publishBatch() {
  const telemetryBatch = stations.map(buildTelemetry)
  await Promise.all(telemetryBatch.map(writeTelemetry))

  console.log(
    `[${new Date().toISOString()}] wrote ${telemetryBatch.length} station telemetry records to ${STATIONS_TABLE}`,
  )
}

async function main() {
  console.log(`GridSense EV DynamoDB simulator`)
  console.log(`region=${REGION}`)
  console.log(`stationsTable=${STATIONS_TABLE}`)
  console.log(`historyTable=${HISTORY_TABLE ?? '(disabled)'}`)
  console.log(`intervalMs=${INTERVAL_MS}`)

  await publishBatch()

  if (RUN_ONCE) {
    return
  }

  setInterval(() => {
    publishBatch().catch((error) => {
      console.error('Failed to write telemetry batch', error)
    })
  }, INTERVAL_MS)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
