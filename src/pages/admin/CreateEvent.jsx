import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CreateEvent.module.css'

const CreateEvent = () => {
  const navigate = useNavigate();
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title) newErrors.title = '活动名称是必填项';
    if (!formData.date) newErrors.date = '日期是必填项';
    if (!formData.time) newErrors.time = '时间是必填项';
    if (!formData.venue) newErrors.venue = '场地是必填项';
    if (!formData.price) newErrors.price = '价格是必填项';
    if (!formData.description) newErrors.description = '活动描述是必填项';
    if (!formData.abstract) newErrors.abstract = '活动简介是必填项';

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
      // 在这里应该调用API创建活动
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('提交的活动数据:', formData);
      alert('活动创建成功！');
      navigate('/admin/events');
    } catch (error) {
      console.error('创建活动出错:', error);
      alert('创建活动时出错，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createEvent}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">活动名称</label>
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
            <label htmlFor="date">活动日期</label>
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
            <label htmlFor="time">活动时间</label>
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
            <label htmlFor="venue">活动场地</label>
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
            <label htmlFor="price">价格范围</label>
            <input
              id="price"
              name="price"
              type="text"
              placeholder="例如: 40-120"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? styles.inputError : ''}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">活动图片</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="abstract">活动简介</label>
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
            <label htmlFor="description">活动详细描述</label>
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
            取消
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '创建活动'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent