import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS } from '../config';
import { 
  validateUserAndGetId, 
  mapCartItemFromApi, 
  isApiResponseSuccess,
  logCartOperation 
} from '../utils';

/**
 * 获取当前用户的购物车项目
 * @returns {Promise<Array>} 购物车项目列表
 */
export const getCartItems = async () => {
  logCartOperation('GET_CART_ITEMS', 'STARTED');
  
  try {
    // 验证用户并获取ID
    const userId = validateUserAndGetId();
    
    // 构建API URL
    const apiUrl = buildApiUrl(CART_ENDPOINTS.GET_CART(userId));
    console.log(`尝试获取用户 ${userId} 的购物车数据: ${apiUrl}`);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'GET',
    });

    console.log("获取购物车的API响应:", response);

    // 处理成功响应
    if (isApiResponseSuccess(response) && Array.isArray(response.data)) {
      console.log(`成功获取 ${response.data.length} 个购物车项目`);
      
      // 映射数据格式
      const mappedItems = response.data.map(mapCartItemFromApi);
      
      logCartOperation('GET_CART_ITEMS', 'FINISHED', { count: mappedItems.length });
      return mappedItems;
    } else {
      console.error('无效的API响应格式:', response);
      return [];
    }

  } catch (error) {
    console.error("获取购物车项目失败:", error);
    logCartOperation('GET_CART_ITEMS', 'FAILED', { error: error.message });
    throw error;
  }
};