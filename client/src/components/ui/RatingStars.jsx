import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-6 w-6' }

/** Read-only star display for an average rating (supports partial fill). */
export function StarRating({ value = 0, size = 'md', showValue = true, className = '' }) {
  const rounded = Math.round((value || 0) * 2) / 2

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = rounded >= n
          const half = !filled && rounded >= n - 0.5
          return (
            <span key={n} className="relative inline-flex">
              <Star className={cn(SIZES[size], 'text-border-strong')} fill="currentColor" />
              {(filled || half) && (
                <Star
                  className={cn(SIZES[size], 'text-warning absolute inset-0')}
                  fill="currentColor"
                  style={half ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {value ? value.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  )
}

/** Interactive star picker used to submit/update a rating. */
export function StarPicker({ value, onChange, size = 'lg', disabled = false }) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          className="disabled:cursor-not-allowed rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={cn(SIZES[size], display >= n ? 'text-warning' : 'text-border-strong', 'transition-colors')}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  )
}
