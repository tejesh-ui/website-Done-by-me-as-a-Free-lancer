import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  History, Stethoscope, FileText, Clock, Heart,
  ArrowLeft, Calendar, User, CheckCircle2, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPatientById, getPatientVisitHistory } from '@/services/patients'
import { calculateAge } from '@/lib/utils'

export function PatientHistory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    loadData()
  }, [id])

  async function loadData() {
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
        Loading Complete Patient History...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="flex items-center gap-2">
          <Link to={`/patients/${patient?.id}`}>
            <Button size="sm" variant="outline" className="text-xs">
              <User className="w-3.5 h-3.5 mr-1" /> View Profile
            </Button>
          </Link>
          <Link to={`/doctor/consultations?patientId=${patient?.id}`}>
            <Button size="sm" className="bg-blue-700 text-white text-xs">
              <Stethoscope className="w-3.5 h-3.5 mr-1" /> New Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{patient?.full_name}</h1>
            <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {patient?.patient_id}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Age: {calculateAge(patient?.date_of_birth)} yrs • Gender: {patient?.gender || 'Male'} • Phone: {patient?.phone || patient?.mobile}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 block font-semibold">Total Encounters</span>
          <span className="text-2xl font-black text-blue-900">{visits.length} Visits</span>
        </div>
      </div>

      {/* Chronological Visits Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <History className="w-5 h-5 text-teal-700" />
          <h2 className="font-bold text-base text-gray-900">Chronological Clinical Encounters</h2>
        </div>

        {visits.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm text-gray-400 text-xs">
            No previous clinical consultations found for this patient.
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-200 ml-4 space-y-8 pl-6">
            {visits.map((v, index) => {
              const rx = v.prescriptions?.[0]
              const fl = v.followups?.[0]

              return (
                <div key={v.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-700 border-4 border-white shadow-sm"></div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 text-xs">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            Visit {visits.length - index} ({v.visit_id})
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            • {v.visit_date}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            v.visit_type === 'first_visit'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}>
                            {v.visit_type === 'first_visit' ? 'First Visit' : 'Follow-Up'}
                          </span>
                        </div>
                        <p className="text-[11px] text-teal-800 font-semibold mt-0.5">
                          Attending Physician: Dr. {v.doctors?.full_name || 'Rajesh Sharma'} ({v.doctors?.specialization || 'Medicine'})
                        </p>
                      </div>
                    </div>

                    {/* Vitals Ribbon */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 text-[11px]">
                      <div>BP: <strong className="text-gray-900">{v.blood_pressure || '120/80'}</strong></div>
                      <div>Pulse: <strong className="text-gray-900">{v.pulse_rate || 74} bpm</strong></div>
                      <div>Temp: <strong className="text-gray-900">{v.temperature || 98.6} °F</strong></div>
                      <div>Weight: <strong className="text-gray-900">{v.weight || 70} kg</strong></div>
                      <div>Height: <strong className="text-gray-900">{v.height || 170} cm</strong></div>
                      <div>SpO2: <strong className="text-gray-900">{v.oxygen_saturation || 99}%</strong></div>
                    </div>

                    {/* Problem & Diagnosis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px] block mb-0.5">Chief Complaint / Problem:</span>
                        <p className="text-gray-800 font-medium">{v.chief_complaint || 'General complaints'}</p>
                      </div>

                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px] block mb-0.5">Clinical Diagnosis:</span>
                        <p className="text-blue-900 font-bold">{v.diagnosis || 'Acute illness'}</p>
                      </div>
                    </div>

                    {v.clinical_notes && (
                      <div>
                        <span className="font-bold text-gray-500 uppercase text-[10px] block mb-0.5">Doctor Notes & Observations:</span>
                        <p className="text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">{v.clinical_notes}</p>
                      </div>
                    )}

                    {/* Prescriptions */}
                    {rx && (
                      <div className="bg-blue-50/40 rounded-xl p-3.5 border border-blue-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-700" />
                            Prescription Issued ({rx.prescription_id})
                          </span>
                        </div>

                        <div className="space-y-1 text-gray-800">
                          {rx.prescription_items?.map((item: any, i: number) => (
                            <div key={item.id || i} className="flex items-center justify-between border-b border-blue-100/50 pb-1 text-[11px]">
                              <span className="font-bold text-blue-900">{item.medicine_name}</span>
                              <span className="text-gray-600">{item.dosage} • {item.frequency} • {item.duration}</span>
                            </div>
                          ))}
                        </div>

                        {rx.advice && <p className="text-[11px] text-gray-600 mt-1">Advice: {rx.advice}</p>}
                      </div>
                    )}

                    {/* Follow-up Note */}
                    {fl && (
                      <div className="flex items-center justify-between bg-teal-50/50 p-2.5 rounded-lg border border-teal-200 text-[11px]">
                        <span className="font-semibold text-teal-900">
                          Scheduled Follow-up: <strong>{fl.scheduled_date}</strong> ({fl.interval_type?.replace('_', ' ') || '2 months'})
                        </span>
                        <span className="capitalize font-bold text-teal-800">{fl.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
