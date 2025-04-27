import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import styles from './OrderConfirmation.module.css';

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { orderId } = useParams();
  
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('无法加载订单信息');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return <div className={styles.loading}>加载订单信息...</div>;
  }
  
  if (error || !order) {
    return <div className={styles.error}>{error || '订单信息不可用'}</div>;
  }
  
  return (
    <div className={styles.orderConfirmation}>
      <div className={styles.successMessage}>
        <h2>订单已确认!</h2>
        <p>您的票已成功购买，现已可在"我的票据"中查看</p>
      </div>
      
      <div className={styles.orderDetails}>
        <div className={styles.orderHeader}>
          <h3>订单号: {order.id}</h3>
          <span className={styles.orderDate}>
            日期: {new Date(order.date).toLocaleDateString()}
          </span>
        </div>
        
        <div className={styles.orderItems}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <div className={styles.itemDetails}>
                <h4>{item.eventName}</h4>
                <p>日期: {item.date || order.date}</p>
                <p>票种: {item.ticketType}</p>
                <p>数量: {item.quantity}</p>
                <p>单价: ${item.pricePerTicket.toFixed(2)}</p>
              </div>
              <div className={styles.itemPrice}>
                ${item.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.orderTotal}>
          <span>总计:</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <Link to="/my-tickets" className={styles.viewTicketsBtn}>
          查看我的票据
        </Link>
        <Link to="/events" className={styles.browseEventsBtn}>
          继续浏览活动
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;