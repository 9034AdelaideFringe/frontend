import { getCurrentUser } from '../authService/user-service';
import { ERROR_MESSAGES, DEFAULT_VALUES } from './config';

/**
 * 验证用户身份并获取用户ID
 * @returns {string} 用户ID
 * @throws {Error} 如果用户未登录或ID缺失
 */
export const validateUserAndGetId = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error(ERROR_MESSAGES.USER_NOT_LOGGED_IN);
  }

  const userId = currentUser.user_id;
  if (!userId) {
    console.warn("用户ID缺失，无法执行购物车操作", currentUser);
    throw new Error(ERROR_MESSAGES.USER_ID_NOT_FOUND);
  }

  return userId;
};

/**
 * 映射后端购物车项目到前端格式
 * @param {Object} item - 后端返回的购物车项目
 * @returns {Object} 前端格式的购物车项目
 */
export const mapCartItemFromApi = (item) => ({
  id: item.cart_item_id,
  cartItemId: item.cart_item_id,
  ticketTypeId: item.ticket_type_id,
  userId: item.user_id,
  quantity: parseInt(item.quantity, 10) || 0, // Ensure quantity is a number
  seat: item.seat || null, // Include seat field
  addedAt: item.added_at,

  // 设置默认值，这些字段需要从其他API获取
  // Assuming backend provides nested event and ticket type details
  eventName: item.event?.title || DEFAULT_VALUES.EVENT_NAME,
  eventImage: item.event?.image || DEFAULT_VALUES.EVENT_IMAGE,
  eventDate: item.event?.date || DEFAULT_VALUES.DATE, // Changed from 'date' to 'eventDate' for clarity
  eventTime: item.event?.time || DEFAULT_VALUES.TIME, // Changed from 'time' to 'eventTime' for clarity
  eventVenue: item.event?.venue || DEFAULT_VALUES.VENUE, // Changed from 'venue' to 'eventVenue' for clarity
  ticketName: item.ticket_type?.name || DEFAULT_VALUES.TICKET_TYPE_NAME, // Changed from 'TICKET_NAME' to 'TICKET_TYPE_NAME'
  ticketDescription: item.ticket_type?.description || '',
  pricePerTicket: parseFloat(item.ticket_type?.price) || DEFAULT_VALUES.PRICE,
  totalPrice: (parseFloat(item.ticket_type?.price) || DEFAULT_VALUES.PRICE) * (parseInt(item.quantity, 10) || 0),
  availableQuantity: item.ticket_type?.available_quantity !== undefined ? item.ticket_type.available_quantity : 0,
});


/**
 * 创建添加到购物车请求体
 * @param {Object} params - 参数对象
 * @param {string} params.userId - 用户ID
 * @param {string} params.ticketTypeId - 票种ID
 * @param {number} params.quantity - 数量 (应为 1)
 * @param {string} [params.seat] - 座位信息 (可选，对于选座票必须提供)
 * @returns {Object} 请求体
 */
export const createCartRequestBody = ({ userId, ticketTypeId, quantity, seat }) => {
  const body = {
    user_id: userId,
    ticket_type_id: ticketTypeId,
    quantity: String(quantity), // Ensure quantity is a string ("1")
  };
  // --- New: Add seat to body if provided ---
  if (seat) {
      body.seat = seat;
  }
  // --- End New ---
  return body;
};


/**
 * 检查API响应是否表示成功
 * @param {Object} response - API响应对象
 * @returns {boolean} 是否成功
 */
export const isApiResponseSuccess = (response) => {
  // 根据您的API实际成功判断逻辑调整
  // 常见的成功状态码是 2xx，或者响应体中有 success: true 或 message: "ok"
  // 这里假设成功的响应有一个 message 字段且不包含明显的错误指示
  return response && (response.message === 'ok' || response.success === true || (response.data !== undefined && response.error === undefined));
};

/**
 * 检查API响应是否表示重复键错误 (例如，重复添加相同的票种/座位)
 * @param {Object} response - API响应对象
 * @returns {boolean} 是否是重复键错误
 */
export const isDuplicateKeyError = (response) => {
  // 根据您的API实际重复键错误判断逻辑调整
  // 例如，后端可能返回特定的错误码或错误消息
  return response && response.error && response.error.includes('duplicate key'); // 示例：检查错误消息是否包含 'duplicate key'
};

/**
 * 记录购物车操作日志
 * @param {string} operation - 操作类型 (e.g., 'ADD_TO_CART', 'REMOVE_FROM_CART')
 * @param {string} status - 状态 ('STARTED', 'FINISHED', 'FAILED')
 * @param {Object} [details] - 附加详情
 */
export const logCartOperation = (operation, status, details) => {
  console.log(`[CartService] ${operation} ${status}`, details || '');
};