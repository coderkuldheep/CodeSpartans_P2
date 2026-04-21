import { useState } from 'react'
import { Outlet, useLocation, Navigate, Link } from 'react-router-dom'
import {
  Home,
  Users,
  ShoppingCart,
  DollarSign,
  Factory,
  LogOut,
  Menu,
  X,
  Package
} from 'lucide-react'
import { Layout, Sidebar } from './components/Layout.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import { NAV_CONFIG, DEFAULT_ROUTE_BY_ROLE } from './constants/roles.js'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RolePageGuard({ children }) {
  const { role } = useAuth()
  const location = useLocation()

  const allowedPaths = (NAV_CONFIG[role] || []).map((item) => item.href)

  if (!allowedPaths.includes(location.pathname)) {
    return <Navigate to={DEFAULT_ROUTE_BY_ROLE[role] || '/login'} replace />
  }

  return children
}

function NavLink({ name, href, icon, onClick }) {
  const Icon = {
    LayoutDashboard: Home,
    Users: Users,
    ShoppingCart: ShoppingCart,
    DollarSign: DollarSign,
    Factory: Factory,
    Package: Package,
  }[icon] || Home

  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
        }`}
      />
      <span className="font-medium">{name}</span>
    </Link>
  )
}

export default function App() {
  const { isAuthenticated, role, logout, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Outlet />
  }

  const navItems = NAV_CONFIG[role] || []

  return (
    <ProtectedRoute>
      <RolePageGuard>
        <Layout>
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h1 className="text-base font-bold text-slate-900">Inventory ERP</h1>
              <p className="text-xs text-slate-500 capitalize">{role} Panel</p>
            </div>

            <div className="w-9" />
          </div>

          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
            <div className="h-full flex flex-col bg-white">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Inventory ERP</h2>
                    <p className="text-sm text-slate-500">Company Control Panel</p>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md">
                <p className="text-xs uppercase tracking-wide text-blue-100">Signed in as</p>
                <h3 className="mt-1 text-lg font-semibold">{user || 'User'}</h3>
                <p className="text-sm text-blue-100 capitalize">{role}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Navigation
                </p>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-200 p-4">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </Sidebar>

          <main className="min-h-screen overflow-auto bg-slate-50">
            <div className="hidden lg:flex items-center justify-between border-b bg-white px-8 py-5 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Inventory Management System</h1>
                <p className="text-sm text-slate-500 capitalize">{role} Workspace</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Current page: <span className="font-semibold text-slate-900">{location.pathname}</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </Layout>
      </RolePageGuard>
    </ProtectedRoute>
  )
}