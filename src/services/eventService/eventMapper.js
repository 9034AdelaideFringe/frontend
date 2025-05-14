import { formatDateRange, formatTimeRange } from './dateFormatter';
import { DEFAULT_IMAGE } from './config/apiConfig';

/**
 * 将API数据属性映射成前端需要的格式
 * @param {Object} apiEvent - API返回的原始事件数据
 * @returns {Object} 格式化后的事件数据
 */
export const mapEventData = (apiEvent) => {
  return {
    id: apiEvent.event_id,
    title: apiEvent.title || 'Untitled Event',
    // 提取描述的第一句作为摘要
    abstract: apiEvent.des ? (apiEvent.des.split('.')[0] + '.') : 'No description available.',
    // 优先使用API提供的图片，如果没有则使用默认图片
    image: apiEvent.image || DEFAULT_IMAGE,
    // 场地座位布局图
    venueSeatingLayout: apiEvent.venueSeatingLayout || '',
    description: apiEvent.des || 'No description available.',
    short_description: apiEvent.short_description || '',
    // 格式化日期
    date: formatDateRange(apiEvent.start, apiEvent.end),
    // 从日期时间中提取时间部分
    time: formatTimeRange(apiEvent.start, apiEvent.end),
    venue: apiEvent.venue || 'TBA',
    // 格式化价格
    price: apiEvent.price ? `$${apiEvent.price}` : 'Free',
    // 添加额外属性
    location: apiEvent.location || '',
    capacity: apiEvent.capacity || '0',
    category: apiEvent.category || '',
    status: apiEvent.status || 'ACTIVE',
    // 添加原始时间戳
    createdAt: apiEvent.createdAt,
    updatedAt: apiEvent.updatedAt,
    startRaw: apiEvent.start,
    endRaw: apiEvent.end
  };
};

/**
 * 将前端事件数据转换为API期望的格式
 * @param {Object} eventData - 前端事件数据
 * @param {string} id - 可选的事件ID
 * @returns {Object} API格式的事件数据
 */
export const prepareEventDataForApi = (eventData, id = null) => {
  const apiEventData = {
    title: eventData.title,
    des: eventData.description,
    short_description: eventData.short_description,
    image: eventData.image,
    venueSeatingLayout: eventData.venueSeatingLayout,
    date: eventData.date,
    time: eventData.time,
    end_time: eventData.end_time,
    venue: eventData.venue,
    capacity: eventData.capacity || '100',
    category: eventData.category,
    status: 'ACTIVE'
  };
  
  // 如果提供了ID，添加到数据中
  if (id) {
    apiEventData.id = id;
  }
  
  // 如果有票种数据，也添加到请求中
  if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
    apiEventData.ticketTypes = eventData.ticketTypes;
  }
  
  return apiEventData;
};