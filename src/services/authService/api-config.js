// 根据环境确定基础 URL
const API_BASE = import.meta.env.VITE_APP_API_URL || "/api";

export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 如果API_BASE是完整URL且不以/api结尾，添加/api前缀
  if (API_BASE.startsWith('http') && !API_BASE.endsWith('/api')) {
    return `${API_BASE}/api${path}`;
  }
  
  return `${API_BASE}${path}`;
};