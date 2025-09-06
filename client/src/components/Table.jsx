import React, { useMemo, useState } from 'react'

export default function Table({ columns, data }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const sorted = useMemo(() => {
    if (!sort.key) return data
    const col = columns.find(c => c.key === sort.key)
    const accessor = col?.sortAccessor || ((row) => row[sort.key])
    const copy = [...data]
    copy.sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      if (va == null && vb == null) return 0
      if (va == null) return sort.dir === 'asc' ? -1 : 1
      if (vb == null) return sort.dir === 'asc' ? 1 : -1
      if (typeof va === 'number' && typeof vb === 'number') {
        return sort.dir === 'asc' ? va - vb : vb - va
      }
      return sort.dir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return copy
  }, [data, sort, columns])

  function toggleSort(key) {
    setSort(prev => {
      if (prev.key !== key) return { key, dir: 'asc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left p-4 font-bold text-gray-700 uppercase text-xs tracking-wider select-none cursor-pointer"
                onClick={() => toggleSort(col.key)}
                title="Click to sort"
              >
                <span className="inline-flex items-center gap-1">
                  {col.title}
                  {sort.key === col.key && (
                    <span>{sort.dir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map(col => (
                <td key={col.key} className="p-4 text-gray-700 text-sm">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg font-medium">No data available</p>
        </div>
      )}
    </div>
  )
}