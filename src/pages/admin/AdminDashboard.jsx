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
    // 获取事件数据以计算统计信息
    getAllEvents()
      .then(events => {
        // 在实际应用中，这些可能来自不同的API调用
        const today = new Date();
        const upcoming = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate > today;
        });

        setStats({
          totalEvents: events.length,
          upcomingEvents: upcoming.length,
          activeTickets: Math.floor(Math.random() * 500) // 模拟数据
        });

        // 获取最近创建的事件（这里简单地取前3个）
        setRecentEvents(events.slice(0, 3));
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
        <div className={styles.loading}>加载中...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>活动总数</h3>
              <div className={styles.statValue}>{stats.totalEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>即将到来的活动</h3>
              <div className={styles.statValue}>{stats.upcomingEvents}</div>
            </div>
            <div className={styles.statCard}>
              <h3>有效票数</h3>
              <div className={styles.statValue}>{stats.activeTickets}</div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>快速操作</h2>
            <div className={styles.actionButtons}>
              <Link to="/admin/events/create" className={styles.actionButton}>
                创建新活动
              </Link>
              <Link to="/admin/events" className={styles.actionButton}>
                管理活动
              </Link>
              <Link to="/admin/tickets" className={styles.actionButton}>
                管理票务
              </Link>
            </div>
          </div>

          <div className={styles.recentEvents}>
            <h2 className={styles.sectionTitle}>近期活动</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>活动名称</th>
                  <th>日期</th>
                  <th>场地</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td className={styles.actions}>
                      <Link 
                        to={`/admin/events/edit/${event.id}`}
                        className={styles.editBtn}
                      >
                        编辑
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