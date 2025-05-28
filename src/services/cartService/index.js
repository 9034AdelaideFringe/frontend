/**
 * 购物车服务主入口
 * 导出所有购物车相关的操作
 */

// 导出CRUD操作
export { getCartItems } from './operations/getCartItems';
export { addToCart } from './operations/addToCart';
export { updateCartItemQuantity } from './operations/updateCartItem';
export { removeFromCart } from './operations/removeFromCart';
export { checkout } from './operations/checkout';
export { enrichCartItems } from './operations/enrichCartItems';

// 导出配置和工具函数（如果需要）
export * from './config';
export * from './utils';

// 默认导出一个包含所有操作的对象
export default {
  getCartItems: () => import('./operations/getCartItems').then(m => m.getCartItems),
  addToCart: () => import('./operations/addToCart').then(m => m.addToCart),
  updateCartItemQuantity: () => import('./operations/updateCartItem').then(m => m.updateCartItemQuantity),
  removeFromCart: () => import('./operations/removeFromCart').then(m => m.removeFromCart),
  checkout: () => import('./operations/checkout').then(m => m.checkout),
  enrichCartItems: () => import('./operations/enrichCartItems').then(m => m.enrichCartItems),
};