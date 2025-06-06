import React, { useState, useEffect } from 'react';
import { getUserTickets, refundTicket as refundTicketApi } from '../../services/ticketService';
import TicketDetails from './tickets/TicketDetails';
import RefundConfirmModal from './tickets/RefundConfirmModal';
import styles from './MyTickets.module.css';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToRefund, setTicketToRefund] = useState(null);
  const [refundSuccess, setRefundSuccess] = useState(null);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getUserTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Unable to load ticket information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if ticket is refundable
  const isRefundable = (ticket) => {
    if (ticket.status !== 'active') return false;
    
    const today = new Date();
    const lastRefundDate = new Date(ticket.lastRefundDate);
    return today <= lastRefundDate;
  };
  
  // Open refund modal from ticket list
  const openRefundModal = (ticket, e) => {
    e.stopPropagation(); // Prevent opening ticket details
    setTicketToRefund(ticket);
  };
  
  // Handle refund from ticket details view
  const handleTicketRefund = (ticket) => {
    setTicketToRefund(ticket);
  };
  
  // Close refund modal
  const closeRefundModal = () => {
    setTicketToRefund(null);
  };
  
  // Process ticket refund
  const handleRefundConfirm = async (ticketId) => {
    try {
      await refundTicketApi(ticketId);
      setRefundSuccess(`Ticket for ${ticketToRefund.eventName} has been successfully refunded.`);
      closeRefundModal();
      fetchTickets(); // Refresh ticket list
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setRefundSuccess(null);
      }, 5000);
    } catch (err) {
      throw err; // Let RefundConfirmModal handle the error
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
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (tickets.length === 0) {
    return (
      <div className={styles.noTickets}>
        <h2>No Tickets Found</h2>
        <p>You haven't purchased any tickets yet</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {refundSuccess && (
        <div className={styles.successMessage}>
          {refundSuccess}
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
                          onClick={(e) => openRefundModal(ticket, e)}
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
                    <span className={styles.detailValue}>{ticket.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.venue}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{ticket.ticketType}</span>
                  </div>
                </div>
                <div className={styles.ticketDetails + ' ' + styles.usedTicketDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Used On</span>
                    <span className={styles.detailValue}>{new Date(ticket.scanDate).toLocaleString()}</span>
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
                    <span className={styles.detailValue}>{ticket.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.venue}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{ticket.ticketType}</span>
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
                    <span className={styles.detailValue}>{ticket.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{ticket.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Venue</span>
                    <span className={styles.detailValue}>{ticket.venue}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{ticket.ticketType}</span>
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
    
    {/* Modal window */}
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
            onRefund={handleTicketRefund} // This function receives the mapped ticket object
            isRefundable={isRefundable(selectedTicket)} // Check refundability of the mapped ticket
          />
        </div>
      </div>
    )}

    {/* Refund confirmation modal */}
    {ticketToRefund && (
        <RefundConfirmModal
            ticket={ticketToRefund} // Pass the mapped ticket object
            onClose={closeRefundModal}
            onConfirm={handleRefundConfirm} // This function receives ticket ID
        />
    )}
  </div>
);
}

export default MyTickets;