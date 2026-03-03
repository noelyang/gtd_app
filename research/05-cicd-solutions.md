# GTD Focus CI/CD 持续集成部署方案

**日期:** 2026-03-03  
**目标:** 建立自动化构建、测试、部署流程

---

## 📊 方案总览

| 方案 | 平台 | 成本 | 复杂度 | 推荐度 |
|------|------|------|--------|--------|
| **GitHub Pages + Actions** | GitHub | ¥0 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Vercel** | Vercel | ¥0 | ⭐ | ⭐⭐⭐⭐⭐ |
| **Netlify** | Netlify | ¥0 | ⭐ | ⭐⭐⭐⭐⭐ |
| **Cloudflare Pages** | Cloudflare | ¥0 | ⭐⭐ | ⭐⭐⭐⭐ |
| **自建服务器** | VPS | ¥50/月 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 方案一：GitHub Pages + Actions ⭐⭐⭐⭐⭐

### 概述
使用 GitHub 原生服务，代码推送后自动构建部署到 GitHub Pages。

### 优点
- ✅ **完全免费** - GitHub 免费账户即可
- ✅ **无缝集成** - 与 GitHub 深度集成
- ✅ **简单易用** - 配置简单，文档完善
- ✅ **自定义域名** - 支持绑定域名
- ✅ **HTTPS** - 自动 SSL 证书

### 缺点
- ⚠️ **构建时间** - 免费账户 500MB/月存储，2000 分钟/月构建
- ⚠️ **单页应用** - 需配置路由重定向

### 工作流程
```
代码推送 → GitHub Actions → 构建 → 部署到 GitHub Pages
    ↓
  自动测试
    ↓
  生成报告
```

### 实现步骤

#### 1. 创建 GitHub 仓库
```bash
cd /Users/Noel/.openclaw/workspace/gtd-app
git init
git remote add origin https://github.com/yourname/gtd-focus.git
git branch -M main
```

#### 2. 创建 GitHub Actions 工作流
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run lint
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v4
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        enable_jekyll: false
```

#### 3. 创建 package.json
```json
{
  "name": "gtd-focus",
  "version": "1.0.0",
  "description": "极简 GTD 任务管理工具",
  "scripts": {
    "build": "npm run build:html && npm run build:pwa",
    "build:html": "cp index.html dist/",
    "build:pwa": "cp manifest.json service-worker.js dist/",
    "test": "echo \"Running tests...\" && exit 0",
    "lint": "echo \"Linting...\" && exit 0",
    "dev": "npx http-server -p 8080"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/gtd-focus.git"
  }
}
```

#### 4. 配置 GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 保存后自动获取部署 URL

### 部署流程
```bash
# 日常开发
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions 自动执行:
# 1. 运行测试
# 2. 构建项目
# 3. 部署到 GitHub Pages
# 4. 更新网站
```

### 成本
- **存储:** 500MB (免费)
- **带宽:** 100GB/月 (免费)
- **构建时间:** 2000 分钟/月 (免费)
- **足够:** 个人项目完全够用

---

## 🎯 方案二：Vercel ⭐⭐⭐⭐⭐

### 概述
Vercel 是专为前端设计的部署平台，零配置部署。

### 优点
- ✅ **零配置** - 连接 GitHub 后自动部署
- ✅ **预览部署** - 每个 PR 生成预览链接
- ✅ **自动 HTTPS** - 自动 SSL
- ✅ **全球 CDN** - 快速访问
- ✅ **自定义域名** - 免费绑定

### 缺点
- ⚠️ **带宽限制** - 100GB/月 (免费)
- ⚠️ **构建限制** - 6000 分钟/月 (免费)

### 工作流程
```
GitHub 推送 → Vercel 检测 → 自动构建 → 全球 CDN 部署
```

### 实现步骤

#### 1. 注册 Vercel
访问 https://vercel.com/signup
使用 GitHub 账号登录

#### 2. 导入项目
1. 点击 "Add New Project"
2. 选择 GitHub 仓库
3. 点击 "Deploy"

#### 3. 配置 (可选)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 自动部署
```bash
# 推送到 main 分支 → 生产环境
git push origin main

# 推送到其他分支 → 预览环境
git checkout -b feature/new-feature
git push origin feature/new-feature
# 自动生成预览链接
```

### 成本
- **带宽:** 100GB/月
- **构建:** 6000 分钟/月
- **域名:** 免费绑定
- **足够:** 个人项目完全够用

---

## 🎯 方案三：Netlify ⭐⭐⭐⭐⭐

### 概述
Netlify 是另一个流行的前端部署平台，功能与 Vercel 类似。

### 优点
- ✅ **零配置** - 自动检测构建
- ✅ **表单处理** - 内置表单支持
- ✅ **函数支持** - Serverless Functions
- ✅ **预览部署** - PR 预览
- ✅ **自定义域名**

### 缺点
- ⚠️ **带宽限制:** 100GB/月
- ⚠️ **构建限制:** 300 分钟/月

### 工作流程
```
GitHub 推送 → Netlify 检测 → 自动构建 → 部署
```

### 实现步骤

#### 1. 注册 Netlify
访问 https://app.netlify.com/signup

#### 2. 创建 netlify.toml
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 3. 部署
```bash
# 方法 1: Git 集成
# 连接 GitHub 后自动部署

# 方法 2: CLI 部署
npm install -g netlify-cli
netlify deploy --prod
```

### 成本
- **带宽:** 100GB/月
- **构建:** 300 分钟/月
- **足够:** 小型项目够用

---

## 🎯 方案四：Cloudflare Pages ⭐⭐⭐⭐

### 概述
Cloudflare 提供的静态站点托管服务，依托 Cloudflare 全球网络。

### 优点
- ✅ **无限带宽** - 真正无限
- ✅ **无限请求** - 无请求数限制
- ✅ **快速** - Cloudflare CDN
- ✅ **免费** - 免费额度充足

### 缺点
- ⚠️ **构建限制:** 500 次/月
- ⚠️ **知名度:** 相对较新

### 实现步骤

#### 1. 注册 Cloudflare
访问 https://dash.cloudflare.com/sign-up

#### 2. 创建 Pages 项目
1. 进入 Pages → Create a project
2. 连接 GitHub
3. 选择仓库
4. 配置构建设置

#### 3. 配置
```toml
# wrangler.toml
name = "gtd-focus"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

### 成本
- **带宽:** 无限
- **构建:** 500 次/月
- **足够:** 完全够用

---

## 🎯 方案五：自建服务器 ⭐⭐⭐

### 概述
使用 VPS 自建 CI/CD 流程，完全自控。

### 优点
- ✅ **完全控制** - 所有配置自己决定
- ✅ **无限制** - 不受平台限制
- ✅ **学习价值** - 学习 DevOps

### 缺点
- ❌ **成本高** - VPS 费用 + 维护成本
- ❌ **复杂度高** - 需要配置所有内容
- ❌ **维护成本** - 需要自己维护

### 技术栈
- **服务器:** Ubuntu 22.04 LTS
- **Web 服务器:** Nginx
- **CI/CD:** Jenkins / GitLab CI
- **域名:** 自己的域名
- **SSL:** Let's Encrypt

### 成本
- **VPS:** ¥50-200/月
- **域名:** ¥50-100/年
- **时间:** 配置 + 维护

---

## 📊 方案对比总结

| 维度 | GitHub Pages | Vercel | Netlify | Cloudflare | 自建 |
|------|-------------|--------|---------|------------|------|
| 成本 | ¥0 | ¥0 | ¥0 | ¥0 | ¥100/月 |
| 配置难度 | ⭐⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 构建时间 | 2000 分/月 | 6000 分/月 | 300 分/月 | 500 次/月 | 无限 |
| 带宽 | 100GB/月 | 100GB/月 | 100GB/月 | 无限 | 取决于 VPS |
| CDN | GitHub | 全球 | 全球 | 全球 | 自己配置 |
| 预览部署 | ❌ | ✅ | ✅ | ✅ | 需配置 |
| 自定义域名 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 推荐方案

### 首选：GitHub Pages + Actions ⭐⭐⭐⭐⭐

**理由:**
1. **完全免费** - 个人项目零成本
2. **GitHub 原生** - 与代码托管无缝集成
3. **简单可靠** - 配置简单，GitHub 背书
4. **足够使用** - 免费额度充足

**适用场景:**
- 开源项目
- 个人项目
- 小型团队项目

### 备选：Vercel ⭐⭐⭐⭐⭐

**理由:**
1. **零配置** - 最简单的部署流程
2. **预览部署** - PR 自动生成预览
3. **快速** - 全球 CDN

**适用场景:**
- 需要快速迭代
- 需要预览功能
- 团队项目

---

## 🚀 推荐实施流程

### 阶段一：GitHub Pages (立即实施)

#### 准备工作
```bash
# 1. 创建 GitHub 仓库
# 访问 https://github.com/new
# 仓库名：gtd-focus

# 2. 初始化本地仓库
cd /Users/Noel/.openclaw/workspace/gtd-app
git init
git remote add origin https://github.com/YOUR_USERNAME/gtd-focus.git
```

#### 创建必要文件
```bash
# 项目结构
gtd-app/
├── index.html          # 主页面
├── manifest.json       # PWA manifest (待创建)
├── service-worker.js   # PWA service worker (待创建)
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 配置
├── package.json        # 项目配置
└── README.md           # 项目说明
```

#### 创建 GitHub Actions 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Pages
      uses: actions/configure-pages@v4
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

#### 首次部署
```bash
git add .
git commit -m "Initial commit: GTD Focus v1.0"
git push -u origin main
```

#### 配置 GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待部署完成
4. 访问 `https://YOUR_USERNAME.github.io/gtd-focus/`

### 阶段二：PWA 支持 (本周内)
- [ ] 创建 manifest.json
- [ ] 创建 service-worker.js
- [ ] 添加 PWA 相关 meta 标签
- [ ] 测试离线功能
- [ ] 测试"添加到主屏幕"

### 阶段三：自动化增强 (可选)
- [ ] 添加自动测试
- [ ] 添加代码检查
- [ ] 添加版本管理
- [ ] 添加 Release Notes 自动生成

---

## 📋 详细实施清单

### GitHub 仓库设置
- [ ] 创建 GitHub 账号 (如无)
- [ ] 创建公开/私有仓库
- [ ] 添加 README.md
- [ ] 添加 .gitignore
- [ ] 添加 LICENSE

### 本地配置
- [ ] 初始化 git 仓库
- [ ] 添加 remote
- [ ] 创建 package.json
- [ ] 创建 .github/workflows/deploy.yml

### 部署配置
- [ ] 配置 GitHub Pages
- [ ] 配置自定义域名 (可选)
- [ ] 配置 SSL (自动)

### 测试验证
- [ ] 推送代码触发部署
- [ ] 检查 Actions 日志
- [ ] 访问部署后的网站
- [ ] 测试所有功能

### 持续集成
- [ ] 添加自动化测试
- [ ] 添加代码检查
- [ ] 添加构建验证

---

## 💰 成本估算

### GitHub Pages 方案
- **开发:** 现有团队
- **托管:** ¥0 (GitHub Pages)
- **域名:** ¥0 (github.io 子域名) 或 ¥50-100/年 (自定义域名)
- **SSL:** ¥0 (自动)
- **总计:** ¥0/年 (使用 github.io)

### Vercel 方案
- **开发:** 现有团队
- **托管:** ¥0 (Hobby 计划)
- **域名:** ¥0 (vercel.app 子域名) 或 ¥50-100/年 (自定义域名)
- **SSL:** ¥0 (自动)
- **总计:** ¥0/年 (使用 vercel.app)

---

## ⚠️ 注意事项

### 安全
1. **不要提交敏感信息** - API 密钥、密码等
2. **使用 GitHub Secrets** - 存储敏感配置
3. **启用双因素认证** - GitHub 账号安全

### 性能
1. **启用缓存** - 静态资源缓存
2. **压缩资源** - HTML/CSS/JS压缩
3. **使用 CDN** - 全球加速

### 维护
1. **定期更新依赖** - 安全补丁
2. **监控部署状态** - GitHub Actions 通知
3. **备份数据** - 定期导出代码

---

## 🎯 结论

**推荐方案：GitHub Pages + Actions**

- 零成本启动
- 配置简单
- 与 GitHub 深度集成
- 足够个人项目使用

**实施顺序:**
1. 今天：创建仓库，配置 Actions
2. 本周：添加 PWA 支持
3. 后续：根据需求优化

---

*报告完成时间：2026-03-03 16:50*
