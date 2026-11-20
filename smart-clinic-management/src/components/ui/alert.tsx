import * as React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

const alertStyles: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
  default: {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: <Info className="h-4 w-4 text-gray-500" />,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="h-4 w-4 text-blue-500" />,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
  },
}

function Alert({ className, variant = 'default', title, children, ...props }: AlertProps) {
  const style = alertStyles[variant]
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4 flex gap-3',
        style.container,
        className
      )}
      {...props}
    >
      <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm', className)} {...props} />
}

export { Alert, AlertDescription }
