import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import { 
  validateUserAndGetId, 
  mapCartItemFromApi, 
  isApiResponseSuccess,
  isDuplicateKeyError,
  createCartRequestBody,
  logCartOperation 
} from '../utils';

/**
 * 添加项目到购物车
 * @param {Array|Object} items - 要添加的项目，可以是单个项目或项目数组
 * @returns {Promise<Object>} 添加结果
 */
export const addToCart = async (items) => {
  logCartOperation('ADD_TO_CART', 'STARTED');
  
  try {
    // 验证用户并获取ID
    const userId = validateUserAndGetId();
    
    // 处理输入参数
    const itemsArray = Array.isArray(items) ? items : [items];
    
    if (itemsArray.length === 0) {
      return { success: true, message: "No items to add" };
    }

    // 目前API只支持单个项目添加
    const itemToAdd = itemsArray[0];
    
    // 构建请求体
    const requestBody = createCartRequestBody({
      userId,
      ticketTypeId: itemToAdd.ticketTypeId,
      quantity: itemToAdd.quantity
    });

    // 构建API URL
    const apiUrl = buildApiUrl(CART_ENDPOINTS.ADD_TO_CART);

    // 发送API请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 处理成功响应
    if (isApiResponseSuccess(response) && Array.isArray(response.data) && response.data.length > 0) {
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.ITEM_ADDED,
        item: mapCartItemFromApi(response.data[0])
      };
      
      logCartOperation('ADD_TO_CART', 'FINISHED', { item: result.item });
      return result;
    } 
    // 处理重复添加错误
    else if (isDuplicateKeyError(response)) {
      throw new Error(ERROR_MESSAGES.DUPLICATE_ITEM);
    }
    // 处理其他错误
    else if (response && response.error) {
      throw new Error(response.error);
    }
    else {
      throw new Error(ERROR_MESSAGES.FAILED_TO_ADD);
    }

  } catch (error) {
    logCartOperation('ADD_TO_CART', 'FAILED', { error: error.message });
    throw error;
  }
};