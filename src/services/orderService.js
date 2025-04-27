import { mockOrders } from './ordersMock';
import { mockUserTickets } from './ticketsMock';

// 存储本地订单数据
let orders = [...mockOrders];

/**
 * 获取用户的所有订单
 * @returns {Promise<Array>} 订单列表
 */
export const getUserOrders = () => {
  return Promise.resolve([...orders]);
};

/**
 * 获取订单详情
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 订单详情
 */
export const getOrderById = (orderId) => {
  const order = orders.find(order => order.id === orderId);
  
  if (!order) {
    return Promise.reject(new Error('Order not found'));
  }
  
  // 获取与该订单相关的所有票据
  const orderTickets = mockUserTickets.filter(ticket => ticket.orderId === orderId);
  
  return Promise.resolve({
    ...order,
    tickets: orderTickets
  });
};

/**
 * 创建新订单
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} 创建的订单
 */
export const createOrder = (orderData) => {
  const newOrder = {
    id: `order-${Date.now()}`,
    date: new Date().toISOString(),
    totalAmount: orderData.totalAmount,
    status: 'COMPLETED',
    items: orderData.items
  };
  
  orders.unshift(newOrder);
  
  return Promise.resolve(newOrder);
};

/**
 * 取消订单
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 操作结果
 */
export const cancelOrder = (orderId) => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return Promise.reject(new Error('Order not found'));
  }
  
  orders = orders.map(order =>
    order.id === orderId ? { ...order, status: 'CANCELLED' } : order
  );
  
  return Promise.resolve({
    success: true,
    message: 'Order cancelled successfully'
  });
};