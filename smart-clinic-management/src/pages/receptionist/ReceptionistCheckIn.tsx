import React, { useState, useEffect } from 'react'
import {
  CalendarCheck, UserCheck, Clock, CheckCircle2,
  Search, ArrowRight, Stethoscope, AlertCircle, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getAppointments, updateAppointmentStatus, createAppointment } from '@/services/appointments'
import { getDoctors } from '@/services/doctors'
import { searchPatients } from '@/services/patients'
import { Appointment, Doctor, Patient } from '@/types'

export function ReceptionistCheckIn() {
  const [todayQueue, setTodayQueue] = useState<any[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [apts, docs] = await Promise.all([
        getAppointments({ date: todayStr }),
        getDoctors()
      ])
      setTodayQueue(apts)
      setDoctors(docs)
      if (docs.length > 0) setSelectedDoctorId(docs[0].id)
    } catch (err) {
      console.error('Failed to load check-in data:', err)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const results = await searchPatients(searchQuery)
      setSearchResults(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkCheckedIn = async (aptId: string) => {
    try {
      await updateAppointmentStatus(aptId, 'checked_in')
      setTodayQueue((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: 'checked_in' } : a))
      )
      setSuccessMsg('Patient marked as Checked In and added to waiting queue!')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      console.error('Check-in error:', err)
    }
  }

  const handleWalkInCheckIn = async () => {
    if (!selectedPatient || !selectedDoctorId) return
    setLoading(true)
    try {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`

      const newApt = await createAppointment({
        patient_id: selectedPatient.id,
        doctor_id: selectedDoctorId,
        appointment_date: todayStr,
        appointment_time: timeStr,
        type: 'new',
        chief_complaint: reasonForVisit || 'Walk-in Consultation',
        status: 'checked_in' as any
      } as any)

      setSuccessMsg(`Walk-in patient ${selectedPatient.full_name} checked in successfully!`)
      setSelectedPatient(null)
      setSearchResults([])
      setSearchQuery('')
      setReasonForVisit('')
      loadData()
      setTimeout(() => setSuccessMsg(null), 3500)
    } catch (err: any) {
      console.error('Walk-in error:', err)
      alert(err?.message || 'Error checking in walk-in patient.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Intake</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Front Desk Patient Check-In</h1>
          <p className="text-xs text-gray-500 mt-1">
            Confirm patient arrival, register walk-in visits, and route to doctor waiting queue.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Left = Fast Check-in / Walk-in Intake, Right = Live Waiting Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 & 2: Search Patient or Check In Walk-in */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Search className="w-5 h-5 text-teal-700" />
            <h2 className="font-bold text-sm text-gray-900">1. Locate Patient for Check-In</h2>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by Name, Mobile, or Patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <Button type="submit" loading={loading} size="sm" className="bg-teal-700 text-white text-xs">
              Search
            </Button>
          </form>

          {/* Search Results selection */}
          {searchResults.length > 0 && (
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 max-h-48 overflow-y-auto text-xs">
              {searchResults.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3 cursor-pointer flex items-center justify-between hover:bg-teal-50/50 transition-colors ${
                    selectedPatient?.id === p.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <div>
                    <span className="font-bold text-gray-900">{p.full_name}</span>
                    <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded ml-2 text-[11px]">
                      {p.patient_id}
                    </span>
                    <p className="text-[11px] text-gray-500">📞 {p.phone || p.mobile}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 text-[11px] text-teal-700">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Selected Patient Confirmation Box */}
          {selectedPatient && (
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Selected Patient</span>
                  <h3 className="text-sm font-bold text-gray-900">{selectedPatient.full_name}</h3>
                </div>
                <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-teal-300">
                  {selectedPatient.patient_id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Assign Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    placeholder="Fever / Routine Follow-up"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleWalkInCheckIn}
                loading={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs mt-2"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Confirm Arrival & Put in Doctor Queue
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Live Doctor Waiting Queue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" />
              <h2 className="font-bold text-sm text-gray-900">Today's Live Waiting Queue</h2>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {todayQueue.filter((a) => a.status === 'checked_in').length} Waiting
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
            {todayQueue.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-xs">No appointments scheduled for today.</p>
            ) : (
              todayQueue.map((apt: any) => (
                <div
                  key={apt.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    apt.status === 'checked_in'
                      ? 'border-teal-200 bg-teal-50/30'
                      : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {apt.patient?.full_name || apt.patients?.full_name || 'Patient'}
                      </span>
                      <span className="font-mono text-[11px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                        {apt.patient?.patient_id || apt.patients?.patient_id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Doctor: {apt.doctor?.full_name || apt.doctors?.full_name} • Slot: {apt.appointment_time}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Reason: {apt.reason_for_visit || apt.chief_complaint || 'General Checkup'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'pending' || apt.status === 'confirmed' ? (
                      <Button
                        size="sm"
                        onClick={() => handleMarkCheckedIn(apt.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] h-7"
                      >
                        Check In
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
