export const QUEUE_ACTIVE_STATUSES = new Set(['WAITING', 'ARRIVED'])
export const SESSION_ACTIVE_STATUSES = new Set(['OCCUPIED', 'CHARGING'])

export function calculateEstimatedWait({
  chargersTotal = 1,
  chargersAvailable = 0,
  queueCount = 0,
  avgSessionMinutes = 30,
  activeSessions = [],
  now = new Date(),
}) {
  const safeChargersTotal = Math.max(1, Number(chargersTotal) || 1)
  const safeAvailable = Math.max(0, Number(chargersAvailable) || 0)
  const safeQueue = Math.max(0, Number(queueCount) || 0)
  const safeAvg = Math.max(5, Number(avgSessionMinutes) || 30)

  if (safeAvailable > 0 && safeQueue === 0) {
    return 0
  }

  const nowMs = now.getTime()
  const nextFreeMinutes = activeSessions
    .filter((session) => SESSION_ACTIVE_STATUSES.has(session.status))
    .map((session) => {
      const endMs = session.estimatedEndAt ? new Date(session.estimatedEndAt).getTime() : nowMs + safeAvg * 60_000
      return Math.max(0, Math.ceil((endMs - nowMs) / 60_000))
    })
    .sort((a, b) => a - b)

  if (safeAvailable > 0) {
    const driversAfterAvailablePorts = Math.max(0, safeQueue - safeAvailable)
    return Math.ceil(driversAfterAvailablePorts / safeChargersTotal) * safeAvg
  }

  const firstPortFreeMinutes = nextFreeMinutes[0] ?? safeAvg
  const batchesAhead = Math.floor(Math.max(0, safeQueue - 1) / safeChargersTotal)
  return firstPortFreeMinutes + batchesAhead * safeAvg
}

export function summarizeQueue(queueItems = []) {
  return queueItems.filter((item) => QUEUE_ACTIVE_STATUSES.has(item.status)).length
}

export function summarizeSessions(sessionItems = [], chargersTotal = 1) {
  const activeSessions = sessionItems.filter((item) => SESSION_ACTIVE_STATUSES.has(item.status))
  return {
    activeSessions,
    chargersAvailable: Math.max(0, Number(chargersTotal) - activeSessions.length),
  }
}
