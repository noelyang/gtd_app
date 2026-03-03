# GTD Focus — 极简 GTD 任务管理工具

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/gtd-focus/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/gtd-focus/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 极简、快速、隐私优先的 GTD 任务管理工具

## ✨ 特性

- 🎯 **GTD 方法论** - 完整的 Getting Things Done 工作流
- 🌓 **多主题切换** - Midnight/Dawn/Forest/Sunset/Minimal 5 套主题
- 🌐 **中英文支持** - 完整国际化
- 🔄 **WebDAV 同步** - 跨设备数据同步
- 📱 **PWA 支持** - 离线使用，添加到主屏幕
- 🔒 **隐私优先** - 数据本地存储，完全可控
- ⚡ **极速体验** - 无后端，纯前端运行

## 🚀 快速开始

### 在线使用
访问：https://YOUR_USERNAME.github.io/gtd-focus/

### 本地开发
```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/gtd-focus.git
cd gtd-focus

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080
```

### 构建部署
```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

## 📖 使用指南

### 快速添加任务
1. 在顶部输入框输入任务
2. 按回车或点击"Add"
3. 任务自动添加到收件箱

### 分类管理
- 📥 **收件箱** - 快速收集所有想法
- ✅ **下一步** - 当前可执行的任务
- 📁 **项目** - 多步骤目标
- ⏳ **等待中** - 等待外部响应
- 💭 **将来/也许** - 暂不执行的想法
- ✓ **已完成** - 已完成的任务

### WebDAV 同步
1. 点击右上角 **Sync** 按钮
2. 配置 WebDAV 服务器信息
3. 点击 **Test Connection** 测试
4. 点击 **Save Config** 保存
5. 使用 **Upload/Download** 同步数据

**支持的云服务:**
- iCloud Drive
- Nextcloud
- Synology NAS
- pCloud
- 任何标准 WebDAV 服务器

### 主题切换
1. 点击顶部 **🎨 Theme** 按钮
2. 选择喜欢的主题
3. 自动保存偏好

## 🛠️ 技术栈

- **纯前端** - HTML5 + CSS3 + Vanilla JavaScript
- **本地存储** - localStorage
- **PWA** - Web App Manifest + Service Worker
- **同步协议** - WebDAV

## 📁 项目结构

```
gtd-app/
├── index.html              # 主页面
├── manifest.json           # PWA Manifest
├── service-worker.js       # PWA Service Worker
├── package.json            # 项目配置
├── .gitignore              # Git 忽略文件
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 配置
├── research/
│   ├── 01-code-review.md
│   ├── 02-competitor-analysis.md
│   ├── 03-mobile-app-solutions.md
│   ├── 04-data-sync-solutions.md
│   └── 05-cicd-solutions.md
├── SYNC-GUIDE.md           # WebDAV 同步指南
├── SYNC-SELF-TEST.md       # 同步功能自测报告
└── README.md               # 项目说明
```

## 📊 浏览器支持

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Safari | 15+ | ✅ |
| Firefox | 88+ | ✅ |
| Edge | 90+ | ✅ |

## 🔒 隐私说明

- ✅ 所有数据存储在本地 (localStorage)
- ✅ 不收集任何用户信息
- ✅ 不追踪用户行为
- ✅ WebDAV 同步数据直接传输到你自己的云盘
- ✅ 无第三方分析工具

## 📝 更新日志

### v1.1.0 (2026-03-03)
- ✅ 添加 PWA 支持
- ✅ 配置 CI/CD 自动部署
- ✅ 优化 WebDAV 同步错误处理
- ✅ 添加移动端响应式优化

### v1.0.0 (2026-03-02)
- ✅ 完整的 GTD 工作流
- ✅ 5 套主题预设
- ✅ 中英文国际化
- ✅ WebDAV 数据同步
- ✅ 标签管理
- ✅ 搜索过滤

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🔗 链接

- [项目主页](https://YOUR_USERNAME.github.io/gtd-focus/)
- [问题反馈](https://github.com/YOUR_USERNAME/gtd-focus/issues)
- [同步指南](SYNC-GUIDE.md)

---

**Made with ❤️ by You**
# gtd_app
