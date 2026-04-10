export function StatsCard({ title, value, change, icon: Icon, className = '' }) {
  const changeColor = change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  
  return (
    <div className={`rounded-xl border bg-card p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium leading-none tracking-tight text-muted-foreground">
          {title}
        </h3>
        {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
      </div>
      <div className="flex items-baseline space-x-8">
        <span className="text-3xl font-bold tracking-tight">
          {value?.toLocaleString() || 0}
        </span>
        {change !== undefined && (
          <span className={`text-sm ${changeColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  )
}

