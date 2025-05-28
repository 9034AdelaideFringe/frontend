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
  logCartOperation('REMOVE_FROM_CART', 'STARTED', { cartItemId });
  
  try {
    // 构建API URL
    const apiUrl = buildApiUrl(CART_ENDPOINTS.REMOVE_FROM_CART);
    console.log(`尝试从购物车中删除项目 ${cartItemId}: ${apiUrl}`);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ cart_item_id: cartItemId }),
    });

    console.log("删除购物车项目的API响应:", response);

    // 处理响应
    if (isApiResponseSuccess(response) || response.success) {
      console.log("成功从购物车中删除项目:", response);
      
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.ITEM_REMOVED,
        data: response
      };
      
      logCartOperation('REMOVE_FROM_CART', 'FINISHED', { cartItemId });
      return result;
    } else {
      console.error('删除失败:', response);
      throw new Error(response.message || ERROR_MESSAGES.FAILED_TO_REMOVE);
    }

  } catch (error) {
    console.error("从购物车中删除项目失败:", error);
    logCartOperation('REMOVE_FROM_CART', 'FAILED', { cartItemId, error: error.message });
    throw error;
  }
};