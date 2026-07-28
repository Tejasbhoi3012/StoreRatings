import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Store, Star, Plus, ArrowRight } from 'lucide-react'
import {
  getStats,
  getUsers,
  updateUserRole,
  getStoresAdmin,
  createStore
} from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Table from '../../components/Table'
import Button from '../../components/ui/Button'
import Dialog from '../../components/ui/Dialog'
import { FormField, Input, Select } from '../../components/ui/Input'
import { StarRating } from '../../components/ui/RatingStars'
import { useToast } from '../../context/ToastContext'

const STATS_CONFIG = [
  { key: 'users', label: 'Total Users', icon: Users, accent: 'primary' },
  { key: 'stores', label: 'Total Stores', icon: Store, accent: 'success' },
  { key: 'ratings', label: 'Total Ratings', icon: Star, accent: 'warning' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 })
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [addStoreOpen, setAddStoreOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes, storesRes] = await Promise.all([
          getStats(),
          getUsers(),
          getStoresAdmin()
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data)
        setStores(storesRes.data)
      } catch (err) {
        console.error('Failed to fetch data', err)
        toast('Failed to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole)
      setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)))
      toast(`Role updated to ${newRole}`, 'success')
    } catch (err) {
      console.error(err)
      toast('Failed to update role', 'error')
    }
  }

  const handleCreateStore = async (e) => {
    e.preventDefault()
    if (!form.name || !form.address) return
    setCreating(true)
    try {
      const newStore = await createStore(form)
      setStores(prev => [...prev, newStore.data])
      setForm({ name: '', email: '', address: '' })
      setStats(prev => ({ ...prev, stores: prev.stores + 1 }))
      setAddStoreOpen(false)
      toast('Store created successfully', 'success')
    } catch (err) {
      console.error(err.response?.data || err.message)
      toast(`Failed to create store: ${err.response?.data?.message || err.message}`, 'error')
    } finally {
      setCreating(false)
    }
  }

  const userColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    {
      key: 'role', title: 'Role', render: (u) => (
        <Select
          value={u.role}
          onChange={e => handleRoleChange(u.id, e.target.value)}
          className="w-36"
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </Select>
      )
    },
  ]

  const storeColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email', render: (s) => s.email || '—' },
    { key: 'address', title: 'Address' },
    { key: 'rating', title: 'Avg Rating', render: (s) => <StarRating value={s.averageRating || 0} size="sm" /> },
  ]

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      description="Overview of platform activity"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STATS_CONFIG.map(({ key, label, icon, accent }) => (
          loading ? (
            <div key={key} className="rounded-xl border border-border bg-surface p-5 h-[104px] shimmer" />
          ) : (
            <StatCard key={key} icon={icon} label={label} value={stats[key]} accent={accent} />
          )
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <Button as={Link} to="/admin/users" variant="ghost" size="sm">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <div className="p-0">
          <Table
            columns={userColumns}
            data={users.slice(0, 6)}
            loading={loading}
            emptyTitle="No users yet"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Stores</CardTitle>
          <div className="flex items-center gap-2">
            <Button as={Link} to="/admin/stores" variant="ghost" size="sm">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" onClick={() => setAddStoreOpen(true)}>
              <Plus className="h-4 w-4" /> Add Store
            </Button>
          </div>
        </CardHeader>
        <div className="p-0">
          <Table
            columns={storeColumns}
            data={stores.slice(0, 6)}
            loading={loading}
            emptyTitle="No stores yet"
          />
        </div>
      </Card>

      <Dialog
        open={addStoreOpen}
        onClose={() => setAddStoreOpen(false)}
        title="Add a new store"
        description="Create a store record for the platform"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddStoreOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateStore} loading={creating}>Create store</Button>
          </>
        }
      >
        <form onSubmit={handleCreateStore} className="space-y-4">
          <FormField label="Store name">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Acme Supplies" required />
          </FormField>
          <FormField label="Store email">
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="store@example.com" />
          </FormField>
          <FormField label="Address">
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St" required />
          </FormField>
        </form>
      </Dialog>
    </DashboardLayout>
  )
}
