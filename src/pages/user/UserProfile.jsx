import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../../services/authService'
import { updateUserProfile } from '../../services/authService/user-service' 
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
    // Get current user data
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
    
    // Clear password errors if password fields are updated
    if (['newPassword', 'confirmPassword'].includes(name)) {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    // Validate only when user attempts to change password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setPasswordError('Current password is required to change password');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return false;
      }
      // Ensure password meets requirements: at least 8 characters with letters and numbers
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        setPasswordError('Password must be at least 8 characters and include letters and numbers');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    // Validate passwords (if attempting to change)
    if (!validatePasswords()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data to send
      const updateData = {
        name: formData.name,
      };
      
      // Add password fields if attempting to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      } else {
        // Current password is still required for validation even if not changing password
        updateData.currentPassword = formData.currentPassword;
      }
      
      try {
        // Call API to update user profile
        const updatedUser = await updateUserProfile(updateData);
        
        // Update local user information
        setUser(updatedUser);
        
        setSuccess('Profile updated successfully!');
        
        // Clear password fields after successful update
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (apiError) {
        // Check if error contains "local display" keyword, indicating local updates
        if (apiError.message && apiError.message.includes('local display')) {
          setSuccess('Profile updated locally');
          setError(apiError.message);
          
          // Still update UI display, even if server save failed
          const updatedUser = {
            ...user,
            name: formData.name
          };
          setUser(updatedUser);
          
          // Clear password fields
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          setError(apiError.message || 'Failed to update profile. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile information...</div>;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.formContainer}>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2>Personal Information</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
                <small>Email address cannot be changed</small>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="role">User Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  readOnly
                  className={styles.readonlyField}
                />
                <small>Role is assigned by the system</small>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2>Change Password</h2>
            {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
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
                <label htmlFor="newPassword">New Password</label>
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
                <label htmlFor="confirmPassword">Confirm New Password</label>
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
            <small>Leave password fields empty if you don't want to change your password</small>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfile