import { getApiUrl, handleApiResponse, getRequestOptions } from './eventService/config/apiConfig';

// 票种数据缓存
let ticketTypeCache = {};

/**
 * 清除票种缓存
 * @param {string} eventId - 可选，指定事件的ID。如果不提供，清除所有票种缓存
 */
export const clearTicketTypeCache = (eventId) => {
  if (eventId) {
    delete ticketTypeCache[eventId];
    console.log(`已清除事件ID为 ${eventId} 的票种缓存`);
  } else {
    ticketTypeCache = {};
    console.log('已清除所有票种缓存');
  }
};

/**
 * 获取指定事件的票种类型
 * @param {string} eventId - 事件ID
 * @param {boolean} forceRefresh - 是否强制刷新缓存
 * @returns {Promise<Array>} 票种列表
 */
export const getTicketTypesByEventIdAPI = async (eventId, forceRefresh = false) => {
  try {
    // 如果缓存中有数据且不需要强制刷新，则使用缓存
    if (!forceRefresh && ticketTypeCache[eventId]) {
      console.log(`使用缓存中的票种数据 (事件ID: ${eventId})`);
      return ticketTypeCache[eventId];
    }

    console.log(`从API获取事件ID为 ${eventId} 的票种类型`);
    
    const response = await fetch(getApiUrl(`/ticket-type/${eventId}`), {
      method: 'GET',
      ...getRequestOptions()
    });
    
    const result = await handleApiResponse(response, '获取票种列表');
    
    // 格式化返回的数据，确保字段名一致
    let ticketTypes = [];
    
    if (result && result.data && Array.isArray(result.data)) {
      console.log(`成功获取 ${result.data.length} 个票种`);
      
      ticketTypes = result.data.map(ticket => ({
        id: ticket.ticket_type_id,
        event_id: ticket.event_id,
        name: ticket.name,
        description: ticket.description || '',
        price: ticket.price,
        available_quantity: ticket.available_quantity,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));
    } else {
      console.log('API响应没有包含票种数据或格式不正确');
    }
    
    // 更新缓存
    ticketTypeCache[eventId] = ticketTypes;
    
    return ticketTypes;
  } catch (error) {
    console.error(`获取票种失败:`, error);
    throw error;
  }
};