import { createServer } from 'vite'

const values = new Map()
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: (key) => values.delete(key),
  clear: () => values.clear(),
}
globalThis.window = { dispatchEvent: () => true }
if (!globalThis.CustomEvent) globalThis.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail } }

const oldApp = {
  id: 'app-001', name: '数控系统配置清单管理平台', organization: '流控所', description: '旧版数据', status: '业务运营中', deployment: '旧云端环境', database: 'PostgreSQL', updatedAt: '2025-01-01', owner: '旧联系人', category: '研发管理',
}
const legacyPilot = {
  id: 'app-003', name: '大连理工大学软件上云试点', organization: '大连理工大学', description: '旧版泛化记录', status: '技术对接中', deployment: '待确认', database: '待确认', updatedAt: '2025-01-01', owner: '待确认', category: '科研软件',
}
const oldResource = {
  id: 'data-001', name: '主轴温升试验数据集', source: '主轴热特性分析工具', type: 'CSV文件', updateMode: '人工上传', volume: '旧数据量', updatedAt: '2025-01-01', organization: '流控所', permission: '项目成员可见', description: '旧版资源',
}
const oldEdge = {
  id: 'edge-001', code: 'MCEP-EDGE-001', name: '旧边缘节点', organization: '流控所', machine: '旧试验台', os: 'Ubuntu', protocol: 'HTTPS', ip: '待分配', status: '待部署', lastSeen: '尚未部署', note: '旧记录',
}
const oldMonitor = {
  id: 'monitor-001', appName: '数控系统配置清单管理平台', serviceStatus: '正常', databaseStatus: '正常', apiStatus: '正常', lastAccess: '旧检查时间', version: 'v0.1',
}
const oldAccess = {
  id: 'ACC-OLD', appName: '旧版接入软件', organization: '测试单位', appOwner: '负责人', technicalContact: '', appType: '科研软件', deploymentMode: '本地工作站', hasWeb: '否', usesDatabase: '是', os: 'Windows', runtime: 'Python', dependencies: 'numpy', cpu: '8 核', memory: '16 GB', storage: '500 GB', gpu: '无', supportsContainer: '待确认', needsInternet: '否', startCommand: 'python app.py', sourceIp: '待分配', targetIp: '待分配', port: '443', protocol: 'HTTPS', sso: '待确认', databaseType: 'MySQL', databaseVersion: '8', apiType: '暂无接口', apiUrl: '', transferMethod: '人工上传', updateFrequency: '按批次', testResult: '待测试', issueLog: '等待安装包', launchConfirmation: '待确认', status: '待审核', createdAt: '2025-01-01',
}

for (const [key, data] of Object.entries({ apps: [oldApp, legacyPilot], resources: [oldResource], edgeNodes: [oldEdge], monitors: [oldMonitor], accessApplications: [oldAccess] })) {
  values.set(`mcep:${key}`, JSON.stringify(data))
  values.set(`mcep:schema:${key}`, '3')
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
try {
  const { dataService } = await server.ssrLoadModule('/src/services/storage.ts')
  const assert = (condition, message) => { if (!condition) throw new Error(message) }

  const apps = dataService.getSync('apps')
  assert(apps.some((item) => item.id === 'uni-dlut-dynamics'), '六所高校软件种子未补齐')
  assert(!apps.some((item) => item.id === 'app-003'), '旧版泛化试点记录未迁移')
  assert(apps.find((item) => item.id === 'app-001')?.deploymentMode === '独立云端部署', '应用新字段未按种子补齐')

  const resources = dataService.getSync('resources')
  assert(resources.length === 5, `资源迁移数量异常：${resources.length}`)
  assert(resources.find((item) => item.id === 'data-001')?.integrationMode === '文件上传', '资源集成字段未补齐')

  const edges = dataService.getSync('edgeNodes')
  assert(edges.length === 12, `边缘设备迁移数量异常：${edges.length}`)
  assert(new Set(edges.map((item) => item.groupId)).size === 6, '边缘节点组数量异常')

  const monitors = dataService.getSync('monitors')
  assert(monitors.find((item) => item.id === 'monitor-001')?.serviceStatus === '待检查', '旧版虚假正常监测未清理')
  assert(monitors.every((item) => item.checkSource === '待接入自动监测' || item.isDemo), '监测来源标识不完整')

  const access = dataService.getSync('accessApplications')[0]
  assert(access.currentDeployment === '本地工作站', '旧接入部署字段未迁移')
  assert(access.currentBlocker === '等待安装包', '旧问题记录未迁移')
  assert(access.recommendedDeployment === '待评估', '推荐部署默认值异常')

  const cloudResources = dataService.getSync('cloudResources')
  assert(cloudResources.length === 5, `云资源台账数量异常：${cloudResources.length}`)
  assert(cloudResources.every((item) => item.internalIp === '10.156.20.x'), '公开云资源 IP 未保持脱敏')
  assert(cloudResources.find((item) => item.instanceName === 'VM-20-2')?.relatedAppId === 'app-001', '云资源关联应用异常')

  dataService.reset()
  assert(dataService.getSync('apps').length === 11, '重置后应用初始数据异常')
  assert(dataService.getSync('resources').length === 5, '重置后资源初始数据异常')
  assert(dataService.getSync('edgeNodes').length === 12, '重置后边缘设备初始数据异常')
  assert(dataService.getSync('cloudResources').length === 5, '重置后云资源初始数据异常')

  console.log('localStorage schema v3 → v7 迁移、云资源种子与重置校验通过')
} finally {
  await server.close()
}
