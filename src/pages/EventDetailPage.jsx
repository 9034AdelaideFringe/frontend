import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEventById } from '../services/eventService'
import styles from './EventDetailPage.module.css'

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取事件详情
    getEventById(id)
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!event) {
    return <div className={styles.error}>未找到该活动</div>;
  }

  return (
    <div className={styles.eventDetail}>
      <div className={styles.imageContainer}>
        <img src={event.image} alt={event.title} className={styles.image} />
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>{event.title}</h1>
        
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>日期:</span>
            <span>{event.date}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>时间:</span>
            <span>{event.time}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>地点:</span>
            <span>{event.venue}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>票价:</span>
            <span>{event.price}</span>
          </div>
        </div>
        
        <div className={styles.description}>
          <h2>活动详情</h2>
          <p>{event.description}</p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>购票</button>
          <Link to="/events" className={styles.btnSecondary}>
            返回活动列表
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage