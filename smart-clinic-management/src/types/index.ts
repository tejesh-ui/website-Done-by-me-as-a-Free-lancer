// Core entity types
export interface Profile {
  id: string
  user_id: string
  full_name: string
  role: 'admin' | 'receptionist' | 'doctor'
  email: string
  phone?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Patient {
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

export interface Doctor {
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

export interface DoctorSchedule {
  id: string
  doctor_id: string
  day_of_week: number // 0=Sunday, 1=Monday...6=Saturday
  start_time: string
  end_time: string
  slot_duration_minutes: number
  max_appointments: number | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_consultation' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show'

export type AppointmentType = 'new' | 'follow_up' | 'emergency'
export type PaymentStatus = 'pending' | 'paid' | 'waived'
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'insurance'

export interface Appointment {
  id: string
  appointment_number: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  type: AppointmentType
  chief_complaint: string | null
  notes: string | null
  fee_amount: number | null
  payment_status: PaymentStatus | null
  payment_method: PaymentMethod | null
  created_by: string | null
  cancelled_reason: string | null
  created_at: string
  updated_at: string
  // Joined relations
  patient?: Patient
  doctor?: Doctor
}

export interface VitalSigns {
  weight_kg?: number | null
  height_cm?: number | null
  temperature?: number | null
  blood_pressure?: string | null
  pulse_rate?: number | null
  spo2?: number | null
}

export interface Visit {
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
  vital_signs: VitalSigns | null
  weight_kg: number | null
  height_cm: number | null
  temperature: number | null
  blood_pressure: string | null
  pulse_rate: number | null
  spo2: number | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined
  patient?: Patient
  doctor?: Doctor
  appointment?: Appointment
}

export interface PrescriptionItem {
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

export interface Prescription {
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
  // Joined
  items?: PrescriptionItem[]
  patient?: Patient
  doctor?: Doctor
  visit?: Visit
}

export type FollowupStatus = 'upcoming' | 'due_today' | 'overdue' | 'completed' | 'cancelled'

export interface Followup {
  id: string
  patient_id: string
  doctor_id: string
  prescription_id: string | null
  visit_id: string | null
  followup_date: string
  reason: string | null
  status: FollowupStatus
  notification_sent: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // Joined
  patient?: Patient
  doctor?: Doctor
}

export type NotificationType = 
  | 'appointment_reminder' 
  | 'followup_reminder' 
  | 'appointment_confirmation' 
  | 'appointment_cancellation' 
  | 'custom'

export type NotificationChannel = 'whatsapp' | 'sms' | 'email'
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed'

export interface Notification {
  id: string
  patient_id: string
  appointment_id: string | null
  followup_id: string | null
  type: NotificationType
  channel: NotificationChannel
  status: NotificationStatus
  message: string
  sent_at: string | null
  error_message: string | null
  created_at: string
  // Joined
  patient?: Patient
}

export interface ClinicSettings {
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
  notification_settings: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// Dashboard stats types
export interface DashboardStats {
  todayAppointments: number
  pendingAppointments: number
  totalPatients: number
  newPatientsThisMonth: number
  todayRevenue: number
  monthRevenue: number
  pendingFollowups: number
  overdueFollowups: number
}

// Form types
export interface PatientFormData {
  full_name: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  phone: string
  alternate_phone?: string
  email?: string
  address?: string
  city?: string
  blood_group?: string
  allergies?: string
  medical_history?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export interface AppointmentFormData {
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  type: AppointmentType
  chief_complaint?: string
  notes?: string
  fee_amount?: number
}

export interface VisitFormData {
  chief_complaint?: string
  history_of_present_illness?: string
  examination_findings?: string
  diagnosis?: string
  treatment_plan?: string
  weight_kg?: number
  height_cm?: number
  temperature?: number
  blood_pressure?: string
  pulse_rate?: number
  spo2?: number
  notes?: string
}

export interface PrescriptionFormData {
  diagnosis?: string
  notes?: string
  followup_interval?: string
  items: PrescriptionItemFormData[]
}

export interface PrescriptionItemFormData {
  medicine_name: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
  quantity?: number
}

// Pagination / filter types
export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface AppointmentFilters {
  date?: string
  doctor_id?: string
  status?: AppointmentStatus
  type?: AppointmentType
  search?: string
}

export interface PatientFilters {
  search?: string
  gender?: string
  city?: string
  is_active?: boolean
}

export interface DoctorFormData {
  full_name: string
  specialization: string
  qualification?: string
  registration_number?: string
  phone?: string
  email?: string
  consultation_duration?: number
  consultation_fee?: number
  follow_up_fee?: number
  availability_status?: 'available' | 'unavailable' | 'on_leave'
}

export interface FollowupFormData {
  patient_id: string
  visit_id?: string
  doctor_id: string
  scheduled_date?: string
  followup_date?: string
  interval_type?: string
  instructions?: string
  reason?: string
  status?: FollowupStatus
}
