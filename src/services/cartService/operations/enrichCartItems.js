import { getMultipleTicketTypes } from '../../ticketTypeService';
import { getMultipleCachedEvents } from '../../eventCacheService';
import { DEFAULT_VALUES } from '../config';
// 导入默认图片和图片基础URL
import { DEFAULT_IMAGE} from '../../shared/apiConfig';
const IMAGE_BASE_URL = import.meta.env.VITE_APP_IMAGE_BASE_URL; // **从环境变量读取**


/**
 * 根据图片路径获取完整的图片URL
 * @param {string} imagePath - 原始图片路径 (例如 "./images/...")
 * @returns {string} 完整的图片URL或默认图片URL
 */
const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return DEFAULT_IMAGE; // 如果没有图片路径，返回默认图片
  }

  // 如果 imagePath 已经是完整的 http 或 https URL，直接返回
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 确保 IMAGE_BASE_URL 存在
  if (!IMAGE_BASE_URL) {
      return DEFAULT_IMAGE; // 如果环境变量未设置，返回默认图片
  }

  // 清理路径，移除开头的 ./ 或 /
  const cleanPath = imagePath.replace(/^\.\//, "").replace(/^\/+/, "");

  // 拼接基础URL和清理后的路径
  // 确保基础URL没有尾部斜杠，清理后的路径没有头部斜杠，避免双斜杠
  const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const finalPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

  return `${baseUrl}/${finalPath}`;
};


/**
 * 丰富购物车项目信息
 * @param {Array} cartItems - 基础购物车项目
 * @returns {Promise<Array>} 包含完整信息的购物车项目
 */
export const enrichCartItems = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return [];
  }

  try {
    // 提取所有票种ID
    const ticketTypeIds = [...new Set(cartItems.map(item => item.ticketTypeId))];

    // 调用 getMultipleTicketTypes，它现在会获取所有票种并筛选
    const ticketTypes = await getMultipleTicketTypes(ticketTypeIds);

    // 创建票种ID到票种信息的映射
    const ticketTypeMap = new Map();
    ticketTypes.forEach(ticketType => {
      // 使用 ticket_type_id 作为 Map 的键
      if (ticketType && ticketType.ticket_type_id) {
         ticketTypeMap.set(ticketType.ticket_type_id, ticketType);
      }
    });

    // 提取所有事件ID (从获取到的票种信息中提取)
    // Ensure ticketType.event_id is valid before adding to eventIds
    const eventIds = [...new Set(ticketTypes.map(tt => tt.event_id).filter(id => id != null && id !== ''))]; // 过滤掉 null 或 undefined 的 event_id

    // 批量获取事件信息（优先从缓存）
    // getMultipleCachedEvents 内部会调用 getEventById 或 getMultipleEventsByIds
    const events = await getMultipleCachedEvents(eventIds);

    // 创建事件ID到事件信息的映射
    const eventMap = new Map();
    if (Array.isArray(events)) {
        events.forEach(item => { // Renamed 'event' to 'item' for clarity in this loop
            // 检查 item 是否是数组，如果是则取第一个元素
            const event = Array.isArray(item) && item.length > 0 ? item[0] : item;

            // Assuming event object has an event_id property and other necessary properties (title, image, etc.)
            if (event && event.event_id) {
                eventMap.set(event.event_id, event);
            }
        });
    }

    // 丰富购物车项目信息
    const enrichedItems = cartItems.map(cartItem => {
      // 使用 cartItem.ticketTypeId 从 Map 中查找对应的票种信息
      const ticketType = ticketTypeMap.get(cartItem.ticketTypeId);
      // 使用 ticketType.event_id 从 Map 中查找对应的事件信息
      const event = ticketType ? eventMap.get(ticketType.event_id) : null;

      // Calculate price
      const pricePerTicket = ticketType && typeof ticketType.price === 'number' ? ticketType.price : DEFAULT_VALUES.PRICE;
      const quantity = typeof cartItem.quantity === 'number' ? cartItem.quantity : parseInt(cartItem.quantity) || 0;
      const totalPrice = pricePerTicket * quantity;

      return {
        ...cartItem,
        // 票种信息
        ticketName: ticketType ? ticketType.name : DEFAULT_VALUES.TICKET_NAME,
        ticketDescription: ticketType ? ticketType.description : '',
        pricePerTicket,
        totalPrice,
        availableQuantity: ticketType && typeof ticketType.available_quantity === 'number' ? ticketType.available_quantity : 0,

        // 事件信息 - Use data from the fetched event object
        eventId: ticketType ? ticketType.event_id : null, // Keep eventId from ticketType
        eventName: event ? event.title : DEFAULT_VALUES.EVENT_NAME, // Assuming event object has 'title'
        // **修改这里：使用 getFullImageUrl 函数来构建完整的图片URL**
        eventImage: event ? getFullImageUrl(event.image) : DEFAULT_VALUES.EVENT_IMAGE,
        eventDescription: event ? event.description : '', // Assuming event object has 'description'
        venue: event ? event.venue : DEFAULT_VALUES.VENUE, // Assuming event object has 'venue'
        date: event ? event.date : DEFAULT_VALUES.DATE, // Assuming event object has 'date'
        time: event ? event.time : DEFAULT_VALUES.TIME, // Assuming event object has 'time'
        category: event ? event.category : '', // Assuming event object has 'category'
        duration: event ? event.duration : '', // Assuming event object has 'duration'
      };
    });

    return enrichedItems;

  } catch (error) {
    // 返回原始数据，add default values to ensure structure
    return cartItems.map(item => ({
        ...item,
        // Add default values if enrichment failed or data was missing
        eventName: item.eventName || DEFAULT_VALUES.EVENT_NAME,
        // **修改这里：对默认图片也应用 getFullImageUrl，尽管它通常是完整URL**
        eventImage: getFullImageUrl(item.eventImage || DEFAULT_VALUES.EVENT_IMAGE),
        date: item.date || DEFAULT_VALUES.DATE,
        time: item.time || DEFAULT_VALUES.TIME,
        venue: item.venue || DEFAULT_VALUES.VENUE,
        ticketName: item.ticketName || DEFAULT_VALUES.TICKET_NAME,
        pricePerTicket: item.pricePerTicket || DEFAULT_VALUES.PRICE,
        totalPrice: item.totalPrice || (item.quantity * (item.pricePerTicket || DEFAULT_VALUES.PRICE)),
        availableQuantity: item.availableQuantity || 0,
    }));
  }
};