import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Calendar, Clock, User, Stethoscope, Plus,
  CheckCircle2, AlertCircle, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getAppointments, createAppointment, updateAppointmentStatus, checkSlotAvailability } from '@/services/appointments'
import { getDoctors } from '@/services/doctors'
import { searchPatients, getPatientById } from '@/services/patients'
import { Appointment, Doctor, Patient } from '@/types'

export function ReceptionistAppointments() {
  const [searchParams] = useSearchParams()
  const preselectedPatientId = searchParams.get('patientId')

  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  // Booking Modal
  const [showBookModal, setShowBookModal] = useState(false)
  const [patientSearch, setPatientSearch] = useState('')
  const [searchedPatients, setSearchedPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0])
  const [appointmentTime, setAppointmentTime] = useState('10:00')
  const [appointmentType, setAppointmentType] = useState<'first_visit' | 'follow_up'>('first_visit')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookError, setBookError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    if (preselectedPatientId) {
      getPatientById(preselectedPatientId).then((p) => {
        if (p) {
          setSelectedPatient(p)
          setShowBookModal(true)
        }
      })
    }
  }, [preselectedPatientId])

  async function loadData() {
    setLoading(true)
    try {
      const [apts, docs] = await Promise.all([
        getAppointments({}),
        getDoctors()
      ])
      setAppointments(apts)
      setDoctors(docs)
      if (docs.length > 0) setSelectedDoctorId(docs[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientSearch.trim()) return
    const res = await searchPatients(patientSearch)
    setSearchedPatients(res)
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookError(null)

    if (!selectedPatient) {
      setBookError('Please select a patient.')
      return
    }
    if (!selectedDoctorId) {
      setBookError('Please select a doctor.')
      return
    }

    setBookingLoading(true)

    try {
      // Step: Check double-booking slot availability (TEST 11)
      const isAvailable = await checkSlotAvailability(selectedDoctorId, appointmentDate, appointmentTime)
      if (!isAvailable) {
        setBookError(`The selected time slot ${appointmentTime} on ${appointmentDate} is already booked for this doctor. Please choose another time.`)
        setBookingLoading(false)
        return
      }

      await createAppointment({
        patient_id: selectedPatient.id,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_type: appointmentType as any,
        reason_for_visit: reasonForVisit || 'Routine Checkup',
        status: 'confirmed' as any
      } as any)

      setShowBookModal(false)
      loadData()
      setSelectedPatient(null)
      setReasonForVisit('')
    } catch (err: any) {
      setBookError(err?.message || 'Failed to book appointment.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleStatusChange = async (aptId: string, status: any) => {
    try {
      await updateAppointmentStatus(aptId, status)
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status } : a))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const timeSlots = [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
  ]

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Appointment Scheduling Desk</h1>
          <p className="text-xs text-gray-500 mt-1">
            Book, reschedule, or cancel patient appointments with automated double-booking prevention.
          </p>
        </div>

        <Button onClick={() => setShowBookModal(true)} size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Book New Appointment
        </Button>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Appt ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">Loading appointments...</td>
                </tr>
              ) : (
                appointments.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {apt.appointment_id || apt.appointment_number || 'APT0001'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{apt.appointment_date}</div>
                      <div className="text-[11px] text-teal-700 font-medium">{apt.appointment_time}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {apt.patients?.full_name || apt.patient?.full_name}
                      <span className="block font-mono text-blue-700 text-[11px]">
                        {apt.patients?.patient_id || apt.patient?.patient_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {apt.doctors?.full_name || apt.doctor?.full_name}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                        {apt.appointment_type?.replace('_', ' ') || apt.type || 'Visit'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded p-1 bg-white focus:outline-none"
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

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Schedule Clinic Appointment
            </h3>

            {bookError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookError}</span>
              </div>
            )}

            {/* Patient Search / Selection */}
            {!selectedPatient ? (
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">1. Select Patient</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by name, ID, or phone..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <Button type="button" onClick={handlePatientSearch} size="sm" className="bg-blue-700 text-white">
                    Search
                  </Button>
                </div>

                {searchedPatients.length > 0 && (
                  <div className="border rounded-lg max-h-36 overflow-y-auto divide-y">
                    {searchedPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className="p-2 cursor-pointer hover:bg-blue-50 flex justify-between items-center"
                      >
                        <span className="font-bold">{p.full_name}</span>
                        <span className="text-gray-500 font-mono">{p.patient_id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900 block">{selectedPatient.full_name}</span>
                  <span className="text-[11px] text-gray-500">ID: {selectedPatient.patient_id} • 📞 {selectedPatient.phone || (selectedPatient as any).mobile}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedPatient(null)} className="h-6 text-[11px]">
                  Change
                </Button>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">2. Attending Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Visit Type</label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="first_visit">First Visit</option>
                    <option value="follow_up">Follow-Up Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Time Slot</label>
                <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1 border rounded-lg bg-gray-50">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setAppointmentTime(time)}
                      className={`p-1.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                        appointmentTime === time ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chief Reason for Consultation</label>
                <input
                  type="text"
                  placeholder="e.g. Fever, persistent headache, routine checkup"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowBookModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={bookingLoading} size="sm" className="bg-blue-700 text-white font-semibold">
                  Confirm & Book Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
