import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, MapPin, Lock, AlertCircle } from 'lucide-react'
import { signupUser } from '../../services/api'
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation'
import AuthLayout from '../../components/layout/AuthLayout'
import { FormField, Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
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

    setLoading(true)
    try {
      await signupUser(form)
      navigate('/login')
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Signup failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      panelTitle="Join a community that values honest feedback."
      panelSubtitle="Create an account to start rating stores, or register your own store to gather feedback."
    >
      <div className="mb-8 lg:hidden flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">SR</span>
        </div>
        <span className="font-semibold text-lg text-foreground tracking-tight">StoreRatings</span>
      </div>

      <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1.5">Get started with StoreRatings in a minute</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {errors.form && (
          <div className="flex items-center gap-2.5 rounded-lg bg-error-bg border border-error/20 px-3.5 py-3 animate-slide-up">
            <AlertCircle className="h-4 w-4 text-error flex-shrink-0" />
            <p className="text-sm font-medium text-error">{errors.form}</p>
          </div>
        )}

        <FormField label="Full name" error={errors.name}>
          <Input
            icon={<User className="h-4 w-4" />}
            placeholder="Jane Doe (min. 20 characters)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            required
          />
        </FormField>

        <FormField label="Email address" error={errors.email}>
          <Input
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            required
          />
        </FormField>

        <FormField label="Address" error={errors.address}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-3 text-muted-foreground">
              <MapPin className="h-4 w-4" />
            </span>
            <Textarea
              className="pl-9 h-20"
              placeholder="Enter your address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              error={!!errors.address}
              required
            />
          </div>
        </FormField>

        <FormField label="Password" error={errors.password} hint={!errors.password ? '8-16 characters, one uppercase letter, one special character' : undefined}>
          <Input
            type="password"
            icon={<Lock className="h-4 w-4" />}
            placeholder="Create a password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            error={!!errors.password}
            required
          />
        </FormField>

        <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
          Create account
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
