import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateEstimatedWait } from '../src/wait-time.js'

test('returns zero when a charger is available and no queue exists', () => {
  assert.equal(calculateEstimatedWait({ chargersTotal: 4, chargersAvailable: 1, queueCount: 0 }), 0)
})

test('batches queue by charger count when no charger is available', () => {
  const now = new Date('2026-06-06T13:00:00Z')
  const estimatedWait = calculateEstimatedWait({
    chargersTotal: 4,
    chargersAvailable: 0,
    queueCount: 8,
    avgSessionMinutes: 30,
    activeSessions: [{ status: 'CHARGING', estimatedEndAt: '2026-06-06T13:12:00Z' }],
    now,
  })

  assert.equal(estimatedWait, 42)
})
