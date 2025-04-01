import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../login/modal'
import LoginForm from '../login/LoginForm'
import RegisterForm from '../login/RegisterForm'
import { login, register, logout, isAuthenticated, getCurrentUser } from '../../services/authService'
import styles from './Header.module.css'
import formStyles from '../login/Form.module.css'
import { signin } from '../../services/authService'

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
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

  // Get user's initial
  const getUserInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setLoginError('');

    await signin(credentials)
    
    // login(credentials)
    //   .then(response => {
    //     setUser(response.user);
    //     setIsLoggedIn(true);
    //     setIsLoginModalOpen(false);
    //     console.log('Login successful:', response.user);
    //   })
    //   .catch(error => {
    //     setLoginError(error.message || 'Login failed, please check your credentials');
    //     console.error('Login failed:', error);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const handleRegister = (userData) => {
    setIsLoading(true);
    setRegisterError('');
    
    register(userData)
      .then(response => {
        setUser(response.user);
        setIsLoggedIn(true);
        setIsRegisterModalOpen(false);
        console.log('Registration successful:', response.user);
      })
      .catch(error => {
        setRegisterError(error.message || 'Registration failed, please try again later');
        console.error('Registration failed:', error);
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
                {user?.role === 'admin' ? (
                  <Link 
                    to="/admin" 
                    className={`${formStyles.btn} ${formStyles.btnSecondary} ${styles.menuLink}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/user" 
                    className={`${formStyles.btn} ${formStyles.btnSecondary} ${styles.menuLink}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    My Account
                  </Link>
                )}
                <button 
                  className={`${formStyles.btn} ${formStyles.btnSecondary}`}
                  onClick={handleLogout}
                >
                  Logout
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
        <LoginForm onLogin={handleLogin} />
      </Modal>

      {/* Register Modal */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register"
      >
        {registerError && <div className={styles.errorMessage}>{registerError}</div>}
        <RegisterForm onRegister={handleRegister} />
      </Modal>
    </header>
  )
}

export default Header