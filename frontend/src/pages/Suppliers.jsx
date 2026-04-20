import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Supplier Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
]

export default function Suppliers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'purchase'

  const { data: suppliers = [], loading, create, update, del } = useApi('suppliers/')

  const filteredData = suppliers.filter((supplier) =>
    (supplier.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (supplier.contact || '').toLowerCase().includes(search.toLowerCase()) ||
    (supplier.address || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (supplier) => {
    setSelected(supplier)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (supplier) => {
    if (confirm('Delete this supplier?')) {
      del(supplier.id)
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
    } catch (error) {
      console.error('Supplier save failed:', error)
      alert('Failed to save supplier')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your supplier directory and contact details.
          </p>
        </div>

        {canManage ? (
          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        ) : (
          <div className="text-destructive text-sm">Add restricted to authorized users</div>
        )}
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suppliers..."
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
        title={editMode ? 'Edit Supplier' : 'Add Supplier'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Supplier Name</label>
            <input
              name="name"
              defaultValue={selected?.name || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact</label>
            <input
              name="contact"
              defaultValue={selected?.contact || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              name="address"
              defaultValue={selected?.address || ''}
              rows="4"
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      </FormModal>
    </div>
  )
}