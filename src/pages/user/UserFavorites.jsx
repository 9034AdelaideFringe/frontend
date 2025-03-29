import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../../services/eventService'
import styles from './UserFavorites.module.css'

// Mock user favorites (in a real app, would be fetched from backend)
const mockFavorites = ['1', '3', '6']; // IDs of favorite events

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get all events and filter to show only favorites
    getAllEvents()
      .then(events => {
        const favoriteEvents = events.filter(event => mockFavorites.includes(event.id));
        setFavorites(favoriteEvents);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      });
  }, []);

  const handleRemoveFavorite = (id) => {
    // In a real app, this would call an API to remove from favorites
    setFavorites(favorites.filter(event => event.id !== id));
    setMessage('Event removed from favorites');
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your favorites...</div>;
  }

  return (
    <div className={styles.userFavorites}>
      {message && <div className={styles.message}>{message}</div>}
      
      {favorites.length > 0 ? (
        <div className={styles.favoritesGrid}>
          {favorites.map(event => (
            <div key={event.id} className={styles.favoriteCard}>
              <div className={styles.imageContainer}>
                <img src={event.image} alt={event.title} />
              </div>
              <div className={styles.cardContent}>
                <h3>{event.title}</h3>
                <p className={styles.eventInfo}>
                  {event.date} | {event.venue}
                </p>
                <p className={styles.eventAbstract}>{event.abstract}</p>
                <div className={styles.cardActions}>
                  <Link to={`/events/${event.id}`} className={styles.viewBtn}>
                    View Details
                  </Link>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => handleRemoveFavorite(event.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>You haven't saved any favorites yet.</p>
          <Link to="/events" className={styles.browseBtn}>Browse Events</Link>
        </div>
      )}
    </div>
  )
}

export default UserFavorites