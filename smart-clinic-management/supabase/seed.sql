-- ============================================================
-- SMART CLINIC MANAGEMENT SYSTEM - REALISTIC SEED DATA
-- seed.sql (Runs on PostgreSQL / Supabase)
-- ============================================================

-- Clean existing seed data safely if running locally (optional)
-- TRUNCATE TABLE notifications, followups, prescription_items, prescriptions, visits, appointments, doctor_schedules, doctors, patients CASCADE;

-- ============================================================
-- 1. CLINIC SETTINGS
-- ============================================================
INSERT INTO clinic_settings (
  clinic_name, logo_url, address, city, state, phone, alternate_phone, 
  email, website, working_days, working_hours_start, working_hours_end, 
  currency, timezone, whatsapp_configured, sms_configured, email_configured
) VALUES (
  'Arogya Smart Healthcare & Multispeciality Clinic',
  '/logo.svg',
  'Shop 104-106, 1st Floor, Apex Medical Complex, Sector 18',
  'Noida',
  'Uttar Pradesh',
  '+91-9876543210',
  '+91-9876543211',
  'contact@arogyaclinic.in',
  'https://www.arogyaclinic.in',
  ARRAY['monday','tuesday','wednesday','thursday','friday','saturday'],
  '09:00',
  '20:00',
  'INR',
  'Asia/Kolkata',
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. DOCTORS
-- ============================================================
INSERT INTO doctors (id, doctor_id, full_name, specialization, qualification, registration_number, phone, email, consultation_duration, availability_status, is_active)
VALUES 
  ('d1000000-0000-0000-0000-000000000001', 'DR001', 'Dr. Rajesh Sharma', 'General Physician & Diabetologist', 'MBBS, MD (General Medicine)', 'MCI-18492-DEL', '+91-9811223344', 'dr.rajesh@arogyaclinic.in', 15, 'available', true),
  ('d1000000-0000-0000-0000-000000000002', 'DR002', 'Dr. Sunita Deshmukh', 'Cardiologist', 'MBBS, MD, DM (Cardiology)', 'MCI-29401-MAH', '+91-9822334455', 'dr.sunita@arogyaclinic.in', 20, 'available', true),
  ('d1000000-0000-0000-0000-000000000003', 'DR003', 'Dr. Arvind Verma', 'Orthopedic Surgeon', 'MBBS, MS (Orthopedics), DNB', 'MCI-33108-UP', '+91-9833445566', 'dr.arvind@arogyaclinic.in', 15, 'available', true)
ON CONFLICT (doctor_id) DO NOTHING;

-- Update doctor ID sequence
SELECT setval('doctor_id_seq', 3);

-- ============================================================
-- 3. DOCTOR SCHEDULES (Mon-Sat, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
-- ============================================================
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_active)
VALUES
  -- Dr. Rajesh (Mon-Sat 09:00 - 13:00, 16:00 - 20:00)
  ('d1000000-0000-0000-0000-000000000001', 1, '09:00', '13:00', true),
  ('d1000000-0000-0000-0000-000000000001', 2, '09:00', '13:00', true),
  ('d1000000-0000-0000-0000-000000000001', 3, '09:00', '13:00', true),
  ('d1000000-0000-0000-0000-000000000001', 4, '09:00', '13:00', true),
  ('d1000000-0000-0000-0000-000000000001', 5, '09:00', '13:00', true),
  ('d1000000-0000-0000-0000-000000000001', 6, '09:00', '13:00', true),
  -- Dr. Sunita (Mon, Wed, Fri 10:00 - 15:00)
  ('d1000000-0000-0000-0000-000000000002', 1, '10:00', '15:00', true),
  ('d1000000-0000-0000-0000-000000000002', 3, '10:00', '15:00', true),
  ('d1000000-0000-0000-0000-000000000002', 5, '10:00', '15:00', true),
  -- Dr. Arvind (Tue, Thu, Sat 14:00 - 19:00)
  ('d1000000-0000-0000-0000-000000000003', 2, '14:00', '19:00', true),
  ('d1000000-0000-0000-0000-000000000003', 4, '14:00', '19:00', true),
  ('d1000000-0000-0000-0000-000000000003', 6, '14:00', '19:00', true)
ON CONFLICT (doctor_id, day_of_week) DO NOTHING;

-- ============================================================
-- 4. PATIENTS
-- ============================================================
INSERT INTO patients (
  id, patient_id, full_name, mobile, alternate_mobile, email, 
  date_of_birth, gender, address, city, blood_group, emergency_contact, 
  emergency_contact_name, notes, consent_whatsapp, consent_sms, consent_email, 
  registration_date, is_active
) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'PT0001', 'Ravi Kumar', '+91-9871112233', '+91-9871112234', 'ravi.kumar@gmail.com', '1988-06-15', 'male', 'Flat 402, Green Valley Apartments, Indirapuram', 'Ghaziabad', 'B+', '+91-9871119988', 'Priya Kumar (Wife)', 'Known history of seasonal asthma. No penicillin allergy.', true, true, true, CURRENT_DATE - INTERVAL '60 days', true),
  ('p1000000-0000-0000-0000-000000000002', 'PT0002', 'Ananya Sengupta', '+91-9810998877', NULL, 'ananya.s@yahoo.com', '1995-11-20', 'female', 'B-12, Sector 21', 'Noida', 'O+', '+91-9810990000', 'Debabrata Sengupta (Father)', 'Migraine triggers with stress and bright lights.', true, true, false, CURRENT_DATE - INTERVAL '45 days', true),
  ('p1000000-0000-0000-0000-000000000003', 'PT0003', 'Virendra Singh', '+91-9955443322', '+91-9955443321', 'virendra.singh@outlook.com', '1962-03-10', 'male', 'Plot 88, Kavi Nagar', 'Ghaziabad', 'A+', '+91-9955449900', 'Manju Singh (Wife)', 'Type 2 Diabetes Mellitus (10 yrs), Essential Hypertension.', true, true, true, CURRENT_DATE - INTERVAL '30 days', true),
  ('p1000000-0000-0000-0000-000000000004', 'PT0004', 'Pooja Bhattacharya', '+91-9711882233', NULL, 'pooja.b@gmail.com', '2001-08-04', 'female', 'House 55, Block C, Preet Vihar', 'Delhi', 'AB+', '+91-9711880000', 'Sumit Bhatt (Brother)', 'Routine fitness checkups.', true, false, true, CURRENT_DATE - INTERVAL '15 days', true),
  ('p1000000-0000-0000-0000-000000000005', 'PT0005', 'Amitabh Srivastava', '+91-9650112244', NULL, 'amitabh.s@gmail.com', '1974-12-28', 'male', 'Villa 7, Grand Omaxe, Sector 93B', 'Noida', 'O-', '+91-9650119999', 'Rashmi Srivastava (Wife)', 'Lower back ache following sports injury.', true, true, false, CURRENT_DATE - INTERVAL '10 days', true),
  ('p1000000-0000-0000-0000-000000000006', 'PT0006', 'Meenakshi Sundaram', '+91-9444332211', NULL, 'meenakshi.s@rediffmail.com', '1955-04-18', 'female', 'Tower 3, Flat 901, Express Zenith', 'Noida', 'B-', '+91-9444330000', 'Karthik Sundaram (Son)', 'Osteoarthritis bilateral knees.', true, true, true, CURRENT_DATE - INTERVAL '5 days', true),
  ('p1000000-0000-0000-0000-000000000007', 'PT0007', 'Farhan Akhtar Qureshi', '+91-9891223344', NULL, 'farhan.q@gmail.com', '1992-09-02', 'male', 'F-302, Jamia Nagar, Okhla', 'Delhi', 'A-', '+91-9891229900', 'Imran Qureshi (Brother)', 'Acute viral pharyngitis.', true, true, true, CURRENT_DATE - INTERVAL '1 day', true),
  ('p1000000-0000-0000-0000-000000000008', 'PT0008', 'Sneha Patel', '+91-9825112233', NULL, 'sneha.patel@hotmail.com', '1998-01-25', 'female', 'A-404, Mahagun Moderne, Sector 78', 'Noida', 'O+', '+91-9825110000', 'Hardik Patel (Husband)', 'First-time registration for thyroid evaluation.', true, true, true, CURRENT_DATE, true)
ON CONFLICT (patient_id) DO NOTHING;

-- Update patient sequence
SELECT setval('patient_id_seq', 8);

-- ============================================================
-- 5. APPOINTMENTS (Past and Today)
-- ============================================================
INSERT INTO appointments (
  id, appointment_id, patient_id, doctor_id, appointment_date, 
  appointment_time, appointment_type, status, reason_for_visit, notes
) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'APT0001', 'p1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '60 days', '10:00', 'first_visit', 'completed', 'High grade fever and dry cough', 'First visit registered.'),
  ('a1000000-0000-0000-0000-000000000002', 'APT0002', 'p1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '30 days', '11:00', 'first_visit', 'completed', 'Routine BP checkup and chest tightness', 'ECG done.'),
  ('a1000000-0000-0000-0000-000000000003', 'APT0003', 'p1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '10 days', '15:00', 'first_visit', 'completed', 'Severe lumbar back pain after gym workout', 'X-ray advised.'),
  -- TODAY'S APPOINTMENTS (demonstrating real clinic workflow)
  ('a1000000-0000-0000-0000-000000000004', 'APT0004', 'p1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:30', 'follow_up', 'checked_in', 'Follow-up consultation for respiratory recovery', 'Checked in at reception desk at 09:15 AM.'),
  ('a1000000-0000-0000-0000-000000000005', 'APT0005', 'p1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', CURRENT_DATE, '10:15', 'first_visit', 'confirmed', 'Severe episodic headache with nausea', 'Patient confirmed via WhatsApp reminder.'),
  ('a1000000-0000-0000-0000-000000000006', 'APT0006', 'p1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000001', CURRENT_DATE, '11:00', 'first_visit', 'pending', 'Fatigue, unexplained weight gain and hair fall', 'New walk-in / booked online.'),
  ('a1000000-0000-0000-0000-000000000007', 'APT0007', 'p1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000003', CURRENT_DATE, '15:30', 'follow_up', 'confirmed', 'Review response to knee joint injections', 'Confirmed by son.')
ON CONFLICT (appointment_id) DO NOTHING;

SELECT setval('appointment_id_seq', 7);

-- ============================================================
-- 6. VISITS (CONSULTATIONS)
-- Demonstrates multiple visits for single patient (e.g. PT0001 Ravi Kumar)
-- ============================================================
INSERT INTO visits (
  id, visit_id, patient_id, doctor_id, appointment_id, visit_date, 
  visit_type, chief_complaint, symptoms, medical_history, diagnosis, 
  blood_pressure, pulse_rate, temperature, weight, height, oxygen_saturation, 
  clinical_notes, treatment_plan
) VALUES
  -- Visit 1 for Ravi Kumar (60 days ago)
  (
    'v1000000-0000-0000-0000-000000000001', 'VIS0001', 
    'p1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 
    'a1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '60 days', 'first_visit',
    'Fever with chills since 3 days, dry hacking cough, body ache',
    'High fever up to 102 F, nocturnal cough, throat irritation',
    'Seasonal bronchial hyperreactivity since 2018',
    'Acute Bronchitis with Mild Bronchospasm',
    '124/82 mmHg', 84, 101.4, 74.5, 175.0, 98,
    'Chest auscultation reveals bilateral scattered rhonchi. No crepitations. Throat congested.',
    'Symptomatic antipyretic, bronchodilator inhaler, antihistamine, oral hydration, warm saline gargles.'
  ),
  -- Visit 1 for Virendra Singh (30 days ago)
  (
    'v1000000-0000-0000-0000-000000000002', 'VIS0002', 
    'p1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 
    'a1000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '30 days', 'first_visit',
    'Palpitations and occasional chest tightness during brisk morning walks',
    'Occasional dizziness, bilateral mild pedal edema in evenings',
    'Hypertension (10 yrs), Type 2 Diabetes on Metformin',
    'Grade 1 Essential Hypertension with Sinus Tachycardia',
    '146/94 mmHg', 92, 98.4, 82.0, 168.0, 97,
    'S1 S2 normal, no murmurs. JVP normal. Bilateral mild ankle edema.',
    'Titrate antihypertensives, order 2D Echocardiogram, HbA1c, and lipid profile. Dietary sodium restriction.'
  ),
  -- Visit 1 for Amitabh Srivastava (10 days ago)
  (
    'v1000000-0000-0000-0000-000000000003', 'VIS0003', 
    'p1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003', 
    'a1000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '10 days', 'first_visit',
    'Acute onset lower back pain radiating to right gluteal region after deadlift',
    'Difficulty in bending forward, morning stiffness in lumbar spine',
    'No previous spine surgery. No bladder/bowel incontinence.',
    'Acute Lumbar Musculotendinous Strain (L4-L5)',
    '130/84 mmHg', 76, 98.6, 78.0, 178.0, 99,
    'SLR negative bilaterally. Paraspinal muscle spasm present over right lumbar region.',
    'NSAIDs with muscle relaxants for 5 days, absolute rest for 48h, hot fomentation, lumbar support belt.'
  )
ON CONFLICT (visit_id) DO NOTHING;

SELECT setval('visit_id_seq', 3);

-- ============================================================
-- 7. PRESCRIPTIONS & PRESCRIPTION ITEMS
-- ============================================================
INSERT INTO prescriptions (
  id, prescription_id, visit_id, patient_id, doctor_id, prescription_date, 
  diagnosis, advice, dietary_instructions, lab_tests, follow_up_date, doctor_notes
) VALUES
  (
    'r1000000-0000-0000-0000-000000000001', 'RX0001', 
    'v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 
    'd1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '60 days',
    'Acute Bronchitis with Mild Bronchospasm',
    'Adequate rest, steam inhalation twice daily, drink 3 liters of lukewarm water daily.',
    'Avoid ice cold beverages, oily and spicy food. Prefer light khichdi, vegetable soup.',
    'CBC (Complete Blood Count), ESR',
    CURRENT_DATE, -- Follow-up scheduled for TODAY
    'If breathlessness increases or fever exceeds 102 F, review immediately.'
  ),
  (
    'r1000000-0000-0000-0000-000000000002', 'RX0002', 
    'v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000003', 
    'd1000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '30 days',
    'Grade 1 Essential Hypertension with Sinus Tachycardia',
    'Daily BP log morning and evening. 30 minutes brisk walking in morning.',
    'Low salt diet (less than 4g/day). Avoid papad, pickles, processed cheese. Increase fiber intake.',
    '2D Echocardiography, Lipid Profile, Serum Creatinine, HbA1c',
    CURRENT_DATE + INTERVAL '30 days', -- Follow-up in 1 month
    'Review with 2D Echo report. Maintain BP chart.'
  ),
  (
    'r1000000-0000-0000-0000-000000000003', 'RX0003', 
    'v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000005', 
    'd1000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '10 days',
    'Acute Lumbar Musculotendinous Strain (L4-L5)',
    'Use hard mattress. Avoid lifting heavy weights or forward bending.',
    'Anti-inflammatory food, adequate protein intake.',
    'Digital X-Ray LS Spine AP and Lateral View',
    CURRENT_DATE + INTERVAL '4 days',
    'If radicular leg numbness or weakness occurs, seek urgent review.'
  )
ON CONFLICT (prescription_id) DO NOTHING;

SELECT setval('prescription_id_seq', 3);

-- Prescription items for RX0001
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, route, instructions, sort_order)
VALUES
  ('r1000000-0000-0000-0000-000000000001', 'Tab. Paracetamol (Dolo 650mg)', '650 mg', '1-0-1 (Twice daily after food)', '5 days', 'oral', 'Take only if fever > 100 F', 1),
  ('r1000000-0000-0000-0000-000000000001', 'Tab. Montair-LC (Montelukast 10mg + Levocetirizine 5mg)', '1 tablet', '0-0-1 (Once at bedtime)', '10 days', 'oral', 'Take with warm water before sleep', 2),
  ('r1000000-0000-0000-0000-000000000001', 'Syrup Ascoril-D Cough Formula', '10 ml', '1-1-1 (Thrice daily)', '5 days', 'oral', 'Do not drink water for 15 mins after syrup', 3),
  ('r1000000-0000-0000-0000-000000000001', 'Asthalin Inhaler 100mcg (Salbutamol)', '2 puffs', 'SOS (As needed for wheezing)', '15 days', 'inhalation', 'Rinse mouth after inhalation', 4),

  -- RX0002 (Dr. Sunita for Virendra Singh)
  ('r1000000-0000-0000-0000-000000000002', 'Tab. Telmisartan + Amlodipine (Telma-AM 40/5)', '40mg / 5mg', '1-0-0 (Once daily morning after breakfast)', '30 days', 'oral', 'Check BP regularly', 1),
  ('r1000000-0000-0000-0000-000000000002', 'Tab. Metoprolol Tartrate (Betaloc 25mg)', '25 mg', '1-0-1 (Twice daily)', '30 days', 'oral', 'Do not skip dose suddenly', 2),
  ('r1000000-0000-0000-0000-000000000002', 'Tab. Ecosprin 75mg (Aspirin)', '75 mg', '0-1-0 (After lunch)', '30 days', 'oral', 'Take strictly with full meal', 3),

  -- RX0003 (Dr. Arvind for Amitabh Srivastava)
  ('r1000000-0000-0000-0000-000000000003', 'Tab. Zerodol-TH 8 (Aceclofenac 100mg + Thiocolchicoside 8mg)', '1 tablet', '1-0-1 (Twice daily after food)', '5 days', 'oral', 'Muscle relaxant and anti-inflammatory', 1),
  ('r1000000-0000-0000-0000-000000000003', 'Cap. Pantocid 40mg (Pantoprazole)', '40 mg', '1-0-0 (Empty stomach in morning)', '7 days', 'oral', '30 minutes before breakfast', 2),
  ('r1000000-0000-0000-0000-000000000003', 'Volini Gel (Diclofenac Diethylamine)', 'Apply locally', 'Thrice daily gentle application', '7 days', 'topical', 'Do not massage vigorously', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. FOLLOWUPS
-- ============================================================
INSERT INTO followups (
  id, patient_id, visit_id, doctor_id, scheduled_date, 
  interval_type, instructions, status
) VALUES
  -- Today's follow-up for Ravi Kumar (matches prompt TEST 5 & 6)
  (
    'f1000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'v1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    '2_months',
    'Review response to bronchodilator treatment and repeat chest auscultation.',
    'due_today'
  ),
  -- Upcoming follow-up in 30 days for Virendra Singh
  (
    'f1000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000003',
    'v1000000-0000-0000-0000-000000000002',
    'd1000000-0000-0000-0000-000000000002',
    CURRENT_DATE + INTERVAL '30 days',
    '1_month',
    'Check blood pressure response and review 2D Echo results.',
    'upcoming'
  ),
  -- Overdue follow-up from 3 days ago for test case
  (
    'f1000000-0000-0000-0000-000000000003',
    'p1000000-0000-0000-0000-000000000002',
    'v1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '3 days',
    '2_weeks',
    'Review migraine diary and medication tolerability.',
    'overdue'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. NOTIFICATIONS (WhatsApp, SMS, Email scheduled logs)
-- ============================================================
INSERT INTO notifications (
  patient_id, followup_id, appointment_id, channel, message, scheduled_at, sent_at, status
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000004',
    'whatsapp',
    'Hello Ravi Kumar, this is a reminder from Arogya Smart Healthcare. Your doctor Dr. Rajesh Sharma has recommended a follow-up visit today. Please contact our clinic to confirm your slot.',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours',
    'delivered'
  ),
  (
    'p1000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000004',
    'sms',
    'Dear Ravi Kumar, reminder for your scheduled doctor consultation at Arogya Clinic today. Tel: +91-9876543210.',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours',
    'sent'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000003',
    NULL,
    'whatsapp',
    'Hello Ananya Sengupta, your follow-up appointment was recommended 3 days ago. Please visit Arogya Clinic at your earliest convenience.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    'delivered'
  )
ON CONFLICT DO NOTHING;
