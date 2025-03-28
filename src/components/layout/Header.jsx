import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../login/modal'
import LoginForm from '../login/LoginForm'
import RegisterForm from '../login/RegisterForm'
import { login, register, logout, isAuthenticated, getCurrentUser } from '../../services/authService'
import styles from './Header.module.css'
import formStyles from '../login/Form.module.css'

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 页面加载时检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsLoggedIn(auth);
      if (auth) {
        setUser(getCurrentUser());
      }
    };
    
    checkAuth();
  }, []);

  // 获取用户首字母
  const getUserInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  const handleLogin = (credentials) => {
    setIsLoading(true);
    setLoginError('');
    
    login(credentials)
      .then(response => {
        setUser(response.user);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        console.log('登录成功:', response.user);
      })
      .catch(error => {
        setLoginError(error.message || '登录失败，请检查您的凭据');
        console.error('登录失败:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegister = (userData) => {
    setIsLoading(true);
    setRegisterError('');
    
    register(userData)
      .then(response => {
        setUser(response.user);
        setIsLoggedIn(true);
        setIsRegisterModalOpen(false);
        console.log('注册成功:', response.user);
      })
      .catch(error => {
        setRegisterError(error.message || '注册失败，请稍后再试');
        console.error('注册失败:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        setUser(null);
        setIsLoggedIn(false);
        console.log('已登出');
      })
      .catch(error => {
        console.error('登出错误:', error);
      });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Adelaide Fringe</Link>
        <nav className={styles.nav}>
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/events">活动</Link></li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>
                {getUserInitial()}
              </div>
              <div className={styles.userDropdown}>
                <span className={styles.userName}>{user?.name}</span>
                <button 
                  className={`${formStyles.btn} ${formStyles.btnSecondary}`}
                  onClick={handleLogout}
                >
                  登出
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                className={`${formStyles.btn} ${formStyles.btnSecondary}`}
                onClick={() => {
                  setLoginError('');
                  setIsLoginModalOpen(true);
                }}
                disabled={isLoading}
              >
                登录
              </button>
              <button 
                className={`${formStyles.btn} ${formStyles.btnPrimary}`}
                onClick={() => {
                  setRegisterError('');
                  setIsRegisterModalOpen(true);
                }}
                disabled={isLoading}
              >
                注册
              </button>
            </>
          )}
        </div>
      </div>

      {/* 登录模态窗口 */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        title="登录"
      >
        {loginError && <div className={styles.errorMessage}>{loginError}</div>}
        <LoginForm onLogin={handleLogin} />
      </Modal>

      {/* 注册模态窗口 */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        title="注册"
      >
        {registerError && <div className={styles.errorMessage}>{registerError}</div>}
        <RegisterForm onRegister={handleRegister} />
      </Modal>
    </header>
  )
}

export default Header