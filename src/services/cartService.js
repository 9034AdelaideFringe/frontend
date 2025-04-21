import { mockCartItems } from './cartMock';

// Get cart items
export const getCartItems = () => {
  // In a real application, this would fetch from an API
  return Promise.resolve(mockCartItems);
};

// Add item to cart
export const addToCart = (item) => {
  console.log('Adding to cart:', item);
  // In a real application, this would send data to an API
  return Promise.resolve({ success: true, message: 'Item added to cart' });
};

// Update item quantity
export const updateCartItemQuantity = (itemId, quantity) => {
  console.log(`Updating item ${itemId} quantity to ${quantity}`);
  // In a real application, this would update the item in the API
  return Promise.resolve({ success: true, message: 'Cart updated' });
};

// Remove item from cart
export const removeFromCart = (itemId) => {
  console.log('Removing item from cart:', itemId);
  // In a real application, this would remove the item via the API
  return Promise.resolve({ success: true, message: 'Item removed from cart' });
};

// Checkout
export const checkout = (cartItems) => {
  console.log('Checking out with items:', cartItems);
  // In a real application, this would process the purchase via the API
  return Promise.resolve({ success: true, message: 'Checkout successful', orderId: 'ORD-' + Date.now() });
};