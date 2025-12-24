# 部署指南 (Deployment Guide)

本项目已配置为标准的 Node.js 应用，支持多种部署方式。

## 方式一：使用 Docker 部署 (推荐)

如果你有 Docker 环境（本地或服务器），这是最简单的方式。

### 1. 构建镜像
在项目根目录下运行：
```bash
docker build -t we-extract-api .
```

### 2. 运行容器
```bash
docker run -d -p 3000:3000 --name we-extract-service we-extract-api
```
服务将在 `http://localhost:3000` 启动。

---

## 方式二：部署到云平台 (PaaS)

本项目包含 `Dockerfile` 和 `package.json` 的 `start` 脚本，可以直接部署到主流的 PaaS 平台。

### 推荐平台：
1.  **Render / Railway / Zeabur**:
    - 连接你的 GitHub 仓库。
    - 平台会自动识别 Node.js 项目。
    - 部署命令默认会使用 `npm start`。
    - **注意**: 确保在平台的设置中将对外端口设置为 `3000` (或者修改 `server.js` 让其读取 `process.env.PORT`)。

### 适配云平台端口
大多数云平台（如 Heroku, Render）会通过环境变量 `PORT` 动态分配端口。建议修改 `server.js` 以支持环境变量端口（已在下方提供修改代码）。

---

## 方式三：传统服务器部署 (VPS)

如果你有一台 Linux 服务器 (Ubuntu/CentOS)：

### 1. 安装 Node.js
确保服务器已安装 Node.js (推荐 v14+)。

### 2. 安装 PM2 (进程管理工具)
```bash
npm install -g pm2
```

### 3. 启动服务
在项目目录下：
```bash
npm install --production
pm2 start server.js --name "we-extract-api"
```

### 4. 查看状态
```bash
pm2 status
pm2 logs
```

---

## 生产环境建议

为了更好地适应云环境，建议修改 `server.js` 中的端口监听代码，使其优先读取环境变量：

**修改 `server.js`:**
```javascript
// 原代码
const PORT = 3000;

// 修改为
const PORT = process.env.PORT || 3000;
```
这样部署到云平台时，应用会自动监听平台分配的端口。
