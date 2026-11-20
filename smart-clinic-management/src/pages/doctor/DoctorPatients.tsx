import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, History, Stethoscope, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchPatients } from '@/services/patients'

export function DoctorPatients() {
  const [patients, setPatients] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients(query)
  }, [query])

  async function fetchPatients(q: string) {
    setLoading(true)
    try {
      const data = await searchPatients(q)
      setPatients(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Authorized Clinical Patients</h1>
          <p className="text-xs text-gray-500 mt-1">
            Access medical records, diagnostic history, and clinical notes for under-care patients.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient by name, ID, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Loading patients...</td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{p.patient_id}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{p.full_name}</td>
                    <td className="py-3.5 px-4 capitalize text-gray-600">{p.gender} • DOB: {p.date_of_birth}</td>
                    <td className="py-3.5 px-4 text-gray-600">📞 {p.phone || p.mobile}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-700">{p.blood_group || '-'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/patients/${p.id}/history`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs text-teal-700 border-teal-200">
                            <History className="w-3.5 h-3.5 mr-1" /> Visits
                          </Button>
                        </Link>
                        <Link to={`/doctor/consultations?patientId=${p.id}`}>
                          <Button size="sm" className="h-7 text-xs bg-blue-700 text-white">
                            <Stethoscope className="w-3.5 h-3.5 mr-1" /> New Consult
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
