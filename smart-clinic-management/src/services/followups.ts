import { supabase } from '@/lib/supabase'
import type { Followup, FollowupFormData } from '@/types'
import { format, startOfDay, endOfDay } from 'date-fns'

export interface FollowupFilters {
  status?: string
  doctorId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export async function createFollowup(formData: FollowupFormData): Promise<Followup> {
  try {
    const { data, error } = await supabase
      .from('followups')
      .insert(formData)
      .select(`
        *,
        patients(id, patient_id, full_name, mobile),
        doctors(id, doctor_id, full_name, specialization),
        visits(id, visit_id, visit_date)
      `)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('createFollowup error:', err)
    throw err
  }
}

export async function getFollowups(
  filters: any = {}
): Promise<any> {
  try {
    const { status, doctorId, dateFrom, dateTo, page = 1, pageSize = 20 } = filters
    const offset = (page - 1) * pageSize

    let q = supabase
      .from('followups')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender),
        doctors(id, doctor_id, full_name, specialization),
        visits(id, visit_id, visit_date)
      `, { count: 'exact' })
      .order('scheduled_date', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (status) q = q.eq('status', status)
    if (doctorId) q = q.eq('doctor_id', doctorId)
    if (dateFrom) q = q.gte('scheduled_date', dateFrom)
    if (dateTo) q = q.lte('scheduled_date', dateTo)

    const { data, error, count } = await q
    if (error) throw new Error(error.message)
    const list: any = data || []
    list.data = data || []
    list.count = count || 0
    return list
  } catch (err) {
    console.error('getFollowups error:', err)
    throw err
  }
}

export async function getOverdueFollowups(): Promise<Followup[]> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')

    const { data, error } = await supabase
      .from('followups')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .lt('followup_date', today)
      .eq('status', 'pending')
      .order('followup_date', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getOverdueFollowups error:', err)
    throw err
  }
}

export async function getTodayFollowups(): Promise<Followup[]> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')

    const { data, error } = await supabase
      .from('followups')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .eq('followup_date', today)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getTodayFollowups error:', err)
    throw err
  }
}

export async function updateFollowupStatus(id: string, status: string): Promise<Followup> {
  try {
    const { data, error } = await supabase
      .from('followups')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('updateFollowupStatus error:', err)
    throw err
  }
}

export async function getPatientFollowups(patientId: string): Promise<Followup[]> {
  try {
    const { data, error } = await supabase
      .from('followups')
      .select(`
        *,
        doctors(id, doctor_id, full_name, specialization),
        visits(id, visit_id, visit_date)
      `)
      .eq('patient_id', patientId)
      .order('followup_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getPatientFollowups error:', err)
    throw err
  }
}
