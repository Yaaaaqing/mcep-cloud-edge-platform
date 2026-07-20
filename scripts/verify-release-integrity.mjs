import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(projectRoot, 'release-manifest.json')
let manifest

try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
} catch (error) {
  console.error(`发布完整性校验失败：无法读取 release-manifest.json（${error.message}）`)
  process.exit(1)
}

if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
  console.error('发布完整性校验失败：清单中没有关键文件记录。')
  process.exit(1)
}

const missing = []
const changed = []
for (const file of manifest.files) {
  let contents
  try {
    contents = await readFile(path.join(projectRoot, file.path))
  } catch {
    missing.push(file.path)
    continue
  }

  const actual = createHash('sha256').update(contents).digest('hex')
  if (actual !== file.sha256) {
    changed.push({ path: file.path, expected: file.sha256, actual })
  }
}

if (missing.length || changed.length) {
  console.error('发布完整性校验未通过。')
  for (const file of missing) console.error(`缺失文件：${file}`)
  for (const file of changed) {
    console.error(`文件已变化：${file.path}`)
    console.error(`  清单：${file.expected}`)
    console.error(`  当前：${file.actual}`)
  }
  process.exit(1)
}

console.log(`发布完整性校验通过：${manifest.files.length} 个关键文件与清单一致。`)
