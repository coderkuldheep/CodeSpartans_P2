import { useMemo } from 'react'
import { Package, ShoppingCart, DollarSign, Factory } from 'lucide-react'
import { useApi } from '../hooks/useApi.js'
import { StatsCard } from '../components/ui/stats-card.jsx'

export default function Dashboard() {
  const { data: dashboardData = {}, loading } = useApi('dashboard/')
  const { data: sales = [] } = useApi('sales/')
  const { data: purchases = [] } = useApi('purchases/')
  const { data: production = [] } = useApi('production/')

  const recentSales = useMemo(() => sales.slice(0, 5), [sales])
  const recentPurchases = useMemo(() => purchases.slice(0, 5), [purchases])
  const recentProduction = useMemo(() => production.slice(0, 5), [production])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Loading dashboard data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Overview of purchases, sales, products, and production activity.
          </p>
        </div>

        <div className="rounded-xl border bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          Company Operations Summary
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatsCard
          title="Purchase Today"
          value={dashboardData.purchase_today || 0}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Sales Today"
          value={dashboardData.sales_today || 0}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Products"
          value={dashboardData.total_products || 0}
          icon={Package}
        />
        <StatsCard
          title="Production Pending"
          value={dashboardData.production_pending || 0}
          icon={Factory}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatsCard
          title="Total Purchases"
          value={dashboardData.purchase_count || 0}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Sales"
          value={dashboardData.sales_count || 0}
          icon={DollarSign}
        />
        <StatsCard
          title="Production Total"
          value={dashboardData.production_total || 0}
          icon={Factory}
        />
        <StatsCard
          title="Production Completed"
          value={dashboardData.production_completed || 0}
          icon={Factory}
        />
      </div>

      {/* Responsive info cards */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Sales */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold">Recent Sales</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Latest sales activity
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales found.</p>
            ) : (
              <div className="space-y-3">
                {recentSales.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.manager_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p className="font-semibold">₹ {item.rate}</p>
                      <p className="text-muted-foreground">{item.order_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Purchases */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold">Recent Purchases</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Latest purchase entries
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {recentPurchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No purchases found.</p>
            ) : (
              <div className="space-y-3">
                {recentPurchases.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {item.supplier_name || `Supplier #${item.supplier}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.total_quantity}
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p className="font-semibold">₹ {item.total_rate}</p>
                      <p className="text-muted-foreground">{item.date_received}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Production Status */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold">Production Status</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Recent production requests
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {recentProduction.length === 0 ? (
              <p className="text-sm text-muted-foreground">No production records found.</p>
            ) : (
              <div className="space-y-3">
                {recentProduction.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        Product #{item.product}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm sm:text-right">
                      <p
                        className={`font-semibold ${
                          item.actual_date ? 'text-green-600' : 'text-amber-600'
                        }`}
                      >
                        {item.actual_date ? 'Completed' : 'Pending'}
                      </p>
                      <p className="text-muted-foreground">
                        {item.requested_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}