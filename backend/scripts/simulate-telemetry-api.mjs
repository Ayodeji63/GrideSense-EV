#!/usr/bin/env node

const TELEMETRY_API_URL =
  process.env.TELEMETRY_API_URL ?? 'https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry'
const INTERVAL_MS = Number(process.env.SIM_INTERVAL_MS ?? 5000)
const RUN_ONCE = process.argv.includes('--once')
const SCENARIO = process.env.SIM_SCENARIO ?? 'stable'
const POST_RETRIES = Number(process.env.SIM_POST_RETRIES ?? 3)
const POST_RETRY_BASE_MS = Number(process.env.SIM_POST_RETRY_BASE_MS ?? 350)
const POST_SPACING_MS = Number(process.env.SIM_POST_SPACING_MS ?? 150)

const stations = [
  {
    stationId: 'NGR-LKI-001',
    name: 'Lekki Phase 1',
    address: 'Admiralty Way, Lekki Phase 1, Lagos',
    latitude: 6.4474,
    longitude: 3.4699,
    chargersTotal: 6,
    chargeSpeedKw: 60,
    connectorTypes: ['CCS2', 'Type2'],
    avgSessionMinutes: 35,
  },
  {
    stationId: 'NGR-VI-002',
    name: 'Victoria Island ChargePark',
    address: 'Akin Adesola Street, Victoria Island, Lagos',
    latitude: 6.4281,
    longitude: 3.4219,
    chargersTotal: 5,
    chargeSpeedKw: 90,
    connectorTypes: ['CCS2'],
    avgSessionMinutes: 32,
  },
  {
    stationId: 'NGR-YBA-003',
    name: 'Yaba Fleet Depot',
    address: 'Herbert Macaulay Way, Yaba, Lagos',
    latitude: 6.5158,
    longitude: 3.3843,
    chargersTotal: 4,
    chargeSpeedKw: 60,
    connectorTypes: ['Type2'],
    avgSessionMinutes: 28,
  },
  {
    stationId: 'NGR-IKJ-004',
    name: 'Ikeja GridSense Point',
    address: 'Allen Avenue, Ikeja, Lagos',
    latitude: 6.6018,
    longitude: 3.3515,
    chargersTotal: 3,
    chargeSpeedKw: 75,
    connectorTypes: ['CCS2', 'Type2'],
    avgSessionMinutes: 38,
  },
  {
    stationId: 'NGR-SUR-005',
    name: 'Surulere EV Plaza',
    address: 'Adeniran Ogunsanya Street, Surulere, Lagos',
    latitude: 6.5012,
    longitude: 3.358,
    chargersTotal: 4,
    chargeSpeedKw: 80,
    connectorTypes: ['CCS2'],
    avgSessionMinutes: 30,
  },
  {
    stationId: 'NGR-AJA-006',
    name: 'Ajah Express Charge',
    address: 'Lekki-Epe Expressway, Ajah, Lagos',
    latitude: 6.4698,
    longitude: 3.5852,
    chargersTotal: 6,
    chargeSpeedKw: 150,
    connectorTypes: ['CCS2', 'Type2'],
    avgSessionMinutes: 26,
  },
  {
    stationId: 'NGR-EBT-007',
    name: 'Ebute Metta Charge Yard',
    address: 'Murtala Muhammed Way, Ebute Metta, Lagos',
    latitude: 6.4889,
    longitude: 3.3847,
    chargersTotal: 3,
    chargeSpeedKw: 50,
    connectorTypes: ['Type2'],
    avgSessionMinutes: 34,
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
    avgSessionMinutes: 29,
  },
  {
    stationId: 'NGR-FES-009',
    name: 'Festac Charging Bay',
    address: '2nd Avenue, Festac Town, Lagos',
    latitude: 6.4694,
    longitude: 3.2847,
    chargersTotal: 3,
    chargeSpeedKw: 70,
    connectorTypes: ['CCS2', 'Type2'],
    avgSessionMinutes: 36,
  },
  {
    stationId: 'NGR-IKO-010',
    name: 'Ikorodu EV Hub',
    address: 'Lagos Road, Ikorodu, Lagos',
    latitude: 6.6194,
    longitude: 3.5105,
    chargersTotal: 5,
    chargeSpeedKw: 90,
    connectorTypes: ['CCS2'],
    avgSessionMinutes: 33,
  },
]

function numberBetween(min, max, decimals = 2) {
  return Number((min + Math.random() * (max - min)).toFixed(decimals))
}

function integerBetween(min, max) {
  return Math.floor(numberBetween(min, max + 1, 0))
}

function chooseStatus(stationIndex) {
  if (SCENARIO === 'stable') {
    return 'ON'
  }

  if (SCENARIO === 'stress') {
    if (stationIndex % 5 === 0) return 'OFF'
    if (stationIndex % 2 === 0) return 'DEGRADED'
    return 'ON'
  }

  if (SCENARIO === 'mixed') {
    if (stationIndex === 3) return 'OFF'
    if (stationIndex === 1 || stationIndex === 8) return 'DEGRADED'
    return 'ON'
  }

  return 'ON'
}

function calculateEstimatedWait({ avgSessionMinutes, chargersAvailable, chargersTotal, queueCount }) {
  const total = Math.max(1, chargersTotal)
  const driversAhead = Math.max(queueCount - chargersAvailable, 0)

  if (driversAhead === 0) {
    return 0
  }

  return Math.ceil(driversAhead / total) * avgSessionMinutes
}

function buildTelemetry(station, stationIndex) {
  const status = chooseStatus(stationIndex)
  const offline = status === 'OFF'
  const degraded = status === 'DEGRADED'
  const voltageBase = offline ? numberBetween(0, 5) : degraded ? numberBetween(180, 199) : numberBetween(214, 235)
  const frequency = offline ? 0 : degraded ? numberBetween(48.8, 49.4) : numberBetween(49.8, 50.8)
  const currentBase = offline ? 0 : SCENARIO === 'stable' ? numberBetween(12, 38) : numberBetween(10, 72)
  const stableActiveSessions = Math.min(station.chargersTotal - 1, Math.max(1, (stationIndex % station.chargersTotal) + 1))
  const activeSessions = offline
    ? 0
    : SCENARIO === 'stable'
      ? stableActiveSessions
      : integerBetween(0, station.chargersTotal)
  const chargersAvailable = offline ? 0 : Math.max(0, station.chargersTotal - activeSessions)
  const queueCount = offline
    ? integerBetween(0, 3)
    : SCENARIO === 'stable'
      ? stationIndex % 4
      : integerBetween(0, 10)
  const estimatedWait = offline
    ? station.avgSessionMinutes
    : calculateEstimatedWait({
        avgSessionMinutes: station.avgSessionMinutes,
        chargersAvailable,
        chargersTotal: station.chargersTotal,
        queueCount,
      })
  const realTotal = offline ? 0 : numberBetween(2.1, Math.min(32, station.chargeSpeedKw / 3))
  const timestamp = new Date().toISOString()

  return {
    stationId: station.stationId,
    timestamp,
    latitude: station.latitude,
    longitude: station.longitude,
    current: {
      I1: currentBase,
      I2: offline ? 0 : numberBetween(0, currentBase * 0.18),
      I3: offline ? 0 : numberBetween(0, currentBase * 0.12),
    },
    voltage: {
      V1: voltageBase,
      V2: offline ? 0 : numberBetween(voltageBase - 2, voltageBase + 2),
      V3: offline ? 0 : numberBetween(voltageBase - 2, voltageBase + 2),
    },
    power: {
      realTotal,
      reactiveTotal: offline ? 0 : numberBetween(0.05, 0.65),
      apparentTotal: offline ? 0 : Number((realTotal + numberBetween(0.1, 0.85)).toFixed(2)),
    },
    energy: {
      active: numberBetween(1400, 1850),
      reactive: numberBetween(180, 265),
      apparent: numberBetween(1450, 1900),
    },
    avgPowerFactor: offline ? 0 : numberBetween(0.93, 0.999, 3),
    avgFrequency: frequency,
    status,
    name: station.name,
    address: station.address,
    chargersTotal: station.chargersTotal,
    chargersAvailable,
    activeSessions,
    queueCount,
    avgSessionMinutes: station.avgSessionMinutes,
    estimatedWait,
    chargeSpeedKw: station.chargeSpeedKw,
    connectorTypes: station.connectorTypes,
    lastReading: timestamp,
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function postTelemetry(telemetry) {
  let lastError

  for (let attempt = 1; attempt <= POST_RETRIES + 1; attempt += 1) {
    try {
      const response = await fetch(TELEMETRY_API_URL, {
        body: JSON.stringify(telemetry),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.ok) {
        return response.text().catch(() => '')
      }

      const body = await response.text().catch(() => '')
      lastError = new Error(
        `POST /telemetry failed for ${telemetry.stationId}: ${response.status} ${response.statusText} ${body}`,
      )

      if (response.status < 500 && response.status !== 429) {
        throw lastError
      }
    } catch (error) {
      lastError = error
    }

    if (attempt <= POST_RETRIES) {
      await sleep(POST_RETRY_BASE_MS * attempt)
    }
  }

  throw lastError
}

async function publishBatch() {
  const telemetryBatch = stations.map(buildTelemetry)
  const failed = []

  for (const telemetry of telemetryBatch) {
    try {
      await postTelemetry(telemetry)
    } catch (error) {
      failed.push(error)
      console.error(error)
    }

    if (POST_SPACING_MS > 0) {
      await sleep(POST_SPACING_MS)
    }
  }

  const sample = telemetryBatch[0]
  console.log(
    `[${new Date().toISOString()}] posted ${telemetryBatch.length - failed.length}/${telemetryBatch.length} telemetry records · sample ${sample.stationId}: ${sample.status}, ${sample.chargersAvailable}/${sample.chargersTotal} idle, queue ${sample.queueCount}, wait ${sample.estimatedWait}m`,
  )
}

async function main() {
  console.log('GridSense EV telemetry API simulator')
  console.log(`telemetryApiUrl=${TELEMETRY_API_URL}`)
  console.log(`intervalMs=${INTERVAL_MS}`)
  console.log(`scenario=${SCENARIO}`)
  console.log(`postRetries=${POST_RETRIES}`)
  console.log(`postSpacingMs=${POST_SPACING_MS}`)

  await publishBatch()

  if (RUN_ONCE) {
    return
  }

  setInterval(() => {
    publishBatch().catch((error) => {
      console.error('Failed to post telemetry batch', error)
    })
  }, INTERVAL_MS)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
