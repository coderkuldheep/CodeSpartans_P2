import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/table.jsx'
import { FormModal } from '../components/ui/form-modal.jsx'
import { Button } from '../components/ui/button.jsx'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Product Name' },
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

  const {
    data: products = [],
    loading,
    create,
    update,
    del
  } = useApi('products/')

  const filteredData = products.filter((product) =>
    (product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (product?.size || '').toLowerCase().includes(search.toLowerCase()) ||
    (product?.quality || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (product) => {
    setSelected(product)
    setEditMode(true)
    setIsOpen(true)
  }

  const handleDelete = async (product) => {
    if (!canManage) return

    if (confirm('Delete this product?')) {
      try {
        await del(product.id)
      } catch (error) {
        console.error('Delete product failed:', error)
        alert('Failed to delete product')
      }
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
      console.error('Product save failed:', error)
      alert('Failed to save product')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View and manage the shared product catalog.
          </p>
        </div>

        {canManage ? (
          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            Only admin can add, edit, or delete products
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
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

      <DataTable
        columns={COLUMNS}
        data={filteredData}
        loading={loading}
        onEdit={canManage ? handleEdit : () => {}}
        onDelete={canManage ? handleDelete : () => {}}
      />

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelected(null)
          setEditMode(false)
        }}
        title={editMode ? 'Edit Product' : 'Add Product'}
        onSubmit={handleSubmit}
        loading={editMode ? update?.updateLoading : create?.createLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              name="name"
              defaultValue={selected?.name || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <input
              name="size"
              defaultValue={selected?.size || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <input
              name="quality"
              defaultValue={selected?.quality || ''}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background"
            />
          </div>
        </div>
      </FormModal>
    </div>
  )
}