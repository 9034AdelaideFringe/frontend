import React, { useEffect } from 'react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Only close if the actual overlay was clicked (not when hovering)
    // and not when clicking on the modal content (event bubbling)
    if (e.target.className === styles.modalOverlay) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button 
            className={styles.modalClose} 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal