import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' |
  'pending' | 'confirmed' | 'completed' | 'cancelled' | 'upcoming' | 'overdue' | 'due_today'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  outline: 'bg-transparent border-gray-300 text-gray-700',
  destructive: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  due_today: 'bg-orange-100 text-orange-800 border-orange-200',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, type BadgeVariant }
