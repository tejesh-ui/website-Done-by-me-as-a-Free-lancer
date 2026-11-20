import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, User, Phone, Calendar, ArrowRight, Eye,
  CalendarPlus, CheckCircle, Clock, History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchPatients } from '@/services/patients'
import { Patient } from '@/types'

export function PatientSearch() {
  const [searchParams] = useSearchParams()
  const initial = searchParams.get('search') || ''

  const [query, setQuery] = useState(initial)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchResults(query)
  }, [query])

  async function fetchResults(q: string) {
    setLoading(true)
    try {
      const data = await searchPatients(q)
      setPatients(data)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">EHR Patient Search & Intake</h1>
          <p className="text-xs text-gray-500 mt-1">
            Locate patient record by Full Name, Patient ID (PT0001), 10-digit Mobile, or Email address.
          </p>
        </div>

        <Link to="/receptionist/register">
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
            + Register First-Time Patient
          </Button>
        </Link>
      </div>

      {/* Big Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type patient name, PT0001, 9876543210, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50/50 focus:bg-white transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-3"></div>
            Searching electronic health records...
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No Patient Profile Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              No matching records for "{query}". You can register them as a new patient.
            </p>
            <Link to="/receptionist/register">
              <Button size="sm" className="mt-4 bg-teal-600 hover:bg-teal-700 text-white text-xs">
                Register New Patient Profile
              </Button>
            </Link>
          </div>
        ) : (
          patients.map((p: any) => {
            const isReturning = (p as any).registration_date
              ? new Date((p as any).registration_date) < new Date(new Date().toISOString().split('T')[0])
              : true

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-base shrink-0 border border-blue-100">
                    {p.full_name?.charAt(0) || 'P'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900">{p.full_name}</h3>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">
                        {p.patient_id}
                      </span>
                      {/* Required First-Time vs Returning Indicator */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isReturning
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isReturning ? 'Returning Patient' : 'First-Time Patient'}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {p.phone || p.mobile}
                      </span>
                      {p.gender && <span className="capitalize">{p.gender}</span>}
                      {p.date_of_birth && <span>DOB: {p.date_of_birth}</span>}
                      {p.blood_group && (
                        <span className="font-bold text-rose-700 bg-rose-50 px-1.5 rounded">
                          {p.blood_group}
                        </span>
                      )}
                      {p.city && <span>📍 {p.city}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/patients/${p.id}/history`}>
                    <Button variant="outline" size="sm" className="text-xs text-teal-800 border-teal-200 bg-teal-50/50">
                      <History className="w-3.5 h-3.5 mr-1" />
                      Visits ({ (p as any).visit_count || 'View' })
                    </Button>
                  </Link>
                  <Link to={`/patients/${p.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-blue-700">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Profile
                    </Button>
                  </Link>
                  <Link to={`/receptionist/appointments?patientId=${p.id}`}>
                    <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs">
                      <CalendarPlus className="w-3.5 h-3.5 mr-1" />
                      Book Visit
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
