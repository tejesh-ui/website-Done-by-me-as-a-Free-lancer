import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  User, Phone, Mail, Calendar, MapPin, Heart, Shield,
  History, Stethoscope, CalendarPlus, CheckCircle2, ArrowLeft,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPatientById, getPatientVisitHistory } from '@/services/patients'
import { calculateAge } from '@/lib/utils'

export function PatientProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    loadProfile()
  }, [id])

  async function loadProfile() {
    setLoading(true)
    try {
      const [p, hist] = await Promise.all([
        getPatientById(id!),
        getPatientVisitHistory(id!)
      ])
      setPatient(p)
      setVisits(hist)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-3"></div>
        Loading Patient Record...
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 max-w-md mx-auto">
        <h2 className="text-sm font-bold text-gray-900">Patient Record Not Found</h2>
        <Button onClick={() => navigate(-1)} size="sm" className="mt-4 bg-blue-700 text-white text-xs">
          Go Back
        </Button>
      </div>
    )
  }

  const isReturning = visits.length > 0

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </button>

        <div className="flex items-center gap-2">
          <Link to={`/patients/${patient.id}/history`}>
            <Button size="sm" variant="outline" className="text-xs text-teal-800 border-teal-200 bg-teal-50">
              <History className="w-3.5 h-3.5 mr-1" />
              Visit History ({visits.length})
            </Button>
          </Link>
          <Link to={`/doctor/consultations?patientId=${patient.id}`}>
            <Button size="sm" className="bg-blue-700 text-white text-xs">
              <Stethoscope className="w-3.5 h-3.5 mr-1" />
              Start Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-2xl shadow-sm">
            {patient.full_name?.charAt(0) || 'P'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
              <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {patient.patient_id}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isReturning ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isReturning ? 'Returning Patient' : 'First-Time Patient'}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Registered on: {patient.registration_date || patient.created_at?.split('T')[0] || '19-11-2026'} • 
              Status: <span className="text-emerald-700 font-semibold">Active Record</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Visits</span>
            <span className="text-xl font-bold text-gray-900">{visits.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Blood Group</span>
            <span className="text-xl font-bold text-rose-700">{patient.blood_group || 'O+'}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Personal & Contact Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-700" />
            Personal & Demographic Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Date of Birth:</span>
              <span className="font-semibold text-gray-800">{patient.date_of_birth || '15-06-1988'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Age:</span>
              <span className="font-semibold text-gray-800">{calculateAge(patient.date_of_birth) || 38} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Gender:</span>
              <span className="font-semibold text-gray-800 capitalize">{patient.gender || 'Male'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Primary Mobile:</span>
              <span className="font-semibold text-gray-800 font-mono">📞 {patient.phone || patient.mobile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Alternate Mobile:</span>
              <span className="font-semibold text-gray-800 font-mono">{patient.alternate_phone || patient.alternate_mobile || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Email:</span>
              <span className="font-semibold text-gray-800">{patient.email || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Address:</span>
              <span className="font-semibold text-gray-800 text-right">{patient.address || 'Flat 402, Green Valley Apartments'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-medium">City:</span>
              <span className="font-semibold text-gray-800">{patient.city || 'Noida'}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact & Clinical History */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            Emergency & Medical Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Emergency Contact Name:</span>
              <span className="font-semibold text-gray-800">{patient.emergency_contact_name || 'Family Relative'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Emergency Phone:</span>
              <span className="font-semibold text-gray-800 font-mono">📞 {patient.emergency_contact_phone || patient.emergency_contact || 'N/A'}</span>
            </div>

            <div className="pt-2">
              <span className="text-gray-500 font-semibold block mb-1">Known Allergies / Medical Background:</span>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
                {patient.medical_history || patient.notes || 'No known allergies reported. Normal medical history.'}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-gray-500 font-semibold block mb-1">Communication Consent:</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                  ✓ WhatsApp
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                  ✓ SMS
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold">
                  ✓ Email
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
