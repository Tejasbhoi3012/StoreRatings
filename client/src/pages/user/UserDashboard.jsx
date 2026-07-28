import React, { useEffect, useState } from 'react'
import { Search, StoreIcon } from 'lucide-react'
import { getStores } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import StoreCard from '../../components/StoreCard'
import { useToast } from '../../context/ToastContext'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', address: '' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        const res = await getStores(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))
        setStores(res.data || [])
      } catch (err) {
        toast(err.response?.data?.message || 'Failed to load stores', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [filters])

  return (
    <DashboardLayout
      role="user"
      title="Browse stores"
      description="Search stores and share your rating"
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Search by name"
              value={filters.name}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Search by address"
              value={filters.address}
              onChange={e => setFilters(f => ({ ...f, address: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <EmptyState
            icon={StoreIcon}
            title="No stores found"
            description="Try adjusting your search filters to find what you're looking for."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map(s => (
            <StoreCard key={s.id} store={s} onUpdated={() => setFilters(f => ({ ...f }))} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
