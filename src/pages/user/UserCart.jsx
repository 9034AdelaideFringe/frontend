import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  checkout, // 导入 checkout (目前是 mock 或需要替换)
} from "../../services/cartService";
import styles from "./UserCart.module.css";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  // 加载购物车商品
  useEffect(() => {
    loadCartItems();
  }, []); // 依赖项为空数组，只在组件挂载时加载一次

  const loadCartItems = async () => {
    try {
      setLoading(true);
      // 调用更新后的 getCartItems 函数
      const items = await getCartItems();
      console.log("从API获取的购物车数据:", items);
      // 注意：这里接收到的 items 已经是经过 cartService 映射过的格式
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError('加载购物车失败: ' + (err.message || '未知错误'));
      console.error("加载购物车失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 更新商品数量
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      // 调用更新后的 updateCartItemQuantity 函数
      await updateCartItemQuantity(itemId, newQuantity);
      // 数量更新成功后，重新加载购物车数据以同步后端状态
      loadCartItems();
    } catch (err) {
      setError('更新商品数量失败: ' + (err.message || '未知错误'));
      console.error("更新商品数量失败:", err);
    }
  };

  // 删除商品
  const handleRemoveItem = async (itemId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      try {
        // 调用更新后的 removeFromCart 函数
        await removeFromCart(itemId);
        // 删除成功后，重新加载购物车数据以同步后端状态
        loadCartItems();
      } catch (err) {
        setError('删除商品失败: ' + (err.message || '未知错误'));
        console.error("删除商品失败:", err);
      }
    }
  };

  // 结账
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setIsCheckingOut(true);
      // 调用 checkout 函数 (目前是 mock 或需要替换为实际 API 调用)
      // 注意：如果 checkout API 需要发送购物车项目列表，需要将 cartItems 传递进去
      const result = await checkout(cartItems); // 传递当前购物车项目

      setIsCheckingOut(false);

      // 导航到订单确认页面，使用后端返回的订单ID (如果 mock 返回了)
      if (result && result.order && result.order.id) {
         alert(`Checkout successful! Your order ID is: ${result.order.id}`);
         navigate(`/order-confirmation/${result.order.id}`);
      } else {
         // 如果 mock 或 API 没有返回订单ID，可以导航到其他页面或显示通用信息
         alert("Checkout successful!");
         navigate("/user/tickets"); // 导航到我的票页面
      }

    } catch (err) {
      setError('结账失败: ' + (err.message || '未知错误'));
      console.error("结账失败:", err);
      setIsCheckingOut(false);
    }
  };

  const calculateTotalPrice = () => {
    // 确保 cartItems 中的每个 item 都有 totalPrice 字段
    // 如果后端返回的数据没有 totalPrice，需要在 getCartItems 中计算或映射
    return cartItems.reduce((total, item) => total + (item.totalPrice || (item.quantity * item.pricePerTicket) || 0), 0);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your cart...</div>;
  }

  return (
    <div className={styles.cartPage}>
      {cartItems.length === 0 && !loading ? ( // 只有在不加载且购物车为空时显示
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/events" className={styles.browseBtn}>
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <h2>Your Cart</h2>
          {error && <div className={styles.error}>{error}</div>} {/* 显示错误信息 */}
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}> {/* 使用后端返回的 cart_item_id 作为 key */}
                <div className={styles.itemImage}>
                  {/* 假设 item.eventImage 包含了完整的图片 URL */}
                  <img src={item.eventImage} alt={item.eventName} />
                </div>

                <div className={styles.itemDetails}>
                  <h3>{item.eventName}</h3>
                  <div className={styles.itemInfo}>
                    {/* 假设后端返回了这些信息，或者在 getCartItems 中补充 */}
                    <p>
                      <strong>Date:</strong> {item.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {item.time}
                    </p>
                    <p>
                      <strong>Venue:</strong> {item.venue}
                    </p>
                    <p>
                      <strong>Ticket Type:</strong> {item.ticketName || item.ticketType} {/* 使用 ticketName 或 ticketType */}
                    </p>
                  </div>
                </div>

                <div className={styles.itemQuantity}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1) // 使用 item.id (映射后的 cart_item_id)
                    }
                    disabled={item.quantity <= 1 || isCheckingOut} // 结账中禁用按钮
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1) // 使用 item.id (映射后的 cart_item_id)
                    }
                    disabled={isCheckingOut} // 结账中禁用按钮
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemPrice}>
                  {/* 假设 item.totalPrice 存在或可以计算 */}
                  ${(item.totalPrice || (item.quantity * item.pricePerTicket) || 0).toFixed(2)}
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.id)} // 使用 item.id (映射后的 cart_item_id)
                  disabled={isCheckingOut} // 结账中禁用按钮
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            {/* 可以添加其他费用，如税费、运费等 */}
            <div className={styles.summaryRow}>
              <span>Total:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckingOut} // 购物车为空或结账中禁用
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;
