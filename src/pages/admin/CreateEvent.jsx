import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../../services/eventService'
import styles from './CreateEvent.module.css'

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    venue: '',
    location: 'Adelaide',
    capacity: '100',
    price: '',
    description: '',
    status: 'DRAFT'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title) newErrors.title = 'Event name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.description) newErrors.description = 'Event description is required';

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
      // 调用真实API创建活动
      await createEvent(formData);
      alert('Event created successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event: ' + (error.message || 'Please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <label htmlFor="startDate">Start Date & Time</label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleInputChange}
              className={errors.startDate ? styles.inputError : ''}
            />
            {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date & Time</label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleInputChange}
              className={errors.endDate ? styles.inputError : ''}
            />
            {errors.endDate && <span className={styles.error}>{errors.endDate}</span>}
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
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? styles.inputError : ''}
            />
            {errors.location && <span className={styles.error}>{errors.location}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="capacity">Capacity</label>
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
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="text"
              placeholder="e.g., 40.00"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? styles.inputError : ''}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={errors.status ? styles.inputError : ''}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {errors.status && <span className={styles.error}>{errors.status}</span>}
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
            {isSubmitting ? 'Submitting...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent