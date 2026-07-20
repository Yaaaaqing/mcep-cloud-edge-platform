# MCEP高端机床云边协同应用平台

MCEP（Machine Tool Cloud-Edge Platform）是面向高端数控机床研发与测试场景的中文 Web 前端基线，用于统一登记软件成果、数据资源、边缘设备、接入实施信息和监测对象。

## 当前前端能力

- React 19、TypeScript、Vite、Tailwind CSS、React Router、Recharts 和 Lucide 图标。
- 首页、应用中心、数据中心、接入中心、边缘节点、运行监测、帮助文档、管理端八个页面。
- 六所高校软件成果台账，包含软件形态、部署、信创、数据和责任信息。
- 五步软件接入向导，自动保存草稿并导出分组 JSON 与 Markdown 清单。
- 六组边缘节点设备台账，每组包含一台计算设备和一台存储设备。
- SINUMERIK `X_BK300_1.xml` 真实数据资源：前值复原、基础统计、四组曲线预览及 XML/CSV/JSON 下载。
- Mock/HTTP 两种 DataProvider。默认使用 localStorage Mock 数据；API 不可用时不静默回退。
- localStorage schema 增量迁移、管理端编辑同步、版本与构建信息展示。
- 管理端脱敏云资源台账，支持本地私有覆盖、增删改、恢复和 JSON/Markdown 导出。
- 关于 MCEP、构建信息和关键文件 SHA-256 发布完整性校验。
- `/mcep/` 二级路径、GitHub Pages、Vercel、Netlify 和 Nginx SPA 回退配置。

页面中的 Mock、演示、待评估和待接入状态不代表生产系统实时运行结果。

## 安装与运行

建议使用 Node.js 22.13 或更高版本。

```bash
npm ci
npm run generate:trace-data
npm run lint
npm run dev
```

默认访问 `http://localhost:5173`。生产构建：

```bash
npm run build
npm run preview
```

`npm run build` 会先执行 Trace 数据生成与校验；源文件哈希、记录数、时间范围、采样周期或信号统计不符合预期时会直接失败。

正式冻结前执行：

```bash
npm run release:check
```

该命令依次执行 lint、构建、生成 `release-manifest.json` 并复算关键文件 SHA-256。清单用于版本核验，不限制后续正常开发。

## 运行配置

复制 `.env.example` 后按环境调整：

```dotenv
VITE_DATA_MODE=mock
VITE_API_BASE_URL=/mcep/api
VITE_BASE_PATH=/mcep/
VITE_APP_VERSION=V1.0
```

- 本地根路径开发可不设置 `VITE_BASE_PATH`，默认 `/`。
- 正式部署到 `https://ybxt.gt.cn/mcep/` 时使用 `/mcep/`。
- GitHub Pages workflow 会按仓库名自动设置 base path。
- `VITE_DATA_MODE=http` 仅切换前端数据提供器；本仓库不包含真实后端。

二级路径构建示例：

```bash
VITE_BASE_PATH=/mcep/ npm run build
```

## 数据访问层

```text
src/services/
├── providers/
│   ├── DataProvider.ts
│   ├── MockDataProvider.ts
│   ├── HttpDataProvider.ts
│   └── index.ts
├── runtimeConfig.ts
└── storage.ts
```

`MockDataProvider` 复用现有 localStorage 数据与迁移逻辑。`HttpDataProvider` 使用相同页面接口请求 `VITE_API_BASE_URL`；服务未配置或不可用时会在页面提示，不会用 Mock 数据伪装 API 返回。

云资源台账的受控 Mock 仅保存 `10.156.20.x` 脱敏地址。需要本机核验时，可复制 `config/private/cloud-resources.local.example.json` 为 `config/private/cloud-resources.local.json`；该私有文件已被忽略，不应提交或放入交付包。

## 项目结构

```text
MCEP-web-frontend/
├── public/
│   ├── brand/              # MCEP 品牌资源
│   ├── data/               # Trace 原始 XML 与生成的 JSON、CSV
│   ├── mock/               # CSV 演示数据
│   └── _redirects          # Netlify SPA 回退
├── scripts/                # Trace、构建信息、迁移及发布完整性脚本
├── deploy/                 # Nginx /mcep/ 配置示例
├── docs/                   # 前端交接说明
├── src/
│   ├── components/         # 公共组件
│   ├── data/               # 初始 Mock 数据
│   ├── hooks/              # 数据订阅 Hook
│   ├── pages/              # 八个路由页面
│   ├── services/           # DataProvider、配置和 localStorage
│   ├── types/              # 公共类型
│   └── utils/              # 下载工具
├── CHANGELOG.md
├── CONTRIBUTORS.md
└── .github/workflows/deploy-pages.yml
```

## 路由

| 地址 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/apps` | 应用中心 |
| `/data` | 数据中心 |
| `/access` | 接入中心 |
| `/edge` | 边缘节点 |
| `/monitor` | 运行监测 |
| `/docs` | 帮助文档 |
| `/admin` | 管理端 |

`BrowserRouter` 使用 `basename={import.meta.env.BASE_URL}`。Nginx 部署参考 `deploy/nginx-spa.conf.example`，确保 `/mcep/apps`、`/mcep/data` 等直接访问和刷新回退到 `/mcep/index.html`。

## Trace 数据说明

源文件 `public/data/raw/X_BK300_1.xml` 保持原样。`npm run generate:trace-data` 生成：

- `public/data/processed/x-bk300-1-summary.json`
- `public/data/processed/x-bk300-1-preview.json`
- `public/data/processed/x-bk300-1-normalized.csv`

脚本以 `traceData > dataFrame` 为真实数据源，对稀疏记录做前值继承。完整 CSV 保留 7,199 个时间点和 10 路信号；图表预览单独降采样，不改变原始下载数据。

## 数科公司后续工程化内容

以下能力不在本次前端交付范围内，应由数科公司基于本前端基线和 DataProvider 接口继续实施：

- 真实后端、达梦或金仓数据库与持久化接口；
- 真实 SSO、虚机申请、数据库申请和正式审批；
- 生产运行监测、边缘节点心跳、文件上传与数据同步；
- 远程启停、漏扫、安全加固和生产环境运维配置。

详见 [前端交接说明](docs/MCEP-frontend-handover.md)。

交付冻结还应使用 [发布检查清单](docs/MCEP-release-checklist.md) 和 [云资源核验台账模板](docs/cloud-resource-inventory-template.md)。
