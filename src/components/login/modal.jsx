import React, { useEffect } from 'react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, title, children }) => {
  // 添加调试日志
  console.log(`Modal "${title}" rendering:`, { isOpen });
  
  useEffect(() => {
    console.log(`Modal "${title}" effect running:`, { isOpen });
    
    if (isOpen) {
      console.log(`Modal "${title}" is now open`);
      document.body.style.overflow = 'hidden';
    } else {
      console.log(`Modal "${title}" is now closed`);
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      console.log(`Modal "${title}" effect cleanup`);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, title]);
  
  if (!isOpen) {
    console.log(`Modal "${title}" not rendering because isOpen is false`);
    return null;
  }

  console.log(`Modal "${title}" rendering content`);
  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      console.log(`Modal "${title}" overlay clicked`);
      if (e.target.className === styles.modalOverlay) {
        onClose();
      }
    }}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button 
            className={styles.modalClose} 
            onClick={() => {
              console.log(`Modal "${title}" close button clicked`);
              onClose();
            }}
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