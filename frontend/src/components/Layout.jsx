export function Layout({ children }) {
  return (
    <div className="h-screen bg-background text-foreground grid grid-cols-[280px_1fr] grid-rows-1 overflow-hidden">
      {children}
    </div>
  )
}

export function Sidebar({ children }) {
  return (
    <div className="border-r border-border bg-card">
      <div className="h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

