import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems } from '../../services/cartService';
import styles from './CartIcon.module.css';

const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);
  
  useEffect(() => {
    getCartItems()
      .then(items => {
        setItemCount(items.length);
      })
      .catch(error => {
        console.error('Error fetching cart count:', error);
      });
  }, []);
  
  return (
    <Link to="/user/cart" className={styles.cartIcon}> {/* 修改链接到 /user/cart */}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
    </Link>
  );
};

export default CartIcon;