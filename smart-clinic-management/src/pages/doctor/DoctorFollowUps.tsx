import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Calendar, CheckCircle, Stethoscope, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getFollowups } from '@/services/followups'

export function DoctorFollowUps() {
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFollowups({ doctorId: 'd1000000-0000-0000-0000-000000000001' })
      .then(setFollowups)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Physician Follow-Up Monitoring</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track patient recovery timelines, scheduled revisit dates, and medical outcomes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Scheduled Revisit</th>
                <th className="py-3 px-4">Prescribed Interval</th>
                <th className="py-3 px-4">Doctor's Clinical Instructions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Loading follow-ups...</td>
                </tr>
              ) : followups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No follow-ups recorded.</td>
                </tr>
              ) : (
                followups.map((fl: any) => (
                  <tr key={fl.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {fl.patients?.full_name || fl.patient?.full_name}
                      <span className="block font-mono text-blue-700 text-[11px]">
                        {fl.patients?.patient_id || fl.patient?.patient_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{fl.scheduled_date || fl.followup_date}</td>
                    <td className="py-3.5 px-4 capitalize text-teal-800">{fl.interval_type?.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 text-gray-600">{fl.instructions || fl.reason}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={fl.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/doctor/consultations?patientId=${fl.patient_id || fl.patients?.id}`}>
                        <Button size="sm" className="h-7 text-xs bg-blue-700 text-white">
                          <Stethoscope className="w-3.5 h-3.5 mr-1" /> Re-Examine
                        </Button>
                      </Link>
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
