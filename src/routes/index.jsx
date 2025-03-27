import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import MainLayout from '../components/layout/MainLayout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Route>
    </Routes>
  )
}

export default AppRoutes
