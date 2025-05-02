import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById, updateEvent } from '../../services/eventService'
import TicketTypeManager from './TicketTypeManager';
import styles from './CreateEvent.module.css' // Reusing create event styles
import ImageUploader from '../../components/common/ImageUploader';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    image: '',
    venueSeatingLayout: '',
    date: '',
    time: '',
    end_time: '',
    venue: '',
    capacity: '',
    category: '',
    ticketTypes: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch event details
    getEventById(id)
      .then(eventData => {
        // Map API data to form fields
        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          short_description: eventData.short_description || '',
          image: eventData.image || '',
          venueSeatingLayout: eventData.venueSeatingLayout || '',
          date: eventData.date || '',
          time: eventData.time || '',
          end_time: eventData.end_time || '',
          venue: eventData.venue || '',
          capacity: eventData.capacity || '',
          category: eventData.category || '',
          ticketTypes: eventData.ticketTypes || []
        });
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
    // Clear corresponding error when input changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl
    });
    // Clear error if present
    if (errors.image) {
      setErrors({
        ...errors,
        image: null
      });
    }
  };

  const handleLayoutUploaded = (imageUrl) => {
    setFormData({
      ...formData,
      venueSeatingLayout: imageUrl
    });
    // Clear error if present
    if (errors.venueSeatingLayout) {
      setErrors({
        ...errors,
        venueSeatingLayout: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title) newErrors.title = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.description) newErrors.description = 'Event description is required';

    // Ticket types validation - ensure at least one exists
    if (formData.ticketTypes.length === 0) {
      newErrors.ticketTypes = 'At least one ticket type is required';
    }

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
      // Call API to update event
      await updateEvent(id, formData);
      alert('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event: ' + (error.message || 'Please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketTypesChange = (newTicketTypes) => {
    setFormData({
      ...formData,
      ticketTypes: newTicketTypes
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.createEvent}>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Name*</label>
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
            <label htmlFor="date">Event Date*</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? styles.inputError : ''}
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">Start Time*</label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              className={errors.time ? styles.inputError : ''}
            />
            {errors.time && <span className={styles.error}>{errors.time}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_time">End Time</label>
            <input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleInputChange}
              className={errors.end_time ? styles.inputError : ''}
            />
            {errors.end_time && <span className={styles.error}>{errors.end_time}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="venue">Venue*</label>
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
            <label htmlFor="capacity">Capacity*</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              className={errors.capacity ? styles.inputError : ''}
            />
            {errors.capacity && <span className={styles.error}>{errors.capacity}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? styles.inputError : ''}
            />
            {errors.category && <span className={styles.error}>{errors.category}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Event Image</label>
            <ImageUploader
              currentImageUrl={formData.image}
              label="Browse Images"
              onImageUploaded={handleImageUploaded}
              placeholder="Select an image or enter URL"
              id="event-image"
            />
            {errors.image && <span className={styles.error}>{errors.image}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="venueSeatingLayout">Venue Seating Layout</label>
            <ImageUploader
              currentImageUrl={formData.venueSeatingLayout}
              label="Browse Layouts"
              onImageUploaded={handleLayoutUploaded}
              placeholder="Select a seating layout image or enter URL"
              id="seating-layout"
            />
            {errors.venueSeatingLayout && <span className={styles.error}>{errors.venueSeatingLayout}</span>}
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="short_description">Short Description</label>
            <textarea
              id="short_description"
              name="short_description"
              rows="2"
              placeholder="A brief summary of the event (max 500 characters)"
              maxLength="500"
              value={formData.short_description}
              onChange={handleInputChange}
              className={errors.short_description ? styles.inputError : ''}
            />
            {errors.short_description && <span className={styles.error}>{errors.short_description}</span>}
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="description">Event Description*</label>
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

        {/* Ticket Types Section */}
        <div className={styles.ticketTypesSection}>
          <h3>Ticket Types</h3>
          {errors.ticketTypes && (
            <p className={styles.error}>{errors.ticketTypes}</p>
          )}
          
          <TicketTypeManager
            ticketTypes={formData.ticketTypes}
            onChange={handleTicketTypesChange}
          />
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
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEvent