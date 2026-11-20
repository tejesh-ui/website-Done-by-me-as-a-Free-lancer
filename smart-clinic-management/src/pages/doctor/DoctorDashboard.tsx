import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope, Calendar, Clock, CheckCircle2,
  Users, AlertCircle, ArrowRight, UserCheck, Activity,
  FileText
} from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { getAppointments, updateAppointmentStatus } from '@/services/appointments'
import { useAuth } from '@/contexts/AuthContext'

export function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadDoctorAppointments()
  }, [])

  async function loadDoctorAppointments() {
    setLoading(true)
    try {
      const apts = await getAppointments({ date: todayStr })
      setAppointments(apts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const checkedInQueue = appointments.filter((a) => a.status === 'checked_in')
  const completedCount = appointments.filter((a) => a.status === 'completed').length
  const nextPatient = checkedInQueue[0] || appointments.find((a) => a.status === 'confirmed')

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
            Physician Workspace
          </span>
          <h1 className="text-2xl font-bold mt-1">
            Welcome, {user?.full_name || 'Dr. Rajesh Sharma'}
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Specialization: General Medicine & Diabetology • MCI-18492-DEL
          </p>
        </div>

        {nextPatient && (
          <Link
            to={`/doctor/consultations?patientId=${nextPatient.patient_id || nextPatient.patient?.id || nextPatient.patients?.id}&appointmentId=${nextPatient.id}`}
          >
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md">
              <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
              Start Next Consultation
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={appointments.length}
          icon={Calendar}
          color="blue"
          subtitle="Assigned schedule"
        />
        <StatCard
          title="Waiting Outside"
          value={checkedInQueue.length}
          icon={Clock}
          color="teal"
          subtitle="Checked in at desk"
        />
        <StatCard
          title="Consultations Done"
          value={completedCount}
          icon={CheckCircle2}
          color="green"
          subtitle="Prescriptions written"
        />
        <StatCard
          title="Pending Queue"
          value={appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed').length}
          icon={Users}
          color="purple"
          subtitle="Upcoming slots"
        />
      </div>

      {/* Next Up Spotlight Card */}
      {nextPatient ? (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg shrink-0">
              {nextPatient.patients?.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Ready for Consultation
                </span>
                <span className="font-mono text-xs font-bold text-blue-700">
                  {nextPatient.patients?.patient_id || nextPatient.patient?.patient_id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                {nextPatient.patients?.full_name || nextPatient.patient?.full_name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Chief Complaint: {nextPatient.reason_for_visit || nextPatient.chief_complaint || 'Fever & General Checkup'}
              </p>
            </div>
          </div>

          <Link
            to={`/doctor/consultations?patientId=${nextPatient.patient_id || nextPatient.patient?.id || nextPatient.patients?.id}&appointmentId=${nextPatient.id}`}
          >
            <Button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md">
              <Stethoscope className="w-4 h-4 mr-1.5" />
              Open Patient EHR & Consult
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 text-xs">
          No patients waiting in queue currently.
        </div>
      )}

      {/* Today's Full Doctor Schedule */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-bold text-sm text-gray-900">Today's Assigned Patient Schedule</h2>
          <span className="text-xs text-gray-400">Date: {todayStr}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Problem / Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt: any) => (
                <tr key={apt.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-semibold text-teal-800">{apt.appointment_time}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {apt.patients?.full_name || apt.patient?.full_name || 'Patient'}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-700">
                    {apt.patients?.patient_id || apt.patient?.patient_id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {apt.reason_for_visit || apt.chief_complaint || 'Routine Consultation'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/doctor/consultations?patientId=${apt.patient_id || apt.patient?.id || apt.patients?.id}&appointmentId=${apt.id}`}
                    >
                      <Button
                        size="sm"
                        variant={apt.status === 'checked_in' ? 'default' : 'outline'}
                        className={`text-xs h-7 ${
                          apt.status === 'checked_in'
                            ? 'bg-blue-700 text-white'
                            : 'text-gray-700 bg-white'
                        }`}
                      >
                        {apt.status === 'completed' ? 'View Visit' : 'Start Consult'}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
