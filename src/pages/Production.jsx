import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Qty' },
  { key: 'requested_date', label: 'Requested' },
  { key: 'actual_date', label: 'Actual Date' },
  { key: 'status', label: 'Status' },
]

export default function Production() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { data: production, loading, create, update, del } = useApi('production/')
  const { data: products } = useApi('products/')

  const filteredData = production.filter(item => 
    (item.product?.name || item.product || '').toString().toLowerCase().includes(search.toLowerCase()) ||
    item.quantity?.toString().includes(search)
  ).map(item => ({
    ...item,
    status: item.actual_date ? 'Completed' : 'Pending'
  }))

  const handleEdit = (item) => {
    setSelected(item)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (item) => {
    if (confirm('Delete this production record?')) {
      del(item.id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    data.quantity = parseInt(data.quantity) || 0
    data.product = parseInt(data.product) || null

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
        <h1 className="text-3xl font-bold tracking-tight">Production</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Production
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search production..."
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
        title={editMode ? 'Edit Production' : 'Add Production'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <select name="product" defaultValue={selected?.product?.id || selected?.product || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background">
              <option value="">Select product</option>
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.size}, {product.quality})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input name="quantity" type="number" defaultValue={selected?.quantity || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <input name="size" defaultValue={selected?.size || ''} className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <input name="quality" defaultValue={selected?.quality || ''} className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Requested Date</label>
              <input name="requested_date" type="date" defaultValue={selected?.requested_date || ''} required className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Proposed Date</label>
              <input name="proposed_date" type="date" defaultValue={selected?.proposed_date || ''} className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Actual Date</label>
              <input name="actual_date" type="date" defaultValue={selected?.actual_date || ''} className="w-full px-3 py-2 border border-input rounded-lg bg-background" />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}

