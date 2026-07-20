import { execFileSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
let gitCommit = 'unknown'
try {
  gitCommit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim() || 'unknown'
} catch {
  // Source archives may not include Git metadata.
}

const basePathValue = process.env.VITE_BASE_PATH || '/'
const basePath = `${basePathValue.startsWith('/') ? '' : '/'}${basePathValue}`.replace(/\/*$/, '/')
const buildInfo = {
  applicationName: 'MCEP高端机床云边协同应用平台',
  version: 'V1.0',
  gitCommit,
  buildTime: new Date().toISOString(),
  dataMode: process.env.VITE_DATA_MODE === 'http' ? 'http' : 'mock',
  basePath,
  initialProductDesigner: '王雅青',
  initialReleaseYear: 2026,
}

await writeFile(new URL('../public/build-info.json', import.meta.url), `${JSON.stringify(buildInfo, null, 2)}\n`, 'utf8')
console.log(`构建信息已生成：${buildInfo.gitCommit} · ${buildInfo.dataMode} · ${buildInfo.basePath}`)
