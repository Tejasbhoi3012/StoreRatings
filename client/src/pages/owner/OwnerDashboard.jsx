import React, { useEffect, useState } from 'react'
import { getOwnerStoreRatings, getOwnerStore } from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([])
  const [store, setStore] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

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
        } catch (err) {
          // If ratings fetch fails (e.g., 404 when no store), keep empty list
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

  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length).toFixed(2) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar role="owner" isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className={`p-6 flex-1 mx-auto w-full max-w-7xl transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <h1 className="text-2xl font-semibold mb-4">Owner Dashboard</h1>
          {loading && (
            <div className="bg-white p-4 rounded shadow">Loading...</div>
          )}
          {!loading && error && (
            <div className="bg-red-50 text-red-800 p-4 rounded shadow">{error}</div>
          )}
          {!loading && !error && (
            <>
              <div className="bg-white p-4 rounded shadow">Store: {store?.name || '-'}</div>
              <div className="bg-white p-4 rounded shadow mt-4">Average rating: {avg}</div>
            </>
          )}

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Ratings</h2>
            <ul className="space-y-2">
              {ratings.map(r => (
                <li key={r.id} className="bg-white p-3 rounded shadow">{r.userName} — {r.value}</li>
              ))}
              {!ratings.length && !loading && !error && (
                <li className="text-gray-500">No ratings yet.</li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}