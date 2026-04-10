// Simple table component for CRUD pages
export function DataTable({ columns, data, loading, onEdit, onDelete }) {
  return (
    <div className="w-full">
      <div className="rounded-md border bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Data Table</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.map((column) => (
                    <th key={column.key} className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                      {column.label}
                    </th>
                  ))}
                  <th className="h-12 px-4 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="h-24 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="h-24 text-center">
                      No data
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row.id || index} className="border-b transition-colors hover:bg-muted/50">
                      {columns.map((column) => (
                        <td key={column.key} className="p-4 text-sm">
                          {row[column.key]}
                        </td>
                      ))}
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => onEdit(row)} className="text-primary hover:text-primary/80">
                          Edit
                        </button>
                        <button onClick={() => onDelete(row)} className="text-destructive hover:text-destructive/80">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

