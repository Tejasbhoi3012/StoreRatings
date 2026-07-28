import React, { useEffect, useState } from 'react'
import { Search, Plus, Trash2 } from 'lucide-react'
import { getStoresAdmin, getUsers, assignStoreOwner, createStore, deleteStore } from '../../services/api'
import Table from '../../components/Table'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField, Input, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Dialog from '../../components/ui/Dialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { StarRating } from '../../components/ui/RatingStars'
import { useToast } from '../../context/ToastContext'

export default function StoresList() {
  const [stores, setStores] = useState([])
  const [owners, setOwners] = useState([])
  const [savingId, setSavingId] = useState(null)
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  async function refresh() {
    setLoading(true)
    const [storesRes, ownersRes] = await Promise.all([
      getStoresAdmin(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))),
      getUsers({ role: 'owner' })
    ])
    setStores(storesRes.data || [])
    setOwners(ownersRes.data || [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [filters])

  async function handleAssignOwner(row, e) {
    const newOwnerId = e.target.value ? Number(e.target.value) : null
    try {
      setSavingId(row.id)
      await assignStoreOwner(row.id, newOwnerId)
      setStores(prev => prev.map(s => s.id === row.id ? { ...s, ownerId: newOwnerId } : s))
      toast('Owner updated', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to assign owner', 'error')
    } finally {
      setSavingId(null)
    }
  }

  async function handleCreate() {
    if (!form.name || !form.address) {
      toast('Store name and address are required', 'error')
      return
    }
    setCreating(true)
    try {
      const payload = { name: form.name, email: form.email || undefined, address: form.address || undefined, ownerId: form.ownerId ? Number(form.ownerId) : undefined }
      await createStore(payload)
      setForm({ name: '', email: '', address: '', ownerId: '' })
      setAddOpen(false)
      await refresh()
      toast('Store created successfully', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create store', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteStore(deleteTarget.id)
      await refresh()
      toast('Store deleted', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete store', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email', render: (r) => r.email || '—' },
    { key: 'address', title: 'Address' },
    { key: 'rating', title: 'Rating', render: (r) => <StarRating value={r.averageRating || 0} size="sm" /> },
    {
      key: 'owner', title: 'Owner', sortable: false, render: (row) => (
        <Select
          className="w-40"
          value={row.ownerId || ''}
          onChange={(e) => handleAssignOwner(row, e)}
          disabled={savingId === row.id}
        >
          <option value="">Unassigned</option>
          {owners.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
      )
    },
    {
      key: 'delete', title: '', sortable: false, render: (row) => (
        <Button variant="ghost" size="icon" title="Delete store" className="hover:bg-error-bg hover:text-error" onClick={() => setDeleteTarget(row)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    },
  ]

  return (
    <DashboardLayout
      role="admin"
      title="Stores"
      description="Manage stores and their assigned owners"
      actions={
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Store
        </Button>
      }
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by name" value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by email" value={filters.email} onChange={e => setFilters(f => ({ ...f, email: e.target.value }))} />
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by address" value={filters.address} onChange={e => setFilters(f => ({ ...f, address: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Table columns={columns} data={stores} loading={loading} emptyTitle="No stores found" emptyDescription="Try adjusting your filters." />

      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a new store"
        description="Create a store and optionally assign an owner"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating}>Create store</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Name">
            <Input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="Store name" />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} placeholder="Store email" />
          </FormField>
          <FormField label="Address">
            <Input value={form.address} onChange={e => setForm(s => ({ ...s, address: e.target.value }))} placeholder="Store address" />
          </FormField>
          <FormField label="Owner">
            <Select value={form.ownerId} onChange={e => setForm(s => ({ ...s, ownerId: e.target.value }))}>
              <option value="">No owner</option>
              {owners.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </Select>
          </FormField>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this store?"
        description={`This will permanently remove ${deleteTarget?.name || 'this store'} and all of its ratings.`}
        confirmLabel="Delete store"
      />
    </DashboardLayout>
  )
}
