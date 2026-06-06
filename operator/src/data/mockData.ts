export type Role = 'operator' | 'investor' | 'policy'

export type Status = 'Online' | 'Degraded' | 'Offline'

export interface Station {
  id: string
  name: string
  city: string
  status: Status
  voltage: number
  frequency: number
  uptime: number
}

export interface Alert {
  id: number
  severity: 'critical' | 'warning' | 'success'
  station: string
  message: string
  timestamp: string
}

export interface Corridor {
  name: string
  dailyTrips: number
  stations: number
  gap: 'HIGH' | 'MEDIUM' | 'LOW'
  reliability: number
  nearestKm: number
}

export interface DisCo {
  region: string
  avgVoltage: number
  uptime: number
  status: 'Critical' | 'Stressed' | 'Stable'
}

export interface Region {
  name: string
  state: string
  trips: number
  stations: number
  priority: 'High' | 'Medium' | 'Low'
}

export const stations: Station[] = [
  { id: 'NGR-LKI-001', name: 'NGR-LKI-001', city: 'Lekki', status: 'Online', voltage: 219, frequency: 50.74, uptime: 96 },
  { id: 'NGR-LKI-002', name: 'NGR-LKI-002', city: 'Lekki', status: 'Degraded', voltage: 193, frequency: 49.8, uptime: 71 },
  { id: 'NGR-ABJ-003', name: 'NGR-ABJ-003', city: 'Abuja', status: 'Offline', voltage: 0, frequency: 0, uptime: 58 },
  { id: 'NGR-PHC-007', name: 'NGR-PHC-007', city: 'Port Harcourt', status: 'Online', voltage: 217, frequency: 50.1, uptime: 88 },
  { id: 'NGR-VI-011', name: 'NGR-VI-011', city: 'Victoria Island', status: 'Online', voltage: 221, frequency: 50.0, uptime: 94 },
  { id: 'NGR-IKJ-014', name: 'NGR-IKJ-014', city: 'Ikeja', status: 'Online', voltage: 218, frequency: 50.3, uptime: 91 },
  { id: 'NGR-ENU-019', name: 'NGR-ENU-019', city: 'Enugu', status: 'Degraded', voltage: 188, frequency: 49.6, uptime: 63 },
]

export const initialAlerts: Alert[] = [
  { id: 1, severity: 'critical', station: 'NGR-ABJ-003', message: 'Grid outage on L1. Voltage at 0V for 12 min. Generator backup recommended.', timestamp: '09:41' },
  { id: 2, severity: 'warning', station: 'NGR-LKI-002', message: 'Voltage dropping 219V->193V over 28 min. Pre-outage pattern. ~8 min action window.', timestamp: '09:38' },
  { id: 3, severity: 'warning', station: 'NGR-PHC-007', message: 'Frequency deviation 49.3Hz. Grid stress indicator. Monitor.', timestamp: '09:22' },
  { id: 4, severity: 'warning', station: 'NGR-ENU-019', message: 'Sustained low voltage 188V. Likely EEDC load shedding event.', timestamp: '09:15' },
  { id: 5, severity: 'success', station: 'NGR-LKI-001', message: 'Restored. Stable at 219V after 14-min outage.', timestamp: '08:55' },
]

export const voltageTrend = [
  { time: '09:10', voltage: 219, danger: null },
  { time: '09:15', voltage: 214, danger: null },
  { time: '09:20', voltage: 208, danger: null },
  { time: '09:25', voltage: 201, danger: null },
  { time: '09:30', voltage: 196, danger: null },
  { time: '09:35', voltage: 188, danger: null },
  { time: '09:40', voltage: 193, danger: null },
]

export const reliability = [
  { station: 'LKI-001', value: 96 },
  { station: 'LKI-002', value: 71 },
  { station: 'ABJ-003', value: 58 },
  { station: 'PHC-007', value: 88 },
  { station: 'VI-011', value: 94 },
  { station: 'IKJ-014', value: 91 },
  { station: 'ENU-019', value: 63 },
]

export const outageRisks = [
  { station: 'NGR-LKI-002', risk: 78, label: 'High' },
  { station: 'NGR-ABJ-003', risk: 90, label: 'Critical' },
  { station: 'NGR-PHC-007', risk: 40, label: 'Medium' },
  { station: 'NGR-ENU-019', risk: 55, label: 'Medium' },
  { station: 'NGR-LKI-001', risk: 12, label: 'Low' },
  { station: 'NGR-VI-011', risk: 8, label: 'Low' },
  { station: 'NGR-IKJ-014', risk: 15, label: 'Low' },
]

export const demandPoints = [
  { name: 'Lekki Phase 1', latitude: 6.4281, longitude: 3.4219, radius: 30, color: '#EF4444', sessions: 1840 },
  { name: 'Ikeja', latitude: 6.6018, longitude: 3.3515, radius: 22, color: '#F59E0B', sessions: 960 },
  { name: 'Ajah', latitude: 6.4698, longitude: 3.5852, radius: 18, color: '#F59E0B', sessions: 720 },
  { name: 'Victoria Island', latitude: 6.4281, longitude: 3.4219, radius: 14, color: '#10B981', sessions: 480 },
  { name: 'Badagry corridor', latitude: 6.4355, longitude: 2.8893, radius: 8, color: '#9CA3AF', sessions: 120 },
]

export const forecast = [
  { week: 'Week 1', historical: 280, forecast: null, lower: null, upper: null },
  { week: 'Week 2', historical: 310, forecast: null, lower: null, upper: null },
  { week: 'Week 3', historical: 340, forecast: null, lower: null, upper: null },
  { week: 'Week 4', historical: 380, forecast: 380, lower: 380, upper: 380 },
  { week: 'Week 5', historical: null, forecast: 420, lower: 395, upper: 446 },
  { week: 'Week 6', historical: null, forecast: 465, lower: 430, upper: 502 },
  { week: 'Week 7', historical: null, forecast: 510, lower: 462, upper: 562 },
  { week: 'Week 8', historical: null, forecast: 560, lower: 506, upper: 620 },
]

export const corridors: Corridor[] = [
  { name: 'Lekki-Epe Expressway', dailyTrips: 1200, stations: 0, gap: 'HIGH', reliability: 83, nearestKm: 18 },
  { name: 'Abuja-Gwagwalada', dailyTrips: 840, stations: 1, gap: 'HIGH', reliability: 64, nearestKm: 22 },
  { name: 'Lagos-Ibadan Expressway', dailyTrips: 960, stations: 1, gap: 'HIGH', reliability: 72, nearestKm: 16 },
  { name: 'PH-Aba Road', dailyTrips: 620, stations: 1, gap: 'MEDIUM', reliability: 69, nearestKm: 11 },
  { name: 'Ikeja-Ojota', dailyTrips: 540, stations: 2, gap: 'MEDIUM', reliability: 74, nearestKm: 7 },
  { name: 'Apapa-Oshodi', dailyTrips: 480, stations: 2, gap: 'MEDIUM', reliability: 68, nearestKm: 9 },
  { name: 'VI-Marina', dailyTrips: 310, stations: 3, gap: 'LOW', reliability: 91, nearestKm: 3 },
]

export const zoneReliability = [
  { zone: 'Lagos Island', value: 91 },
  { zone: 'Lekki', value: 83 },
  { zone: 'Abuja CBD', value: 76 },
  { zone: 'PH GRA', value: 69 },
  { zone: 'Ikeja', value: 74 },
  { zone: 'Enugu', value: 61 },
  { zone: 'Epe corridor', value: 44 },
]

export const discoZones: DisCo[] = [
  { region: 'Ikeja Electric Zone B', avgVoltage: 174, uptime: 61, status: 'Critical' },
  { region: 'Eko Electric Epe', avgVoltage: 168, uptime: 58, status: 'Critical' },
  { region: 'AEDC Gwagwalada', avgVoltage: 179, uptime: 64, status: 'Critical' },
  { region: 'PHED Rumuola', avgVoltage: 188, uptime: 69, status: 'Stressed' },
  { region: 'EEDC Enugu CBD', avgVoltage: 191, uptime: 72, status: 'Stressed' },
  { region: 'Ikeja Electric Zone A', avgVoltage: 208, uptime: 84, status: 'Stable' },
  { region: 'Eko Electric Island', avgVoltage: 214, uptime: 91, status: 'Stable' },
]

export const regions: Region[] = [
  { name: 'Epe LGA', state: 'Lagos', trips: 720, stations: 0, priority: 'High' },
  { name: 'Gwagwalada', state: 'FCT', trips: 680, stations: 0, priority: 'High' },
  { name: 'Aba North', state: 'Abia', trips: 430, stations: 0, priority: 'High' },
  { name: 'Enugu North', state: 'Enugu', trips: 390, stations: 0, priority: 'High' },
  { name: 'Kano Municipal', state: 'Kano', trips: 360, stations: 0, priority: 'High' },
  { name: 'Ibadan North', state: 'Oyo', trips: 330, stations: 1, priority: 'Medium' },
  { name: 'Sagamu', state: 'Ogun', trips: 290, stations: 1, priority: 'Medium' },
]

export const adequacy = [
  { state: 'Abuja FCT', value: 11.2 },
  { state: 'Lagos', value: 6.5 },
  { state: 'Rivers', value: 4.3 },
  { state: 'Ogun', value: 1.6 },
  { state: 'Oyo', value: 0.9 },
  { state: 'Kano', value: 0.4 },
  { state: 'Kaduna', value: 0.3 },
]

export const loadProjection = [
  { week: 'Week 1', capacity: 100, load: 62 },
  { week: 'Week 2', capacity: 100, load: 70 },
  { week: 'Week 3', capacity: 100, load: 78 },
  { week: 'Week 4', capacity: 100, load: 86 },
  { week: 'Week 5', capacity: 100, load: 96 },
  { week: 'Week 6', capacity: 100, load: 104 },
  { week: 'Week 7', capacity: 100, load: 112 },
  { week: 'Week 8', capacity: 100, load: 121 },
]
