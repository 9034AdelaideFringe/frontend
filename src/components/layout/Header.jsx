import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../login/modal'
import LoginForm from '../login/LoginForm'
import RegisterForm from '../login/RegisterForm'
import ForgotPasswordForm from '../login/ForgotPasswordForm'
import { login, register, requestPasswordReset, logout, isAuthenticated, getCurrentUser } from '../../services/authService'
import styles from './Header.module.css'
import formStyles from '../login/Form.module.css'

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [forgotPasswordError, setForgotPasswordError] = useState('')
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const dropdownRef = useRef(null)
  const avatarRef = useRef(null)
  
  // Check login status on page load
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

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current && 
        !avatarRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    // Add event listener when dropdown is shown
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 简化版，只使用邮箱首字母
  const getUserInitial = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogin = (credentials) => {
    setIsLoading(true);
    setLoginError('');
    
    login(credentials)
      .then(data => {
        // 直接使用登录返回的数据，而不是尝试访问data.user
        setUser(data);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        console.log('Login successful:', data);
      })
      .catch(error => {
        setLoginError(error.message || 'Login failed, please check your credentials');
        console.error('Login failed:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegister = (userData) => {
    // 确保用户数据包含所有必要字段
    if (!userData.name || !userData.email || !userData.password) {
      setRegisterError('所有字段都是必填的');
      return;
    }
    
    console.log('注册数据:', userData); // 调试日志
    
    setIsLoading(true);
    setRegisterError('');
    
    // 确保直接传递正确格式的数据对象
    const registrationData = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    
    register(registrationData)
      .then(response => {
        // 直接使用response，不假设它有user属性
        setUser(response);
        setIsLoggedIn(true);
        setIsRegisterModalOpen(false);
      })
      .catch(error => {
        setRegisterError(error.message || 'Registration failed, please try again later');
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
        setShowDropdown(false);
        console.log('Logged out');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };
  
  // 添加忘记密码处理函数
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    setIsLoginModalOpen(false);
    
    // 使用setTimeout确保登录模态框已关闭
    setTimeout(() => {
      setForgotPasswordError('');
      setForgotPasswordSuccess('');
      setIsForgotPasswordModalOpen(true);
    }, 100);
  };
  
  // 处理忘记密码提交
  const handleForgotPasswordSubmit = async ({ email }) => {
    try {
      setIsLoading(true);
      setForgotPasswordError('');
      await requestPasswordReset(email);
      setForgotPasswordSuccess('A password reset link has been sent to your email address.');
    } catch (err) {
      setForgotPasswordError(err.message || 'Failed to send reset link. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Adelaide Fringe</Link>
        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <div
                className={styles.userAvatar}
                onClick={toggleDropdown}
                ref={avatarRef}
                tabIndex="0"
              >
                {getUserInitial()}
              </div>
              <div
                className={`${styles.userDropdown} ${showDropdown ? styles.show : ''}`}
                ref={dropdownRef}
              >
                <span className={styles.userName}>{user?.name}</span>
                {user?.role === 'ADMIN' || user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    // Modified: Only use .dropdownItem class
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/user"
                    // Modified: Only use .dropdownItem class
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    My Account
                  </Link>
                )}
                <button
                  // Modified: Only use .dropdownItem class
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Keep existing button styles for Login/Register outside dropdown */}
              <button
                className={`${formStyles.btn} ${formStyles.btnSecondary}`}
                onClick={() => {
                  setLoginError('');
                  setIsLoginModalOpen(true);
                }}
                disabled={isLoading}
              >
                Login
              </button>
              <button
                className={`${formStyles.btn} ${formStyles.btnPrimary}`}
                onClick={() => {
                  setRegisterError('');
                  setIsRegisterModalOpen(true);
                }}
                disabled={isLoading}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        title="Login"
      >
        {loginError && <div className={styles.errorMessage}>{loginError}</div>}
        <LoginForm 
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          isModal={true}
        />
        <div className={formStyles.formFooter}>
          <p>
            Don't have an account?{' '}
            <button 
              className={formStyles.linkButton}
              onClick={() => {
                setIsLoginModalOpen(false);
                setRegisterError('');
                setIsRegisterModalOpen(true);
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register"
      >
        {registerError && <div className={styles.errorMessage}>{registerError}</div>}
        <RegisterForm onRegister={handleRegister} />
        <div className={formStyles.formFooter}>
          <p>
            Already have an account?{' '}
            <button 
              className={formStyles.linkButton}
              onClick={() => {
                setIsRegisterModalOpen(false);
                setLoginError('');
                setIsLoginModalOpen(true);
              }}
            >
              Login here
            </button>
          </p>
        </div>
      </Modal>

      {/* 忘记密码模态框 */}
      <Modal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={() => setIsForgotPasswordModalOpen(false)}
        title="Forgot Password"
      >
        {forgotPasswordError && <div className={styles.errorMessage}>{forgotPasswordError}</div>}
        {forgotPasswordSuccess ? (
          <div className={formStyles.successMessage}>
            <p>{forgotPasswordSuccess}</p>
            <button 
              className={`${formStyles.btn} ${formStyles.btnPrimary}`}
              onClick={() => setIsForgotPasswordModalOpen(false)}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} />
            <div className={formStyles.formFooter}>
              <button
                className={formStyles.linkButton}
                onClick={() => {
                  setIsForgotPasswordModalOpen(false);
                  setLoginError('');
                  setIsLoginModalOpen(true);
                }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </Modal>
    </header>
  )
}

export default Header