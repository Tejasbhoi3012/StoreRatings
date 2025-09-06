import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserDetail } from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      setError(null)
      try{
        const res = await getUserDetail(id)
        setUser(res.data)
      } catch(err){
        setError(err?.response?.data?.message || 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">User Details</h1>
            <Link to="/admin/users" className="text-blue-600">Back to Users</Link>
          </div>
          {loading && <div className="bg-white p-4 rounded shadow">Loading...</div>}
          {error && <div className="bg-red-50 text-red-800 p-4 rounded shadow">{error}</div>}
          {!loading && !error && user && (
            <div className="bg-white p-4 rounded shadow space-y-2">
              <div><span className="font-semibold">Name:</span> {user.name}</div>
              <div><span className="font-semibold">Email:</span> {user.email}</div>
              <div><span className="font-semibold">Address:</span> {user.address || '-'}</div>
              <div><span className="font-semibold">Role:</span> {user.role}</div>
              {user.role === 'owner' && (
                <div><span className="font-semibold">Owner Average Rating:</span> {user.ownerAverageRating ?? '-'}</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


