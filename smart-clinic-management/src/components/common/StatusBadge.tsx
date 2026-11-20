import React from 'react'
import { formatStatus } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case 'completed':
      case 'available':
      case 'delivered':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'in_consultation':
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'checked_in':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'pending':
      case 'scheduled':
      case 'upcoming':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'due_today':
        return 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
      case 'cancelled':
      case 'overdue':
      case 'failed':
      case 'unavailable':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'no_show':
      case 'on_leave':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors(
        status
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {formatStatus(status)}
    </span>
  )
}
