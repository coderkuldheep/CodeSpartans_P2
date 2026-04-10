import { useState } from 'react'
import { Button } from './button.jsx'
import { X } from 'lucide-react'

export function FormModal({ isOpen, onClose, title, children, onSubmit, loading, submitLabel = 'Save' }) {
  const [open, setOpen] = useState(isOpen)

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

