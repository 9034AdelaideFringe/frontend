import { mockOrders } from "./ordersMock";
import { mockUserTickets } from "./ticketsMock";

// Store local orders data
let orders = [...mockOrders];

/**
 * Get all user orders
 * @returns {Promise<Array>} List of orders
 */
export const getUserOrders = () => {
  return Promise.resolve([...orders]);
};

/**
 * Get order details by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = (orderId) => {
  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    return Promise.reject(new Error("Order not found"));
  }

  // Get all tickets related to this order
  const orderTickets = mockUserTickets.filter(
    (ticket) => ticket.orderId === orderId
  );

  return Promise.resolve({
    ...order,
    tickets: orderTickets,
  });
};

/**
 * Create new order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
export const createOrder = (orderData) => {
  const newOrder = {
    id: `order-${Date.now()}`,
    date: new Date().toISOString(),
    totalAmount: orderData.totalAmount,
    status: "COMPLETED",
    items: orderData.items,
  };

  orders.unshift(newOrder);

  return Promise.resolve(newOrder);
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Operation result
 */
export const cancelOrder = (orderId) => {
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return Promise.reject(new Error("Order not found"));
  }

  orders = orders.map((order) =>
    order.id === orderId ? { ...order, status: "CANCELLED" } : order
  );

  return Promise.resolve({
    success: true,
    message: "Order cancelled successfully",
  });
};
