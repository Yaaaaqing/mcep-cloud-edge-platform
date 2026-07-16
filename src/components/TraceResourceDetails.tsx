import { AlertTriangle, Download, FileCode2, RefreshCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DataResource, TracePreview, TraceSignal, TraceSummary } from '../types'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/Button'

const tabs = ['数据概览', '信号列表', '曲线预览', '文件信息'] as const
const colors: Record<string, string> = {
  f1: '#246BFD', f2: '#7C3AED', f3: '#24CDE3', f4: '#0F766E', f5: '#2563EB',
  f6: '#7C3AED', f7: '#F97316', f8: '#0891B2', f9: '#4F46E5', f10: '#D97706',
}

function formatValue(value: number) {
  return Number.isFinite(value) ? value.toFixed(6) : '—'
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-line bg-canvas/35 p-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 break-words text-sm font-medium text-ink">{value}</dd></div>
}

function DownloadLink({ href, children }: { href: string; children: string }) {
  return <a href={href} download className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink transition hover:border-brand/30 hover:bg-brand/[.035] hover:text-brand"><Download size={16} />{children}</a>
}

function Chart({ records, signals, brushKey, compact = false }: { records: Array<Record<string, number>>; signals: TraceSignal[]; brushKey: number; compact?: boolean }) {
  return <div className="min-w-0 rounded-2xl border border-line bg-white p-3 sm:p-4">
    {compact && signals[0] && <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1"><p className="text-sm font-semibold text-ink">{signals[0].label}</p><span className="text-xs text-muted">原始 unitsType：{signals[0].unitsType} · 工程单位待核验</span></div>}
    <div className={compact ? 'h-[245px] min-w-0' : 'h-[360px] min-w-0'}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={records} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="#E7ECF3" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(value) => Number(value).toFixed(2)} tick={{ fontSize: 11, fill: '#657185' }} label={{ value: '时间（s）', position: 'insideBottomRight', offset: -2, fill: '#657185', fontSize: 11 }} />
          <YAxis width={72} tickFormatter={(value) => Number(value).toFixed(4)} tick={{ fontSize: 11, fill: '#657185' }} domain={['auto', 'auto']} />
          <Tooltip labelFormatter={(value) => `时间：${Number(value).toFixed(3)} s`} formatter={(value, name) => [formatValue(Number(value)), String(name)]} contentStyle={{ borderRadius: 12, borderColor: '#E7ECF3', fontSize: 12 }} />
          {!compact && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
          {signals.map((signal) => <Line key={signal.id} type="linear" dataKey={signal.id} name={signal.label} stroke={colors[signal.id]} strokeWidth={1.7} dot={false} isAnimationActive={false} />)}
          <Brush key={brushKey} dataKey="time" height={26} stroke="#246BFD" travellerWidth={8} tickFormatter={(value) => Number(value).toFixed(1)} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}

export function TraceResourceDetails({ resource }: { resource: DataResource }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('数据概览')
  const [summary, setSummary] = useState<TraceSummary | null>(null)
  const [preview, setPreview] = useState<TracePreview | null>(null)
  const [loadError, setLoadError] = useState('')
  const [activeGroupId, setActiveGroupId] = useState('position-follow')
  const [visibleSignalIds, setVisibleSignalIds] = useState<string[]>(['f1', 'f3'])
  const [brushKey, setBrushKey] = useState(0)
  const baseUrl = import.meta.env.BASE_URL
  const rawXmlUrl = `${baseUrl}data/raw/X_BK300_1.xml`
  const csvUrl = `${baseUrl}data/processed/x-bk300-1-normalized.csv`
  const summaryUrl = `${baseUrl}data/processed/x-bk300-1-summary.json`
  const previewUrl = `${baseUrl}data/processed/x-bk300-1-preview.json`

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetch(summaryUrl, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`元数据读取失败（${response.status}）`)
        return response.json() as Promise<TraceSummary>
      }),
      fetch(previewUrl, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`预览数据读取失败（${response.status}）`)
        return response.json() as Promise<TracePreview>
      }),
    ]).then(([nextSummary, nextPreview]) => {
      setSummary(nextSummary)
      setPreview(nextPreview)
      setLoadError('')
    }).catch((error: unknown) => {
      if ((error as Error).name !== 'AbortError') setLoadError((error as Error).message)
    })
    return () => controller.abort()
  }, [previewUrl, summaryUrl])

  const activeGroup = preview?.groups.find((group) => group.id === activeGroupId) ?? preview?.groups[0]
  const activeSignals = useMemo(() => preview?.signals.filter((signal) => activeGroup?.signalIds.includes(signal.id) && visibleSignalIds.includes(signal.id)) ?? [], [activeGroup, preview, visibleSignalIds])
  const statistics = useMemo(() => new Map(summary?.statistics.map((item) => [item.id, item]) ?? []), [summary])

  const selectGroup = (groupId: string) => {
    const group = preview?.groups.find((item) => item.id === groupId)
    setActiveGroupId(groupId)
    setVisibleSignalIds(group?.signalIds ?? [])
    setBrushKey((value) => value + 1)
  }
  const toggleSignal = (signalId: string) => {
    setVisibleSignalIds((current) => current.includes(signalId) ? current.filter((item) => item !== signalId) : [...current, signalId])
  }

  return <section className="card min-w-0 overflow-hidden">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5 xl:p-7">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2"><StatusBadge status={resource.status ?? '已入库'} /><StatusBadge status={resource.previewStatus ?? '可预览'} /><StatusBadge status={resource.qualityStatus ?? '元数据待核验'} /></div>
        <h2 className="mt-4 text-xl font-semibold text-ink xl:text-2xl">{resource.name}</h2>
        <p className="mt-2 text-sm text-muted">{resource.category} · {resource.source}</p>
      </div>
      <div className="flex flex-wrap gap-2"><DownloadLink href={rawXmlUrl}>下载原始 XML</DownloadLink><DownloadLink href={csvUrl}>下载标准化 CSV</DownloadLink></div>
    </div>
    <div className="thin-scrollbar overflow-x-auto border-b border-line px-5 xl:px-7"><div className="flex min-w-max gap-1 py-3">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`focus-ring rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-brand text-white' : 'text-muted hover:bg-canvas hover:text-ink'}`}>{tab}</button>)}</div></div>
    <div className="min-w-0 p-5 xl:p-7">
      {loadError && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{loadError}</div>}
      {!summary && !loadError && <div className="py-14 text-center text-sm text-muted">正在读取预处理 Trace 数据…</div>}
      {summary && activeTab === '数据概览' && <div>
        <p className="max-w-4xl text-sm leading-7 text-text">{resource.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-4">
          <Metric label="来源系统" value={resource.source} /><Metric label="文件名称" value={summary.sourceFile} /><Metric label="会话名称" value={summary.sessionName} /><Metric label="采集时间" value={summary.captureTime} />
          <Metric label="数据域" value={summary.domain} /><Metric label="轴地址" value={summary.axisAddress} /><Metric label="持续时间" value={`${summary.durationSeconds} 秒`} /><Metric label="采样周期" value={`${summary.samplingIntervalSeconds} 秒`} />
          <Metric label="采样率" value={`${summary.samplingRateHz} Hz`} /><Metric label="信号数量" value={`${summary.signalCount} 路`} /><Metric label="记录数量" value={`${summary.recordCount.toLocaleString('zh-CN')} 条`} /><Metric label="掉点数量" value={summary.dropOuts} />
        </dl>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5"><h3 className="flex items-center gap-2 font-semibold text-amber-900"><AlertTriangle size={18} />数据质量提示</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-amber-900/80">{summary.qualityNotes.map((note) => <li key={note}>{note}</li>)}</ol></div>
        <div className="mt-6 rounded-2xl border border-brand/10 bg-brand/[.035] p-5"><h3 className="font-semibold text-ink">基础数据特征</h3><p className="mt-2 text-sm leading-6 text-muted">识别到 {summary.basicFeatures.movementPulseCount} 个运动脉冲（负向 {summary.basicFeatures.negativePulseCount}、正向 {summary.basicFeatures.positivePulseCount}），脉冲起点间隔中位数约 {summary.basicFeatures.pulseStartIntervalMedianSeconds.toFixed(3)} 秒，位置设定值总变化范围约 {summary.basicFeatures.positionSetpointRange.toFixed(3)}。以上仅为源数据基础特征，不构成合格性结论。</p></div>
      </div>}
      {summary && activeTab === '信号列表' && <div className="thin-scrollbar max-w-full overflow-x-auto rounded-2xl border border-line"><table className="min-w-[1180px] w-full"><thead className="table-head"><tr>{['字段', '中文名称', '原始描述', '原始变量地址', '类型', '原始 unitsType', '采样周期', '数据点数', '最小值', '最大值'].map((label) => <th className="px-4 py-3.5" key={label}>{label}</th>)}</tr></thead><tbody>{summary.signals.map((signal) => { const stat = statistics.get(signal.id); return <tr key={signal.id}><td className="table-cell font-mono text-xs">{signal.id}</td><td className="table-cell font-medium text-ink">{signal.label}</td><td className="table-cell max-w-[260px] text-xs">{signal.description}</td><td className="table-cell max-w-[360px] break-all font-mono text-xs">{signal.name}</td><td className="table-cell">{signal.dataType}</td><td className="table-cell"><span className="font-mono text-xs">{signal.unitsType}</span>{signal.captureUnitsType !== signal.unitsType && <p className="mt-1 text-xs text-amber-700">配置：{signal.captureUnitsType}</p>}</td><td className="table-cell">{signal.interval}s</td><td className="table-cell">{signal.datapointCount}</td><td className="table-cell font-mono text-xs">{stat ? formatValue(stat.minimum) : '—'}</td><td className="table-cell font-mono text-xs">{stat ? formatValue(stat.maximum) : '—'}</td></tr>})}</tbody></table></div>}
      {summary && preview && activeTab === '曲线预览' && <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-semibold text-ink">Trace 曲线预览</h3><p className="mt-2 text-sm text-muted">预览 {preview.previewPointCount} / {preview.originalPointCount.toLocaleString('zh-CN')} 个时间点；采样周期 {preview.samplingIntervalSeconds}s，持续时间 {preview.durationSeconds}s。</p></div><Button variant="secondary" icon={<RefreshCcw size={16} />} onClick={() => setBrushKey((value) => value + 1)}>恢复全量视图</Button></div>
        <div className="mt-5 flex flex-wrap gap-2">{preview.groups.map((group) => <button key={group.id} onClick={() => selectGroup(group.id)} className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${activeGroup?.id === group.id ? 'bg-brand text-white' : 'bg-canvas text-muted hover:text-ink'}`}>{group.label}</button>)}</div>
        {activeGroup && <div className="mt-4 flex flex-wrap gap-3 rounded-2xl border border-line bg-canvas/45 p-4">{preview.signals.filter((signal) => activeGroup.signalIds.includes(signal.id)).map((signal) => <label className="flex cursor-pointer items-center gap-2 text-sm text-text" key={signal.id}><input type="checkbox" checked={visibleSignalIds.includes(signal.id)} onChange={() => toggleSignal(signal.id)} className="h-4 w-4 accent-[#246BFD]" /><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[signal.id] }} />{signal.id} {signal.label}<span className="text-xs text-muted">({signal.unitsType})</span></label>)}</div>}
        <p className="mt-3 text-xs leading-5 text-muted">图例可开关；底部范围条支持时间轴缩放。单位显示 XML 原始 unitsType，工程单位待核验。</p>
        <div className="mt-5 min-w-0">{activeSignals.length ? activeGroup?.splitAxes ? <div className="grid min-w-0 gap-4 xl:grid-cols-2">{activeSignals.map((signal) => <Chart key={signal.id} records={preview.records} signals={[signal]} brushKey={brushKey} compact />)}</div> : <Chart records={preview.records} signals={activeSignals} brushKey={brushKey} /> : <div className="rounded-2xl border border-dashed border-line p-12 text-center text-sm text-muted">请至少勾选一个信号。</div>}</div>
        <div className="mt-5 rounded-xl bg-canvas p-4 text-xs leading-5 text-muted">{preview.downsampling}</div>
      </div>}
      {summary && activeTab === '文件信息' && <div>
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><FileCode2 size={21} /></span><div><h3 className="font-semibold text-ink">原始文件与标准化输出</h3><p className="mt-1 text-sm text-muted">文件均由同一份只读 XML 生成，可直接下载核验。</p></div></div>
        <dl className="mt-6 grid grid-cols-2 gap-3"><Metric label="文件名" value={summary.sourceFile} /><Metric label="文件大小" value={`${summary.fileSizeLabel}（${summary.fileSizeBytes.toLocaleString('zh-CN')} 字节）`} /><Metric label="XML Trace 版本" value={summary.traceVersion} /><Metric label="重建数据点" value={summary.reconstructedPointCount.toLocaleString('zh-CN')} /></dl>
        <div className="mt-4 rounded-xl border border-line bg-canvas/35 p-4"><p className="text-xs text-muted">SHA-256</p><p className="mt-2 break-all font-mono text-xs leading-6 text-ink">{summary.sha256}</p></div>
        <div className="mt-6 flex flex-wrap gap-3"><DownloadLink href={rawXmlUrl}>下载原始 XML</DownloadLink><DownloadLink href={csvUrl}>下载标准化 CSV</DownloadLink><DownloadLink href={summaryUrl}>下载元数据 JSON</DownloadLink></div>
      </div>}
    </div>
  </section>
}
