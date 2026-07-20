import { initialApps } from '../data/apps'
import { initialCloudResources } from '../data/cloudResources'
import { initialEdgeNodes } from '../data/edgeNodes'
import { initialMonitorRecords } from '../data/monitor'
import { initialDocuments, initialHomeContent, initialUsers } from '../data/platform'
import { initialResources } from '../data/resources'
import type { AccessApplication, DataResource, HomeContent, PlatformApp, UserRecord } from '../types'
import type { DataMap } from './providers/DataProvider'

const defaults: DataMap = {
  apps: initialApps,
  resources: initialResources,
  edgeNodes: initialEdgeNodes,
  monitors: initialMonitorRecords,
  accessApplications: [],
  cloudResources: initialCloudResources,
  users: initialUsers,
  documents: initialDocuments,
  homeContent: initialHomeContent,
}

const prefix = 'mcep:'
const schemaVersion = 7

const legacyStatusMap: Record<string, Pick<PlatformApp, 'accessStatus' | 'operationStatus'>> = {
  业务运营中: { accessStatus: '已接入', operationStatus: '业务运营中' },
  已接入: { accessStatus: '已接入', operationStatus: '业务运营中' },
  联调中: { accessStatus: '云端已部署', operationStatus: '联调中' },
  技术对接中: { accessStatus: '技术对接中', operationStatus: '待上云' },
  待上云: { accessStatus: '待上云', operationStatus: '未运行' },
  规划接入: { accessStatus: '规划接入', operationStatus: '未运行' },
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function migrate<K extends keyof DataMap>(key: K, value: DataMap[K]): DataMap[K] {
  if (key === 'apps' && Array.isArray(value)) {
    return value.map((item) => {
      const record = item as unknown as Record<string, unknown>
      const seed = initialApps.find((candidate) => candidate.id === record.id)
      const legacy = legacyStatusMap[String(record['status'] ?? '')]
      const { status: _legacyStatus, ...rest } = record
      void _legacyStatus
      return {
        softwareVersion: seed?.softwareVersion ?? '待确认',
        architecture: seed?.architecture ?? '待确认',
        runtime: seed?.runtime ?? '待确认',
        operatingSystem: seed?.operatingSystem ?? '待确认',
        cpuArchitecture: seed?.cpuArchitecture ?? '待确认',
        deploymentMode: seed?.deploymentMode ?? '待评估',
        accessStage: seed?.accessStage ?? '成果登记',
        xinchuangStatus: seed?.xinchuangStatus ?? '待评估',
        hasWeb: seed?.hasWeb ?? '待确认',
        ssoStatus: seed?.ssoStatus ?? '待评估',
        healthCheckUrl: seed?.healthCheckUrl ?? '待确认',
        resourceStatus: seed?.resourceStatus ?? '待梳理',
        responsibleDepartment: seed?.responsibleDepartment ?? '待确认',
        technicalContact: seed?.technicalContact ?? '待确认',
        maintenanceOwner: seed?.maintenanceOwner ?? '待确认',
        ...rest,
        accessStatus: record.accessStatus ?? legacy?.accessStatus ?? '规划接入',
        operationStatus: record.operationStatus ?? legacy?.operationStatus ?? '未运行',
        dataAccessModes: Array.isArray(record.dataAccessModes)
          ? record.dataAccessModes
          : record.dataAccessModes
            ? String(record.dataAccessModes).split(/[,，]/).map((item) => item.trim()).filter(Boolean)
            : seed?.dataAccessModes ?? ['待确认'],
      }
    }) as DataMap[K]
  }
  if (key === 'resources' && Array.isArray(value)) {
    return value.filter((item) => (item as unknown as { id: string }).id !== 'data-004').map((item) => {
      const record = item as unknown as Record<string, unknown>
      const seed = initialResources.find((candidate) => candidate.id === record.id)
      return {
        sourceOrganization: seed?.sourceOrganization ?? String(record.organization ?? '待确认'),
        sourceCategory: seed?.sourceCategory ?? '后续业务数据',
        relatedMachine: seed?.relatedMachine ?? '待确认',
        relatedComponent: seed?.relatedComponent ?? '待确认',
        dataVersion: seed?.dataVersion ?? '待确认',
        generatedAt: seed?.generatedAt ?? '待确认',
        integrationMode: seed?.integrationMode ?? '文件上传',
        syncFrequency: seed?.syncFrequency ?? String(record.updateMode ?? '待确认'),
        lastSyncAt: seed?.lastSyncAt ?? String(record.updatedAt ?? '尚未同步'),
        updateCapability: seed?.updateCapability ?? '待确认',
        storageLocation: seed?.storageLocation ?? '待确认',
        fileHash: seed?.fileHash ?? '待确认',
        ...record,
      }
    }) as DataMap[K]
  }
  if (key === 'edgeNodes' && Array.isArray(value)) {
    return value.map((item) => {
      const record = item as unknown as Record<string, unknown>
      const seed = initialEdgeNodes.find((candidate) => candidate.id === record.id)
      return {
        deviceType: seed?.deviceType ?? '边缘计算设备',
        model: seed?.model ?? '待确认',
        cpu: seed?.cpu ?? '待确认',
        memory: seed?.memory ?? '待确认',
        storage: seed?.storage ?? '待确认',
        gpu: seed?.gpu ?? '待确认',
        operatingSystem: seed?.operatingSystem ?? String(record.os ?? '待确认'),
        localDatabase: seed?.localDatabase ?? '待确认',
        cloudConnectionStatus: seed?.cloudConnectionStatus ?? '待接入',
        lastHeartbeat: seed?.lastHeartbeat ?? '尚未接入',
        lastUploadAt: seed?.lastUploadAt ?? '尚未上传',
        pendingFileCount: seed?.pendingFileCount ?? 0,
        syncStatus: seed?.syncStatus ?? '待接入',
        ...record,
        deployedApps: Array.isArray(record.deployedApps)
          ? record.deployedApps
          : record.deployedApps
            ? String(record.deployedApps).split(/[,，]/).map((item) => item.trim()).filter(Boolean)
            : seed?.deployedApps ?? [],
      }
    }) as DataMap[K]
  }
  if (key === 'monitors' && Array.isArray(value)) {
    return value.map((item) => {
      const record = item as unknown as Record<string, unknown>
      const seed = initialMonitorRecords.find((candidate) => candidate.id === record.id)
      return {
        targetType: seed?.targetType ?? '独立云端应用',
        targetName: seed?.targetName ?? String(record.appName ?? '待确认'),
        checkMethod: seed?.checkMethod ?? '待配置',
        checkSource: seed?.checkSource ?? '待接入自动监测',
        lastCheckedAt: seed?.lastCheckedAt ?? '尚未接入',
        consecutiveFailures: seed?.consecutiveFailures ?? 0,
        latestError: seed?.latestError ?? '无检查数据',
        responsiblePerson: seed?.responsiblePerson ?? '待确认',
        isDemo: seed?.isDemo ?? false,
        ...record,
      }
    }) as DataMap[K]
  }
  if (key === 'accessApplications' && Array.isArray(value)) {
    return value.map((item) => {
      const record = item as unknown as Record<string, unknown>
      const migrated: AccessApplication = {
        id: String(record.id ?? ''),
        appName: String(record.appName ?? ''),
        organization: String(record.organization ?? ''),
        appOwner: String(record.appOwner ?? ''),
        technicalContact: String(record.technicalContact ?? ''),
        architecture: String(record.architecture ?? record.appType ?? '待确认'),
        hasWeb: String(record.hasWeb ?? '待确认'),
        usesDatabase: String(record.usesDatabase ?? '待确认'),
        currentDeployment: String(record.currentDeployment ?? record.deploymentMode ?? '待确认'),
        cpuArchitecture: String(record.cpuArchitecture ?? '待确认'),
        os: String(record.os ?? '待确认'),
        runtime: String(record.runtime ?? '待确认'),
        gpu: String(record.gpu ?? '待确认'),
        supportsContainer: String(record.supportsContainer ?? '待确认'),
        requiresGraphicalDesktop: String(record.requiresGraphicalDesktop ?? '待确认'),
        supportsOffline: String(record.supportsOffline ?? '待确认'),
        xinchuangStatus: String(record.xinchuangStatus ?? '待评估'),
        recommendedDeployment: String(record.recommendedDeployment ?? '待评估'),
        appVmRequired: String(record.appVmRequired ?? '待确认'),
        appVmNotes: String(record.appVmNotes ?? [record.cpu, record.memory, record.storage, record.dependencies].filter(Boolean).join('；') ?? ''),
        databaseVmRequired: String(record.databaseVmRequired ?? '待确认'),
        databaseType: String(record.databaseType ?? '待确认'),
        groupDataPlatform: String(record.groupDataPlatform ?? '待确认'),
        domainPath: String(record.domainPath ?? record.targetIp ?? '待确认'),
        sso: String(record.sso ?? '待确认'),
        portRequirements: String(record.portRequirements ?? [record.sourceIp, record.targetIp, record.port, record.protocol].filter(Boolean).join(' → ') ?? '待确认'),
        cloudDataContent: String(record.cloudDataContent ?? '待补充'),
        initialIntegrationMode: String(record.initialIntegrationMode ?? (record.transferMethod === 'API接口' ? 'API定时同步' : '文件上传')),
        laterUpdateMode: String(record.laterUpdateMode ?? record.updateFrequency ?? '待确认'),
        dataFormats: String(record.dataFormats ?? record.apiType ?? '待确认'),
        dataVolume: String(record.dataVolume ?? '待确认'),
        rawDataLocation: String(record.rawDataLocation ?? '待确认'),
        hasDataDictionary: String(record.hasDataDictionary ?? '待确认'),
        apiInfo: String(record.apiInfo ?? record.apiUrl ?? '待确认'),
        currentStage: String(record.currentStage ?? '成果登记'),
        currentOwner: String(record.currentOwner ?? record.appOwner ?? record.technicalContact ?? '待确认'),
        currentBlocker: String(record.currentBlocker ?? record.issueLog ?? '待确认'),
        nextAction: String(record.nextAction ?? '待补充'),
        estimatedCompletion: String(record.estimatedCompletion ?? '待确认'),
        testResult: String(record.testResult ?? '待测试'),
        launchConfirmation: String(record.launchConfirmation ?? '待确认'),
        status: String(record.status === '已完成' ? '已完成' : record.status === '草稿' ? '草稿' : '已登记'),
        createdAt: String(record.createdAt ?? '待更新'),
      }
      return { ...record, ...migrated } as unknown as AccessApplication
    }) as DataMap[K]
  }
  if (key === 'cloudResources' && Array.isArray(value)) {
    return value.map((item) => {
      const record = item as unknown as Record<string, unknown>
      return {
        resourceType: '待确认',
        cpuArchitecture: '待确认',
        cpuCores: 0,
        memoryGB: 0,
        diskGB: 0,
        operatingSystem: '待确认',
        internalIp: '待确认',
        runningStatus: '未知',
        managementStatus: '待确认',
        applicant: '待确认',
        owner: '待确认',
        purpose: '待确认',
        relatedAppId: '',
        confirmed: false,
        remark: '',
        updatedAt: '待更新',
        ...record,
      }
    }) as DataMap[K]
  }
  if (key === 'users' && Array.isArray(value)) {
    return value.map((item) => {
      const user = item as unknown as UserRecord
      return user.name === '雅青' && user.organization === '数科公司' ? { ...user, organization: '流控所' } : user
    }) as DataMap[K]
  }
  if (key === 'homeContent') {
    const content = value as HomeContent
    if (content.heroTitle === '连接工业软件，贯通测试数据，协同云端与边缘') {
      return { ...content, ...initialHomeContent } as DataMap[K]
    }
  }
  return value
}

function upgradeSeedData<K extends keyof DataMap>(key: K, value: DataMap[K]): DataMap[K] {
  if (key === 'apps' && Array.isArray(value)) {
    const legacySeedIds = new Set(['app-003'])
    const saved = (value as PlatformApp[]).filter((item) => !legacySeedIds.has(item.id))
    const seeded = initialApps.map((initial) => ({
      ...initial,
      ...(saved.find((item) => item.id === initial.id) ?? {}),
    }))
    const custom = saved.filter((item) => !initialApps.some((initial) => initial.id === item.id))
    return [...seeded, ...custom] as DataMap[K]
  }
  if (key === 'edgeNodes' && Array.isArray(value)) {
    const legacyIds = new Set(['edge-001', 'edge-002', 'edge-003', 'edge-004'])
    const saved = (value as Array<{ id: string }>).filter((item) => !legacyIds.has(item.id))
    const seeded = initialEdgeNodes.map((initial) => ({ ...initial, ...(saved.find((item) => item.id === initial.id) ?? {}) }))
    const custom = saved.filter((item) => !initialEdgeNodes.some((initial) => initial.id === item.id))
    return [...seeded, ...custom] as DataMap[K]
  }
  if (key === 'monitors' && Array.isArray(value)) {
    const seedIds = new Set(initialMonitorRecords.map((item) => item.id))
    const custom = (value as Array<{ id: string }>).filter((item) => !seedIds.has(item.id))
    return [...initialMonitorRecords, ...custom] as DataMap[K]
  }
  if (key === 'resources' && Array.isArray(value)) {
    const saved = value as DataResource[]
    const seeded = initialResources.map((initial) => ({ ...initial, ...(saved.find((item) => item.id === initial.id) ?? {}) }))
    const custom = saved.filter((item) => !initialResources.some((initial) => initial.id === item.id))
    return [...seeded, ...custom] as DataMap[K]
  }
  if (key === 'cloudResources' && Array.isArray(value)) {
    const saved = value as Array<{ id: string }>
    const seeded = initialCloudResources.map((initial) => ({ ...initial, ...(saved.find((item) => item.id === initial.id) ?? {}) }))
    const custom = saved.filter((item) => !initialCloudResources.some((initial) => initial.id === item.id))
    return [...seeded, ...custom] as DataMap[K]
  }
  return value
}

function read<K extends keyof DataMap>(key: K): DataMap[K] {
  try {
    const saved = localStorage.getItem(prefix + key)
    const parsed = saved ? (JSON.parse(saved) as DataMap[K]) : clone(defaults[key])
    const migrationKey = `${prefix}schema:${key}`
    const needsSeedUpgrade = Number(localStorage.getItem(migrationKey) ?? 0) < schemaVersion
    const migrated = needsSeedUpgrade ? upgradeSeedData(key, migrate(key, parsed)) : migrate(key, parsed)
    if (saved && JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem(prefix + key, JSON.stringify(migrated))
    }
    if (needsSeedUpgrade) localStorage.setItem(migrationKey, String(schemaVersion))
    return migrated
  } catch {
    return clone(defaults[key])
  }
}

function write<K extends keyof DataMap>(key: K, value: DataMap[K]) {
  localStorage.setItem(prefix + key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key } }))
}

export const dataService = {
  get<K extends keyof DataMap>(key: K): Promise<DataMap[K]> {
    return Promise.resolve(read(key))
  },
  getSync<K extends keyof DataMap>(key: K): DataMap[K] {
    return read(key)
  },
  saveList<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'cloudResources' | 'users' | 'documents'>>(
    key: K,
    list: DataMap[K],
  ) {
    write(key, list)
  },
  upsert<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'cloudResources' | 'users' | 'documents'>>(
    key: K,
    record: DataMap[K][number],
  ) {
    const list = read(key) as Array<{ id: string }>
    const index = list.findIndex((item) => item.id === (record as { id: string }).id)
    if (index >= 0) list[index] = record as { id: string }
    else list.unshift(record as { id: string })
    write(key, list as DataMap[K])
  },
  remove<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'cloudResources' | 'users' | 'documents'>>(
    key: K,
    id: string,
  ) {
    const list = read(key) as Array<{ id: string }>
    write(key, list.filter((item) => item.id !== id) as DataMap[K])
  },
  saveHomeContent(content: HomeContent) {
    write('homeContent', content)
  },
  reset() {
    Object.keys(defaults).forEach((key) => {
      localStorage.removeItem(prefix + key)
      localStorage.removeItem(`${prefix}schema:${key}`)
    })
    window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key: 'all' } }))
  },
}

export type { DataKey } from './providers/DataProvider'
