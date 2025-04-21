import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser, login } from '../../services/authService'
import Modal from '../../components/login/modal'
import AdminLoginForm from '../../components/login/AdminLoginForm'
import styles from '../../components/login/Modal.module.css'

const AdminLoginPage = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  // 检查是否已经是登录的管理员
  useEffect(() => {
    const user = getCurrentUser();
    if (isAuthenticated() && user && (user.role === 'ADMIN' || user.role === 'admin')) {
      navigate('/admin');
    }
  }, [navigate]);
  
  const handleAdminLogin = (credentials) => {
    setIsLoading(true);
    setLoginError('');
    
    login(credentials)
      .then(data => {
        if (data.role === 'ADMIN' || data.role === 'admin') {
          // 登录成功且是管理员，导航到管理页面
          navigate('/admin');
        } else {
          setLoginError('You do not have admin privileges');
        }
      })
      .catch(error => {
        setLoginError(error.message || 'Login failed. Please check your credentials');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const closeModal = () => {
    navigate('/');
  };
  
  return (
    <div className={styles.adminLoginPage}>
      <Modal 
        isOpen={showAdminLogin} 
        onClose={closeModal}
        title="Admin Login"
      >
        {loginError && <div style={{color: '#e53e3e', marginBottom: '10px'}}>{loginError}</div>}
        {isLoading && <div>Loading...</div>}
        <AdminLoginForm onLogin={handleAdminLogin} />
      </Modal>
    </div>
  );
};

export default AdminLoginPage;