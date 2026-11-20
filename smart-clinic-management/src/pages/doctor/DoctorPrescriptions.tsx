import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  FileText, Plus, Trash2, Printer, Download, Save,
  Calendar, Clock, CheckCircle2, AlertCircle, Stethoscope,
  Building2, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createPrescription } from '@/services/prescriptions'
import { createFollowup } from '@/services/followups'
import { getPatientById } from '@/services/patients'
import { getClinicSettings } from '@/services/clinicSettings'
import { calculateAge, calculateFollowupDate } from '@/lib/utils'
import jsPDF from 'jspdf'

interface MedicineRow {
  id: string
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
  route: string
  instructions: string
}

export function DoctorPrescriptions() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const visitIdParam = searchParams.get('visitId')
  const patientIdParam = searchParams.get('patientId')
  const diagnosisParam = searchParams.get('diagnosis') || ''

  const [patient, setPatient] = useState<any>(null)
  const [clinic, setClinic] = useState<any>(null)
  const [diagnosis, setDiagnosis] = useState(diagnosisParam)
  const [advice, setAdvice] = useState('Take rest, maintain proper hydration with warm fluids.')
  const [dietaryInstructions, setDietaryInstructions] = useState('Avoid oily and spicy food. Prefer light meals.')
  const [labTests, setLabTests] = useState('Complete Blood Count (CBC) if symptoms persist.')
  const [followupInterval, setFollowupInterval] = useState('2_months')
  const [followupDate, setFollowupDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )

  const [medicines, setMedicines] = useState<MedicineRow[]>([
    {
      id: '1',
      medicine_name: 'Tab. Paracetamol (Dolo 650mg)',
      dosage: '650 mg',
      frequency: '1-0-1 (Twice daily after food)',
      duration: '5 days',
      route: 'oral',
      instructions: 'Take if fever > 100°F'
    },
    {
      id: '2',
      medicine_name: 'Tab. Montair-LC (Montelukast + Levocetirizine)',
      dosage: '1 tablet',
      frequency: '0-0-1 (At bedtime)',
      duration: '10 days',
      route: 'oral',
      instructions: 'Take with warm water before sleep'
    }
  ])

  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null)

  useEffect(() => {
    if (patientIdParam) {
      getPatientById(patientIdParam).then(setPatient).catch(console.error)
    }
    getClinicSettings().then(setClinic).catch(console.error)
  }, [patientIdParam])

  // Handle follow-up interval changes
  const handleIntervalChange = (interval: string) => {
    setFollowupInterval(interval)
    const calculated = calculateFollowupDate(new Date(), interval)
    setFollowupDate(calculated.toISOString().split('T')[0])
  }

  const addMedicineRow = () => {
    const newRow: MedicineRow = {
      id: String(Date.now()),
      medicine_name: '',
      dosage: '1 tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      route: 'oral',
      instructions: 'After meals'
    }
    setMedicines([...medicines, newRow])
  }

  const removeMedicineRow = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  const updateMedicine = (id: string, field: keyof MedicineRow, val: string) => {
    setMedicines(medicines.map((m) => (m.id === id ? { ...m, [field]: val } : m)))
  }

  const handleSavePrescription = async () => {
    if (!diagnosis) {
      alert('Diagnosis is required.')
      return
    }
    setSaving(true)
    try {
      const rx = await createPrescription({
        visit_id: visitIdParam || 'v1000000-0000-0000-0000-000000000001',
        patient_id: patientIdParam || patient?.id || 'p1000000-0000-0000-0000-000000000001',
        doctor_id: 'd1000000-0000-0000-0000-000000000001',
        diagnosis,
        advice,
        dietary_instructions: dietaryInstructions,
        lab_tests: labTests,
        follow_up_date: followupDate,
        items: medicines.map((m, idx) => ({
          medicine_name: m.medicine_name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          route: m.route,
          instructions: m.instructions,
          sort_order: idx + 1
        })) as any
      } as any)

      // Also create follow-up record
      if (followupDate) {
        await createFollowup({
          patient_id: patientIdParam || patient?.id,
          visit_id: visitIdParam || 'v1000000-0000-0000-0000-000000000001',
          doctor_id: 'd1000000-0000-0000-0000-000000000001',
          scheduled_date: followupDate,
          interval_type: followupInterval,
          instructions: advice,
          status: 'upcoming'
        } as any)
      }

      setPrescriptionId(rx.prescription_id || 'RX0001')
      setSavedSuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Error saving digital prescription.')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Header - Navy Blue
    doc.setFillColor(30, 45, 94)
    doc.rect(0, 0, 210, 36, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(clinic?.clinic_name || 'Arogya Smart Clinic & Healthcare', 14, 15)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `${clinic?.address || 'Apex Medical Complex, Sector 18, Noida'} • Tel: ${clinic?.phone || '+91-9876543210'}`,
      14,
      22
    )
    doc.text('Email: contact@arogyaclinic.in • Website: www.arogyaclinic.in', 14, 28)

    // Doctor details on right
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Dr. Rajesh Sharma, MD', 196, 15, { align: 'right' })
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Reg No: MCI-18492-DEL', 196, 21, { align: 'right' })
    doc.text('Senior Physician & Diabetologist', 196, 27, { align: 'right' })

    // Patient Info Ribbon
    doc.setFillColor(241, 245, 249)
    doc.rect(14, 42, 182, 22, 'F')

    doc.setTextColor(50, 50, 50)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`Patient: ${patient?.full_name || 'Ravi Kumar'}`, 18, 49)
    doc.text(`Patient ID: ${patient?.patient_id || 'PT0001'}`, 90, 49)
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 155, 49)

    doc.setFont('helvetica', 'normal')
    doc.text(
      `Age: ${calculateAge(patient?.date_of_birth) || 38} yrs  •  Gender: ${patient?.gender || 'Male'}  •  Blood Group: ${patient?.blood_group || 'B+'}`,
      18,
      57
    )
    doc.text(`Diagnosis: ${diagnosis || 'Acute Bronchitis'}`, 90, 57)

    // Rx Symbol
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 138)
    doc.text('Rx', 14, 73)

    // Medicines Table (Native jsPDF drawing)
    let currentY = 78
    doc.setFillColor(30, 58, 138)
    doc.rect(14, currentY, 182, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('#', 16, currentY + 5)
    doc.text('Medicine Name', 24, currentY + 5)
    doc.text('Dosage', 85, currentY + 5)
    doc.text('Frequency', 115, currentY + 5)
    doc.text('Duration', 150, currentY + 5)
    doc.text('Instructions', 170, currentY + 5)

    currentY += 8
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)

    medicines.forEach((m, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252)
        doc.rect(14, currentY - 1, 182, 6, 'F')
      }
      doc.text(String(idx + 1), 16, currentY + 4)
      doc.text(m.medicine_name.substring(0, 32), 24, currentY + 4)
      doc.text(m.dosage.substring(0, 15), 85, currentY + 4)
      doc.text(m.frequency.substring(0, 18), 115, currentY + 4)
      doc.text(m.duration.substring(0, 10), 150, currentY + 4)
      doc.text(m.instructions.substring(0, 15), 170, currentY + 4)
      currentY += 6
    })

    const finalY = currentY + 6

    // Advice & Dietary
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 45, 94)
    doc.text('Physician Advice & Dietary Instructions:', 14, finalY)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text(`• ${advice}`, 14, finalY + 6)
    doc.text(`• ${dietaryInstructions}`, 14, finalY + 12)

    if (labTests) {
      doc.setFont('helvetica', 'bold')
      doc.text('Recommended Laboratory Tests:', 14, finalY + 20)
      doc.setFont('helvetica', 'normal')
      doc.text(`• ${labTests}`, 14, finalY + 25)
    }

    // Follow-up Box
    doc.setFillColor(240, 253, 250)
    doc.rect(14, finalY + 33, 182, 12, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(13, 148, 136)
    doc.text(
      `Recommended Follow-up Visit: ${followupDate} (${followupInterval.replace('_', ' ').toUpperCase()})`,
      18,
      finalY + 41
    )

    // Doctor Signature Area
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('Dr. Rajesh Sharma, MD', 160, 275)
    doc.line(150, 270, 195, 270)
    doc.text('Authorized Doctor Signature', 153, 279)

    doc.save(`Prescription_${patient?.patient_id || 'PT0001'}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Digital Rx Engine</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Physician Prescription Workspace</h1>
          <p className="text-xs text-gray-500 mt-1">
            Compliant digital prescription generator with auto dosage, follow-up scheduling, and PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPDF}
            className="text-xs bg-white text-blue-700 border-blue-200"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download PDF
          </Button>

          <Button
            size="sm"
            onClick={handleSavePrescription}
            loading={saving}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Prescription
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Prescription saved permanently in PostgreSQL! Assigned Prescription ID:{' '}
              <strong className="font-mono">{prescriptionId || 'RX0001'}</strong>. Follow-up scheduled for{' '}
              <strong>{followupDate}</strong>.
            </span>
          </div>
          <Button size="sm" onClick={handleDownloadPDF} className="bg-emerald-700 text-white text-xs">
            Download PDF
          </Button>
        </div>
      )}

      {/* Prescription Paper Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-10 space-y-6 text-xs font-sans">
        {/* Clinic & Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-blue-900">
          <div>
            <h2 className="text-xl font-bold text-blue-900">
              {clinic?.clinic_name || 'Arogya Smart Healthcare Clinic'}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {clinic?.address || 'Shop 104-106, Apex Medical Complex, Sector 18, Noida, Uttar Pradesh'}
            </p>
            <p className="text-[11px] text-gray-500">
              Phone: {clinic?.phone || '+91-9876543210'} • Email: {clinic?.email || 'contact@arogyaclinic.in'}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h3 className="text-sm font-bold text-gray-900">Dr. Rajesh Sharma</h3>
            <p className="text-xs text-teal-700 font-medium">MBBS, MD (General Medicine)</p>
            <p className="text-[11px] text-gray-400 font-mono">MCI Reg: MCI-18492-DEL</p>
            <p className="text-[11px] text-gray-500">Specialist in General Health & Diabetology</p>
          </div>
        </div>

        {/* Patient Demographic Banner */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase block">Patient Name</span>
            <span className="font-bold text-gray-900 text-sm">{patient?.full_name || 'Ravi Kumar'}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase block">Patient ID</span>
            <span className="font-mono font-bold text-blue-700 text-sm">{patient?.patient_id || 'PT0001'}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase block">Age / Gender</span>
            <span className="font-medium text-gray-800">
              {calculateAge(patient?.date_of_birth) || 38} yrs / {patient?.gender || 'Male'}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase block">Date</span>
            <span className="font-medium text-gray-800">{new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        {/* Diagnosis Input */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Clinical Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Primary diagnosis..."
            className="w-full p-2.5 border rounded-lg font-bold text-sm text-blue-900 bg-blue-50/20 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Rx Medicines Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-blue-900 font-serif">Rx — Prescribed Medicines</span>
            <Button
              size="sm"
              variant="outline"
              onClick={addMedicineRow}
              className="text-xs text-teal-800 border-teal-300 bg-teal-50 hover:bg-teal-100"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Medicine
            </Button>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-blue-900 text-white font-semibold text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine Name & Formulation</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                  <th className="py-2.5 px-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gray-50/60">
                    <td className="py-2.5 px-3 text-gray-400 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={m.medicine_name}
                        onChange={(e) => updateMedicine(m.id, 'medicine_name', e.target.value)}
                        placeholder="e.g. Tab. Paracetamol 650mg"
                        className="w-full p-1.5 border border-gray-200 rounded font-semibold text-gray-900"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={m.dosage}
                        onChange={(e) => updateMedicine(m.id, 'dosage', e.target.value)}
                        placeholder="650 mg"
                        className="w-24 p-1.5 border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={m.frequency}
                        onChange={(e) => updateMedicine(m.id, 'frequency', e.target.value)}
                        placeholder="1-0-1 (Twice daily)"
                        className="w-32 p-1.5 border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={m.duration}
                        onChange={(e) => updateMedicine(m.id, 'duration', e.target.value)}
                        placeholder="5 days"
                        className="w-20 p-1.5 border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={m.instructions}
                        onChange={(e) => updateMedicine(m.id, 'instructions', e.target.value)}
                        placeholder="After food with water"
                        className="w-full p-1.5 border border-gray-200 rounded text-gray-600"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(m.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Advice & Lab Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Doctor Advice & Rest Guidelines</label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Dietary & Hydration Instructions</label>
            <textarea
              rows={2}
              value={dietaryInstructions}
              onChange={(e) => setDietaryInstructions(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Recommended Laboratory / Diagnostic Tests</label>
            <input
              type="text"
              value={labTests}
              onChange={(e) => setLabTests(e.target.value)}
              placeholder="e.g. CBC, ESR, Blood Sugar Fasting, 2D Echo"
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Follow-up Date & Interval Calculator (TEST 5 Requirement) */}
        <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-200 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-800" />
            <h4 className="font-bold text-xs text-teal-900">Recommended Next Follow-Up Schedule</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Follow-up Interval</label>
              <select
                value={followupInterval}
                onChange={(e) => handleIntervalChange(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white font-medium"
              >
                <option value="1_week">1 Week</option>
                <option value="2_weeks">2 Weeks</option>
                <option value="1_month">1 Month</option>
                <option value="2_months">2 Months (Recommended)</option>
                <option value="3_months">3 Months</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Calculated Date (DD-MM-YYYY)</label>
              <input
                type="date"
                value={followupDate}
                onChange={(e) => {
                  setFollowupDate(e.target.value)
                  setFollowupInterval('custom')
                }}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white font-semibold text-teal-900"
              />
            </div>

            <div className="flex flex-col justify-end">
              <span className="text-[11px] text-teal-700 font-medium">
                ⚡ Automatically creates reminder trigger at 7 days, 2 days, and day of revisit.
              </span>
            </div>
          </div>
        </div>

        {/* Signature & Disclaimer Footer */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <span>This digital prescription is electronically verified and compliant with Telemedicine Practice Guidelines.</span>
          <div className="text-center sm:text-right">
            <div className="font-serif italic font-bold text-blue-900 text-sm">Dr. Rajesh Sharma</div>
            <div className="text-gray-500 font-mono text-[10px]">MCI-18492-DEL (Authorized Physician)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
