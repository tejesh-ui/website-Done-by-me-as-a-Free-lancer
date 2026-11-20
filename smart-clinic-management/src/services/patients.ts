import { supabase } from '@/lib/supabase'
import type { Patient, PatientFormData } from '@/types'

export interface SearchPatientsResult {
  data: Patient[]
  count: number
  error?: string
}

export async function searchPatients(query: string, limit = 50, offset = 0): Promise<Patient[]> {
  try {
    let q = supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (query && query.trim()) {
      const trimmed = query.trim()
      q = q.or(
        `full_name.ilike.%${trimmed}%,mobile.ilike.%${trimmed}%,patient_id.ilike.%${trimmed}%,email.ilike.%${trimmed}%`
      )
    }

    const { data, error } = await q

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('searchPatients error:', err)
    throw err
  }
}

export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('getPatientById error:', err)
    throw err
  }
}

export async function getPatientByPatientId(patientId: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', patientId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return data
  } catch (err) {
    console.error('getPatientByPatientId error:', err)
    throw err
  }
}

export async function createPatient(formData: PatientFormData): Promise<Patient> {
  try {
    // Generate patient ID via DB function
    const { data: idData, error: idError } = await supabase.rpc('generate_patient_id')
    if (idError) throw new Error(idError.message)

    const { data, error } = await supabase
      .from('patients')
      .insert({ ...formData, patient_id: idData })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('createPatient error:', err)
    throw err
  }
}

export async function updatePatient(id: string, formData: Partial<PatientFormData>): Promise<Patient> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('updatePatient error:', err)
    throw err
  }
}

export interface DuplicateCheckResult {
  hasDuplicates: boolean
  patients: Patient[]
}

export async function checkDuplicates(mobile: string, name: string): Promise<DuplicateCheckResult> {
  try {
    const q1 = mobile ? await supabase.from('patients').select('*').eq('mobile', mobile) : { data: [] }
    const q2 = name ? await supabase.from('patients').select('*').ilike('full_name', `%${name}%`) : { data: [] }

    const allPatients: Patient[] = []
    const combined = [...(q1.data || []), ...(q2.data || [])]

    for (const p of combined) {
      if (!allPatients.find((x) => x.id === p.id)) {
        allPatients.push(p as any)
      }
    }

    return { hasDuplicates: allPatients.length > 0, patients: allPatients }
  } catch (err) {
    console.error('checkDuplicates error:', err)
    throw err
  }
}

export async function getPatientVisitHistory(patientId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        doctors(id, full_name, specialization),
        prescriptions(
          *,
          prescription_items(*)
        ),
        followups(*)
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getPatientVisitHistory error:', err)
    throw err
  }
}
