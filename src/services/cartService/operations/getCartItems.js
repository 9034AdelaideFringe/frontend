import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS } from '../config';
import { 
  validateUserAndGetId, 
  mapCartItemFromApi, 
  isApiResponseSuccess,
  logCartOperation 
} from '../utils';
import { enrichCartItems } from './enrichCartItems';

/**
 * 获取当前用户的购物车项目
 * @param {boolean} enrichData - 是否丰富数据（获取票种和事件信息）
 * @returns {Promise<Array>} 购物车项目列表
 */
export const getCartItems = async (enrichData = true) => {
  logCartOperation('GET_CART_ITEMS', 'STARTED');
  
  try {
    // 验证用户并获取ID
    const userId = validateUserAndGetId();
    
    // 构建API URL
    const apiUrl = buildApiUrl(CART_ENDPOINTS.GET_CART(userId));

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'GET',
    });
    // console.log('获取购物车的API响应:', response);

    // 处理成功响应
    if (isApiResponseSuccess(response) && response.data) {
      const basicItems = response.data.map(mapCartItemFromApi);

      if (enrichData) {
        return await enrichCartItems(basicItems);
      }
      return basicItems;
    } else {
      return [];
    }

  } catch (error) {
    logCartOperation('GET_CART_ITEMS', 'FAILED', { error: error.message });
    throw error;
  }
};