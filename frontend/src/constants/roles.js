export const ROLES = {
  ADMIN: 'admin',
  PURCHASE: 'purchase',
  SALES: 'sales',
  PRODUCTION: 'production'
}

export const NAV_CONFIG = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Suppliers', href: '/suppliers', icon: 'Users' },
    { name: 'Purchases', href: '/purchases', icon: 'ShoppingCart' },
    { name: 'Sales', href: '/sales', icon: 'DollarSign' },
    { name: 'Production', href: '/production', icon: 'Factory' },
  ],
  purchase: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Suppliers', href: '/suppliers', icon: 'Users' },
    { name: 'Purchases', href: '/purchases', icon: 'ShoppingCart' },
  ],
  sales: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Sales', href: '/sales', icon: 'DollarSign' },
    { name: 'Production', href: '/production', icon: 'Factory' },
  ],
  production: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Production', href: '/production', icon: 'Factory' },
  ]
}

