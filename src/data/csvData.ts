import type { CsvRow } from '../types'

export const csvPreviewData: CsvRow[] = [
  { timestamp: '09:00', spindleSpeed: 1000, vibration: 1.12, temperature: 28.4, load: 22 },
  { timestamp: '09:05', spindleSpeed: 2000, vibration: 1.26, temperature: 29.2, load: 31 },
  { timestamp: '09:10', spindleSpeed: 3000, vibration: 1.41, temperature: 30.8, load: 39 },
  { timestamp: '09:15', spindleSpeed: 4000, vibration: 1.58, temperature: 32.7, load: 47 },
  { timestamp: '09:20', spindleSpeed: 5000, vibration: 1.69, temperature: 34.6, load: 54 },
  { timestamp: '09:25', spindleSpeed: 6000, vibration: 1.83, temperature: 36.9, load: 61 },
  { timestamp: '09:30', spindleSpeed: 6000, vibration: 1.78, temperature: 38.1, load: 59 },
  { timestamp: '09:35', spindleSpeed: 6000, vibration: 1.74, temperature: 38.8, load: 58 },
  { timestamp: '09:40', spindleSpeed: 6000, vibration: 1.71, temperature: 39.1, load: 58 },
  { timestamp: '09:45', spindleSpeed: 3000, vibration: 1.32, temperature: 38.5, load: 36 },
  { timestamp: '09:50', spindleSpeed: 1000, vibration: 1.08, temperature: 37.2, load: 20 },
  { timestamp: '09:55', spindleSpeed: 0, vibration: 0.42, temperature: 35.8, load: 4 },
]

export const csvText = `采集时间,主轴转速(r/min),振动速度(mm/s),温度(℃),负载率(%)\n${csvPreviewData
  .map((row) => `${row.timestamp},${row.spindleSpeed},${row.vibration},${row.temperature},${row.load}`)
  .join('\n')}`
