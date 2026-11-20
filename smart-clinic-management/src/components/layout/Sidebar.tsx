import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard, Users, Calendar, Stethoscope, FileText,
  ClipboardList, Bell, BarChart3, Settings, LogOut, Heart,
  UserCog, CalendarCheck, Clock, ChevronLeft, ChevronRight,
  X
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Patients', icon: Users, path: '/admin/patients' },
  { label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
  { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
  { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
  { label: 'User Management', icon: UserCog, path: '/admin/users' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

const receptionistNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/receptionist/dashboard' },
  { label: 'Register Patient', icon: Users, path: '/receptionist/register' },
  { label: 'Patient Search', icon: Users, path: '/receptionist/patients' },
  { label: 'Appointments', icon: Calendar, path: '/receptionist/appointments' },
  { label: 'Book Appointment', icon: CalendarCheck, path: '/receptionist/book-appointment' },
  { label: 'Check-In', icon: CalendarCheck, path: '/receptionist/check-in' },
  { label: 'Follow-ups', icon: Clock, path: '/receptionist/follow-ups' },
  { label: 'Reminders', icon: Bell, path: '/receptionist/reminders' },
]

const doctorNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
  { label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
  { label: 'Patients', icon: Users, path: '/doctor/patients' },
  { label: 'Consultations', icon: Stethoscope, path: '/doctor/consultations' },
  { label: 'Prescriptions', icon: FileText, path: '/doctor/prescriptions' },
  { label: 'Follow-ups', icon: Clock, path: '/doctor/follow-ups' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ isOpen, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems: NavItem[] = (() => {
    if (!user) return []
    switch (user.role) {
      case 'admin': return adminNav
      case 'receptionist': return receptionistNav
      case 'doctor': return doctorNav
      default: return []
    }
  })()

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    receptionist: 'Receptionist',
    doctor: 'Doctor',
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const sidebarContent = (
    <div
      className={`
        h-full flex flex-col transition-all duration-300
        bg-gradient-to-b from-[#1e2d5e] to-[#0f1729] text-white
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 rounded-lg p-1.5">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-tight">Smart Clinic</h1>
              <p className="text-[10px] text-blue-300">Management System</p>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="bg-teal-500 rounded-lg p-1.5 mx-auto">
            <Heart className="h-5 w-5 text-white" />
          </div>
        )}
        {/* Mobile close */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={!isOpen ? item.label : undefined}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-150 group
                ${active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className={`flex-shrink-0 h-5 w-5 ${active ? 'text-teal-400' : 'text-blue-300 group-hover:text-teal-400'}`} />
              {isOpen && <span>{item.label}</span>}
              {active && isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {isOpen && user && (
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                {user.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                <p className="text-xs text-blue-300">{roleLabel[user.role] || user.role}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={!isOpen ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="flex-shrink-0 h-5 w-5" />
          {isOpen && <span>Sign Out</span>}
        </button>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-xs text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isOpen ? (
            <><ChevronLeft className="h-4 w-4" /> <span>Collapse</span></>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative flex flex-col h-full w-64">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
