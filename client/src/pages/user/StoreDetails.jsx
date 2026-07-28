import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react'
import { getStore, submitRating, updateRating } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import { StarRating, StarPicker } from '../../components/ui/RatingStars'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'

export default function StoreDetails() {
  const { id } = useParams()
  const [store, setStore] = useState(null)
  const [rating, setRating] = useState(0)
  const [userRating, setUserRating] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const res = await getStore(id)
      setStore(res.data)
      setUserRating(res.data.userRating || null)
      setRating(res.data.userRating?.value || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load store')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  async function handleSubmit(value) {
    setRating(value)
    setSaving(true)
    try {
      if (userRating) {
        await updateRating(id, userRating.id, { value })
      } else {
        await submitRating(id, { value })
      }
      await fetch()
      toast('Rating saved', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save rating', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout
      role="user"
      actions={
        <Link to="/user/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to stores
        </Link>
      }
    >
      {loading ? (
        <Card className="max-w-2xl">
          <CardContent className="space-y-4">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="max-w-2xl">
          <CardContent className="flex items-center gap-2.5 text-error">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardContent>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{store.name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{store.address}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Average rating</span>
                <StarRating value={store.averageRating || 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-sm font-semibold text-foreground mb-1">
                {userRating ? 'Your rating' : 'Rate this store'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {userRating ? 'Tap a star to update your rating.' : 'Tap a star to submit your rating.'}
              </p>
              <div className="flex items-center gap-4">
                <StarPicker value={rating} onChange={handleSubmit} disabled={saving} />
                {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
