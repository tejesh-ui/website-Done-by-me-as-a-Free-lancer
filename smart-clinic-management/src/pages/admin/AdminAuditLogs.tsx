import React, { useState, useEffect } from 'react'
import { Shield, Clock, User, Database, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuditLogEntry {
  id: string
  user_name: string
  action: string
  table_name: string
  record_id: string
  created_at: string
  ip_address: string
}

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      user_name: 'Dr. Rajesh Sharma',
      action: 'PRESCRIPTION_CREATED',
      table_name: 'prescriptions',
      record_id: 'RX0001',
      created_at: '2026-11-19 15:45:12',
      ip_address: '192.168.1.104'
    },
    {
      id: '2',
      user_name: 'Pooja Sharma (Receptionist)',
      action: 'PATIENT_REGISTERED',
      table_name: 'patients',
      record_id: 'PT0008',
      created_at: '2026-11-19 14:20:00',
      ip_address: '192.168.1.102'
    },
    {
      id: '3',
      user_name: 'Pooja Sharma (Receptionist)',
      action: 'APPOINTMENT_CHECKIN',
      table_name: 'appointments',
      record_id: 'APT0004',
      created_at: '2026-11-19 09:30:15',
      ip_address: '192.168.1.102'
    },
    {
      id: '4',
      user_name: 'Dr. Vikram Malhotra',
      action: 'SETTINGS_UPDATED',
      table_name: 'clinic_settings',
      record_id: 'CONFIG',
      created_at: '2026-11-19 09:05:40',
      ip_address: '192.168.1.101'
    },
    {
      id: '5',
      user_name: 'Dr. Sunita Deshmukh',
      action: 'CONSULTATION_SAVED',
      table_name: 'visits',
      record_id: 'VIS0002',
      created_at: '2026-11-18 16:15:30',
      ip_address: '192.168.1.105'
    }
  ])

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
        if (data && data.length > 0) {
          setLogs(data as any)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Audit Trails</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tamper-evident logs of clinical interventions, patient modifications, and user access.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator / Staff</th>
                <th className="py-3 px-4">Table & Target</th>
                <th className="py-3 px-4">Network IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 font-mono text-xs">
                  <td className="py-3 px-4 text-gray-500">{log.created_at}</td>
                  <td className="py-3 px-4 font-bold text-blue-900">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono text-[11px] border border-blue-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-sans font-medium">{log.user_name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {log.table_name} <span className="text-gray-400">({log.record_id})</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
