import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../login/modal'
import LoginForm from '../login/LoginForm'
import RegisterForm from '../login/RegisterForm'
import styles from './Header.module.css'
import formStyles from '../login/Form.module.css'

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const handleLogin = (credentials) => {
    // 这里实现登录逻辑
    console.log('登录数据:', credentials)
    // 调用登录API
    setIsLoginModalOpen(false)
  }

  const handleRegister = (userData) => {
    // 这里实现注册逻辑
    console.log('注册数据:', userData)
    // 调用注册API
    setIsRegisterModalOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Adelaide Fringe</Link>
        <div className={styles.authButtons}>
          <button 
            className={`${formStyles.btn} ${formStyles.btnSecondary}`}
            onClick={() => setIsLoginModalOpen(true)}
          >
            登录
          </button>
          <button 
            className={`${formStyles.btn} ${formStyles.btnPrimary}`}
            onClick={() => setIsRegisterModalOpen(true)}
          >
            注册
          </button>
        </div>
      </div>

      {/* 登录模态窗口 */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        title="登录"
      >
        <LoginForm onLogin={handleLogin} />
      </Modal>

      {/* 注册模态窗口 */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        title="注册"
      >
        <RegisterForm onRegister={handleRegister} />
      </Modal>
    </header>
  )
}

export default Header