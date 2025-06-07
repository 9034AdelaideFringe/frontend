// 从 authService 导入 authenticatedRequest
import { authenticatedRequest } from '../../authService';
// 从 ticketService 的 utils 中导入 validateUserAndGetId 和 isApiResponseSuccess, mapApiTicketToFrontend
import { validateUserAndGetId, isApiResponseSuccess, mapApiTicketToFrontend } from '../utils';

import { TICKET_ENDPOINTS, ERROR_MESSAGES } from '../config';

/**
 * 获取当前用户的所有票据 (后端已丰富信息)
 * @returns {Promise<Array>} 用户票据 (已丰富信息)
 */
export const getUserTickets = async () => {
  try {
    // 1. 验证用户并获取用户ID (使用 ticketService/utils 中实现的函数)
    const userId = validateUserAndGetId(); // This will throw if user is not logged in

    // 2. 构建 API URL
    const url = TICKET_ENDPOINTS.GET_USER_TICKETS(userId);

    // 3. 调用 authenticatedRequest 发送请求获取原始票据数据 (现在包含嵌套详情)
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

    // 5. 移除获取唯一ID和并行获取详情的逻辑，因为数据已在 rawApiTickets 中

    // 6. 移除构建映射 Map 的逻辑

    // 7. 直接映射并丰富 API 数据到前端格式 (mapApiTicketToFrontend 现在处理嵌套结构)
    const frontendTickets = rawApiTickets.map(apiTicket => {
        const mappedTicket = mapApiTicketToFrontend(apiTicket); // Pass only the ticket object
        return mappedTicket;
    }).filter(ticket => ticket !== null); // Filter out any null results from mapping

    return frontendTickets;

  } catch (error) {
    console.error("Error fetching user tickets:", error); // Log the error
    throw error; // Re-throw the error for the component to handle
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

// --- New Function: Fetch occupied seats for an event ---
/**
 * 获取指定事件已被占用的座位列表
 * @param {string} eventId - 事件ID
 * @returns {Promise<Array<{ seat: string, ticket_id: string }>>} 已占用座位列表
 * @throws {Error} 如果获取失败
 */
export const getOccupiedSeatsByEventIdAPI = async (eventId) => {
  if (!eventId) {
    console.error("[ticketQueryService] getOccupiedSeatsByEventIdAPI requires an event ID.");
    throw new Error("Event ID is required.");
  }
  console.log(`[ticketQueryService] Attempting to fetch occupied seats for event ID: ${eventId}`);

  try {
    // 构建 API URL，使用您提供的端点格式
    const url = TICKET_ENDPOINTS.GET_OCCUPIED_SEATS_BY_EVENT_ID(eventId);
    console.log(`[ticketQueryService] API URL for occupied seats: ${url}`);

    const apiResponse = await authenticatedRequest(url, {
      method: 'GET',
    });

    console.log(`[ticketQueryService] Received API response for occupied seats:`, apiResponse);

    // 处理 API 响应
    // 期望的响应格式是 { data: [{ seat: "...", ticket_id: "..." }, ...], message: "ok" }
    if (isApiResponseSuccess(apiResponse) && apiResponse.data && Array.isArray(apiResponse.data)) {
       console.log(`[ticketQueryService] Successfully fetched ${apiResponse.data.length} occupied seats.`);
       // 返回包含 seat 和 ticket_id 的数组
       return apiResponse.data;
    } else {
      console.error('[ticketQueryService] Failed to fetch occupied seats or invalid format:', apiResponse);
      // 抛出包含后端错误消息的错误
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.OCCUPIED_SEATS_FAILED);
    }
  } catch (error) {
    console.error(`[ticketQueryService] Error in getOccupiedSeatsByEventIdAPI for event ID ${eventId}:`, error);
    throw error; // Re-throw the error for the component to handle
  }
};
// --- End New Function ---
