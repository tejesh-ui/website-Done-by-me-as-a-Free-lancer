import { supabase } from '@/lib/supabase'

export interface ClinicSettingsData {
  id?: string
  clinic_name: string
  logo_url?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  phone: string
  alternate_phone?: string | null
  email?: string | null
  website?: string | null
  working_days: string[]
  working_hours_start: string
  working_hours_end: string
  currency: string
  timezone: string
  whatsapp_configured: boolean
  sms_configured: boolean
  email_configured: boolean
}

export async function getClinicSettings(): Promise<ClinicSettingsData> {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return getDefaultSettings()
      }
      throw error
    }

    return data as ClinicSettingsData
  } catch (err) {
    console.warn('getClinicSettings error, using defaults:', err)
    return getDefaultSettings()
  }
}

export async function updateClinicSettings(settings: Partial<ClinicSettingsData>): Promise<ClinicSettingsData> {
  try {
    const current = await getClinicSettings()
    if (current.id) {
      const { data, error } = await supabase
        .from('clinic_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', current.id)
        .select()
        .single()

      if (error) throw error
      return data as ClinicSettingsData
    } else {
      const { data, error } = await supabase
        .from('clinic_settings')
        .insert({ ...getDefaultSettings(), ...settings })
        .select()
        .single()

      if (error) throw error
      return data as ClinicSettingsData
    }
  } catch (err) {
    console.error('updateClinicSettings error:', err)
    throw err
  }
}

function getDefaultSettings(): ClinicSettingsData {
  return {
    clinic_name: 'Smart Clinic',
    logo_url: null,
    address: 'Apex Medical Complex, Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    phone: '+91-9876543210',
    alternate_phone: '+91-9876543211',
    email: 'contact@arogyaclinic.in',
    website: 'https://www.arogyaclinic.in',
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    working_hours_start: '09:00',
    working_hours_end: '20:00',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    whatsapp_configured: true,
    sms_configured: true,
    email_configured: true
  }
}
