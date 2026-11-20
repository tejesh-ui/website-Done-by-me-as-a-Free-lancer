import React, { useState, useEffect } from 'react'
import {
  Stethoscope, Plus, Clock, Phone, Mail, Calendar,
  CheckCircle, AlertCircle, Edit, Trash2, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getDoctors, createDoctor, updateDoctor } from '@/services/doctors'
import { Doctor } from '@/types'

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    full_name: '',
    specialization: '',
    qualification: '',
    registration_number: '',
    phone: '',
    email: '',
    consultation_fee: 500,
    availability_status: 'available' as 'available' | 'unavailable' | 'on_leave'
  })

  useEffect(() => {
    loadDoctors()
  }, [])

  async function loadDoctors() {
    setLoading(true)
    try {
      const data = await getDoctors()
      setDoctors(data)
    } catch (err) {
      console.error('Failed to load doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (doctorId: string, newStatus: 'available' | 'unavailable' | 'on_leave') => {
    try {
      await updateDoctor(doctorId, { availability_status: newStatus } as any)
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctorId ? { ...d, availability_status: newStatus } as any : d))
      )
    } catch (err) {
      console.error('Failed to update doctor status:', err)
    }
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDoctor(newDoctor as any)
      setShowAddModal(false)
      loadDoctors()
    } catch (err) {
      console.error('Failed to add doctor:', err)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor & Specialist Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure clinical consultation schedules, medical registration IDs, and live availability.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add New Doctor
        </Button>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-3"></div>
            Loading clinic doctors...
          </div>
        ) : (
          doctors.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base shadow-sm">
                      {doc.full_name?.split(' ')?.[1]?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{doc.full_name}</h3>
                      <p className="text-xs font-medium text-teal-700">{doc.specialization}</p>
                      <span className="text-[11px] font-mono text-gray-400">{doc.doctor_id || 'DR001'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-gray-600 border-t border-gray-50 pt-3">
                  <p className="text-gray-700 font-medium">{doc.qualification || 'MBBS'}</p>
                  <p className="text-[11px] text-gray-400 font-mono">Reg: {doc.registration_number || 'MCI-REG-PENDING'}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{doc.phone || '+91-XXXXXXXXXX'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Mon - Sat (09:00 AM - 01:00 PM)</span>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Availability:</span>
                <select
                  value={doc.availability_status || 'available'}
                  onChange={(e) => handleStatusChange(doc.id, e.target.value as any)}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                    doc.availability_status === 'available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : doc.availability_status === 'on_leave'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <option value="available">🟢 Available</option>
                  <option value="unavailable">🔴 Unavailable</option>
                  <option value="on_leave">🟡 On Leave</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add New Doctor</h3>
            <p className="text-xs text-gray-500 mb-4">Register a doctor to the clinic roster</p>

            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Jane Doe"
                  value={newDoctor.full_name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, full_name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="Cardiologist / General Physician"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Qualifications</label>
                <input
                  type="text"
                  placeholder="MBBS, MD (Medicine)"
                  value={newDoctor.qualification}
                  onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Medical Registration Number</label>
                <input
                  type="text"
                  placeholder="MCI-12345-DEL"
                  value={newDoctor.registration_number}
                  onChange={(e) => setNewDoctor({ ...newDoctor, registration_number: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91-9876543210"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="doctor@clinic.in"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t mt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-700 text-white">
                  Save Doctor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
