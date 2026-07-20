import type { CloudResource } from '../types'

const publicCloudResources: CloudResource[] = [
  {
    id: 'cloud-vm-20-2',
    instanceName: 'VM-20-2',
    resourceType: '应用虚拟机',
    cpuArchitecture: '待确认',
    cpuCores: 8,
    memoryGB: 16,
    diskGB: 200,
    operatingSystem: '银河麒麟 V10 SP3',
    internalIp: '10.156.20.x',
    runningStatus: '运行中',
    managementStatus: '验证通过',
    applicant: '待确认',
    owner: '待确认',
    purpose: '数控系统配置清单管理平台',
    relatedAppId: 'app-001',
    confirmed: true,
    remark: '公开演示台账已脱敏，完整资源信息不进入版本控制。',
    updatedAt: '2026-07-20',
  },
  {
    id: 'cloud-vm-20-3', instanceName: 'VM-20-3', resourceType: '待确认', cpuArchitecture: '待确认', cpuCores: 8, memoryGB: 16, diskGB: 200, operatingSystem: '银河麒麟 V10 SP3', internalIp: '10.156.20.x', runningStatus: '运行中', managementStatus: '验证通过', applicant: '待确认', owner: '待确认', purpose: '待数科公司确认', relatedAppId: '', confirmed: false, remark: '用途、已安装服务及复用条件待核实。', updatedAt: '2026-07-20',
  },
  {
    id: 'cloud-vm-20-4', instanceName: 'VM-20-4', resourceType: '待确认', cpuArchitecture: '待确认', cpuCores: 8, memoryGB: 16, diskGB: 200, operatingSystem: '银河麒麟 V10 SP3', internalIp: '10.156.20.x', runningStatus: '运行中', managementStatus: '验证通过', applicant: '待确认', owner: '待确认', purpose: '待数科公司确认', relatedAppId: '', confirmed: false, remark: '用途、已安装服务及复用条件待核实。', updatedAt: '2026-07-20',
  },
  {
    id: 'cloud-vm-20-5', instanceName: 'VM-20-5', resourceType: '待确认', cpuArchitecture: '待确认', cpuCores: 8, memoryGB: 16, diskGB: 150, operatingSystem: '银河麒麟 V10 SP3', internalIp: '10.156.20.x', runningStatus: '运行中', managementStatus: '验证通过', applicant: '待确认', owner: '待确认', purpose: '疑似数据库相关资源，待数科公司确认', relatedAppId: '', confirmed: false, remark: '数据库类型、现有实例和复用条件待核实。', updatedAt: '2026-07-20',
  },
  {
    id: 'cloud-vm-20-6', instanceName: 'VM-20-6', resourceType: '待确认', cpuArchitecture: '待确认', cpuCores: 8, memoryGB: 16, diskGB: 150, operatingSystem: '银河麒麟 V10 SP3', internalIp: '10.156.20.x', runningStatus: '运行中', managementStatus: '验证通过', applicant: '待确认', owner: '待确认', purpose: '疑似数据库相关资源，待数科公司确认', relatedAppId: '', confirmed: false, remark: '数据库类型、现有实例和复用条件待核实。', updatedAt: '2026-07-20',
  },
]

type PrivateCloudConfig = { cloudResources?: Array<Partial<CloudResource> & Pick<CloudResource, 'id'>> }

const privateModules = import.meta.glob<PrivateCloudConfig>(
  '../../config/private/cloud-resources.local.json',
  { eager: true, import: 'default' },
)
const privateConfig = Object.values(privateModules)[0]

export const initialCloudResources: CloudResource[] = publicCloudResources.map((resource) => ({
  ...resource,
  ...(privateConfig?.cloudResources?.find((item) => item.id === resource.id) ?? {}),
}))
