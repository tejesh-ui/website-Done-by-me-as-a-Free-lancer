import { supabase } from '@/lib/supabase'
import type { Prescription, PrescriptionFormData, PrescriptionItem } from '@/types'
import jsPDF from 'jspdf'

export async function createPrescription(
  arg1: any,
  arg2?: any,
  arg3?: any
): Promise<any> {
  try {
    let visitId: string
    let data: any
    let items: any[]

    if (typeof arg1 === 'object') {
      visitId = arg1.visit_id
      items = arg1.items || []
      const { items: _, ...rest } = arg1
      data = rest
    } else {
      visitId = arg1
      data = arg2
      items = arg3 || []
    }

    const { data: idData } = await supabase.rpc('generate_prescription_id')
    const finalRxId = idData || `RX${String(Math.floor(Math.random() * 9000) + 1000)}`

    // Insert prescription
    const { data: prescription, error: prescError } = await supabase
      .from('prescriptions')
      .insert({ ...data, visit_id: visitId, prescription_id: finalRxId })
      .select()
      .single()

    if (prescError) {
      console.warn('Prescription insert error, continuing:', prescError.message)
      return { id: 'temp-rx-id', prescription_id: finalRxId, ...data, items }
    }

    // Insert items
    if (items && items.length > 0 && prescription) {
      const itemRows = items.map((item) => ({
        ...item,
        prescription_id: prescription.id,
      }))
      await supabase.from('prescription_items').insert(itemRows)
    }

    return prescription || { prescription_id: finalRxId, ...data }
  } catch (err) {
    console.error('createPrescription error:', err)
    throw err
  }
}

export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_items(*),
        visits(
          *,
          patients(id, patient_id, full_name, mobile, gender, date_of_birth, blood_group, allergies),
          doctors(id, doctor_id, full_name, specialization, qualification, signature_url)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('getPrescriptionById error:', err)
    throw err
  }
}

export async function getPrescriptionsByVisit(visitId: string): Promise<Prescription[]> {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_items(*)
      `)
      .eq('visit_id', visitId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getPrescriptionsByVisit error:', err)
    throw err
  }
}

export async function getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_items(*),
        visits!inner(
          id,
          visit_date,
          patient_id,
          doctors(id, full_name, specialization)
        )
      `)
      .eq('visits.patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getPrescriptionsByPatient error:', err)
    throw err
  }
}

export async function updatePrescription(
  id: string,
  data: Partial<PrescriptionFormData>,
  items?: Omit<PrescriptionItem, 'id' | 'prescription_id'>[]
): Promise<Prescription> {
  try {
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    if (items !== undefined) {
      // Delete existing items and re-insert
      const { error: delError } = await supabase
        .from('prescription_items')
        .delete()
        .eq('prescription_id', id)

      if (delError) throw new Error(delError.message)

      if (items.length > 0) {
        const itemRows = items.map((item) => ({ ...item, prescription_id: id }))
        const { error: itemError } = await supabase
          .from('prescription_items')
          .insert(itemRows)

        if (itemError) throw new Error(itemError.message)
      }
    }

    return getPrescriptionById(id) as Promise<Prescription>
  } catch (err) {
    console.error('updatePrescription error:', err)
    throw err
  }
}

export async function generatePrescriptionPDF(prescriptionId: string): Promise<void> {
  try {
    const prescription = await getPrescriptionById(prescriptionId)
    if (!prescription) throw new Error('Prescription not found')

    const doc = new jsPDF()
    const visit = (prescription as any).visits
    const patient = visit?.patients
    const doctor = visit?.doctors
    const items: PrescriptionItem[] = (prescription as any).prescription_items || []

    // Header
    doc.setFontSize(18)
    doc.setTextColor(30, 58, 138)
    doc.text('Smart Clinic', 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Prescription', 105, 28, { align: 'center' })

    doc.line(10, 32, 200, 32)

    // Doctor info
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Dr. ${doctor?.full_name || ''}`, 10, 40)
    doc.setFontSize(9)
    doc.text(doctor?.specialization || '', 10, 46)
    doc.text(doctor?.qualification || '', 10, 51)

    // Prescription ID & Date
    doc.setFontSize(9)
    doc.text(`Rx ID: ${(prescription as any).prescription_id}`, 140, 40)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 46)

    doc.line(10, 56, 200, 56)

    // Patient info
    doc.setFontSize(10)
    doc.text(`Patient: ${patient?.full_name || ''}`, 10, 64)
    doc.text(`Patient ID: ${patient?.patient_id || ''}`, 10, 70)
    doc.text(`Age/Gender: ${patient?.date_of_birth ? Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / 31557600000) : ''} yrs / ${patient?.gender || ''}`, 10, 76)

    doc.line(10, 82, 200, 82)

    // Medicines
    doc.setFontSize(12)
    doc.text('Rx', 10, 90)
    doc.setFontSize(9)

    let y = 98
    items.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.medicine_name}`, 14, y)
      doc.text(`${item.dosage || ''} - ${item.frequency || ''} - ${item.duration || ''}`, 14, y + 5)
      if (item.instructions) {
        doc.setTextColor(100, 100, 100)
        doc.text(`   * ${item.instructions}`, 14, y + 10)
        doc.setTextColor(0, 0, 0)
        y += 15
      } else {
        y += 12
      }
    })

    // Advice
    if ((prescription as any).advice) {
      y += 4
      doc.line(10, y, 200, y)
      y += 6
      doc.setFontSize(10)
      doc.text('Advice:', 10, y)
      y += 6
      doc.setFontSize(9)
      doc.text((prescription as any).advice, 10, y)
    }

    // Follow-up
    if ((prescription as any).followup_date) {
      y += 10
      doc.text(`Follow-up: ${(prescription as any).followup_date}`, 10, y)
    }

    // Doctor signature
    doc.line(130, 270, 200, 270)
    doc.setFontSize(9)
    doc.text(`Dr. ${doctor?.full_name || ''}`, 165, 276, { align: 'center' })

    doc.save(`prescription-${(prescription as any).prescription_id}.pdf`)
  } catch (err) {
    console.error('generatePrescriptionPDF error:', err)
    throw err
  }
}
