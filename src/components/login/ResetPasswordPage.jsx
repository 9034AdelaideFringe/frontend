import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ResetPasswordForm from './ResetPasswordForm'
import { resetPassword, verifyResetToken } from '../../services/authService'
import styles from './Form.module.css'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [isValidToken, setIsValidToken] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Verify token when component mounts
  useEffect(() => {
    const checkToken = async () => {
      try {
        await verifyResetToken(token)
        setIsValidToken(true)
      } catch (err) {
        setError('Invalid or expired reset link. Please request a new one.')
      } finally {
        setIsVerifying(false)
      }
    }
    
    checkToken()
  }, [token])

  const handleSubmit = async ({ password }) => {
    try {
      await resetPassword(token, password)
      setSuccess(true)
      setError('')
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.')
    }
  }

  if (isVerifying) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2>Reset Password</h2>
          <p className={styles.loading}>Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Reset Password</h2>
        
        {!isValidToken ? (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <Link to="/forgot-password" className={styles.link}>Request a new reset link</Link>
          </div>
        ) : success ? (
          <div className={styles.successMessage}>
            <p>Your password has been reset successfully!</p>
            <p>You will be redirected to the login page shortly...</p>
          </div>
        ) : (
          <>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <ResetPasswordForm onSubmit={handleSubmit} token={token} />
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage