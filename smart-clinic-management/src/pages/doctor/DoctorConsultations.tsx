import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Stethoscope, Activity, Heart, Clock, History,
  FileText, CheckCircle2, AlertCircle, ArrowRight, User,
  Thermometer, Weight, ChevronDown, ChevronUp, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPatientById, getPatientVisitHistory } from '@/services/patients'
import { createVisit } from '@/services/visits'
import { updateAppointmentStatus } from '@/services/appointments'
import { calculateAge } from '@/lib/utils'
import { Patient, Visit } from '@/types'

export function DoctorConsultations() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const patientIdParam = searchParams.get('patientId')
  const appointmentIdParam = searchParams.get('appointmentId')

  const [patient, setPatient] = useState<any>(null)
  const [historyVisits, setHistoryVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedVisit, setSavedVisit] = useState<any>(null)

  // Vitals & Clinical Consultation Form
  const [vitals, setVitals] = useState({
    blood_pressure: '120/80',
    pulse_rate: 74,
    temperature: 98.6,
    weight: 70,
    height: 172,
    oxygen_saturation: 99
  })

  const [chiefComplaint, setChiefComplaint] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [treatmentPlan, setTreatmentPlan] = useState('')
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatientData() {
      if (!patientIdParam) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const p = await getPatientById(patientIdParam)
        setPatient(p)
        const hist = await getPatientVisitHistory(patientIdParam)
        setHistoryVisits(hist)
        if (hist.length > 0) setExpandedVisitId(hist[0].id)
      } catch (err) {
        console.error('Failed to load patient consultation data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPatientData()
  }, [patientIdParam])

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientIdParam) return
    if (!diagnosis.trim()) {
      alert('Clinical Diagnosis is required before saving consultation.')
      return
    }

    setSaving(true)
    try {
      const visitRecord = await createVisit({
        patient_id: patientIdParam,
        doctor_id: 'd1000000-0000-0000-0000-000000000001', // Dr. Rajesh Sharma
        appointment_id: appointmentIdParam || undefined,
        visit_date: new Date().toISOString().split('T')[0],
        visit_type: historyVisits.length > 0 ? 'follow_up' : 'first_visit',
        chief_complaint: chiefComplaint,
        symptoms,
        medical_history: medicalHistory,
        diagnosis,
        clinical_notes: clinicalNotes,
        treatment_plan: treatmentPlan,
        blood_pressure: vitals.blood_pressure,
        pulse_rate: vitals.pulse_rate,
        temperature: vitals.temperature,
        weight: vitals.weight,
        height: vitals.height,
        oxygen_saturation: vitals.oxygen_saturation
      } as any)

      if (appointmentIdParam) {
        await updateAppointmentStatus(appointmentIdParam, 'in_consultation')
      }

      setSavedVisit(visitRecord)
    } catch (err: any) {
      console.error('Error saving consultation:', err)
      alert(err?.message || 'Failed to save consultation record.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-3"></div>
        Opening Electronic Health Record...
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-gray-800">No Patient Selected</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Please select a waiting patient from your Doctor Dashboard or search the patient directory.
        </p>
        <Button onClick={() => navigate('/doctor/dashboard')} size="sm" className="bg-blue-700 text-white text-xs">
          Return to Doctor Queue
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Patient Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-lg">
            {patient.full_name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{patient.full_name}</h1>
              <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {patient.patient_id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {historyVisits.length > 0 ? `Returning Patient (${historyVisits.length} Visits)` : 'First-Time Patient'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Gender: {patient.gender || 'Male'} • DOB: {patient.date_of_birth || '1988-06-15'} ({calculateAge(patient.date_of_birth)} yrs) • Blood Group: <span className="font-bold text-rose-700">{patient.blood_group || 'B+'}</span> • Mobile: {patient.phone || patient.mobile}
            </p>
          </div>
        </div>

        {savedVisit && (
          <Button
            size="sm"
            onClick={() =>
              navigate(
                `/doctor/prescriptions?visitId=${savedVisit.id}&patientId=${patient.id}&diagnosis=${encodeURIComponent(
                  diagnosis
                )}`
              )
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md animate-pulse"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Proceed to Digital Prescription
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Main Split Layout: Left = Medical History & Timeline, Right = Active Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Previous Visit History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-teal-700" />
                <h2 className="font-bold text-sm text-gray-900">EHR Visit History Timeline</h2>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {historyVisits.length} Recorded Visits
              </span>
            </div>

            {historyVisits.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">
                This is a first-time visit. No previous clinical records exist.
              </p>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {historyVisits.map((v) => {
                  const isExpanded = expandedVisitId === v.id
                  return (
                    <div
                      key={v.id}
                      className="rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 text-xs transition-all"
                    >
                      <div
                        onClick={() => setExpandedVisitId(isExpanded ? null : v.id)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {v.visit_date} • {v.diagnosis || 'Clinical Consultation'}
                          </span>
                          <span className="text-[11px] text-teal-800 font-medium">
                            Dr. {v.doctors?.full_name || 'Rajesh Sharma'}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-gray-700">
                          <div>
                            <span className="font-semibold text-gray-500 text-[11px] uppercase block">Chief Complaint:</span>
                            <p>{v.chief_complaint || 'Fever and respiratory symptoms'}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-gray-100 text-[11px]">
                            <div>BP: <span className="font-bold">{v.blood_pressure || '120/80'}</span></div>
                            <div>Pulse: <span className="font-bold">{v.pulse_rate || 74} bpm</span></div>
                            <div>Temp: <span className="font-bold">{v.temperature || 98.6} °F</span></div>
                          </div>

                          {v.clinical_notes && (
                            <div>
                              <span className="font-semibold text-gray-500 text-[11px] uppercase block">Clinical Notes:</span>
                              <p className="text-gray-600">{v.clinical_notes}</p>
                            </div>
                          )}

                          {v.prescriptions && v.prescriptions.length > 0 && (
                            <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-[11px]">
                              <span className="font-bold text-blue-900 block mb-1">Prescribed Medicines:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-blue-950">
                                {v.prescriptions[0].prescription_items?.map((item: any) => (
                                  <li key={item.id}>
                                    {item.medicine_name} — {item.dosage} ({item.frequency})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: New Consultation Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSaveConsultation} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-700" />
                <h2 className="font-bold text-sm text-gray-900">Current Consultation Examination</h2>
              </div>
              <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                Today: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>

            {/* Vital Signs Grid */}
            <div>
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                Patient Vital Signs
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    value={vitals.blood_pressure}
                    onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.pulse_rate}
                    onChange={(e) => setVitals({ ...vitals, pulse_rate: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="72"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="98.6"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={vitals.height}
                    onChange={(e) => setVitals({ ...vitals, height: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="170"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={vitals.oxygen_saturation}
                    onChange={(e) => setVitals({ ...vitals, oxygen_saturation: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                    placeholder="99"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Findings & Symptoms */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chief Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Fever, persistent cough with throat pain since 3 days"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Symptoms & History of Present Illness</label>
                <textarea
                  rows={2}
                  placeholder="Clinical progression, aggravating or relieving factors..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Primary Clinical Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acute Viral Bronchitis / Grade 1 Essential Hypertension"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-semibold text-blue-900 bg-blue-50/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Physician Clinical Notes & Observations</label>
                <textarea
                  rows={2}
                  placeholder="Chest auscultation findings, throat congestion, heart sounds..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Treatment Plan & Dietary Recommendations</label>
                <textarea
                  rows={2}
                  placeholder="Hydration instructions, rest, inhaler usage technique..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Saving creates permanent visit record without modifying past visits.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  loading={saving}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Consultation Record
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
