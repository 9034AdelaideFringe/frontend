/**
 * 票据服务 - 公共接口
 * 重新导出在 ticketService/ 文件夹下实现的模块化功能
 */

// 从新的模块化结构中导入所有命名导出并重新导出
export * from './ticketService/index';

// 保持向后兼容的默认导出 (如果您的应用中其他地方使用了 default import)
// 假设 ticketService/index.js 有一个 default export
import ticketServiceOperations from './ticketService/index';
export default ticketServiceOperations;