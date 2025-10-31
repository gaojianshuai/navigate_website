# 部署到 Vercel 指南

## 方法一：通过 Vercel 网站部署（推荐）

### 步骤 1: 准备工作
1. 确保你的项目已经在 Git 仓库中（GitHub、GitLab 或 Bitbucket）
2. 如果没有 Git 仓库，先初始化：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

### 步骤 2: 登录 Vercel
1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 **Sign Up** 或 **Log In**
3. 使用 GitHub、GitLab 或 Bitbucket 账号登录（推荐）

### 步骤 3: 导入项目
1. 登录后，点击 **Add New Project**
2. 选择你的 Git 仓库（如果没有看到，点击 **Import Git Repository** 进行授权）
3. 选择包含导航网站的仓库

### 步骤 4: 配置项目
1. **Project Name**: 可以自定义项目名称，例如 `navigation-site`
2. **Framework Preset**: 选择 **Other** 或 **Vite**（Vercel 会自动检测）
3. **Root Directory**: 保持默认（`.` 表示根目录）
4. **Build Command**: 留空（这是纯静态网站，不需要构建）
5. **Output Directory**: 留空或填写 `.`（所有文件都在根目录）

### 步骤 5: 部署
1. 点击 **Deploy** 按钮
2. 等待部署完成（通常需要 1-2 分钟）
3. 部署成功后，会显示你的网站链接（如 `https://your-project-name.vercel.app`）

### 步骤 6: 自定义域名（可选）
1. 在项目设置中，点击 **Settings** → **Domains**
2. 输入你的域名
3. 按照提示配置 DNS 记录

---

## 方法二：通过 Vercel CLI 部署

### 步骤 1: 安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel
```bash
vercel login
```

### 步骤 3: 部署项目
在项目根目录下运行：
```bash
vercel
```

按提示操作：
- 设置项目名称
- 确认项目目录
- 确认是否需要覆盖设置

### 步骤 4: 部署到生产环境
```bash
vercel --prod
```

---

## 重要提示

### 1. API 跨域问题
如果你的网站调用了外部 API（如聚合数据 API），可能会遇到 CORS 问题。可以：
- 使用 Vercel Serverless Functions 作为代理
- 使用支持 CORS 的 API
- 使用浏览器扩展禁用 CORS（仅开发测试）

### 2. 环境变量（如果需要）
如果有敏感信息（如 API Key），可以在 Vercel 项目设置中添加环境变量：
1. 进入项目 → **Settings** → **Environment Variables**
2. 添加变量并指定环境（Production、Preview、Development）
3. 在代码中使用：`process.env.YOUR_VARIABLE`

### 3. 自动部署
- 每次推送到 Git 仓库的主分支，Vercel 会自动重新部署
- 每次 Pull Request 会创建预览部署

### 4. 性能优化
- Vercel 会自动为静态资源启用 CDN
- 图片建议使用 WebP 格式
- 可以使用 Vercel 的 Analytics 分析访问情况

---

## 项目结构

你的项目应该包含以下文件：
```
blockchain_readme/
├── index.html      # 主页面
├── style.css       # 样式文件
├── script.js       # JavaScript 文件
├── vercel.json     # Vercel 配置文件（可选）
└── README.md       # 项目说明
```

---

## 常见问题

### Q: 部署后页面显示空白？
A: 检查浏览器控制台错误，可能是资源路径问题。确保所有资源使用相对路径。

### Q: API 请求失败？
A: 检查 API 的 CORS 设置，可能需要使用服务器端代理。

### Q: 如何更新网站？
A: 只需将更改推送到 Git 仓库，Vercel 会自动重新部署。

### Q: 免费额度够用吗？
A: Vercel 免费版对个人项目足够使用，包括：
- 无限部署
- 100GB 带宽/月
- Serverless Functions 使用量

---

## 快速命令参考

```bash
# 本地测试
# 可以使用任何静态服务器，例如：
npx serve .
# 或
python -m http.server 8000

# 部署到 Vercel（生产环境）
vercel --prod

# 查看部署日志
vercel logs

# 查看项目列表
vercel ls
```

