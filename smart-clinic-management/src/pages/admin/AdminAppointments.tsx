import React, { useState, useEffect } from 'react'
import {
  Calendar, Clock, Filter, Search, CheckCircle2,
  XCircle, AlertCircle, Stethoscope, User, CalendarCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getAppointments, updateAppointmentStatus } from '@/services/appointments'
import { getDoctors } from '@/services/doctors'
import { Appointment, Doctor } from '@/types'

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [selectedDoctor, selectedStatus, selectedDate])

  async function loadData() {
    setLoading(true)
    try {
      const [aptData, docData] = await Promise.all([
        getAppointments({
          doctor_id: selectedDoctor !== 'all' ? selectedDoctor : undefined,
          status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
          date: selectedDate || undefined
        }),
        getDoctors()
      ])
      setAppointments(aptData)
      setDoctors(docData)
    } catch (err) {
      console.error('Failed to load appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (aptId: string, newStatus: any) => {
    try {
      await updateAppointmentStatus(aptId, newStatus)
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Appointments Master</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time appointment schedule, doctor assignment, and status tracker with double-booking safety.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {selectedDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate('')}
            className="text-xs text-gray-400 mt-5 h-7"
          >
            Clear Date Filter
          </Button>
        )}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Appt ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto mb-2"></div>
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                appointments.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {apt.appointment_id || apt.appointment_number || 'APT0001'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{apt.appointment_date}</div>
                      <div className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.appointment_time}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {apt.patient?.full_name || apt.patients?.full_name || 'Patient'}
                      <span className="block text-[11px] text-gray-400 font-mono">
                        {apt.patient?.patient_id || apt.patients?.patient_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <div className="font-medium">{apt.doctor?.full_name || apt.doctors?.full_name || 'Doctor'}</div>
                      <div className="text-[11px] text-gray-400">
                        {apt.doctor?.specialization || apt.doctors?.specialization}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                      {apt.reason_for_visit || apt.chief_complaint || 'General Consultation'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg p-1 bg-white text-gray-700 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="in_consultation">In Consultation</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
