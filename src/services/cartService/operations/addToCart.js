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
 * @param {Array<Object>|Object} items - 要添加的项目，可以是单个项目对象或项目对象数组。
 *   每个项目对象应包含: { eventId: string, ticketTypeId: string, quantity: number, seat?: string }
 * @returns {Promise<Array<Object>>} 添加结果数组，每个元素对应一个项目的添加结果
 */
export const addToCart = async (items) => {
  logCartOperation('ADD_TO_CART', 'STARTED');
  try {
    // 验证用户并获取ID
    const userId = validateUserAndGetId();

    // 确保 items 是一个数组
    const itemsArray = Array.isArray(items) ? items : [items];
    if (itemsArray.length === 0) {
      logCartOperation('ADD_TO_CART', 'FINISHED', { message: "No items to add" });
      return []; // 返回空数组表示没有项目被添加
    }

    const results = [];
    const apiUrl = buildApiUrl(CART_ENDPOINTS.ADD_TO_CART); // API URL for adding items

    // --- New: Loop through each item and send a separate request ---
    for (const itemToAdd of itemsArray) {
        logCartOperation('ADD_TO_CART', 'PROCESSING_ITEM', { item: itemToAdd });

        // 构建请求体，包含 seat 字段
        const requestBody = createCartRequestBody({
            userId,
            ticketTypeId: itemToAdd.ticketTypeId,
            quantity: itemToAdd.quantity, // Use quantity from the item (should be 1 for seats)
            seat: itemToAdd.seat, // Include the seat ID
        });

        try {
            const response = await authenticatedRequest(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // 处理单个请求的响应
            if (isApiResponseSuccess(response) && response.data && Array.isArray(response.data) && response.data.length > 0) {
                const addedItem = mapCartItemFromApi(response.data[0]);
                logCartOperation('ADD_TO_CART', 'ITEM_SUCCESS', { item: addedItem });
                results.push({ success: true, message: SUCCESS_MESSAGES.ITEM_ADDED, item: addedItem });
            }
            // 处理重复添加错误
            else if (isDuplicateKeyError(response)) {
                 logCartOperation('ADD_TO_CART', 'ITEM_DUPLICATE_ERROR', { item: itemToAdd, response });
                 results.push({ success: false, message: ERROR_MESSAGES.DUPLICATE_ITEM, item: itemToAdd });
            }
            // 处理其他错误
            else {
                const errorMessage = (response && response.message) || (response && response.error) || ERROR_MESSAGES.FAILED_TO_ADD;
                logCartOperation('ADD_TO_CART', 'ITEM_FAILED', { item: itemToAdd, error: errorMessage, response });
                results.push({ success: false, message: errorMessage, item: itemToAdd });
            }
        } catch (itemError) {
             // Handle network errors or errors thrown by authenticatedRequest
             const errorMessage = itemError.message || ERROR_MESSAGES.FAILED_TO_ADD;
             logCartOperation('ADD_TO_CART', 'ITEM_REQUEST_FAILED', { item: itemToAdd, error: errorMessage, originalError: itemError });
             results.push({ success: false, message: errorMessage, item: itemToAdd });
        }
    }
    // --- End New ---

    logCartOperation('ADD_TO_CART', 'FINISHED', { totalItemsProcessed: itemsArray.length, successfulItems: results.filter(r => r.success).length });
    return results; // 返回所有项目的处理结果数组

  } catch (error) {
    // Handle errors during user validation or initial setup
    console.error("[CartService] Error in addToCart:", error);
    logCartOperation('ADD_TO_CART', 'FAILED', { error: error.message });
    throw error; // Re-throw the error for the calling component to handle
  }
};