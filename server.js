const http = require('http');
const { extract } = require('./index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // 设置 CORS 头，允许跨域调用
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 解析 URL
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  
  if (reqUrl.pathname === '/api/extract' && req.method === 'GET') {
    const targetUrl = reqUrl.searchParams.get('url');

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        code: 400,
        msg: '请提供 "url" 参数'
      }));
      return;
    }

    try {
      console.log(`Processing URL: ${targetUrl}`);
      
      // 开启所有选项以获取最全的内容
      const options = {
        shouldReturnRawMeta: true,      // 返回原始元数据
        shouldReturnContent: true,      // 返回HTML内容
        shouldFollowTransferLink: true, // 跟随迁移链接
        shouldExtractMpLinks: true,     // 提取文中的公众号链接
        shouldExtractTags: true,        // 提取标签
        shouldExtractRepostMeta: true   // 提取转载信息
      };

      const result = await extract(targetUrl, options);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));

    } catch (e) {
      console.error('Error extracting url:', e);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        code: 500,
        msg: 'Internal Server Error',
        error: e.message
      }));
    }

  } else {
    // 404 处理
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      code: 404,
      msg: 'Not Found'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`API 服务已启动: http://localhost:${PORT}`);
  console.log(`测试链接: http://localhost:${PORT}/api/extract?url=https://mp.weixin.qq.com/s/1czzeOClAF1e_AQjCM4jCg`);
});
