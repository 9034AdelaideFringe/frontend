export default async function handler(req, res) {
  try {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // 从请求URL中提取路径，去除/api前缀
    const backendBase = 'http://23.22.158.203:8080';  // 硬编码后端地址
    const targetPath = req.url.replace(/^\/api/, '');
    const targetUrl = `${backendBase}/api${targetPath}`;
    
    console.log(`[API 代理请求] ${req.method} ${targetUrl}`);
    
    // 构建请求选项
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // 复制原始请求头（排除一些特殊头）
    if (req.headers) {
      Object.keys(req.headers).forEach(key => {
        if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
          options.headers[key] = req.headers[key];
        }
      });
    }
    
    // 添加请求体
    if (req.body && !['GET', 'HEAD'].includes(req.method)) {
      try {
        // 处理不同格式的请求体
        if (typeof req.body === 'object') {
          options.body = JSON.stringify(req.body);
        } else if (typeof req.body === 'string') {
          options.body = req.body;
        }
      } catch (err) {
        console.error('处理请求体出错:', err);
      }
    }
    
    // 发送请求到后端API
    const response = await fetch(targetUrl, options);
    
    // 设置响应状态码
    res.status(response.status);
    
    // 处理不同类型的响应
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (error) {
    console.error('[API 代理错误]', error);
    return res.status(500).json({ 
      error: '连接API服务器失败',
      message: error.message
    });
  }
}