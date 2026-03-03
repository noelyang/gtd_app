# GTD Focus 跨端数据同步方案

**日期:** 2026-03-02  
**需求:** 在手机、平板、电脑等多设备间同步任务数据

---

## 📊 方案总览

| 方案 | 类型 | 成本 | 复杂度 | 实时性 | 推荐度 |
|------|------|------|--------|--------|--------|
| **WebDAV** | 自建存储 | ⭐ | ⭐⭐⭐ | 手动 | ⭐⭐⭐⭐⭐ |
| **GitHub Gist** | Git 同步 | ⭐ | ⭐⭐ | 手动 | ⭐⭐⭐⭐⭐ |
| **iCloud/Dropbox** | 云盘同步 | ⭐⭐ | ⭐⭐ | 自动 | ⭐⭐⭐⭐ |
| **Firebase** | 后端即服务 | ⭐⭐ | ⭐⭐⭐ | 实时 | ⭐⭐⭐⭐ |
| **Supabase** | 开源后端 | ⭐⭐ | ⭐⭐⭐ | 实时 | ⭐⭐⭐⭐ |
| **自建服务器** | 完全自控 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 实时 | ⭐⭐⭐ |

---

## 🎯 方案一：WebDAV ⭐⭐⭐⭐⭐

### 概述
使用 WebDAV 协议将数据同步到任意 WebDAV 服务器 (NAS、iCloud Drive、Nextcloud 等)。

### 工作原理
```
设备 A → 导出数据 → WebDAV 服务器 → 设备 B 导入
```

### 优点
- ✅ **用户数据自主** - 数据存储在自己控制的服务器
- ✅ **零服务器成本** - 利用现有云存储
- ✅ **隐私安全** - 端到端加密可选
- ✅ **跨平台** - iOS/Android/Windows/Mac/Linux 都支持
- ✅ **离线优先** - 本地 localStorage + 手动同步

### 缺点
- ❌ **非实时** - 需要手动触发同步
- ❌ **冲突处理** - 多设备同时修改需解决冲突
- ❌ **用户配置** - 需要用户设置 WebDAV 账号

### 支持的服务商
| 服务商 | 免费额度 | 备注 |
|--------|----------|------|
| iCloud Drive | 5GB | Apple 原生支持 |
| Nextcloud | 自建 | 开源私有云 |
| Synology NAS | 自建 | 私有部署 |
| pCloud | 10GB | 终身免费 |
| box.com | 10GB | 企业友好 |

### 技术实现

#### 1. WebDAV 客户端库
```javascript
// 使用 webdav.js
import { createClient, getPatcher } from 'webdav';

// 创建客户端
const client = createClient(
  'https://dav.example.com',
  { username: 'user', password: 'pass' }
);
```

#### 2. 数据导出
```javascript
async function exportToWebDAV() {
  const data = localStorage.getItem('gtd-tasks');
  const backup = {
    version: 1,
    timestamp: Date.now(),
    data: JSON.parse(data)
  };
  
  await client.putFileContents(
    '/gtd-focus/backup.json',
    JSON.stringify(backup, null, 2)
  );
  
  showToast('同步成功');
}
```

#### 3. 数据导入
```javascript
async function importFromWebDAV() {
  const content = await client.getFileContents('/gtd-focus/backup.json', {
    format: 'text'
  });
  
  const backup = JSON.parse(content);
  
  // 冲突检测
  const localData = localStorage.getItem('gtd-tasks');
  const localTime = JSON.parse(localData)?.updatedAt || 0;
  
  if (backup.timestamp > localTime) {
    if (confirm('发现更新的数据，是否覆盖本地数据？')) {
      localStorage.setItem('gtd-tasks', JSON.stringify(backup.data));
      location.reload();
    }
  } else {
    showToast('本地数据已是最新');
  }
}
```

#### 4. 冲突解决策略
```javascript
// 最后修改获胜 (Last Write Wins)
function resolveConflict(local, remote) {
  if (remote.timestamp > local.timestamp) {
    return remote; // 使用远程数据
  } else if (local.timestamp > remote.timestamp) {
    return local; // 保留本地数据
  } else {
    // 时间戳相同，合并数据
    return mergeData(local, remote);
  }
}

// 智能合并
function mergeData(local, remote) {
  const localMap = new Map(local.data.map(t => [t.id, t]));
  const remoteMap = new Map(remote.data.map(t => [t.id, t]));
  
  // 合并所有任务
  const merged = [...local.data];
  remote.data.forEach(task => {
    if (!localMap.has(task.id)) {
      merged.push(task); // 新增任务
    } else if (task.updatedAt > localMap.get(task.id).updatedAt) {
      const index = merged.findIndex(t => t.id === task.id);
      merged[index] = task; // 更新修改
    }
  });
  
  return { data: merged, timestamp: Date.now() };
}
```

### 工作量
- **时间:** 1-2 天
- **成本:** ¥0 (利用现有云存储)
- **风险:** 低

---

## 🎯 方案二：GitHub Gist ⭐⭐⭐⭐⭐

### 概述
使用 GitHub Gist 作为免费的数据同步后端，通过 GitHub API 读写数据。

### 优点
- ✅ **完全免费** - GitHub 免费账户即可
- ✅ **版本历史** - 自动保存历史版本，可回滚
- ✅ **API 简单** - GitHub API 文档完善
- ✅ **开发者友好** - 适合技术用户
- ✅ **自动备份** - 数据存储在 GitHub

### 缺点
- ❌ **需要 GitHub 账号** - 非技术用户门槛高
- ❌ **网络限制** - 国内访问不稳定
- ❌ **非实时** - 需要手动同步
- ❌ **公开风险** - 默认 Gist 公开 (需使用 Secret Gist)

### 技术实现

#### 1. GitHub OAuth 认证
```javascript
// 引导用户授权
const GITHUB_CLIENT_ID = 'your_client_id';
const redirectUri = 'https://your-app.com/callback';

const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=gist`;
window.open(authUrl, '_blank');
```

#### 2. 获取 Access Token
```javascript
// 回调页面处理
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

const response = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: GITHUB_CLIENT_ID,
    client_secret: 'your_client_secret',
    code: code
  })
});

const data = await response.json();
const accessToken = data.access_token;
localStorage.setItem('github_token', accessToken);
```

#### 3. 创建/更新 Gist
```javascript
const GIST_ID = 'your_gist_id'; // 首次创建后保存

async function syncToGist() {
  const token = localStorage.getItem('github_token');
  const data = localStorage.getItem('gtd-tasks');
  
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'gtd-backup.json': {
          content: JSON.stringify({
            version: 1,
            timestamp: Date.now(),
            data: JSON.parse(data)
          }, null, 2)
        }
      }
    })
  });
  
  if (response.ok) {
    showToast('同步成功');
  }
}
```

#### 4. 从 Gist 恢复
```javascript
async function syncFromGist() {
  const token = localStorage.getItem('github_token');
  
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: { 'Authorization': `token ${token}` }
  });
  
  const gist = await response.json();
  const content = JSON.parse(gist.files['gtd-backup.json'].content);
  
  // 冲突检测逻辑同 WebDAV
  // ...
}
```

### 工作量
- **时间:** 1-2 天
- **成本:** ¥0
- **风险:** 低 (需妥善保管 Token)

---

## 🎯 方案三：iCloud/Dropbox 云盘同步 ⭐⭐⭐⭐

### 概述
利用 iCloud Drive 或 Dropbox 的文件同步功能，自动备份数据文件。

### 优点
- ✅ **自动同步** - 云盘客户端自动处理
- ✅ **用户熟悉** - 无需学习成本
- ✅ **多平台** - 所有主流云盘都支持
- ✅ **版本历史** - 大部分云盘支持历史版本

### 缺点
- ❌ **文件系统访问** - Web 应用访问受限
- ❌ **iOS 限制** - Safari 无法直接访问 iCloud Drive
- ❌ **需要原生壳** - 最好配合 Capacitor 使用

### 技术实现 (配合 Capacitor)

#### 1. 使用 Capacitor Filesystem
```javascript
import { Filesystem, Directory } from '@capacitor/filesystem';

// 保存到 iCloud Drive (iOS) / Documents (Android)
async function saveToCloud() {
  const data = localStorage.getItem('gtd-tasks');
  
  await Filesystem.writeFile({
    path: 'gtd-backup.json',
    data: data,
    directory: Directory.Documents
  });
  
  // iOS: 文件自动同步到 iCloud
  // Android: 文件在 Documents 文件夹，可被云盘同步
}
```

#### 2. 读取备份
```javascript
async function loadFromCloud() {
  try {
    const file = await Filesystem.readFile({
      path: 'gtd-backup.json',
      directory: Directory.Documents
    });
    
    const data = file.data;
    localStorage.setItem('gtd-tasks', data);
    location.reload();
  } catch (e) {
    console.log('无云端备份');
  }
}
```

### 工作量
- **时间:** 需配合 Capacitor (2-3 天)
- **成本:** 云盘费用 (如有)
- **风险:** 中 (平台限制)

---

## 🎯 方案四：Firebase Realtime Database ⭐⭐⭐⭐

### 概述
使用 Firebase 的实时数据库，实现多设备实时同步。

### 优点
- ✅ **实时同步** - 毫秒级同步
- ✅ **离线支持** - 自动处理离线队列
- ✅ **冲突解决** - 内置冲突处理
- ✅ **免费额度** - 足够个人使用
- ✅ **无需后端** - 前端直接调用

### 缺点
- ❌ **依赖 Google** - 国内访问问题
- ❌ **数据结构** - 需要适配 NoSQL 结构
- ❌ **厂商锁定** - 迁移成本高

### 免费额度
- **存储:** 1GB
- **下载:** 10GB/月
- **连接:** 100 个并发
- **足够:** 1000+ 用户使用

### 技术实现

#### 1. 初始化 Firebase
```javascript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "gtd-focus.firebaseapp.com",
  databaseURL: "https://gtd-focus.firebaseio.com",
  projectId: "gtd-focus"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
```

#### 2. 用户认证 (匿名)
```javascript
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth();
const user = await signInAnonymously(auth);
const userId = user.user.uid; // 唯一用户 ID
```

#### 3. 数据同步
```javascript
// 保存数据
function saveData(data) {
  const userId = auth.currentUser.uid;
  set(ref(db, `users/${userId}/tasks`), {
    data: data,
    updatedAt: Date.now()
  });
}

// 监听变化
function syncData() {
  const userId = auth.currentUser.uid;
  const tasksRef = ref(db, `users/${userId}/tasks`);
  
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      localStorage.setItem('gtd-tasks', JSON.stringify(data.data));
      app.render();
    }
  });
}
```

### 工作量
- **时间:** 2-3 天
- **成本:** ¥0 (免费额度内)
- **风险:** 中 (国内访问)

---

## 🎯 方案五：Supabase ⭐⭐⭐⭐

### 概述
开源的 Firebase 替代品，基于 PostgreSQL，提供实时订阅功能。

### 优点
- ✅ **开源** - 无厂商锁定
- ✅ **SQL 数据库** - 数据结构清晰
- ✅ **实时订阅** - 类似 Firebase
- ✅ **国内友好** - 可自建或选亚洲节点
- ✅ **免费额度** - 500MB 数据库

### 缺点
- ❌ **需要配置** - 比 Firebase 复杂
- ❌ **学习成本** - 需要了解 SQL

### 技术实现

#### 1. 初始化 Supabase
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xxx.supabase.co',
  'your-anon-key'
);
```

#### 2. 数据表结构
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. 实时同步
```javascript
// 保存数据
async function saveTasks(data) {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase
    .from('tasks')
    .upsert({
      user_id: user.id,
      data: data,
      updated_at: new Date()
    });
}

// 订阅变化
supabase
  .channel('tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    payload => {
      localStorage.setItem('gtd-tasks', JSON.stringify(payload.new.data));
      app.render();
    }
  )
  .subscribe();
```

### 工作量
- **时间:** 2-3 天
- **成本:** ¥0 (免费额度内)
- **风险:** 低

---

## 🎯 方案六：自建同步服务器 ⭐⭐⭐

### 概述
完全自控的同步服务器，使用 Node.js + MongoDB/PostgreSQL。

### 优点
- ✅ **完全自控** - 数据在自己服务器
- ✅ **灵活定制** - 可实现任何功能
- ✅ **无厂商限制** - 不受第三方约束

### 缺点
- ❌ **成本高** - 服务器费用 + 维护成本
- ❌ **复杂度高** - 需要后端开发能力
- ❌ **安全责任** - 需要自己负责数据安全

### 技术栈
- **后端:** Node.js + Express
- **数据库:** MongoDB / PostgreSQL
- **认证:** JWT
- **部署:** Vercel / Railway / 自有服务器

### 工作量
- **时间:** 1-2 周
- **成本:** ¥50-200/月 (服务器)
- **风险:** 高

---

## 📊 方案对比总结

| 维度 | WebDAV | GitHub | iCloud | Firebase | Supabase | 自建 |
|------|--------|--------|--------|----------|----------|------|
| 开发时间 | 2d | 2d | 3d | 3d | 3d | 2w |
| 成本 | ¥0 | ¥0 | ¥0 | ¥0 | ¥0 | ¥100/月 |
| 实时性 | 手动 | 手动 | 自动 | 实时 | 实时 | 实时 |
| 易用性 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 隐私性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 国内访问 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 推荐方案

### 首选：WebDAV ⭐⭐⭐⭐⭐

**理由:**
1. **用户数据自主** - 符合产品定位 (隐私优先)
2. **零成本** - 利用现有云存储
3. **技术简单** - 1-2 天可完成
4. **跨平台** - 所有设备都支持
5. **离线优先** - 与现有架构完美契合

**适用场景:**
- 技术用户 (会配置 WebDAV)
- 隐私敏感用户
- 已有 NAS/私有云用户

### 备选：Supabase ⭐⭐⭐⭐

**理由:**
1. **实时同步** - 更好的用户体验
2. **开源** - 无厂商锁定
3. **免费** - 个人使用足够
4. **国内可用** - 选择亚洲节点

**适用场景:**
- 需要实时同步
- 非技术用户
- 多设备频繁切换

---

## 🚀 实施建议

### 阶段一：WebDAV (立即实施)
**时间:** 2 天  
**目标:** 实现基础同步功能

**功能:**
- WebDAV 配置界面
- 手动同步按钮
- 冲突检测与解决
- 本地备份

### 阶段二：Supabase (可选)
**时间:** 3 天  
**目标:** 提供实时同步选项

**功能:**
- 匿名/邮箱登录
- 实时数据同步
- 离线队列
- 多设备管理

### 阶段三：导出/导入 (辅助)
**时间:** 半天  
**目标:** 兜底方案

**功能:**
- JSON 导出/导入
- 定期自动备份
- 邮件发送备份

---

## 📋 WebDAV 实施清单

### 前端工作
- [ ] WebDAV 配置模态框
- [ ] 服务器地址输入
- [ ] 账号密码输入
- [ ] 连接测试功能
- [ ] 同步按钮 (上传/下载)
- [ ] 冲突提示对话框
- [ ] 同步状态显示
- [ ] 自动备份选项

### 技术工作
- [ ] 集成 webdav.js 库
- [ ] 实现数据序列化
- [ ] 实现冲突检测
- [ ] 实现冲突解决
- [ ] 错误处理
- [ ] 加载状态
- [ ] Toast 提示

### 测试工作
- [ ] 多设备同步测试
- [ ] 冲突场景测试
- [ ] 离线场景测试
- [ ] 错误恢复测试

---

## 💰 成本估算

### WebDAV 方案
- **开发:** 2 天
- **服务器:** ¥0 (用户自备)
- **维护:** 几乎为零
- **总计:** ¥0

### Supabase 方案
- **开发:** 3 天
- **服务:** ¥0 (免费额度)
- **维护:** 低
- **总计:** ¥0

---

## ⚠️ 注意事项

### 安全
1. **加密存储** - 敏感数据加密后上传
2. **Token 安全** - 本地加密存储认证信息
3. **HTTPS** - 强制使用 HTTPS 连接

### 隐私
1. **端到端加密** - 可选功能，用户自持密钥
2. **匿名同步** - 不收集用户信息
3. **数据最小化** - 仅同步必要数据

### 性能
1. **增量同步** - 仅同步变更部分
2. **压缩传输** - 大数据量时压缩
3. **智能缓存** - 减少重复请求

---

## 🎯 结论

**推荐方案：WebDAV**

- 符合产品"隐私优先、数据自主"的定位
- 零成本，用户可控
- 技术成熟，实施简单
- 可作为 PWA 的增强功能

**实施顺序:**
1. 本周：实现 WebDAV 同步
2. 下周：实施 PWA
3. 后续：根据用户反馈考虑 Supabase

---

*报告完成时间：2026-03-02 20:50*
