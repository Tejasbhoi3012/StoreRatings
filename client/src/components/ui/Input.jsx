import React, { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Label = ({ className = '', children, ...props }) => (
  <label className={cn('block text-sm font-medium text-foreground mb-1.5', className)} {...props}>
    {children}
  </label>
)

export const Input = forwardRef(function Input({ className = '', error = false, icon, ...props }, ref) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full h-10 rounded-lg border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 outline-none',
          'focus:ring-2 focus:ring-ring focus:border-transparent',
          error ? 'border-error' : 'border-border hover:border-border-strong',
          icon ? 'pl-9' : '',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className = '', error = false, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 outline-none resize-none',
        'focus:ring-2 focus:ring-ring focus:border-transparent',
        error ? 'border-error' : 'border-border hover:border-border-strong',
        className
      )}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select({ className = '', error = false, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full h-10 rounded-lg border bg-surface px-3 text-sm text-foreground transition-colors duration-150 outline-none appearance-none',
        'bg-[right_0.75rem_center] bg-no-repeat pr-9',
        'focus:ring-2 focus:ring-ring focus:border-transparent',
        error ? 'border-error' : 'border-border hover:border-border-strong',
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
})

export function FormField({ label, error, children, hint }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {children}
      {error && <p className="text-error text-xs mt-1.5 font-medium">{error}</p>}
      {!error && hint && <p className="text-muted-foreground text-xs mt-1.5">{hint}</p>}
    </div>
  )
}
