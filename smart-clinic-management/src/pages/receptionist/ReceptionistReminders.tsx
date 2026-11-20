import React, { useState, useEffect } from 'react'
import {
  Bell, MessageSquare, PhoneCall, Mail, Send,
  CheckCircle2, Clock, AlertCircle, RefreshCw, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getNotificationHistory, sendManualReminder } from '@/services/notifications'
import { getClinicSettings } from '@/services/clinicSettings'
import { searchPatients } from '@/services/patients'

export function ReceptionistReminders() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [clinicConfig, setClinicConfig] = useState<any>(null)

  // Manual Dispatch State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedPatients, setSearchedPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp')
  const [customMessage, setCustomMessage] = useState(
    'Hello, this is a reminder from Arogya Smart Clinic. Please confirm your upcoming consultation appointment.'
  )
  const [sending, setSending] = useState(false)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [hist, config] = await Promise.all([
        getNotificationHistory(),
        getClinicSettings()
      ])
      setNotifications(hist)
      setClinicConfig(config)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const res = await searchPatients(searchQuery)
    setSearchedPatients(res)
  }

  const handleSend = async () => {
    if (!selectedPatient) return
    setSending(true)
    try {
      await sendManualReminder({
        patient_id: selectedPatient.id,
        channel,
        message: customMessage
      })
      setSuccessNotice(`Notification sent via ${channel.toUpperCase()} to ${selectedPatient.full_name}!`)
      setSelectedPatient(null)
      setSearchedPatients([])
      setSearchQuery('')
      loadData()
      setTimeout(() => setSuccessNotice(null), 3500)
    } catch (err: any) {
      alert(err?.message || 'Failed to dispatch notification.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Communication</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Automated Reminders & Messaging Desk</h1>
          <p className="text-xs text-gray-500 mt-1">
            Scheduled 7-day, 2-day, and same-day follow-up reminders with audit logs and manual broadcast.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={loadData} className="text-xs bg-white">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Refresh Status
        </Button>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Gateway Status Cards (Shows Not Configured truthfully when disabled) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">WhatsApp API</h3>
              <p className="text-[11px] text-gray-400">Meta Business Cloud</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
            clinicConfig?.whatsapp_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {clinicConfig?.whatsapp_configured ? 'Configured' : 'Not Configured'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">SMS Gateway</h3>
              <p className="text-[11px] text-gray-400">DLT Verified Header</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
            clinicConfig?.sms_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {clinicConfig?.sms_configured ? 'Configured' : 'Not Configured'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email Gateway</h3>
              <p className="text-[11px] text-gray-400">Resend / SMTP</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
            clinicConfig?.email_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {clinicConfig?.email_configured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
      </div>

      {/* Manual Dispatch Form & Delivery History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Reminder Box (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Send className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-sm text-gray-900">Manual Reminder Dispatch</h2>
          </div>

          <form onSubmit={handleSearchPatient} className="flex gap-2">
            <input
              type="text"
              placeholder="Search patient to notify..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button type="submit" size="sm" className="bg-blue-700 text-white text-xs">
              Find
            </Button>
          </form>

          {searchedPatients.length > 0 && (
            <div className="border border-gray-100 rounded-xl divide-y max-h-36 overflow-y-auto">
              {searchedPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p)
                    setCustomMessage(
                      `Hello ${p.full_name}, this is a reminder from Arogya Smart Clinic regarding your upcoming follow-up appointment. Please contact our clinic to confirm your slot.`
                    )
                  }}
                  className={`p-2.5 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedPatient?.id === p.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <span className="font-bold text-gray-900 block">{p.full_name}</span>
                  <span className="text-[11px] text-gray-500">📞 {p.phone || p.mobile}</span>
                </div>
              ))}
            </div>
          )}

          {selectedPatient && (
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{selectedPatient.full_name}</span>
                <span className="font-mono text-blue-700 text-[11px]">{selectedPatient.patient_id}</span>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Select Channel</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`p-1.5 rounded border text-[11px] font-semibold ${
                      channel === 'whatsapp' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`p-1.5 rounded border text-[11px] font-semibold ${
                      channel === 'sms' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-1.5 rounded border text-[11px] font-semibold ${
                      channel === 'email' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Message Content</label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <Button
                size="sm"
                onClick={handleSend}
                loading={sending}
                className="w-full bg-blue-700 text-white text-xs font-semibold"
              >
                Send Reminder Alert
              </Button>
            </div>
          )}
        </div>

        {/* Delivery Logs Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <h2 className="font-bold text-sm text-gray-900">Notification Delivery Audit Log</h2>
            </div>
            <span className="text-[11px] text-gray-400">Total logged: {notifications.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Message Content</th>
                  <th className="py-2.5 px-3">Scheduled / Sent</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      {n.patients?.full_name || n.patient?.full_name || 'Patient'}
                      <span className="block text-[11px] font-normal text-gray-400">
                        {n.patients?.patient_id || n.patient?.patient_id}
                      </span>
                    </td>
                    <td className="py-3 px-3 uppercase font-bold text-[11px] text-gray-600">
                      {n.channel}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate">{n.message}</td>
                    <td className="py-3 px-3 text-gray-500 text-[11px]">
                      {n.sent_at || n.scheduled_at || 'Just now'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={n.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
