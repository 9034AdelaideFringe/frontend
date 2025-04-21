import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ForgotPasswordForm from '../components/login/ForgotPasswordForm'
import { requestPasswordReset } from '../services/authService'
import styles from '../components/login/Form.module.css'

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async ({ email }) => {
    try {
      await requestPasswordReset(email)
      setSuccess(true)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again later.')
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Forgot Password</h2>
        
        {success ? (
          <div className={styles.successMessage}>
            <p>A password reset link has been sent to your email address.</p>
            <p>Please check your inbox and follow the instructions.</p>
            <Link to="/" className={styles.link}>Return to Home</Link>
          </div>
        ) : (
          <>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <ForgotPasswordForm onSubmit={handleSubmit} />
            <div className={styles.formFooter}>
              <Link to="/" className={styles.link}>Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage