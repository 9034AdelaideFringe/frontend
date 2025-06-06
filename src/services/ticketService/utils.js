console.log('[ticketService/utils.js] Module evaluation started');

import { DEFAULT_VALUES, ERROR_MESSAGES } from './config'; // 导入 ERROR_MESSAGES
import { getCurrentUser } from '../authService/user-service'; // 从 authService 导入 getCurrentUser

// 在 ticketService/utils.js 中定义 isApiResponseSuccess
/**
 * 检查API响应是否成功 (在 ticketService 内部实现)
 * @param {Object} response - API响应
 * @returns {boolean} 是否成功
 */
export const isApiResponseSuccess = (response) => {
  // 假设后端成功响应数据包含 success: true 或没有 error 字段
  // 这个实现应该与 cartService/utils 中的逻辑一致，以确保行为统一
  return response !== undefined && response !== null && (response.success === true || (response.message !== "error" && !response.error));
};

// 在 ticketService/utils.js 中定义 validateUserAndGetId
/**
 * 验证当前用户是否登录并获取用户ID (在 ticketService 内部实现)
 * @returns {string} 当前用户的ID
 * @throws {Error} 如果用户未登录或用户ID不可用
 */
export const validateUserAndGetId = () => {
  console.log('[ticketService/utils.js] Validating user and getting ID');
  const user = getCurrentUser(); // 使用从 authService 导入的 getCurrentUser
  if (!user || !user.user_id) { // 假设用户ID字段是 user_id
    console.error('[ticketService/utils.js] User not authenticated or user ID missing');
    // 抛出与 401 类似的错误，以便上层可以统一处理认证失败
    const authError = new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED || "Authentication required.");
    authError.status = 401;
    throw authError;
  }
  console.log('[ticketService/utils.js] User validated, ID:', user.user_id);
  return user.user_id;
};


/**
 * Maps an API ticket object (with nested details) to the frontend ticket structure.
 * @param {Object} apiTicket - The ticket object from the API with nested event_details, order_details, ticket_type_details.
 * @returns {Object} The mapped and enriched ticket object for the frontend.
 */
export const mapApiTicketToFrontend = (apiTicket) => { // Removed eventMap and ticketTypeMap parameters
  if (!apiTicket) {
    console.log('[ticketService/utils.js] mapApiTicketToFrontend received null/undefined');
    return null;
  }

  // Extract nested details with fallback checks
  const eventDetails = apiTicket.event_details || {};
  const orderDetails = apiTicket.order_details || {};
  const ticketTypeDetails = apiTicket.ticket_type_details || {};

  // Map to frontend structure
  return {
    id: apiTicket.ticket_id, // Use ticket_id as the unique ID
    ticketId: apiTicket.ticket_id, // Keep original API field name as well
    orderId: orderDetails.order_id,
    // userId: orderDetails.user_id, // Optional: if needed in frontend

    // Ticket instance details
    seat: apiTicket.seat || null, // Extract the new seat field
    qrCode: apiTicket.qr_code || null,
    status: apiTicket.status ? apiTicket.status.toLowerCase() : 'unknown',
    issueDate: apiTicket.issue_date || null,
    expiryDate: apiTicket.expiry_date || null,
    lastRefundDate: apiTicket.last_refund_date || null,
    scanDate: apiTicket.scan_date || null,
    // quantity is implicitly 1 per ticket object in this new structure

    // Event Details (flattened for easier access)
    eventId: eventDetails.event_id || null,
    eventName: eventDetails.title || DEFAULT_VALUES.EVENT_NAME,
    eventDate: eventDetails.date || DEFAULT_VALUES.DATE,
    eventTime: eventDetails.time || DEFAULT_VALUES.TIME,
    eventEndTime: eventDetails.end_time || null,
    eventVenue: eventDetails.venue || DEFAULT_VALUES.VENUE,
    eventImage: eventDetails.image || DEFAULT_VALUES.EVENT_IMAGE, // Need to handle base URL in component
    eventCategory: eventDetails.category || null,
    eventStatus: eventDetails.status || 'UNKNOWN', // Event status

    // Ticket Type Details (flattened)
    ticketTypeId: ticketTypeDetails.ticket_type_id || null,
    ticketTypeName: ticketTypeDetails.name || DEFAULT_VALUES.TICKET_TYPE_NAME,
    ticketTypeDescription: ticketTypeDetails.description || '',
    pricePerTicket: parseFloat(ticketTypeDetails.price) || DEFAULT_VALUES.PRICE,
    ticketTypeAvailableQuantity: ticketTypeDetails.available_quantity || 0,

    // Order Details (flattened some key fields)
    orderDate: orderDetails.order_date || null,
    orderTotalAmount: parseFloat(orderDetails.total_amount) || 0,
  };
};

console.log('[ticketService/utils.js] Module evaluation finished');

// 您可以添加其他工具函数，例如用于日志记录
// export const logTicketOperation = (operation, stage, data = {}) => { ... };