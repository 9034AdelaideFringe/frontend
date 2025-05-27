/**
 * Authentication API client
 */
import { apiUrl, getAuthRequestOptions } from './api-config';
import { handleApiError } from './error-handler';

const IS_DEV = import.meta.env.MODE === 'development';

/**
 * Make a request to the authentication API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} API response
 */
export const authRequest = async (endpoint, options = {}) => {
  try {
    // 构建 API URL
    const url = apiUrl(endpoint);
    console.log("发送请求到:", url);
    
    // 修改请求选项以解决 CORS 问题
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 如果有存储的token，添加到请求头中
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
        ...options.headers,
      },
      // 在开发环境中不包含凭据以避免 CORS 问题
      ...(IS_DEV ? {} : { credentials: 'include' }),
      ...options,
    };

    console.log(`请求URL: ${url}`);
    console.log(`请求选项:`, defaultOptions);

    // 发送请求
    const response = await fetch(url, defaultOptions);
    
    // 检查响应状态
    if (!response.ok) {
      console.error("请求失败:", response.status, response.statusText);
      let errorMsg = `请求失败: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        // 忽略 JSON 解析错误
      }
      
      throw new Error(errorMsg);
    }
    
    // 检查内容类型，避免尝试解析非 JSON 数据
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn("非 JSON 响应:", contentType);
      const text = await response.text();
      console.log("响应内容:", text);
      return { message: "ok", text };
    }
    
    // 安全解析 JSON
    const data = await response.json();
    console.log("API 响应数据:", data);
    
    // 检查错误消息
    if (data.error || data.message === "error") {
      throw new Error(data.error || "Operation failed");
    }
    
    return data;
  } catch (error) {
    console.error("请求处理错误:", error);
    throw error;
  }
};

/**
 * Create a request with authentication header
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export const authenticatedRequest = async (endpoint, options = {}) => {
  try {
    // 获取认证token
    const token = getAuthToken();
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // 准备请求选项
    const requestOptions = {
      ...options,
      headers,
      // 在开发环境中不包含凭据以避免 CORS 问题
      ...(IS_DEV ? {} : { credentials: 'include' }),
    };

    // **修复：直接使用传入的endpoint作为URL**
    // 因为cartService已经通过buildApiUrl构建了完整的URL
    const finalUrl = endpoint;

    console.log(`认证请求到: ${finalUrl}`);
    console.log(`请求选项:`, requestOptions);

    const response = await fetch(finalUrl, requestOptions);

    if (response.status === 401) {
      // Token expired or invalid, trigger logout
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      let errorMsg = `请求失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
        throw new Error(errorMsg);
      } catch (parseError) {
        throw new Error(errorMsg);
      }
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      return { message: "ok", text };
    }
  } catch (error) {
    console.error("认证请求错误:", error);
    throw error;
  }
};

// 获取存储的认证token
const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  } catch (error) {
    console.warn('无法获取认证token:', error);
    return null;
  }
};