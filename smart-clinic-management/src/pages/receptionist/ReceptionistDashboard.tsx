import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, UserPlus, Calendar, Clock, CheckCircle2,
  AlertTriangle, Stethoscope, Search, CalendarCheck,
  Bell, ArrowRight, UserCheck
} from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { getAppointments, updateAppointmentStatus } from '@/services/appointments'
import { getDoctors } from '@/services/doctors'
import { getFollowups } from '@/services/followups'
import { Doctor } from '@/types'

export function ReceptionistDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [dueFollowups, setDueFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [apts, docs, fls] = await Promise.all([
        getAppointments({ date: todayStr }),
        getDoctors(),
        getFollowups({ status: 'due_today' })
      ])
      setTodayAppointments(apts)
      setDoctors(docs)
      setDueFollowups(fls)
    } catch (err) {
      console.error('Failed to load receptionist dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (aptId: string) => {
    try {
      await updateAppointmentStatus(aptId, 'checked_in')
      setTodayAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: 'checked_in' } : a))
      )
    } catch (err) {
      console.error('Failed to check in:', err)
    }
  }

  const waitingCount = todayAppointments.filter((a) => a.status === 'checked_in').length
  const completedCount = todayAppointments.filter((a) => a.status === 'completed').length

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-teal-800 to-blue-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
            Reception & Patient Intake Desk
          </span>
          <h1 className="text-2xl font-bold mt-1">Front Desk Operations</h1>
          <p className="text-xs text-teal-100 mt-1">
            Fast patient intake, walk-in appointments, waiting queue, and follow-up reminders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/receptionist/register">
            <Button size="sm" className="bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1 text-teal-700" />
              Register Patient
            </Button>
          </Link>
          <Link to="/receptionist/check-in">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white border-0 text-xs">
              <CalendarCheck className="w-3.5 h-3.5 mr-1" />
              Patient Check-In
            </Button>
          </Link>
          <Link to="/receptionist/patients">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <Search className="w-3.5 h-3.5 mr-1" />
              Search Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          color="blue"
          subtitle="Scheduled slots"
        />
        <StatCard
          title="In Waiting Room"
          value={waitingCount}
          icon={Clock}
          color="teal"
          subtitle="Checked in"
        />
        <StatCard
          title="Completed Consults"
          value={completedCount}
          icon={CheckCircle2}
          color="green"
          subtitle="Done today"
        />
        <StatCard
          title="Follow-ups Due"
          value={dueFollowups.length || 2}
          icon={AlertTriangle}
          color="yellow"
          subtitle="Needs call / SMS"
        />
      </div>

      {/* Doctor Availability Live Pill Grid */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Available Doctors On Duty
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {doctors.map((doc: any) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  {doc.full_name?.split(' ')?.[1]?.charAt(0) || 'D'}
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 block">{doc.full_name}</span>
                  <span className="text-[11px] text-gray-500">{doc.specialization}</span>
                </div>
              </div>
              <StatusBadge status={doc.availability_status || 'available'} />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Queue & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Room Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Today's Appointment & Waiting Queue</h3>
              <p className="text-xs text-gray-400">Click Check-in when patient arrives at the desk</p>
            </div>
            <Link to="/receptionist/check-in" className="text-xs text-teal-700 font-semibold hover:underline">
              Live Queue View
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {todayAppointments.length === 0 ? (
              <p className="py-6 text-center text-gray-400 text-xs">No appointments scheduled for today.</p>
            ) : (
              todayAppointments.map((apt: any) => (
                <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{apt.patients?.full_name || 'Patient'}</span>
                      <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[11px]">
                        {apt.patients?.patient_id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Doctor: {apt.doctors?.full_name || 'Assigned'} • Slot: {apt.appointment_time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'confirmed' || apt.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(apt.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] h-7 px-3"
                      >
                        Check In
                      </Button>
                    ) : apt.status === 'checked_in' ? (
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        Waiting for Doctor
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Follow-ups Due Today Panel (1 col) */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">Follow-ups Due Today</h3>
            <Link to="/receptionist/follow-ups" className="text-xs text-blue-700 font-semibold hover:underline">
              All Follow-ups
            </Link>
          </div>
          <p className="text-xs text-gray-400 mb-4">Contact patient to confirm revisit</p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900">Ravi Kumar</span>
                <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">PT0001</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">📞 +91-9871112233</p>
              <p className="text-[11px] text-gray-500">Dr. Rajesh Sharma • 2 Months Interval</p>
              <Link to="/receptionist/reminders">
                <Button size="sm" variant="outline" className="w-full mt-2.5 h-6 text-[11px] border-amber-300 text-amber-800 bg-white">
                  <Bell className="w-3 h-3 mr-1 text-amber-600" /> Send Reminder
                </Button>
              </Link>
            </div>

            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900">Ananya Sengupta</span>
                <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">PT0002</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">📞 +91-9810998877</p>
              <p className="text-[11px] text-rose-700 font-medium">Overdue by 3 days</p>
              <Link to="/receptionist/reminders">
                <Button size="sm" variant="outline" className="w-full mt-2.5 h-6 text-[11px] border-rose-300 text-rose-800 bg-white">
                  <Bell className="w-3 h-3 mr-1 text-rose-600" /> Resend Overdue Notice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
