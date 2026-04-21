export const ROLES = {
  ADMIN: 'admin',
  PURCHASE: 'purchase',
  SALES: 'sales',
  PRODUCTION: 'production'
}

export const NAV_CONFIG = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Suppliers', href: '/suppliers', icon: 'Users' },
    { name: 'Purchases', href: '/purchases', icon: 'ShoppingCart' },
    { name: 'Sales', href: '/sales', icon: 'DollarSign' },
    { name: 'Production', href: '/production', icon: 'Factory' },
  ],
  purchase: [
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Suppliers', href: '/suppliers', icon: 'Users' },
    { name: 'Purchases', href: '/purchases', icon: 'ShoppingCart' },
  ],
  sales: [
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Sales', href: '/sales', icon: 'DollarSign' },
  ],
  production: [
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Production', href: '/production', icon: 'Factory' },
  ]
}

export const DEFAULT_ROUTE_BY_ROLE = {
  admin: '/dashboard',
  purchase: '/purchases',
  sales: '/sales',
  production: '/production',
}