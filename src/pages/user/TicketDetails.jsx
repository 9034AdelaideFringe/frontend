import React, { useState } from 'react';
import { refundTicket, downloadTicket } from '../../services/ticketService';
import styles from './TicketDetails.module.css';

function TicketDetails({ ticket, onClose, onRefund }) {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 检查票是否可退
  const isRefundable = () => {
    if (ticket.status !== 'active') return false;
    
    const today = new Date();
    const lastRefundDate = new Date(ticket.lastRefundDate);
    return today <= lastRefundDate;
  };
  
  // 退票处理
  const handleRefund = async () => {
    if (!isRefundable()) {
      setRefundError('此票不可退');
      return;
    }
    
    if (!window.confirm('确认要退票吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setIsRefunding(true);
      await refundTicket(ticket.id);
      if (onRefund) onRefund(ticket.id);
    } catch (err) {
      setRefundError(err.message || '退票失败');
      console.error('退票错误:', err);
    } finally {
      setIsRefunding(false);
    }
  };
  
  // 下载票据
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadTicket(ticket.id);
      setIsDownloading(false);
      alert('票据已下载');
    } catch (err) {
      console.error('下载失败:', err);
      alert('下载失败');
      setIsDownloading(false);
    }
  };
  
  // 格式化状态文本
  const formatStatus = (status) => {
    const statusMap = {
      'active': '有效',
      'used': '已使用',
      'cancelled': '已退票',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  };
  
  return (
    <div className={styles.ticketDetails}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      
      <div className={styles.ticketHeader}>
        <h3>{ticket.eventName}</h3>
        <span className={`${styles.statusBadge} ${styles[ticket.status]}`}>
          {formatStatus(ticket.status)}
        </span>
      </div>
      
      <div className={styles.ticketInfo}>
        <div className={styles.infoRow}>
          <span>活动日期:</span>
          <span>{ticket.date}</span>
        </div>
        <div className={styles.infoRow}>
          <span>活动时间:</span>
          <span>{ticket.time}</span>
        </div>
        <div className={styles.infoRow}>
          <span>活动地点:</span>
          <span>{ticket.venue}</span>
        </div>
        <div className={styles.infoRow}>
          <span>票种:</span>
          <span>{ticket.ticketType}</span>
        </div>
        <div className={styles.infoRow}>
          <span>票数:</span>
          <span>{ticket.quantity}</span>
        </div>
        <div className={styles.infoRow}>
          <span>票号:</span>
          <span>{ticket.id}</span>
        </div>
        <div className={styles.infoRow}>
          <span>购票日期:</span>
          <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      {ticket.status === 'active' && (
        <div className={styles.qrCodeSection}>
          <p className={styles.qrInstruction}>请在活动现场出示此二维码</p>
          <div className={styles.qrCode}>
            <img src={ticket.qrCode} alt="Ticket QR Code" />
          </div>
          <p className={styles.validUntil}>
            有效期至: {ticket.expiryDate}
          </p>
        </div>
      )}
      
      <div className={styles.actions}>
        <button 
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? '下载中...' : '下载票据'}
        </button>
        
        {isRefundable() && (
          <button 
            className={styles.refundBtn}
            onClick={handleRefund}
            disabled={isRefunding}
          >
            {isRefunding ? '处理中...' : '申请退票'}
          </button>
        )}
        
        {ticket.status === 'active' && !isRefundable() && (
          <p className={styles.refundNote}>
            退票期限: {new Date(ticket.lastRefundDate).toLocaleDateString()} (已过期)
          </p>
        )}
        
        {refundError && (
          <p className={styles.error}>{refundError}</p>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;