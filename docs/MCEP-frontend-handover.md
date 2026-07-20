# MCEP高端机床云边协同应用平台前端交接说明

## 1. 交付范围

本仓库交付 MCEP高端机床云边协同应用平台 V1.0 前端基线，包含八个业务页面、统一组件、Mock 数据、localStorage 管理端、五步接入清单、脱敏云资源台账、SINUMERIK Trace 数据预处理与 `/mcep/` 子路径部署配置。

## 2. 数据模式

- `VITE_DATA_MODE=mock`：默认模式。读取 `src/data` 初始数据，用户编辑保存到浏览器 localStorage。
- `VITE_DATA_MODE=http`：调用 `VITE_API_BASE_URL` 下与 DataProvider 对应的资源接口。接口不可用时页面明确提示“服务不可用”，不会静默回退到 Mock。
- localStorage 数据使用 `mcep:` 前缀和独立 schema 版本迁移，升级时补充字段并保留可识别的用户编辑记录。
- 云资源公开台账只使用脱敏 IP；如需在本机覆盖，可从 `config/private/cloud-resources.local.example.json` 创建被忽略的 `cloud-resources.local.json`。

## 3. 构建与部署

```bash
npm ci
npm run generate:trace-data
npm run lint
VITE_BASE_PATH=/mcep/ npm run build
npm run release:check
npm run preview
```

正式静态文件部署到 `/var/www/html/mcep/`，Nginx 使用 `deploy/nginx-spa.conf.example`。`BrowserRouter` 的 basename 读取 `import.meta.env.BASE_URL`，因此 `/mcep/apps` 等直接访问与刷新会回退到 `/mcep/index.html`。

## 4. Trace 数据

原始文件位于 `public/data/raw/X_BK300_1.xml`，生成脚本位于 `scripts/generate-sinumerik-trace-data.mjs`。构建前会重新校验 SHA-256、10 路信号、7,199 条记录、0.002 秒采样周期、14.396 秒持续时间与前值继承统计。不要修改源文件或在 React 渲染时重新解析完整 XML。

## 5. 后续工程化边界

数科公司后续可基于 DataProvider 接口建设真实 API、达梦或金仓数据库、SSO、虚机与数据库申请、生产监测、边缘心跳、文件上传、数据同步、漏扫和生产环境配置。本前端没有实现这些能力，也不应把示例数据台账解释为生产运行结果。

## 6. 发布完整性

`npm run release:manifest` 为关键文件生成 SHA-256 清单，`npm run release:verify` 复算并报告缺失或变化文件。`npm run release:check` 依次执行 lint、构建、清单生成和复算；清单是冻结辅助工具，不会阻止后续正常修改。

## 7. 发布检查

- 执行 `npm run lint` 与 `npm run build`。
- 检查八个路由和 `/mcep/` 子路径。
- 检查 Trace 四组曲线及 XML、CSV、JSON 下载。
- 验证清空 localStorage 后恢复新版初始数据，旧 schema 数据可增量迁移。
- 确认页面数据模式、待接入状态与演示状态标识清晰。
- 按 `docs/MCEP-release-checklist.md` 完成人工复核，并在最终冻结后重新生成 `release-manifest.json`。
