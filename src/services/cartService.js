/**
 * 购物车服务 - 兼容性封装
 * 为了保持向后兼容，重新导出新模块化结构的功能
 */

// 从新的模块化结构中导入所有功能
export { 
  getCartItems,
  addToCart, 
  updateCartItemQuantity,
  removeFromCart,
  checkout
} from './cartService/index';

// 保持向后兼容的默认导出
import cartServiceOperations from './cartService/index';
export default cartServiceOperations;