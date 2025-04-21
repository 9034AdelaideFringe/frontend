import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, updateCartItemQuantity, removeFromCart, checkout } from '../../services/cartService';
import styles from './UserCart.module.css';

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCartItems()
      .then(items => {
        setCartItems(items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    updateCartItemQuantity(itemId, newQuantity)
      .then(() => {
        // Update local state
        setCartItems(cartItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity, totalPrice: item.pricePerTicket * newQuantity } 
            : item
        ));
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(itemId)
        .then(() => {
          // Remove from local state
          setCartItems(cartItems.filter(item => item.id !== itemId));
        })
        .catch(error => {
          console.error('Error removing item:', error);
        });
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    checkout(cartItems)
      .then(response => {
        alert(`Checkout successful! Your order ID is: ${response.orderId}`);
        // Redirect to tickets page
        navigate('/user/tickets');
      })
      .catch(error => {
        console.error('Checkout failed:', error);
        setIsCheckingOut(false);
        alert('Checkout failed. Please try again.');
      });
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your cart...</div>;
  }

  return (
    <div className={styles.cartPage}>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/events" className={styles.browseBtn}>Browse Events</Link>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.eventImage} alt={item.eventName} />
                </div>
                
                <div className={styles.itemDetails}>
                  <h3>{item.eventName}</h3>
                  <div className={styles.itemInfo}>
                    <p><strong>Date:</strong> {item.date}</p>
                    <p><strong>Time:</strong> {item.time}</p>
                    <p><strong>Venue:</strong> {item.venue}</p>
                    <p><strong>Ticket Type:</strong> {item.ticketType}</p>
                  </div>
                </div>
                
                <div className={styles.itemQuantity}>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
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
                  <p>${item.pricePerTicket.toFixed(2)} each</p>
                  <p className={styles.totalPrice}>${item.totalPrice.toFixed(2)}</p>
                </div>
                
                <button 
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Service Fee:</span>
                <span>$5.00</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total:</span>
                <span>${(calculateTotalPrice() + 5).toFixed(2)}</span>
              </div>
            </div>
            
            <div className={styles.checkoutActions}>
              <Link to="/events" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
              <button 
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;