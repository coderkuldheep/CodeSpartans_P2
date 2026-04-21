export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[290px_1fr]">
      {children}
    </div>
  )
}

export function Sidebar({ children, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Desktop sidebar only */}
      <aside className="hidden lg:block border-r border-slate-200 bg-white shadow-sm">
        <div className="h-screen sticky top-0">
          {children}
        </div>
      </aside>

      {/* Mobile dark overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  )
}