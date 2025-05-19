import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../../services/eventService'
import styles from './CreateEvent.module.css'
import TicketTypeManager from './TicketTypeManager';
import ImageUploader from '../../components/common/ImageUploader';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'MY EVENT',
    description: 'FINE',
    short_description: 'GOOD',
    image: '',
    venueseatinglayout: '', // 修改为小写，与API保持一致
    date: '2025-10-01', // 默认日期
    time: '19:00', // 默认时间
    end_time: '20:00', // 这里应该使用结束日期，而不仅是时间
    venue: 'Tonsley',
    capacity: '100',
    category: 'ABC',
    status: 'ACTIVE', // 添加状态字段
    created_by: 'fb42ef95-251a-4370-8c5a-fd5bcc84e8cf', // 添加创建者ID字段
    ticketTypes: []
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
      venueseatinglayout: imageUrl
    });
    // Clear error if present
    if (errors.venueseatinglayout) {
      setErrors({
        ...errors,
        venueseatinglayout: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields from database schema
    if (!formData.title) newErrors.title = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.description) newErrors.description = 'Event description is required';
    
    // Validate at least one ticket type
    if (formData.ticketTypes.length === 0) {
      newErrors.ticketTypes = 'At least one ticket type is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== EVENT CREATION PROCESS STARTED ===");
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
      console.log("Preparing to send event data to API...");
      console.log("Ticket types being sent:", formData.ticketTypes);
      
      // Call API to create event with ticket types
      const response = await createEvent(formData);
      console.log("API Response received:", response);
      
      // 首先检查是否有错误
      if (response && response.error) {
        console.error("API returned error:", response.error);
        throw new Error(response.error);
      }
      
      // 检查API是否返回成功消息
      if (response) {
        let successMessage = "Event created successfully!";
        let eventId = null;
        
        // 尝试提取ID (如果存在的话)
        if (response.data && response.data.event_id) {
          eventId = response.data.event_id;
          console.log("Found event_id in response.data:", eventId);
          successMessage += ` (ID: ${eventId.substring(0, 8)}...)`;
        } else if (response.event_id) {
          eventId = response.event_id;
          console.log("Found event_id directly in response:", eventId);
          successMessage += ` (ID: ${eventId.substring(0, 8)}...)`;
        } else if (response.id) {
          eventId = response.id;
          console.log("Found id in response:", eventId);
          successMessage += ` (ID: ${eventId.substring(0, 8)}...)`;
        } else if (response.message === "ok") {
          console.log("Server reported success with 'ok' message");
        } else {
          console.log("Server returned success response format:", response);
        }
        
        console.log("=== EVENT CREATED SUCCESSFULLY ===");
        alert(successMessage);
        navigate('/admin/events');
      } else {
        console.error("API returned empty response");
        throw new Error("Server returned empty response");
      }
    } catch (error) {
      console.error("=== EVENT CREATION FAILED ===");
      console.error("Error details:", error);
      alert('Error creating event: ' + (error.message || 'Please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketTypesChange = (newTicketTypes) => {
    console.log("Ticket types changed:", newTicketTypes);
    
    // 验证每个票种是否有正确的字段名
    newTicketTypes.forEach((ticket, index) => {
      if (ticket.available_quantity === undefined) {
        console.error(`Ticket #${index + 1} missing available_quantity field!`);
      }
    });
    
    setFormData({
      ...formData,
      ticketTypes: newTicketTypes
    });
    
    // 如果之前有票种错误，清除它
    if (errors.ticketTypes) {
      setErrors({
        ...errors,
        ticketTypes: null
      });
    }
  };

  return (
    <div className={styles.createEvent}>
      <h2>Create New Event</h2>
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
            <label htmlFor="venueseatinglayout">Venue Seating Layout</label>
            <ImageUploader
              currentImageUrl={formData.venueseatinglayout}
              label="Browse Layouts"
              onImageUploaded={handleLayoutUploaded}
              placeholder="Select a seating layout image or enter URL"
              id="seating-layout"
            />
            {errors.venueseatinglayout && <span className={styles.error}>{errors.venueseatinglayout}</span>}
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
            {isSubmitting ? 'Submitting...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent