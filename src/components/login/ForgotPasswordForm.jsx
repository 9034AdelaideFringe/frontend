import React, { useState } from 'react'
import styles from './Form.module.css'

const ForgotPasswordForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your registered email"
        />
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Send Reset Link
      </button>
    </form>
  )
}

export default ForgotPasswordForm