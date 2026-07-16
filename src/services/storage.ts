import { initialApps } from '../data/apps'
import { initialEdgeNodes } from '../data/edgeNodes'
import { initialMonitorRecords } from '../data/monitor'
import { initialDocuments, initialHomeContent, initialUsers } from '../data/platform'
import { initialResources } from '../data/resources'
import type {
  AccessApplication,
  DataResource,
  DocumentRecord,
  EdgeNode,
  HomeContent,
  MonitorRecord,
  PlatformApp,
  UserRecord,
} from '../types'

type DataMap = {
  apps: PlatformApp[]
  resources: DataResource[]
  edgeNodes: EdgeNode[]
  monitors: MonitorRecord[]
  accessApplications: AccessApplication[]
  users: UserRecord[]
  documents: DocumentRecord[]
  homeContent: HomeContent
}

const defaults: DataMap = {
  apps: initialApps,
  resources: initialResources,
  edgeNodes: initialEdgeNodes,
  monitors: initialMonitorRecords,
  accessApplications: [],
  users: initialUsers,
  documents: initialDocuments,
  homeContent: initialHomeContent,
}

const prefix = 'mcep:'

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
      const legacy = legacyStatusMap[String(record['status'] ?? '')]
      const { status: _legacyStatus, ...rest } = record
      void _legacyStatus
      return {
        ...rest,
        accessStatus: record.accessStatus ?? legacy?.accessStatus ?? '规划接入',
        operationStatus: record.operationStatus ?? legacy?.operationStatus ?? '未运行',
      }
    }) as DataMap[K]
  }
  if (key === 'resources' && Array.isArray(value)) {
    return value.filter((item) => (item as unknown as { id: string }).id !== 'data-004') as DataMap[K]
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

function read<K extends keyof DataMap>(key: K): DataMap[K] {
  try {
    const saved = localStorage.getItem(prefix + key)
    const parsed = saved ? (JSON.parse(saved) as DataMap[K]) : clone(defaults[key])
    const migrated = migrate(key, parsed)
    if (saved && JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem(prefix + key, JSON.stringify(migrated))
    }
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
  saveList<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'users' | 'documents'>>(
    key: K,
    list: DataMap[K],
  ) {
    write(key, list)
  },
  upsert<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'users' | 'documents'>>(
    key: K,
    record: DataMap[K][number],
  ) {
    const list = read(key) as Array<{ id: string }>
    const index = list.findIndex((item) => item.id === (record as { id: string }).id)
    if (index >= 0) list[index] = record as { id: string }
    else list.unshift(record as { id: string })
    write(key, list as DataMap[K])
  },
  remove<K extends keyof Pick<DataMap, 'apps' | 'resources' | 'edgeNodes' | 'monitors' | 'accessApplications' | 'users' | 'documents'>>(
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
    Object.keys(defaults).forEach((key) => localStorage.removeItem(prefix + key))
    window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key: 'all' } }))
  },
}

export type DataKey = keyof DataMap
