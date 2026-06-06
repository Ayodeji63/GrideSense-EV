import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { db, response, tables } from '../src/dynamodb.js'
import { calculateEstimatedWait, summarizeQueue, summarizeSessions } from '../src/wait-time.js'

function parseBody(event) {
  if (!event.body) return {}
  return typeof event.body === 'string' ? JSON.parse(event.body) : event.body
}

export async function joinQueue(event) {
  if (event.requestContext?.http?.method === 'OPTIONS') return response(204, {})

  const body = parseBody(event)
  const stationId = body.stationId
  const driverId = body.driverId

  if (!stationId || !driverId) {
    return response(400, { message: 'stationId and driverId are required' })
  }

  const now = new Date().toISOString()
  const queueId = `${stationId}#${driverId}`
  const item = {
    stationId,
    queueId,
    driverId,
    status: 'WAITING',
    joinedAt: now,
    updatedAt: now,
    vehicleModel: body.vehicleModel,
    connectorType: body.connectorType,
    targetCharge: body.targetCharge,
    currentBattery: body.currentBattery,
  }

  await db.send(
    new PutCommand({
      TableName: tables.queue,
      Item: item,
      ConditionExpression: 'attribute_not_exists(queueId)',
    }),
  )

  const waitSummary = await recomputeStationWait(stationId)
  return response(200, { queue: item, station: waitSummary })
}

export async function updateQueueStatus(event) {
  if (event.requestContext?.http?.method === 'OPTIONS') return response(204, {})

  const body = parseBody(event)
  const stationId = body.stationId
  const driverId = body.driverId
  const status = body.status

  if (!stationId || !driverId || !status) {
    return response(400, { message: 'stationId, driverId and status are required' })
  }

  const now = new Date().toISOString()
  const queueId = `${stationId}#${driverId}`

  await db.send(
    new UpdateCommand({
      TableName: tables.queue,
      Key: { stationId, queueId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status, ':updatedAt': now },
    }),
  )

  const waitSummary = await recomputeStationWait(stationId)
  return response(200, { station: waitSummary })
}

export async function recomputeStationWait(stationId) {
  const stationResult = await db.send(
    new GetCommand({
      TableName: tables.stations,
      Key: { stationId },
    }),
  )

  if (!stationResult.Item) {
    throw new Error(`Station ${stationId} not found`)
  }

  const station = stationResult.Item
  const [queueResult, sessionsResult] = await Promise.all([
    db.send(
      new QueryCommand({
        TableName: tables.queue,
        KeyConditionExpression: 'stationId = :stationId',
        ExpressionAttributeValues: { ':stationId': stationId },
      }),
    ),
    db.send(
      new QueryCommand({
        TableName: tables.sessions,
        KeyConditionExpression: 'stationId = :stationId',
        ExpressionAttributeValues: { ':stationId': stationId },
      }),
    ),
  ])

  const queueCount = summarizeQueue(queueResult.Items ?? [])
  const { activeSessions, chargersAvailable } = summarizeSessions(sessionsResult.Items ?? [], station.chargersTotal)
  const avgSessionMinutes = station.avgSessionMinutes ?? 30
  const estimatedWait = calculateEstimatedWait({
    chargersTotal: station.chargersTotal,
    chargersAvailable,
    queueCount,
    avgSessionMinutes,
    activeSessions,
  })
  const updatedAt = new Date().toISOString()

  await db.send(
    new UpdateCommand({
      TableName: tables.stations,
      Key: { stationId },
      UpdateExpression:
        'SET queueCount = :queueCount, activeSessions = :activeSessions, chargersAvailable = :chargersAvailable, estimatedWait = :estimatedWait, avgSessionMinutes = :avgSessionMinutes, waitUpdatedAt = :waitUpdatedAt',
      ExpressionAttributeValues: {
        ':queueCount': queueCount,
        ':activeSessions': activeSessions.length,
        ':chargersAvailable': chargersAvailable,
        ':estimatedWait': estimatedWait,
        ':avgSessionMinutes': avgSessionMinutes,
        ':waitUpdatedAt': updatedAt,
      },
    }),
  )

  return {
    stationId,
    queueCount,
    activeSessions: activeSessions.length,
    chargersAvailable,
    estimatedWait,
    avgSessionMinutes,
    waitUpdatedAt: updatedAt,
  }
}

export async function recomputeWaitHandler(event) {
  const stationId = event.pathParameters?.stationId ?? parseBody(event).stationId

  if (!stationId) {
    return response(400, { message: 'stationId is required' })
  }

  const waitSummary = await recomputeStationWait(stationId)
  return response(200, waitSummary)
}
