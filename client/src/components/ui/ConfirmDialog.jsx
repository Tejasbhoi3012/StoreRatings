import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Dialog from './Dialog'
import Button from './Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  destructive = true,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {destructive && (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-error-bg flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-error" />
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </Dialog>
  )
}
