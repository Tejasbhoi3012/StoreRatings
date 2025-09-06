import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SR</span>
          </div>
          <span className="font-semibold text-lg text-gray-900 tracking-tight">StoreRatings</span>
        </div>

        <div className="flex items-center sm:hidden">
          <button
            onClick={() => { toggleSidebar(); setIsMobileMenuOpen(false); }}
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2 mr-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
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

        <div className="hidden sm:flex items-center justify-end gap-3 flex-1">
          {user ? (
            <>
              <div className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-medium text-gray-900 truncate max-w-[12rem]">{user.name}</span>
                <span className="ml-2 text-gray-500">• {user.role}</span>
              </div>
              <button
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-full mb-2">
                <span className="font-medium text-gray-900 truncate max-w-[12rem]">{user.name}</span>
                <span className="ml-2 text-gray-500">• {user.role}</span>
              </div>
              <button
                className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}