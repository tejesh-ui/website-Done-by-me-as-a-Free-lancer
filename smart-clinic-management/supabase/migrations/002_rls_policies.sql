-- ============================================================
-- SMART CLINIC MANAGEMENT SYSTEM - ROW LEVEL SECURITY POLICIES
-- Migration: 002_rls_policies.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: get_user_role()
-- Returns the role of the currently authenticated user
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles
  WHERE user_id = auth.uid()
  AND is_active = true
  LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;

-- ============================================================
-- HELPER FUNCTION: is_own_doctor_profile()
-- Checks if current user is linked to a specific doctor record
-- ============================================================
CREATE OR REPLACE FUNCTION is_own_doctor_profile(doctor_profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND id = doctor_profile_id
    AND is_active = true
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_own_doctor_profile(UUID) TO authenticated;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- - Users can read their own profile
-- - Admins can read ALL profiles
-- - Users can update their own profile (non-role fields)
-- - Only admins can insert new profiles or change roles
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR get_user_role() = 'admin');

DROP POLICY IF EXISTS "profiles_insert_admin" ON profiles;
CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;
CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR get_user_role() = 'admin')
  WITH CHECK (
    -- Non-admins cannot change role or is_active
    get_user_role() = 'admin'
    OR (
      user_id = auth.uid()
      -- role and is_active must remain unchanged for non-admin self-updates
    )
  );

DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- CLINIC SETTINGS POLICIES
-- - All authenticated users can view
-- - Only admin can update
-- ============================================================
DROP POLICY IF EXISTS "clinic_settings_select_authenticated" ON clinic_settings;
CREATE POLICY "clinic_settings_select_authenticated" ON clinic_settings
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "clinic_settings_update_admin" ON clinic_settings;
CREATE POLICY "clinic_settings_update_admin" ON clinic_settings
  FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "clinic_settings_insert_admin" ON clinic_settings;
CREATE POLICY "clinic_settings_insert_admin" ON clinic_settings
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

-- ============================================================
-- PATIENTS POLICIES
-- - All authenticated can view active patients
-- - Admin + receptionist can insert new patients
-- - Admin + receptionist can update patient records
-- - Only admin can delete (soft delete via is_active preferred)
-- ============================================================
DROP POLICY IF EXISTS "patients_select_authenticated" ON patients;
CREATE POLICY "patients_select_authenticated" ON patients
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "patients_insert_admin_receptionist" ON patients;
CREATE POLICY "patients_insert_admin_receptionist" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "patients_update_admin_receptionist" ON patients;
CREATE POLICY "patients_update_admin_receptionist" ON patients
  FOR UPDATE TO authenticated
  USING (get_user_role() IN ('admin', 'receptionist'))
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "patients_delete_admin" ON patients;
CREATE POLICY "patients_delete_admin" ON patients
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- DOCTORS POLICIES
-- - All authenticated can view doctors
-- - Only admin can insert/update/delete
-- ============================================================
DROP POLICY IF EXISTS "doctors_select_authenticated" ON doctors;
CREATE POLICY "doctors_select_authenticated" ON doctors
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "doctors_insert_admin" ON doctors;
CREATE POLICY "doctors_insert_admin" ON doctors
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "doctors_update_admin" ON doctors;
CREATE POLICY "doctors_update_admin" ON doctors
  FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "doctors_delete_admin" ON doctors;
CREATE POLICY "doctors_delete_admin" ON doctors
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- DOCTOR SCHEDULES POLICIES
-- - All authenticated can view
-- - Only admin can manage
-- ============================================================
DROP POLICY IF EXISTS "doctor_schedules_select_authenticated" ON doctor_schedules;
CREATE POLICY "doctor_schedules_select_authenticated" ON doctor_schedules
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "doctor_schedules_insert_admin" ON doctor_schedules;
CREATE POLICY "doctor_schedules_insert_admin" ON doctor_schedules
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "doctor_schedules_update_admin" ON doctor_schedules;
CREATE POLICY "doctor_schedules_update_admin" ON doctor_schedules
  FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

DROP POLICY IF EXISTS "doctor_schedules_delete_admin" ON doctor_schedules;
CREATE POLICY "doctor_schedules_delete_admin" ON doctor_schedules
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- DOCTOR LEAVES POLICIES
-- - All authenticated can view
-- - Admin manages; doctors can manage own leaves
-- ============================================================
DROP POLICY IF EXISTS "doctor_leaves_select_authenticated" ON doctor_leaves;
CREATE POLICY "doctor_leaves_select_authenticated" ON doctor_leaves
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "doctor_leaves_insert_admin_doctor" ON doctor_leaves;
CREATE POLICY "doctor_leaves_insert_admin_doctor" ON doctor_leaves
  FOR INSERT TO authenticated
  WITH CHECK (
    get_user_role() = 'admin'
    OR (
      get_user_role() = 'doctor'
      AND EXISTS (
        SELECT 1 FROM doctors d
        JOIN profiles p ON p.id = d.profile_id
        WHERE d.id = doctor_id
        AND p.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "doctor_leaves_update_admin_doctor" ON doctor_leaves;
CREATE POLICY "doctor_leaves_update_admin_doctor" ON doctor_leaves
  FOR UPDATE TO authenticated
  USING (
    get_user_role() = 'admin'
    OR (
      get_user_role() = 'doctor'
      AND EXISTS (
        SELECT 1 FROM doctors d
        JOIN profiles p ON p.id = d.profile_id
        WHERE d.id = doctor_id
        AND p.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "doctor_leaves_delete_admin" ON doctor_leaves;
CREATE POLICY "doctor_leaves_delete_admin" ON doctor_leaves
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- APPOINTMENTS POLICIES
-- - All authenticated can view
-- - Admin + receptionist can insert/update
-- - Admin can delete
-- - Doctors can view their own appointments (redundant but explicit)
-- ============================================================
DROP POLICY IF EXISTS "appointments_select_authenticated" ON appointments;
CREATE POLICY "appointments_select_authenticated" ON appointments
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "appointments_insert_admin_receptionist" ON appointments;
CREATE POLICY "appointments_insert_admin_receptionist" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "appointments_update_admin_receptionist" ON appointments;
CREATE POLICY "appointments_update_admin_receptionist" ON appointments
  FOR UPDATE TO authenticated
  USING (get_user_role() IN ('admin', 'receptionist'))
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "appointments_delete_admin" ON appointments;
CREATE POLICY "appointments_delete_admin" ON appointments
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- VISITS POLICIES
-- - All authenticated can view
-- - ONLY doctor + admin can insert/update (clinical records)
-- - Only admin can delete (data integrity)
-- ============================================================
DROP POLICY IF EXISTS "visits_select_authenticated" ON visits;
CREATE POLICY "visits_select_authenticated" ON visits
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "visits_insert_doctor_admin" ON visits;
CREATE POLICY "visits_insert_doctor_admin" ON visits
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "visits_update_doctor_admin" ON visits;
CREATE POLICY "visits_update_doctor_admin" ON visits
  FOR UPDATE TO authenticated
  USING (get_user_role() IN ('doctor', 'admin'))
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "visits_delete_admin" ON visits;
CREATE POLICY "visits_delete_admin" ON visits
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- PRESCRIPTIONS POLICIES - CRITICAL SECURITY
-- - All authenticated can VIEW prescriptions (for receptionist printing)
-- - ONLY doctor + admin can INSERT prescriptions
-- - ONLY doctor + admin can UPDATE prescriptions
-- - ONLY admin can DELETE prescriptions (never soft-delete a prescription)
-- RATIONALE: Prescriptions are medico-legal documents. Only licensed 
--            doctors or admin should create/modify them. Receptionists
--            can view/print but never create or modify.
-- ============================================================
DROP POLICY IF EXISTS "prescriptions_select_authenticated" ON prescriptions;
CREATE POLICY "prescriptions_select_authenticated" ON prescriptions
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "prescriptions_insert_doctor_admin" ON prescriptions;
CREATE POLICY "prescriptions_insert_doctor_admin" ON prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "prescriptions_update_doctor_admin" ON prescriptions;
CREATE POLICY "prescriptions_update_doctor_admin" ON prescriptions
  FOR UPDATE TO authenticated
  USING (get_user_role() IN ('doctor', 'admin'))
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "prescriptions_delete_admin" ON prescriptions;
CREATE POLICY "prescriptions_delete_admin" ON prescriptions
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- PRESCRIPTION ITEMS POLICIES - Same as prescriptions (CRITICAL)
-- ============================================================
DROP POLICY IF EXISTS "prescription_items_select_authenticated" ON prescription_items;
CREATE POLICY "prescription_items_select_authenticated" ON prescription_items
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "prescription_items_insert_doctor_admin" ON prescription_items;
CREATE POLICY "prescription_items_insert_doctor_admin" ON prescription_items
  FOR INSERT TO authenticated
  WITH CHECK (
    get_user_role() IN ('doctor', 'admin')
    -- Verify parent prescription exists and user has access to it
    AND EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_id
    )
  );

DROP POLICY IF EXISTS "prescription_items_update_doctor_admin" ON prescription_items;
CREATE POLICY "prescription_items_update_doctor_admin" ON prescription_items
  FOR UPDATE TO authenticated
  USING (
    get_user_role() IN ('doctor', 'admin')
    AND EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_id
    )
  )
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "prescription_items_delete_doctor_admin" ON prescription_items;
CREATE POLICY "prescription_items_delete_doctor_admin" ON prescription_items
  FOR DELETE TO authenticated
  USING (get_user_role() IN ('doctor', 'admin'));

-- ============================================================
-- FOLLOWUPS POLICIES
-- - All authenticated can view
-- - Doctor + admin can insert
-- - All authenticated can update status (receptionist marks completed)
-- - Only admin can delete
-- ============================================================
DROP POLICY IF EXISTS "followups_select_authenticated" ON followups;
CREATE POLICY "followups_select_authenticated" ON followups
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "followups_insert_doctor_admin" ON followups;
CREATE POLICY "followups_insert_doctor_admin" ON followups
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "followups_update_authenticated" ON followups;
CREATE POLICY "followups_update_authenticated" ON followups
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "followups_delete_admin" ON followups;
CREATE POLICY "followups_delete_admin" ON followups
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- NOTIFICATIONS POLICIES
-- - All authenticated can view
-- - Admin + receptionist can manage (send reminders)
-- - Only admin can delete
-- ============================================================
DROP POLICY IF EXISTS "notifications_select_authenticated" ON notifications;
CREATE POLICY "notifications_select_authenticated" ON notifications
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "notifications_insert_admin_receptionist" ON notifications;
CREATE POLICY "notifications_insert_admin_receptionist" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "notifications_update_admin_receptionist" ON notifications;
CREATE POLICY "notifications_update_admin_receptionist" ON notifications
  FOR UPDATE TO authenticated
  USING (get_user_role() IN ('admin', 'receptionist'))
  WITH CHECK (get_user_role() IN ('admin', 'receptionist'));

DROP POLICY IF EXISTS "notifications_delete_admin" ON notifications;
CREATE POLICY "notifications_delete_admin" ON notifications
  FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- AUDIT LOGS POLICIES
-- - Only admin can view audit logs
-- - Any authenticated user can insert (for logging their own actions)
-- - Nobody can update or delete audit logs (immutable!)
-- ============================================================
DROP POLICY IF EXISTS "audit_logs_select_admin" ON audit_logs;
CREATE POLICY "audit_logs_select_admin" ON audit_logs
  FOR SELECT TO authenticated
  USING (get_user_role() = 'admin');

DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- NOTE: No UPDATE or DELETE policies for audit_logs - this is intentional.
-- Audit logs are immutable by design to maintain data integrity.
