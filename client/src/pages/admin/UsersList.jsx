import React, { useEffect, useState } from 'react'
import { getUsers, createUser, deleteUser } from '../../services/api'
import Table from '../../components/Table'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { Link } from 'react-router-dom'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const res = await getUsers(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
      setUsers(res.data || [])
      setLoading(false)
    }
    fetch()
  }, [filters])

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address' },
    { key: 'role', title: 'Role' },
    { key: 'actions', title: 'Actions', render: (u) => (
      <div className="flex gap-3">
        <Link className="text-blue-600" to={`/admin/users/${u.id}`}>View</Link>
        <button
          className="text-red-600"
          onClick={async () => {
            if (!window.confirm('Delete this user? This will remove their ratings and unassign owned stores.')) return
            await deleteUser(u.id)
            const res = await getUsers(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
            setUsers(res.data || [])
          }}
        >Delete</button>
      </div>
    )},
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="p-6 flex-1 mx-auto w-full max-w-7xl">
          <h1 className="text-2xl font-semibold mb-4">Users</h1>
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-semibold mb-3">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input className="border p-2 rounded" placeholder="Name" value={filters.name} onChange={e=>setFilters(f=>({...f, name: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Email" value={filters.email} onChange={e=>setFilters(f=>({...f, email: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Address" value={filters.address} onChange={e=>setFilters(f=>({...f, address: e.target.value}))} />
              <select className="border p-2 rounded" value={filters.role} onChange={e=>setFilters(f=>({...f, role: e.target.value}))}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-semibold mb-3">Add New User</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm(s=>({...s, name: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm(s=>({...s, email: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(s=>({...s, password: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={e=>setForm(s=>({...s, address: e.target.value}))} />
              <select className="border p-2 rounded" value={form.role} onChange={e=>setForm(s=>({...s, role: e.target.value}))}>
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={creating}
              onClick={async ()=>{
                try{
                  setCreating(true)
                  const payload = { name: form.name, email: form.email, password: form.password, address: form.address, role: form.role }
                  if(!payload.name || !payload.email || !payload.password){
                    return
                  }
                  await createUser(payload)
                  setForm({ name: '', email: '', password: '', address: '', role: 'user' })
                  const res = await getUsers(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
                  setUsers(res.data || [])
                } finally {
                  setCreating(false)
                }
              }}
            >Create User</button>
          </div>

          {loading ? (
            <div className="bg-white p-4 rounded shadow">Loading...</div>
          ) : (
            <Table columns={columns} data={users} />
          )}
        </main>
      </div>
    </div>
  )
}