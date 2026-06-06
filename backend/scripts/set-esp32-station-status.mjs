#!/usr/bin/env node

const TELEMETRY_API_URL =
  process.env.TELEMETRY_API_URL ??
  "https://j517v8hjtg.execute-api.us-east-1.amazonaws.com/telemetry";
const requestedStatus = (process.argv[2] ?? "ON").toUpperCase();
const status =
  requestedStatus === "OFF" || requestedStatus === "OFFLINE" ? "OFF" : "ON";
const timestamp = new Date().toISOString();
const offline = status === "OFF";

const telemetry = {
  stationId: "NGR-ESP-011",
  timestamp,
  latitude: 6.661302477957246,
  longitude: 3.25106035421942,
  current: {
    I1: offline ? 0 : 12.4,
    I2: 0,
    I3: 0,
  },
  voltage: {
    V1: offline ? 0 : 221.4,
    V2: 0,
    V3: 0,
  },
  power: {
    realTotal: offline ? 0 : 2.74,
    reactiveTotal: offline ? 0 : 0.15,
    apparentTotal: offline ? 0 : 2.75,
  },
  energy: {
    active: 1543.2,
    reactive: 210.55,
    apparent: 1560.1,
  },
  avgPowerFactor: offline ? 0 : 0.998,
  avgFrequency: offline ? 0 : 50.21,
  status,
  name: "ESP32 Station 371",
  address: "ESP32 field station, Lagos",
  chargersTotal: 2,
  chargersAvailable: offline ? 0 : 1,
  activeSessions: offline ? 0 : 1,
  queueCount: 0,
  avgSessionMinutes: 40,
  estimatedWait: offline ? 40 : 0,
  chargeSpeedKw: 22,
  connectorTypes: ["Type2"],
  lastReading: timestamp,
};

async function main() {
  const response = await fetch(TELEMETRY_API_URL, {
    body: JSON.stringify(telemetry),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to set ESP32 station ${status}: ${response.status} ${response.statusText} ${body}`,
    );
  }

  console.log(`Set NGR-ESP-011 to ${status} at ${timestamp}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
