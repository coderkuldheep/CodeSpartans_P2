import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { LayoutDashboard, ShoppingCart, Package, Factory, DollarSign } from 'lucide-react'
import api from '../api.js'
import { StatsCard } from '../components/ui/stats-card.jsx'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/').then(res => res.data),
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: () => api.get('/sales-chart/').then(res => res.data),
  })

  const cards = [
    {
      title: 'Sales Today',
      value: stats?.sales_today || 0,
      change: '+12.5',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Purchases Today',
      value: stats?.purchase_today || 0,
      change: '+8.2',
      icon: Package,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Production Pending',
      value: stats?.production_pending || 0,
      change: stats?.production_pending > 0 ? '-3.1' : '+1.2',
      icon: Factory,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Total Sales',
      value: stats?.sales_count || 0,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <StatsCard
            key={card.title}
            {...card}
            className="shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1"
          />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Sales Trend</h2>
        {chartLoading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData || []}>
              <XAxis dataKey="date_of_order" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total">
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

