
import { getUserTickets, getTicketById } from './operations/query'; // 导入到本地作用域
export { getUserTickets, getTicketById }; // 作为命名导出

// 分离导入和命名导出 refundTicket
import { refundTicket } from './operations/management'; // <-- 导入到本地作用域
export { refundTicket }; // <-- 作为命名导出

// 分离导入和命名导出 downloadTicket
import { downloadTicket } from './operations/media'; // <-- 导入到本地作用域
export { downloadTicket }; // <-- 作为命名导出

// 分离导入和命名导出 getTicketAnalytics
import { getTicketAnalytics } from './operations/analytics'; // <-- 导入到本地作用域
export { getTicketAnalytics }; // <-- 作为命名导出


// 导出配置和工具函数
export * from './config';
export * from './utils';

export default {
  getUserTickets,
  getTicketById,
  refundTicket, // <-- 现在 refundTicket 应该在本地作用域中定义了
  downloadTicket,
  getTicketAnalytics, // <-- 新增：添加到默认导出
  // ... 导出 config 和 utils 中的内容如果需要通过 default 访问
};