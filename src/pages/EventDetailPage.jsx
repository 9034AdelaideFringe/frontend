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
    // Get event details
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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!event) {
    return <div className={styles.error}>Event not found</div>;
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
            <span className={styles.label}>Date:</span>
            <span>{event.date}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Time:</span>
            <span>{event.time}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Venue:</span>
            <span>{event.venue}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Price:</span>
            <span>{event.price}</span>
          </div>
        </div>
        
        <div className={styles.description}>
          <h2>Event Details</h2>
          <p>{event.description}</p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>Buy Tickets</button>
          <Link to="/events" className={styles.btnSecondary}>
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage