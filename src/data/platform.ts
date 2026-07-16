import type { DocumentRecord, HomeContent, UserRecord } from '../types'

export const deliveryRoadmap = [
  { title: '流程固化', date: '06.30 前' },
  { title: '试点部署', date: '07.31 前' },
  { title: '边缘节点管理', date: '08.31 前' },
  { title: '数据展示验证', date: '09.15 前' },
  { title: '最终交付', date: '09.30 前' },
]

export const templateItems = ['应用上云信息确认表', '部署环境确认表', '网络策略申请表', '统一认证申请表', '数据库申请表', '接口信息确认表', '测试验证记录表']

export const responsibilityMatrix = [
  { activity: '软件提供', owner: '提供安装包、部署说明和依赖清单', institute: '确认业务范围和验收要求', company: '检查材料完整性并登记' },
  { activity: '资源申请', owner: '提出资源需求与使用周期', institute: '审核资源合理性', company: '协调云资源并反馈结果' },
  { activity: '应用部署', owner: '配合安装、配置与问题处理', institute: '提供业务确认', company: '执行环境准备与部署实施' },
  { activity: '网络认证', owner: '提供访问范围、端口和账号需求', institute: '审核网络与认证申请', company: '配置策略、统一认证与访问控制' },
  { activity: '接口联调', owner: '提供接口文档并配合调整', institute: '确认数据口径', company: '组织联调并记录问题' },
  { activity: '测试上线', owner: '修复问题并确认版本', institute: '执行或组织业务验收', company: '完成技术验证、上线与归档' },
]

export const initialUsers: UserRecord[] = [
  { id: 'user-001', name: '雅青', organization: '流控所', role: '平台管理员', status: '启用', lastLogin: '2026-07-16 09:42' },
  { id: 'user-002', name: '周工', organization: '流控所', role: '应用负责人', status: '启用', lastLogin: '2026-07-15 16:18' },
  { id: 'user-003', name: '李老师', organization: '大连理工大学', role: '接入联系人', status: '启用', lastLogin: '2026-07-12 14:03' },
]

export const initialDocuments: DocumentRecord[] = [
  { id: 'doc-001', title: '应用接入总体规范', category: '接入规范', updatedAt: '2026-07-15', description: '说明应用从申请、部署、联调到上线的总体要求。' },
  { id: 'doc-002', title: '云端部署环境准备指南', category: '部署指南', updatedAt: '2026-07-12', description: '包含操作系统、运行环境、资源规格和容器化建议。' },
  { id: 'doc-003', title: '网络策略与统一认证说明', category: '网络与认证', updatedAt: '2026-07-10', description: '说明源目标地址、端口、协议与统一认证申请流程。' },
  { id: 'doc-004', title: '数据资源目录编制指南', category: '数据规范', updatedAt: '2026-07-08', description: '指导使用业务名称、来源系统、权限范围和更新方式登记数据。' },
]

export const initialHomeContent: HomeContent = {
  heroTitle: '连接工业软件与测试数据\n协同云端平台与边缘节点',
  heroDescription: '面向高端数控机床研发与测试场景，提供工业应用统一接入、数据资源管理、边缘节点协同和运行状态监测能力。',
  announcement: '典型应用接入与高校软件上云试点正在按计划推进。',
}
