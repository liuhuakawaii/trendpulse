# TrendPulse - Project Agent Guide

> 本文件是项目的全局上下文文档。任何对项目结构、架构、技术栈的变更都必须同步更新本文件。
> 所有新的需求开发前，必须先阅读本文件以了解项目全貌。

## 项目概述

TrendPulse 是一个实时科技趋势仪表盘，部署在 Cloudflare 边缘平台上。聚合 GitHub Trending 仓库和多源 RSS 新闻，提供 AI 分析能力。

## 目录结构

```
trendpulse/
├── package.json              # 根 monorepo 编排脚本
├── AGENTS.md                 # 本文件 - 项目全局上下文
├── frontend/                 # 唯一的应用目录（前端 + Worker 一体化）
│   ├── src/                  # React 前端源码
│   │   ├── components/       # UI 组件
│   │   ├── hooks/            # React Hooks（数据获取）
│   │   ├── services/         # API 调用封装
│   │   ├── types.ts          # 前端类型定义
│   │   ├── App.tsx           # 根组件
│   │   └── main.tsx          # 入口
│   ├── worker/               # Cloudflare Worker（后端 API）
│   │   ├── index.ts          # Hono 路由入口
│   │   ├── types.ts          # Worker 类型定义
│   │   ├── routes/           # API 路由处理
│   │   └── services/         # 外部服务集成
│   ├── wrangler.jsonc        # Cloudflare 部署配置
│   ├── vite.config.ts        # Vite 构建配置
│   └── package.json          # 前端依赖
```

## 技术栈

| 层级 | 技术 | 版本 |
|---|---|---|
| 前端框架 | React | 19.2.6 |
| 构建工具 | Vite | 8.0.12 |
| CSS 框架 | TailwindCSS | 4.3.0 |
| 语言 | TypeScript | 6.0.2 |
| 后端框架 | Hono | 4.12.23 |
| 运行时 | Cloudflare Workers | Wrangler 4.95.0 |
| 部署 | Cloudflare Pages + Workers（统一） | — |
| 数据库 | 无 | — |

## 架构设计

### 部署模型

单一 Cloudflare Pages 应用，SPA + Worker 统一部署。`wrangler.jsonc` 配置 `run_worker_first: ["/api/*"]`：
- `/api/*` 请求 → Hono Worker 处理
- 其他请求 → 静态 SPA 资源

### 两大功能模块

**1. 统一 Feed（GitHub + RSS 新闻）**
- GitHub Trending 作为 Feed 的一个分类标签（`github`），与其他 9 个新闻分类并列
- GitHub 数据：`/api/github/trending`，抓取 `github.com/trending` HTML，正则解析 Top 10 仓库
- RSS 数据：`/api/news/:category`，9 个分类（tech/aiml/programming/business/science/gaming/finance/world/health）
- 前端统一 Feed 组件，根据分类类型渲染 RepoCard 或 NewsCard
- 文件：`frontend/worker/services/github.ts`、`frontend/worker/services/rss.ts` → `frontend/worker/routes/github.ts`、`frontend/worker/routes/news.ts`

**2. AI 分析（`POST /api/ai/explain`，SSE 流式响应）**
- 11 个分类：github、aiml-topic、showhn、tech、programming、business、science、gaming、finance、world、health
- GitHub 数据：Trending（`/trending`）、ML/AI Topic Repos（`/topics/machine-learning`）、Show HN（HN RSS 过滤 GitHub 链接）
- RSS 数据：9 个新闻分类，每类 2-3 个源（HN、TechCrunch、The Verge、MIT Tech Review、dev.to、IGN、CoinDesk、BBC、Reuters 等）
- 正则解析 XML，支持 RSS 2.0 `<item>` 和 Atom `<entry>`，处理 CDATA
- 返回按时间排序的 Top 20 条目
- 文件：`frontend/worker/services/rss.ts` → `frontend/worker/routes/news.ts`

**2. AI 分析（`POST /api/ai/explain`，SSE 流式响应）**
- 支持三种 AI 提供商：Claude（Anthropic）、OpenAI、自定义端点
- 用户 API Key 从前端 localStorage 读取，每次请求时传递给 Worker
- 使用 Server-Sent Events 实时流式返回分析结果
- AI 输出语言：中文
- 文件：`frontend/worker/services/ai-provider.ts` → `frontend/worker/routes/ai.ts`

### 前端结构

- 深色/浅色主题切换（CSS custom properties + data-theme attribute，localStorage 持久化）
- 色彩系统：CSS 变量驱动（--bg-primary, --text-primary, --border 等），emerald 强调色
- 字体：Inter + JetBrains Mono（CDN 引入）
- 统一 Feed 组件：10 个分类标签页（GitHub + 9 个新闻分类），根据分类动态渲染 RepoCard 或 NewsCard
- 每张卡片可触发 AI 分析，结果在模态面板中流式展示
- 设置面板：配置 AI 提供商、API Key、模型（localStorage 持久化）
- 自定义 Hooks：`useNews`（统一 Feed 数据获取）、`useAI`、`useTheme`
- 动画：CSS 弹性过渡（cubic-bezier 0.16,1,0.3,1），shimmer 骨架屏，fade-in 入场

## 数据流

```
用户浏览器
  │
  ├─ GET /api/github/trending ──→ Worker 抓取 GitHub HTML → 返回 JSON（Feed: GitHub 分类）
  ├─ GET /api/news/:category  ──→ Worker 抓取 RSS 源    → 返回 JSON（Feed: 9 个新闻分类）
  └─ POST /api/ai/explain     ──→ Worker 转发到 LLM API → SSE 流式返回
```

无数据库，无缓存层，所有数据实时获取。

## 类型定义

前后端分别维护类型（`frontend/src/types.ts` 和 `frontend/worker/types.ts`），共享接口包括：
- `TrendingRepo`：GitHub 仓库信息
- `NewsItem`：新闻条目

Worker 独有：`AIProvider`、`AIExplainRequest`
Frontend 独有：`AIConfig`、`NEWS_CATEGORIES`、`AI_MODELS`

## 开发命令

```bash
# 根目录（快捷脚本，均指向 frontend）
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run deploy   # 构建 + 部署到 Cloudflare

# frontend 目录（等效）
npm run dev
npm run build
npm run deploy
```

## 已知限制

- **无测试**：项目无任何测试文件、测试框架或测试配置
- **无认证**：无用户系统，AI API Key 仅存于 localStorage
- **无缓存**：每次请求实时抓取外部源
- **类型重复**：前后端类型定义有重叠，未抽取共享包

## 变更规则

1. **任何结构性变更**（新增/删除目录、修改部署配置、更改技术栈）必须同步更新本 AGENTS.md
2. **新增 API 端点**必须在"三大功能模块"章节中记录
3. **修改类型定义**必须检查前后端一致性
4. **新增外部依赖**必须在技术栈表格中更新
