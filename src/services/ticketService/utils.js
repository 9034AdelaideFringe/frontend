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
  console.log('[ticketService/utils.js] isApiResponseSuccess called with response:', response);
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
 * Maps an API ticket object to the frontend ticket structure.
 * Note: Fields like eventName, date, time, venue, ticketType (name)
 * are not directly available in the API response for a ticket and
 * would require separate fetching/enrichment using event_id and ticket_type_id.
 * For now, they will be set to placeholder values or derived simply.
 * @param {Object} apiTicket - The ticket object from the API.
 * @returns {Object} The mapped ticket object for the frontend.
 */
export const mapApiTicketToFrontend = (apiTicket) => {
  console.log('[ticketService/utils.js] mapApiTicketToFrontend called with:', apiTicket); // Log function call
  if (!apiTicket) {
    console.log('[ticketService/utils.js] mapApiTicketToFrontend received null/undefined');
    return null;
  }
  return {
    id: apiTicket.ticket_id, // Frontend ID
    ticketId: apiTicket.ticket_id, // Keep original API field name as well
    eventId: apiTicket.event_id,
    orderId: apiTicket.order_id,
    // Placeholders - these need enrichment from event and ticket type services
    // 或者如果API直接返回这些字段，则使用API的值
    eventName: apiTicket.event_name || DEFAULT_VALUES.EVENT_NAME, // 假设API可能返回 event_name
    date: apiTicket.event_date ? new Date(apiTicket.event_date).toLocaleDateString() : (apiTicket.issue_date ? new Date(apiTicket.issue_date).toLocaleDateString() : DEFAULT_VALUES.DATE), // 假设API可能返回 event_date
    time: apiTicket.event_time ? new Date(`1970-01-01T${apiTicket.event_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (apiTicket.issue_date ? new Date(apiTicket.issue_date).toLocaleTimeString() : DEFAULT_VALUES.TIME), // 假设API可能返回 event_time
    venue: apiTicket.venue_name || DEFAULT_VALUES.VENUE, // 假设API可能返回 venue_name
    ticketType: apiTicket.ticket_type_name || DEFAULT_VALUES.TICKET_TYPE_NAME, // 假设API可能返回 ticket_type_name

    ticketTypeId: apiTicket.ticket_type_id,
    quantity: apiTicket.quantity || 1, // Assuming API provides quantity, default to 1
    pricePerTicket: parseFloat(apiTicket.price_per_ticket || apiTicket.total_amount || 0), // Assuming API provides price_per_ticket or total_amount
    totalPrice: parseFloat(apiTicket.total_price || apiTicket.total_amount || 0), // Assuming API provides total_price or total_amount
    purchaseDate: apiTicket.purchase_date || apiTicket.issue_date, // Use purchase_date if available
    status: apiTicket.status ? apiTicket.status.toLowerCase() : 'unknown',
    qrCode: apiTicket.qr_code,
    expiryDate: apiTicket.expiry_date,
    lastRefundDate: apiTicket.last_refund_date,
    scanDate: apiTicket.scan_date,
    // rawApiData: apiTicket // Optionally keep raw data
  };
};

console.log('[ticketService/utils.js] Module evaluation finished');

// 您可以添加其他工具函数，例如用于日志记录
// export const logTicketOperation = (operation, stage, data = {}) => { ... };