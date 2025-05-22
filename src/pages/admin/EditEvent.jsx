import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById, updateEvent } from '../../services/eventService'
import styles from './CreateEvent.module.css' // Reusing create event styles

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    event_id: '',
    title: '',
    description: '',
    short_description: '',
    date: '',
    time: '',
    end_time: '',
    venue: '',
    capacity: '',
    category: '',
    status: 'ACTIVE',
    created_by: 'fb42ef95-251a-4370-8c5a-fd5bcc84e8cf'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch event details
    getEventById(id)
      .then(eventData => {
        console.log("Retrieved event data:", eventData);
        
        // 处理可能的不同返回格式
        let eventObj;
        
        if (Array.isArray(eventData)) {
          // 如果返回的是数组，取第一个元素
          eventObj = eventData[0];
          console.log("Using first item from array:", eventObj);
        } else if (eventData && eventData.data && Array.isArray(eventData.data)) {
          // 如果返回的是 {data: Array}格式
          eventObj = eventData.data[0];
          console.log("Using first item from data array:", eventObj);
        } else {
          // 假设是直接返回的对象
          eventObj = eventData;
        }
        
        // 验证我们得到了有效的事件对象
        if (!eventObj || !eventObj.event_id) {
          console.error("Invalid event data structure:", eventData);
          throw new Error("Invalid event data structure");
        }
        
        // Map API data to form fields
        setFormData({
          event_id: eventObj.event_id || id,
          title: eventObj.title || '',
          description: eventObj.description || '',
          short_description: eventObj.short_description || '',
          date: eventObj.date || '',
          time: eventObj.time || '',
          end_time: eventObj.end_time || '',
          venue: eventObj.venue || '',
          capacity: eventObj.capacity || '',
          category: eventObj.category || '',
          status: eventObj.status || 'ACTIVE',
          created_by: eventObj.created_by || 'fb42ef95-251a-4370-8c5a-fd5bcc84e8cf'
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

  const validate = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title) newErrors.title = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.description) newErrors.description = 'Event description is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== EVENT UPDATE PROCESS STARTED ===");
    console.log("Form data before validation:", formData);
    
    // Validate form
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      console.error("Form validation failed:", formErrors);
      setErrors(formErrors);
      return;
    }
    
    console.log("Form validation passed");
    setIsSubmitting(true);
    
    try {
      // Only send the required fields for update
      const updateData = {
        event_id: formData.event_id,
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        date: formData.date,
        time: formData.time,
        end_time: formData.end_time,
        venue: formData.venue,
        capacity: formData.capacity,
        category: formData.category,
        status: formData.status,
        created_by: formData.created_by
      };
      
      console.log("Sending update data to API:", updateData);
      
      // Call API to update event
      const response = await updateEvent(id, updateData);
      console.log("API response:", response);
      
      // Check for errors in the response
      if (response && response.error) {
        console.error("API returned error:", response.error);
        throw new Error(response.error);
      }
      
      console.log("=== EVENT UPDATED SUCCESSFULLY ===");
      alert('Event updated successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error("=== EVENT UPDATE FAILED ===");
      console.error("Error details:", error);
      alert('Error updating event: ' + (error.message || 'Please try again'));
    } finally {
      setIsSubmitting(false);
    }
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
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={errors.status ? styles.inputError : ''}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {errors.status && <span className={styles.error}>{errors.status}</span>}
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