import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { addToCart } from '../services/cartService';
import TicketSelector from '../components/tickets/TicketSelector';
import styles from './EventDetailPage.module.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTicketSelector, setShowTicketSelector] = useState(false);
  const navigate = useNavigate();

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

  const handleAddToCart = (cartItem) => {
    addToCart(cartItem)
      .then(() => {
        alert('Item added to cart successfully!');
        setShowTicketSelector(false);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      });
  };

  const handleBuyNow = (cartItem) => {
    addToCart(cartItem)
      .then(() => {
        // Navigate to cart page for checkout
        navigate('/user/cart');
      })
      .catch(error => {
        console.error('Error processing purchase:', error);
        alert('Failed to process purchase. Please try again.');
      });
  };

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
          {showTicketSelector ? (
            <TicketSelector 
              event={event} 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ) : (
            <>
              <button 
                className={styles.btnPrimary}
                onClick={() => setShowTicketSelector(true)}
              >
                Buy Tickets
              </button>
              <Link to="/events" className={styles.btnSecondary}>
                Back to Events
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;