import React, { useState, useEffect } from 'react'
import styles from './UserTickets.module.css'

// Mock user tickets data with more entries
const mockUserTickets = [
  {
    id: '1',
    eventId: '1',
    eventName: 'Circus Performance',
    date: '2025-03-10',
    time: '19:30',
    venue: 'Adelaide Arts Centre',
    quantity: 2,
    totalPrice: '$80.00',
    purchaseDate: '2025-01-15',
    status: 'active'
  },
  {
    id: '2',
    eventId: '3',
    eventName: 'Contemporary Art Exhibition',
    date: '2025-03-05',
    time: '10:00 - 18:00',
    venue: 'Adelaide Museum of Modern Art',
    quantity: 1,
    totalPrice: '$25.00',
    purchaseDate: '2025-01-20',
    status: 'active'
  },
  {
    id: '3',
    eventId: '2',
    eventName: 'Jazz Festival',
    date: '2025-03-15',
    time: '18:00',
    venue: 'Adelaide Botanic Garden',
    quantity: 3,
    totalPrice: '$285.00',
    purchaseDate: '2024-12-10',
    status: 'active'
  },
  {
    id: '4',
    eventId: '6',
    eventName: 'Comedy Night',
    date: '2025-01-18',
    time: '20:00',
    venue: 'Laugh Factory Club',
    quantity: 2,
    totalPrice: '$60.00',
    purchaseDate: '2024-12-20',
    status: 'used'
  },
  {
    id: '5',
    eventId: '4',
    eventName: 'Theatre Performance "Nightfall"',
    date: '2024-12-15',
    time: '19:00',
    venue: 'Royal Theatre',
    quantity: 4,
    totalPrice: '$340.00',
    purchaseDate: '2024-11-05',
    status: 'used'
  }
];

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setTickets(mockUserTickets);
      setLoading(false);
    }, 800);
  }, []);

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  return (
    <div className={styles.userTickets}>
      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tickets
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
          onClick={() => setFilter('active')}
        >
          Upcoming
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'used' ? styles.active : ''}`}
          onClick={() => setFilter('used')}
        >
          Past Events
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading your tickets...</div>
      ) : (
        <>
          {filteredTickets.length > 0 ? (
            <div className={styles.ticketsList}>
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    <h3>{ticket.eventName}</h3>
                    <span className={`${styles.status} ${styles[ticket.status]}`}>
                      {ticket.status === 'active' ? 'Upcoming' : 'Used'}
                    </span>
                  </div>
                  
                  <div className={styles.ticketBody}>
                    <div className={styles.ticketInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Date:</span>
                        <span>{ticket.date}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Time:</span>
                        <span>{ticket.time}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Venue:</span>
                        <span>{ticket.venue}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Quantity:</span>
                        <span>{ticket.quantity}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Total Price:</span>
                        <span>{ticket.totalPrice}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Purchase Date:</span>
                        <span>{ticket.purchaseDate}</span>
                      </div>
                    </div>
                    
                    <div className={styles.ticketActions}>
                      <button className={styles.viewBtn}>
                        View Details
                      </button>
                      {ticket.status === 'active' && (
                        <button className={styles.downloadBtn}>
                          Download Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No {filter !== 'all' ? filter : ''} tickets found.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserTickets