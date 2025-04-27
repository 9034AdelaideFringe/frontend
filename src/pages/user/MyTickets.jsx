import React, { useState, useEffect } from 'react';
import { getUserTickets } from '../../services/ticketService';
import TicketDetails from './TicketDetails';
import styles from './MyTickets.module.css';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
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
  
  const handleTicketRefund = async (ticketId) => {
    // Close details modal
    setSelectedTicket(null);
    // Reload ticket list
    fetchTickets();
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
  
  // Group tickets by status
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
      {activeTickets.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Valid Tickets</h2>
            <span className={styles.sectionCount}>{activeTickets.length}</span>
          </div>
          
          <div className={styles.ticketGrid}>
            {activeTickets.map(ticket => (
              <div 
                key={ticket.id} 
                className={styles.ticketCard} 
                onClick={() => openTicketDetails(ticket)}
              >
                <div className={styles.ticketContent}>
                  <div className={styles.ticketHeader}>
                    <h3 className={styles.ticketTitle}>{ticket.eventName}</h3>
                    <span className={`${styles.ticketStatus} ${styles.statusActive}`}>Valid</span>
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
                    <div className={styles.quantity}>Quantity: {ticket.quantity || 1}</div>
                    <button className={styles.btnSecondary}>Review</button>
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
                    <span className={`${styles.ticketStatus} ${styles.statusUsed}`}>Used</span>
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
              ticket={selectedTicket}
              onClose={closeTicketDetails}
              onRefund={handleTicketRefund}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTickets;