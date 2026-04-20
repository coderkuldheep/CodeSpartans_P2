import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Qty' },
  { key: 'size', label: 'Size' },
  { key: 'quality', label: 'Quality' },
  { key: 'requested_date', label: 'Requested' },
  { key: 'proposed_date', label: 'Proposed' },
  { key: 'actual_date', label: 'Completed' },
]

export default function Production() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'production'

  const { data: production = [], loading, create, update, del } = useApi('production/')

  const filteredData = production.filter((item) =>
    (item.product?.toString() || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.size || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.quality || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (item) => {
    setSelected(item)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (item) => {
    if (confirm('Delete this record?')) {
      del(item.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      if (editMode) {
        await update({ ...data, id: selected.id })
      } else {
        await create(data)
      }

      setIsOpen(false)
      setSelected(null)
      setEditMode(false)
    } catch (err) {
      console.error('Production save failed:', err)
      alert('Failed to save')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Production</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage production requests and track completion.
          </p>
        </div>

        {canManage ? (
          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Production
          </Button>
        ) : (
          <div className="text-destructive text-sm">Access restricted</div>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search production..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={filteredData}
        loading={loading}
        onEdit={canManage ? handleEdit : () => {}}
        onDelete={canManage ? handleDelete : () => {}}
      />

      {/* Modal */}
      <FormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelected(null)
          setEditMode(false)
        }}
        title={editMode ? 'Edit Production' : 'Add Production'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <input name="product" defaultValue={selected?.product || ''} placeholder="Product ID" required className="w-full px-3 py-2 border rounded-lg" />
          <input name="quantity" defaultValue={selected?.quantity || ''} placeholder="Quantity" required className="w-full px-3 py-2 border rounded-lg" />
          <input name="size" defaultValue={selected?.size || ''} placeholder="Size" required className="w-full px-3 py-2 border rounded-lg" />
          <input name="quality" defaultValue={selected?.quality || ''} placeholder="Quality" required className="w-full px-3 py-2 border rounded-lg" />

          <input type="date" name="requested_date" defaultValue={selected?.requested_date || ''} required className="w-full px-3 py-2 border rounded-lg" />
          <input type="date" name="proposed_date" defaultValue={selected?.proposed_date || ''} className="w-full px-3 py-2 border rounded-lg" />
          <input type="date" name="actual_date" defaultValue={selected?.actual_date || ''} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </FormModal>
    </div>
  )
}