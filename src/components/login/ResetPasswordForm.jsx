import React, { useState } from 'react'
import styles from './Form.module.css'

const ResetPasswordForm = ({ onSubmit }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Password validation
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }
    
    setPasswordError('')
    onSubmit({ password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordError && <div className={styles.errorText}>{passwordError}</div>}
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Reset Password
      </button>
    </form>
  )
}

export default ResetPasswordForm