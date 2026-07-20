import type { MonitorRecord } from '../types'

export const initialMonitorRecords: MonitorRecord[] = [
  {
    id: 'monitor-001', appName: 'MCEP高端机床云边协同应用平台', targetName: 'MCEP前端展示站点', targetType: 'MCEP平台',
    serviceStatus: '待检查', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '本地页面访问不计入生产监测', version: 'V1.0',
    checkMethod: '页面可用性演示检查', checkSource: '浏览器本地示例数据', lastCheckedAt: '尚未执行真实检查', consecutiveFailures: 0, latestError: '无真实监测结果', responsiblePerson: '平台建设组', isDemo: true,
  },
  {
    id: 'monitor-002', appName: '数控系统配置清单管理平台', targetName: '应用服务', targetType: '独立云端应用',
    serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '尚未接入自动监测', version: 'V1.0',
    checkMethod: 'HTTP 健康检查（待配置）', checkSource: '待接入自动监测', lastCheckedAt: '尚未接入', consecutiveFailures: 0, latestError: '无检查数据', responsiblePerson: '周工', isDemo: false,
  },
  {
    id: 'monitor-003', appName: '机床装配质量评价系统', targetName: '联调环境应用服务', targetType: '独立云端应用',
    serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '联调监测尚未配置', version: '待确认',
    checkMethod: 'HTTP 健康检查（待配置）', checkSource: '待接入自动监测', lastCheckedAt: '尚未接入', consecutiveFailures: 0, latestError: '无检查数据', responsiblePerson: '吴工', isDemo: false,
  },
  {
    id: 'monitor-004', appName: '关键功能部件动态特性辨识软件', targetName: '软件成果', targetType: '独立云端应用',
    serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '尚未部署', version: '待确认',
    checkMethod: '待技术评估', checkSource: '待接入自动监测', lastCheckedAt: '尚未接入', consecutiveFailures: 0, latestError: '无检查数据', responsiblePerson: '待确认', isDemo: false,
  },
  {
    id: 'monitor-005', appName: '边缘节点组', targetName: '6 组边缘节点', targetType: '边缘节点',
    serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', lastAccess: '设备待部署', version: '不适用',
    checkMethod: '心跳与同步状态（待配置）', checkSource: '待接入自动监测', lastCheckedAt: '尚未接入', consecutiveFailures: 0, latestError: '无心跳数据', responsiblePerson: '待确认', isDemo: false,
  },
]

export const monitorMeta = {
  lastCheckedAt: '尚未接入真实监测',
  databaseSummary: '数据库检查接口待配置',
  note: '当前页面展示监测对象配置与示例数据，不代表真实实时监控结果。',
}
