import React, { useState } from 'react';
import { refundTicket, downloadTicket } from '../../../services/ticketService';
import styles from './TicketDetails.module.css';
// 导入 QRCode 组件 (使用 react-qr-code)
import QRCode from 'react-qr-code';

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

  // 构建 QR Code 的内容字符串
  // 您可以根据需要包含更多票据信息
  const qrCodeValue = `Ticket ID: ${ticket.id}\nEvent: ${ticket.eventName}\nTicket Type: ${ticket.ticketTypeName}\nDate: ${ticket.eventDate}\nTime: ${ticket.eventTime}\nVenue: ${ticket.eventVenue}${ticket.seat ? `\nSeat: ${ticket.seat}` : ''}`;


  return (
    <div className={styles.ticketDetails}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>

      <div className={styles.ticketHeader}>
        <h3>{ticket.eventName}</h3>
      </div>

      <div className={styles.ticketContent}>

        <div className={styles.rightColumn}>
          {ticket.status === 'active' && (
            <div className={styles.qrCodeSection}>
              <p className={styles.qrInstruction}>Present this QR code at the venue</p>
              <div className={styles.qrCode}>
                {/* 使用 QRCode 组件生成二维码 */}
                {/* react-qr-code 使用 value 和 size 属性 */}
                <QRCode
                  value={qrCodeValue} // 使用构建好的字符串作为二维码内容
                  size={128} // 设置二维码的大小 (像素)
                  // react-qr-code does not have a 'level' prop, it uses 'level' for error correction
                  // If you need error correction level, you might need to check react-qr-code documentation
                  // or stick with qrcode.react if you can resolve the import issue.
                />
                {/* Original image code (commented out or removed) */}
                {/* <img src={ticket.qrCode} alt="Ticket QR Code" /> */}
              </div>
                      <div className={styles.infoRow}>
            <span>Ticket ID:</span>
            <span>{ticket.id}</span>
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