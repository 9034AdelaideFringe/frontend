import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../../services/eventService'
import styles from './CreateEvent.module.css'
import TicketTypeManager from './TicketTypeManager';

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
    status: 'DRAFT',
    // 新增票种数组
    ticketTypes: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 新增票种表单状态
  const [newTicketType, setNewTicketType] = useState({
    name: '',
    description: '',
    price: '',
    availableQuantity: ''
  });
  const [ticketTypeErrors, setTicketTypeErrors] = useState({});

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

  // 处理新票种表单变化
  const handleTicketTypeChange = (e) => {
    const { name, value } = e.target;
    setNewTicketType({
      ...newTicketType,
      [name]: value
    });
    
    // 清除错误
    if (ticketTypeErrors[name]) {
      setTicketTypeErrors({
        ...ticketTypeErrors,
        [name]: null
      });
    }
  };

  // 添加票种
  const addTicketType = () => {
    // 验证票种表单
    const typeErrors = validateTicketType();
    if (Object.keys(typeErrors).length > 0) {
      setTicketTypeErrors(typeErrors);
      return;
    }

    // 创建新票种对象并添加到表单数据中
    const newType = {
      id: `temp-${Date.now()}`,
      name: newTicketType.name,
      description: newTicketType.description,
      price: parseFloat(newTicketType.price),
      availableQuantity: parseInt(newTicketType.availableQuantity),
    };

    setFormData({
      ...formData,
      ticketTypes: [...formData.ticketTypes, newType]
    });

    // 重置新票种表单
    setNewTicketType({
      name: '',
      description: '',
      price: '',
      availableQuantity: ''
    });
  };

  // 验证票种表单
  const validateTicketType = () => {
    const errors = {};
    
    if (!newTicketType.name.trim()) {
      errors.name = 'Ticket name is required';
    }
    
    if (!newTicketType.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!newTicketType.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(newTicketType.price)) || parseFloat(newTicketType.price) <= 0) {
      errors.price = 'Price must be a valid positive number';
    }
    
    if (!newTicketType.availableQuantity) {
      errors.availableQuantity = 'Quantity is required';
    } else if (
      isNaN(parseInt(newTicketType.availableQuantity)) || 
      parseInt(newTicketType.availableQuantity) <= 0
    ) {
      errors.availableQuantity = 'Quantity must be a valid positive number';
    }
    
    return errors;
  };

  // 更新票种
  const updateTicketType = (index, field, value) => {
    const updatedTypes = [...formData.ticketTypes];
    
    if (field === 'price') {
      updatedTypes[index][field] = parseFloat(value);
    } else if (field === 'availableQuantity') {
      updatedTypes[index][field] = parseInt(value);
    } else {
      updatedTypes[index][field] = value;
    }
    
    setFormData({
      ...formData,
      ticketTypes: updatedTypes
    });
  };

  // 删除票种
  const removeTicketType = (index) => {
    if (window.confirm('Are you sure you want to remove this ticket type?')) {
      const updatedTypes = [...formData.ticketTypes];
      updatedTypes.splice(index, 1);
      
      setFormData({
        ...formData,
        ticketTypes: updatedTypes
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
    if (!formData.description) newErrors.description = 'Event description is required';
    
    // 验证至少有一个票种
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
      // 调用真实API创建活动，包括票种信息
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

  const handleTicketTypesChange = (newTicketTypes) => {
    setFormData({
      ...formData,
      ticketTypes: newTicketTypes
    });
  };

  return (
    <div className={styles.createEvent}>
      <h2>Create New Event</h2>
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

        {/* 票种管理部分 */}
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