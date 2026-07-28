import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const VARIANTS = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-border',
  outline: 'bg-transparent text-foreground border border-border hover:bg-surface-hover',
  ghost: 'bg-transparent text-foreground hover:bg-surface-hover',
  danger: 'bg-error text-white hover:brightness-110 shadow-sm',
  'danger-outline': 'bg-transparent text-error border border-error/30 hover:bg-error-bg',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9',
}

export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const As = as
  return (
    <As
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-150 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </As>
  )
}
