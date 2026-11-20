import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, UserPlus, Filter, Download, Eye, FileText,
  Calendar, Phone, Mail, MapPin, CheckCircle2, History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchPatients } from '@/services/patients'
import { exportToExcel, exportToCSV } from '@/services/reports'
import { Patient } from '@/types'

export function AdminPatients() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('search') || ''

  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [genderFilter, setGenderFilter] = useState('all')
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients(searchQuery)
  }, [searchQuery])

  async function fetchPatients(query: string) {
    setLoading(true)
    try {
      const data = await searchPatients(query)
      setPatients(data)
    } catch (err) {
      console.error('Failed to search patients:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((p) => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false
    if (bloodGroupFilter !== 'all' && p.blood_group !== bloodGroupFilter) return false
    return true
  })

  const handleExport = (type: 'excel' | 'csv') => {
    const exportData = filteredPatients.map((p) => ({
      'Patient ID': p.patient_id,
      'Full Name': p.full_name,
      'Mobile Number': p.phone || (p as any).mobile,
      'Gender': p.gender || '-',
      'Date of Birth': p.date_of_birth || '-',
      'Blood Group': p.blood_group || '-',
      'City': p.city || '-',
      'Registration Date': (p as any).registration_date || p.created_at?.split('T')[0]
    }))

    if (type === 'excel') exportToExcel(exportData, `Patients_Export_${new Date().toISOString().split('T')[0]}`)
    else exportToCSV(exportData, `Patients_Export_${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-gray-500 mt-1">
            Search, filter, and inspect comprehensive electronic patient records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="text-xs text-gray-700 bg-white"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Export Excel
          </Button>

          <Link to="/receptionist/register">
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              Register Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID (PT0001), Mobile, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700"
          >
            <option value="all">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto mb-2"></div>
                    Loading patient database...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No patients matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                        {p.patient_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {p.full_name}
                      {p.city && <span className="block text-[11px] font-normal text-gray-400">📍 {p.city}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <div>📞 {p.phone || (p as any).mobile}</div>
                      {p.email && <div className="text-[11px] text-gray-400">✉️ {p.email}</div>}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-gray-600">
                      {p.gender || '-'} • DOB: {p.date_of_birth || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.blood_group ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-100 text-[11px]">
                          {p.blood_group}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {(p as any).registration_date || p.created_at?.split('T')[0] || '19-11-2026'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/patients/${p.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-700 gap-1">
                            <Eye className="w-3.5 h-3.5" /> Profile
                          </Button>
                        </Link>
                        <Link to={`/patients/${p.id}/history`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs text-teal-700 gap-1 border-teal-200 bg-teal-50/40">
                            <History className="w-3.5 h-3.5" /> Visits
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
