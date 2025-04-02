import React, { useState, useEffect } from 'react'
import EventList from '../utils/EventList'
import { getAllEvents } from '../services/eventService'
import styles from './EventsPage.module.css'

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取所有事件数据
    getAllEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>浏览所有活动</h1>
      
      {loading ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <EventList events={events} title="" />
      )}
    </div>
  )
}

export default EventsPage