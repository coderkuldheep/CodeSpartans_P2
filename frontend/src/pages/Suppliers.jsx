import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
]

export default function Suppliers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { data: suppliers, loading, create, update, del } = useApi('suppliers/')

  const filteredData = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.contact.includes(search)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    if (editMode) {
      update({ ...data, id: selected.id })
    } else {
      create(data)
    }

    setIsOpen(false)
    setSelected(null)
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={filteredData}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
            <label className="block text-sm font-medium mb-2">Name</label>
            <input name="name" defaultValue={selected?.name || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact</label>
            <input name="contact" defaultValue={selected?.contact || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea name="address" rows="3" defaultValue={selected?.address || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>
      </FormModal>
    </div>
  )
}

