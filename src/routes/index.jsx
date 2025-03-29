import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HomePage from '../pages/HomePage'
import EventsPage from '../pages/EventsPage'
import EventDetailPage from '../pages/EventDetailPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import EventManagement from '../pages/admin/EventManagement'
import CreateEvent from '../pages/admin/CreateEvent'
import EditEvent from '../pages/admin/EditEvent'
import TicketManagement from '../pages/admin/TicketManagement'
import { isAuthenticated, getCurrentUser } from '../services/authService'

// Admin route guard component
const AdminRoute = ({ children }) => {
  const user = getCurrentUser();
  const isAdmin = user && user.role === 'admin';
  
  if (!isAuthenticated()) {
    // Not logged in, redirect to login
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    // Logged in but not admin, redirect to home
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
