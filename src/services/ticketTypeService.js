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
    console.log(`已清除事件ID为 ${eventId} 的票种缓存`);
  } else {
    ticketTypeCache = {};
    allTicketTypesCache = null; // 清除所有票种缓存
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
    
    // 注意：这里调用的是 /ticket-type/{eventId} 端点
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
        ticket_type_id: ticket.ticket_type_id, // 保留原始字段
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

/**
 * 根据ticket_type_id获取票种详细信息
 * 注意：这个函数目前遇到CORS问题，我们将改用获取所有票种的方式
 * @param {string} ticketTypeId - 票种ID
 * @returns {Promise<Object>} 票种信息
 */
export const getTicketTypeById = async (ticketTypeId) => {
  console.log(`获取票种信息 (通过ID): ${ticketTypeId}`);
  
  // **修改：不再直接调用 /ticket-types/{ticketTypeId}**
  // 而是调用获取所有票种的函数，然后进行筛选
  try {
    const allTicketTypes = await getAllTicketTypesAPI(); // 调用新函数获取所有票种
    const foundTicketType = allTicketTypes.find(type => type.ticket_type_id === ticketTypeId);

    if (foundTicketType) {
      console.log(`在所有票种中找到 ${ticketTypeId}:`, foundTicketType);
      return foundTicketType;
    } else {
      console.warn(`未在所有票种中找到 ${ticketTypeId}`);
      return null;
    }
  } catch (error) {
    console.error(`通过ID获取票种 ${ticketTypeId} 失败 (使用所有票种方法):`, error);
    throw error; // 重新抛出错误
  }
};


/**
 * **新增：获取所有票种信息**
 * 假设存在一个端点可以获取所有票种
 * @returns {Promise<Array>} 所有票种信息数组
 */
export const getAllTicketTypesAPI = async () => {
  console.log('获取所有票种信息');

  // 检查缓存
  if (allTicketTypesCache && (Date.now() - allTicketTypesCache.timestamp < ALL_TICKET_TYPES_CACHE_EXPIRY_MS)) {
    console.log('使用所有票种缓存');
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
      console.log(`成功获取 ${result.data.length} 个所有票种`);
      
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
      console.error('无效的所有票种API响应:', result);
      return [];
    }
  } catch (error) {
    console.error('获取所有票种失败:', error);
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
  console.log(`批量获取票种信息 (使用所有票种方法):`, ticketTypeIds);
  
  try {
    // 调用获取所有票种的函数一次
    const allTicketTypes = await getAllTicketTypesAPI();

    // 从所有票种中筛选出需要的
    const neededTicketTypes = allTicketTypes.filter(type => 
      ticketTypeIds.includes(type.ticket_type_id)
    );

    console.log(`从所有票种中筛选出 ${neededTicketTypes.length} 个需要的票种`);
    return neededTicketTypes;

  } catch (error) {
    console.error('批量获取票种信息失败 (使用所有票种方法):', error);
    throw error;
  }
};