import { dataService as localStorageDataService } from '../storage'
import type { DataProvider } from './DataProvider'

export class MockDataProvider implements DataProvider {
  readonly mode = 'mock' as const

  get = localStorageDataService.get
  getSync = localStorageDataService.getSync
  saveList = localStorageDataService.saveList
  upsert = localStorageDataService.upsert
  remove = localStorageDataService.remove
  saveHomeContent = localStorageDataService.saveHomeContent
  reset = localStorageDataService.reset

  getStatus() {
    return {
      mode: this.mode,
      state: 'ready' as const,
      message: '当前为配置演示数据，不代表生产运行结果。',
    }
  }
}
