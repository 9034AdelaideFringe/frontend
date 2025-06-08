/**
 * Cart Service Main Entry Point
 * Exports all cart-related operations
 */

// Export CRUD operations
export { getCartItems } from './operations/getCartItems';
export { addToCart } from './operations/addToCart';
export { removeFromCart } from './operations/removeFromCart';
export { checkout } from './operations/checkout';

// Export config and utility functions (if needed)
export * from './config';
export * from './utils';

// Default export an object containing all operations
export default {
  getCartItems: () => import('./operations/getCartItems').then(m => m.getCartItems),
  addToCart: () => import('./operations/addToCart').then(m => m.addToCart),
  removeFromCart: () => import('./operations/removeFromCart').then(m => m.removeFromCart),
  checkout: () => import('./operations/checkout').then(m => m.checkout),
};