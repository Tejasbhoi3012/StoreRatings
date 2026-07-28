import React, { useState } from 'react'
import { KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { updatePassword } from '../../services/api'
import { validatePassword } from '../../utils/validation'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField, Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const TIPS = [
  'Use a unique password that you don’t use elsewhere',
  'Include uppercase, lowercase, numbers, and special characters',
  'Avoid using personal information in your password',
  'Consider using a password manager for better security',
]

export default function UpdatePassword() {
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const e1 = validatePassword(password)
    if (e1) return setError(e1)
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await updatePassword({ password })
      setSuccess('Password updated successfully!')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout
      role={user?.role}
      title="Security settings"
      description="Update your account password"
    >
      <div className="max-w-xl space-y-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <KeyRound className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Change password</h2>
                <p className="text-sm text-muted-foreground">Enter your new password below</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg bg-error-bg border border-error/20 px-3.5 py-3 mb-5 animate-slide-up">
                <AlertCircle className="h-4 w-4 text-error flex-shrink-0" />
                <p className="text-sm font-medium text-error">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2.5 rounded-lg bg-success-bg border border-success/20 px-3.5 py-3 mb-5 animate-slide-up">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                <p className="text-sm font-medium text-success">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField label="New password" hint="8-16 characters, one uppercase letter, one special character">
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <div className="flex gap-3">
                <Button type="submit" loading={loading}>Update password</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setPassword(''); setError(null); setSuccess(null) }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-accent/40 border-accent">
          <CardContent>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              {TIPS.map(tip => (
                <li key={tip} className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
