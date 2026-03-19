# Todo 前端开发与部署心得

tags: #前端 #vibe-coding #部署 #开发心得
date: 2026-03-19

---

## 工具链选型

最终确定的工具分工：
- **Trae CN** → 日常 vibe coding
- **Claude Code 终端** → 复杂逻辑和代码审查
- **Gemini AI Studio** → 前期设计方案输出

三个工具各司其职，避免了把所有事情压在一个工具上导致额度浪费。

### 中转站配置踩坑

- Claude Code 识别的环境变量是 `ANTHROPIC_API_KEY` 和 `ANTHROPIC_BASE_URL`，**不是** `OPENAI_API_KEY`
- 中转站的模型名字不一定和官方一致，遇到 503 或"无可用渠道"时第一步应该先查模型列表确认名字

---

## 开发难题

### framer-motion 动画全白屏

页面能跑、没有报错、但完全空白。

**原因**：`staggerContainer` 缺少 `initial: {}` 字段，导致子元素的动画状态无法继承，全部卡在 `opacity: 0`。

**教训**：这类 bug 不报错、不崩溃，只能靠逐步排查动画配置。`staggerContainer` 必须带 `initial: {}`。

```ts
// 正确写法
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}
```

---

### framer-motion 的 ease 类型问题

本地 `tsc` 不严格检查，但部署时会跑完整 TypeScript 检查。

**原因**：`ease: [0.32, 0.72, 0, 1]` 数组写法在严格模式下类型不匹配。

**修复**：改成 `ease: "easeOut"` 字符串，或加 `as any`。

---

### FastAPI 登录接口格式

**问题**：AI 生成代码时容易把两个接口都写成 JSON 格式，导致登录 422 报错。

**正确做法**：
- `/auth/login` → `OAuth2PasswordRequestForm`，必须用 `URLSearchParams`（form 格式）
- `/auth/register` → 普通 Pydantic model，用 JSON

```ts
// 登录必须用 URLSearchParams
const formData = new URLSearchParams()
formData.append('username', username)
formData.append('password', password)
await apiClient.post('/auth/login', formData, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})
```

---

### axios 401 拦截器误杀登录错误

**问题**：响应拦截器把所有 401 都跳转登录页，连登录失败的 401 也被拦截，导致密码错误时没有任何提示。

**修复**：在拦截器里加白名单，放行 `/auth/login` 和 `/auth/register` 的 401。

```ts
if (error.response?.status === 401) {
  const url = error.config?.url || ''
  if (url.endsWith('/auth/login') || url.endsWith('/auth/register')) {
    return Promise.reject(error) // 放行，让页面自己处理
  }
  clearToken()
  window.location.href = '/login'
}
```

---

## 部署难题

### 本地正常、线上构建失败

**根本原因**：项目初始化时 `@types/react` 和 `@types/react-dom` 没有安装。

本地 Vite 开发模式不做完整 TypeScript 检查，但 EdgeOne 构建命令是 `tsc && vite build`，`tsc` 会做严格检查，结果 283 个错误全部在部署时爆发。

**预防方法**：本地开发时养成偶尔跑一次 `npm run build` 的习惯，不要等到部署时才发现类型问题。

---

### EdgeOne 域名有效期

免费版每次部署的域名只有 3 小时，长期使用需要实名认证。

**备选方案**：Vercel —— GitHub 直接授权，域名永久有效，对作品集展示完全够用。

---

## Vibe Coding 方法论

> 描述"结果"而不是"步骤"

告诉 AI「我要一个带侧边栏的深蓝主题 Todo 面板」，比告诉它「帮我写一个 div，里面放导航」要快得多。

> 每次只做一个模块

做完验证再继续。遇到问题的范围始终可控。本次开发顺序：
1. axios 配置
2. 路由骨架
3. 登录页
4. 注册页
5. 侧边栏
6. 统计卡片
7. Todo 列表

> 报错直接扔给 AI

控制台错误、构建日志、TypeScript 报错，直接粘贴，让 AI 判断根本原因。

> 设计和实现分开

用 Gemini 出配色、组件结构、动画规范，确认满意后再让 Claude Code 实现，避免边设计边改代码的混乱。

---

## 相关链接

- 前端仓库：https://github.com/ItalyPtrick/todo-frontend
- 后端仓库：https://github.com/ItalyPtrick/todo-api
- 后端地址：https://khlyrrwetwvn.ap-southeast-1.clawcloudrun.com
