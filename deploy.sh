#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   We-Extract 服务部署启动脚本   ${NC}"
echo -e "${GREEN}======================================${NC}"

# 1. 检查 Node.js 环境
echo -e "${YELLOW}[1/4] 检查环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未检测到 Node.js。请先安装 Node.js (推荐 v14+)。${NC}"
    exit 1
fi
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 2. 检查并安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}未检测到 PM2，正在尝试全局安装...${NC}"
    npm install -g pm2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}PM2 安装成功。${NC}"
    else
        echo -e "${RED}PM2 安装失败，请尝试使用 sudo 运行脚本或手动安装: npm install -g pm2${NC}"
        exit 1
    fi
else
    echo "PM2 已安装。"
fi

# 3. 安装依赖
echo -e "${YELLOW}[2/4] 安装/更新依赖...${NC}"
# 创建日志目录（如果在 ecosystem.config.js 中配置了）
mkdir -p logs

if command -v yarn &> /dev/null; then
    echo "检测到 Yarn，使用 Yarn 安装..."
    yarn install --production
else
    echo "使用 NPM 安装..."
    npm install --production
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}依赖安装失败，请检查网络或 npm 配置。${NC}"
    exit 1
fi

# 4. 启动服务
echo -e "${YELLOW}[3/4] 启动服务...${NC}"
# 检查是否存在 ecosystem.config.js
if [ -f "ecosystem.config.js" ]; then
    pm2 startOrReload ecosystem.config.js --env production
else
    echo -e "${YELLOW}未找到配置文件，使用默认参数启动...${NC}"
    pm2 start server.js --name "we-extract-api"
fi

# 5. 保存当前进程列表
echo -e "${YELLOW}[4/4] 保存进程状态...${NC}"
pm2 save

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   部署成功！服务已在后台运行   ${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "常用命令:"
echo -e "  查看状态: ${YELLOW}pm2 status${NC}"
echo -e "  查看日志: ${YELLOW}pm2 logs we-extract-api${NC}"
echo -e "  停止服务: ${YELLOW}pm2 stop we-extract-api${NC}"
echo -e "  重启服务: ${YELLOW}pm2 restart we-extract-api${NC}"
