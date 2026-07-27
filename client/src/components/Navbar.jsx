import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navbar component with a toggleable sidebar and responsive menu
export default function Navbar({ toggleSidebar }) {
  // Access user authentication context (user info + logout function)
  const { user, logout } = useAuth()

  // Hook from react-router-dom to programmatically navigate pages
  const navigate = useNavigate()

  // Local state to handle mobile menu toggle (open/close)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Function to handle logout (clear auth + redirect to login page)
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      {/* Navbar container */}
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Left side: Logo + App Name */}
        <div className="flex items-center gap-3 flex-1">
          {/* Small logo box */}
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SR</span>
          </div>
          {/* App name */}
          <span className="font-semibold text-lg text-gray-900 tracking-tight">StoreRatings</span>
        </div>

        {/* Mobile buttons (only visible on small screens) */}
        <div className="flex items-center sm:hidden">
          {/* Sidebar toggle button (hamburger menu) */}
          <button
            onClick={() => { toggleSidebar(); setIsMobileMenuOpen(false); }}
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2 mr-2"
          >
            {/* Icon for sidebar toggle */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>

          {/* Mobile menu toggle button (opens login/logout options) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2"
          >
            {/* Show X icon when menu is open, hamburger when closed */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                // X (close) icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger (open) icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu (hidden on mobile, visible on sm and above) */}
        <div className="hidden sm:flex items-center justify-end gap-3 flex-1">
          {user ? (
            <>
              {/* Show user info (name + role) when logged in */}
              <div className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-medium text-gray-900 truncate max-w-[12rem]">{user.name}</span>
                <span className="ml-2 text-gray-500">• {user.role}</span>
              </div>
              
              {/* Logout button */}
              <button
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in, show Login button
            <Link
              to="/login"
              className="block w-full text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu (only shows when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <div className="flex flex-col items-center">
              {/* User info in mobile view */}
              <div className="flex justify-center items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-full mb-2">
                <span className="font-medium text-gray-900 truncate max-w-[12rem]">{user.name}</span>
                <span className="ml-2 text-gray-500">• {user.role}</span>
              </div>

              {/* Logout button for mobile */}
              <button
                className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            // Login button for mobile
            <Link
              to="/login"
              className="block w-full text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu after login click
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
