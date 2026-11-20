import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Stethoscope, Lock, Mail, ArrowRight, ShieldCheck,
  UserCheck, Activity, CheckCircle2, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, loginAsDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await signIn(email, password)
      if (res.error) {
        setError(res.error.message || 'Invalid email or password.')
      } else {
        // Redirect will occur via ProtectedRoute/App, or navigate based on email
        if (email.includes('admin')) navigate('/admin/dashboard')
        else if (email.includes('reception')) navigate('/receptionist/dashboard')
        else if (email.includes('doctor')) navigate('/doctor/dashboard')
        else navigate('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = (role: 'admin' | 'receptionist' | 'doctor') => {
    loginAsDemo(role)
    if (role === 'admin') navigate('/admin/dashboard')
    if (role === 'receptionist') navigate('/receptionist/dashboard')
    if (role === 'doctor') navigate('/doctor/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side: Premium Medical Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#1e2d5e] via-[#1e3a8a] to-[#0f1729] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">Smart Clinic</span>
              <span className="block text-xs uppercase tracking-widest text-teal-400 font-semibold">
                Healthcare Operating System
              </span>
            </div>
          </div>

          <div className="mt-16 max-w-md">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Complete Digital Clinic Management
            </h1>
            <p className="mt-4 text-sm text-blue-100/80 leading-relaxed">
              Empowering doctors, receptionists, and administrators with intelligent patient records, 
              double-booking prevention, automated reminders, and digital prescriptions.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="my-10 space-y-4 max-w-md">
          <div className="flex items-center gap-3 text-sm text-blue-100">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>Permanent Patient ID with Zero Duplicates</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-100">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>Digital Prescription Engine with Auto Dosage & PDF</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-100">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>Strict Role-Based Security & Audit Logging</span>
          </div>
        </div>

        <div className="text-xs text-blue-200/60 flex items-center justify-between border-t border-white/10 pt-6">
          <span>Arogya Health v2.0 • HIPAA & DPDP Compliant</span>
          <span>Timezone: Asia/Kolkata (IST)</span>
        </div>
      </div>

      {/* Right side: Login Form & One-Click Role Switcher */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#f8faff]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Portal Login</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in with your clinic credentials</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@arogyaclinic.in"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg shadow-md shadow-blue-700/20"
            >
              Sign In to Workspace
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ⚡ Instant Demo Login by Role
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 transition-all text-purple-900 text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-purple-700" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('receptionist')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/80 transition-all text-teal-900 text-xs font-medium"
              >
                <UserCheck className="w-4 h-4 mb-1 text-teal-700" />
                <span>Receptionist</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('doctor')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-all text-blue-900 text-xs font-medium"
              >
                <Stethoscope className="w-4 h-4 mb-1 text-blue-700" />
                <span>Doctor</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-3">
              One-click instant authentication enables testing all workflows seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
