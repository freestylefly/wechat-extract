FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装生产环境依赖
RUN npm install --production

# 复制源码
COPY . .

# 暴露端口 (对应 server.js 中的 3000)
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]
