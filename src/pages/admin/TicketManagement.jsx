import React, { useState, useEffect } from 'react'
import styles from './TicketManagement.module.css'

// Mock data for tickets - Update event names to English
const mockTickets = [
  { 
    id: '1', 
    eventId: '1', 
    eventName: 'Circus Performance',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    purchaseDate: '2025-02-15',
    quantity: 2,
    totalPrice: '$200',
    status: 'active'
  },
  { 
    id: '2', 
    eventId: '2', 
    eventName: 'Jazz Festival',
    customerName: 'Emma Lee',
    customerEmail: 'emma@example.com',
    purchaseDate: '2025-02-14',
    quantity: 1,
    totalPrice: '$95',
    status: 'active'
  },
  { 
    id: '3', 
    eventId: '4', 
    eventName: 'Theatre Performance "Nightfall"',
    customerName: 'Michael Wang',
    customerEmail: 'michael@example.com',
    purchaseDate: '2025-02-10',
    quantity: 4,
    totalPrice: '$340',
    status: 'active'
  },
  { 
    id: '4', 
    eventId: '3', 
    eventName: 'Contemporary Art Exhibition',
    customerName: 'Sarah Zhang',
    customerEmail: 'sarah@example.com',
    purchaseDate: '2025-02-05',
    quantity: 3,
    totalPrice: '$75',
    status: 'used'
  }
];

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock API loading
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 800);
  }, []);

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus } 
        : ticket
    ));
  };

  // Filter and search tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && ticket.status === filter;
  });

  return (
    <div className={styles.ticketManagement}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filter}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tickets</option>
            <option value="active">Active</option>
            <option value="used">Used</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Purchase Date</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className={styles[ticket.status]}>
                    <td>{ticket.id}</td>
                    <td>{ticket.eventName}</td>
                    <td>{ticket.customerName}</td>
                    <td>{ticket.customerEmail}</td>
                    <td>{ticket.purchaseDate}</td>
                    <td>{ticket.quantity}</td>
                    <td>{ticket.totalPrice}</td>
                    <td>
                      <span className={`${styles.status} ${styles[ticket.status]}`}>
                        {ticket.status === 'active' && 'Active'}
                        {ticket.status === 'used' && 'Used'}
                        {ticket.status === 'cancelled' && 'Cancelled'}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      {ticket.status === 'active' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(ticket.id, 'used')}
                            className={styles.useBtn}
                          >
                            Mark Used
                          </button>
                          <button 
                            onClick={() => handleStatusChange(ticket.id, 'cancelled')}
                            className={styles.cancelBtn}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {ticket.status === 'used' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.id, 'active')}
                          className={styles.restoreBtn}
                        >
                          Restore
                        </button>
                      )}
                      {ticket.status === 'cancelled' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.id, 'active')}
                          className={styles.restoreBtn}
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.noTickets}>
                    No tickets found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TicketManagement