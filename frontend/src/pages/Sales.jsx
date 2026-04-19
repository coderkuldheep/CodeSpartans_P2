import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'manager_name', label: 'Manager' },
  { key: 'rate', label: 'Rate' },
  { key: 'quantity', label: 'Qty' },
  { key: 'order_date', label: 'Order Date' },
]

export default function Sales() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { data: sales = [], loading, create, update, del } = useApi('sales/')
  const { data: products = [] } = useApi('products/')

  const filteredData = sales.filter((sale) =>
    (sale.manager_name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(sale.rate || '').includes(search)
  )

  const handleEdit = (sale) => {
    setSelected(sale)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (sale) => {
    if (confirm('Delete this sale?')) {
      del(sale.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    data.rate = parseFloat(data.rate) || 0
    data.quantity = parseInt(data.quantity) || 0
    data.product = parseInt(data.product) || null

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
      console.error('Sales save failed:', error)
      alert('Failed to save sale')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sales..."
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
        title={editMode ? 'Edit Sale' : 'Add Sale'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Manager Name</label>
            <input
              name="manager_name"
              defaultValue={selected?.manager_name || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <select
              name="product"
              defaultValue={selected?.product?.id || selected?.product || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.size}, {product.quality})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rate</label>
              <input
                name="rate"
                type="number"
                defaultValue={selected?.rate || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                name="quantity"
                type="number"
                defaultValue={selected?.quantity || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order Date</label>
              <input
                name="order_date"
                type="date"
                defaultValue={selected?.order_date || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dispatch Date</label>
              <input
                name="dispatch_date"
                type="date"
                defaultValue={selected?.dispatch_date || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <input
              name="size"
              defaultValue={selected?.size || ''}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <input
              name="quality"
              defaultValue={selected?.quality || ''}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>
        </div>
      </FormModal>
    </div>
  )
}