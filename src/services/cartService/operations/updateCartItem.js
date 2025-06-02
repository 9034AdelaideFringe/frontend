import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import { isApiResponseSuccess, logCartOperation, validateUserAndGetId } from '../utils'; // **导入 validateUserAndGetId**
import { removeFromCart } from './removeFromCart';

/**
 * 更新购物车中项目的数量
 * @param {string} cartItemId - 购物车项目ID
 * @param {number} quantity - 新数量
 * @param {string} ticketTypeId - 票种ID
 * @returns {Promise<Object>} 更新结果
 */
export const updateCartItemQuantity = async (cartItemId, quantity, ticketTypeId) => {
  logCartOperation('UPDATE_CART_ITEM', 'STARTED', { cartItemId, quantity, ticketTypeId });

  try {
    // 如果数量小于1，删除项目
    if (quantity < 1) {
      return await removeFromCart(cartItemId);
    }

    // **修改这里：验证用户并获取ID**
    const userId = validateUserAndGetId();

    // 构建API URL和请求体
    const apiUrl = buildApiUrl(CART_ENDPOINTS.UPDATE_CART_ITEM); // 端点已经是固定的 /cart
    const requestBody = {
        user_id: userId, // **使用获取到的 userId**
        ticket_type_id: ticketTypeId,
        quantity: String(quantity), // 确保数量是字符串
        cart_item_id: cartItemId,
    };

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 处理响应
    if (isApiResponseSuccess(response) || response.success) {
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.ITEM_UPDATED,
        data: response
      };

      logCartOperation('UPDATE_CART_ITEM', 'FINISHED', { cartItemId, quantity });
      return result;
    } else {
      // Log the full error response from the API for more details
      throw new Error(response.message || ERROR_MESSAGES.FAILED_TO_UPDATE);
    }

  } catch (error) {
    logCartOperation('UPDATE_CART_ITEM', 'FAILED', { cartItemId, quantity, error: error.message });
    throw error;
  }
};