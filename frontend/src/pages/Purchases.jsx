import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'supplier_name', label: 'Supplier' },
  { key: 'total_rate', label: 'Total Rate' },
  { key: 'balance_amount', label: 'Balance' },
  { key: 'date_received', label: 'Date' },
]

export default function Purchases() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { role } = useAuth()
  const canAdd = role === 'admin' || role === 'purchase'

  const { data: purchases = [], loading, create, update, del } = useApi('purchases/')
  const { data: suppliers = [] } = useApi('suppliers/')
  const { data: products = [] } = useApi('products/')

  const filteredData = purchases.filter((purchase) =>
    (purchase.supplier_name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(purchase.total_rate || '').includes(search)
  )

  const handleEdit = (purchase) => {
    setSelected(purchase)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = (purchase) => {
    if (confirm('Delete this purchase?')) {
      del(purchase.id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    data.supplier = parseInt(data.supplier)
    data.product = parseInt(data.product)
    data.total_rate = parseFloat(data.total_rate) || 0
    data.advance_amount = parseFloat(data.advance_amount) || 0
    data.total_quantity = parseInt(data.total_quantity) || 0

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
        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>

        {canAdd ? (
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Purchase
          </Button>
        ) : (
          <div className="text-destructive">Add restricted to authorized users</div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search purchases..."
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
        title={editMode ? 'Edit Purchase' : 'Add Purchase'}
        onSubmit={handleSubmit}
        loading={editMode ? update.updateLoading : create.createLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Supplier</label>
            <select
              name="supplier"
              defaultValue={selected?.supplier || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <select
              name="product"
              defaultValue={selected?.product || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.size} - {product.quality}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Rate</label>
              <input
                name="total_rate"
                type="number"
                defaultValue={selected?.total_rate || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                name="total_quantity"
                type="number"
                defaultValue={selected?.total_quantity || ''}
                required
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Advance Amount</label>
            <input
              name="advance_amount"
              type="number"
              defaultValue={selected?.advance_amount || ''}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date Received</label>
            <input
              name="date_received"
              type="date"
              defaultValue={selected?.date_received || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>
        </div>
      </FormModal>
    </div>
  )
}