import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, differenceInYears, addWeeks, addMonths } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'dd-MM-yyyy')
  } catch { return '-' }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'dd-MM-yyyy HH:mm')
  } catch { return '-' }
}

export function calculateAge(dob: string | null | undefined): number {
  if (!dob) return 0
  try {
    return differenceInYears(new Date(), parseISO(dob))
  } catch { return 0 }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateFollowupDate(fromDate: Date, interval: string): Date {
  switch (interval) {
    case '1_week': return addWeeks(fromDate, 1)
    case '2_weeks': return addWeeks(fromDate, 2)
    case '1_month': return addMonths(fromDate, 1)
    case '2_months': return addMonths(fromDate, 2)
    case '3_months': return addMonths(fromDate, 3)
    case '6_months': return addMonths(fromDate, 6)
    default: return addMonths(fromDate, 1)
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-teal-100 text-teal-800',
    in_consultation: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
    upcoming: 'bg-blue-100 text-blue-800',
    due_today: 'bg-orange-100 text-orange-800',
    overdue: 'bg-red-100 text-red-800',
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
    on_leave: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sent: 'bg-teal-100 text-teal-800',
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
