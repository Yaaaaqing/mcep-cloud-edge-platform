import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const sourcePath = path.join(projectRoot, 'public/data/raw/X_BK300_1.xml')
const outputDir = path.join(projectRoot, 'public/data/processed')
const expectedSha256 = '5fc5b961c0fe810c7683a3f0ff64829a2a782da77b315e8547320bc596302d09'
const signalLabels = {
  f1: '位置设定值',
  f2: '测量系统1位置实际值',
  f3: '测量系统2位置实际值',
  f4: '速度控制器输入设定值',
  f5: '测量系统1速度实际值',
  f6: '测量系统2速度实际值',
  f7: '控制偏差',
  f8: '驱动负载率',
  f9: '转矩形成电流实际值 i(q)',
  f10: '转矩/力设定值',
}
const expectedStatistics = {
  f1: [-300.03, -300],
  f2: [-1100.205965, -1100.172625],
  f3: [-300.030338, -299.999684],
  f4: [-7.18125, 7.18125],
  f5: [-23.031235, 48.923492],
  f6: [-13.769531, 52.148437],
  f7: [-0.012012, 0.000824],
  f8: [0.006104, 4.650879],
  f9: [-2.508911, 1.966187],
  f10: [-4.465862, 3.584553],
}

function fail(message) {
  throw new Error(`[SINUMERIK Trace 校验失败] ${message}`)
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}：期望 ${expected}，实际 ${actual}`)
}

function assertClose(actual, expected, label, tolerance = 1e-6) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    fail(`${label}：期望 ${expected}，实际 ${actual}`)
  }
}

function attributes(tag) {
  const result = {}
  for (const match of tag.matchAll(/([:\w-]+)="([^"]*)"/g)) result[match[1]] = match[2]
  return result
}

function block(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`))
  if (!match) fail(`缺少 <${tagName}> 节点`)
  return match[1]
}

function startTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>`))
  if (!match) fail(`缺少 <${tagName}> 起始节点`)
  return attributes(match[0])
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function downsample(records, statistics, target = 1000) {
  const indexes = new Set([0, records.length - 1])
  const step = Math.max(1, Math.ceil((records.length - 1) / (target - 1)))
  for (let index = 0; index < records.length; index += step) indexes.add(index)
  for (const stat of statistics) {
    indexes.add(stat.minimumIndex)
    indexes.add(stat.maximumIndex)
  }
  return [...indexes].sort((a, b) => a - b).map((index) => records[index])
}

const sourceBuffer = await readFile(sourcePath)
const xml = sourceBuffer.toString('utf8')
const sourceStat = await stat(sourcePath)
const sha256 = createHash('sha256').update(sourceBuffer).digest('hex')
assertEqual(sourceStat.size, 1019318, '原始文件字节数')
assertEqual(sha256, expectedSha256, '原始文件 SHA-256')

const traceSession = startTag(xml, 'traceSession')
const captureV20 = block(xml, 'traceCaptureSetup_V20')
const captureSignalsBlock = block(captureV20, 'signalSettings')
const captureSignals = [...captureSignalsBlock.matchAll(/<signal\b[^>]*\/>/g)].map((match) => attributes(match[0]))
const sessionSettings = startTag(captureV20, 'sessionSettings')

const traceDataMatch = xml.match(/<traceData\b[^>]*>[\s\S]*?<\/traceData>/)
if (!traceDataMatch) fail('缺少 traceData 数据段')
const traceDataXml = traceDataMatch[0]
const traceData = startTag(traceDataXml, 'traceData')
const frameMatches = [...traceDataXml.matchAll(/<dataFrame\b[^>]*>[\s\S]*?<\/dataFrame>/g)]
assertEqual(frameMatches.length, 1, '实际 dataFrame 数量')
assertEqual(Number(traceData.dataFrames), 1, 'traceData 声明的 dataFrame 数量')
const frameXml = frameMatches[0][0]
const frameHeader = startTag(frameXml, 'frameHeader')

const dataSignals = [...frameXml.matchAll(/<dataSignal\b[^>]*\/>/g)].map((match) => attributes(match[0]))
const signalIds = dataSignals.map((signal) => signal.id)
assertEqual(dataSignals.length, 10, 'traceData 信号数量')
assertEqual(new Set(signalIds).size, 10, 'traceData 信号 ID 去重后数量')
assertEqual(captureSignals.length, 10, 'V20 采集配置信号数量')

const rawRecords = [...frameXml.matchAll(/<rec\b[^>]*\/>/g)].map((match) => attributes(match[0]))
assertEqual(rawRecords.length, 7199, '记录数量')
for (const signalId of signalIds) {
  if (rawRecords[0][signalId] === undefined) fail(`首条记录缺少 ${signalId} 初始值，无法执行前值继承`)
}

const lastValues = {}
let inheritedValueCount = 0
let sparseRecordCount = 0
const normalizedRecords = rawRecords.map((record, recordIndex) => {
  const time = Number(record.time)
  if (!Number.isFinite(time)) fail(`第 ${recordIndex + 1} 条记录 time 无效`)
  const normalized = { time }
  let sparse = false
  for (const signalId of signalIds) {
    if (record[signalId] !== undefined) {
      const value = Number(record[signalId])
      if (!Number.isFinite(value)) fail(`第 ${recordIndex + 1} 条记录 ${signalId} 不是有效数字`)
      lastValues[signalId] = value
    } else {
      sparse = true
      inheritedValueCount += 1
    }
    if (lastValues[signalId] === undefined) fail(`第 ${recordIndex + 1} 条记录 ${signalId} 缺少可继承值`)
    normalized[signalId] = lastValues[signalId]
  }
  if (sparse) sparseRecordCount += 1
  return normalized
})

assertClose(normalizedRecords[0].time, 0, '首时间')
assertClose(normalizedRecords.at(-1).time, 14.396, '末时间')
const samplingIntervalSeconds = Number(dataSignals[0].interval)
assertClose(samplingIntervalSeconds, 0.002, '采样间隔')
for (let index = 1; index < normalizedRecords.length; index += 1) {
  assertClose(normalizedRecords[index].time - normalizedRecords[index - 1].time, samplingIntervalSeconds, `第 ${index + 1} 条记录时间间隔`)
}
assertEqual(Number(frameHeader.dropOuts), 0, '掉点数量')

const statistics = signalIds.map((signalId) => {
  let minimum = Number.POSITIVE_INFINITY
  let maximum = Number.NEGATIVE_INFINITY
  let minimumIndex = 0
  let maximumIndex = 0
  let sum = 0
  normalizedRecords.forEach((record, index) => {
    const value = record[signalId]
    if (value < minimum) { minimum = value; minimumIndex = index }
    if (value > maximum) { maximum = value; maximumIndex = index }
    sum += value
  })
  const [expectedMin, expectedMax] = expectedStatistics[signalId]
  assertClose(minimum, expectedMin, `${signalId} 最小值`)
  assertClose(maximum, expectedMax, `${signalId} 最大值`)
  return {
    id: signalId,
    label: signalLabels[signalId],
    minimum,
    maximum,
    mean: sum / normalizedRecords.length,
    minimumIndex,
    maximumIndex,
  }
})

const pulseStarts = []
let previousMoving = false
for (const record of normalizedRecords) {
  const moving = Math.abs(record.f4) > 1e-9
  if (moving && !previousMoving) pulseStarts.push({ time: record.time, direction: Math.sign(record.f4) })
  previousMoving = moving
}
const pulseIntervals = pulseStarts.slice(1).map((pulse, index) => pulse.time - pulseStarts[index].time)
const negativePulseCount = pulseStarts.filter((pulse) => pulse.direction < 0).length
const positivePulseCount = pulseStarts.filter((pulse) => pulse.direction > 0).length
assertEqual(pulseStarts.length, 60, '运动脉冲总数')
assertEqual(negativePulseCount, 30, '负向脉冲数量')
assertEqual(positivePulseCount, 30, '正向脉冲数量')
assertClose(median(pulseIntervals), 0.228, '脉冲起点间隔中位数', 0.004)
const positionSetpointRange = statistics.find((item) => item.id === 'f1').maximum - statistics.find((item) => item.id === 'f1').minimum
assertClose(positionSetpointRange, 0.03, '位置设定值总变化范围')

const signals = dataSignals.map((dataSignal) => {
  const captureSignal = captureSignals.find((signal) => signal.key === dataSignal.key)
  if (!captureSignal) fail(`V20 配置中缺少 ${dataSignal.key}`)
  return {
    id: dataSignal.id,
    key: dataSignal.key,
    label: signalLabels[dataSignal.id],
    description: captureSignal.description,
    name: captureSignal.name,
    unitsType: dataSignal.unitsType,
    captureUnitsType: captureSignal.unitsType,
    domain: dataSignal.domain,
    dataType: dataSignal.dataType,
    interval: Number(dataSignal.interval),
    datapointCount: Number(dataSignal.datapointCount),
  }
})
assertEqual(signals.find((signal) => signal.id === 'f10').captureUnitsType, 'torque', 'f10 采集配置 unitsType')
assertEqual(signals.find((signal) => signal.id === 'f10').unitsType, '611DTime1', 'f10 traceData unitsType')

const qualityNotes = [
  '文件名为 X_BK300_1.xml，但文件内部 sessionName 为 BK240_1，文件标识与会话标识不一致，需后续核验。',
  'f10 在采集配置中定义为 torque，但 traceData/dataSignal 中的 unitsType 为 611DTime1；当前保留原始字段，不擅自修改单位。',
  '当前只展示源数据和基础统计，未形成机床性能合格或不合格结论。',
]
const axisAddressMatch = signals[0].name.match(/\[([^\]]+)\]/)
const summary = {
  resourceId: 'sinumerik-x-bk300-1',
  sourceFile: 'X_BK300_1.xml',
  fileSizeBytes: sourceStat.size,
  fileSizeLabel: '995.4 KiB',
  sha256,
  traceVersion: traceSession.version,
  sessionName: sessionSettings.sessionName,
  captureTime: frameHeader.startTime,
  domain: signals[0].domain,
  axisAddress: axisAddressMatch?.[1] ?? '',
  axisLabel: 'X（来自文件名）',
  durationSeconds: Number(frameHeader.stopInc),
  samplingIntervalSeconds,
  samplingRateHz: 1 / samplingIntervalSeconds,
  frameCount: frameMatches.length,
  signalCount: signals.length,
  recordCount: normalizedRecords.length,
  reconstructedPointCount: normalizedRecords.length * signals.length,
  dropOuts: Number(frameHeader.dropOuts),
  sparseRecordCount,
  inheritedValueCount,
  signals,
  statistics: statistics.map(({ minimumIndex: _minimumIndex, maximumIndex: _maximumIndex, ...item }) => item),
  basicFeatures: {
    movementPulseCount: pulseStarts.length,
    negativePulseCount,
    positivePulseCount,
    pulseStartIntervalMedianSeconds: median(pulseIntervals),
    positionSetpointRange,
  },
  qualityNotes,
}

const previewRecords = downsample(normalizedRecords, statistics)
const preview = {
  resourceId: summary.resourceId,
  samplingIntervalSeconds,
  durationSeconds: summary.durationSeconds,
  originalPointCount: normalizedRecords.length,
  previewPointCount: previewRecords.length,
  downsampling: '等间隔抽样并补入各信号全局极值点；原始 XML 与标准化 CSV 保持全部 7,199 个时间点。',
  groups: [
    { id: 'position-follow', label: '位置跟随', signalIds: ['f1', 'f3'] },
    { id: 'position-reference', label: '测量系统1位置', signalIds: ['f2'] },
    { id: 'control-deviation', label: '控制偏差', signalIds: ['f7'] },
    { id: 'velocity', label: '速度', signalIds: ['f4', 'f5', 'f6'] },
    { id: 'load-drive', label: '负载与驱动量', signalIds: ['f8', 'f9', 'f10'], splitAxes: true },
  ],
  signals,
  records: previewRecords,
}

const csvHeader = ['time', ...signalIds].join(',')
const csvRows = normalizedRecords.map((record) => [record.time.toFixed(6), ...signalIds.map((signalId) => record[signalId].toFixed(6))].join(','))

await mkdir(outputDir, { recursive: true })
await Promise.all([
  writeFile(path.join(outputDir, 'x-bk300-1-summary.json'), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(path.join(outputDir, 'x-bk300-1-preview.json'), `${JSON.stringify(preview)}\n`),
  writeFile(path.join(outputDir, 'x-bk300-1-normalized.csv'), `${csvHeader}\n${csvRows.join('\n')}\n`),
])

console.log('SINUMERIK Trace 数据生成成功')
console.log(JSON.stringify({
  sha256,
  signalCount: summary.signalCount,
  recordCount: summary.recordCount,
  reconstructedPointCount: summary.reconstructedPointCount,
  samplingIntervalSeconds,
  durationSeconds: summary.durationSeconds,
  dropOuts: summary.dropOuts,
  sparseRecordCount,
  inheritedValueCount,
  previewPointCount: preview.previewPointCount,
  basicFeatures: summary.basicFeatures,
}, null, 2))
