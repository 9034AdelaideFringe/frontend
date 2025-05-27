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
  quantity: parseInt(item.quantity),
  addedAt: item.added_at,
  
  // 设置默认值，这些字段需要从其他API获取
  eventName: DEFAULT_VALUES.EVENT_NAME,
  eventImage: DEFAULT_VALUES.EVENT_IMAGE,
  date: DEFAULT_VALUES.DATE,
  time: DEFAULT_VALUES.TIME,
  venue: DEFAULT_VALUES.VENUE,
  ticketName: DEFAULT_VALUES.TICKET_NAME,
  pricePerTicket: DEFAULT_VALUES.PRICE,
  totalPrice: DEFAULT_VALUES.PRICE
});

/**
 * 检查API响应是否成功
 * @param {Object} response - API响应
 * @returns {boolean} 是否成功
 */
export const isApiResponseSuccess = (response) => {
  return response && response.message === "ok";
};

/**
 * 检查是否为重复键错误
 * @param {Object} response - API响应
 * @returns {boolean} 是否为重复键错误
 */
export const isDuplicateKeyError = (response) => {
  return response && response.error && response.error.includes('duplicate key');
};

/**
 * 生成请求体
 * @param {Object} params - 参数
 * @returns {Object} 请求体
 */
export const createCartRequestBody = ({ userId, ticketTypeId, quantity }) => ({
  user_id: userId,
  ticket_type_id: ticketTypeId,
  quantity: String(quantity)
});

/**
 * 记录操作日志
 * @param {string} operation - 操作名称
 * @param {string} stage - 阶段 (STARTED/FINISHED)
 * @param {Object} data - 附加数据
 */
export const logCartOperation = (operation, stage, data = {}) => {
  const message = `=== CART SERVICE: ${operation.toUpperCase()} ${stage.toUpperCase()} ===`;
  console.log(message, data);
};