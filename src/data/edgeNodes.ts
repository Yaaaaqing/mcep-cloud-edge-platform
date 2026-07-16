import type { EdgeNode } from '../types'

export const initialEdgeNodes: EdgeNode[] = [
  { id: 'edge-001', code: 'MCEP-EDGE-001', name: '装配试验区边缘节点', organization: '流控所', machine: '装配质量试验台', os: 'Ubuntu Server（规划）', protocol: 'OPC UA / HTTPS', ip: '待分配', status: '待部署', lastSeen: '尚未部署', note: '已完成硬件资源申请，待现场部署。' },
  { id: 'edge-002', code: 'MCEP-EDGE-002', name: '主轴试验区边缘节点', organization: '流控所', machine: '主轴性能试验台', os: 'Ubuntu Server（规划）', protocol: 'MQTT / HTTPS', ip: '待分配', status: '待接入', lastSeen: '尚未接入', note: '节点基础环境已准备，待网络策略确认。' },
  { id: 'edge-003', code: 'MCEP-EDGE-003', name: '高校试点边缘节点', organization: '大连理工大学', machine: '科研试验设备（待确认）', os: '待确认', protocol: '待确认', ip: '待分配', status: '规划建设中', lastSeen: '尚未建设', note: '随软件上云试点同步规划。' },
  { id: 'edge-004', code: 'MCEP-EDGE-004', name: '进给系统试验区节点', organization: '数科公司', machine: '进给系统测试台', os: '待确认', protocol: 'OPC UA（拟）', ip: '待分配', status: '规划建设中', lastSeen: '尚未建设', note: '已纳入后续建设台账。' },
]
