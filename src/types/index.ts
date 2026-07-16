export type AppAccessStatus = '已接入' | '云端已部署' | '技术对接中' | '待上云' | '规划接入'
export type AppOperationStatus = '业务运营中' | '联调中' | '待上云' | '未运行'
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
  type: '结构化数据' | 'CSV文件' | '接口数据' | '文档资料'
  updateMode: string
  volume: string
  updatedAt: string
  organization: string
  permission: string
  description: string
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
