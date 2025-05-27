import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import { isApiResponseSuccess, logCartOperation } from '../utils';
import { removeFromCart } from './removeFromCart';

/**
 * 更新购物车中项目的数量
 * @param {string} cartItemId - 购物车项目ID
 * @param {number} quantity - 新数量
 * @returns {Promise<Object>} 更新结果
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  logCartOperation('UPDATE_CART_ITEM', 'STARTED', { cartItemId, quantity });
  
  try {
    // 如果数量小于1，删除项目
    if (quantity < 1) {
      console.log(`数量小于1 (${quantity})，调用移除函数`);
      return await removeFromCart(cartItemId);
    }

    // 构建API URL和请求体
    const apiUrl = buildApiUrl(CART_ENDPOINTS.UPDATE_CART_ITEM(cartItemId));
    const requestBody = {
      quantity: String(quantity),
    };

    console.log(`尝试更新购物车项目 ${cartItemId} 数量到 ${quantity}: ${apiUrl}`, requestBody);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("更新购物车数量的API响应:", response);

    // 处理响应
    if (isApiResponseSuccess(response) || response.success) {
      console.log("成功更新购物车项目数量:", response);
      
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.ITEM_UPDATED,
        data: response
      };
      
      logCartOperation('UPDATE_CART_ITEM', 'FINISHED', { cartItemId, quantity });
      return result;
    } else {
      console.error('更新失败:', response);
      throw new Error(response.message || ERROR_MESSAGES.FAILED_TO_UPDATE);
    }

  } catch (error) {
    console.error("更新购物车项目数量失败:", error);
    logCartOperation('UPDATE_CART_ITEM', 'FAILED', { cartItemId, quantity, error: error.message });
    throw error;
  }
};