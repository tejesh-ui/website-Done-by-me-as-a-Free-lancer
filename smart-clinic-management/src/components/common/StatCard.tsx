import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  trend?: string
  color?: 'blue' | 'teal' | 'green' | 'yellow' | 'red' | 'purple'
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = 'blue'
}: StatCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-700',
      border: 'hover:border-blue-200'
    },
    teal: {
      bg: 'bg-teal-50 text-teal-700',
      border: 'hover:border-teal-200'
    },
    green: {
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'hover:border-emerald-200'
    },
    yellow: {
      bg: 'bg-amber-50 text-amber-700',
      border: 'hover:border-amber-200'
    },
    red: {
      bg: 'bg-rose-50 text-rose-700',
      border: 'hover:border-rose-200'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700',
      border: 'hover:border-purple-200'
    }
  }

  const activeColor = colorMap[color] || colorMap.blue

  return (
    <div
      className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md ${activeColor.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${activeColor.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
    </div>
  )
}
