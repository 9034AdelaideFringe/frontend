export default async function handler(req, res) {
  try {
    console.log(`[DEBUG] 收到API请求:`, {
      url: req.url,
      method: req.method,
      cookies: req.headers.cookie
    });

    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const backendBase = 'http://23.22.158.203:8080'; // 硬编码后端地址
    const requestUrl = req.url;
    let targetUrl;

    // 从请求URL中提取路径，去除/api前缀
    const targetPath = requestUrl.replace(/^\/api/, '');

    // **根据路径判断是否为图片请求，并构建不同的目标URL**
    if (targetPath.startsWith('/images/')) {
      // 如果是图片请求，直接将去除/api后的路径拼接到后端基础地址
      targetUrl = `${backendBase}${targetPath}`;
      console.log(`[API 代理请求 - 图片] ${req.method} ${targetUrl}`);
    } else {
      // 如果是其他API请求，按照原有逻辑，将去除/api后的路径拼接到后端/api路径下
      targetUrl = `${backendBase}/api${targetPath}`;
      console.log(`[API 代理请求 - 其他] ${req.method} ${targetUrl}`);
    }

    // 构建请求选项
    const options = {
      method: req.method,
      headers: {
        // 默认设置Content-Type，但对于图片请求可能不需要或需要其他类型
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };

    // 复制原始请求头（排除一些特殊头）
    if (req.headers) {
      Object.keys(req.headers).forEach(key => {
        if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
          options.headers[key] = req.headers[key];
        }
      });
    }

    // 添加Cookie，如果存在
    if (req.headers.cookie) {
      options.headers['Cookie'] = req.headers.cookie;
    }

    // 添加请求体 (通常图片请求没有请求体)
    if (req.body && !['GET', 'HEAD'].includes(req.method)) {
      try {
        console.log(`[DEBUG] 处理请求体类型:`, typeof req.body);

        // 检查是否已经是字符串
        if (typeof req.body === 'string') {
          try {
            JSON.parse(req.body); // 验证是有效JSON
            options.body = req.body;
          } catch (e) {
            console.warn('[警告] 请求体不是有效JSON，尝试包装:', req.body.substring(0, 100));
            options.body = JSON.stringify({ data: req.body });
          }
        }
        // 处理对象
        else if (typeof req.body === 'object') {
          options.body = JSON.stringify(req.body);
        }

        console.log(`[请求体] 最终发送长度:`, options.body ? options.body.length : 0);
      } catch (err) {
        console.error('处理请求体出错:', err);
      }
    }

    // 发送请求到后端API
    console.log(`[DEBUG] 发送代理请求:`, {
      url: targetUrl,
      method: options.method,
    });

    const response = await fetch(targetUrl, options);

    console.log(`[DEBUG] 收到代理响应:`, {
      status: response.status,
      statusText: response.statusText
    });

    // 处理Set-Cookie响应头
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
      console.log('[DEBUG] 转发Set-Cookie头');
    }

    // 设置响应状态码
    res.status(response.status);

    // 处理不同类型的响应
    const contentType = response.headers.get('content-type');
    // 对于图片请求，直接转发原始响应
    if (targetPath.startsWith('/images/')) {
       // 转发所有响应头
       response.headers.forEach((value, name) => {
           res.setHeader(name, value);
       });
       // 转发响应流
       response.body.pipeTo(res.writable);
    } else if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('[DEBUG] 响应JSON:', typeof data === 'object' ? '对象' : typeof data);
      return res.json(data);
    } else {
      const text = await response.text();
      console.log('[DEBUG] 响应文本:', text.substring(0, 50));
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
