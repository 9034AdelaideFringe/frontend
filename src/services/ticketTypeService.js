import { getApiUrl, handleApiResponse, getRequestOptions } from './eventService/config/apiConfig';

// 票种数据缓存 (按事件ID缓存)
let ticketTypeCache = {};
// 所有票种数据缓存
let allTicketTypesCache = null;
const ALL_TICKET_TYPES_CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30分钟

/**
 * 清除票种缓存
 * @param {string} eventId - 可选，指定事件的ID。如果不提供，清除所有票种缓存
 */
export const clearTicketTypeCache = (eventId) => {
  if (eventId) {
    delete ticketTypeCache[eventId];
  } else {
    ticketTypeCache = {};
    allTicketTypesCache = null; // 清除所有票种缓存
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
      return ticketTypeCache[eventId];
    }
    
    // 注意：这里调用的是 /ticket-type/{eventId} 端点
    const response = await fetch(getApiUrl(`/ticket-type/${eventId}`), {
      method: 'GET',
      ...getRequestOptions()
    });
    
    const result = await handleApiResponse(response, '获取票种列表');
    
    // 格式化返回的数据，确保字段名一致
    let ticketTypes = [];
    
    if (result && result.data && Array.isArray(result.data)) {
      ticketTypes = result.data.map(ticket => ({
        id: ticket.ticket_type_id,
        ticket_type_id: ticket.ticket_type_id, // 保留原始字段
        event_id: ticket.event_id,
        name: ticket.name,
        description: ticket.description || '',
        price: ticket.price,
        available_quantity: ticket.available_quantity,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));
    }
    
    // 更新缓存
    ticketTypeCache[eventId] = ticketTypes;
    
    return ticketTypes;
  } catch (error) {
    throw error;
  }
};

/**
 * 根据ticket_type_id获取票种详细信息
 * 注意：这个函数目前遇到CORS问题，我们将改用获取所有票种的方式
 * @param {string} ticketTypeId - 票种ID
 * @returns {Promise<Object>} 票种信息
 */
export const getTicketTypeById = async (ticketTypeId) => {
  try {
    const allTicketTypes = await getAllTicketTypesAPI(); // 调用新函数获取所有票种
    const foundTicketType = allTicketTypes.find(type => type.ticket_type_id === ticketTypeId);

    if (foundTicketType) {
      return foundTicketType;
    } else {
      return null;
    }
  } catch (error) {
    throw error; // 重新抛出错误
  }
};


/**
 * **新增：获取所有票种信息**
 * 假设存在一个端点可以获取所有票种
 * @returns {Promise<Array>} 所有票种信息数组
 */
export const getAllTicketTypesAPI = async () => {
  // 检查缓存
  if (allTicketTypesCache && (Date.now() - allTicketTypesCache.timestamp < ALL_TICKET_TYPES_CACHE_EXPIRY_MS)) {
    return allTicketTypesCache.data;
  }
  
  try {
    // **假设端点是 /api/ticket-type**
    // 如果您的后端端点不同，请修改这里
    const response = await fetch(getApiUrl(`/ticket-type`), {
      method: 'GET',
      ...getRequestOptions()
    });
    
    const result = await handleApiResponse(response, '获取所有票种');

    let allTicketTypes = [];

    if (result && result.data && Array.isArray(result.data)) {
      // 格式化返回数据，确保字段名一致
      allTicketTypes = result.data.map(ticket => ({
        id: ticket.ticket_type_id, // 使用 ticket_type_id 作为前端的 id
        ticket_type_id: ticket.ticket_type_id, // 保留原始字段
        event_id: ticket.event_id,
        name: ticket.name,
        description: ticket.description || '',
        price: ticket.price,
        available_quantity: ticket.available_quantity,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));
      
      // 更新所有票种缓存
      allTicketTypesCache = {
        data: allTicketTypes,
        timestamp: Date.now()
      };

      return allTicketTypes;
    } else {
      return [];
    }
  } catch (error) {
    throw error; // 重新抛出错误
  }
};


/**
 * 批量获取多个票种信息
 * 注意：这个函数现在会调用 getTicketTypeById，而 getTicketTypeById 会调用 getAllTicketTypesAPI
 * @param {Array<string>} ticketTypeIds - 票种ID数组
 * @returns {Promise<Array>} 票种信息数组
 */
export const getMultipleTicketTypes = async (ticketTypeIds) => {
  try {
    // 调用获取所有票种的函数一次
    const allTicketTypes = await getAllTicketTypesAPI();

    // 从所有票种中筛选出需要的
    const neededTicketTypes = allTicketTypes.filter(type => 
      ticketTypeIds.includes(type.ticket_type_id)
    );

    return neededTicketTypes;
  } catch (error) {
    throw error;
  }
};