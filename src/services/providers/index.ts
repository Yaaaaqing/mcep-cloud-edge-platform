import { runtimeConfig } from '../runtimeConfig'
import { HttpDataProvider } from './HttpDataProvider'
import { MockDataProvider } from './MockDataProvider'

export type { DataKey, DataMap, DataMode, DataProvider, ListDataKey, ProviderStatus } from './DataProvider'

export const dataService = runtimeConfig.dataMode === 'http'
  ? new HttpDataProvider(runtimeConfig.apiBaseUrl)
  : new MockDataProvider()
