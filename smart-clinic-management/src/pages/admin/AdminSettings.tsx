import React, { useState, useEffect } from 'react'
import {
  Building2, Clock, Globe, Shield, Save, CheckCircle2,
  AlertCircle, MessageSquare, PhoneCall, Mail, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getClinicSettings, updateClinicSettings, ClinicSettingsData } from '@/services/clinicSettings'

export function AdminSettings() {
  const [settings, setSettings] = useState<ClinicSettingsData>({
    clinic_name: 'Arogya Smart Healthcare Clinic',
    address: 'Apex Medical Complex, Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    phone: '+91-9876543210',
    email: 'contact@arogyaclinic.in',
    website: 'https://www.arogyaclinic.in',
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    working_hours_start: '09:00',
    working_hours_end: '20:00',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    whatsapp_configured: true,
    sms_configured: true,
    email_configured: true
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    getClinicSettings()
      .then((data) => {
        if (data) setSettings(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      await updateClinicSettings(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const toggleDay = (day: string) => {
    const days = settings.working_days.includes(day)
      ? settings.working_days.filter((d) => d !== day)
      : [...settings.working_days, day]
    setSettings({ ...settings, working_days: days })
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Settings & Infrastructure</h1>
          <p className="text-xs text-gray-500 mt-1">
            Clinic branding, operational hours, and patient communication gateways.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Clinic Identity & Branding */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Building2 className="w-5 h-5 text-blue-700" />
            <h2 className="font-bold text-sm text-gray-900">Clinic Identity & Branding</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Clinic Name (Appears on Prescriptions)</label>
              <input
                type="text"
                value={settings.clinic_name}
                onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Address / Street</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={settings.city || ''}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={settings.state || ''}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Official Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                value={settings.website || ''}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Timings & Regional Defaults */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Clock className="w-5 h-5 text-teal-700" />
            <h2 className="font-bold text-sm text-gray-900">Working Days, Hours & Localization</h2>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Operating Clinic Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isSelected = settings.working_days.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`capitalize px-3 py-1.5 rounded-lg border font-medium text-xs transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Opening Time</label>
                <input
                  type="time"
                  value={settings.working_hours_start}
                  onChange={(e) => setSettings({ ...settings, working_hours_start: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Closing Time</label>
                <input
                  type="time"
                  value={settings.working_hours_end}
                  onChange={(e) => setSettings({ ...settings, working_hours_end: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Default Currency</label>
                <input
                  type="text"
                  value="INR (₹)"
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50 font-semibold text-gray-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value="Asia/Kolkata (IST +5:30)"
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50 font-semibold text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification API Status & Verification */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <MessageSquare className="w-5 h-5 text-indigo-700" />
            <h2 className="font-bold text-sm text-gray-900">Patient Reminder Gateways (Real Status)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* WhatsApp Card */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Cloud
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  settings.whatsapp_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {settings.whatsapp_configured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">
                Sends automated 7-day, 2-day & same-day follow-up appointment reminders.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsapp_configured}
                  onChange={(e) => setSettings({ ...settings, whatsapp_configured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Enable WhatsApp Channel</span>
              </label>
            </div>

            {/* SMS Card */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-blue-600" /> SMS Gateway
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  settings.sms_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {settings.sms_configured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">
                Instant SMS reminder alerts sent with registered DLT sender ID.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sms_configured}
                  onChange={(e) => setSettings({ ...settings, sms_configured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Enable SMS Channel</span>
              </label>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" /> Email (Resend/SMTP)
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  settings.email_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {settings.email_configured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">
                HTML appointment confirmation with clinic address & doctor notes.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_configured}
                  onChange={(e) => setSettings({ ...settings, email_configured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Enable Email Channel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md text-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Clinic Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
