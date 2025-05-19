import React, { useState, useRef, useEffect } from 'react';
import styles from './ImageUploader.module.css';

const ImageUploader = ({ 
  currentImageUrl = '', 
  label = 'Browse', 
  onImageUploaded, 
  placeholder = 'Enter image URL or select a file',
  id = 'image-upload'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImageUrl);
  const [inputValue, setInputValue] = useState(currentImageUrl);
  const fileInputRef = useRef(null);
  
  // 更新预览和输入值，当 currentImageUrl 从父组件改变时
  useEffect(() => {
    setPreview(currentImageUrl);
    setInputValue(currentImageUrl);
  }, [currentImageUrl]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // 处理用户直接输入URL的情况
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setInputValue(url);
    
    // 清除之前的错误
    if (error) setError('');
    
    // 如果输入为空，则清除预览和通知父组件
    if (!url) {
      setPreview('');
      onImageUploaded('');
      return;
    }
  };

  // 当用户输入URL并离开输入框时，验证并更新预览
  const handleUrlBlur = () => {
    if (!inputValue) return;
    
    // 简单验证URL是否是图片链接
    if (isValidImageUrl(inputValue)) {
      setPreview(inputValue);
      onImageUploaded(inputValue);
    } else {
      setError('Please enter a valid image URL');
    }
  };
  
  // 简单的图片URL验证
  const isValidImageUrl = (url) => {
    // 如果URL包含图片扩展名或以http开头，则认为是有效的
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url) || 
           url.startsWith('http') || 
           url.startsWith('data:image');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should not exceed 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // 创建预览URL供显示
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setInputValue(file.name); // 显示文件名而非URL
      
      // 传递文件对象，而不是URL
      onImageUploaded(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Simulate upload to server
  const simulateUpload = async (file) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };
  
  // 移除当前图片
  const handleRemoveImage = () => {
    setPreview('');
    setInputValue('');
    onImageUploaded('');
    setError('');
  };

  return (
    <div className={styles.imageUploader}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          className={styles.urlInput}
          disabled={isUploading}
        />
        <button 
          type="button" 
          onClick={handleButtonClick}
          className={styles.browseButton}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : label}
        </button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />
      
      {preview && (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.preview} />
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;