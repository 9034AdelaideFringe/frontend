import React, { useState } from 'react';
import styles from './TicketTypeManager.module.css';

const TicketTypeManager = ({ ticketTypes, onChange }) => {
  const [newTicketType, setNewTicketType] = useState({
    name: '',
    description: '',
    price: '',
    availableQuantity: ''
  });
  const [errors, setErrors] = useState({});

  // 处理新票种表单变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicketType({
      ...newTicketType,
      [name]: value
    });
    
    // 清除错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // 验证票种表单
  const validateType = () => {
    const newErrors = {};
    
    if (!newTicketType.name.trim()) {
      newErrors.name = 'Ticket name is required';
    }
    
    if (!newTicketType.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!newTicketType.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(newTicketType.price)) || parseFloat(newTicketType.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!newTicketType.availableQuantity) {
      newErrors.availableQuantity = 'Quantity is required';
    } else if (
      isNaN(parseInt(newTicketType.availableQuantity)) || 
      parseInt(newTicketType.availableQuantity) <= 0
    ) {
      newErrors.availableQuantity = 'Quantity must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 添加票种
  const handleAddType = () => {
    if (!validateType()) return;
    
    // 创建新票种对象
    const newType = {
      id: `temp-${Date.now()}`,
      name: newTicketType.name,
      description: newTicketType.description,
      price: parseFloat(newTicketType.price),
      availableQuantity: parseInt(newTicketType.availableQuantity),
    };
    
    // 更新票种列表
    const updatedTypes = [...ticketTypes, newType];
    onChange(updatedTypes);
    
    // 重置表单
    setNewTicketType({
      name: '',
      description: '',
      price: '',
      availableQuantity: ''
    });
  };

  // 更新票种
  const handleEditType = (index, field, value) => {
    const updatedTypes = [...ticketTypes];
    
    if (field === 'price') {
      updatedTypes[index][field] = parseFloat(value);
    } else if (field === 'availableQuantity') {
      updatedTypes[index][field] = parseInt(value);
    } else {
      updatedTypes[index][field] = value;
    }
    
    onChange(updatedTypes);
  };

  // 删除票种
  const handleRemoveType = (index) => {
    if (window.confirm('Are you sure you want to remove this ticket type?')) {
      const updatedTypes = [...ticketTypes];
      updatedTypes.splice(index, 1);
      onChange(updatedTypes);
    }
  };

  return (
    <div className={styles.ticketTypeManager}>
      <h3>Ticket Types</h3>
      
      {/* 已添加的票种列表 */}
      {ticketTypes.length > 0 ? (
        <div className={styles.ticketTypesList}>
          {ticketTypes.map((type, index) => (
            <div key={type.id} className={styles.ticketTypeItem}>
              <div className={styles.ticketTypeHeader}>
                <h4>Ticket Type #{index + 1}</h4>
                <button 
                  type="button"
                  className={styles.removeTypeBtn}
                  onClick={() => handleRemoveType(index)}
                >
                  Remove
                </button>
              </div>
              
              <div className={styles.ticketTypeForm}>
                <div className={styles.typeFormRow}>
                  <div className={styles.typeFormGroup}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => handleEditType(index, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.typeFormGroup}>
                    <label>Description</label>
                    <input
                      type="text"
                      value={type.description}
                      onChange={(e) => handleEditType(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className={styles.typeFormRow}>
                  <div className={styles.typeFormGroup}>
                    <label>Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={type.price}
                      onChange={(e) => handleEditType(index, 'price', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.typeFormGroup}>
                    <label>Available Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={type.availableQuantity}
                      onChange={(e) => handleEditType(index, 'availableQuantity', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noTicketTypes}>No ticket types added yet. Add at least one ticket type below.</p>
      )}
      
      {/* 添加新票种表单 */}
      <div className={styles.addTicketTypeForm}>
        <h4>Add New Ticket Type</h4>
        <div className={styles.typeFormRow}>
          <div className={styles.typeFormGroup}>
            <label htmlFor="ticketName">Name</label>
            <input
              id="ticketName"
              name="name"
              type="text"
              placeholder="e.g., Standard, VIP, Student"
              value={newTicketType.name}
              onChange={handleInputChange}
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>
          
          <div className={styles.typeFormGroup}>
            <label htmlFor="ticketDescription">Description</label>
            <input
              id="ticketDescription"
              name="description"
              type="text"
              placeholder="e.g., Regular admission, With student ID"
              value={newTicketType.description}
              onChange={handleInputChange}
              className={errors.description ? styles.inputError : ''}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>
        </div>
        
        <div className={styles.typeFormRow}>
          <div className={styles.typeFormGroup}>
            <label htmlFor="ticketPrice">Price ($)</label>
            <input
              id="ticketPrice"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 25.00"
              value={newTicketType.price}
              onChange={handleInputChange}
              className={errors.price ? styles.inputError : ''}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
          </div>
          
          <div className={styles.typeFormGroup}>
            <label htmlFor="ticketQuantity">Available Quantity</label>
            <input
              id="ticketQuantity"
              name="availableQuantity"
              type="number"
              min="1"
              placeholder="e.g., 100"
              value={newTicketType.availableQuantity}
              onChange={handleInputChange}
              className={errors.availableQuantity ? styles.inputError : ''}
            />
            {errors.availableQuantity && <span className={styles.error}>{errors.availableQuantity}</span>}
          </div>
        </div>
        
        <button 
          type="button" 
          className={styles.addTicketTypeBtn}
          onClick={handleAddType}
        >
          Add Ticket Type
        </button>
      </div>
    </div>
  );
};

export default TicketTypeManager;