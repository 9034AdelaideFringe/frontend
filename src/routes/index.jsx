import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'
import UserLayout from '../components/layout/UserLayout'
import HomePage from '../pages/HomePage'
import EventsPage from '../pages/EventsPage'
import EventDetailPage from '../pages/EventDetailPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import EventManagement from '../pages/admin/EventManagement'
import CreateEvent from '../pages/admin/CreateEvent'
import EditEvent from '../pages/admin/EditEvent'
import TicketManagement from '../pages/admin/TicketManagement'
import UserDashboard from '../pages/user/UserDashboard'
import UserTickets from '../pages/user/UserTickets'
import UserProfile from '../pages/user/UserProfile'
import UserFavorites from '../pages/user/UserFavorites'
import Modal from '../components/login/modal'
import AdminLoginForm from '../components/login/AdminLoginForm'
import { isAuthenticated, getCurrentUser, login } from '../services/authService'
import AdminLoginPage from '../pages/admin/AdminLoginPage';

// Admin route guard component
const AdminRoute = ({ children }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const user = getCurrentUser();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  
  const handleAdminLogin = (credentials) => {
    setIsLoading(true);
    setLoginError('');
    
    login(credentials)
      .then(data => {
        if (data.role === 'ADMIN' || data.role === 'admin') {
          // 登录成功且是管理员，刷新页面重新检查权限
          window.location.reload();
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
  
  if (!isAuthenticated() || !isAdmin) {
    // 显示管理员登录模态框
    return (
      <>
        <Modal 
          isOpen={true} 
          onClose={() => window.location.href = '/'}
          title="Admin Login"
        >
          {loginError && <div style={{color: '#e53e3e', marginBottom: '10px'}}>{loginError}</div>}
          {isLoading && <div>Loading...</div>}
          <AdminLoginForm onLogin={handleAdminLogin} />
        </Modal>
      </>
    );
  }
  
  return children;
};

// User route guard component
const UserRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Not logged in, redirect to home
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="admin-login" element={<AdminLoginPage />} />
      </Route>
      
      {/* User Routes */}
      <Route 
        path="/user"
        element={
          <UserRoute>
            <UserLayout />
          </UserRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="tickets" element={<UserTickets />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="favorites" element={<UserFavorites />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/edit/:id" element={<EditEvent />} />
        <Route path="tickets" element={<TicketManagement />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
