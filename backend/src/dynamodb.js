import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const REGION = process.env.AWS_REGION ?? 'us-east-1'

export const tables = {
  stations: process.env.STATIONS_TABLE ?? 'GridSenseStations',
  queue: process.env.QUEUE_TABLE ?? 'GridSenseStationQueue',
  sessions: process.env.SESSIONS_TABLE ?? 'GridSenseStationSessions',
}

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

export function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type,authorization',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
