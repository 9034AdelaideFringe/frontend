// 共享的API配置

// 获取环境变量
// 优先使用 VITE_APP_API_URL 环境变量，如果未设置则使用默认值
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://x.badtom.dpdns.org/api'; // 确保默认值是新的HTTPS地址
export const IS_DEV = import.meta.env.MODE === 'development'; // 使用 import.meta.env.MODE

// 默认图片配置（从eventService迁移）
export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&q=80&w=800&h=600';

/**
 * 构建统一的API URL
 * @param {string} endpoint - API端点路径
 * @returns {string} 完整的API URL
 */
export const buildApiUrl = (endpoint) => {
  // 确保 endpoint 以 / 开头
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 调试信息
  if (IS_DEV) console.log('API_BASE_URL:', API_BASE_URL);

  let url;

  // 直接使用配置的基础URL和路径
  // 假设后端API路径已经包含 /api
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  url = `${baseUrl}${path}`;


  if (IS_DEV) console.log(`最终API请求URL: ${url}`);
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
  headers: {
    'Content-Type': 'application/json',
    ...options.headers
  },
  ...options
});

/**
 * 认证请求选项
 * @param {Object} options - 自定义选项
 * @returns {Object} 包含认证信息的请求选项
 */
export const getAuthRequestOptions = (options = {}) => ({
  ...getRequestOptions(options),
  credentials: 'include'
});