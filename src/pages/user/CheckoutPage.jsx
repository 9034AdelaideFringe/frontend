import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, checkout } from '../../services/cartService';

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  // 加载购物车数据
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const items = await getCartItems();
        console.log("Cart items loaded:", items);
        
        if (!items || items.length === 0) {
          alert('Your cart is empty');
          navigate('/user/cart');
          return;
        }
        
        setCartItems(items);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart items: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    
    loadCartItems();
  }, [navigate]);
  
  // 处理提交订单
  const handleCheckout = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const result = await checkout();
      alert(`Order placed successfully! Order ID: ${result.order.id}`);
      navigate('/user/tickets');
    } catch (err) {
      setError("Checkout failed: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 计算总价
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };
  
  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h2>Loading your cart items...</h2>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{padding: '20px', color: 'red', border: '1px solid red', margin: '20px'}}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/user/cart')}>Back to Cart</button>
      </div>
    );
  }
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1 style={{textAlign: 'center'}}>Checkout</h1>
      
      <div style={{marginBottom: '20px'}}>
        <button 
          onClick={() => navigate('/user/cart')} 
          style={{padding: '8px 16px'}}
          disabled={isProcessing}
        >
          Back to Cart
        </button>
      </div>
      
      <div>
        <h2>Order Summary</h2>
        <div style={{marginBottom: '20px', border: '1px solid #eee', padding: '15px'}}>
          {cartItems.map((item, index) => (
            <div key={index} style={{
              padding: '10px', 
              borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{fontWeight: 'bold'}}>{item.eventName}</div>
                <div>{item.ticketName} × {item.quantity}</div>
              </div>
              <div style={{fontWeight: 'bold'}}>
                ${(item.totalPrice || 0).toFixed(2)}
              </div>
            </div>
          ))}
          
          <div style={{
            marginTop: '15px', 
            paddingTop: '15px', 
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '1.2em'
          }}>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <h2>Billing Information</h2>
        <div style={{marginBottom: '20px', border: '1px solid #eee', padding: '15px'}}>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Name</label>
            <input
              type="text"
              style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
              placeholder="Enter your full name"
            />
          </div>
          
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Email</label>
            <input
              type="email"
              style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
              placeholder="Enter your email address"
            />
          </div>
          
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Phone</label>
            <input
              type="tel"
              style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <h2>Payment Method</h2>
        <div style={{marginBottom: '20px', border: '1px solid #eee', padding: '15px'}}>
          <div style={{marginBottom: '10px'}}>
            <input type="radio" id="credit-card" name="payment-method" defaultChecked />
            <label htmlFor="credit-card" style={{marginLeft: '5px'}}>Credit Card</label>
          </div>
          
          <div style={{marginBottom: '10px'}}>
            <input type="radio" id="paypal" name="payment-method" />
            <label htmlFor="paypal" style={{marginLeft: '5px'}}>PayPal</label>
          </div>
          
          <div style={{marginBottom: '10px'}}>
            <input type="radio" id="bank-transfer" name="payment-method" />
            <label htmlFor="bank-transfer" style={{marginLeft: '5px'}}>Bank Transfer</label>
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: isProcessing ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;