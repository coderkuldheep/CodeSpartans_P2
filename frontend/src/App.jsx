import { useEffect } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'
import { Home, Users, ShoppingCart, DollarSign, Factory } from 'lucide-react'
import { Layout, Sidebar } from './components/Layout.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import { NAV_CONFIG } from './constants/roles.js'

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, role } = useAuth()
  const navigation = useNavigation()

  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }

  if (roles.length && !roles.includes(role)) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  return children
}

function NavLink({ name, href, icon }) {
  const Icon = {
    LayoutDashboard: Home,
    Users: Users,
    ShoppingCart: ShoppingCart,
    DollarSign: DollarSign,
    Factory: Factory
  }[icon] || Home
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{name}</span>
    </a>
  )
}

export default function App() {
  const { isAuthenticated, role, logout } = useAuth()

  if (!isAuthenticated) {
    return <Outlet />
  }

  const navItems = NAV_CONFIG[role] || []

  return (
    <ProtectedRoute>
      <Layout>
        <Sidebar>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Inventory System</h2>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
            <div className="mt-auto p-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 text-destructive hover:text-destructive/80 p-2 rounded-lg"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Sidebar>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </Layout>
    </ProtectedRoute>
  )
}

