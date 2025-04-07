import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../../services/authService'
import { getFeaturedEvents } from '../../services/eventService'
import styles from './UserDashboard.module.css'

// 临时使用模拟用户票据数据
const mockUserTickets = [
  {
    id: '1',
    eventId: '1',
    eventName: 'Circus Performance',
    date: '2025-02-20',
    time: '19:00',
    venue: 'Adelaide Festival Centre',
    quantity: 2,
    totalPrice: '$140.00',
    purchaseDate: '2024-12-15',
    status: 'active'
  },
  {
    id: '2',
    eventId: '3',
    eventName: 'Contemporary Art Exhibition',
    date: '2025-03-05',
    time: '14:00',
    venue: 'Art Gallery of South Australia',
    quantity: 1,
    totalPrice: '$25.00',
    purchaseDate: '2024-12-18',
    status: 'active'
  }
];

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取用户信息和数据
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // 在真实应用中，我们会从API获取用户的票据
    setUpcomingTickets(mockUserTickets);
    
    // 获取推荐事件
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
      {/* 欢迎部分 */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeCard}>
          <h1>Welcome, {user?.name || 'Friend'}!</h1>
          <p>Here you can manage your tickets and discover upcoming events.</p>
        </div>
      </section>
      
      {/* 即将到来的票据 */}
      <section className={styles.upcomingTicketsSection}>
        <h2>Your Upcoming Events</h2>
        {upcomingTickets.length > 0 ? (
          <div className={styles.ticketsList}>
            {upcomingTickets.map(ticket => (
              <div key={ticket.id} className={styles.ticketCard}>
                <h3>{ticket.eventName}</h3>
                <div className={styles.ticketDetails}>
                  <p><strong>Date:</strong> {ticket.date}</p>
                  <p><strong>Time:</strong> {ticket.time}</p>
                  <p><strong>Venue:</strong> {ticket.venue}</p>
                  <p><strong>Quantity:</strong> {ticket.quantity}</p>
                </div>
                <Link to={`/user/tickets`} className={styles.viewBtn}>
                  View All Tickets
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTickets}>
            <p>You don't have any upcoming tickets.</p>
            <Link to="/events" className={styles.browseBtn}>
              Browse Events
            </Link>
          </div>
        )}
      </section>
      
      {/* 推荐部分 */}
      <section className={styles.recommendationsSection}>
        <h2>Recommended for You</h2>
        <div className={styles.recommendationsList}>
          {recommendations.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImage}>
                <img src={event.image} alt={event.title} />
              </div>
              <div className={styles.eventContent}>
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
      
      {/* 快速操作 */}
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