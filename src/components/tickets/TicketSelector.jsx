import React, { useState } from 'react';
import styles from './TicketSelector.module.css';

const TicketSelector = ({ event, onAddToCart, onBuyNow }) => {
  const [ticketType, setTicketType] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  
  // Mock ticket types and prices
  const ticketOptions = [
    { type: 'Standard', price: parseFloat(event.price.split('-')[0]) || 30 },
    { type: 'Premium', price: parseFloat(event.price.split('-')[1]) || 50 },
    { type: 'VIP', price: parseFloat(event.price.split('-')[1]) * 1.5 || 75 }
  ];
  
  const selectedTicket = ticketOptions.find(option => option.type === ticketType);
  const totalPrice = selectedTicket.price * quantity;
  
  const handleAddToCart = () => {
    const cartItem = {
      eventId: event.id,
      eventName: event.title,
      eventImage: event.image,
      date: event.date,
      time: event.time,
      venue: event.venue,
      ticketType,
      quantity,
      pricePerTicket: selectedTicket.price,
      totalPrice
    };
    onAddToCart(cartItem);
  };
  
  const handleBuyNow = () => {
    const cartItem = {
      eventId: event.id,
      eventName: event.title,
      eventImage: event.image,
      date: event.date,
      time: event.time,
      venue: event.venue,
      ticketType,
      quantity,
      pricePerTicket: selectedTicket.price,
      totalPrice
    };
    onBuyNow(cartItem);
  };

  return (
    <div className={styles.ticketSelector}>
      <h3>Select Tickets</h3>
      
      <div className={styles.ticketOptions}>
        <div className={styles.formGroup}>
          <label htmlFor="ticketType">Ticket Type</label>
          <select 
            id="ticketType" 
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          >
            {ticketOptions.map(option => (
              <option key={option.type} value={option.type}>
                {option.type} - ${option.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantity</label>
          <div className={styles.quantitySelector}>
            <button 
              type="button" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input 
              type="number" 
              id="quantity" 
              min="1" 
              max="10"
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button 
              type="button"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.summary}>
        <p className={styles.totalPrice}>
          Total: <span>${totalPrice.toFixed(2)}</span>
        </p>
        
        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.addToCartBtn} 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button 
            type="button" 
            className={styles.buyNowBtn}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelector;