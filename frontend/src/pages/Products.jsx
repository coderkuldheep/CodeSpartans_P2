import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
  { key: 'quality', label: 'Quality' },
]

export default function Products() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { role } = useAuth()
  const canManage = role === 'admin'

  const { data: products = [], loading, create, update, del } = useApi('products/')

  const filteredData = products.filter((product) =>
    (product.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (product.size || '').toLowerCase().includes(search.toLowerCase()) ||
    (product.quality || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (item) => {
    setSelected(item)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (item) => {
    if (confirm('Delete this product?')) {
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
      console.error('Product save failed:', err)
      alert('Failed to save product')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>

        {canManage ? (
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        ) : (
          <div className="text-destructive">Only admin can manage products</div>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background"
          />
        </div>

        <Button variant="outline" size="sm">
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
        title={editMode ? 'Edit Product' : 'Add Product'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <input
            name="name"
            defaultValue={selected?.name || ''}
            placeholder="Product Name"
            required
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            name="size"
            defaultValue={selected?.size || ''}
            placeholder="Size"
            required
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            name="quality"
            defaultValue={selected?.quality || ''}
            placeholder="Quality"
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </FormModal>
    </div>
  )
}