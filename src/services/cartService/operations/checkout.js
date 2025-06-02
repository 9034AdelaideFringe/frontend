import { buildApiUrl } from '../../shared/apiConfig';
import { authenticatedRequest } from '../../authService';
import { CART_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import { logCartOperation, isApiResponseSuccess, validateUserAndGetId } from '../utils'; // Added validateUserAndGetId

/**
 * 结账处理 (Finalizes cart items for an order)
 * @param {Array} cartItemsToCheckout - 要结账的购物车项目. Expected item structure: { id: 'cart_item_id', quantity: number, ...otherProps }
 * @returns {Promise<Object>} 结账结果
 */
export const checkout = async (cartItemsToCheckout) => {
  logCartOperation('CHECKOUT', 'STARTED', { itemCount: cartItemsToCheckout?.length });
  
  try {
    // 验证用户并获取ID
    const userId = validateUserAndGetId();

    // 验证输入
    if (!cartItemsToCheckout || cartItemsToCheckout.length === 0) {
      throw new Error(ERROR_MESSAGES.CART_EMPTY);
    }

    // Use the new CHECKOUT endpoint which requires userId
    const apiUrl = buildApiUrl(CART_ENDPOINTS.CHECKOUT(userId)); 
    
    // Prepare the payload for the API
    // Assuming API expects an array of items to be "confirmed" or "finalized"
    const payloadItems = cartItemsToCheckout.map(item => ({
      cart_item_id: item.id, // or item.cartItemId if that's the correct prop name
      quantity: item.quantity
      // ticket_type_id: item.ticketTypeId // Include if your POST /api/cart/{user_id} for checkout needs it
    }));

    const response = await authenticatedRequest(apiUrl, {
      method: 'POST', // This endpoint is a POST
      headers: {
        'Content-Type': 'application/json',
      },
      // Backend might expect the items to finalize, or an empty body if it just finalizes the user's current server-side cart.
      // Sticking with sending items as it's more explicit. Adjust if your backend differs.
      body: JSON.stringify({ items: payloadItems }), 
    });

    logCartOperation('CHECKOUT', 'API_RESPONSE', response);

    // Handle API response
    // The response is a list of cart items and message: "ok"
    if (isApiResponseSuccess(response) && response.data) {
      // Success means the cart items were processed for checkout.
      // No specific order_id is returned from this endpoint.
      const result = {
        success: true,
        message: SUCCESS_MESSAGES.CHECKOUT_SUCCESS, // Or a more generic "Order placed successfully"
        confirmedItems: response.data, // The cart items that were processed
      };
      logCartOperation('CHECKOUT', 'FINISHED', { confirmedItemCount: response.data.length });
      return result;
    } else {
      const errorMessage = (response && response.error) || (response && response.message && response.message !== "ok" ? response.message : ERROR_MESSAGES.INVALID_RESPONSE);
      throw new Error(errorMessage);
    }

  } catch (error) {
    logCartOperation('CHECKOUT', 'FAILED', { error: error.message });
    throw new Error(error.message || 'Checkout process failed');
  }
};