import React from 'react'
import { cn } from '../../lib/cn'

const COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500',
]

function colorFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Avatar({ name = '?', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('')

  const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' }

  return (
    <div
      className={cn(
        'flex-shrink-0 inline-flex items-center justify-center rounded-full font-semibold text-white',
        colorFor(name),
        sizes[size],
        className
      )}
    >
      {initials || '?'}
    </div>
  )
}
