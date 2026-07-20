import type { EdgeNode } from '../types'

export const edgeGroupPlans = Array.from({ length: 6 }, (_, index) => ({
  id: `edge-group-${String(index + 1).padStart(2, '0')}`,
  name: `边缘节点组 ${String(index + 1).padStart(2, '0')}`,
  machine: '关联机床待确认',
}))

export const initialEdgeNodes: EdgeNode[] = edgeGroupPlans.flatMap((group, index) => {
  const number = String(index + 1).padStart(2, '0')
  const shared = {
    organization: '部署单位待确认',
    machine: group.machine,
    protocol: 'HTTPS（拟）',
    ip: '待分配',
    status: '待部署' as const,
    lastSeen: '尚未接入',
    groupId: group.id,
    deployedApps: [],
    localDatabase: '待确认',
    cloudConnectionStatus: '待接入',
    lastHeartbeat: '尚未接入',
    lastUploadAt: '尚未上传',
    pendingFileCount: 0,
    syncStatus: '待接入',
  }
  return [
    {
      ...shared,
      id: `edge-compute-${number}`,
      code: `MCEP-EC-${number}`,
      name: `${group.name}计算设备`,
      os: 'Windows 11 Pro',
      note: '硬件已纳入部署台账，现场位置、IP、关联应用和机床待实施确认。',
      deviceType: '边缘计算设备' as const,
      model: 'Dell Precision T5860 定制 4U',
      cpu: 'Intel Core i7-14700',
      memory: '64 GB',
      storage: '1 TB',
      gpu: 'NVIDIA RTX 2000 Ada 16 GB',
      operatingSystem: 'Windows 11 Pro',
    },
    {
      ...shared,
      id: `edge-storage-${number}`,
      code: `MCEP-ES-${number}`,
      name: `${group.name}存储设备`,
      os: 'Windows 11 Pro',
      note: '硬件已纳入部署台账，数据目录、同步策略与保留周期待实施确认。',
      deviceType: '边缘存储设备' as const,
      model: 'Dell Precision T5860 定制 4U',
      cpu: 'Intel Core i5-14600',
      memory: '32 GB',
      storage: '4 TB',
      gpu: '无独立 GPU',
      operatingSystem: 'Windows 11 Pro',
    },
  ]
})
