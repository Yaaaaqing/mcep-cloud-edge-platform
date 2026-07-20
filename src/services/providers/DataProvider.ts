import type {
  AccessApplication,
  CloudResource,
  DataResource,
  DocumentRecord,
  EdgeNode,
  HomeContent,
  MonitorRecord,
  PlatformApp,
  UserRecord,
} from '../../types'

export type DataMap = {
  apps: PlatformApp[]
  resources: DataResource[]
  edgeNodes: EdgeNode[]
  monitors: MonitorRecord[]
  accessApplications: AccessApplication[]
  cloudResources: CloudResource[]
  users: UserRecord[]
  documents: DocumentRecord[]
  homeContent: HomeContent
}

export type DataKey = keyof DataMap
export type ListDataKey = Exclude<DataKey, 'homeContent'>
export type DataMode = 'mock' | 'http'
export type ProviderState = 'ready' | 'checking' | 'unavailable'

export type ProviderStatus = {
  mode: DataMode
  state: ProviderState
  message: string
}

export interface DataProvider {
  readonly mode: DataMode
  get<K extends DataKey>(key: K): Promise<DataMap[K]>
  getSync<K extends DataKey>(key: K): DataMap[K]
  saveList<K extends ListDataKey>(key: K, list: DataMap[K]): void
  upsert<K extends ListDataKey>(key: K, record: DataMap[K][number]): void
  remove<K extends ListDataKey>(key: K, id: string): void
  saveHomeContent(content: HomeContent): void
  reset(): void
  getStatus(): ProviderStatus
}
