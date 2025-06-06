import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventList from '../utils/EventList' // Assuming EventList is a component to display events
import CountdownTimer from '../components/common/CountdownTimer' // Assuming CountdownTimer is a component
import { getFeaturedEvents } from '../services/eventService' // Assuming this fetches featured events
import styles from './HomePage.module.css' // Import the CSS module
import christmasParty from '../assets/christmas-party-svgrepo-com.svg';
import peopleSupport from '../assets/people-who-support-svgrepo-com.svg';
import supportingPerson from '../assets/supporting-person-diagonal-svgrepo-com.svg';

// 自定义打字动画组件
const Typewriter = ({ text, speed = 30 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      setDisplayed(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}<span style={{color:'#2563eb'}}>|</span></span>;
};

const aboutText = `A festival of creativity, joy, and inspiration. Discover music, dance, comedy, and more. Join the celebration!`;

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    console.log('[HomePage] useEffect triggered.'); // Log useEffect start
    // Get featured events data
    getFeaturedEvents()
      .then(data => {
        console.log('[HomePage] getFeaturedEvents success:', data); // Log successful fetch
        // Ensure data is an array, handle potential nested data structure
        if (Array.isArray(data)) {
             setFeaturedEvents(data);
        } else if (data && Array.isArray(data.data)) {
             setFeaturedEvents(data.data);
        }
        else {
             console.warn('[HomePage] getFeaturedEvents returned non-array data:', data); // Warn about unexpected format
             setFeaturedEvents([]); // Default to empty array on unexpected format
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('[HomePage] Error fetching featured events:', error); // Log fetch error
        setError(error.message || 'Failed to load featured events.'); // Set error state
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  console.log('[HomePage] Component rendered.'); // Log component render

  return (
    <div className={styles.homePage}>
      {/* Hero Section - Visually prominent first impression */}
      <section className={styles.heroSection}>
        {/* 左侧插画 */}
        <div className={styles.illustrationColumn}>
          <img src={christmasParty} alt="Christmas Party" className={styles.illus1} />
          <img src={peopleSupport} alt="People Who Support" className={styles.illus2} />
          <img src={supportingPerson} alt="Supporting Person" className={styles.illus3} />
        </div>
        {/* 右侧介绍内容 */}
        <div className={styles.introColumn}>
          <h1 className={styles.heroTitle}>Welcome to Adelaide Fringe</h1>
                    {/* About 打字动画区块，直接用span，无多余嵌套 */}
                    <span className={styles.aboutTypewriter}>
            <Typewriter text={aboutText} speed={54} />
          </span>
          <div className={styles.actionButtons}>
            <Link to="/events" className={`${styles.btn} ${styles.btnPrimary}`}>Browse All Events</Link>
          </div>

        </div>
      </section>
      {/* Featured Events Section - Showcase key content */}
      {/* Only render if not loading and no error, and there are events */}
      {!loading && !error && featuredEvents.length > 0 && (
          <section className={styles.featuredEventsSection}> {/* Added a specific class for styling */}
            <EventList events={featuredEvents} title="Featured Events" />
          </section>
      )}
      {/* Loading or Error Message for Featured Events */}
      {loading && <div className={styles.loading}>Loading featured events...</div>}
      {error && <div className={styles.error}>Error loading featured events: {error}</div>}
      {/* Message if no featured events are available after loading */}
      {!loading && !error && featuredEvents.length === 0 && (
          <div className={styles.noEventsMessage}>No featured events available at this time.</div>
      )}
    </div>
  )
}

export default HomePage