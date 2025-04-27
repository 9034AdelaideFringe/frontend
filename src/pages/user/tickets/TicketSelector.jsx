import React, { useState, useEffect } from 'react';
import { getTicketTypesByEventId } from '../../../services/ticketService';
import styles from './TicketSelector.module.css';

function TicketSelector({ eventId, onAddToCart, onBuyNow }) {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 加载票种数据
  useEffect(() => {
    setLoading(true);
    getTicketTypesByEventId(eventId)
      .then(data => {
        setTicketTypes(data);
        // 初始化选择状态
        const initialSelection = {};
        data.forEach(type => {
          initialSelection[type.id] = 0;
        });
        setSelectedTickets(initialSelection);
        setLoading(false);
      })
      .catch(err => {
        setError('无法加载票种信息');
        setLoading(false);
        console.error(err);
      });
  }, [eventId]);
  
  // 更新选择的票数量
  const updateTicketCount = (ticketTypeId, change) => {
    setSelectedTickets(prev => {
      const currentCount = prev[ticketTypeId] || 0;
      const newCount = Math.max(0, currentCount + change);
      return { ...prev, [ticketTypeId]: newCount };
    });
  };
  
  // 准备购物车项目
  const prepareCartItems = () => {
    const items = [];
    
    ticketTypes.forEach(type => {
      const quantity = selectedTickets[type.id] || 0;
      if (quantity > 0) {
        items.push({
          eventId,
          ticketTypeId: type.id,
          ticketType: type.name,
          quantity,
          pricePerTicket: type.price,
          totalPrice: type.price * quantity
        });
      }
    });
    
    return items;
  };
  
  // 添加到购物车
  const handleAddToCart = () => {
    const items = prepareCartItems();
    if (items.length === 0) {
      alert('请至少选择一张票');
      return;
    }
    onAddToCart(items);
  };
  
  // 立即购买
  const handleBuyNow = () => {
    const items = prepareCartItems();
    if (items.length === 0) {
      alert('请至少选择一张票');
      return;
    }
    onBuyNow(items);
  };
  
  // 计算总价
  const totalPrice = ticketTypes.reduce((sum, type) => {
    const quantity = selectedTickets[type.id] || 0;
    return sum + (type.price * quantity);
  }, 0);
  
  // 计算总票数
  const totalTickets = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);
  
  if (loading) return <div className={styles.loading}>加载票种信息...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (ticketTypes.length === 0) return <div className={styles.noTickets}>此活动暂无可用票种</div>;
  
  return (
    <div className={styles.ticketSelector}>
      <h3>选择票种</h3>
      <div className={styles.ticketList}>
        {ticketTypes.map(type => (
          <div key={type.id} className={styles.ticketType}>
            <div className={styles.ticketInfo}>
              <h4>{type.name}</h4>
              <p className={styles.description}>{type.description}</p>
              <p className={styles.price}>${type.price.toFixed(2)}</p>
              <p className={styles.availability}>剩余: {type.availableQuantity}</p>
            </div>
            <div className={styles.ticketActions}>
              <button 
                onClick={() => updateTicketCount(type.id, -1)}
                disabled={!selectedTickets[type.id]}
                className={styles.quantityBtn}
              >
                -
              </button>
              <span className={styles.quantity}>{selectedTickets[type.id] || 0}</span>
              <button 
                onClick={() => updateTicketCount(type.id, 1)}
                disabled={selectedTickets[type.id] >= type.availableQuantity}
                className={styles.quantityBtn}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <div className={styles.totalInfo}>
          <span>总计: {totalTickets} 张票</span>
          <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
        </div>
        <div className={styles.actions}>
          <button 
            onClick={handleAddToCart} 
            disabled={totalTickets === 0}
            className={styles.addToCartBtn}
          >
            添加到购物车
          </button>
          <button 
            onClick={handleBuyNow} 
            disabled={totalTickets === 0}
            className={styles.buyNowBtn}
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketSelector;