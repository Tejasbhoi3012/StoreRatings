import React, { useState } from 'react'
import { updatePassword } from '../../services/api'
import { validatePassword } from '../../utils/validation'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const e1 = validatePassword(password)
    if (e1) return setError(e1)
    setError(null)
    try {
      await updatePassword({ password })
      setSuccess('Password updated successfully!')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Update your account password</p>
        <div className="w-20 h-1 bg-blue-500 rounded mt-4"></div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-blue-600 text-xl">🔐</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <p className="text-gray-600 text-sm">Enter your new password below</p>
          </div>
        </div>
        
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 mr-3 text-lg">❌</span>
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-green-600 mr-3 text-lg">✅</span>
              <div>
                <p className="text-green-800 font-medium">Success</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input 
              type="password" 
              className="w-full border-2 border-gray-200 rounded-lg p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Enter your new password"
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm mt-2">
              Password should be at least 8 characters long with a mix of letters, numbers, and symbols
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Update Password
            </button>
            
            <button 
              type="button"
              onClick={() => {setPassword(''); setError(null); setSuccess(null)}}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Security Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Security Tips
        </h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• Use a unique password that you don't use elsewhere</li>
          <li>• Include uppercase, lowercase, numbers, and special characters</li>
          <li>• Avoid using personal information in your password</li>
          <li>• Consider using a password manager for better security</li>
        </ul>
      </div>
    </div>
  )
}