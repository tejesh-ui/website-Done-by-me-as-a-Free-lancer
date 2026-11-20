import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, UserCheck, AlertCircle, CheckCircle2,
  Phone, Mail, Calendar, MapPin, Heart, Shield, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DuplicatePatientWarning } from '@/components/common/DuplicatePatientWarning'
import { createPatient, checkDuplicates } from '@/services/patients'
import { calculateAge } from '@/lib/utils'
import { Patient, PatientFormData } from '@/types'

export function RegisterPatient() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<PatientFormData>({
    full_name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    city: '',
    blood_group: 'B+',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    allergies: '',
    medical_history: ''
  })

  const [calculatedAge, setCalculatedAge] = useState<number | null>(null)
  const [consentWhatsapp, setConsentWhatsapp] = useState(true)
  const [consentSms, setConsentSms] = useState(true)
  const [consentEmail, setConsentEmail] = useState(true)

  const [duplicates, setDuplicates] = useState<Patient[]>([])
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value
    setFormData({ ...formData, date_of_birth: dob })
    if (dob) {
      setCalculatedAge(calculateAge(dob))
    } else {
      setCalculatedAge(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validation
    if (!formData.full_name.trim()) {
      setErrorMessage('Patient full name is required.')
      return
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Primary mobile number is required.')
      return
    }

    setLoading(true)

    try {
      // Step 1: Pre-check duplicate patient records (prompt requirement)
      const dupCheck = await checkDuplicates(formData.phone, formData.full_name)
      if (dupCheck.hasDuplicates && dupCheck.patients.length > 0) {
        setDuplicates(dupCheck.patients)
        setShowDuplicateModal(true)
        setLoading(false)
        return
      }

      // If no duplicate, proceed to create
      await executeCreatePatient()
    } catch (err: any) {
      console.error('Registration failed:', err)
      setErrorMessage(err?.message || 'Failed to register patient.')
      setLoading(false)
    }
  }

  const executeCreatePatient = async () => {
    setLoading(true)
    setShowDuplicateModal(false)
    try {
      const patient = await createPatient({
        ...formData,
        // map additional flags
        ...({
          consent_whatsapp: consentWhatsapp,
          consent_sms: consentSms,
          consent_email: consentEmail,
          registration_date: new Date().toISOString().split('T')[0]
        } as any)
      })
      setRegisteredPatient(patient)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Database error creating patient record.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectExisting = (existing: Patient) => {
    setShowDuplicateModal(false)
    // Route to patient profile
    navigate(`/patients/${existing.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Intake</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Patient Registration</h1>
          <p className="text-xs text-gray-500 mt-1">
            Permanent EHR profile creation with real-time duplicate screening & safe auto Patient ID generation.
          </p>
        </div>
      </div>

      {/* Success Modal / Banner when patient is registered */}
      {registeredPatient && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm animate-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Registration Successful
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">{registeredPatient.full_name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Assigned Unique Patient ID:{' '}
                <span className="font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 text-base">
                  {registeredPatient.patient_id}
                </span>
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Button
                  size="sm"
                  onClick={() => navigate(`/patients/${registeredPatient.id}`)}
                  className="bg-blue-700 text-white text-xs"
                >
                  View Patient Profile
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRegisteredPatient(null)
                    setFormData({
                      full_name: '',
                      phone: '',
                      alternate_phone: '',
                      email: '',
                      date_of_birth: '',
                      gender: 'male',
                      address: '',
                      city: '',
                      blood_group: 'B+',
                      emergency_contact_name: '',
                      emergency_contact_phone: '',
                      allergies: '',
                      medical_history: ''
                    })
                  }}
                  className="text-xs bg-white"
                >
                  Register Another Patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 text-xs">
        {/* Section 1: Personal Demographics */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-700" />
            Personal & Demographic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra Gupta"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender || 'male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={handleDobChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Calculated Age</label>
              <input
                type="text"
                value={calculatedAge !== null ? `${calculatedAge} years` : 'Auto-calculated'}
                disabled
                className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Group</label>
              <select
                value={formData.blood_group || 'B+'}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Address */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-700" />
            Contact & Address Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Primary Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="+91-9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Alternate Contact Number</label>
              <input
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                value={formData.alternate_phone || ''}
                onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="patient@gmail.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="House No, Apartment, Sector, Street"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">City / Region</label>
              <input
                type="text"
                placeholder="e.g. Noida / Delhi"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Emergency Contact & Medical Notes */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            Emergency Contact & Clinical Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Emergency Contact Person Name & Relation</label>
              <input
                type="text"
                placeholder="e.g. Suman Gupta (Spouse)"
                value={formData.emergency_contact_name || ''}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                value={formData.emergency_contact_phone || ''}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Medical Background / Known Allergies</label>
              <textarea
                rows={2}
                placeholder="Any chronic illness (Diabetes, Hypertension), penicillin or drug allergies..."
                value={formData.medical_history || ''}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Patient Notification Consent */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h4 className="font-bold text-xs text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            Patient Communication Consent (Digital DPDP Compliance)
          </h4>
          <p className="text-[11px] text-gray-500 mb-3">
            Patient consents to receive appointment alerts and doctor follow-up reminders.
          </p>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={consentWhatsapp}
                onChange={(e) => setConsentWhatsapp(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>WhatsApp Reminders</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={consentSms}
                onChange={(e) => setConsentSms(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>SMS Notifications</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={consentEmail}
                onChange={(e) => setConsentEmail(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Email Confirmation</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/receptionist/dashboard')}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md text-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Screen Duplicates & Register Patient
          </Button>
        </div>
      </form>

      {/* Duplicate Warning Modal */}
      {showDuplicateModal && (
        <DuplicatePatientWarning
          duplicates={duplicates}
          onSelectExisting={handleSelectExisting}
          onProceedAnyway={executeCreatePatient}
          onCancel={() => setShowDuplicateModal(false)}
        />
      )}
    </div>
  )
}
