console.log('--- Evaluating src/services/ticketService/operations/analytics.js --- START');

// 从 authService 导入 authenticatedRequest
import { authenticatedRequest } from '../../authService';
// 从 ticketService 的 utils 中导入 isApiResponseSuccess
import { isApiResponseSuccess } from '../utils'; // <-- 修改导入路径

import { TICKET_ENDPOINTS, ERROR_MESSAGES } from '../config';
// import { logTicketOperation } from '../utils'; // Uncomment if you add logging utility

/**
 * 获取票务分析数据 (管理员功能)
 * @param {string} timeRange - 'week', 'month', 'year'
 * @returns {Promise<Object>} 分析数据
 */
export const getTicketAnalytics = async (timeRange = 'month') => {
  console.log(`[ticketService/analytics.js] Attempting to get ticket analytics for: ${timeRange}`);
  // logTicketOperation('GET_TICKET_ANALYTICS', 'STARTED', { timeRange });
  try {
    // 1. 构建 API URL
    const url = TICKET_ENDPOINTS.GET_TICKET_ANALYTICS(timeRange);
    console.log(`[ticketService/analytics.js] Sending analytics request to URL: ${url}`);

    // 2. 调用 authenticatedRequest 发送请求
    const apiResponse = await authenticatedRequest(url, {
      method: 'GET', // 假设分析数据是 GET 请求
    });
    console.log(`[ticketService/analytics.js] Received API response for analytics:`, apiResponse);

    // 3. 处理 API 响应 (使用 ticketService/utils 中实现的函数)
    // 假设 API 成功时返回 { success: true, data: { ...analyticsData } } 或直接返回分析数据对象
    if (isApiResponseSuccess(apiResponse) && (apiResponse.data || typeof apiResponse === 'object')) {
       const analyticsData = apiResponse.data || apiResponse; // Adjust based on actual API response structure
       console.log(`[ticketService/analytics.js] Successfully fetched ticket analytics`);
       // logTicketOperation('GET_TICKET_ANALYTICS', 'FINISHED', { timeRange, data: analyticsData });
       // 您可能需要在这里对后端返回的分析数据进行一些格式化或映射
       return analyticsData; // 返回分析数据对象
    } else {
      console.error('[ticketService/analytics.js] Failed to get ticket analytics or invalid format:', apiResponse);
      // logTicketOperation('GET_TICKET_ANALYTICS', 'FAILED', { timeRange, response: apiResponse });
      // 抛出包含后端错误消息的错误
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.ANALYTICS_FAILED);
    }
  } catch (error) {
    console.error(`[ticketService/analytics.js] Error in getTicketAnalytics for ${timeRange}:`, error);
    // logTicketOperation('GET_TICKET_ANALYTICS', 'FAILED', { timeRange, error: error.message });
    // 重新抛出错误
    throw error;
  }
};

console.log('--- getTicketAnalytics function defined ---');
console.log('--- Evaluating src/services/ticketService/operations/analytics.js --- END');