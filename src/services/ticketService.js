import { mockUserTickets } from './ticketsMock';
import { mockTicketTypes } from './ticketTypesMock';

// 存储本地票据状态，允许在应用中进行修改
let userTickets = [...mockUserTickets];

/**
 * 获取用户的所有票据
 * @returns {Promise<Array>} 用户票据
 */
export const getUserTickets = () => {
  return Promise.resolve([...userTickets]);
};

/**
 * 获取票据详情
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Object>} 票据详情
 */
export const getTicketById = (ticketId) => {
  const ticket = userTickets.find(ticket => ticket.id === ticketId);
  if (ticket) {
    return Promise.resolve({ ...ticket });
  }
  return Promise.reject(new Error('Ticket not found'));
};

/**
 * 申请退票
 * @param {string} ticketId - 票据ID
 * @returns {Promise<Object>} 退票结果
 */
export const refundTicket = (ticketId) => {
  const ticketIndex = userTickets.findIndex(ticket => ticket.id === ticketId);
  
  if (ticketIndex === -1) {
    return Promise.reject(new Error('Ticket not found'));
  }
  
  const ticket = userTickets[ticketIndex];
  
  // 检查票是否可退
  const today = new Date();
  const lastRefundDate = new Date(ticket.lastRefundDate);
  
  if (ticket.status !== 'active') {
    return Promise.reject(new Error('Only active tickets can be refunded'));
  }
  
  if (today > lastRefundDate) {
    return Promise.reject(new Error('Refund period has expired for this ticket'));
  }
  
  // 更新票状态为已取消
  userTickets = userTickets.map(t =>
    t.id === ticketId ? { ...t, status: 'cancelled' } : t
  );
  
  return Promise.resolve({
    success: true,
    message: 'Ticket has been successfully refunded'
  });
};

/**
 * 下载票据（生成PDF链接）
 * @param {string} ticketId - 票据ID
 * @returns {Promise<string>} PDF下载链接
 */
export const downloadTicket = (ticketId) => {
  const ticket = userTickets.find(ticket => ticket.id === ticketId);
  
  if (!ticket) {
    return Promise.reject(new Error('Ticket not found'));
  }
  
  // 模拟PDF生成和下载过程
  // 实际中这应该返回一个生成的PDF的URL
  return Promise.resolve(`data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFttFrKjkMMvfsr9svAnoh57oKgE9XTPdclvTzN//+fT4WARwyZ5XVlrb1LnF/++X38/P79+Nfxu8NnrubpLu7j5j1+r3ng+POIJ+NBpvEKn70fKsSPcz9SR82bE4fPsR97PjAzfQ0Tj1ZuOvmaqzjH6XMZ5vGCQgLig9sI0ihxqr/7cdK64A1miDwaXGKeCXD0qOByzKySnwVSgxj4QinSSmGWVTW4Vyq90SudbAMnwmBXvnviGhCYhszjfsVC9RJF6oTLRLXJQStUqRQ6KtcJVj3rUeJKd9Se+2CJkvGQ1Cchk9T2EoVvPoQQnbTL`);
};

/**
 * 管理员标记票据状态
 * @param {string} ticketId - 票据ID
 * @param {string} status - 新状态 ('active'|'used'|'cancelled')
 * @returns {Promise<Object>} 操作结果
 */
export const updateTicketStatus = (ticketId, status) => {
  const allowedStatuses = ['active', 'used', 'cancelled'];
  
  if (!allowedStatuses.includes(status)) {
    return Promise.reject(new Error('Invalid ticket status'));
  }
  
  const ticketIndex = userTickets.findIndex(ticket => ticket.id === ticketId);
  
  if (ticketIndex === -1) {
    return Promise.reject(new Error('Ticket not found'));
  }
  
  // 更新票状态
  userTickets = userTickets.map(t =>
    t.id === ticketId ? { ...t, status: status } : t
  );
  
  return Promise.resolve({
    success: true,
    message: `Ticket status updated to ${status}`
  });
};

/**
 * 获取活动的票种
 * @param {string} eventId - 活动ID
 * @returns {Promise<Array>} 票种列表
 */
export const getTicketTypesByEventId = (eventId) => {
  const ticketTypes = mockTicketTypes[eventId];
  
  if (!ticketTypes) {
    return Promise.reject(new Error('No ticket types found for this event'));
  }
  
  return Promise.resolve([...ticketTypes]);
};