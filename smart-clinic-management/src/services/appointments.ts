import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentFormData } from '@/types'
import { format, startOfDay, endOfDay } from 'date-fns'

export interface AppointmentFilters {
  date?: string
  doctorId?: string
  status?: string
  page?: number
  pageSize?: number
}

export async function getAppointments(filters: any = {}): Promise<any> {
  try {
    const { date, doctorId, doctor_id, status, page = 1, pageSize = 20 } = filters
    const offset = (page - 1) * pageSize
    const targetDoctor = doctorId || doctor_id

    let q = supabase
      .from('appointments')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth),
        doctors(id, doctor_id, full_name, specialization)
      `, { count: 'exact' })
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (date) {
      q = q.eq('appointment_date', date)
    }
    if (targetDoctor) {
      q = q.eq('doctor_id', targetDoctor)
    }
    if (status) {
      q = q.eq('status', status)
    }

    const { data, error, count } = await q
    if (error) throw new Error(error.message)
    const list: any = data || []
    list.data = data || []
    list.count = count || 0
    return list
  } catch (err) {
    console.error('getAppointments error:', err)
    throw err
  }
}

export async function getTodayAppointments(doctorId?: string): Promise<Appointment[]> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')

    let q = supabase
      .from('appointments')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .eq('appointment_date', today)
      .order('appointment_time', { ascending: true })

    if (doctorId) {
      q = q.eq('doctor_id', doctorId)
    }

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getTodayAppointments error:', err)
    throw err
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile, gender, date_of_birth, blood_group, allergies),
        doctors(id, doctor_id, full_name, specialization, qualification)
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('getAppointmentById error:', err)
    throw err
  }
}

export async function createAppointment(formData: AppointmentFormData): Promise<Appointment> {
  try {
    // Check for double booking
    const isAvailable = await checkSlotAvailability(
      formData.doctor_id,
      formData.appointment_date,
      formData.appointment_time
    )
    if (!isAvailable) {
      throw new Error('This time slot is already booked for the selected doctor.')
    }

    // Generate appointment ID
    const { data: idData, error: idError } = await supabase.rpc('generate_appointment_id')
    if (idError) throw new Error(idError.message)

    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...formData, appointment_id: idData, status: 'scheduled' })
      .select(`
        *,
        patients(id, patient_id, full_name, mobile),
        doctors(id, doctor_id, full_name, specialization)
      `)
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('createAppointment error:', err)
    throw err
  }
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('updateAppointmentStatus error:', err)
    throw err
  }
}

export async function cancelAppointment(id: string, reason?: string): Promise<Appointment> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancellation_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (err) {
    console.error('cancelAppointment error:', err)
    throw err
  }
}

export async function checkSlotAvailability(
  doctorId: string,
  date: string,
  time: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .not('status', 'eq', 'cancelled')

    if (error) throw new Error(error.message)
    return !data || data.length === 0
  } catch (err) {
    console.error('checkSlotAvailability error:', err)
    throw err
  }
}

export async function getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
  try {
    // All possible slots (9am - 5pm, 30 min intervals)
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00',
    ]

    // Get booked slots
    const { data: booked, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .not('status', 'eq', 'cancelled')

    if (error) throw new Error(error.message)

    // Check doctor leave
    const { data: leave } = await supabase
      .from('doctor_leaves')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('leave_date', date)

    if (leave && leave.length > 0) return []

    const bookedTimes = new Set((booked || []).map((b: any) => b.appointment_time))
    return allSlots.filter((slot) => !bookedTimes.has(slot))
  } catch (err) {
    console.error('getAvailableSlots error:', err)
    throw err
  }
}
