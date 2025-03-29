import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById } from '../../services/eventService'
import styles from './CreateEvent.module.css' // Reusing create event styles

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    price: '',
    abstract: '',
    description: '',
    image: null
  });
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get event details
    getEventById(id)
      .then(eventData => {
        setFormData({
          title: eventData.title || '',
          date: eventData.date || '',
          time: eventData.time || '',
          venue: eventData.venue || '',
          price: eventData.price || '',
          abstract: eventData.abstract || '',
          description: eventData.description || '',
          image: null
        });
        
        setCurrentImage(eventData.image || '');
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
        alert('Failed to retrieve event information');
        navigate('/admin/events');
      });
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when input changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title) newErrors.title = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.description) newErrors.description = 'Event description is required';
    if (!formData.abstract) newErrors.abstract = 'Event abstract is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call API to update event here
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated event data:', { id, ...formData });
      alert('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.createEvent}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Name</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Event Date</label>
            <input
              id="date"
              name="date"
              type="text" 
              placeholder="YYYY-MM-DD"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? styles.inputError : ''}
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">Event Time</label>
            <input
              id="time"
              name="time"
              type="text"
              placeholder="HH:MM"
              value={formData.time}
              onChange={handleInputChange}
              className={errors.time ? styles.inputError : ''}
            />
            {errors.time && <span className={styles.error}>{errors.time}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="venue">Venue</label>
            <input
              id="venue"
              name="venue"
              type="text"
              value={formData.venue}
              onChange={handleInputChange}
              className={errors.venue ? styles.inputError : ''}
            />
            {errors.venue && <span className={styles.error}>{errors.venue}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price Range</label>
            <input
              id="price"
              name="price"
              type="text"
              placeholder="e.g., 40-120"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? styles.inputError : ''}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Event Image</label>
            {currentImage && (
              <div className={styles.currentImage}>
                <img 
                  src={currentImage} 
                  alt="Current event" 
                  style={{ maxWidth: '100px', marginBottom: '10px' }}
                />
                <p>Current image</p>
              </div>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="abstract">Event Abstract</label>
            <textarea
              id="abstract"
              name="abstract"
              rows="3"
              value={formData.abstract}
              onChange={handleInputChange}
              className={errors.abstract ? styles.inputError : ''}
            />
            {errors.abstract && <span className={styles.error}>{errors.abstract}</span>}
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? styles.inputError : ''}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/events')}
            className={styles.cancelBtn}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEvent