/**
 * Authentication API client
 */
import { apiUrl, getAuthRequestOptions } from './api-config';
import { handleApiError } from './error-handler';

const IS_DEV = import.meta.env.MODE === 'development';

// TODO: Implement the actual logic based on your API response structure
// This function checks the *parsed JSON data* for application-level success
export const isApiResponseSuccess = (data) => {
// Based on cart service usage, it seems to check for a 'success' property or absence of 'error'
  return data !== undefined && data !== null && (data.success === true || (data.message !== "error" && !data.error));
};


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
    console.log(`[auth-client.js] 发送请求到: ${url}`);

    // 不论开发还是生产环境，都使用 credentials: 'include'
    // 除了登录和注册请求，这些通常不需要发送 cookie
    let effectiveCredentials = options.credentials;
    if (effectiveCredentials === undefined) {
      if (options.method === 'POST' && (endpoint === '/login' || endpoint === '/signup')) {
        effectiveCredentials = 'omit';
        console.log(`[auth-client.js] ${endpoint}: 使用 'credentials: "omit"'`);
      } else {
        // 对其他所有请求，特别是需要认证的请求，默认使用 'include'
        effectiveCredentials = 'include';
        console.log(`[auth-client.js] ${endpoint}: 使用 'credentials: "include"'`);
      }
    }

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
        ...options.headers,
      },
      credentials: effectiveCredentials, // 使用确定的凭据策略
      ...options,
    };

    console.log(`[auth-client.js] 请求选项:`, {
      url,
      method: defaultOptions.method,
      credentials: defaultOptions.credentials,
      headers: Object.keys(defaultOptions.headers)
    });

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      console.error("请求失败:", response.status, response.statusText);
      let errorMsg = `请求失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) { /* ignore */ }
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn("非 JSON 响应:", contentType);
      const text = await response.text();
      return { message: "ok", text };
    }

    const data = await response.json();

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
 * @param {string} endpoint - API endpoint (should be full URL or path handled by proxy)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object|Blob|Response>} API response data (JSON, Blob for files, or raw Response)
 */
export const authenticatedRequest = async (endpoint, options = {}) => {
try {
    const token = getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const requestOptions = {
      ...options,
      headers,
      // 暂时禁用凭据，仅使用Authorization头
      credentials: 'omit',  // 改为'omit'以避免CORS错误
    };

    // 使用传入的endpoint作为URL
    const finalUrl = endpoint;

    const response = await fetch(finalUrl, requestOptions);

    if (response.status === 401) {
      console.warn('[auth-client.js] 401 Unauthorized - Session expired');
      // Token expired or invalid, trigger logout
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      // Use window.location.href for full page reload/navigation
      window.location.href = "/"; // Or use react-router's navigate if available
      const authError = new Error("Session expired. Please login again.");
      authError.status = 401;
      throw authError; // Still throw for calling code to handle if needed
    }

    // Check for non-OK responses (4xx, 5xx)
    if (!response.ok) {
      console.error(`[auth-client.js] HTTP error! status: ${response.status}`);
      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      let errorData = null;
      try {
        const contentType = response.headers.get('Content-Type');
         if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.error('[auth-client.js] Error response body (JSON):', errorData);
            errorMsg = errorData.message || errorData.error || errorMsg;
         } else {
             const textBody = await response.text();
             console.error('[auth-client.js] Error response body (Text):', textBody);
             errorMsg = textBody || errorMsg;
             errorData = textBody;
         }
        const customError = new Error(errorMsg);
        customError.status = response.status;
        customError.statusText = response.statusText;
        customError.body = errorData;
        throw customError;
      } catch (parseOrProcessError) {
        console.error('[auth-client.js] Failed to process error response body:', parseOrProcessError);
         const fallbackError = new Error(errorMsg);
         fallbackError.status = response.status;
         fallbackError.statusText = response.statusText;
         throw fallbackError;
      }
    }

    // Handle successful responses
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else if (contentType && (contentType.includes('image/') || contentType.includes('application/pdf') || contentType.includes('application/octet-stream') || contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))) {
       console.log('[auth-client.js] Handling response as Blob (binary data)');
       return response.blob();
    }
     else {
      console.log('[auth-client.js] Handling response as plain text or other');
      const text = await response.text();
      console.log('[auth-client.js] Raw response text:', text);
      return { message: "ok", text, rawResponse: response };
    }

  } catch (error) {
    console.error("[auth-client.js] Error in authenticatedRequest catch block:", error);
    throw error;
  }
};

// Get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  } catch (error) {
    console.warn('无法获取认证token:', error);
    return null;
  }
};

// 添加调试函数到文件末尾

/**
 * 检查并打印当前文档的cookie信息（不包含HttpOnly cookie内容）
 * @returns {void}
 */
export const checkCookieStatus = () => {
  console.log('[auth-client.js] 文档cookie存在:', document.cookie.length > 0);
  console.log('[auth-client.js] 文档cookie长度:', document.cookie.length);
  
  // 提取所有非HttpOnly cookie的名称（无法读取HttpOnly cookie的值）
  const cookieNames = document.cookie
    .split(';')
    .map(c => c.trim().split('=')[0])
    .filter(name => name);
  
  console.log('[auth-client.js] 可见cookie名称:', cookieNames);
  console.log('[auth-client.js] JWT HttpOnly cookie应该存在 (但JS无法直接查看)');
};