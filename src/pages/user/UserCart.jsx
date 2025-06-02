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
  const [processingItemId, setProcessingItemId] = useState(null); // New state
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
      // 注意：这里接收到的 items 已经是经过 cartService 映射过的格式
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError('加载购物车失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 更新商品数量
  const handleQuantityChange = async (itemId, newQuantity) => {
    const originalCartItems = [...cartItems]; // Store original items for rollback
    setProcessingItemId(itemId); // Indicate this item is being processed

    // Optimistically update UI
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === itemId || item.cartItemId === itemId)
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.pricePerTicket, // Recalculate totalPrice
            }
          : item
      )
    );

    try {
      const itemToUpdate = originalCartItems.find(item => item.id === itemId || item.cartItemId === itemId);

      if (!itemToUpdate) {
        throw new Error(`未找到购物车项目 ${itemId} 进行后端同步`);
      }

      const ticketTypeId = itemToUpdate.ticketTypeId;

      if (typeof ticketTypeId === 'undefined') {
        throw new Error(`项目 ${itemId} 的 ticketTypeId 未定义`);
      }

      await updateCartItemQuantity(itemId, newQuantity, ticketTypeId);
      setError(null); 
    } catch (err) {
      setError('更新商品数量失败: ' + (err.message || '未知错误'));
      // Rollback UI to original state if API call fails
      setCartItems(originalCartItems);
    } finally {
      setProcessingItemId(null); // Clear processing state
    }
  };

  // 删除商品
  const handleRemoveItem = async (itemId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      const originalCartItems = [...cartItems]; // Store original items for rollback
      setProcessingItemId(itemId); // Indicate this item is being processed

      // Optimistically update UI
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId && item.cartItemId !== itemId));

      try {
        await removeFromCart(itemId);
        setError(null);
      } catch (err) {
        setError('删除商品失败: ' + (err.message || '未知错误'));
        // Rollback UI to original state if API call fails
        setCartItems(originalCartItems);
      } finally {
        setProcessingItemId(null); // Clear processing state
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
      const result = await checkout(cartItems); // 传递当前购物车项目

      setIsCheckingOut(false);

      // Adjust based on the new response from checkout service
      if (result && result.success) {
         alert(result.message || "Checkout successful! Your order is being processed.");
         setCartItems([]); // Clear the cart on successful checkout
         // Navigate to a relevant page, e.g., user's tickets/orders page or homepage
         // Since no order_id is directly returned, can't go to specific order confirmation
         navigate("/user/tickets"); 
      } else {
         // Handle cases where checkout might not throw an error but isn't successful
         alert(result.message || "Checkout failed. Please try again.");
      }

    } catch (err) {
      setError('结账失败: ' + (err.message || '未知错误'));
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
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || isCheckingOut || processingItemId === item.id} // Updated
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={isCheckingOut || processingItemId === item.id} // Updated
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
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isCheckingOut || processingItemId === item.id} // Updated
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
