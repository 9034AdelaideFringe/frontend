// 获取API基础URL (如果有设置)
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';
export const IS_DEV = import.meta.env.MODE === 'development';

// 默认图片，当没有提供图片时使用
export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&q=80&w=800&h=600';

/**
 * 构建API URL
 * @param {string} endpoint - API端点路径
 * @returns {string} 完整的API URL
 */
export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  console.log('API_BASE_URL:', API_BASE_URL); // 打印原始环境变量
  
  let url;
  if (API_BASE_URL) {
    // 生产环境：使用完整URL
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    url = `${baseUrl}${path}`;
    console.log('构建的生产环境URL:', url);
  } else {
    // 开发环境中，添加/api前缀
    url = `/api${path}`;
    console.log('构建的开发环境URL:', url);
  }
  
  console.log(`最终API请求URL: ${url}`); // 始终打印最终URL
  return url;
};

/**
 * 处理API响应
 * @param {Response} response - fetch响应对象
 * @param {string} context - 操作上下文（用于日志）
 * @returns {Promise} 解析后的响应数据或错误
 */
export const handleApiResponse = async (response, context = 'API') => {
  if (!response.ok) {
    let errorMessage = `${context} 错误: ${response.status} ${response.statusText}`;
    
    try {
      const errorText = await response.text();
      if (IS_DEV) console.log(`${context} 错误响应:`, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (jsonError) {
        // 如果不是JSON，使用原始文本
        if (errorText) {
          errorMessage = `Error: ${errorText}`;
        }
      }
    } catch (e) {
      console.error('无法读取错误响应:', e);
    }
    
    throw new Error(errorMessage);
  }
  
  // 尝试解析响应为JSON
  try {
    const result = await response.json();
    if (IS_DEV) console.log(`${context} 成功响应:`, result);
    return result;
  } catch (jsonError) {
    if (IS_DEV) console.log(`${context} 响应不是JSON格式，但请求成功`);
    // 如果不是JSON但响应成功，返回通用成功对象
    return { success: true, message: `${context} successful` };
  }
};

/**
 * 标准API请求选项
 * @param {Object} options - 自定义选项
 * @returns {Object} 完整的请求选项
 */
export const getRequestOptions = (options = {}) => ({
  // 移除credentials选项，避免可能的CORS问题
  headers: {
    'Content-Type': 'application/json',
    ...options.headers
  },
  ...options
});