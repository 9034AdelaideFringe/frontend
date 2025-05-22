import React, { useState, useEffect } from 'react';
import { getTicketTypesByEventIdAPI } from '../services/ticketService/ticketTypeService';
import styles from './TicketSelector.module.css';

const TicketSelector = ({ eventId, onAddToCart, onBuyNow }) => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 加载票种数据
  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        setLoading(true);
        const data = await getTicketTypesByEventIdAPI(eventId);
        setTicketTypes(data);
        
        // 初始化选择状态
        const initialSelection = {};
        data.forEach(type => {
          initialSelection[type.id] = 0;
        });
        setSelectedTickets(initialSelection);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load ticket types:', err);
        setError('Unable to load ticket information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTicketTypes();
  }, [eventId]);
  
  // 更新选择的票数量
  const updateTicketCount = (ticketTypeId, change) => {
    setSelectedTickets(prev => {
      const currentCount = prev[ticketTypeId] || 0;
      const newCount = Math.max(0, currentCount + change);
      
      // 确保不超过可用数量
      const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
      const maxAvailable = ticketType ? ticketType.available_quantity : 0;
      
      return {
        ...prev,
        [ticketTypeId]: Math.min(newCount, maxAvailable)
      };
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
          ticketName: type.name,
          ticketDescription: type.description,
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
      alert('Please select at least one ticket');
      return;
    }
    onAddToCart(items);
  };
  
  // 立即购买
  const handleBuyNow = () => {
    const items = prepareCartItems();
    if (items.length === 0) {
      alert('Please select at least one ticket');
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
  
  if (loading) return <div className={styles.loading}>Loading ticket information...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  return (
    <div className={styles.ticketSelector}>
      
      {ticketTypes.length === 0 ? (
        <div className={styles.noTickets}>
          <p>No tickets are currently available for this event.</p>
        </div>
      ) : (
        <>
          <div className={styles.ticketList}>
            {ticketTypes.map(ticket => (
              <div key={ticket.id} className={styles.ticketItem}>
                <div className={styles.ticketInfo}>
                  <h4 className={styles.ticketName}>{ticket.name}</h4>
                  <p className={styles.ticketPrice}>${ticket.price.toFixed(2)}</p>
                  {ticket.description && (
                    <p className={styles.ticketDescription}>{ticket.description}</p>
                  )}
                  <p className={styles.ticketAvailability}>
                    Available: <span className={ticket.available_quantity > 10 ? 
                      styles.plentyAvailable : styles.limitedAvailable}>
                      {ticket.available_quantity}
                    </span>
                  </p>
                </div>
                
                <div className={styles.ticketActions}>
                  <button 
                    className={styles.decrementBtn}
                    onClick={() => updateTicketCount(ticket.id, -1)}
                    disabled={selectedTickets[ticket.id] <= 0}
                  >
                    -
                  </button>
                  <span className={styles.ticketCount}>
                    {selectedTickets[ticket.id] || 0}
                  </span>
                  <button 
                    className={styles.incrementBtn}
                    onClick={() => updateTicketCount(ticket.id, 1)}
                    disabled={selectedTickets[ticket.id] >= ticket.available_quantity}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.ticketSummary}>
            <div className={styles.summaryRow}>
              <span>Total Tickets:</span>
              <span>{totalTickets}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.ticketActions}>
            <button 
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={totalTickets === 0}
            >
              Add to Cart
            </button>
            <button 
              className={styles.buyNowBtn}
              onClick={handleBuyNow}
              disabled={totalTickets === 0}
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketSelector;