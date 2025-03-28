import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventList from '../utils/EventList'
import { getFeaturedEvents } from '../services/eventService'
import styles from './HomePage.module.css'

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取精选事件数据
    getFeaturedEvents()
      .then(data => {
        setFeaturedEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured events:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Adelaide Fringe</h1>
          <p>Discover amazing events and performances.</p>
          <div className={styles.actionButtons}>
            <Link to="/events" className={styles.btnPrimary}>Browse All Events</Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className={styles.loading}>Loading featured events...</div>
      ) : (
        <EventList events={featuredEvents} title="精选活动" />
      )}
      
      <section className={styles.about}>
        <h2>关于 Adelaide Fringe</h2>
        <p>
          Adelaide Fringe 是澳大利亚最大的艺术节之一，每年吸引数十万游客。
          我们提供各种类型的表演，从音乐、舞蹈到戏剧、喜剧和视觉艺术，应有尽有。
          加入我们，体验这场艺术盛宴！
        </p>
      </section>
    </div>
  )
}

export default HomePage