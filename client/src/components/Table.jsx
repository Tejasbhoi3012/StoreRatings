import React, { useMemo, useState } from 'react'
import { ArrowUp, ArrowDown, ChevronsUpDown, Inbox } from 'lucide-react'
import { cn } from '../lib/cn'
import EmptyState from './ui/EmptyState'
import Skeleton from './ui/Skeleton'

export default function Table({ columns, data, loading = false, emptyTitle = 'No data available', emptyDescription }) {
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

  function toggleSort(key, sortable) {
    if (sortable === false) return
    setSort(prev => {
      if (prev.key !== key) return { key, dir: 'asc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              {columns.map(col => {
                const sortable = col.sortable !== false
                return (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key, col.sortable)}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground select-none whitespace-nowrap',
                      sortable && 'cursor-pointer hover:text-foreground transition-colors'
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.title}
                      {sortable && (
                        sort.key === col.key
                          ? (sort.dir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)
                          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full max-w-[10rem]" />
                  </td>
                ))}
              </tr>
            ))}
            {!loading && sorted.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-surface-hover transition-colors duration-100">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3.5 text-sm text-foreground whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (
        <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  )
}
