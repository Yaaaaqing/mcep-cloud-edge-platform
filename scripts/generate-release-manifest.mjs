import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'))

const lockCandidates = ['package-lock.json', 'pnpm-lock.yaml']
let lockFile = null
for (const candidate of lockCandidates) {
  try {
    await access(path.join(projectRoot, candidate))
    lockFile = candidate
    break
  } catch {
    // Try the next supported lock file.
  }
}

if (!lockFile) {
  throw new Error('发布清单生成失败：缺少 package-lock.json 或 pnpm-lock.yaml。')
}

const requiredFiles = [
  'package.json',
  lockFile,
  'README.md',
  'CONTRIBUTORS.md',
  'CHANGELOG.md',
  'src/App.tsx',
  'src/types/index.ts',
  'src/services/storage.ts',
  'src/services/providers/DataProvider.ts',
  'src/services/providers/MockDataProvider.ts',
  'src/services/providers/HttpDataProvider.ts',
  'docs/MCEP-frontend-handover.md',
  'public/brand/mcep-origin-mark.svg',
]

const files = []
for (const relativePath of requiredFiles) {
  const absolutePath = path.join(projectRoot, relativePath)
  let contents
  try {
    contents = await readFile(absolutePath)
  } catch (error) {
    throw new Error(`发布清单生成失败：无法读取关键文件 ${relativePath}（${error.message}）`)
  }
  files.push({
    path: relativePath,
    sha256: createHash('sha256').update(contents).digest('hex'),
  })
}

let gitCommit = 'unknown'
try {
  gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim() || 'unknown'
} catch {
  // Source archives may intentionally omit Git metadata.
}

const manifest = {
  applicationName: 'MCEP高端机床云边协同应用平台',
  version: packageJson.version,
  gitCommit,
  generatedAt: new Date().toISOString(),
  algorithm: 'SHA-256',
  files,
}

await writeFile(
  path.join(projectRoot, 'release-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)

console.log(`发布完整性清单已生成：${files.length} 个关键文件。`)
