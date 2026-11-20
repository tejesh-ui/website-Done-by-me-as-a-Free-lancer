import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Stethoscope, CheckCircle2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getAppointments } from '@/services/appointments'

export function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedule()
  }, [selectedDate])

  async function loadSchedule() {
    setLoading(true)
    try {
      const data = await getAppointments({ date: selectedDate })
      setAppointments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Physician Daily Schedule</h1>
          <p className="text-xs text-gray-500 mt-1">
            Assigned appointments, patient queue flow, and consultation access.
          </p>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-xs bg-white font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Reason for Visit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Consultation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Loading schedule...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No appointments for this date.</td>
                </tr>
              ) : (
                appointments.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-bold text-teal-800">{apt.appointment_time}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {apt.patients?.full_name || apt.patient?.full_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-700">
                      {apt.patients?.patient_id || apt.patient?.patient_id}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{apt.reason_for_visit || 'Consultation'}</td>
                    <td className="py-3 px-4"><StatusBadge status={apt.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/doctor/consultations?patientId=${apt.patient_id || apt.patient?.id || apt.patients?.id}&appointmentId=${apt.id}`}>
                        <Button size="sm" className="h-7 text-xs bg-blue-700 text-white">
                          <Stethoscope className="w-3.5 h-3.5 mr-1" />
                          Consult
                        </Button>
                      </Link>
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
