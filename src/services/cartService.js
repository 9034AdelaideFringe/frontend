// 导入 API 配置和认证请求 helper
import { buildApiUrl } from './shared/apiConfig';
import { authenticatedRequest } from './authService'; // 假设 authService 提供了 authenticatedRequest
import { getCurrentUser } from './authService/user-service'; // 导入获取当前用户函数

/**
 * 获取当前用户的购物车项目
 * @returns {Promise<Array>} 购物车项目列表
 */
export const getCartItems = async () => {
  console.log("=== API SERVICE: GET CART ITEMS STARTED ===");
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.warn("用户未登录，无法获取购物车");
      return [];
    }

    const userId = currentUser.user_id;
    if (!userId) {
      console.warn("用户ID缺失，无法获取购物车", currentUser);
      return [];
    }

    const apiUrl = buildApiUrl(`/cart/${userId}`);
    console.log(`尝试获取用户 ${userId} 的购物车数据: ${apiUrl}`);

    // 使用认证请求 helper 发送 GET 请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'GET',
    });

    console.log("获取购物车的API响应:", response);

    // **修复：根据实际API响应格式处理**
    // API返回格式: { data: [...], message: "ok" }
    if (response && response.message === "ok" && Array.isArray(response.data)) {
      console.log(`成功获取 ${response.data.length} 个购物车项目`);
      
      // 映射后端字段到前端期望的格式
      return response.data.map(item => ({
        id: item.cart_item_id, // 映射 cart_item_id 到前端使用的 id
        cartItemId: item.cart_item_id, // 保留原始ID
        ticketTypeId: item.ticket_type_id, // 映射 ticket_type_id
        userId: item.user_id, // 映射 user_id
        quantity: parseInt(item.quantity), // 转换为数字
        addedAt: item.added_at,
        
        // 这些字段需要从其他API获取或设置默认值
        // 因为购物车API只返回基本信息，不包含事件详情
        eventName: "Event Name", // 需要通过 ticket_type_id 获取事件信息
        eventImage: "/default-event-image.jpg", // 默认图片
        date: "TBD", // 需要获取
        time: "TBD", // 需要获取
        venue: "TBD", // 需要获取
        ticketName: "Standard Ticket", // 需要通过 ticket_type_id 获取
        pricePerTicket: 0, // 需要通过 ticket_type_id 获取
        totalPrice: 0, // pricePerTicket * quantity
      }));
    } else {
      console.error('无效的API响应格式:', response);
      return [];
    }

  } catch (error) {
    console.error("获取购物车项目失败:", error);
    throw error;
  } finally {
    console.log("=== API SERVICE: GET CART ITEMS FINISHED ===");
  }
};

/**
 * 添加项目到购物车
 * @param {Array|Object} items - 要添加的项目，可以是单个项目或项目数组 (包含 eventId, ticketTypeId, quantity)
 * @returns {Promise<Object>} 添加结果
 */
export const addToCart = async (items) => {
  console.log("=== API SERVICE: ADD TO CART STARTED ===");
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.warn("用户未登录，无法添加购物车");
      throw new Error("User not logged in");
    }

    const userId = currentUser.user_id;
    if (!userId) {
      console.warn("用户ID缺失，无法添加购物车", currentUser);
      throw new Error("User ID not found");
    }

    const itemsArray = Array.isArray(items) ? items : [items];

    if (itemsArray.length === 0) {
        console.log("没有项目需要添加到购物车");
        return { success: true, message: "No items to add" };
    }

    // 处理第一个项目（API一次只能添加一个）
    const itemToAdd = itemsArray[0];

    const requestBody = {
      user_id: userId,
      ticket_type_id: itemToAdd.ticketTypeId,
      quantity: String(itemToAdd.quantity),
    };

    const apiUrl = buildApiUrl('/cart');
    console.log(`尝试添加项目到购物车: ${apiUrl}`, requestBody);

    // 发送 POST 请求
    const response = await authenticatedRequest(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("添加购物车的API响应:", response);

    // **修复：根据实际API响应格式处理**
    // API返回格式: { data: [{ cart_item_id, user_id, ticket_type_id, quantity, added_at }], message: "ok" }
    if (response && response.message === "ok" && Array.isArray(response.data) && response.data.length > 0) {
      console.log("成功添加购物车项目:", response.data[0]);
      
      return {
        success: true,
        message: "Item added successfully",
        item: {
          id: response.data[0].cart_item_id,
          cartItemId: response.data[0].cart_item_id,
          ticketTypeId: response.data[0].ticket_type_id,
          userId: response.data[0].user_id,
          quantity: parseInt(response.data[0].quantity),
          addedAt: response.data[0].added_at,
        }
      };
    } else {
      console.error('无效的API响应格式:', response);
      throw new Error("Failed to add item to cart: Invalid response format");
    }

  } catch (error) {
    console.error("添加购物车项目失败:", error);
    throw error;
  } finally {
    console.log("=== API SERVICE: ADD TO CART FINISHED ===");
  }
};

/**
 * 更新购物车中项目的数量
 * @param {string} cartItemId - 购物车项目ID
 * @param {number} quantity - 新数量
 * @returns {Promise<Object>} 更新结果
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  console.log("=== API SERVICE: UPDATE CART ITEM QUANTITY STARTED ===");
  try {
    if (quantity < 1) {
      console.log(`数量小于1 (${quantity})，调用移除函数`);
      return removeFromCart(cartItemId);
    }

    const apiUrl = buildApiUrl(`/cart/${cartItemId}`);
    const requestBody = {
      quantity: String(quantity),
    };

    console.log(`尝试更新购物车项目 ${cartItemId} 数量到 ${quantity}: ${apiUrl}`, requestBody);

    const response = await authenticatedRequest(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("更新购物车数量的API响应:", response);

    // 根据实际API响应格式处理
    if (response && (response.message === "ok" || response.success)) {
      console.log("成功更新购物车项目数量:", response);
      return response;
    } else {
      console.error('更新失败:', response);
      throw new Error(response.message || "Failed to update item quantity");
    }

  } catch (error) {
    console.error("更新购物车项目数量失败:", error);
    throw error;
  } finally {
    console.log("=== API SERVICE: UPDATE CART ITEM QUANTITY FINISHED ===");
  }
};

/**
 * 从购物车中删除项目
 * @param {string} cartItemId - 购物车项目ID
 * @returns {Promise<Object>} 删除结果
 */
export const removeFromCart = async (cartItemId) => {
  console.log("=== API SERVICE: REMOVE FROM CART STARTED ===");
  try {
    const apiUrl = buildApiUrl(`/cart/${cartItemId}`);
    console.log(`尝试从购物车中删除项目 ${cartItemId}: ${apiUrl}`);

    const response = await authenticatedRequest(apiUrl, {
      method: 'DELETE',
    });

    console.log("删除购物车项目的API响应:", response);

    // 根据实际API响应格式处理
    if (response && (response.message === "ok" || response.success)) {
      console.log("成功从购物车中删除项目:", response);
      return response;
    } else {
      console.error('删除失败:', response);
      throw new Error(response.message || "Failed to remove item from cart");
    }

  } catch (error) {
    console.error("从购物车中删除项目失败:", error);
    throw error;
  } finally {
    console.log("=== API SERVICE: REMOVE FROM CART FINISHED ===");
  }
};

/**
 * 结账 (目前是mock实现)
 */
export const checkout = async (cartItemsToCheckout) => {
  console.log("=== API SERVICE: CHECKOUT STARTED (MOCK) ===");
  
  // Mock 结账逻辑
  if (!cartItemsToCheckout || cartItemsToCheckout.length === 0) {
    console.warn("MOCK CHECKOUT: Cart is empty");
    return Promise.reject(new Error("Cart is empty"));
  }

  const orderItems = [...cartItemsToCheckout];
  const orderTotal = orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const orderId = `mock-order-${Date.now()}`;

  console.log("MOCK CHECKOUT: Processing order", { orderId, total: orderTotal, items: orderItems });

  // 模拟异步延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("=== API SERVICE: CHECKOUT FINISHED (MOCK) ===");
  return Promise.resolve({
    success: true,
    message: "Mock checkout successful",
    order: {
      id: orderId,
      date: new Date().toISOString(),
      items: orderItems,
      totalAmount: orderTotal,
      status: "COMPLETED",
    },
  });
};