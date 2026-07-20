import type { DataMode } from './providers/DataProvider'

function withLeadingSlash(value: string) {
  return value.startsWith('/') ? value : `/${value}`
}

function withTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`
}

const requestedMode = import.meta.env.VITE_DATA_MODE?.toLowerCase()

export const runtimeConfig = {
  dataMode: (requestedMode === 'http' ? 'http' : 'mock') as DataMode,
  apiBaseUrl: withLeadingSlash(import.meta.env.VITE_API_BASE_URL || '/mcep/api').replace(/\/$/, ''),
  basePath: withTrailingSlash(withLeadingSlash(import.meta.env.BASE_URL || '/')),
  version: __MCEP_VERSION__,
  buildTime: __MCEP_BUILD_TIME__,
  gitCommit: __MCEP_GIT_COMMIT__,
}

export const versionInfo = {
  softwareVersion: 'V1.0',
  buildTime: runtimeConfig.buildTime,
  gitCommit: runtimeConfig.gitCommit,
  dataMode: runtimeConfig.dataMode,
}
