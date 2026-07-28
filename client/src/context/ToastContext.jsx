import React, { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-primary',
}

let idCounter = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter
    setToasts(prev => [...prev, { id, message, type }])
    if (duration) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm">
        {toasts.map(t => {
          const Icon = ICONS[t.type] || Info
          return (
            <div
              key={t.id}
              role="status"
              className="animate-slide-in-right flex items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-lg"
            >
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${STYLES[t.type] || STYLES.info}`} />
              <p className="flex-1 text-sm font-medium text-foreground">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
