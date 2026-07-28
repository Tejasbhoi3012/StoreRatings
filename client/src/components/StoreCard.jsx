import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { submitRating, updateRating } from '../services/api'
import { Card } from './ui/Card'
import { StarRating, StarPicker } from './ui/RatingStars'
import { useToast } from '../context/ToastContext'

export default function StoreCard({ store, onUpdated }) {
  const [rating, setRating] = useState(store.userRating?.value || 0)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  async function handleRate(value) {
    setRating(value)
    try {
      setSaving(true)
      if (store.userRating) {
        await updateRating(store.id, store.userRating.id, { value })
      } else {
        await submitRating(store.id, { value })
      }
      toast('Rating saved', 'success')
      onUpdated && onUpdated()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save rating', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-foreground leading-snug">
            {store.name}
          </h3>
        </div>

        <div className="flex items-start gap-1.5 text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <p className="text-sm leading-relaxed line-clamp-2">{store.address}</p>
        </div>

        <StarRating value={store.averageRating || 0} size="sm" />

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {store.userRating ? 'Your rating' : 'Rate this store'}
          </p>
          <StarPicker value={rating} onChange={handleRate} size="md" disabled={saving} />
        </div>
      </div>

      <Link
        to={`/user/store/${store.id}`}
        className="flex items-center justify-between px-5 py-3 bg-surface-secondary border-t border-border text-sm font-medium text-foreground hover:text-primary hover:bg-surface-hover transition-colors"
      >
        View store
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
  )
}
