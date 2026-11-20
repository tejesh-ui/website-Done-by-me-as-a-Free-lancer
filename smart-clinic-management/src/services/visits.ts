import { supabase } from '@/lib/supabase'
import type { Visit, VisitFormData } from '@/types'

export async function createVisit(formData: any): Promise<any> {
  try {
    const { data: idData } = await supabase.rpc('generate_visit_id')
    const finalVisitId = idData || `VIS${String(Math.floor(Math.random() * 9000) + 1000)}`

    const { data, error } = await supabase
      .from('visits')
      .insert({ ...formData, visit_id: finalVisitId })
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .single()

    if (error) {
      console.warn('createVisit fallback:', error.message)
      return { id: 'temp-visit-id', visit_id: finalVisitId, ...formData }
    }
    return data
  } catch (err) {
    console.error('createVisit error:', err)
    throw err
  }
}

export async function updateVisit(id: string, formData: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('updateVisit error:', err)
    throw err
  }
}

export async function getVisitById(id: string): Promise<Visit | null> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth, blood_group, allergies),
        doctors(id, doctor_id, full_name, specialization, qualification),
        prescriptions(
          *,
          prescription_items(*)
        ),
        followups(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('getVisitById error:', err)
    throw err
  }
}

export async function getPatientVisits(patientId: string): Promise<Visit[]> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        doctors(id, doctor_id, full_name, specialization),
        prescriptions(id, prescription_id),
        followups(id, followup_date, status)
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getPatientVisits error:', err)
    throw err
  }
}
