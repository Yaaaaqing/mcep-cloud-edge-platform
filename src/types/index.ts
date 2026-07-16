export type AppAccessStatus = '已接入' | '云端已部署' | '联调中' | '技术对接中' | '待上云' | '规划接入'
export type AppOperationStatus = '业务运营中' | '试运行' | '联调中' | '待上云' | '未运行'
export type EdgeStatus = '规划建设中' | '待部署' | '待接入' | '在线' | '异常'
export type HealthStatus = '正常' | '联调中' | '异常' | '未接入' | '待检查'

export interface PlatformApp {
  id: string
  name: string
  organization: string
  description: string
  accessStatus: AppAccessStatus
  operationStatus: AppOperationStatus
  deployment: string
  database: string
  updatedAt: string
  owner: string
  category: string
  externalUrl?: string
  featured?: boolean
}

export interface DataResource {
  id: string
  name: string
  source: string
  type: '结构化数据' | 'CSV文件' | 'XML文件' | '接口数据' | '文档资料'
  category?: string
  subType?: string
  fileFormat?: string
  updateMode: string
  volume: string
  updatedAt: string
  organization: string
  permission: string
  description: string
  sourceFile?: string
  fileSizeBytes?: number
  fileSizeLabel?: string
  traceVersion?: string
  sessionName?: string
  domain?: string
  axisAddress?: string
  axisLabel?: string
  captureTime?: string
  durationSeconds?: number
  samplingIntervalSeconds?: number
  samplingRateHz?: number
  frameCount?: number
  signalCount?: number
  recordCount?: number
  reconstructedPointCount?: number
  dropOuts?: number
  status?: string
  previewStatus?: string
  qualityStatus?: string
}

export interface TraceSignal {
  id: string
  key: string
  label: string
  description: string
  name: string
  unitsType: string
  captureUnitsType: string
  domain: string
  dataType: string
  interval: number
  datapointCount: number
}

export interface TraceSignalStatistics {
  id: string
  label: string
  minimum: number
  maximum: number
  mean: number
}

export interface TraceSummary {
  resourceId: string
  sourceFile: string
  fileSizeBytes: number
  fileSizeLabel: string
  sha256: string
  traceVersion: string
  sessionName: string
  captureTime: string
  domain: string
  axisAddress: string
  axisLabel: string
  durationSeconds: number
  samplingIntervalSeconds: number
  samplingRateHz: number
  frameCount: number
  signalCount: number
  recordCount: number
  reconstructedPointCount: number
  dropOuts: number
  sparseRecordCount: number
  inheritedValueCount: number
  signals: TraceSignal[]
  statistics: TraceSignalStatistics[]
  basicFeatures: {
    movementPulseCount: number
    negativePulseCount: number
    positivePulseCount: number
    pulseStartIntervalMedianSeconds: number
    positionSetpointRange: number
  }
  qualityNotes: string[]
}

export interface TracePreview {
  resourceId: string
  samplingIntervalSeconds: number
  durationSeconds: number
  originalPointCount: number
  previewPointCount: number
  downsampling: string
  groups: Array<{ id: string; label: string; signalIds: string[]; splitAxes?: boolean }>
  signals: TraceSignal[]
  records: Array<Record<string, number>>
}

export interface CsvRow {
  timestamp: string
  spindleSpeed: number
  vibration: number
  temperature: number
  load: number
}

export interface EdgeNode {
  id: string
  code: string
  name: string
  organization: string
  machine: string
  os: string
  protocol: string
  ip: string
  status: EdgeStatus
  lastSeen: string
  note: string
}

export interface MonitorRecord {
  id: string
  appName: string
  serviceStatus: HealthStatus
  databaseStatus: HealthStatus
  apiStatus: HealthStatus
  lastAccess: string
  version: string
}

export interface AccessApplication {
  id: string
  appName: string
  organization: string
  appOwner: string
  technicalContact: string
  appType: string
  deploymentMode: string
  hasWeb: string
  usesDatabase: string
  os: string
  runtime: string
  dependencies: string
  cpu: string
  memory: string
  storage: string
  gpu: string
  supportsContainer: string
  needsInternet: string
  startCommand: string
  sourceIp: string
  targetIp: string
  port: string
  protocol: string
  sso: string
  databaseType: string
  databaseVersion: string
  apiType: string
  apiUrl: string
  transferMethod: string
  updateFrequency: string
  testResult: string
  issueLog: string
  launchConfirmation: string
  status: string
  createdAt: string
}

export interface UserRecord {
  id: string
  name: string
  organization: string
  role: string
  status: string
  lastLogin: string
}

export interface DocumentRecord {
  id: string
  title: string
  category: string
  updatedAt: string
  description: string
}

export interface HomeContent {
  heroTitle: string
  heroDescription: string
  announcement: string
}

export interface AdminEntity {
  id: string
  [key: string]: unknown
}
