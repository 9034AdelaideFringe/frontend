import { mockUserTickets, getAllTicketsData } from './ticketsMock';
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

/**
 * 获取票务分析数据
 * @param {string} timeRange - 'week', 'month', 'year'
 * @returns {Promise<Object>} 分析数据
 */
export const getTicketAnalytics = (timeRange = 'month') => {
  const allTickets = getAllTicketsData();
  const filteredTickets = filterTicketsByTimeRange(allTickets, timeRange);
  
  const venueData = calculateVenueData(filteredTickets);
  const salesData = calculateSalesTimeData(filteredTickets, timeRange);
  const stats = calculateTicketStats(allTickets);
  
  return Promise.resolve({
    venueData,
    salesData,
    stats
  });
};

/**
 * 根据时间范围过滤票据
 * @private
 */
const filterTicketsByTimeRange = (tickets, timeRange) => {
  const now = new Date();
  let startDate;
  
  switch(timeRange) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
  }
  
  return tickets.filter(ticket => {
    const purchaseDate = new Date(ticket.purchaseDate);
    return purchaseDate >= startDate && purchaseDate <= now;
  });
};

/**
 * 计算场馆数据
 * @private
 */
const calculateVenueData = (tickets) => {
  // 按场馆进行分组
  const venueMap = {};
  
  tickets.forEach(ticket => {
    if (!venueMap[ticket.venue]) {
      venueMap[ticket.venue] = {
        venue: ticket.venue,
        count: 0,
        revenue: 0
      };
    }
    
    venueMap[ticket.venue].count += ticket.quantity;
    
    // 只计算active和used状态的票据收入
    if (ticket.status === 'active' || ticket.status === 'used') {
      venueMap[ticket.venue].revenue += ticket.totalPrice;
    }
  });
  
  // 转换为数组并排序
  return Object.values(venueMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // 只返回前8个场馆
};

/**
 * 计算销售时间序列数据
 * @private
 */
const calculateSalesTimeData = (tickets, timeRange) => {
  const now = new Date();
  let intervals;
  let dateFormat;
  
  switch(timeRange) {
    case 'week':
      intervals = 7; // 每天一个数据点
      dateFormat = 'day';
      break;
    case 'month':
      intervals = 30; // 每天一个数据点
      dateFormat = 'day';
      break;
    case 'year':
      intervals = 12; // 每月一个数据点
      dateFormat = 'month';
      break;
    default:
      intervals = 30;
      dateFormat = 'day';
  }
  
  // 创建时间区间
  const buckets = [];
  for (let i = 0; i < intervals; i++) {
    const date = new Date();
    if (dateFormat === 'day') {
      date.setDate(now.getDate() - (intervals - 1) + i);
      buckets.push({
        date,
        label: `Day ${i + 1}`, // 简化标签
        tickets: 0,
        revenue: 0
      });
    } else {
      date.setMonth(now.getMonth() - (intervals - 1) + i);
      buckets.push({
        date,
        label: `Month ${i + 1}`, // 简化标签
        tickets: 0,
        revenue: 0
      });
    }
  }
  
  // 将票据分配到对应的时间桶
  tickets.forEach(ticket => {
    const purchaseDate = new Date(ticket.purchaseDate);
    let bucketIndex = -1;
    
    if (dateFormat === 'day') {
      // 查找对应的日期桶
      for (let i = 0; i < buckets.length; i++) {
        const bucketDate = buckets[i].date;
        if (purchaseDate.getDate() === bucketDate.getDate() &&
            purchaseDate.getMonth() === bucketDate.getMonth() &&
            purchaseDate.getFullYear() === bucketDate.getFullYear()) {
          bucketIndex = i;
          break;
        }
      }
    } else {
      // 查找对应的月份桶
      for (let i = 0; i < buckets.length; i++) {
        const bucketDate = buckets[i].date;
        if (purchaseDate.getMonth() === bucketDate.getMonth() &&
            purchaseDate.getFullYear() === bucketDate.getFullYear()) {
          bucketIndex = i;
          break;
        }
      }
    }
    
    if (bucketIndex !== -1) {
      buckets[bucketIndex].tickets += ticket.quantity;
      // 只计算active和used状态的票据收入
      if (ticket.status === 'active' || ticket.status === 'used') {
        buckets[bucketIndex].revenue += ticket.totalPrice;
      }
    }
  });
  
  // 提取标签、票数和收入数组
  return {
    labels: buckets.map(bucket => bucket.label),
    tickets: buckets.map(bucket => bucket.tickets),
    revenues: buckets.map(bucket => bucket.revenue)
  };
};

/**
 * 计算票务统计数据
 * @private
 */
const calculateTicketStats = (tickets) => {
  const activeTickets = tickets.filter(t => t.status === 'active');
  
  return {
    activeTickets: activeTickets.reduce((sum, t) => sum + t.quantity, 0),
    totalRevenue: tickets
      .filter(t => t.status === 'active' || t.status === 'used')
      .reduce((sum, t) => sum + t.totalPrice, 0)
  };
};