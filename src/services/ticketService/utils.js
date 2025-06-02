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
 * Maps an API ticket object to the frontend ticket structure, enriching with event and ticket type details.
 * @param {Object} apiTicket - The ticket object from the API.
 * @param {Map<string, Object>} eventMap - Map from event_id to event object.
 * @param {Map<string, Object>} ticketTypeMap - Map from ticket_type_id to ticket type object.
 * @returns {Object} The mapped and enriched ticket object for the frontend.
 */
export const mapApiTicketToFrontend = (apiTicket, eventMap = new Map(), ticketTypeMap = new Map()) => {
  if (!apiTicket) {
    console.log('[ticketService/utils.js] mapApiTicketToFrontend received null/undefined');
    return null;
  }

  // 从映射中查找事件和票种信息
  const event = eventMap.get(apiTicket.event_id);
  const ticketType = ticketTypeMap.get(apiTicket.ticket_type_id);

  // 使用查找到的信息或默认值
  const eventName = event ? event.title || event.name : DEFAULT_VALUES.EVENT_NAME; // 假设事件对象有 title 或 name 字段
  const venue = event ? event.venue : DEFAULT_VALUES.VENUE; // 假设事件对象有 venue 字段
  const ticketTypeName = ticketType ? ticketType.name : DEFAULT_VALUES.TICKET_TYPE_NAME; // 假设票种对象有 name 字段

  // 尝试从事件对象获取日期和时间，如果票据对象没有提供
  const eventDate = apiTicket.event_date || (event ? event.date : null);
  const eventTime = apiTicket.event_time || (event ? event.time : null);


  return {
    id: apiTicket.ticket_id, // Frontend ID
    ticketId: apiTicket.ticket_id, // Keep original API field name as well
    eventId: apiTicket.event_id,
    orderId: apiTicket.order_id,

    // 使用查找到的事件和票种信息进行填充
    eventName: eventName,
    date: eventDate ? new Date(eventDate).toLocaleDateString() : (apiTicket.issue_date ? new Date(apiTicket.issue_date).toLocaleDateString() : DEFAULT_VALUES.DATE),
    time: eventTime ? new Date(`1970-01-01T${eventTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (apiTicket.issue_date ? new Date(apiTicket.issue_date).toLocaleTimeString() : DEFAULT_VALUES.TIME),
    venue: venue,
    ticketType: ticketTypeName,

    ticketTypeId: apiTicket.ticket_type_id,
    quantity: apiTicket.quantity || 1, // Assuming API provides quantity, default to 1
    pricePerTicket: parseFloat(apiTicket.price_per_ticket || apiTicket.total_amount || (ticketType ? ticketType.price : 0)), // 优先使用 ticket_type 的价格
    totalPrice: parseFloat(apiTicket.total_price || apiTicket.total_amount || (ticketType ? ticketType.price * (apiTicket.quantity || 1) : 0)), // 优先使用 ticket_type 的价格 * 数量
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