import { formatDateRange, formatTimeRange } from './dateFormatter';
import { DEFAULT_IMAGE } from './config/apiConfig';

/**
 * 将API数据属性映射成前端需要的格式
 * @param {Object} apiEvent - API返回的原始事件数据
 * @returns {Object} 格式化后的事件数据
 */
export const mapEventData = (apiEvent) => {
  
  // 日期和时间处理
  let dateValue = apiEvent.date;
  let timeValue = apiEvent.time;
  
  // 如果有start/end字段但没有直接的date/time字段，才使用formatDateRange
  if (!dateValue && apiEvent.start) {
    dateValue = formatDateRange(apiEvent.start, apiEvent.end);
  }
  
  if (!timeValue && apiEvent.start) {
    timeValue = formatTimeRange(apiEvent.start, apiEvent.end);
  }
  
  // 座位布局字段处理
  const venueSeatingLayout = apiEvent.venueseatinglayout || apiEvent.venueSeatingLayout || '';
  
  const mappedEvent = {
    // 优先使用event_id，因为这是API返回的主键
    id: apiEvent.event_id || apiEvent.id,
    event_id: apiEvent.event_id || apiEvent.id, // 保留原始ID字段
    title: apiEvent.title || 'Untitled Event',
    // 提取描述的第一句作为摘要
    abstract: apiEvent.des ? (apiEvent.des.split('.')[0] + '.') : 'No description available.',
    // 保留原始描述字段
    des: apiEvent.des,
    description: apiEvent.description || apiEvent.des || 'No description available.',
    short_description: apiEvent.short_description || '',
    // 优先使用API提供的图片，如果没有则使用默认图片
    image: apiEvent.image || DEFAULT_IMAGE,
    // 场地座位布局图 - 保留原始字段名，避免丢失数据
    venueseatinglayout: apiEvent.venueseatinglayout || '',
    venueSeatingLayout: venueSeatingLayout,
    // 使用原始日期时间数据
    date: dateValue || apiEvent.date || 'Date TBA',
    time: timeValue || apiEvent.time || 'Time TBA',
    end_time: apiEvent.end_time || '',
    venue: apiEvent.venue || 'TBA',
    // 格式化价格
    price: apiEvent.price ? `$${apiEvent.price}` : 'Free',
    // 添加额外属性
    location: apiEvent.location || '',
    capacity: apiEvent.capacity || '0',
    category: apiEvent.category || '',
    status: apiEvent.status || 'ACTIVE',
    // 添加原始时间戳
    created_at: apiEvent.created_at || apiEvent.createdAt,
    updated_at: apiEvent.updated_at || apiEvent.updatedAt,
    createdAt: apiEvent.created_at || apiEvent.createdAt,
    updatedAt: apiEvent.updated_at || apiEvent.updatedAt,
    // 保留原始字段
    startRaw: apiEvent.start,
    endRaw: apiEvent.end,
    // 票种信息
    ticketTypes: apiEvent.ticketTypes || []
  };
  
  return mappedEvent;
};

/**
 * 将前端事件数据转换为API期望的格式
 * @param {Object} eventData - 前端事件数据
 * @param {string} id - 可选的事件ID
 * @returns {Object} API格式的事件数据
 */
export const prepareEventDataForApi = (eventData, id = null) => {
  console.log('准备提交事件数据:', JSON.stringify(eventData, null, 2));
  
  const apiEventData = {
    title: eventData.title,
    des: eventData.description || eventData.des,
    short_description: eventData.short_description,
    image: eventData.image,
    // 使用原始字段名，确保API能正确接收
    venueseatinglayout: eventData.venueSeatingLayout || eventData.venueseatinglayout,
    date: eventData.date,
    time: eventData.time,
    end_time: eventData.end_time,
    venue: eventData.venue,
    capacity: eventData.capacity || '100',
    category: eventData.category,
    status: eventData.status || 'ACTIVE'
  };
  
  // 如果提供了ID，添加到数据中
  if (id) {
    apiEventData.id = id;
  }
  
  // 如果有票种数据，也添加到请求中
  if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
    apiEventData.ticketTypes = eventData.ticketTypes;
  }
  
  console.log('格式化后的API提交数据:', JSON.stringify(apiEventData, null, 2));
  return apiEventData;
};