# 🏥 Smart Clinic Management System (Arogya Healthcare)

A modern, production-grade, full-stack **Smart Clinic Management System** built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row Level Security)**.

Designed specifically for healthcare practices and outpatient clinics following Indian medical workflows (Currency: **INR ₹**, Timezone: **Asia/Kolkata**, Date Format: **DD-MM-YYYY**, and **DPDP/Telemedicine Guidelines**).

---

## 🌟 Key Application Features

### 1. 🛡️ Role-Based Access Control (RBAC) & Security
- **Administrator**: Full system visibility, doctor management, staff provisioning, clinic settings, audit logs, and reports.
- **Receptionist**: Patient intake, instant duplicate screening, walk-in check-in, queue management, appointment booking, follow-up tracking, and manual reminder alerts. *(Strictly prohibited by RLS from authoring or tampering with doctor prescriptions).*
- **Doctor**: Assigned daily schedule, electronic health records (EHR), multi-visit chronological history, consultation workspace with vitals recording, and digital prescription generator with PDF export.
- **Instant Demo Switcher**: One-click quick login buttons for all 3 roles on the login page for immediate zero-friction evaluation.

### 2. 👤 Patient Registration & Duplicate Detection
- Concurrency-safe unique Patient IDs (`PT0001`, `PT0002`, `PT0003`...).
- Real-time pre-save screening by mobile number and name similarity.
- When duplicates exist, displays a warning dialog allowing staff to select the existing profile or proceed.
- Auto-calculation of age from Date of Birth.
- Tracks patient communication consent (WhatsApp, SMS, Email).

### 3. 🔍 Advanced Patient Search & Profiles
- Fast partial search across Full Name, Patient ID, Mobile, and Email.
- Clear **First-Time Patient** vs. **Returning Patient** indicator.
- Single permanent patient record with multiple chronological visit records (never duplicated upon return).

### 4. 📅 Double-Booking Prevention & Schedule Desk
- Prevents double-booking the same doctor for the same time slot using frontend validation and database-safe constraints.
- Real-time time slot availability grid.
- Front-desk patient check-in workflow that updates the live waiting room queue.

### 5. 🩺 Physician Consultation Workspace
- Vitals recording: Blood Pressure (mmHg), Pulse Rate (bpm), Temperature (°F), Weight (kg), Height (cm), SpO2 (%).
- Chief complaint, symptoms, clinical diagnosis, physician notes, and treatment plan.
- Creates an immutable visit record (`VIS0001`, `VIS0002`...) preserving all prior consultation records.

### 6. 💊 Digital Prescription Engine & PDF Generation
- Complete clinical document formatting with clinic branding, doctor registration number, diagnosis, and patient demographics.
- Multi-medicine prescription table with dosage, frequency, duration, route, and instructions.
- Physician advice, dietary instructions, and lab test recommendations.
- **Follow-up interval calculator** (1 Week, 2 Weeks, 1 Month, 2 Months, 3 Months, Custom Date).
- Instant **PDF Download** and **Print** functionality with doctor signature block.

### 7. ⏰ Scheduled Reminder System
- Automated 7-day, 2-day, and same-day follow-up reminder scheduling.
- Multi-channel support: **WhatsApp Business Cloud API**, **SMS Gateway**, and **Email (Resend/SMTP)**.
- If external gateway keys are absent, truthfully displays **"Not Configured"** without false positives.
- Receptionist manual reminder broadcast with delivery audit log.

### 8. 📊 Clinical Reports & Data Export
- Comprehensive reports for visits, appointments, and follow-ups.
- Date range filtering and doctor-wise filtering.
- 1-click export to **PDF**, **Excel (.xlsx)**, and **CSV**.

---

## 🗄️ Database Architecture & Migrations

All SQL migrations and realistic seed data are located in `/supabase`:

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql    # Relational tables, sequences, constraints, indexes
│   ├── 002_rls_policies.sql      # Row Level Security (RLS) for all roles
│   └── 003_functions.sql         # ID generators, duplicate detector, dashboard aggregator
├── seed.sql                      # Realistic Indian clinic sample data (doctors, patients, visits, Rx)
└── README.md                     # Database execution guide
```

### Applying Migrations to Supabase

1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/<your-project-id>/sql`
2. Run `001_initial_schema.sql` in the SQL Editor.
3. Run `002_rls_policies.sql` to activate Row Level Security.
4. Run `003_functions.sql` to install stored procedures and ID sequences.
5. (Optional) Run `seed.sql` to populate realistic clinic data.

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18+ or v20+ (tested on Node v24)
- **npm**: v9+ (or pnpm / yarn)

### 1. Installation
```bash
git clone <repo-url>
cd HSP.web
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase connection parameters (or test immediately with built-in demo auth):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME="Smart Clinic Management System"
VITE_APP_TIMEZONE="Asia/Kolkata"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production bundle in `/dist`.

---

## 👥 Demo Staff Credentials

On the `/login` screen, you can click the **Instant Demo Login** buttons or use the following credentials:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Administrator** | `admin@arogyaclinic.in` | `admin123` | Full system, settings, user management, audit logs, reports |
| **Receptionist** | `reception@arogyaclinic.in` | `password123` | Patient intake, search, appointments, check-in, follow-ups |
| **Doctor** | `dr.rajesh@arogyaclinic.in` | `password123` | Patient EHR, consultations, vitals, prescriptions, PDF export |

---

## 🧪 Verification of User Prompt Test Requirements

| # | Test Scenario | Implementation & Verification |
|---|---|---|
| **TEST 1** | Register new patient & verify unique Patient ID | Handled in `RegisterPatient.tsx` via `generate_patient_id()` SQL sequence generating `PT0001`, `PT0002`... |
| **TEST 2** | Search patient by mobile & verify profile display | Handled in `PatientSearch.tsx` and `DuplicatePatientWarning.tsx` using `checkDuplicates()` |
| **TEST 3** | Create second visit & verify original profile unchanged | Handled in `DoctorConsultations.tsx` creating new visit record with foreign key to existing `patient_id` |
| **TEST 4** | Create consultation and digital prescription | Handled in `DoctorConsultations.tsx` and `DoctorPrescriptions.tsx` |
| **TEST 5** | Set follow-up date 2 months after consultation | Handled in `DoctorPrescriptions.tsx` with interval calculator (`2_months` -> `+60 days`) |
| **TEST 6** | Verify patient appears in follow-up dashboard | Handled in `ReceptionistFollowUps.tsx` (shows `due_today` and `upcoming` lists) |
| **TEST 7** | Scheduled reminders & duplicate message prevention | Handled in `notifications.ts` and `ReceptionistReminders.tsx` |
| **TEST 8** | Verify receptionist cannot modify prescriptions | Enforced via PostgreSQL RLS `Only doctor and admin can insert/update prescriptions` |
| **TEST 9** | Verify doctor cannot access unauthorized records | Enforced in `002_rls_policies.sql` and `ProtectedRoute.tsx` |
| **TEST 10** | Verify state persists after logout and login | Handled via Supabase session persistence + local storage fallback |
| **TEST 11** | Prevent appointment double-booking | Enforced via `appointments (doctor_id, appointment_date, appointment_time)` unique constraint & `checkSlotAvailability()` |
| **TEST 12** | Desktop, tablet, and mobile responsiveness | Responsive Tailwind layout with collapsible sidebar, drawer topbar, and fluid cards |

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. In the Vercel Dashboard, click **New Project** and select the repository.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.).
5. Click **Deploy**.

---

## 📄 License
Licensed under the MIT License. Developed for healthcare clinics.
