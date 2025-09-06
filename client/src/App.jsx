import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import UpdatePassword from './pages/auth/UpdatePassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersList from './pages/admin/UsersList'
import StoresList from './pages/admin/StoresList'
import UserDetails from './pages/admin/UserDetails'
import UserDashboard from './pages/user/UserDashboard'
import StoreDetails from './pages/user/StoreDetails'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ProtectedRoute from './routes/ProductedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><UsersList /></ProtectedRoute>} />
      <Route path="/admin/users/:id" element={<ProtectedRoute role="admin"><UserDetails /></ProtectedRoute>} />
      <Route path="/admin/stores" element={<ProtectedRoute role="admin"><StoresList /></ProtectedRoute>} />

      {/* Normal User */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/store/:id" element={<ProtectedRoute role="user"><StoreDetails /></ProtectedRoute>} />

      {/* Store Owner */}
      <Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />

    </Routes>
  )
}

export default App