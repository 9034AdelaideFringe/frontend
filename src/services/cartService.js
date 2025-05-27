import { mockCartItems } from "./cartMock";

// 用于存储购物车状态的本地变量
let cartItems = [...mockCartItems];

/**
 * 获取用户购物车中的项目
 * @returns {Promise<Array>} 购物车项目列表
 */
export const getCartItems = () => {
  return Promise.resolve([...cartItems]);
};

/**
 * 添加项目到购物车
 * @param {Array|Object} items - 要添加的项目，可以是单个项目或项目数组
 * @returns {Promise<Object>} 添加结果
 */
export const addToCart = (items) => {
  const itemsArray = Array.isArray(items) ? items : [items];

  // 为每个项目生成唯一ID
  const newItems = itemsArray.map((item) => ({
    ...item,
    id: item.id || `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  }));

  // 添加到购物车（或更新现有项）
  newItems.forEach((newItem) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.eventId === newItem.eventId &&
        item.ticketTypeId === newItem.ticketTypeId
    );

    if (existingItemIndex >= 0) {
      // 更新现有项
      cartItems[existingItemIndex].quantity += newItem.quantity;
      cartItems[existingItemIndex].totalPrice =
        cartItems[existingItemIndex].pricePerTicket *
        cartItems[existingItemIndex].quantity;
    } else {
      // 添加新项
      cartItems.push(newItem);
    }
  });

  return Promise.resolve({
    success: true,
    message: "Items added to cart",
    items: [...cartItems],
  });
};

/**
 * 更新购物车中项目的数量
 * @param {string} itemId - 项目ID
 * @param {number} quantity - 新数量
 * @returns {Promise<Object>} 更新结果
 */
export const updateCartItemQuantity = (itemId, quantity) => {
  if (quantity < 1) {
    return Promise.reject(new Error("Quantity must be at least 1"));
  }

  const itemIndex = cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return Promise.reject(new Error("Item not found in cart"));
  }

  // 更新项目数量
  cartItems = cartItems.map((item) =>
    item.id === itemId
      ? { ...item, quantity, totalPrice: item.pricePerTicket * quantity }
      : item
  );

  return Promise.resolve({
    success: true,
    message: "Item quantity updated",
    item: cartItems.find((item) => item.id === itemId),
  });
};

/**
 * 从购物车中删除项目
 * @param {string} itemId - 项目ID
 * @returns {Promise<Object>} 删除结果
 */
export const removeFromCart = (itemId) => {
  const initialLength = cartItems.length;
  cartItems = cartItems.filter((item) => item.id !== itemId);

  if (cartItems.length === initialLength) {
    return Promise.reject(new Error("Item not found in cart"));
  }

  return Promise.resolve({
    success: true,
    message: "Item removed from cart",
  });
};

/**
 * 结账
 * @returns {Promise<Object>} 结账结果
 */
export const checkout = () => {
  if (cartItems.length === 0) {
    return Promise.reject(new Error("Cart is empty"));
  }

  const orderItems = [...cartItems];
  const orderTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const orderId = `order-${Date.now()}`;

  // 清空购物车
  cartItems = [];

  return Promise.resolve({
    success: true,
    message: "Checkout successful",
    order: {
      id: orderId,
      date: new Date().toISOString(),
      items: orderItems,
      totalAmount: orderTotal,
      status: "COMPLETED",
    },
  });
};

/**
 * 清空购物车
 * @returns {Promise<Object>} 操作结果
 */
export const clearCart = () => {
  cartItems = [];

  return Promise.resolve({
    success: true,
    message: "Cart cleared",
  });
};
