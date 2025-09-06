import React, { useState } from 'react'
import { signupUser } from '../../services/api'
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const e1 = validateName(form.name)
    const e2 = validateEmail(form.email)
    const e3 = validatePassword(form.password)
    const e4 = validateAddress(form.address)
    const errs = { name: e1, email: e2, password: e3, address: e4 }
    setErrors(errs)
    if (e1 || e2 || e3 || e4) return

    try {
      await signupUser(form)
      navigate('/login')
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Signup failed' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">SR</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join StoreRatings</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
          
          {errors.form && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <p className="text-red-700 font-medium">{errors.form}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                type="text"
                className={`w-full border-2 rounded-lg p-3 text-gray-900 transition-all duration-200 outline-none ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                placeholder="Enter your full name"
                value={form.name} 
                onChange={e=>setForm({...form, name: e.target.value})}
                required
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email"
                className={`w-full border-2 rounded-lg p-3 text-gray-900 transition-all duration-200 outline-none ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                placeholder="Enter your email"
                value={form.email} 
                onChange={e=>setForm({...form, email: e.target.value})}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea 
                className={`w-full border-2 rounded-lg p-3 text-gray-900 transition-all duration-200 outline-none resize-none h-20 ${
                  errors.address 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                placeholder="Enter your address"
                value={form.address} 
                onChange={e=>setForm({...form, address: e.target.value})}
                required
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>
                  {errors.address}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password"
                className={`w-full border-2 rounded-lg p-3 text-gray-900 transition-all duration-200 outline-none ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                placeholder="Create a password"
                value={form.password} 
                onChange={e=>setForm({...form, password: e.target.value})}
                required
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span>
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Create Account
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account? 
              <Link to="/login" className="ml-1 text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}