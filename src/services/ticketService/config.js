import { apiUrl } from '../authService'; // Assuming apiUrl is exported from authService

// API Endpoints for Ticket Service
export const TICKET_ENDPOINTS = {
  // 获取当前用户的所有票据 (需要用户ID)
  GET_USER_TICKETS: (userId) => apiUrl(`/ticket/userid/${userId}`), // 示例路径
  // 申请退票
  REFUND_TICKET: (ticketId) => apiUrl(`/tickets/${ticketId}/refund`), // 示例路径
  // 下载票据 (例如 QR 码或 PDF)
  DOWNLOAD_TICKET: (ticketId) => apiUrl(`/tickets/${ticketId}/download`), // 示例路径
  // 管理员更新票据状态
  UPDATE_TICKET_STATUS: (ticketId) => apiUrl(`/admin/tickets/${ticketId}/status`), // 示例路径
  // 管理员获取票务分析数据
  GET_TICKET_ANALYTICS: (timeRange) => apiUrl(`/admin/analytics/tickets?timeRange=${timeRange}`), // 示例路径
  // 获取活动的票种列表 (这个端点通常在 ticketTypeService 中使用，但为了完整性也列出)
  GET_TICKET_TYPES_BY_EVENT_ID: (eventId) => apiUrl(`/events/${eventId}/ticket-types`), // 示例路径

  // 新增：获取指定事件的已占用座位
  GET_OCCUPIED_SEATS_BY_EVENT_ID: (eventId) => apiUrl(`/ticket/eventid/${eventId}`), // 根据您提供的端点格式
};

// Default values for frontend mapping (if API response is incomplete)
export const DEFAULT_VALUES = {
  EVENT_NAME: 'Unknown Event',
  DATE: 'Date TBA',
  TIME: 'Time TBA',
  VENUE: 'Venue TBA',
  TICKET_TYPE_NAME: 'Unknown Type',
  PRICE: 0,
  EVENT_IMAGE: '/placeholder-event-image.jpg', // Placeholder image path
};

// Error messages
export const ERROR_MESSAGES = {
  FAILED_TO_FETCH_TICKETS: 'Failed to load tickets. Please try again.',
  TICKET_NOT_FOUND: 'Ticket not found.',
  REFUND_FAILED: 'Failed to process refund. Please try again.',
  DOWNLOAD_FAILED: 'Failed to download ticket. Please try again.',
  UPDATE_STATUS_FAILED: 'Failed to update ticket status. Please try again.',
  ANALYTICS_FAILED: 'Failed to load analytics data. Please try again.',
  TICKET_TYPES_FAILED: 'Failed to load ticket types for this event. Please try again.',
  AUTHENTICATION_REQUIRED: 'You must be logged in to perform this action.',
  INVALID_RESPONSE: 'Received invalid data from the server.',
  OCCUPIED_SEATS_FAILED: 'Failed to load occupied seats information. Please try again.',
};