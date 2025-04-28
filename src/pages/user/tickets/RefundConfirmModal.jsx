import React, { useState } from 'react';
import styles from './RefundConfirmModal.module.css';

function RefundConfirmModal({ ticket, onClose, onConfirm }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      setError('');
      await onConfirm(ticket.id);
    } catch (err) {
      setError(err.message || 'Failed to process refund');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Confirm Refund</h3>
        
        <div className={styles.content}>
          <p className={styles.warning}>Are you sure you want to refund this ticket?</p>
          <p>This action cannot be undone.</p>
          
          <div className={styles.ticketInfo}>
            <p><strong>Event:</strong> {ticket.eventName}</p>
            <p><strong>Date:</strong> {ticket.date}</p>
            <p><strong>Time:</strong> {ticket.time}</p>
            <p><strong>Ticket Type:</strong> {ticket.ticketType}</p>
            <p><strong>Quantity:</strong> {ticket.quantity}</p>
            <p><strong>Amount to be refunded:</strong> ${ticket.totalPrice.toFixed(2)}</p>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Confirm Refund'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RefundConfirmModal;