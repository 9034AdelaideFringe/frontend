import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Form.module.css'

const LoginForm = ({ onLogin, onForgotPassword, isModal = false }) => {
  // 添加调试日志
  console.log('LoginForm rendering:', { isModal, hasOnForgotPassword: !!onForgotPassword });
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form validation can be added here
    onLogin({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className={styles.forgotPasswordLink}>
          {isModal ? (
            <button 
              type="button"
              className={styles.linkButton}
              onClick={(e) => {
                e.preventDefault();
                console.log('Forgot password button clicked in LoginForm');
                console.log('onForgotPassword is:', typeof onForgotPassword);
                if (typeof onForgotPassword === 'function') {
                  onForgotPassword();
                } else {
                  console.error('onForgotPassword is not a function');
                }
              }}
            >
              Forgot password?
            </button>
          ) : (
            <Link to="/forgot-password" className={styles.link}>Forgot password?</Link>
          )}
        </div>
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Login</button>
    </form>
  )
}

export default LoginForm