console.log('--- Evaluating src/services/ticketService/operations/management.js --- START');

// 从 authService 导入 authenticatedRequest
import { authenticatedRequest } from '../../authService';
// 从 ticketService 的 utils 中导入 isApiResponseSuccess
import { isApiResponseSuccess } from '../utils'; // <-- 修改导入路径

import { TICKET_ENDPOINTS, ERROR_MESSAGES} from '../config';
import { mapApiTicketToFrontend } from '../utils'; // Adjust import path as needed
// import { logTicketOperation } from '../utils'; // Uncomment if you add logging utility

/**
 * 申请退票 (Cancels a ticket)
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Object>} 退票结果
 */
export const refundTicket = async (ticketId) => {
  console.log(`[ticketService/management.js] Attempting to refund ticket: ${ticketId}`);
  // logTicketOperation('REFUND_TICKET', 'STARTED', { ticketId });
  try {
    // 1. 构建 API URL
    const url = TICKET_ENDPOINTS.REFUND_TICKET(ticketId);
    console.log(`[ticketService/management.js] Sending refund request to URL: ${url}`);

    // 2. 调用 authenticatedRequest 发送请求
    const apiResponse = await authenticatedRequest(url, {
      method: 'POST', // 假设退票是 POST 请求
      // 如果后端需要请求体，例如 { ticketId: ticketId }，则添加 body
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ ticketId }),
    });
    console.log(`[ticketService/management.js] Received API response for refund:`, apiResponse);

    // 3. 处理 API 响应 (使用 ticketService/utils 中实现的函数)
    // 假设 API 成功时返回 { success: true, ... }
    if (isApiResponseSuccess(apiResponse)) {
       console.log(`[ticketService/management.js] Refund successful for ticket ${ticketId}`);
       // logTicketOperation('REFUND_TICKET', 'FINISHED', { ticketId, response: apiResponse });
       return apiResponse; // 返回 API 响应，可能包含更新后的票据状态等信息
    } else {
      console.error('[ticketService/management.js] Refund failed based on API response:', apiResponse);
      // logTicketOperation('REFUND_TICKET', 'FAILED', { ticketId, response: apiResponse });
      // 抛出包含后端错误消息的错误
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.REFUND_FAILED);
    }
  } catch (error) {
    console.error(`[ticketService/management.js] Error in refundTicket for ${ticketId}:`, error);
    // logTicketOperation('REFUND_TICKET', 'FAILED', { ticketId, error: error.message });
    // 重新抛出错误，以便组件可以捕获并回滚乐观更新
    throw error;
  }
};

console.log('--- refundTicket function defined ---');

/**
 * 下载票据（例如 QR 码图片或 PDF）
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Blob>} 票据文件 Blob
 */
export const downloadTicket = async (ticketId) => {
  console.log(`[ticketService/management.js] Attempting to download ticket: ${ticketId}`);
  // logTicketOperation('DOWNLOAD_TICKET', 'STARTED', { ticketId });
  try {
    // 1. 构建 API URL
    const url = TICKET_ENDPOINTS.DOWNLOAD_TICKET(ticketId);
    console.log(`[ticketService/management.js] Sending download request to URL: ${url}`);

    // 2. 调用 authenticatedRequest 发送请求，期望 Blob 响应
    const apiResponse = await authenticatedRequest(url, {
      method: 'GET', // 假设下载是 GET 请求
      // authenticatedRequest 应该已经配置为处理 Blob 响应
    });
    console.log(`[ticketService/management.js] Received API response for download (type: ${apiResponse.type}):`, apiResponse);

    // 3. 处理 API 响应
    // authenticatedRequest 在非 response.ok 时会抛出错误，所以这里只需检查返回类型
    if (apiResponse instanceof Blob) {
       console.log(`[ticketService/management.js] Download successful for ticket ${ticketId}`);
       // logTicketOperation('DOWNLOAD_TICKET', 'FINISHED', { ticketId, fileType: apiResponse.type });
       return apiResponse; // 返回 Blob 对象
    } else {
      console.error('[ticketService/management.js] Download failed: API did not return a Blob', apiResponse);
      // logTicketOperation('DOWNLOAD_TICKET', 'FAILED', { ticketId, response: apiResponse });
      // 抛出错误
      throw new Error(ERROR_MESSAGES.DOWNLOAD_FAILED + ': Invalid response format');
    }
  } catch (error) {
    console.error(`[ticketService/management.js] Error in downloadTicket for ${ticketId}:`, error);
    // logTicketOperation('DOWNLOAD_TICKET', 'FAILED', { ticketId, error: error.message });
    // 重新抛出错误
    throw error;
  }
};

console.log('--- downloadTicket function defined ---');


/**
 * 管理员标记票据状态
 * @param {string} ticketId - 票据ID
 * @param {string} status - 新状态 ('active'|'used'|'cancelled')
 * @returns {Promise<Object>} 操作结果 (例如 { success: true, message: '...' })
 */
export const updateTicketStatus = async (ticketId, status) => {
  console.log(`[ticketService/management.js] Attempting to update status for ticket ${ticketId} to ${status}`);
  // logTicketOperation('UPDATE_TICKET_STATUS', 'STARTED', { ticketId, status });
  try {
    // 1. 构建 API URL
    const url = TICKET_ENDPOINTS.UPDATE_TICKET_STATUS(ticketId);
    console.log(`[ticketService/management.js] Sending update status request to URL: ${url}`);

    // 2. 调用 authenticatedRequest 发送请求
    const apiResponse = await authenticatedRequest(url, {
      method: 'PUT', // 假设更新状态是 PUT 请求
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }), // 发送新状态在请求体中
    });
    console.log(`[ticketService/management.js] Received API response for status update:`, apiResponse);

    // 3. 处理 API 响应 (使用 ticketService/utils 中实现的函数)
    // 假设 API 成功时返回 { success: true, ... }
    if (isApiResponseSuccess(apiResponse)) {
       console.log(`[ticketService/management.js] Status update successful for ticket ${ticketId}`);
       // logTicketOperation('UPDATE_TICKET_STATUS', 'FINISHED', { ticketId, status, response: apiResponse });
       return apiResponse; // 返回 API 响应
    } else {
      console.error('[ticketService/management.js] Status update failed based on API response:', apiResponse);
      // logTicketOperation('UPDATE_TICKET_STATUS', 'FAILED', { ticketId, status, response: apiResponse });
      // 抛出包含后端错误消息的错误
      throw new Error((apiResponse && apiResponse.message) || (apiResponse && apiResponse.error) || ERROR_MESSAGES.UPDATE_STATUS_FAILED);
    }
  } catch (error) {
    console.error(`[ticketService/management.js] Error in updateTicketStatus for ${ticketId}:`, error);
    // logTicketOperation('UPDATE_TICKET_STATUS', 'FAILED', { ticketId, status, error: error.message });
    // 重新抛出错误
    throw error;
  }
};

console.log('--- updateTicketStatus function defined ---');
console.log('--- Evaluating src/services/ticketService/operations/management.js --- END');