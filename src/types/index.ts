export type AppAccessStatus = '已接入' | '云端已部署' | '联调中' | '技术对接中' | '待上云' | '规划接入'
export type AppOperationStatus = '业务运营中' | '试运行' | '联调中' | '待上云' | '未运行'
export type EdgeStatus = '规划建设中' | '待部署' | '待接入' | '在线' | '异常'
export type HealthStatus = '正常' | '联调中' | '异常' | '未接入' | '待检查'
export type DeploymentMode = '独立云端部署' | '边缘端部署' | '云边协同部署' | '仅成果数据接入' | '待评估'
export type AccessStage = '成果登记' | '数据接入' | '应用入口' | '认证与监测' | '云边协同'
export type XinchuangStatus = '待评估' | '评估中' | '可适配' | '需要改造' | '不适合云端'
export type DataIntegrationMode = '文件上传' | 'API定时同步' | '增量同步' | '实时或事件传输'
export type DataSourceCategory = '高校交付成果数据' | '后续业务数据' | '边缘节点数据' | '平台管理数据'
export type UpdateCapability = '一次性交付' | '支持人工更新' | '支持API更新' | '待确认'
export type EdgeDeviceType = '边缘计算设备' | '边缘存储设备'
export type MonitorTargetType = 'MCEP平台' | '独立云端应用' | 'API' | '数据库' | '边缘节点'
export type CloudResourceType = '应用虚拟机' | '数据库虚拟机' | '文件或数据资源' | '待确认'
export type CloudRunningStatus = '运行中' | '已停止' | '待开通' | '未知'
export type CloudManagementStatus = '验证通过' | '待验证' | '待确认'

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
  softwareVersion: string
  architecture: string
  runtime: string
  operatingSystem: string
  cpuArchitecture: string
  deploymentMode: DeploymentMode
  accessStage: AccessStage
  xinchuangStatus: XinchuangStatus
  hasWeb: '是' | '否' | '待确认'
  ssoStatus: string
  healthCheckUrl: string
  dataAccessModes: string[]
  resourceStatus: string
  responsibleDepartment: string
  technicalContact: string
  maintenanceOwner: string
  edgeGroupId?: string
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
  sourceAppId?: string
  sourceOrganization: string
  sourceCategory: DataSourceCategory
  relatedMachine: string
  relatedComponent: string
  dataVersion: string
  generatedAt: string
  integrationMode: DataIntegrationMode
  syncFrequency: string
  lastSyncAt: string
  updateCapability: UpdateCapability
  storageLocation: string
  fileHash: string
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
  deviceType: EdgeDeviceType
  model: string
  cpu: string
  memory: string
  storage: string
  gpu: string
  operatingSystem: string
  groupId?: string
  deployedApps: string[]
  localDatabase: string
  cloudConnectionStatus: string
  lastHeartbeat: string
  lastUploadAt: string
  pendingFileCount: number
  syncStatus: string
}

export interface MonitorRecord {
  id: string
  appName: string
  serviceStatus: HealthStatus
  databaseStatus: HealthStatus
  apiStatus: HealthStatus
  lastAccess: string
  version: string
  targetType: MonitorTargetType
  targetName: string
  checkMethod: string
  checkSource: string
  lastCheckedAt: string
  consecutiveFailures: number
  latestError: string
  responsiblePerson: string
  isDemo: boolean
}

export interface CloudResource {
  id: string
  instanceName: string
  resourceType: CloudResourceType
  cpuArchitecture: string
  cpuCores: number
  memoryGB: number
  diskGB: number
  operatingSystem: string
  internalIp: string
  runningStatus: CloudRunningStatus
  managementStatus: CloudManagementStatus
  applicant: string
  owner: string
  purpose: string
  relatedAppId: string
  confirmed: boolean
  remark: string
  updatedAt: string
}

export interface AccessApplication {
  id: string
  appName: string
  organization: string
  appOwner: string
  technicalContact: string
  architecture: string
  hasWeb: string
  usesDatabase: string
  currentDeployment: string
  cpuArchitecture: string
  os: string
  runtime: string
  gpu: string
  supportsContainer: string
  requiresGraphicalDesktop: string
  supportsOffline: string
  xinchuangStatus: string
  recommendedDeployment: string
  appVmRequired: string
  appVmNotes: string
  databaseVmRequired: string
  databaseType: string
  groupDataPlatform: string
  domainPath: string
  sso: string
  portRequirements: string
  cloudDataContent: string
  initialIntegrationMode: string
  laterUpdateMode: string
  dataFormats: string
  dataVolume: string
  rawDataLocation: string
  hasDataDictionary: string
  apiInfo: string
  currentStage: string
  currentOwner: string
  currentBlocker: string
  nextAction: string
  estimatedCompletion: string
  testResult: string
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
