import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Trash2 } from 'lucide-react'
import { getUsers, createUser, deleteUser } from '../../services/api'
import Table from '../../components/Table'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField, Input, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Dialog from '../../components/ui/Dialog'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../context/ToastContext'

const ROLE_VARIANTS = { admin: 'primary', owner: 'warning', user: 'default' }

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  async function refresh() {
    setLoading(true)
    const res = await getUsers(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))
    setUsers(res.data || [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [filters])

  async function handleCreate() {
    if (!form.name || !form.email || !form.password) {
      toast('Name, email and password are required', 'error')
      return
    }
    setCreating(true)
    try {
      await createUser(form)
      setForm({ name: '', email: '', password: '', address: '', role: 'user' })
      setAddOpen(false)
      await refresh()
      toast('User created successfully', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create user', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteUser(deleteTarget.id)
      await refresh()
      toast('User deleted', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete user', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address', render: (u) => u.address || '—' },
    { key: 'role', title: 'Role', render: (u) => <Badge variant={ROLE_VARIANTS[u.role] || 'default'} className="capitalize">{u.role}</Badge> },
    {
      key: 'actions', title: '', sortable: false, render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button as={Link} to={`/admin/users/${u.id}`} variant="ghost" size="icon" title="View details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete user" className="hover:bg-error-bg hover:text-error" onClick={() => setDeleteTarget(u)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout
      role="admin"
      title="Users"
      description="Manage platform users and their roles"
      actions={
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      }
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by name" value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by email" value={filters.email} onChange={e => setFilters(f => ({ ...f, email: e.target.value }))} />
            <Input icon={<Search className="h-4 w-4" />} placeholder="Filter by address" value={filters.address} onChange={e => setFilters(f => ({ ...f, address: e.target.value }))} />
            <Select value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="user">User</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Table columns={columns} data={users} loading={loading} emptyTitle="No users found" emptyDescription="Try adjusting your filters." />

      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a new user"
        description="Create a user account on the platform"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating}>Create user</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Name">
            <Input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="Full name" />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} placeholder="you@example.com" />
          </FormField>
          <FormField label="Password">
            <Input type="password" value={form.password} onChange={e => setForm(s => ({ ...s, password: e.target.value }))} placeholder="Temporary password" />
          </FormField>
          <FormField label="Address">
            <Input value={form.address} onChange={e => setForm(s => ({ ...s, address: e.target.value }))} placeholder="Address" />
          </FormField>
          <FormField label="Role">
            <Select value={form.role} onChange={e => setForm(s => ({ ...s, role: e.target.value }))}>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        description={`This will permanently remove ${deleteTarget?.name || 'this user'}, their ratings, and unassign any owned stores.`}
        confirmLabel="Delete user"
      />
    </DashboardLayout>
  )
}
