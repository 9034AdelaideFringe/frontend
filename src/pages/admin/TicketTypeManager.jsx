import React, { useState } from 'react';
import styles from './TicketTypeManager.module.css';

const TicketTypeManager = ({ ticketTypes, onChange }) => {
  const [newTicketType, setNewTicketType] = useState({
    name: 'Standard',
    description: 'This is a standard ticket',
    price: '20',
    available_quantity: '10' // 改为下划线命名
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
    
    if (!newTicketType.available_quantity) {
      newErrors.available_quantity = 'Quantity is required';
    } else if (
      isNaN(parseInt(newTicketType.available_quantity)) || 
      parseInt(newTicketType.available_quantity) <= 0
    ) {
      newErrors.available_quantity = 'Quantity must be a valid positive number';
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
      available_quantity: parseInt(newTicketType.available_quantity), // 使用available_quantity而不是availableQuantity
    };
    
    // 更新票种列表
    const updatedTypes = [...ticketTypes, newType];
    onChange(updatedTypes);
    
    // 重置表单
    setNewTicketType({
      name: '',
      description: '',
      price: '',
      available_quantity: '' // 改为下划线命名
    });
  };

  const handleEditType = (index, field, value) => {
    const updatedTypes = [...ticketTypes];
    
    if (field === 'price') {
      updatedTypes[index][field] = parseFloat(value);
    } else if (field === 'available_quantity') { // 改为下划线命名
      updatedTypes[index][field] = parseInt(value);
    } else {
      updatedTypes[index][field] = value;
    }
    
    onChange(updatedTypes);
  };
  
  // 添加票种时
  const newType = {
    id: `temp-${Date.now()}`,
    name: newTicketType.name,
    description: newTicketType.description,
    price: parseFloat(newTicketType.price),
    available_quantity: parseInt(newTicketType.available_quantity), // 这里用的是下划线
  };

  // 删除票种
  const handleRemoveType = (index) => {
    if (window.confirm('Are you sure you want to remove this ticket type?')) {
      const updatedTypes = [...ticketTypes];
      updatedTypes.splice(index, 1);
      onChange(updatedTypes);
    }
  };

  // 在组件添加一个调试日志函数
  const logTicketTypes = () => {
    console.log("Current ticket types:", ticketTypes);
    ticketTypes.forEach((ticket, index) => {
      console.log(`Ticket #${index + 1} fields:`, Object.keys(ticket));
      console.log(`Ticket #${index + 1} available_quantity:`, ticket.available_quantity);
    });
  };

  // 在render前调用
  if (ticketTypes.length > 0) {
    logTicketTypes();
  }

  return (
    <div className={styles.ticketTypeManager}>
      
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
                      value={type.available_quantity} // 使用available_quantity而不是availableQuantity
                      onChange={(e) => handleEditType(index, 'available_quantity', e.target.value)} // 使用available_quantity而不是availableQuantity
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
              name="available_quantity" // 修改为下划线命名
              type="number"
              min="1"
              placeholder="e.g., 100"
              value={newTicketType.available_quantity} // 修改为下划线命名
              onChange={handleInputChange}
              className={errors.available_quantity ? styles.inputError : ''} // 同样修改
            />
            {errors.available_quantity && <span className={styles.error}>{errors.available_quantity}</span>}
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