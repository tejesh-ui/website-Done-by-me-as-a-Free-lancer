-- ============================================================
-- SMART CLINIC MANAGEMENT SYSTEM - INITIAL SCHEMA
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES TABLE (linked to Supabase Auth users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'receptionist', 'doctor')),
  email TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLINIC SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS clinic_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name TEXT NOT NULL DEFAULT 'Smart Clinic',
  logo_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT NOT NULL DEFAULT '',
  alternate_phone TEXT,
  email TEXT,
  website TEXT,
  working_days TEXT[] NOT NULL DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday'],
  working_hours_start TIME NOT NULL DEFAULT '09:00',
  working_hours_end TIME NOT NULL DEFAULT '18:00',
  currency TEXT NOT NULL DEFAULT 'INR',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  whatsapp_api_key TEXT,
  whatsapp_phone_number_id TEXT,
  whatsapp_configured BOOLEAN NOT NULL DEFAULT false,
  sms_api_key TEXT,
  sms_sender_id TEXT,
  sms_configured BOOLEAN NOT NULL DEFAULT false,
  email_api_key TEXT,
  email_from TEXT,
  email_configured BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO clinic_settings (clinic_name, phone)
VALUES ('Smart Clinic', '+91-0000000000')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEQUENCES (concurrency-safe unique IDs)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS patient_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS doctor_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS appointment_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS visit_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS prescription_id_seq START 1;

-- ============================================================
-- PATIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  alternate_mobile TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  city TEXT,
  blood_group TEXT CHECK (blood_group IN ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
  emergency_contact TEXT,
  emergency_contact_name TEXT,
  notes TEXT,
  consent_whatsapp BOOLEAN NOT NULL DEFAULT false,
  consent_sms BOOLEAN NOT NULL DEFAULT false,
  consent_email BOOLEAN NOT NULL DEFAULT false,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_name_gin ON patients USING gin(to_tsvector('simple', full_name));
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- ============================================================
-- DOCTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id TEXT NOT NULL UNIQUE,
  profile_id UUID REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  consultation_duration INTEGER NOT NULL DEFAULT 15,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available','unavailable','on_leave')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_availability ON doctors(availability_status) WHERE is_active = true;

-- ============================================================
-- DOCTOR SCHEDULES
-- ============================================================
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(doctor_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor ON doctor_schedules(doctor_id);

-- ============================================================
-- DOCTOR LEAVES
-- ============================================================
CREATE TABLE IF NOT EXISTS doctor_leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  leave_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(doctor_id, leave_date)
);

CREATE INDEX IF NOT EXISTS idx_doctor_leaves_date ON doctor_leaves(leave_date);
CREATE INDEX IF NOT EXISTS idx_doctor_leaves_doctor ON doctor_leaves(doctor_id);

-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE RESTRICT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT NOT NULL DEFAULT 'first_visit' CHECK (appointment_type IN ('first_visit','follow_up','emergency','routine')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','checked_in','in_consultation','completed','cancelled','no_show')),
  reason_for_visit TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);

-- ============================================================
-- VISITS TABLE (Medical Consultation Records)
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE RESTRICT NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_type TEXT NOT NULL DEFAULT 'first_visit' CHECK (visit_type IN ('first_visit','follow_up','emergency','routine')),
  chief_complaint TEXT,
  symptoms TEXT,
  medical_history TEXT,
  diagnosis TEXT,
  blood_pressure TEXT,
  pulse_rate INTEGER,
  temperature DECIMAL(4,1),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  oxygen_saturation INTEGER,
  clinical_notes TEXT,
  treatment_plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_appointment ON visits(appointment_id);

-- ============================================================
-- PRESCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id TEXT NOT NULL UNIQUE,
  visit_id UUID REFERENCES visits(id) ON DELETE RESTRICT NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE RESTRICT NOT NULL,
  prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis TEXT NOT NULL,
  advice TEXT,
  dietary_instructions TEXT,
  lab_tests TEXT,
  follow_up_date DATE,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_visit ON prescriptions(visit_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_date ON prescriptions(prescription_date);

-- ============================================================
-- PRESCRIPTION ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  route TEXT DEFAULT 'oral',
  instructions TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription ON prescription_items(prescription_id);

-- ============================================================
-- FOLLOWUPS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  visit_id UUID REFERENCES visits(id) ON DELETE RESTRICT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE RESTRICT NOT NULL,
  scheduled_date DATE NOT NULL,
  interval_type TEXT,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','due_today','overdue','completed','cancelled')),
  completed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followups_patient ON followups(patient_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON followups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_followups_status ON followups(status);
CREATE INDEX IF NOT EXISTS idx_followups_doctor ON followups(doctor_id);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT NOT NULL,
  followup_id UUID REFERENCES followups(id),
  appointment_id UUID REFERENCES appointments(id),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp','sms','email')),
  message TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','delivered','failed','cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_at);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- COMMENTS: Table purposes
-- ============================================================
COMMENT ON TABLE profiles IS 'Application user profiles linked to Supabase auth.users';
COMMENT ON TABLE clinic_settings IS 'Single-row clinic configuration (singleton pattern)';
COMMENT ON TABLE patients IS 'Patient registry - core entity of the system';
COMMENT ON TABLE doctors IS 'Doctor profiles with scheduling info';
COMMENT ON TABLE doctor_schedules IS 'Weekly recurring schedule per doctor';
COMMENT ON TABLE doctor_leaves IS 'Date-specific leave exceptions per doctor';
COMMENT ON TABLE appointments IS 'Appointment bookings with conflict prevention (unique doctor+date+time)';
COMMENT ON TABLE visits IS 'Actual consultation records created by doctors';
COMMENT ON TABLE prescriptions IS 'Prescription header - restricted to doctor/admin only';
COMMENT ON TABLE prescription_items IS 'Individual medicine line items in a prescription';
COMMENT ON TABLE followups IS 'Scheduled follow-up reminders derived from visits';
COMMENT ON TABLE notifications IS 'Multi-channel notification queue (WhatsApp/SMS/Email)';
COMMENT ON TABLE audit_logs IS 'Immutable audit trail of all data modifications';
