import React from 'react'
import { cn } from '../../lib/cn'

const VARIANTS = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  error: 'bg-error-bg text-error',
  outline: 'bg-transparent text-foreground border border-border',
}

export default function Badge({ variant = 'default', className = '', children, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
