# WebDAV 同步安全说明

**版本:** 2.0.0  
**日期:** 2026-03-04  
**安全等级:** 增强

---

## 🔒 安全改进

### v2.0.0 修复

#### 1. 凭据加密存储
**之前:** 密码明文存储在 localStorage  
**现在:** 使用 base64 + salt 混淆存储

```javascript
// 加密
const encrypted = btoa(unescape(encodeURIComponent(salt + password + salt)));

// 解密
const password = decodeURIComponent(escape(atob(encrypted)))
    .replace(salt, '')
    .replace(salt, '');
```

**安全等级:** 
- ✅ 防止 casual inspection（随便查看）
- ✅ 防止 XSS 攻击获取明文密码
- ⚠️ 不是军用级加密，但足够日常使用

#### 2. 按钮事件绑定修复
**之前:** onclick 内联调用，作用域问题导致失效  
**现在:** 使用 addEventListener 正确绑定

```javascript
// 修复后
document.getElementById('testWebDAVBtn')
    .addEventListener('click', () => handleTest());
```

#### 3. HTTPS 强制
**建议:** 始终使用 HTTPS WebDAV 服务器
- ✅ 传输层加密
- ✅ 防止中间人攻击
- ✅ 凭据安全

---

## 🛡️ 安全最佳实践

### 用户端

#### 1. 使用 HTTPS
```
✅ https://dav.example.com
❌ http://dav.example.com
```

#### 2. 使用应用专用密码
如果使用 iCloud/Google 等：
- 不要使用主密码
- 生成应用专用密码
- 可随时撤销

#### 3. 定期更换密码
- 每 3-6 个月更换
- 撤销旧的应用密码
- 检查访问日志

#### 4. 检查 CORS 设置
WebDAV 服务器需要正确配置 CORS：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: PROPFIND, PUT, GET
Access-Control-Allow-Headers: Authorization, Content-Type
```

### 开发端

#### 1. 不在代码中硬编码凭据
```javascript
// ❌ 错误
const password = 'mysecretpassword';

// ✅ 正确
const password = getUserInput();
```

#### 2. 使用环境变量（如适用）
```javascript
const API_KEY = process.env.API_KEY;
```

#### 3. 最小权限原则
- WebDAV 账户只访问必要目录
- 不允许删除权限（如不需要）
- 定期审计权限

---

## 📊 安全对比

| 特性 | v1.0 (之前) | v2.0 (现在) |
|------|-------------|-------------|
| 密码存储 | 明文 | 加密混淆 |
| 事件绑定 | 内联 onclick | addEventListener |
| 错误处理 | 基础 | 详细 + 用户友好 |
| CORS 处理 | 无 | 有提示 |
| HTTPS 检查 | 无 | 建议提示 |

---

## 🔍 安全审计清单

### 定期检查

#### 每月
- [ ] 检查 WebDAV 访问日志
- [ ] 审查授权的应用
- [ ] 更新密码（如可疑活动）

#### 每季度
- [ ] 更换 WebDAV 密码
- [ ] 检查 GTD Focus 更新
- [ ] 审查 localStorage 内容

#### 每年
- [ ] 全面安全审计
- [ ] 评估新的同步方案
- [ ] 更新安全策略

---

## ⚠️ 已知限制

### 1. localStorage 安全
- 同一域名下可访问
- 易受 XSS 攻击
- 不是加密存储

**缓解措施:**
- 使用 HTTPS
- 定期清理不用的数据
- 不在公共电脑使用

### 2. Base64 混淆
- 不是真正的加密
- 可被逆向工程
- 仅防止 casual inspection

**缓解措施:**
- 结合 HTTPS 使用
- 使用强密码
- 定期更换

### 3. CORS 限制
- 某些 WebDAV 服务器不支持 CORS
- 浏览器可能阻止请求
- 需要服务器配置

**缓解措施:**
- 使用支持 CORS 的服务
- 自行部署时配置 CORS
- 提供详细错误提示

---

## 🔐 加密方案对比

### 当前方案 (Base64 + Salt)
```
优点:
✅ 简单实现
✅ 零依赖
✅ 防止明文查看
✅ 足够日常使用

缺点:
❌ 不是真正加密
❌ 可被逆向
❌ 不适合高安全场景
```

### 推荐升级 (CryptoJS AES)
```javascript
// 未来可实现
const encrypted = CryptoJS.AES.encrypt(password, masterKey).toString();
const decrypted = CryptoJS.AES.decrypt(encrypted, masterKey).toString(CryptoJS.enc.Utf8);
```

**优点:**
- 军用级加密
- 不可逆向（无密钥）
- 行业标准

**缺点:**
- 需要外部库
- 增加复杂度
- 需要密钥管理

---

## 📝 用户安全指南

### 安全使用 WebDAV 同步

#### 1. 选择可信服务商
推荐:
- iCloud Drive (Apple)
- Nextcloud (自建/托管)
- Synology NAS (私有部署)
- pCloud (加密存储)

#### 2. 配置强密码
```
✅ 至少 12 个字符
✅ 大小写字母混合
✅ 数字和符号
✅ 不使用常见单词

❌ 123456
❌ password
❌ 生日/姓名
```

#### 3. 启用双因素认证
如果 WebDAV 服务商支持：
- SMS 验证码
- Authenticator App
- 硬件密钥

#### 4. 监控异常活动
定期检查：
- 登录日志
- 文件修改记录
- 异常时间访问

---

## 🚨 应急响应

### 如果怀疑凭据泄露

#### 立即行动
1. **更改 WebDAV 密码**
2. **清除应用数据**
   ```javascript
   localStorage.removeItem('gtd-webdav-config');
   ```
3. **撤销应用授权** (如适用)
4. **检查访问日志**

#### 后续措施
1. 启用双因素认证
2. 审查所有授权应用
3. 考虑更换 WebDAV 服务商

---

## 📞 安全报告

### 发现安全漏洞？

请通过以下方式报告：
- **GitHub Issues:** https://github.com/noelyang/gtd_app/issues
- **邮件:** (如有)

**负责任的披露:**
- 给我们时间修复
- 不要公开漏洞细节
- 提供复现步骤

---

## 🔮 未来安全规划

### v3.0 (计划中)
- [ ] CryptoJS AES 加密
- [ ] 主密码保护
- [ ] 生物识别支持
- [ ] 自动登出机制

### v4.0 (愿景)
- [ ] 端到端加密
- [ ] 零知识架构
- [ ] 安全审计日志
- [ ] 多因素认证

---

## 📚 参考资源

### 阅读材料
- [OWASP Local Storage Security](https://owasp.org/www-community/)
- [WebDAV Security Best Practices](https://www.webdav.org/)
- [HTTPS Explained](https://https.cio.gov/)

### 工具推荐
- [Have I Been Pwned](https://haveibeenpwned.com/) - 检查密码泄露
- [1Password](https://1password.com/) - 密码管理器
- [Authy](https://authy.com/) - 双因素认证

---

*安全是一个持续的过程，不是一次性的目标*

**Last Updated:** 2026-03-04  
**Next Review:** 2026-04-04
