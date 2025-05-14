// 根据环境确定基础 URL
const API_BASE = import.meta.env.VITE_APP_API_URL || "/api";

export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
};