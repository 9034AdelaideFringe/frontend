import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventList from '../utils/EventList'
import CountdownTimer from '../components/common/CountdownTimer'
import { getFeaturedEvents } from '../services/eventService'
import styles from './HomePage.module.css'

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get featured events data
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
          <h2>Let’s start:</h2>
          
          <CountdownTimer />
          
          <div className={styles.actionButtons}>
            <Link to="/events" className={styles.btnPrimary}>Browse All Events</Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className={styles.loading}>Loading featured events...</div>
      ) : (
        <EventList events={featuredEvents} title="Featured Events" />
      )}
      
      <section className={styles.about}>
        <h2>About Adelaide Fringe</h2>
        <p>
          Adelaide Fringe is one of Australia's largest arts festivals, attracting hundreds of thousands of visitors annually.
          We offer a wide variety of performances, from music and dance to theater, comedy, and visual arts.
          Join us and experience this artistic feast!
        </p>
      </section>
    </div>
  )
}

export default HomePage