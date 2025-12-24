const extract = require('.').extract;
const fs = require('fs');
const path = require('path');

(async function () {
  // 获取命令行参数
  const args = process.argv.slice(2);
  const input = args[0] ? args[0].trim() : null;

  // 默认配置
  const options = {
    shouldReturnContent: true,      // 是否返回文章内容
    shouldExtractMpLinks: true,     // 是否解析文章中的其他公众号链接
    shouldExtractTags: true,        // 是否解析文章标签
    shouldExtractRepostMeta: true   // 是否解析转载信息
  };

  try {
    let result;
    
    if (input && input.startsWith('http')) {
      // 如果输入是 URL
      console.log(`正在解析 URL: ${input} ...`);
      result = await extract(input, options);
    } else {
      // 默认读取本地示例文件
      const filePath = input ? path.resolve(input) : path.join(__dirname, 'links/post.html');
      console.log(`正在读取文件: ${filePath} ...`);
      
      if (!fs.existsSync(filePath)) {
        console.error('错误: 文件不存在!');
        console.log('用法: node run.js [url | file_path]');
        return;
      }

      const html = fs.readFileSync(filePath, 'utf-8');
      console.log('文件读取成功，开始解析...');
      result = await extract(html, options);
    }

    if (result.done) {
      console.log('---------------- 解析成功 ----------------');
      console.log('标题:', result.data.msg_title);
      console.log('公众号:', result.data.account_name);
      console.log('作者:', result.data.msg_author || '未知');
      console.log('发布时间:', result.data.msg_publish_time_str);
      console.log('摘要:', result.data.msg_desc);
      console.log('内容长度:', result.data.msg_content ? result.data.msg_content.length : 0);
      
      // Print preview of content text (first 500 chars)
      if (result.data.msg_content) {
        const text = result.data.msg_content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        console.log('内容预览(前500字):', text.substring(0, 500) + '...');
      }

      console.log('封面:', result.data.msg_cover);
      console.log('文章类型:', result.data.msg_type);
      console.log('----------------------------------------');
      
      // Save debug html
      if (options.shouldReturnContent && result.data.msg_content) {
          fs.writeFileSync('debug_content.html', result.data.msg_content);
          console.log('文章内容已保存至 debug_content.html');
      }
    } else {
      console.error('解析失败:', result.msg || result.code);
    }

  } catch (error) {
    console.error('发生异常:', error);
  }
})();
