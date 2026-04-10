import { cn } from "../../lib/utils.js"
import { forwardRef } from "react"

const Button = forwardRef(({ className, children, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2",
    ghost: "hover:bg-gray-100 h-10 px-4 py-2",
  }
  const sizes = {
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  }

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  )

  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }

