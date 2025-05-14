// 重定向到共享配置
import { buildApiUrl, handleApiResponse, getRequestOptions, DEFAULT_IMAGE, API_BASE_URL, IS_DEV } from '../../shared/apiConfig';

// 保留原始函数名称，但使用共享实现
export const getApiUrl = buildApiUrl;

// 重新导出所有必要的变量和函数
export { handleApiResponse, getRequestOptions, DEFAULT_IMAGE, API_BASE_URL, IS_DEV };