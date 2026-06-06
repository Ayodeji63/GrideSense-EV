#!/usr/bin/env node

const TELEMETRY_API_URL =
  process.env.TELEMETRY_API_URL ?? 'https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry'

const timestamp = new Date().toISOString()

const telemetry = {
  stationId: 'NGR-YBA-003',
  timestamp,
  latitude: 6.5158,
  longitude: 3.3843,
  current: {
    I1: 0,
    I2: 0,
    I3: 0,
  },
  voltage: {
    V1: 0,
    V2: 0,
    V3: 0,
  },
  power: {
    realTotal: 0,
    reactiveTotal: 0,
    apparentTotal: 0,
  },
  energy: {
    active: 1548.12,
    reactive: 212.88,
    apparent: 1565.44,
  },
  avgPowerFactor: 0,
  avgFrequency: 0,
  status: 'OFF',
  name: 'Yaba Fleet Depot',
  address: 'Herbert Macaulay Way, Yaba, Lagos',
  chargersTotal: 4,
  chargersAvailable: 0,
  activeSessions: 0,
  queueCount: 0,
  avgSessionMinutes: 28,
  estimatedWait: 28,
  chargeSpeedKw: 60,
  connectorTypes: ['Type2'],
  lastReading: timestamp,
}

async function main() {
  const response = await fetch(TELEMETRY_API_URL, {
    body: JSON.stringify(telemetry),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Failed to turn off Yaba station: ${response.status} ${response.statusText} ${body}`)
  }

  console.log(`Turned off NGR-YBA-003 at ${timestamp}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
