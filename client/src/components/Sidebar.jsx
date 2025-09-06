import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ role, isOpen, onClose }) {
  const linkClasses = "block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-l-4 hover:border-blue-500 transition-all duration-200 font-medium";

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-30 ${isOpen ? 'block' : 'hidden'} md:hidden`}
        onClick={onClose}
      ></div>
      <aside
        className={`transform top-0 left-0 w-64 bg-white border-r border-gray-200 p-6 min-h-screen fixed md:sticky overflow-auto z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block ${!isOpen ? 'hidden' : ''}`}
        style={{ top: '3.5rem' }} // Height of Navbar
      >
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigation</h2>
          <div className="w-10 h-0.5 bg-blue-600 rounded mt-2"></div>
        </div>
        
        <ul className="space-y-2">
          {role === 'admin' && (
            <>
              <li>
                <Link to="/admin/dashboard" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Users
                </Link>
              </li>
              <li>
                <Link to="/admin/stores" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Stores
                </Link>
              </li>
            </>
          )}
          {role === 'user' && (
            <>
              <li>
                <Link to="/user/dashboard" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Stores
                </Link>
              </li>
              <li>
                <Link to="/update-password" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Update Password
                </Link>
              </li>
            </>
          )}
          {role === 'owner' && (
            <>
              <li>
                <Link to="/owner/dashboard" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  My Store
                </Link>
              </li>
              <li>
                <Link to="/update-password" className={linkClasses} onClick={onClose}>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Update Password
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
    </>
  )
}
