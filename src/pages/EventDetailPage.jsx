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
    const isImageRequest = requestUrl.startsWith('/api/images/'); // 更直接判断是否为图片请求

    // 从请求URL中提取路径，去除/api前缀
    const targetPath = requestUrl.replace(/^\/api/, '');

    // **根据路径判断是否为图片请求，并构建不同的目标URL**
    if (isImageRequest) {
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
        // 移除默认的 application/json，让 fetch 根据 body 自动设置或不设置
      },
      credentials: 'include'
    };

    // 复制原始请求头（排除一些特殊头）
    if (req.headers) {
      Object.keys(req.headers).forEach(key => {
        if (!['host', 'connection', 'content-length', 'content-type'].includes(key.toLowerCase())) { // 排除 content-type
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
            options.headers['Content-Type'] = 'application/json'; // 如果是JSON，设置Content-Type
          } catch (e) {
            console.warn('[警告] 请求体不是有效JSON，尝试包装:', req.body.substring(0, 100));
            options.body = JSON.stringify({ data: req.body });
            options.headers['Content-Type'] = 'application/json'; // 包装后也是JSON
          }
        }
        // 处理对象
        else if (typeof req.body === 'object') {
          options.body = JSON.stringify(req.body);
           options.headers['Content-Type'] = 'application/json'; // 对象转JSON
        }
         // 对于 FormData，fetch 会自动设置 Content-Type: multipart/form-data
         // 所以这里不需要额外处理 FormData 类型
        console.log(`[请求体] 最终发送长度:`, options.body ? options.body.length : 0);
      } catch (err) {
        console.error('处理请求体出错:', err);
      }
    }

    // 发送请求到后端API
    console.log(`[DEBUG] 发送代理请求:`, {
      url: targetUrl,
      method: options.method,
      headers: options.headers // 打印发送的请求头
    });

    const response = await fetch(targetUrl, options);

    console.log(`[DEBUG] 收到代理响应:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()) // 打印收到的响应头
    });

    // 处理Set-Cookie响应头
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
      console.log('[DEBUG] 转发Set-Cookie头');
    }

    // 设置响应状态码
    res.status(response.status);

    // 处理不同类型的响应或错误响应
    const contentType = response.headers.get('content-type');

    // **检查响应状态码**
    if (!response.ok) { // 如果响应状态码不是 2xx
        console.error(`[API 代理错误] 后端返回状态码: ${response.status}`);
        // 尝试读取错误响应体并转发
        try {
            const errorBody = await response.text();
            console.error(`[API 代理错误] 后端错误响应体:`, errorBody);
            // 转发后端返回的Content-Type和错误体
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            return res.send(errorBody);
        } catch (readError) {
            console.error('[API 代理错误] 无法读取后端错误响应体:', readError);
            return res.send('代理收到后端错误，但无法读取错误详情。');
        }
    }

    // 如果响应成功 (状态码 2xx)
    if (isImageRequest) {
       // 对于图片请求，直接转发原始响应
       console.log('[API 代理] 转发图片响应流');
       // 转发所有响应头
       response.headers.forEach((value, name) => {
           res.setHeader(name, value);
       });
       // 转发响应流
       // 使用 response.body.pipeTo(res) 可能更直接，取决于环境
       // 如果 pipeTo 报错，可以尝试手动读取流并发送
       try {
           await response.body.pipeTo(res.writable);
           console.log('[API 代理] 图片响应流转发完成');
       } catch (pipeError) {
           console.error('[API 代理错误] 转发图片流失败:', pipeError);
           // 尝试手动读取并发送
           try {
               const imageBuffer = await response.buffer(); // 或者 arrayBuffer()
               res.end(imageBuffer);
               console.log('[API 代理] 手动发送图片数据完成');
           } catch (manualSendError) {
               console.error('[API 代理错误] 手动发送图片数据失败:', manualSendError);
               // 最后的错误处理
               if (!res.headersSent) {
                   res.status(500).send('代理转发图片失败');
               } else {
                   // 如果头已经发送，只能结束响应
                   res.end();
               }
           }
       }

    } else if (contentType && contentType.includes('application/json')) {
      console.log('[API 代理] 转发 JSON 响应');
      const data = await response.json();
      console.log('[DEBUG] 响应JSON:', typeof data === 'object' ? '对象' : typeof data);
      return res.json(data);
    } else {
      console.log('[API 代理] 转发文本响应');
      const text = await response.text();
      console.log('[DEBUG] 响应文本:', text.substring(0, 50));
      return res.send(text);
    }
  } catch (error) {
    console.error('[API 代理全局错误]', error);
    // 确保在发生未捕获的错误时发送响应
    if (!res.headersSent) {
        return res.status(500).json({
          error: '代理服务器内部错误',
          message: error.message || '未知错误'
        });
    } else {
        // 如果头已经发送，只能结束响应
        res.end();
    }
  }
}