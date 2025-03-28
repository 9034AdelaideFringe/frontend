import React, { useState } from 'react'
import styles from './Form.module.css'

const RegisterForm = ({ onRegister }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 密码验证
    if (password !== confirmPassword) {
      setPasswordError('两次输入的密码不匹配');
      return;
    }
    
    setPasswordError('');
    onRegister({ name, email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">姓名</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">邮箱</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">密码</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">确认密码</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordError && <div className={styles.errorText}>{passwordError}</div>}
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>注册</button>
    </form>
  )
}

export default RegisterForm