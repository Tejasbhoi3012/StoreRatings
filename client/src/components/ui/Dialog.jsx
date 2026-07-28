import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function Dialog({ open, onClose, title, description, children, footer, className = '' }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        className={cn(
          'relative w-full max-w-md rounded-xl border border-border bg-surface shadow-xl animate-scale-in',
          className
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                {title && (
                  <h2 id="dialog-title" className="text-base font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="flex-shrink-0 text-muted-foreground hover:text-foreground rounded-md p-1 hover:bg-surface-hover transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
