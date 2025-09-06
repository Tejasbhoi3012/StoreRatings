import React, { useEffect, useState } from 'react'
import { getStores } from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import StoreCard from '../../components/StoreCard'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const res = await getStores(Object.fromEntries(Object.entries(filters).filter(([_,v])=>v)))
      setStores(res.data || [])
      setLoading(false)
    }
    fetch()
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar role="user" isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className={`p-6 flex-1 mx-auto w-full max-w-7xl transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <h1 className="text-2xl font-semibold mb-4">Stores</h1>
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-semibold mb-3">Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Name" value={filters.name} onChange={e=>setFilters(f=>({...f, name: e.target.value}))} />
              <input className="border p-2 rounded" placeholder="Address" value={filters.address} onChange={e=>setFilters(f=>({...f, address: e.target.value}))} />
            </div>
          </div>
          {loading ? (
            <div className="bg-white p-4 rounded shadow">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stores.map(s => <StoreCard key={s.id} store={s} onUpdated={()=>{
                // refresh after rating change
                setFilters(f => ({ ...f }))
              }} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}