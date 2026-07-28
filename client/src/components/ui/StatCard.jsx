import React from 'react'
import { cn } from '../../lib/cn'

export default function StatCard({ icon: Icon, label, value, accent = 'primary', className = '' }) {
  const accentClasses = {
    primary: 'bg-accent text-accent-foreground',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
  }

  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', accentClasses[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mt-3 tracking-tight tabular-nums">{value}</p>
    </div>
  )
}
