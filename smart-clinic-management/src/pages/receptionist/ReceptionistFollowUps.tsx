import React, { useState, useEffect } from 'react'
import {
  Clock, AlertTriangle, CheckCircle2, Bell, Filter,
  Phone, Calendar, User, Search, Stethoscope
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getFollowups, updateFollowupStatus } from '@/services/followups'
import { sendManualReminder } from '@/services/notifications'
import { getDoctors } from '@/services/doctors'
import { Doctor } from '@/types'

export function ReceptionistFollowUps() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'due_today' | 'overdue' | 'completed'>('due_today')
  const [followups, setFollowups] = useState<any[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [loading, setLoading] = useState(true)
  const [reminderAlert, setReminderAlert] = useState<string | null>(null)

  useEffect(() => {
    loadFollowups()
    getDoctors().then(setDoctors).catch(console.error)
  }, [activeTab, selectedDoctor])

  async function loadFollowups() {
    setLoading(true)
    try {
      const data = await getFollowups({
        status: activeTab,
        doctorId: selectedDoctor !== 'all' ? selectedDoctor : undefined
      })
      setFollowups(data)
    } catch (err) {
      console.error('Failed to load followups:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReminder = async (fl: any) => {
    try {
      const patientId = fl.patient_id || fl.patients?.id
      const patientName = fl.patients?.full_name || fl.patient?.full_name || 'Patient'
      const phone = fl.patients?.mobile || fl.patients?.phone || '+91-XXXXXXXXXX'

      const msg = `Hello ${patientName}, this is a reminder from Arogya Smart Clinic. Your doctor ${fl.doctors?.full_name || ''} has recommended a follow-up visit on ${fl.scheduled_date || 'today'}. Please contact our clinic to confirm your appointment.`

      await sendManualReminder({
        patient_id: patientId,
        followup_id: fl.id,
        channel: 'whatsapp',
        message: msg
      })

      setReminderAlert(`WhatsApp & SMS Reminder queued for ${patientName} (${phone})!`)
      setTimeout(() => setReminderAlert(null), 3500)
    } catch (err: any) {
      alert(err?.message || 'Error sending reminder.')
    }
  }

  const handleComplete = async (flId: string) => {
    try {
      await updateFollowupStatus(flId, 'completed')
      setFollowups((prev) => prev.filter((f) => f.id !== flId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Retention</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Follow-Up Coordination Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track recommended follow-up dates, identify overdue patients, and send multi-channel reminders.
          </p>
        </div>
      </div>

      {reminderAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reminderAlert}</span>
        </div>
      )}

      {/* Tabs & Doctor Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('due_today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'due_today' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming' ? 'bg-blue-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overdue
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        <div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-3 bg-white text-gray-700 focus:outline-none"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Recommended Date</th>
                <th className="py-3 px-4">Doctor's Instructions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto mb-2"></div>
                    Loading follow-up records...
                  </td>
                </tr>
              ) : followups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No follow-ups found under "{activeTab.replace('_', ' ')}".
                  </td>
                </tr>
              ) : (
                followups.map((fl: any) => (
                  <tr key={fl.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">
                        {fl.patients?.full_name || fl.patient?.full_name || 'Patient'}
                      </span>
                      <span className="font-mono text-[11px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                        {fl.patients?.patient_id || fl.patient?.patient_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      📞 {fl.patients?.mobile || fl.patients?.phone || '+91-XXXXXXXXXX'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-800">
                      {fl.doctors?.full_name || fl.doctor?.full_name}
                      <span className="block text-[11px] text-gray-400">
                        {fl.doctors?.specialization || fl.doctor?.specialization}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {fl.scheduled_date || fl.followup_date}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                      {fl.instructions || fl.reason || 'General Follow-up'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={fl.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {fl.status !== 'completed' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSendReminder(fl)}
                              className="h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white gap-1"
                            >
                              <Bell className="w-3 h-3" />
                              Send Reminder
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleComplete(fl.id)}
                              className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                            >
                              Mark Done
                            </Button>
                          </>
                        )}
                      </div>
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
