import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 从 ticketService 导入 getUserTickets 和 refundTicket 函数
import { getUserTickets, refundTicket as refundTicketApi } from '../../services/ticketService'; // 导入 refundTicket 并重命名
import TicketDetails from './tickets/TicketDetails';
// 不再需要导入 RefundConfirmModal
// import RefundConfirmModal from './tickets/RefundConfirmModal';
import styles from './MyTickets.module.css';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // 移除 ticketToRefund 状态
  // const [ticketToRefund, setTicketToRefund] = useState(null);
  // 移除 refundSuccess 状态，使用一个通用的消息状态
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error' or 'info'

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getUserTickets();
      setTickets(data);
      setError(null);
      // Keep existing messages, don't clear on successful fetch unless it's the initial load
      // setMessage(null);
      // setMessageType(null);
    } catch (err) {
      setError('Unable to load ticket information');
      console.error(err);
      // Keep existing messages, don't clear on error fetch unless it's the initial load
      // setMessage(null);
      // setMessageType(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if ticket is refundable
  const isRefundable = (ticket) => {
    if (ticket.status !== 'active') return false;

    // 检查是否在最后退款日期之前
    if (!ticket.lastRefundDate) return false; // 如果没有最后退款日期，则不可退

    try {
        const today = new Date();
        // 解析后端返回的日期字符串，确保时区问题不会导致错误判断
        // 假设后端返回的日期是 YYYY-MM-DD 格式
        const [year, month, day] = ticket.lastRefundDate.split('-').map(Number);
        // 注意：使用 UTC 方法或指定时区来避免本地时区影响
        const lastRefundDate = new Date(Date.UTC(year, month - 1, day)); // 月份是 0-indexed

        // 比较日期，如果今天在最后退款日期或之前，则可退
        // 使用 setHours(0, 0, 0, 0) 确保只比较日期部分
        return today.setHours(0, 0, 0, 0) <= lastRefundDate.getTime();

    } catch (e) {
        console.error("Error parsing lastRefundDate:", ticket.lastRefundDate, e);
        return false; // 解析错误则认为不可退
    }
  };

  // 直接处理退票操作 (包含乐观更新)
  const handleRefundClick = async (ticket, e) => { // 接收整个 ticket 对象和事件对象
    if (e) {
      e.stopPropagation(); // Prevent opening ticket details if clicked from card
    }
    // 可以在这里添加一个简单的确认，或者直接执行
    if (!window.confirm(`Are you sure you want to refund the ticket for ${ticket.eventName}?`)) {
        return; // 用户取消操作
    }

    // Store the original ticket list for potential rollback
    const originalTickets = [...tickets];
    const ticketIdToRefund = ticket.id;
    const ticketName = ticket.eventName; // Store name for messages

    try {
      setMessage('Processing refund...'); // 显示处理中消息
      setMessageType('info'); // 可以添加一个 info 样式

      // --- 乐观更新：立即从前端列表中移除票据 ---
      setTickets(tickets.filter(t => t.id !== ticketIdToRefund));
      // 如果详情页打开的是当前票据，关闭详情页
      if (selectedTicket && selectedTicket.id === ticketIdToRefund) {
          closeTicketDetails();
      }
      // ------------------------------------------

      // 调用 refundTicketApi 函数，传递票据的 ID
      await refundTicketApi(ticketIdToRefund);

      // 设置成功消息
      setMessage(`Ticket for ${ticketName} has been successfully refunded.`);
      setMessageType('success');
      // 成功后，可以再次 fetchTickets 来确保数据一致性，但对于乐观更新，这不是必须立即执行的
      // fetchTickets(); // Optional: Re-fetch in background for consistency

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);

    } catch (err) {
      // 设置错误消息
      console.error('Failed to refund ticket:', err);
      setMessage('Failed to refund ticket: ' + (err.message || 'Unknown error'));
      setMessageType('error');

      // --- 回滚乐观更新：如果后端失败，将票据重新添加到前端列表 ---
      // 最简单的方式是重新获取所有票据
      fetchTickets();
      // ------------------------------------------------------

       // Auto-hide message after 5 seconds
       setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  // Open ticket details modal
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    // Prevent page scrolling
    document.body.style.overflow = 'hidden';
  };

  // Close ticket details modal
  const closeTicketDetails = () => {
    setSelectedTicket(null);
    // Restore page scrolling
    document.body.style.overflow = 'auto';
  };

  // Group tickets by status (this logic remains the same, assuming status is mapped correctly)
  const activeTickets = tickets.filter(ticket => ticket.status === 'active');
  const usedTickets = tickets.filter(ticket => ticket.status === 'used');
  const cancelledTickets = tickets.filter(ticket => ticket.status === 'cancelled');
  const expiredTickets = tickets.filter(ticket => ticket.status === 'expired');

  if (loading) {
    return <div className={styles.loading}>Loading ticket information...</div>;
  }

  // Note: We keep displaying tickets even if there's a fetch error,
  // but show the error message. The optimistic update handles deletion errors.
  // if (error) {
  //   return <div className={styles.error}>Error: {error}</div>;
  // }

  if (tickets.length === 0 && !loading && !error) { // Only show "No Tickets" if not loading and no fetch error
    return (
      <div className={styles.noTickets}>
        <h2>No Tickets Found</h2>
        <p>You haven't purchased any tickets yet</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 显示消息 */}
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}> {/* 使用 messageType 控制样式 */}
          {message}
        </div>
      )}
      {/* 显示加载错误（如果存在） */}
      {error && !loading && (
         <div className={`${styles.message} ${styles.error}`}>
            {error}
         </div>
      )}


      {activeTickets.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Valid Tickets</h2>
            <span className={styles.sectionCount}>{activeTickets.length}</span>
          </div>

          <div className={styles.ticketGrid}>
            {activeTickets.map(ticket => (
              <div
                key={ticket.id} // Use the mapped ticket ID
                className={styles.ticketCard}
                onClick={() => openTicketDetails(ticket)}
              >
                <div className={styles.ticketContent}>
                  <div className={styles.ticketHeader}>
                    {/* Access event name from mapped object */}
                    <h3 className={styles.ticketTitle}>{ticket.eventName}</h3>
                    {/* Display ticket status */}
                    <span className={`${styles.ticketStatus} ${styles.statusActive}`}>
                      {/* You might want a helper function to format status text */}
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div className={styles.ticketDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Date</span>
                      {/* Access event date from mapped object */}
                      <span className={styles.detailValue}>{ticket.eventDate}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Time</span>
                      {/* Access event time from mapped object */}
                      <span className={styles.detailValue}>{ticket.eventTime}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Venue</span>
                      {/* Access event venue from mapped object */}
                      <span className={styles.detailValue}>{ticket.eventVenue}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Ticket Type</span>
                      {/* Access ticket type name from mapped object */}
                      <span className={styles.detailValue}>{ticket.ticketTypeName}</span>
                    </div>
                     {/* Display Seat information if available */}
                     {ticket.seat && (
                         <div className={styles.detailItem}>
                             <span className={styles.detailLabel}>Seat</span>
                             <span className={styles.detailValue}>{ticket.seat}</span>
                         </div>
                     )}
                  </div>
                  <div className={styles.ticketActions}>
                   {/* Quantity is implicitly 1 per card in this new structure */}
                   {/* <div className={styles.quantity}>Quantity: {ticket.quantity || 1}</div> */}
                    <div className={styles.actionButtons}>
                      {/* isRefundable function needs to check ticket.status and ticket.lastRefundDate */}
                      {isRefundable(ticket) && (
                        <button
                          className={styles.refundBtn}
                          onClick={(e) => handleRefundClick(ticket, e)} // 直接调用处理函数
                        >
                          Refund
                        </button>
                      )}
                      {/* View button logic remains the same */}
                      <button className={styles.viewBtn} onClick={() => openTicketDetails(ticket)}>View</button>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {(usedTickets.length > 0 || cancelledTickets.length > 0 || expiredTickets.length > 0) && (
      <div className={styles.sectionDivider}></div>
    )}

    {usedTickets.length > 0 && (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Used Tickets</h2>
          <span className={styles.sectionCount}>{usedTickets.length}</span>
        </div>

        <div className={styles.ticketGrid}>
          {usedTickets.map(ticket => (
            <div
              key={ticket.id}
              className={styles.ticketCard}
              onClick={() => openTicketDetails(ticket)}
            >
              <div className={styles.ticketContent}>
                <div className={styles.ticketHeader}>
                  <h3 className={styles.ticketTitle}>{ticket.eventName}</h3>
                </div>
                <div className={styles.ticketDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date</span>
                    <span className={styles.detailValue}>{ticket.eventDate}</span> {/* Use mapped eventDate */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.eventTime}</span> {/* Use mapped eventTime */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.eventVenue}</span> {/* Use mapped eventVenue */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{ticket.ticketTypeName}</span> {/* Use mapped ticketTypeName */}
                  </div>
                </div>
                <div className={styles.ticketDetails + ' ' + styles.usedTicketDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Used On</span>
                    <span className={styles.detailValue}>{ticket.scanDate ? new Date(ticket.scanDate).toLocaleString() : 'N/A'}</span> {/* Use mapped scanDate */}
                  </div>
                </div>
                <div className={styles.ticketActions}>
                  <div></div>
                  <button className={styles.btnSecondary}>Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {(cancelledTickets.length > 0 && (usedTickets.length > 0 || activeTickets.length > 0)) && (
      <div className={styles.sectionDivider}></div>
    )}

    {cancelledTickets.length > 0 && (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Cancelled Tickets</h2>
          <span className={styles.sectionCount}>{cancelledTickets.length}</span>
        </div>

        <div className={styles.ticketGrid}>
          {cancelledTickets.map(ticket => (
            <div
              key={ticket.id}
              className={styles.ticketCard}
              onClick={() => openTicketDetails(ticket)}
            >
              <div className={styles.ticketContent}>
                <div className={styles.ticketHeader}>
                  <h3 className={styles.ticketTitle}>{ticket.eventName}</h3>
                  <span className={`${styles.ticketStatus} ${styles.statusCancelled}`}>Cancelled</span>
                </div>
                <div className={styles.ticketDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date</span>
                    <span className={styles.detailValue}>{ticket.eventDate}</span> {/* Use mapped eventDate */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.eventTime}</span> {/* Use mapped eventTime */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.eventVenue}</span> {/* Use mapped eventVenue */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{ticket.ticketTypeName}</span> {/* Use mapped ticketTypeName */}
                  </div>
                </div>
                <div className={styles.ticketActions}>
                  <div></div>
                  <button className={styles.btnSecondary}>Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {(expiredTickets.length > 0 && (usedTickets.length > 0 || cancelledTickets.length > 0 || activeTickets.length > 0)) && (
      <div className={styles.sectionDivider}></div>
    )}

    {expiredTickets.length > 0 && (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Expired Tickets</h2>
          <span className={styles.sectionCount}>{expiredTickets.length}</span>
        </div>

        <div className={styles.ticketGrid}>
          {expiredTickets.map(ticket => (
            <div
              key={ticket.id}
              className={styles.ticketCard}
              onClick={() => openTicketDetails(ticket)}
            >
              <div className={styles.ticketContent}>
                <div className={styles.ticketHeader}>
                  <h3 className={styles.ticketTitle}>{ticket.eventName}</h3>
                  <span className={`${styles.ticketStatus} ${styles.statusExpired}`}>Expired</span>
                </div>
                 <div className={styles.ticketDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date</span>
                    <span className={styles.detailValue}>{ticket.eventDate}</span> {/* Use mapped eventDate */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.eventTime}</span> {/* Use mapped eventTime */}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.eventVenue}</span> {/* Use mapped eventVenue */}
                  </div>
                   {/* Display Seat information if available */}
                     {ticket.seat && (
                         <div className={styles.detailItem}>
                             <span className={styles.detailLabel}>Seat</span>
                             <span className={styles.detailValue}>{ticket.seat}</span>
                         </div>
                     )}
                </div>
                <div className={styles.ticketActions}>
                  <div></div>
                  <button className={styles.btnSecondary}>Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}


    {/* Modal window for Ticket Details */}
    {selectedTicket && (
      <div
        className={styles.modal}
        onClick={(e) => {
          // Close modal when clicking background
          if (e.target.className === styles.modal) {
            closeTicketDetails();
          }
        }}
      >
        <div className={styles.modalContent}>
          <TicketDetails
            ticket={selectedTicket} // Pass the mapped ticket object
            onClose={closeTicketDetails}
            // 修改传递给 TicketDetails 的退票处理函数
            // 直接将 handleRefundClick 传递下去
            onRefund={() => handleRefundClick(selectedTicket)} // 在详情页点击退票时，直接调用处理函数
            isRefundable={isRefundable(selectedTicket)} // Check refundability of the mapped ticket
          />
        </div>
      </div>
    )}

    {/* 不再渲染退款确认模态框 */}
    {/* {ticketToRefund && (
        <RefundConfirmModal
            ticket={ticketToRefund}
            onClose={closeRefundModal}
            onConfirm={handleRefundConfirm}
        />
    )} */}
  </div>
);
}

export default MyTickets;