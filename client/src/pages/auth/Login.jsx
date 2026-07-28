import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { loginUser } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/layout/AuthLayout'
import { FormField, Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      localStorage.setItem('token', res.data.token)
      login(res.data.user)
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'owner') navigate('/owner/dashboard')
      else navigate('/user/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 lg:hidden flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">SR</span>
        </div>
        <span className="font-semibold text-lg text-foreground tracking-tight">StoreRatings</span>
      </div>

      <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1.5">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 rounded-lg bg-error-bg border border-error/20 px-3.5 py-3 animate-slide-up">
            <AlertCircle className="h-4 w-4 text-error flex-shrink-0" />
            <p className="text-sm font-medium text-error">{error}</p>
          </div>
        )}

        <FormField label="Email address">
          <Input
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </FormField>

        <FormField label="Password">
          <Input
            type="password"
            icon={<Lock className="h-4 w-4" />}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </FormField>

        <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
          Sign in
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:text-primary-hover transition-colors">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
