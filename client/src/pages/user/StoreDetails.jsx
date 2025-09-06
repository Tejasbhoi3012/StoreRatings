import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStore, submitRating, updateRating } from '../../services/api'
import Navbar from '../../components/Navbar'

export default function StoreDetails() {
  const { id } = useParams()
  const [store, setStore] = useState(null)
  const [rating, setRating] = useState(5)
  const [userRating, setUserRating] = useState(null)

  useEffect(() => {
    async function fetch() {
      const res = await getStore(id)
      setStore(res.data)
      // assume response includes user's rating if exists
      setUserRating(res.data.userRating || null)
    }
    fetch()
  }, [id])

  async function handleSubmit() {
    try {
      if (userRating) {
        await updateRating(id, userRating.id, { value: rating })
      } else {
        await submitRating(id, { value: rating })
      }
      // refresh
      const res = await getStore(id)
      setStore(res.data)
      setUserRating(res.data.userRating || null)
    } catch (err) {
      // handle
    }
  }

  if (!store) return <div>Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl mb-2">{store.name}</h1>
        <p className="mb-4">{store.address}</p>
        <div className="mb-4">Average: {store.averageRating || 0}</div>

        <div className="max-w-sm bg-white p-4 rounded shadow">
          <label className="block mb-2">Your rating</label>
          <select className="border p-2 w-full" value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>Submit</button>
        </div>
      </main>
    </div>
  )
}