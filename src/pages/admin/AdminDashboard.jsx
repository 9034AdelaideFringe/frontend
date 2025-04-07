import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../../services/eventService'
import styles from './AdminDashboard.module.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    activeTickets: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取事件数据计算统计信息
    getAllEvents()
      .then(events => {
        // 在实际应用中，这些可能来自不同的API调用
        const today = new Date();
        const upcoming = events.filter(event => {
          const eventStartDate = new Date(event.startRaw);
          return eventStartDate > today;
        });

        setStats({
          totalEvents: events.length,
          upcomingEvents: upcoming.length,
          activeTickets: Math.floor(Math.random() * 500) // 模拟数据
        });

        // 获取最近创建的事件（按创建时间排序）
        const sortedEvents = [...events].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentEvents(sortedEvents.slice(0, 5));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Events</h3>
              <div className={styles.statValue}>{stats.totalEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Upcoming Events</h3>
              <div className={styles.statValue}>{stats.upcomingEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Active Tickets</h3>
              <div className={styles.statValue}>{stats.activeTickets}</div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <Link to="/admin/events/create" className={styles.actionButton}>
                Create New Event
              </Link>
              <Link to="/admin/events" className={styles.actionButton}>
                Manage Events
              </Link>
              <Link to="/admin/tickets" className={styles.actionButton}>
                Manage Tickets
              </Link>
            </div>
          </div>

          <div className={styles.recentEvents}>
            <h2 className={styles.sectionTitle}>Recent Events</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>{event.status}</td>
                    <td className={styles.actions}>
                      <Link 
                        to={`/admin/events/edit/${event.id}`}
                        className={styles.actionLink}
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/events/${event.id}`}
                        className={styles.actionLink}
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard