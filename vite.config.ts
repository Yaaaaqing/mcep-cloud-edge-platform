import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const gitCommit = env.GITHUB_SHA?.slice(0, 7) || env.VITE_GIT_COMMIT || 'local'

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    define: {
      __MCEP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __MCEP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __MCEP_GIT_COMMIT__: JSON.stringify(gitCommit),
    },
    server: { port: 5173, host: true },
  }
})
