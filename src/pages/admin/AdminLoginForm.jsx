import React, { useState } from 'react'
import styles from './Form.module.css'

const AdminLoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="adminEmail">Admin Email</label>
        <input
          type="email"
          id="adminEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="adminPassword">Password</label>
        <input
          type="password"
          id="adminPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Login as Admin
      </button>
    </form>
  )
}

export default AdminLoginForm