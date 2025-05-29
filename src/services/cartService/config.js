/**
 * 购物车服务配置
 */

// API 端点
export const CART_ENDPOINTS = {
  GET_CART: (userId) => `/cart/${userId}`,
  ADD_TO_CART: '/cart',
  UPDATE_CART_ITEM:  `/cart`,
  REMOVE_FROM_CART: `/cart`,
  CHECKOUT: '/checkout'
};

// 错误消息
export const ERROR_MESSAGES = {
  USER_NOT_LOGGED_IN: 'User not logged in',
  USER_ID_NOT_FOUND: 'User ID not found',
  DUPLICATE_ITEM: 'This ticket type is already in your cart. Please go to your cart to update the quantity instead.',
  INVALID_RESPONSE: 'Invalid API response format',
  FAILED_TO_ADD: 'Failed to add item to cart',
  FAILED_TO_UPDATE: 'Failed to update item quantity',
  FAILED_TO_REMOVE: 'Failed to remove item from cart',
  CART_EMPTY: 'Cart is empty'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Item added successfully',
  ITEM_UPDATED: 'Item quantity updated successfully',
  ITEM_REMOVED: 'Item removed successfully',
  CHECKOUT_SUCCESS: 'Checkout completed successfully'
};

// 默认值
export const DEFAULT_VALUES = {
  EVENT_NAME: 'Event Name',
  EVENT_IMAGE: '/default-event-image.jpg',
  TICKET_NAME: 'Standard Ticket',
  DATE: 'TBD',
  TIME: 'TBD',
  VENUE: 'TBD',
  PRICE: 0
};