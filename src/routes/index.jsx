import React from 'react'
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
import { isAuthenticated, getCurrentUser } from '../services/authService'

// Admin route guard component
const AdminRoute = ({ children }) => {
  const user = getCurrentUser();
  
  // Debug information
  console.log("AdminRoute check - Current user:", user);
  console.log("AdminRoute check - User role:", user?.role);
  console.log("AdminRoute check - isAuthenticated:", isAuthenticated());
  
  // 从用户数据中提取角色信息，并检查是否为ADMIN
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  
  console.log("Is admin user:", isAdmin);
  
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    console.log("Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  console.log("Admin access granted");
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
