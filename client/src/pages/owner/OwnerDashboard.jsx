import React, { useEffect, useState } from 'react'
import { Star, Users, Building2, AlertCircle } from 'lucide-react'
import { getOwnerStoreRatings, getOwnerStore } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Avatar from '../../components/ui/Avatar'
import { StarRating } from '../../components/ui/RatingStars'
import EmptyState from '../../components/ui/EmptyState'

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([])
  const [store, setStore] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setError(null)
      setLoading(true)
      try {
        const s = await getOwnerStore()
        setStore(s.data)
        try {
          const r = await getOwnerStoreRatings()
          setRatings(r.data || [])
        } catch {
          setRatings([])
        }
      } catch (err) {
        const message = err?.response?.status === 404
          ? 'No store is assigned to your owner account yet.'
          : (err?.response?.data?.message || 'Failed to load owner store')
        setError(message)
        setStore(null)
        setRatings([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const avg = ratings.length ? (ratings.reduce((a, b) => a + b.value, 0) / ratings.length) : 0

  return (
    <DashboardLayout
      role="owner"
      title="Owner Dashboard"
      description={store?.name ? `Managing ${store.name}` : undefined}
    >
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 h-[104px] shimmer" />
          ))}
        </div>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="flex items-center gap-2.5 text-error">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Building2} label="Store" value={store?.name || '—'} accent="primary" />
            <StatCard icon={Star} label="Average Rating" value={avg.toFixed(2)} accent="warning" />
            <StatCard icon={Users} label="Total Ratings" value={ratings.length} accent="success" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Ratings</CardTitle>
            </CardHeader>
            {ratings.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No ratings yet"
                description="Ratings from customers will show up here once submitted."
              />
            ) : (
              <ul className="divide-y divide-border">
                {ratings.map(r => (
                  <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={r.userName || '?'} size="sm" />
                      <span className="text-sm font-medium text-foreground truncate">{r.userName}</span>
                    </div>
                    <StarRating value={r.value} size="sm" />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
