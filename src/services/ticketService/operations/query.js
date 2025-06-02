// 从 authService 导入 authenticatedRequest
import { authenticatedRequest } from '../../authService';
// 从 ticketService 的 utils 中导入 validateUserAndGetId 和 isApiResponseSuccess
import { validateUserAndGetId, isApiResponseSuccess, mapApiTicketToFrontend } from '../utils';

import { TICKET_ENDPOINTS, ERROR_MESSAGES } from '../config';

// 导入 eventService 和 ticketTypeService 的相关函数
import { getEventById } from '../../eventService';
import { getMultipleTicketTypes } from '../../ticketTypeService';

/**
 * 获取当前用户的所有票据并丰富事件和票种信息
 * @returns {Promise<Array>} 用户票据 (已丰富信息)
 */
export const getUserTickets = async () => {
  try {
    // 1. 验证用户并获取用户ID (使用 ticketService/utils 中实现的函数)
    const userId = validateUserAndGetId(); // This will throw if user is not logged in

    // 2. 构建 API URL
    const url = TICKET_ENDPOINTS.GET_USER_TICKETS(userId);

    // 3. 调用 authenticatedRequest 发送请求获取原始票据数据
    const apiResponse = await authenticatedRequest(url, {
      method: 'GET',
    });

    // 4. 处理 API 响应
    let rawApiTickets = [];
    if (isApiResponseSuccess(apiResponse) && apiResponse.data && Array.isArray(apiResponse.data)) {
       rawApiTickets = apiResponse.data;
    } else if (isApiResponseSuccess(apiResponse) && Array.isArray(apiResponse)) {
        // Handle case where API directly returns an array without a 'data' wrapper
        rawApiTickets = apiResponse;
    }
    else {
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.FAILED_TO_FETCH_TICKETS);
    }

    if (rawApiTickets.length === 0) {
        return []; // Return empty array if no tickets
    }

    // 5. 提取所有唯一的 event_id 和 ticket_type_id
    const uniqueEventIds = [...new Set(rawApiTickets.map(ticket => ticket.event_id).filter(id => id != null && id !== ''))];
    const uniqueTicketTypeIds = [...new Set(rawApiTickets.map(ticket => ticket.ticket_type_id).filter(id => id != null && id !== ''))];

    // 6. 并行获取事件和票种详细信息
    let events = [];
    let ticketTypes = [];
    try {
        // 使用 Promise.all 并行调用 getEventById 获取每个事件的详细信息
        if (uniqueEventIds.length > 0) {
             const eventPromises = uniqueEventIds.map(id =>
                 // 调用 getEventById，并捕获可能的错误，返回 null 以便过滤
                 getEventById(id).catch(() => null) // 返回 null 或 undefined，以便后续过滤
             );
             // 等待所有 Promise 完成，并过滤掉获取失败的事件，使用 .flat() 将结果数组展平
             events = (await Promise.all(eventPromises)).filter(event => event != null).flat();
        }

        // 使用 ticketTypeService 的 getMultipleTicketTypes 函数获取票种信息
        if (uniqueTicketTypeIds.length > 0) {
            ticketTypes = await getMultipleTicketTypes(uniqueTicketTypeIds);
        }
    } catch (fetchDetailsError) {
        // 为了不阻止票据显示，我们选择记录错误并继续，但某些信息可能缺失
        // throw fetchDetailsError; // 如果希望严格处理错误则抛出
    }

    // 7. 构建事件和票种的映射 Map
    const eventMap = new Map(events.map(event => [event.event_id, event]));
    const ticketTypeMap = new Map(ticketTypes.map(ticketType => [ticketType.ticket_type_id, ticketType]));

    // 8. 映射并丰富 API 数据到前端格式
    const frontendTickets = rawApiTickets.map(apiTicket => {
        const mappedTicket = mapApiTicketToFrontend(apiTicket, eventMap, ticketTypeMap);
        return mappedTicket;
    });

    return frontendTickets;

  } catch (error) {
    throw error;
  }
};

/**
 * 获取票据详情
 * Note: This function fetches ALL user tickets and filters client-side.
 * If performance is critical for single ticket lookup, a dedicated backend endpoint GET /api/ticket/{ticket_id} is recommended.
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Object>} 票据详情
 */
export const getTicketById = async (ticketId) => {
  try {
    // Fetch all user tickets (which now fetches for the current user via API and enriches data)
    const userTickets = await getUserTickets();

    // Find the specific ticket client-side
    const ticket = userTickets.find(t => t.id === ticketId);

    if (ticket) {
      return ticket;
    } else {
      // 抛出明确的错误
      const notFoundError = new Error(ERROR_MESSAGES.TICKET_NOT_FOUND);
      notFoundError.status = 404; // Use 404 status for consistency
      throw notFoundError;
    }
  } catch (error) {
    throw error;
  }
};