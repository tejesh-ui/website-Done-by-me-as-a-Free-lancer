import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Auth
import { LoginPage } from '@/pages/auth/LoginPage'

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPatients } from '@/pages/admin/AdminPatients'
import { AdminDoctors } from '@/pages/admin/AdminDoctors'
import { AdminAppointments } from '@/pages/admin/AdminAppointments'
import { AdminReports } from '@/pages/admin/AdminReports'
import { AdminSettings } from '@/pages/admin/AdminSettings'
import { AdminUsers } from '@/pages/admin/AdminUsers'
import { AdminAuditLogs } from '@/pages/admin/AdminAuditLogs'

// Receptionist Pages
import { ReceptionistDashboard } from '@/pages/receptionist/ReceptionistDashboard'
import { RegisterPatient } from '@/pages/receptionist/RegisterPatient'
import { PatientSearch } from '@/pages/receptionist/PatientSearch'
import { ReceptionistAppointments } from '@/pages/receptionist/ReceptionistAppointments'
import { ReceptionistCheckIn } from '@/pages/receptionist/ReceptionistCheckIn'
import { ReceptionistFollowUps } from '@/pages/receptionist/ReceptionistFollowUps'
import { ReceptionistReminders } from '@/pages/receptionist/ReceptionistReminders'

// Doctor Pages
import { DoctorDashboard } from '@/pages/doctor/DoctorDashboard'
import { DoctorAppointments } from '@/pages/doctor/DoctorAppointments'
import { DoctorPatients } from '@/pages/doctor/DoctorPatients'
import { DoctorConsultations } from '@/pages/doctor/DoctorConsultations'
import { DoctorPrescriptions } from '@/pages/doctor/DoctorPrescriptions'
import { DoctorFollowUps } from '@/pages/doctor/DoctorFollowUps'

// Patient Profile & History
import { PatientProfile } from '@/pages/patients/PatientProfile'
import { PatientHistory } from '@/pages/patients/PatientHistory'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2 // 2 minutes
    }
  }
})

// Root redirect based on role
function RootRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto mb-3"></div>
          <p className="text-gray-500 text-xs">Launching Smart Clinic Operating System...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (user.role === 'receptionist') return <Navigate to="/receptionist/dashboard" replace />
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />

  return <Navigate to="/login" replace />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminPatients />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDoctors />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminUsers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminAuditLogs />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Receptionist Routes */}
            <Route
              path="/receptionist/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/register"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <RegisterPatient />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/patients/new"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <RegisterPatient />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/patients"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <PatientSearch />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/book-appointment"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/check-in"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistCheckIn />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/follow-ups"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistFollowUps />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/reminders"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <DashboardLayout>
                    <ReceptionistReminders />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorAppointments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorPatients />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/consultations"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorConsultations />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorPrescriptions />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/follow-ups"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <DashboardLayout>
                    <DoctorFollowUps />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Shared Patient Profile & History */}
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}>
                  <DashboardLayout>
                    <PatientProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id/history"
              element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}>
                  <DashboardLayout>
                    <PatientHistory />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
