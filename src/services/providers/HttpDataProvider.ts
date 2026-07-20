import { initialHomeContent } from '../../data/platform'
import type { HomeContent } from '../../types'
import type { DataKey, DataMap, DataProvider, ListDataKey, ProviderStatus } from './DataProvider'

const emptyData: DataMap = {
  apps: [],
  resources: [],
  edgeNodes: [],
  monitors: [],
  accessApplications: [],
  cloudResources: [],
  users: [],
  documents: [],
  homeContent: initialHomeContent,
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class HttpDataProvider implements DataProvider {
  readonly mode = 'http' as const
  private cache = clone(emptyData)
  private status: ProviderStatus = {
    mode: 'http',
    state: 'checking',
    message: '正在检查数据服务配置。',
  }

  constructor(private readonly baseUrl: string) {}

  private setCache<K extends DataKey>(key: K, value: DataMap[K]) {
    const cache = this.cache as unknown as Record<DataKey, unknown>
    cache[key] = value
  }

  private updateStatus(status: ProviderStatus) {
    this.status = status
    window.dispatchEvent(new CustomEvent('mcep:provider-status', { detail: status }))
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const payload = await response.json() as T | { data: T }
      this.updateStatus({ mode: 'http', state: 'ready', message: '数据服务已连接。' })
      return typeof payload === 'object' && payload !== null && 'data' in payload
        ? (payload as { data: T }).data
        : payload as T
    } catch (error) {
      const reason = error instanceof Error ? error.message : '未知错误'
      this.updateStatus({
        mode: 'http',
        state: 'unavailable',
        message: `数据服务不可用或尚未配置（${reason}），未回退到示例数据。`,
      })
      throw error
    }
  }

  async get<K extends DataKey>(key: K): Promise<DataMap[K]> {
    try {
      const value = await this.request<DataMap[K]>(`/${key}`)
      this.setCache(key, value)
      return value
    } catch {
      return this.getSync(key)
    }
  }

  getSync<K extends DataKey>(key: K): DataMap[K] {
    return clone(this.cache[key])
  }

  saveList<K extends ListDataKey>(key: K, list: DataMap[K]) {
    void this.request(`/${key}`, { method: 'PUT', body: JSON.stringify(list) }).then(() => {
      this.setCache(key, list)
      window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key } }))
    }).catch(() => undefined)
  }

  upsert<K extends ListDataKey>(key: K, record: DataMap[K][number]) {
    const id = (record as { id: string }).id
    void this.request(`/${key}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(record) }).then(() => {
      const list = this.cache[key] as Array<{ id: string }>
      const next = [...list]
      const index = next.findIndex((item) => item.id === id)
      if (index >= 0) next[index] = record as { id: string }
      else next.unshift(record as { id: string })
      this.setCache(key, next as DataMap[K])
      window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key } }))
    }).catch(() => undefined)
  }

  remove<K extends ListDataKey>(key: K, id: string) {
    void this.request(`/${key}/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(() => {
      this.setCache(key, (this.cache[key] as Array<{ id: string }>).filter((item) => item.id !== id) as DataMap[K])
      window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key } }))
    }).catch(() => undefined)
  }

  saveHomeContent(content: HomeContent) {
    void this.request('/homeContent', { method: 'PUT', body: JSON.stringify(content) }).then(() => {
      this.cache.homeContent = content
      window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key: 'homeContent' } }))
    }).catch(() => undefined)
  }

  reset() {
    void this.request('/reset', { method: 'POST' }).then(() => {
      this.cache = clone(emptyData)
      window.dispatchEvent(new CustomEvent('mcep:data-change', { detail: { key: 'all' } }))
    }).catch(() => undefined)
  }

  getStatus() {
    return this.status
  }
}
