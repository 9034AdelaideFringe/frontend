/**
 * Authentication API client
 */
import { apiUrl, getAuthRequestOptions } from './api-config';
import { handleApiError } from './error-handler';

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
    
    // 使用统一的认证请求选项
    const requestOptions = getAuthRequestOptions(options);
    
    // 发送请求
    const response = await fetch(url, requestOptions);
    
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
    const response = await fetch(apiUrl(endpoint), {
      ...options,
      credentials: "include", // Include cookies for JWT
    });

    if (response.status === 401) {
      // Token expired or invalid, trigger logout
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
