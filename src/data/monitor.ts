import type { MonitorRecord } from '../types'

export const initialMonitorRecords: MonitorRecord[] = [
  { id: 'monitor-001', appName: '数控系统配置清单管理平台', serviceStatus: '正常', databaseStatus: '正常', apiStatus: '正常', lastAccess: '2026-07-16 09:48', version: 'v1.6.2' },
  { id: 'monitor-002', appName: '测试任务协同管理系统', serviceStatus: '正常', databaseStatus: '正常', apiStatus: '正常', lastAccess: '2026-07-16 09:31', version: 'v2.1.0' },
  { id: 'monitor-003', appName: '机床装配质量评价系统', serviceStatus: '联调中', databaseStatus: '联调中', apiStatus: '待检查', lastAccess: '联调环境暂未开放', version: 'v0.9.3' },
  { id: 'monitor-004', appName: '大连理工大学软件上云试点', serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '尚未接入', version: '待确认' },
]

export const monitorMeta = {
  lastCheckedAt: '2026-07-16 09:50',
  databaseSummary: '2 正常 / 1 联调 / 1 未接入',
  note: '当前为联调阶段维护数据，非实时监控结果，最终以正式监测接口为准。',
}
