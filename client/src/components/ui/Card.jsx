import React from 'react'
import { cn } from '../../lib/cn'

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={cn('px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-x-3 gap-y-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={cn('text-sm font-semibold text-foreground tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={cn('text-sm text-muted-foreground mt-0.5', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
