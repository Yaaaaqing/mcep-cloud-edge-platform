# MCEP｜高端机床云边协同应用平台

面向高端机床研发与测试场景的中文 Web 前端演示项目。项目使用 Mock 数据和浏览器本地存储运行，不依赖真实后端。

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React 线性图标
- localStorage 本地持久化

## 安装与运行

需要 Node.js 22.13 或更高版本。仓库同时提供 npm 与 pnpm 锁文件，使用任一包管理器即可。

```bash
npm ci
npm run generate:trace-data
npm run dev
```

浏览器访问终端显示的本地地址，通常为 `http://localhost:5173`。

生产构建：

```bash
npm run build
npm run preview
```

使用锁文件进行可复现安装：

```bash
pnpm install --frozen-lockfile
pnpm run generate:trace-data
pnpm run build
```

`npm run build` 会在构建前再次执行 Trace 数据生成与校验；若原始 XML 的哈希、记录数、时间范围、采样周期或信号统计不符合预期，构建会直接失败并给出错误。

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
| `/admin` | 演示管理端 |

## 重点功能

- 应用、数据、边缘节点与运行状态均通过独立 Mock 文件初始化。
- `src/services/storage.ts` 是统一数据访问层，后续可在此替换为 HTTP API。
- 演示管理端支持应用、数据资源、边缘节点、接入申请、用户、首页、监测状态和文档的新增、编辑与删除。
- 演示管理端编辑保存在 localStorage，并通过统一数据变更事件同步到前台。
- 五步接入申请自动保存草稿，提交后可下载 JSON 与 Markdown 接入清单。
- 数据中心内置可下载 CSV Mock 文件，并使用 Recharts 进行折线图预览。
- 数据中心接入原始 SINUMERIK Trace XML，提供概览、信号列表、分组曲线预览以及 XML、标准化 CSV、元数据 JSON 下载。
- “恢复初始数据”可以清除本地编辑并回到初始 Mock 状态。

## 项目结构

```text
MCEP-web-frontend/
├── public/
│   ├── brand/              # MCEP Symbol 品牌资源
│   ├── data/               # 原始 Trace XML 与生成后的 JSON、CSV
│   ├── mock/               # 可下载的 CSV 演示数据
│   └── _redirects          # Netlify SPA 刷新兜底
├── scripts/                # Trace 数据解析、复原与校验脚本
├── deploy/                 # Nginx SPA 配置示例
├── .github/workflows/      # GitHub Pages 自动部署
├── src/
│   ├── components/         # Layout、Header、StatusBadge、AppCard 等公共组件
│   ├── data/               # 全部初始 Mock 数据
│   ├── hooks/              # 数据订阅 Hook
│   ├── pages/              # 路由页面
│   ├── services/           # 统一数据访问层
│   ├── types/              # 公共 TypeScript 类型
│   └── utils/              # 文件下载等工具
├── package.json
├── vercel.json             # Vercel SPA rewrite
└── vite.config.ts
```

## 数据与演示说明

当前监测状态为可编辑的 Mock 台账，不代表真实实时监控结果；规划接入应用不配置虚假业务链接；边缘节点以规划建设中、待部署和待接入状态为主。

`public/data/raw/X_BK300_1.xml` 是保留原样的源文件。运行 `npm run generate:trace-data` 会生成摘要、降采样图表预览和完整标准化 CSV；图表预览数据经过降采样，下载 CSV 保留全部 7,199 个时间点和 10 路前值复原信号。

浏览器保存键统一使用 `mcep:` 前缀。若要切换到真实后端，可保留页面和组件层，将 `src/services/storage.ts` 替换为 API 请求实现。

## SPA 部署

- GitHub Pages：仓库 `main` 分支推送后，由 `.github/workflows/deploy-pages.yml` 自动构建；首次使用需在仓库 Settings → Pages 中将 Source 设为 GitHub Actions。
- Vercel：使用项目根目录的 `vercel.json`。
- Netlify：构建结果会包含 `public/_redirects`。
- Nginx：参考 `deploy/nginx-spa.conf.example` 中的 `try_files` 配置。

项目继续使用 `BrowserRouter`。部署时必须保留上述路径回退配置，以支持 `/apps`、`/data`、`/access`、`/edge`、`/monitor` 和 `/admin` 直接访问与刷新。
