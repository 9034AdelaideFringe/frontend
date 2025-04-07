import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById, updateEvent } from '../../services/eventService'
import styles from './CreateEvent.module.css' // 重用创建事件的样式

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    venue: '',
    location: '',
    capacity: '',
    price: '',
    description: '',
    status: 'DRAFT'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 获取事件详情
    getEventById(id)
      .then(eventData => {
        // 将API返回的数据映射到表单
        setFormData({
          title: eventData.title || '',
          startDate: formatDateTimeForInput(eventData.startRaw) || '',
          endDate: formatDateTimeForInput(eventData.endRaw) || '',
          venue: eventData.venue || '',
          location: eventData.location || '',
          capacity: eventData.capacity || '',
          price: eventData.price ? eventData.price.replace('$', '') : '',
          description: eventData.description || '',
          status: eventData.status || 'DRAFT'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
        alert('Failed to retrieve event information');
        navigate('/admin/events');
      });
  }, [id, navigate]);

  // 格式化日期时间为input[type="datetime-local"]所需的格式
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      const date = new Date(dateTimeString);
      // 转为YYYY-MM-DDTHH:MM格式
      return date.toISOString().substring(0, 16);
    } catch (e) {
      console.error('Date formatting error:', e);
      return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 输入改变时清除对应的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // 必填字段验证
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
    
    // 验证表单
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 调用真实API更新事件
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
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEvent