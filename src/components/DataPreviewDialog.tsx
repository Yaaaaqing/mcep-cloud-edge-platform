import { Download, FileSpreadsheet } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { csvPreviewData, csvText } from '../data/csvData'
import { downloadFile } from '../utils/download'
import { Modal } from './Modal'
import { Button } from './ui/Button'

export function DataPreviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="CSV 数据预览" description="主轴温升试验数据_20260715.csv" width="max-w-6xl">
      <div className="grid grid-cols-4 gap-4">
        {[
          ['数据来源', '主轴热特性分析工具'], ['采集对象', '主轴性能试验台 A'], ['采集时间', '2026-07-15 09:00—09:55'], ['数据记录', '12 条演示记录'],
        ].map(([label, value]) => <div className="rounded-xl bg-canvas p-4" key={label}><p className="text-xs text-muted">{label}</p><p className="mt-2 text-sm font-medium text-ink">{value}</p></div>)}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">参数选择</label>
          <select className="input w-44" defaultValue="temperature"><option value="temperature">温度（℃）</option><option value="vibration">振动速度（mm/s）</option><option value="load">负载率（%）</option></select>
          <label className="ml-2 text-sm text-muted">横轴</label>
          <select className="input w-32"><option>采集时间</option></select>
        </div>
        <Button icon={<Download size={16} />} onClick={() => downloadFile('主轴温升试验数据.csv', csvText, 'text/csv;charset=utf-8')}>下载 CSV</Button>
      </div>
      <div className="mt-5 h-72 rounded-2xl border border-line bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={csvPreviewData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E7ECF3" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="timestamp" tick={{ fill: '#657185', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#657185', fontSize: 12 }} axisLine={false} tickLine={false} unit="℃" />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#657185', fontSize: 12 }} axisLine={false} tickLine={false} unit="mm/s" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7ECF3', boxShadow: '0 10px 30px rgba(23,32,51,.08)' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="temperature" name="温度" stroke="#246BFD" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="vibration" name="振动速度" stroke="#24CDE3" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-line">
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3 text-sm font-medium text-ink"><FileSpreadsheet size={17} className="text-brand" />表格预览</div>
        <div className="max-h-64 overflow-auto thin-scrollbar">
          <table className="w-full"><thead className="table-head sticky top-0"><tr>{['采集时间', '主轴转速(r/min)', '振动速度(mm/s)', '温度(℃)', '负载率(%)'].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead><tbody>{csvPreviewData.map((row) => <tr key={row.timestamp}><td className="table-cell">{row.timestamp}</td><td className="table-cell">{row.spindleSpeed}</td><td className="table-cell">{row.vibration}</td><td className="table-cell">{row.temperature}</td><td className="table-cell">{row.load}</td></tr>)}</tbody></table>
        </div>
      </div>
    </Modal>
  )
}
