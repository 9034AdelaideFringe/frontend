import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  checkout,
} from "../../services/cartService";
import { cleanExpiredEventCache } from "../../services/eventCacheService";
import styles from "./CartPage.module.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [updating, setUpdating] = useState(new Set()); // 正在更新的项目ID

  const navigate = useNavigate();

  // 加载购物车商品
  useEffect(() => {
    loadCartItems();
    // 清理过期缓存
    cleanExpiredEventCache();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      console.log('加载购物车项目...');
      // 获取丰富的数据（包含票种和事件信息）
      const items = await getCartItems(true);
      setCartItems(items);
      console.log('购物车加载完成:', items);
      setError(null);
    } catch (err) {
      console.error('加载购物车失败:', err);
      setError("加载购物车失败: " + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 更新商品数量
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (updating.has(cartItemId)) {
      return; // 防止重复更新
    }

    setUpdating(prev => new Set(prev.add(cartItemId)));

    try {
      // console.log(`更新项目 ${cartItemId} 数量到 ${newQuantity}`);

      // **查找对应的购物车项目以获取 ticketTypeId**
      const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
      
      // 新增日志：检查 itemToUpdate 和它包含的 ticketTypeId
      console.log('[CartPage] Item to update:', itemToUpdate); 
      
      if (!itemToUpdate) {
          console.error(`[CartPage] 未找到购物车项目 ${cartItemId} 进行更新`);
          throw new Error(`未找到购物车项目 ${cartItemId}`);
      }
      const ticketTypeId = itemToUpdate.ticketTypeId;
      
      // 新增/确认日志：检查提取的 ticketTypeId
      console.log(`[CartPage] 找到项目 ${cartItemId} 的票种ID: ${ticketTypeId}`, '(Type:', typeof ticketTypeId + ')'); 


      if (newQuantity === 0) {
        // 删除项目
        await removeFromCart(cartItemId);
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      } else {
        // 更新数量
        // **修改这里：将 ticketTypeId 作为第三个参数传递**
        await updateCartItemQuantity(cartItemId, newQuantity, ticketTypeId);
        setCartItems(prev => prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity, totalPrice: item.pricePerTicket * newQuantity }
            : item
        ));
      }
      setError(null);
    } catch (err) {
      console.error('更新购物车失败:', err);
      setError('更新失败: ' + (err.message || '未知错误'));
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // 删除商品
  const handleRemoveItem = async (cartItemId) => {
    if (!confirm('确定要删除这个项目吗？')) {
      return;
    }

    // 调用 handleQuantityChange 并将数量设置为 0 来触发删除逻辑
    await handleQuantityChange(cartItemId, 0);
  };

  // 结账
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("购物车是空的");
      return;
    }

    try {
      setIsCheckingOut(true);
      console.log('开始结账...');

      const result = await checkout(cartItems);
      console.log('结账API调用完成:', result);
      
      if (result && result.success) {
        alert(result.message || "结账成功！您的订单正在处理中。");
        setCartItems([]); // Clear the cart on successful checkout
        // Navigate to a relevant page
        navigate("/user/tickets"); 
      } else {
        alert(result.message || "结账失败，请重试。");
      }

    } catch (err) {
      console.error('结账失败:', err);
      setError("结账失败: " + (err.message || '未知错误'));
    } finally {
      setIsCheckingOut(false);
    }
  };

  // 计算总价
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>加载购物车...</p>
      </div>
    );
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
          <div key={item.cartItemId} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <img
                src={item.eventImage}
                alt={item.eventName}
                onError={(e) => {
                  e.target.src = '/default-event-image.jpg';
                }}
              />
            </div>

            <div className={styles.itemDetails}>
              <h3>{item.eventName}</h3>
              <p className={styles.ticketType}>{item.ticketName}</p>
              <div className={styles.itemInfo}>
                <p><strong>日期:</strong> {item.date}</p>
                <p><strong>时间:</strong> {item.time}</p>
                <p><strong>地点:</strong> {item.venue}</p>
                {item.ticketDescription && (
                  <p className={styles.description}>{item.ticketDescription}</p>
                )}
              </div>
            </div>

            <div className={styles.itemQuantity}>
              <button
                onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                disabled={updating.has(item.cartItemId) || isCheckingOut}
                className={styles.quantityBtn}
              >
                -
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                disabled={updating.has(item.cartItemId) || isCheckingOut || item.quantity >= item.availableQuantity}
                className={styles.quantityBtn}
              >
                +
              </button>
            </div>

            <div className={styles.itemPrice}>
              <p className={styles.unitPrice}>${item.pricePerTicket.toFixed(2)} 每张</p>
              <p className={styles.totalPrice}>${item.totalPrice.toFixed(2)}</p>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveItem(item.cartItemId)}
                disabled={updating.has(item.cartItemId) || isCheckingOut}
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
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          {/* 可以添加其他费用，如运费、税费等 */}
          {/* <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>$0.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax:</span>
            <span>$0.00</span>
          </div> */}
          <div className={`${styles.summaryRow} ${styles.orderTotal}`}>
            <span>订单总计:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <button
          className={styles.checkoutBtn}
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || isCheckingOut || updating.size > 0}
        >
          {isCheckingOut ? '处理中...' : '去结账'}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
