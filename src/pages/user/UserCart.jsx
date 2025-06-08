import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCartItems,
  // Removed updateCartItemQuantity import
  removeFromCart,
  checkout, // Import checkout
} from "../../services/cartService";
import styles from "./UserCart.module.css";
// Assuming getFullImageUrl is available in a shared utility file, e.g., ../../utils/imageUtils
// import { getFullImageUrl } from '../../utils/imageUtils'; // Example import if needed

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [processingItemId, setProcessingItemId] = useState(null); // State for item being removed
  const navigate = useNavigate();

  // Load cart items
  useEffect(() => {
    loadCartItems();
  }, []); // Empty dependency array means this effect runs once on mount

  const loadCartItems = async () => {
    try {
      setLoading(true);
      console.log('Loading cart items...');
      // Call the updated getCartItems function (no longer needs enrichData=true)
      const items = await getCartItems();
      // Note: items received here are already in the mapped frontend format
      setCartItems(items);
      setError(null);
      console.log('Cart loaded:', items);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Removed handleQuantityChange function as quantity modification is no longer needed.


  // Remove item from cart
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
        // Removed diagnostic log: console.log(`[UserCart.jsx] Attempting to remove item with ID: ${itemId}`);
        // Call removeFromCart directly
        await removeFromCart(itemId);
        setError(null);
        console.log(`Item ${itemId} removed successfully.`);
      } catch (err) {
        console.error(`Failed to remove item ${itemId}:`, err);
        setError('Failed to remove item: ' + (err.message || 'Unknown error'));
        // Rollback UI to original state if API call fails
        setCartItems(originalCartItems);
      } finally {
        setProcessingItemId(null); // Clear processing state
      }
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setIsCheckingOut(true);
      console.log('Starting checkout...');
      // Pass current cart items to checkout (assuming checkout service uses this)
      const result = await checkout(cartItems);

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
      console.error('Checkout failed:', err);
      setError('Checkout failed: ' + (err.message || 'Unknown error'));
      setIsCheckingOut(false);
    }
  };

  const calculateTotalPrice = () => {
    // Sum up totalPrice from each item (which is quantity * pricePerTicket, where quantity is 1)
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your cart...</div>;
  }

  return (
    <div className={styles.cartPage}>
      {cartItems.length === 0 && !loading ? ( // Only show when not loading and cart is empty
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/events" className={styles.browseBtn}>
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <h2>Your Cart</h2>
          {error && <div className={styles.error}>{error}</div>} {/* Display error message */}
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              // Removed diagnostic log: console.log('[UserCart.jsx] Mapping item with ID:', item.id, 'and cartItemId:', item.cartItemId);
              <div key={item.id} className={styles.cartItem}> {/* Use backend cart_item_id as key */}
                <div className={styles.itemImage}>
                  {/* Assuming item.eventImage contains the image path/URL mapped from API */}
                  {/* You might need a utility function here to construct the full URL if item.eventImage is a relative path */}
                  {/* <img src={getFullImageUrl(item.eventImage)} alt={item.eventName} /> */}
                  <img src={item.eventImage} alt={item.eventName} /> {/* Using mapped path directly */}
                </div>

                <div className={styles.itemDetails}>
                  <h3>{item.eventName}</h3>
                  <div className={styles.itemInfo}>
                    {/* Assuming backend provides these details, mapped in mapCartItemFromApi */}
                    <p>
                      <strong>Date:</strong> {item.eventDate} {/* Use mapped eventDate */}
                    </p>
                    <p>
                      <strong>Time:</strong> {item.eventTime} {/* Use mapped eventTime */}
                    </p>
                    <p>
                      <strong>Venue:</strong> {item.eventVenue} {/* Use mapped eventVenue */}
                    </p>
                    <p>
                      <strong>Ticket Type:</strong> {item.ticketTypeName} {/* Use mapped ticketTypeName */}
                    </p>
                     {/* Display Seat information if available */}
                     {item.seat && (
                         <p>
                             <strong>Seat:</strong> {item.seat} {/* Display mapped seat */}
                         </p>
                     )}
                  </div>
                </div>

                {/* Removed Quantity controls */}
                {/*
                <div className={styles.itemQuantity}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || isCheckingOut || processingItemId === item.id}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={isCheckingOut || processingItemId === item.id}
                  >
                    +
                  </button>
                </div>
                */}

                <div className={styles.itemPrice}>
                  {/* Display total price for this item (which is pricePerTicket * 1) */}
                  ${(item.totalPrice || 0).toFixed(2)}
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isCheckingOut || processingItemId === item.id} // Disable if checking out or processing this item
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
            {/* Add other fees like tax, shipping, etc. if applicable */}
            <div className={styles.summaryRow}>
              <span>Total:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckingOut} // Disable if cart is empty or checking out
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
