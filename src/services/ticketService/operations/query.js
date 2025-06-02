console.log('--- Evaluating src/services/ticketService/operations/query.js --- START');

// 从 authService 导入 authenticatedRequest
import { authenticatedRequest } from '../../authService';
// 从 ticketService 的 utils 中导入 validateUserAndGetId 和 isApiResponseSuccess
import { validateUserAndGetId, isApiResponseSuccess } from '../utils'; // <-- 修改导入路径

import { TICKET_ENDPOINTS, ERROR_MESSAGES } from '../config';
import { mapApiTicketToFrontend } from '../utils';
// import { logTicketOperation } from '../utils'; // Uncomment if you add logging utility

/**
 * 获取当前用户的所有票据
 * @returns {Promise<Array>} 用户票据
 */
export const getUserTickets = async () => {
  console.log('[ticketService/query.js] Attempting to get tickets for current user');
  // logTicketOperation('GET_USER_TICKETS', 'STARTED');
  try {
    // 1. 验证用户并获取用户ID (使用 ticketService/utils 中实现的函数)
    const userId = validateUserAndGetId(); // This will throw if user is not logged in
    console.log(`[ticketService/query.js] Validated user ID: ${userId}`);

    // 2. 构建 API URL
    const url = TICKET_ENDPOINTS.GET_USER_TICKETS(userId);
    console.log(`[ticketService/query.js] Fetching tickets from URL: ${url}`);

    // 3. 调用 authenticatedRequest 发送请求
    const apiResponse = await authenticatedRequest(url, {
      method: 'GET',
    });
    console.log(`[ticketService/query.js] Received API response for user tickets:`, apiResponse);

    // 4. 处理 API 响应 (使用 ticketService/utils 中实现的函数)
    // 假设 API 成功时返回 { success: true, data: [...] } 或直接返回票据数组
    if (isApiResponseSuccess(apiResponse) && apiResponse.data && Array.isArray(apiResponse.data)) {
       const apiTickets = apiResponse.data;
       console.log(`[ticketService/query.js] Successfully fetched ${apiTickets.length} user tickets`);
       // logTicketOperation('GET_USER_TICKETS', 'FINISHED', { ticketCount: apiTickets.length });

       // 5. 映射 API 数据到前端格式
       const frontendTickets = apiTickets.map(mapApiTicketToFrontend);
       console.log(`[ticketService/query.js] Mapped ${frontendTickets.length} tickets for frontend`);
       return frontendTickets;

    } else if (isApiResponseSuccess(apiResponse) && Array.isArray(apiResponse)) {
        // Handle case where API directly returns an array without a 'data' wrapper
        const apiTickets = apiResponse;
        console.log(`[ticketService/query.js] Successfully fetched ${apiTickets.length} user tickets (direct array)`);
        // logTicketOperation('GET_USER_TICKETS', 'FINISHED', { ticketCount: apiTickets.length });
        const frontendTickets = apiTickets.map(mapApiTicketToFrontend);
        console.log(`[ticketService/query.js] Mapped ${frontendTickets.length} tickets for frontend`);
        return frontendTickets;

    }
    else {
      console.error('[ticketService/query.js] Failed to fetch user tickets or invalid format:', apiResponse);
      // logTicketOperation('GET_USER_TICKETS', 'FAILED', { response: apiResponse });
      // 抛出包含后端错误消息的错误
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.FAILED_TO_FETCH_TICKETS);
    }
  } catch (error) {
    console.error('[ticketService/query.js] Error in getUserTickets:', error);
    // logTicketOperation('GET_USER_TICKETS', 'FAILED', { error: error.message });
    // 重新抛出错误，以便组件可以捕获
    throw error;
  }
};

console.log('--- getUserTickets function defined ---');

/**
 * 获取票据详情
 * Note: This function fetches ALL user tickets and filters client-side.
 * If performance is critical for single ticket lookup, a dedicated backend endpoint GET /api/ticket/{ticket_id} is recommended.
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Object>} 票据详情
 */
export const getTicketById = async (ticketId) => {
  console.log('[ticketService/query.js] Inside getTicketById function');
  // logTicketOperation('GET_TICKET_BY_ID', 'STARTED', { ticketId });
  try {
    // Fetch all user tickets (which now fetches for the current user via API)
    const userTickets = await getUserTickets();

    // Find the specific ticket client-side
    const ticket = userTickets.find(t => t.id === ticketId);

    if (ticket) {
      console.log(`[ticketService/query.js] Successfully found ticket ${ticketId}`);
      // logTicketOperation('GET_TICKET_BY_ID', 'FINISHED', { ticketId });
      return ticket;
    } else {
      console.warn(`[ticketService/query.js] Ticket ${ticketId} not found in user's tickets`);
      // logTicketOperation('GET_TICKET_BY_ID', 'FAILED', { ticketId, error: ERROR_MESSAGES.TICKET_NOT_FOUND });
      // 抛出明确的错误
      const notFoundError = new Error(ERROR_MESSAGES.TICKET_NOT_FOUND);
      notFoundError.status = 404; // Use 404 status for consistency
      throw notFoundError;
    }
  } catch (error) {
    console.error(`[ticketService/query.js] Error in getTicketById for ${ticketId}:`, error);
    // logTicketOperation('GET_TICKET_BY_ID', 'FAILED', { ticketId, error: error.message });
    // 重新抛出错误
    throw error;
  }
};

console.log('--- getTicketById function defined ---');
console.log('--- Evaluating src/services/ticketService/operations/query.js --- END');