-- ============================================================
-- SMART CLINIC MANAGEMENT SYSTEM - STORED FUNCTIONS & PROCEDURES
-- Migration: 003_functions.sql
-- ============================================================

-- ============================================================
-- 1. CONCURRENCY-SAFE ID GENERATORS
-- ============================================================

CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('patient_id_seq');
  RETURN 'PT' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_doctor_id()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('doctor_id_seq');
  RETURN 'DR' || LPAD(next_val::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_appointment_id()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('appointment_id_seq');
  RETURN 'APT' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_visit_id()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('visit_id_seq');
  RETURN 'VIS' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_prescription_id()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
BEGIN
  next_val := nextval('prescription_id_seq');
  RETURN 'RX' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants
GRANT EXECUTE ON FUNCTION generate_patient_id() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_doctor_id() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_appointment_id() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_visit_id() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_prescription_id() TO authenticated;


-- ============================================================
-- 2. DASHBOARD STATS AGGREGATION
-- ============================================================
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
  today_date DATE := CURRENT_DATE;
BEGIN
  SELECT json_build_object(
    'total_patients', (SELECT COUNT(*) FROM patients WHERE is_active = true),
    'today_patients', (
      SELECT COUNT(DISTINCT patient_id) FROM appointments
      WHERE appointment_date = today_date AND status NOT IN ('cancelled', 'no_show')
    ),
    'new_patients_today', (
      SELECT COUNT(*) FROM patients WHERE registration_date = today_date AND is_active = true
    ),
    'returning_patients_today', (
      SELECT COUNT(DISTINCT a.patient_id) 
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.appointment_date = today_date 
        AND a.status NOT IN ('cancelled', 'no_show')
        AND p.registration_date < today_date
    ),
    'today_appointments', (
      SELECT COUNT(*) FROM appointments WHERE appointment_date = today_date
    ),
    'completed_appointments', (
      SELECT COUNT(*) FROM appointments WHERE appointment_date = today_date AND status = 'completed'
    ),
    'pending_appointments', (
      SELECT COUNT(*) FROM appointments WHERE appointment_date = today_date AND status IN ('pending', 'confirmed', 'checked_in')
    ),
    'cancelled_appointments', (
      SELECT COUNT(*) FROM appointments WHERE appointment_date = today_date AND status = 'cancelled'
    ),
    'upcoming_followups', (
      SELECT COUNT(*) FROM followups WHERE scheduled_date >= today_date AND status = 'upcoming'
    ),
    'overdue_followups', (
      SELECT COUNT(*) FROM followups WHERE scheduled_date < today_date AND status IN ('upcoming', 'due_today')
    ),
    'total_doctors', (SELECT COUNT(*) FROM doctors WHERE is_active = true),
    'active_receptionists', (
      SELECT COUNT(*) FROM profiles WHERE role = 'receptionist' AND is_active = true
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;


-- ============================================================
-- 3. DUPLICATE PATIENT DETECTION
-- Checks by exact mobile, alternate mobile, or similar name + phone suffix
-- ============================================================
CREATE OR REPLACE FUNCTION check_duplicate_patient(p_mobile TEXT, p_name TEXT)
RETURNS TABLE (
  id UUID,
  patient_id TEXT,
  full_name TEXT,
  mobile TEXT,
  alternate_mobile TEXT,
  email TEXT,
  registration_date DATE,
  last_visit_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.patient_id,
    p.full_name,
    p.mobile,
    p.alternate_mobile,
    p.email,
    p.registration_date,
    (SELECT MAX(v.visit_date) FROM visits v WHERE v.patient_id = p.id) AS last_visit_date
  FROM patients p
  WHERE p.is_active = true
    AND (
      p.mobile = p_mobile
      OR (p.alternate_mobile IS NOT NULL AND p.alternate_mobile = p_mobile)
      OR (
        LOWER(p.full_name) = LOWER(p_name) 
        AND (p_mobile IS NOT NULL AND LENGTH(p_mobile) >= 5 AND p.mobile LIKE '%' || RIGHT(p_mobile, 5))
      )
    )
  ORDER BY p.registration_date DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_duplicate_patient(TEXT, TEXT) TO authenticated;


-- ============================================================
-- 4. UPDATE FOLLOW-UP STATUSES (Scheduled daily maintenance)
-- ============================================================
CREATE OR REPLACE FUNCTION update_followup_statuses()
RETURNS void AS $$
BEGIN
  -- Mark overdue followups
  UPDATE followups
  SET status = 'overdue', updated_at = NOW()
  WHERE scheduled_date < CURRENT_DATE 
    AND status IN ('upcoming', 'due_today');

  -- Mark due today followups
  UPDATE followups
  SET status = 'due_today', updated_at = NOW()
  WHERE scheduled_date = CURRENT_DATE 
    AND status = 'upcoming';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_followup_statuses() TO authenticated;


-- ============================================================
-- 5. COMPLETE PATIENT VISIT HISTORY RETRIEVAL
-- ============================================================
CREATE OR REPLACE FUNCTION get_patient_history(p_patient_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'patient', (
      SELECT row_to_json(p)
      FROM (
        SELECT id, patient_id, full_name, mobile, email, gender, 
               date_of_birth, blood_group, address, city, registration_date
        FROM patients
        WHERE id = p_patient_id
      ) p
    ),
    'visits', (
      SELECT COALESCE(json_agg(v_record ORDER BY v_record.visit_date DESC, v_record.created_at DESC), '[]'::json)
      FROM (
        SELECT 
          vi.id,
          vi.visit_id,
          vi.visit_date,
          vi.visit_type,
          vi.chief_complaint,
          vi.symptoms,
          vi.medical_history,
          vi.diagnosis,
          vi.blood_pressure,
          vi.pulse_rate,
          vi.temperature,
          vi.weight,
          vi.height,
          vi.oxygen_saturation,
          vi.clinical_notes,
          vi.treatment_plan,
          vi.created_at,
          d.full_name AS doctor_name,
          d.specialization AS doctor_specialization,
          (
            SELECT COALESCE(json_agg(pr_item), '[]'::json)
            FROM (
              SELECT 
                pr.id,
                pr.prescription_id,
                pr.diagnosis,
                pr.advice,
                pr.dietary_instructions,
                pr.lab_tests,
                pr.follow_up_date,
                pr.doctor_notes,
                (
                  SELECT COALESCE(json_agg(pi ORDER BY pi.sort_order), '[]'::json)
                  FROM prescription_items pi
                  WHERE pi.prescription_id = pr.id
                ) AS items
              FROM prescriptions pr
              WHERE pr.visit_id = vi.id
            ) pr_item
          ) AS prescriptions,
          (
            SELECT row_to_json(fl)
            FROM (
              SELECT id, scheduled_date, interval_type, instructions, status
              FROM followups
              WHERE visit_id = vi.id
              LIMIT 1
            ) fl
          ) AS followup
        FROM visits vi
        JOIN doctors d ON vi.doctor_id = d.id
        WHERE vi.patient_id = p_patient_id
      ) v_record
    ),
    'total_visits', (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_patient_history(UUID) TO authenticated;


-- ============================================================
-- 6. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers on tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_followups_updated_at ON followups;
CREATE TRIGGER update_followups_updated_at BEFORE UPDATE ON followups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
