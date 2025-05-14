// 重定向到共享配置
import { buildApiUrl } from '../shared/apiConfig';

// 保留原始函数名称，但使用共享实现
export const apiUrl = buildApiUrl;

// 导出所有共享配置
export * from '../shared/apiConfig';