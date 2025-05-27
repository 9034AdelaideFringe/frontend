import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  checkout,
} from "../../services/cartService";
import styles from "./CartPage.module.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const navigate = useNavigate();

  // 加载购物车商品
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItems();

      setCartItems(items);
      setError(null);
    } catch (err) {
      setError("加载购物车失败");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 更新商品数量
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await removeFromCart(itemId);
      } else {
        await updateCartItemQuantity(itemId, newQuantity);
      }
      // 重新加载购物车
      loadCartItems();
    } catch (err) {
      setError("更新商品失败");
      console.error(err);
    }
  };

  // 删除商品
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      // 重新加载购物车
      loadCartItems();
    } catch (err) {
      setError("删除商品失败");
      console.error(err);
    }
  };

  // 结账
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsCheckingOut(true);
      const result = await checkout();
      setIsCheckingOut(false);

      // 导航到订单确认页面
      navigate(`/order-confirmation/${result.order.id}`);
    } catch (err) {
      setError("结账失败");
      console.error(err);
      setIsCheckingOut(false);
    }
  };

  // 计算总价
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (loading) {
    return <div className={styles.loading}>加载购物车...</div>;
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className={styles.emptyCart}>
        <h2>购物车是空的</h2>
        <p>快去浏览精彩活动，为您的艺穗节之旅添加精彩内容！</p>
        <Link to="/events" className={styles.browseBtn}>
          浏览活动
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h2>购物车</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <img src={item.eventImage} alt={item.eventName} />
            </div>

            {/* <div className={styles.itemDetails}>
              <h3>{item.eventName}</h3>
              <div className={styles.itemInfo}>
                <p>日期: {item.date}</p>
                <p>时间: {item.time}</p>
                <p>地点: {item.venue}</p>
                <p>票种: {item.ticketType}</p>
              </div>
            </div> */}
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.eventImage} alt={item.eventName} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3>{item.eventName}</h3>
                    <div className={styles.itemInfo}>
                      <p>日期: {item.date}</p>
                      <p>时间: {item.time}</p>
                      <p>地点: {item.venue}</p>
                      <p>票种: {item.ticketType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.itemQuantity}>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className={styles.itemPrice}>
              <span>单价: ${item.pricePerTicket.toFixed(2)}</span>
              <span className={styles.totalPrice}>
                小计: ${item.totalPrice.toFixed(2)}
              </span>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveItem(item.id)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
            <span>商品小计:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>总计:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.checkoutActions}>
          <Link to="/events" className={styles.continueShoppingBtn}>
            继续购物
          </Link>
          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={isCheckingOut || cartItems.length === 0}
          >
            {isCheckingOut ? "处理中..." : "结账"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
