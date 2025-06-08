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
    console.log('[cartService/getCartItems.js] Fetching cart items from:', apiUrl);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'GET',
    });
    console.log('[cartService/getCartItems.js] Received API response:', response);


    // 处理成功响应
    // 新的API返回 { data: [...items], message: "ok" }
    if (isApiResponseSuccess(response) && response.data && Array.isArray(response.data)) {
      console.log(`[cartService/getCartItems.js] Successfully fetched ${response.data.length} cart items.`);
      // 使用更新后的mapCartItemFromApi映射原始API项目
      const mappedItems = response.data.map(mapCartItemFromApi).filter(item => item !== null); // 过滤掉映射中任何null结果
      logCartOperation('GET_CART_ITEMS', 'FINISHED', { itemCount: mappedItems.length });
      // 直接返回映射的项目

      return mappedItems; 

    } else {
      // 处理响应正常但数据格式意外的情况
      console.error('[cartService/getCartItems.js] Failed to fetch cart items or invalid format:', response);
      logCartOperation('GET_CART_ITEMS', 'FAILED', { response });
      // 如果响应不在预期的成功格式中，则抛出错误
      throw new Error((response && response.message) || (response && response.error) || 'Failed to fetch cart items or invalid response format');
    }

  } catch (error) {
    console.error("[cartService/getCartItems.js] Error fetching cart items:", error); // 记录错误
    logCartOperation('GET_CART_ITEMS', 'FAILED', { error: error.message });
    throw error; // 重新抛出错误以供组件处理
  }
};