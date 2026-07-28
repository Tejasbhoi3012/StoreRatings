import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, ShieldCheck, Star, AlertCircle } from 'lucide-react'
import { getUserDetail } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const ROLE_VARIANTS = { admin: 'primary', owner: 'warning', user: 'default' }

export default function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      setError(null)
      try {
        const res = await getUserDetail(id)
        setUser(res.data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  return (
    <DashboardLayout
      role="admin"
      title="User details"
      actions={
        <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>
      }
    >
      {loading && (
        <Card>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="flex items-center gap-2.5 text-error">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && user && (
        <Card className="max-w-2xl">
          <CardContent>
            <div className="flex items-center gap-4 pb-5 border-b border-border">
              <Avatar name={user.name} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                <Badge variant={ROLE_VARIANTS[user.role] || 'default'} className="capitalize mt-1.5">{user.role}</Badge>
              </div>
            </div>

            <dl className="pt-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground font-medium">{user.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Address</dt>
                  <dd className="text-sm text-foreground font-medium">{user.address || '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Role</dt>
                  <dd className="text-sm text-foreground font-medium capitalize">{user.role}</dd>
                </div>
              </div>
              {user.role === 'owner' && (
                <div className="flex items-start gap-3">
                  <Star className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Owner average rating</dt>
                    <dd className="text-sm text-foreground font-medium">{user.ownerAverageRating ?? '—'}</dd>
                  </div>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
