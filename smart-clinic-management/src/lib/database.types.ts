export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          role: 'admin' | 'receptionist' | 'doctor'
          email: string
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          role: 'admin' | 'receptionist' | 'doctor'
          email: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          role?: 'admin' | 'receptionist' | 'doctor'
          email?: string
          phone?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          patient_id: string
          full_name: string
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          phone: string
          alternate_phone: string | null
          email: string | null
          address: string | null
          city: string | null
          blood_group: string | null
          allergies: string | null
          medical_history: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string
          full_name: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          phone: string
          alternate_phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          blood_group?: string | null
          allergies?: string | null
          medical_history?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          phone?: string
          alternate_phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          blood_group?: string | null
          allergies?: string | null
          medical_history?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          profile_id: string | null
          full_name: string
          specialization: string
          qualification: string | null
          registration_number: string | null
          phone: string | null
          email: string | null
          consultation_fee: number
          follow_up_fee: number
          experience_years: number | null
          bio: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          full_name: string
          specialization: string
          qualification?: string | null
          registration_number?: string | null
          phone?: string | null
          email?: string | null
          consultation_fee?: number
          follow_up_fee?: number
          experience_years?: number | null
          bio?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          specialization?: string
          qualification?: string | null
          registration_number?: string | null
          phone?: string | null
          email?: string | null
          consultation_fee?: number
          follow_up_fee?: number
          experience_years?: number | null
          bio?: string | null
          avatar_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      doctor_schedules: {
        Row: {
          id: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration_minutes: number
          max_appointments: number | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration_minutes?: number
          max_appointments?: number | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          slot_duration_minutes?: number
          max_appointments?: number | null
          is_available?: boolean
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          appointment_number: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status: 'pending' | 'confirmed' | 'checked_in' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'
          type: 'new' | 'follow_up' | 'emergency'
          chief_complaint: string | null
          notes: string | null
          fee_amount: number | null
          payment_status: 'pending' | 'paid' | 'waived' | null
          payment_method: 'cash' | 'card' | 'upi' | 'insurance' | null
          created_by: string | null
          cancelled_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_number?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'
          type?: 'new' | 'follow_up' | 'emergency'
          chief_complaint?: string | null
          notes?: string | null
          fee_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'waived' | null
          payment_method?: 'cash' | 'card' | 'upi' | 'insurance' | null
          created_by?: string | null
          cancelled_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'
          type?: 'new' | 'follow_up' | 'emergency'
          chief_complaint?: string | null
          notes?: string | null
          fee_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'waived' | null
          payment_method?: 'cash' | 'card' | 'upi' | 'insurance' | null
          cancelled_reason?: string | null
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          appointment_id: string
          patient_id: string
          doctor_id: string
          visit_date: string
          chief_complaint: string | null
          history_of_present_illness: string | null
          examination_findings: string | null
          diagnosis: string | null
          treatment_plan: string | null
          vital_signs: Json | null
          weight_kg: number | null
          height_cm: number | null
          temperature: number | null
          blood_pressure: string | null
          pulse_rate: number | null
          spo2: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          patient_id: string
          doctor_id: string
          visit_date?: string
          chief_complaint?: string | null
          history_of_present_illness?: string | null
          examination_findings?: string | null
          diagnosis?: string | null
          treatment_plan?: string | null
          vital_signs?: Json | null
          weight_kg?: number | null
          height_cm?: number | null
          temperature?: number | null
          blood_pressure?: string | null
          pulse_rate?: number | null
          spo2?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chief_complaint?: string | null
          history_of_present_illness?: string | null
          examination_findings?: string | null
          diagnosis?: string | null
          treatment_plan?: string | null
          vital_signs?: Json | null
          weight_kg?: number | null
          height_cm?: number | null
          temperature?: number | null
          blood_pressure?: string | null
          pulse_rate?: number | null
          spo2?: number | null
          notes?: string | null
          updated_at?: string
        }
      }
      prescriptions: {
        Row: {
          id: string
          visit_id: string
          patient_id: string
          doctor_id: string
          prescription_date: string
          diagnosis: string | null
          notes: string | null
          followup_date: string | null
          followup_interval: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          visit_id: string
          patient_id: string
          doctor_id: string
          prescription_date?: string
          diagnosis?: string | null
          notes?: string | null
          followup_date?: string | null
          followup_interval?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prescription_date?: string
          diagnosis?: string | null
          notes?: string | null
          followup_date?: string | null
          followup_interval?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      prescription_items: {
        Row: {
          id: string
          prescription_id: string
          medicine_name: string
          dosage: string | null
          frequency: string | null
          duration: string | null
          instructions: string | null
          quantity: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          prescription_id: string
          medicine_name: string
          dosage?: string | null
          frequency?: string | null
          duration?: string | null
          instructions?: string | null
          quantity?: number | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          medicine_name?: string
          dosage?: string | null
          frequency?: string | null
          duration?: string | null
          instructions?: string | null
          quantity?: number | null
          sort_order?: number
        }
      }
      followups: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          prescription_id: string | null
          visit_id: string | null
          followup_date: string
          reason: string | null
          status: 'upcoming' | 'due_today' | 'overdue' | 'completed' | 'cancelled'
          notification_sent: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          prescription_id?: string | null
          visit_id?: string | null
          followup_date: string
          reason?: string | null
          status?: 'upcoming' | 'due_today' | 'overdue' | 'completed' | 'cancelled'
          notification_sent?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          followup_date?: string
          reason?: string | null
          status?: 'upcoming' | 'due_today' | 'overdue' | 'completed' | 'cancelled'
          notification_sent?: boolean
          notes?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          patient_id: string
          appointment_id: string | null
          followup_id: string | null
          type: 'appointment_reminder' | 'followup_reminder' | 'appointment_confirmation' | 'appointment_cancellation' | 'custom'
          channel: 'whatsapp' | 'sms' | 'email'
          status: 'pending' | 'sent' | 'delivered' | 'failed'
          message: string
          sent_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_id?: string | null
          followup_id?: string | null
          type: 'appointment_reminder' | 'followup_reminder' | 'appointment_confirmation' | 'appointment_cancellation' | 'custom'
          channel: 'whatsapp' | 'sms' | 'email'
          status?: 'pending' | 'sent' | 'delivered' | 'failed'
          message: string
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          status?: 'pending' | 'sent' | 'delivered' | 'failed'
          sent_at?: string | null
          error_message?: string | null
        }
      }
      clinic_settings: {
        Row: {
          id: string
          clinic_name: string
          address: string | null
          city: string | null
          state: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          registration_number: string | null
          gstin: string | null
          working_hours_start: string
          working_hours_end: string
          appointment_slot_duration: number
          whatsapp_enabled: boolean
          whatsapp_api_url: string | null
          notification_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_name: string
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          registration_number?: string | null
          gstin?: string | null
          working_hours_start?: string
          working_hours_end?: string
          appointment_slot_duration?: number
          whatsapp_enabled?: boolean
          whatsapp_api_url?: string | null
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          clinic_name?: string
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          registration_number?: string | null
          gstin?: string | null
          working_hours_start?: string
          working_hours_end?: string
          appointment_slot_duration?: number
          whatsapp_enabled?: boolean
          whatsapp_api_url?: string | null
          notification_settings?: Json | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
