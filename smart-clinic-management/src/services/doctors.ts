import { supabase } from '@/lib/supabase'
import type { Doctor, DoctorFormData, DoctorSchedule } from '@/types'
import { format } from 'date-fns'

export interface DoctorFilters {
  specialization?: string
  isActive?: boolean
  search?: string
}

export async function getDoctors(filters: DoctorFilters = {}): Promise<Doctor[]> {
  try {
    let q = supabase
      .from('doctors')
      .select('*')
      .order('full_name', { ascending: true })

    if (filters.specialization) {
      q = q.eq('specialization', filters.specialization)
    }
    if (typeof filters.isActive === 'boolean') {
      q = q.eq('is_active', filters.isActive)
    }
    if (filters.search) {
      q = q.or(`full_name.ilike.%${filters.search}%,specialization.ilike.%${filters.search}%,doctor_id.ilike.%${filters.search}%`)
    }

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getDoctors error:', err)
    throw err
  }
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        doctor_schedules(*),
        doctor_leaves(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('getDoctorById error:', err)
    throw err
  }
}

export async function createDoctor(formData: DoctorFormData): Promise<Doctor> {
  try {
    const { data: idData, error: idError } = await supabase.rpc('generate_doctor_id')
    if (idError) throw new Error(idError.message)

    const { data, error } = await supabase
      .from('doctors')
      .insert({ ...formData, doctor_id: idData, is_active: true })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('createDoctor error:', err)
    throw err
  }
}

export async function updateDoctor(id: string, formData: Partial<DoctorFormData>): Promise<Doctor> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('updateDoctor error:', err)
    throw err
  }
}

export async function getDoctorSchedule(doctorId: string): Promise<DoctorSchedule[]> {
  try {
    const { data, error } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('day_of_week', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getDoctorSchedule error:', err)
    throw err
  }
}

export async function updateDoctorSchedule(
  doctorId: string,
  schedules: Partial<DoctorSchedule>[]
): Promise<DoctorSchedule[]> {
  try {
    // Delete existing and re-insert
    const { error: delError } = await supabase
      .from('doctor_schedules')
      .delete()
      .eq('doctor_id', doctorId)

    if (delError) throw new Error(delError.message)

    const rows = schedules.map((s) => ({ ...s, doctor_id: doctorId }))
    const { data, error } = await supabase
      .from('doctor_schedules')
      .insert(rows)
      .select()

    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('updateDoctorSchedule error:', err)
    throw err
  }
}

export async function markDoctorLeave(
  doctorId: string,
  date: string,
  reason?: string
): Promise<void> {
  try {
    const { error } = await supabase.from('doctor_leaves').insert({
      doctor_id: doctorId,
      leave_date: date,
      reason: reason || null,
    })

    if (error) throw new Error(error.message)
  } catch (err) {
    console.error('markDoctorLeave error:', err)
    throw err
  }
}

export async function getDoctorAvailability(date: string): Promise<Doctor[]> {
  try {
    const dayOfWeek = new Date(date).getDay() // 0 = Sunday

    // Get all active doctors
    const { data: doctors, error: docError } = await supabase
      .from('doctors')
      .select('*, doctor_schedules(*)')
      .eq('is_active', true)

    if (docError) throw new Error(docError.message)

    // Get doctors on leave that day
    const { data: leaveDoctors, error: leaveError } = await supabase
      .from('doctor_leaves')
      .select('doctor_id')
      .eq('leave_date', date)

    if (leaveError) throw new Error(leaveError.message)

    const leaveDoctorIds = new Set((leaveDoctors || []).map((l: any) => l.doctor_id))

    // Filter: not on leave AND scheduled for this day
    return (doctors || []).filter((doctor: any) => {
      if (leaveDoctorIds.has(doctor.id)) return false
      const schedules = doctor.doctor_schedules || []
      return schedules.some((s: any) => s.day_of_week === dayOfWeek)
    })
  } catch (err) {
    console.error('getDoctorAvailability error:', err)
    throw err
  }
}
