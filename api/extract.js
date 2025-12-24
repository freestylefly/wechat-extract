const { extract } = require('../index');

module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // 获取 URL 参数 (Vercel 会自动解析 query)
  // 支持 GET /api/extract?url=...
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      code: 400,
      msg: '请提供 "url" 参数'
    });
  }

  try {
    // 开启所有选项
    const options = {
      shouldReturnRawMeta: true,
      shouldReturnContent: true,
      shouldFollowTransferLink: true,
      shouldExtractMpLinks: true,
      shouldExtractTags: true,
      shouldExtractRepostMeta: true
    };

    const result = await extract(url, options);
    
    // Vercel Serverless Function 响应
    res.status(200).json(result);

  } catch (e) {
    console.error('Error extracting url:', e);
    res.status(500).json({
      code: 500,
      msg: 'Internal Server Error',
      error: e.message
    });
  }
};
