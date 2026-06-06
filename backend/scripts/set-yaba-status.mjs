#!/usr/bin/env node

const TELEMETRY_API_URL =
  process.env.TELEMETRY_API_URL ?? 'https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry'
const requestedStatus = (process.argv[2] ?? 'ON').toUpperCase()
const status = requestedStatus === 'OFF' || requestedStatus === 'OFFLINE' ? 'OFF' : 'ON'
const timestamp = new Date().toISOString()
const offline = status === 'OFF'

const telemetry = {
  stationId: 'NGR-YBA-003',
  timestamp,
  latitude: 6.5158,
  longitude: 3.3843,
  current: {
    I1: offline ? 0 : 18.4,
    I2: 0,
    I3: 0,
  },
  voltage: {
    V1: offline ? 0 : 221.6,
    V2: offline ? 0 : 220.8,
    V3: offline ? 0 : 222.1,
  },
  power: {
    realTotal: offline ? 0 : 4.1,
    reactiveTotal: offline ? 0 : 0.22,
    apparentTotal: offline ? 0 : 4.14,
  },
  energy: {
    active: 1548.12,
    reactive: 212.88,
    apparent: 1565.44,
  },
  avgPowerFactor: offline ? 0 : 0.997,
  avgFrequency: offline ? 0 : 50.12,
  frequency: offline ? 0 : 50.12,
  status,
  gridStatus: offline ? 'OFFLINE' : 'ONLINE',
  name: 'Yaba Fleet Depot',
  address: 'Herbert Macaulay Way, Yaba, Lagos',
  chargersTotal: 4,
  chargersAvailable: offline ? 0 : 3,
  activeSessions: offline ? 0 : 1,
  queueCount: offline ? 0 : 2,
  avgSessionMinutes: 28,
  estimatedWait: offline ? 28 : 0,
  chargeSpeedKw: 60,
  connectorTypes: ['Type2'],
  lastReading: timestamp,
  lastUpdated: timestamp,
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function postTelemetry() {
  let lastError

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(TELEMETRY_API_URL, {
        body: JSON.stringify(telemetry),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.ok) {
        return
      }

      const body = await response.text().catch(() => '')
      lastError = new Error(
        `Failed to set Yaba ${status}: ${response.status} ${response.statusText} ${body}`,
      )

      if (response.status < 500 && response.status !== 429) {
        throw lastError
      }
    } catch (error) {
      lastError = error
    }

    if (attempt < 4) {
      await sleep(400 * attempt)
    }
  }

  throw lastError
}

async function main() {
  await postTelemetry()
  console.log(`Set NGR-YBA-003 to ${status} at ${timestamp}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
