import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import { getFeaturedEvents } from '../../services/eventService';
import { getUserTickets } from '../../services/ticketService'; // 导入获取用户票据的服务
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取用户信息
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // 并行加载数据
    const loadDashboardData = async () => {
      try {
        // 获取用户票据，仅保留活跃状态的票据，并按日期排序
        const ticketsPromise = getUserTickets()
          .then(tickets => tickets
            .filter(ticket => ticket.status === 'active')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3) // 只显示最近的3张票
          );
        
        // 获取推荐事件
        const recommendationsPromise = getFeaturedEvents();
        
        // 等待所有数据加载完成
        const [tickets, events] = await Promise.all([
          ticketsPromise,
          recommendationsPromise
        ]);
        
        setUpcomingTickets(tickets);
        setRecommendations(events);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard information...</div>;
  }

  return (
    <div className={styles.container}>
      {/* 即将到来的票据 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Upcoming Tickets</h2>
        {upcomingTickets.length > 0 && (
          <Link to="/user/tickets" className={styles.sectionCount}>
            {upcomingTickets.length} tickets
          </Link>
        )}
      </div>
      
      {upcomingTickets.length > 0 ? (
        <div className={styles.ticketGrid}>
          {upcomingTickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={styles.ticketCard}
              onClick={() => window.location.href = '/user/tickets'}
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
                  <button className={styles.btnSecondary}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No Upcoming Tickets</h3>
          <p>You don't have any upcoming tickets yet. Browse events to find your next experience.</p>
          <Link to="/events" className={styles.btnPrimary}>Browse Events</Link>
        </div>
      )}
      
      <div className={styles.sectionDivider}></div>
      
      {/* 推荐部分 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recommended For You</h2>
        <Link to="/events" className={styles.viewAllLink}>View All</Link>
      </div>
      
      <div className={styles.recommendationGrid}>
        {recommendations.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.eventImage}>
              <img src={event.image} alt={event.title} />
            </div>
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <div className={styles.eventMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>{event.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Venue</span>
                  <span className={styles.metaValue}>{event.venue}</span>
                </div>
                <div className={styles.eventActions}>
                  <Link to={`/events/${event.id}`} className={styles.btnOutline}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.sectionDivider}></div>
      
      {/* 快速操作 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
      </div>
      
      <div className={styles.actionGrid}>
        <Link to="/events" className={styles.actionCard}>
          <div className={styles.actionIcon}>🔍</div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Find Events</h3>
            <p className={styles.actionDesc}>Discover performances, exhibitions, and more</p>
          </div>
        </Link>
        <Link to="/user/tickets" className={styles.actionCard}>
          <div className={styles.actionIcon}>🎟️</div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>My Tickets</h3>
            <p className={styles.actionDesc}>View and manage all your tickets</p>
          </div>
        </Link>
        <Link to="/user/profile" className={styles.actionCard}>
          <div className={styles.actionIcon}>👤</div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Profile</h3>
            <p className={styles.actionDesc}>Update your personal information</p>
          </div>
        </Link>
        <Link to="/user/favorites" className={styles.actionCard}>
          <div className={styles.actionIcon}>❤️</div>
          <div className={styles.actionContent}>
            <h3 className={styles.actionTitle}>Favorites</h3>
            <p className={styles.actionDesc}>View your saved events and artists</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;