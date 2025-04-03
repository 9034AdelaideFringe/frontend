import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../../services/authService'
import { getFeaturedEvents } from '../../services/eventService'
import styles from './UserDashboard.module.css'

// Mock user tickets data
const mockUserTickets = [
  {
    id: '1',
    eventId: '1',
    eventName: 'Circus Performance',
    date: '2025-03-10',
    venue: 'Adelaide Arts Centre',
    quantity: 2,
    purchaseDate: '2025-01-15',
    status: 'active'
  },
  {
    id: '2',
    eventId: '3',
    eventName: 'Contemporary Art Exhibition',
    date: '2025-03-05',
    venue: 'Adelaide Museum of Modern Art',
    quantity: 1,
    purchaseDate: '2025-01-20',
    status: 'active'
  }
];

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info and data
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // In a real app, we'd fetch the user's tickets from an API
    setUpcomingTickets(mockUserTickets);
    
    // Get recommended events
    getFeaturedEvents()
      .then(events => {
        setRecommendations(events);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recommended events:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.userDashboard}>
      {/* Welcome section */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeCard}>
          <h2>Welcome back, {user?.name || 'girl? or boy? whatever!'}</h2>
        </div>
      </section>
      
      {/* Upcoming tickets */}
      <section className={styles.ticketsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Upcoming Events</h2>
          <Link to="/user/tickets" className={styles.viewAllLink}>View All</Link>
        </div>
        
        {upcomingTickets.length > 0 ? (
          <div className={styles.ticketsGrid}>
            {upcomingTickets.map(ticket => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div className={styles.ticketDetails}>
                  <h3>{ticket.eventName}</h3>
                  <div className={styles.ticketInfo}>
                    <p><strong>Date:</strong> {ticket.date}</p>
                    <p><strong>Venue:</strong> {ticket.venue}</p>
                    <p><strong>Quantity:</strong> {ticket.quantity}</p>
                  </div>
                </div>
                <Link to={`/user/tickets/${ticket.id}`} className={styles.viewTicketBtn}>
                  View Ticket
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You don't have any upcoming events.</p>
            <Link to="/events" className={styles.browseBtn}>Browse Events</Link>
          </div>
        )}
      </section>
      
      {/* Recommended events */}
      <section className={styles.recommendationsSection}>
        <div className={styles.sectionHeader}>
          <h2>Recommended For You</h2>
          <Link to="/events" className={styles.viewAllLink}>View All Events</Link>
        </div>
        
        <div className={styles.recommendationsGrid}>
          {recommendations.map(event => (
            <div key={event.id} className={styles.recommendationCard}>
              <div className={styles.eventImage}>
                <img src={event.image} alt={event.title} />
              </div>
              <div className={styles.eventDetails}>
                <h3>{event.title}</h3>
                <p>{event.date} | {event.venue}</p>
                <Link to={`/events/${event.id}`} className={styles.viewEventBtn}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Quick actions */}
      <section className={styles.quickActionsSection}>
        <h2>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <Link to="/events" className={styles.actionButton}>
            Browse Events
          </Link>
          <Link to="/user/profile" className={styles.actionButton}>
            Update Profile
          </Link>
          <Link to="/user/favorites" className={styles.actionButton}>
            Manage Favorites
          </Link>
        </div>
      </section>
    </div>
  )
}

export default UserDashboard