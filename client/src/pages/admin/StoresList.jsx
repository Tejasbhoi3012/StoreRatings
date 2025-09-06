import React, { useEffect, useMemo, useState } from 'react'
import { getStoresAdmin, getUsers, assignStoreOwner, createStore, deleteStore } from '../../services/api'
import Table from '../../components/Table'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function StoresList() {
  const [stores, setStores] = useState([])
  const [owners, setOwners] = useState([])
  const [savingId, setSavingId] = useState(null)
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const [storesRes, ownersRes] = await Promise.all([
        getStoresAdmin(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v))),
        getUsers({ role: 'owner' })
      ])
      setStores(storesRes.data || [])
      setOwners(ownersRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [filters])

  const ownerIdToName = useMemo(() => {
    const m = new Map()
    owners.forEach(o => m.set(o.id, o.name))
    return m
  }, [owners])

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address' },
    { key: 'rating', title: 'Rating', render: (r) => r.averageRating || 0 },
    { key: 'owner', title: 'Owner', render: (r) => ownerIdToName.get(r.ownerId) || '-' },
    { key: 'actions', title: 'Assign Owner', render: (row) => (
      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1"
          value={row.ownerId || ''}
          onChange={async (e) => {
            const newOwnerId = e.target.value ? Number(e.target.value) : null
            try {
              setSavingId(row.id)
              await assignStoreOwner(row.id, newOwnerId)
              setStores(prev => prev.map(s => s.id === row.id ? { ...s, ownerId: newOwnerId } : s))
            } finally {
              setSavingId(null)
            }
          }}
          disabled={savingId === row.id}
        >
          <option value="">Unassigned</option>
          {owners.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>
    ) },
    { key: 'delete', title: 'Delete', render: (row) => (
      <button
        className="text-red-600"
        onClick={async () => {
          if (!window.confirm('Delete this store and its ratings?')) return
          await deleteStore(row.id)
          const res = await getStoresAdmin(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
          setStores(res.data || [])
        }}
      >Delete</button>
    ) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="p-6 flex-1 mx-auto w-full max-w-7xl">
          <h1 className="text-2xl font-semibold mb-4">Stores</h1>
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-semibold mb-3">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border p-2 rounded" placeholder="Name" value={filters.name} onChange={e=>setFilters(f=>({...f, name: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Email" value={filters.email} onChange={e=>setFilters(f=>({...f, email: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Address" value={filters.address} onChange={e=>setFilters(f=>({...f, address: e.target.value}))} />
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-semibold mb-3">Add New Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm(s=>({...s, name: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm(s=>({...s, email: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={e=>setForm(s=>({...s, address: e.target.value}))} />
              <select className="border p-2 rounded" value={form.ownerId} onChange={e=>setForm(s=>({...s, ownerId: e.target.value}))}>
                <option value="">No Owner</option>
                {owners.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={creating}
              onClick={async ()=>{
                try{
                  setCreating(true)
                  const payload = { name: form.name, email: form.email || undefined, address: form.address || undefined, ownerId: form.ownerId ? Number(form.ownerId) : undefined }
                  if(!payload.name){ return }
                  await createStore(payload)
                  setForm({ name: '', email: '', address: '', ownerId: '' })
                  const res = await getStoresAdmin(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
                  setStores(res.data || [])
                } finally {
                  setCreating(false)
                }
              }}
            >Create Store</button>
          </div>

          {loading ? (
            <div className="bg-white p-4 rounded shadow">Loading...</div>
          ) : (
            <Table columns={columns} data={stores} />
          )}
        </main>
      </div>
    </div>
  )
}