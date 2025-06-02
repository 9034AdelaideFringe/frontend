import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import { isApiResponseSuccess, logCartOperation } from '../utils';

/**
 * 从购物车中删除项目
 * @param {string} cartItemId - 购物车项目ID
 * @returns {Promise<Object>} 删除结果
 */
export const removeFromCart = async (cartItemId) => {
  // logCartOperation('REMOVE_FROM_CART', 'STARTED', { cartItemId });
  
  try {
    // 构建API URL
    const apiUrl = buildApiUrl(CART_ENDPOINTS.REMOVE_FROM_CART);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ cart_item_id: cartItemId }),
    });

    // 处理响应
    if (isApiResponseSuccess(response) || response.success) {
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.ITEM_REMOVED,
        data: response
      };
      
      // logCartOperation('REMOVE_FROM_CART', 'FINISHED', { cartItemId });
      return result;
    } else {
      throw new Error(response.message || ERROR_MESSAGES.FAILED_TO_REMOVE);
    }

  } catch (error) {
    // logCartOperation('REMOVE_FROM_CART', 'FAILED', { cartItemId, error: error.message });
    throw error;
  }
};