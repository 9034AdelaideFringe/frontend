import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../../services/authService'
import { updateUserProfile } from '../../services/authService/user-service' // 假设我们有这个服务
import styles from './UserProfile.module.css'

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 获取当前用户数据
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        ...formData,
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || 'USER'
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 如果密码字段更新，清除密码错误
    if (['newPassword', 'confirmPassword'].includes(name)) {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    // 仅在用户尝试更改密码时验证
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setPasswordError('需要输入当前密码才能更改密码');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError('新密码不匹配');
        return false;
      }
      // 确保密码符合要求：至少8个字符，包括字母和数字
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        setPasswordError('密码必须至少8个字符，包含字母和数字');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    // 验证密码（如果尝试更改）
    if (!validatePasswords()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备要发送的数据
      const updateData = {
        name: formData.name,
      };
      
      // 如果尝试更改密码，添加密码字段
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      } else {
        // 不更改密码时也需要提供当前密码用于验证
        updateData.currentPassword = formData.currentPassword;
      }
      
      try {
        // 调用API更新用户个人资料
        const updatedUser = await updateUserProfile(updateData);
        
        // 更新本地用户信息
        setUser(updatedUser);
        
        setSuccess('个人资料更新成功！');
        
        // 更新成功后清除密码字段
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (apiError) {
        // 检查错误是否包含"本地显示"关键词，表示本地已更新
        if (apiError.message && apiError.message.includes('本地显示')) {
          setSuccess('个人资料已在本地更新');
          setError(apiError.message);
          
          // 仍更新UI显示，即使服务器保存失败
          const updatedUser = {
            ...user,
            name: formData.name
          };
          setUser(updatedUser);
          
          // 清除密码字段
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          setError(apiError.message || '更新个人资料失败，请重试。');
        }
      }
    } catch (err) {
      setError(err.message || '更新个人资料失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>加载个人资料信息...</div>;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.formContainer}>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2>个人信息</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">姓名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">电子邮箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
                <small>邮箱地址不能更改</small>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="role">用户角色</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  readOnly
                  className={styles.readonlyField}
                />
                <small>角色由系统分配</small>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2>修改密码</h2>
            {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">当前密码</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">新密码</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">确认新密码</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <small>如果不想更改密码，请将密码字段留空</small>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfile