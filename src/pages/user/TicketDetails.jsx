import React, { useState } from 'react';
import { refundTicket, downloadTicket } from '../../services/ticketService';
import styles from './TicketDetails.module.css';

function TicketDetails({ ticket, onClose, onRefund }) {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Check if ticket is refundable
  const isRefundable = () => {
    if (ticket.status !== 'active') return false;
    
    const today = new Date();
    const lastRefundDate = new Date(ticket.lastRefundDate);
    return today <= lastRefundDate;
  };
  
  // Handle refund
  const handleRefund = async () => {
    if (!isRefundable()) {
      setRefundError('This ticket cannot be refunded');
      return;
    }
    
    if (!window.confirm('Are you sure you want to refund this ticket? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsRefunding(true);
      await refundTicket(ticket.id);
      if (onRefund) onRefund(ticket.id);
    } catch (err) {
      setRefundError(err.message || 'Failed to refund');
      console.error('Refund error:', err);
    } finally {
      setIsRefunding(false);
    }
  };
  
  // Download ticket
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadTicket(ticket.id);
      setIsDownloading(false);
      alert('Ticket has been downloaded');
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed');
      setIsDownloading(false);
    }
  };
  
  // Format status text
  const formatStatus = (status) => {
    const statusMap = {
      'active': 'Valid',
      'used': 'Used',
      'cancelled': 'Refunded',
      'expired': 'Expired'
    };
    return statusMap[status] || status;
  };
  
  return (
    <div className={styles.ticketDetails}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      
      <div className={styles.ticketHeader}>
        <h3>{ticket.eventName}</h3>
      </div>
      
      <div className={styles.ticketContent}>
        <div className={styles.ticketInfo}>
          <div className={styles.infoRow}>
            <span>Date:</span>
            <span>{ticket.date}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Time:</span>
            <span>{ticket.time}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Venue:</span>
            <span>{ticket.venue}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Ticket Type:</span>
            <span>{ticket.ticketType}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Quantity:</span>
            <span>{ticket.quantity}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Ticket ID:</span>
            <span>{ticket.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Purchase Date:</span>
            <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          {ticket.status === 'active' && (
            <div className={styles.qrCodeSection}>
              <p className={styles.qrInstruction}>Present this QR code at the venue</p>
              <div className={styles.qrCode}>
                <img src={ticket.qrCode} alt="Ticket QR Code" />
              </div>
              <p className={styles.validUntil}>
                Valid until: {ticket.expiryDate}
              </p>
            </div>
          )}
          
          <div className={styles.actions}>
            <button 
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download Ticket'}
            </button>
            
            {isRefundable() && (
              <button 
                className={styles.refundBtn}
                onClick={handleRefund}
                disabled={isRefunding}
              >
                {isRefunding ? 'Processing...' : 'Request Refund'}
              </button>
            )}
            
            {ticket.status === 'active' && !isRefundable() && (
              <p className={styles.refundNote}>
                Refund deadline: {new Date(ticket.lastRefundDate).toLocaleDateString()} (expired)
              </p>
            )}
            
            {refundError && (
              <p className={styles.error}>{refundError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;