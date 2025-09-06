import React, { useEffect, useState } from 'react'
import {
  getStats,
  getUsers,
  updateUserRole,
  getStoresAdmin,
  createStore
} from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 })
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Fetch initial data
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
        setMessage('❌ Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Update user role
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole)
      setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)))
      setMessage(`✅ Role updated to ${newRole}`)
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setMessage('❌ Failed to update role')
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Create store
  const handleCreateStore = async (e) => {
    e.preventDefault()
    const form = e.target
    const payload = {
      name: form.name.value,
      email: form.email.value,
      address: form.address.value,
    }
    try {
      const newStore = await createStore(payload)
      setStores(prev => [...prev, newStore.data])
      form.reset()
      setMessage('✅ Store created successfully')
      setStats(prev => ({ ...prev, stores: prev.stores + 1 })) // Update count
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error(err.response?.data || err.message)
      setMessage(`❌ Failed to create store: ${err.response?.data?.message || err.message}`)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar role="admin" isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Notification */}
          {message && (
            <div className="mb-4 px-4 py-2 rounded bg-blue-100 text-blue-800">{message}</div>
          )}

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {['users','stores','ratings'].map((key, idx) => (
                  <div key={idx} className="bg-white rounded shadow p-6 text-center hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold capitalize">{key}</h3>
                    <p className="text-3xl font-bold">{stats[key]}</p>
                  </div>
                ))}
              </div>

              {/* Users Table */}
              <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
              <div className="overflow-x-auto bg-white rounded shadow mb-10">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={e => handleRoleChange(user.id, e.target.value)}
                            className="border px-2 py-1 rounded bg-gray-50 hover:bg-gray-100"
                          >
                            <option value="user">User</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Create Store Form */}
              <h2 className="text-2xl font-semibold mb-4">Manage Stores</h2>
              <form onSubmit={handleCreateStore} className="mb-6 bg-white p-6 rounded shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder="Store name" className="border px-3 py-2 rounded w-full" required />
                  <input name="email" placeholder="Store email" className="border px-3 py-2 rounded w-full" />
                  <input name="address" placeholder="Store address" className="border px-3 py-2 rounded w-full" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto">
                  Add Store
                </button>
              </form>

              {/* Stores Table */}
              <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Address</th>
                      <th className="px-4 py-2 text-left">Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stores.map(store => (
                      <tr key={store.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{store.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{store.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{store.address}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{store.averageRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
