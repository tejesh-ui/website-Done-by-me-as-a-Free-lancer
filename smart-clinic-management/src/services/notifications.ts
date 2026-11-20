import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'
import { addDays, format, subDays } from 'date-fns'

export type NotificationChannel = 'whatsapp' | 'sms' | 'email'

export async function scheduleFollowupReminders(followupId: string): Promise<void> {
  try {
    // Fetch followup
    const { data: followup, error } = await supabase
      .from('followups')
      .select('*, patients(id, full_name, mobile, email)')
      .eq('id', followupId)
      .single()

    if (error) throw new Error(error.message)
    if (!followup) throw new Error('Followup not found')

    const rawDate = (followup as any).scheduled_date || (followup as any).followup_date || new Date().toISOString().split('T')[0]
    const followupDate = new Date(rawDate)
    const patientName = (followup as any).patients?.full_name || 'Patient'

    const reminders = [
      {
        followup_id: followupId,
        patient_id: (followup as any).patient_id,
        scheduled_at: subDays(followupDate, 7).toISOString(),
        message: `Dear ${patientName}, this is a reminder from Arogya Clinic for your follow-up visit on ${rawDate}.`,
        channel: 'whatsapp',
        status: 'scheduled',
      },
      {
        followup_id: followupId,
        patient_id: (followup as any).patient_id,
        scheduled_at: subDays(followupDate, 2).toISOString(),
        message: `Dear ${patientName}, your doctor follow-up visit is in 2 days on ${rawDate}.`,
        channel: 'whatsapp',
        status: 'scheduled',
      },
      {
        followup_id: followupId,
        patient_id: (followup as any).patient_id,
        scheduled_at: followupDate.toISOString(),
        message: `Dear ${patientName}, today is your doctor follow-up appointment day. Tel: +91-9876543210.`,
        channel: 'whatsapp',
        status: 'scheduled',
      },
    ]

    const { error: insertError } = await supabase.from('notifications').insert(reminders)
    if (insertError) throw new Error(insertError.message)
  } catch (err) {
    console.error('scheduleFollowupReminders error:', err)
    throw err
  }
}

export async function sendManualReminder(
  arg1: any,
  followupId?: string,
  channel?: NotificationChannel,
  message?: string
): Promise<void> {
  try {
    const patientId = typeof arg1 === 'object' ? arg1.patient_id : arg1
    const flId = typeof arg1 === 'object' ? arg1.followup_id : followupId
    const ch = typeof arg1 === 'object' ? arg1.channel : channel || 'whatsapp'
    const msg = typeof arg1 === 'object' ? arg1.message : message || ''

    const { error } = await supabase.from('notifications').insert({
      patient_id: patientId,
      followup_id: flId || null,
      channel: ch,
      message: msg,
      status: 'sent',
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
    })

    if (error) throw new Error(error.message)
  } catch (err) {
    console.error('sendManualReminder error:', err)
    throw err
  }
}

export async function getNotificationHistory(patientId?: string): Promise<Notification[]> {
  try {
    let q = supabase
      .from('notifications')
      .select(`
        *,
        patients(id, patient_id, full_name, mobile),
        followups(id, followup_date)
      `)
      .order('created_at', { ascending: false })

    if (patientId) {
      q = q.eq('patient_id', patientId)
    }

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data || []
  } catch (err) {
    console.error('getNotificationHistory error:', err)
    throw err
  }
}

export async function checkChannelConfigured(channel: NotificationChannel): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('notification_config')
      .single()

    if (error) return false

    const config = data?.notification_config || {}
    const channelConfig = config[channel]
    if (!channelConfig) return false

    switch (channel) {
      case 'whatsapp':
        return !!(channelConfig.api_key && channelConfig.phone_number)
      case 'sms':
        return !!(channelConfig.api_key && channelConfig.sender_id)
      case 'email':
        return !!(channelConfig.smtp_host && channelConfig.from_email)
      default:
        return false
    }
  } catch (err) {
    console.error('checkChannelConfigured error:', err)
    return false
  }
}

export async function markNotificationSent(
  id: string,
  success: boolean,
  errorMsg?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        status: success ? 'sent' : 'failed',
        sent_at: success ? new Date().toISOString() : null,
        error_message: errorMsg || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(error.message)
  } catch (err) {
    console.error('markNotificationSent error:', err)
    throw err
  }
}
