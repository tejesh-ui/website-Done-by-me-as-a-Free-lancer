import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Menu, Search, Bell, User as UserIcon, Calendar,
  Shield, CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  // Current formatted date in DD-MM-YYYY as requested
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    if (user?.role === 'receptionist') {
      navigate(`/receptionist/patients?search=${encodeURIComponent(searchQuery)}`)
    } else if (user?.role === 'doctor') {
      navigate(`/doctor/patients?search=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate(`/admin/patients?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    receptionist: 'bg-teal-100 text-teal-800 border-teal-200',
    doctor: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient by Name, ID, Mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
          />
        </form>
      </div>

      {/* Right: Date, Notifications, Profile & Role Badge */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Current Date in DD-MM-YYYY */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-blue-700" />
          <span className="font-semibold text-gray-700">{formattedDate}</span>
          <span className="text-gray-400">|</span>
          <span className="text-teal-700 font-medium">Asia/Kolkata</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Clinic Alerts</span>
                <span className="text-xs text-teal-700 font-medium">3 New</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-800">Patient Ravi Kumar (PT0001)</p>
                      <p className="text-[11px] text-gray-500">Checked in for Dr. Rajesh Sharma</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-800">Follow-up Due Today</p>
                      <p className="text-[11px] text-gray-500">Ravi Kumar (2 Months interval)</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-800">1 Overdue Follow-up</p>
                      <p className="text-[11px] text-gray-500">Ananya Sengupta (PT0002)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Indicator */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {user?.full_name || 'Guest User'}
            </p>
            <span
              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                roleColors[user?.role || 'admin']
              }`}
            >
              {user?.role || 'admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
