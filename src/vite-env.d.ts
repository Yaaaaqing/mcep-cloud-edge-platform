/// <reference types="vite/client" />

declare const __MCEP_VERSION__: string
declare const __MCEP_BUILD_TIME__: string
declare const __MCEP_GIT_COMMIT__: string

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: 'mock' | 'http'
  readonly VITE_API_BASE_URL?: string
  readonly VITE_BASE_PATH?: string
  readonly VITE_APP_VERSION?: string
}
