# WeChat Article Extractor API 文档

本项目提供了一个简单的 HTTP API，用于解析微信公众号文章的元数据和正文内容。

## 服务地址
默认运行在: `http://localhost:3000`

## 接口说明

### 解析文章 (Extract Article)
获取指定微信公众号文章的完整信息，包括标题、作者、发布时间、封面图、正文 HTML 以及视频链接等。

- **接口路径**: `/api/extract`
- **请求方法**: `GET`
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `url` | String | 是 | 微信公众号文章的完整链接 (例如 `https://mp.weixin.qq.com/s/...`) |

#### 请求示例

**浏览器/CURL**:
```bash
curl "http://localhost:3000/api/extract?url=https://mp.weixin.qq.com/s/1czzeOClAF1e_AQjCM4jCg"
```

#### 响应说明
返回 `application/json` 格式的数据。

**成功响应 (200 OK) 示例**:
```json
{
  "code": 0,
  "done": true,
  "data": {
    "account_name": "苍何",
    "account_id": "gh_fdb597c42fa4",
    "msg_title": "用即梦视频3.5pro复刻爆款AI探班视频，直接发现一个AI片场！",
    "msg_desc": "文章摘要描述...",
    "msg_cover": "https://mmbiz.qpic.cn/...",
    "msg_publish_time_str": "2025/12/17 16:57:16",
    "msg_content": "<div...>文章HTML内容...</div>",
    "msg_type": "post",
    "msg_link": "https://mp.weixin.qq.com/s/...",
    "mp_links": [], 
    "tags": []
  }
}
```

**关键字段说明**:
- `msg_title`: 文章标题
- `msg_content`: 文章正文 HTML 代码
- `msg_publish_time_str`: 发布时间字符串
- `account_name`: 公众号名称
- `msg_cover`: 封面图 URL
- `msg_type`: 文章类型 (`post`=图文, `video`=视频, `image`=纯图片)

**错误响应 (400/500) 示例**:
```json
{
  "code": 400,
  "msg": "请提供 \"url\" 参数"
}
```

---

## 使用指南

### 1. 启动服务
在项目根目录下运行以下命令启动 API 服务：

```bash
node server.js
```
看到输出 `API 服务已启动: http://localhost:3000` 即表示启动成功。

### 2. 代码调用示例

#### JavaScript (Fetch API)
适用于前端页面或 Node.js 环境。

```javascript
const targetUrl = 'https://mp.weixin.qq.com/s/1czzeOClAF1e_AQjCM4jCg';
const apiUrl = `http://localhost:3000/api/extract?url=${encodeURIComponent(targetUrl)}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(res => {
    if (res.code === 0) {
      console.log('标题:', res.data.msg_title);
      console.log('作者:', res.data.account_name);
    } else {
      console.error('解析失败:', res.msg);
    }
  })
  .catch(err => console.error('请求错误:', err));
```

#### Python (Requests)
适用于后端数据采集脚本。

```python
import requests

api_url = "http://localhost:3000/api/extract"
params = {
    "url": "https://mp.weixin.qq.com/s/1czzeOClAF1e_AQjCM4jCg"
}

try:
    response = requests.get(api_url, params=params)
    result = response.json()
    
    if result.get("code") == 0:
        data = result["data"]
        print(f"文章标题: {data['msg_title']}")
        print(f"发布时间: {data['msg_publish_time_str']}")
    else:
        print(f"Error: {result.get('msg')}")
except Exception as e:
    print(f"Request Failed: {e}")
```

### 3. 注意事项
- **跨域 (CORS)**: API 已配置 `Access-Control-Allow-Origin: *`，允许前端网页直接跨域调用。
- **性能**: 该解析基于静态 HTML 分析，速度通常很快，但请勿高频并发请求同一 IP，以免触发微信的反爬虫限制。
