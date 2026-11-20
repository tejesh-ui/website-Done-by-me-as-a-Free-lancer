import React, { useState, useEffect } from 'react'
import {
  BarChart3, Download, Calendar, Filter, FileSpreadsheet,
  FileText, TrendingUp, Users, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getPatientVisitsReport, getAppointmentsReport, getFollowupsReport,
  exportToCSV, exportToExcel, exportToPDF
} from '@/services/reports'
import { getDoctors } from '@/services/doctors'
import { Doctor } from '@/types'

export function AdminReports() {
  const [reportType, setReportType] = useState<'visits' | 'appointments' | 'followups'>('visits')
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDoctors().then(setDoctors).catch(console.error)
  }, [])

  useEffect(() => {
    loadReport()
  }, [reportType, startDate, endDate, selectedDoctor])

  async function loadReport() {
    setLoading(true)
    try {
      if (reportType === 'visits') {
        const data = await getPatientVisitsReport({ startDate, endDate, doctorId: selectedDoctor })
        setReportData(data)
      } else if (reportType === 'appointments') {
        const data = await getAppointmentsReport({ startDate, endDate, doctorId: selectedDoctor })
        setReportData(data)
      } else {
        const data = await getFollowupsReport({ startDate, endDate, doctorId: selectedDoctor })
        setReportData(data)
      }
    } catch (err) {
      console.error('Failed to load report:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    exportToCSV(reportData, `Clinic_${reportType}_Report_${startDate}_to_${endDate}`)
  }

  const handleExportExcel = () => {
    exportToExcel(reportData, `Clinic_${reportType}_Report_${startDate}_to_${endDate}`)
  }

  const handleExportPDF = () => {
    if (reportType === 'visits') {
      const columns = ['Visit ID', 'Date', 'Patient Name', 'Doctor', 'Diagnosis']
      const rows = reportData.map((r: any) => [
        r.visit_id,
        r.visit_date,
        r.patients?.full_name || '-',
        r.doctors?.full_name || '-',
        r.diagnosis || '-'
      ])
      exportToPDF('Patient Clinical Visits Report', columns, rows, `Visits_Report_${startDate}_${endDate}`)
    } else if (reportType === 'appointments') {
      const columns = ['Appt ID', 'Date', 'Time', 'Patient Name', 'Doctor', 'Status']
      const rows = reportData.map((r: any) => [
        r.appointment_id,
        r.appointment_date,
        r.appointment_time,
        r.patients?.full_name || '-',
        r.doctors?.full_name || '-',
        r.status
      ])
      exportToPDF('Appointments Schedule Report', columns, rows, `Appointments_Report_${startDate}_${endDate}`)
    } else {
      const columns = ['Scheduled Date', 'Patient Name', 'Doctor', 'Status', 'Instructions']
      const rows = reportData.map((r: any) => [
        r.scheduled_date,
        r.patients?.full_name || '-',
        r.doctors?.full_name || '-',
        r.status,
        r.instructions || '-'
      ])
      exportToPDF('Follow-ups & Reminder Status Report', columns, rows, `Followups_Report_${startDate}_${endDate}`)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinical Reports & Export Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time database analytics with instant PDF, Excel, and CSV data extraction.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            disabled={reportData.length === 0}
            className="text-xs bg-white"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-teal-600" />
            CSV
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportExcel}
            disabled={reportData.length === 0}
            className="text-xs bg-white"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Excel
          </Button>

          <Button
            size="sm"
            onClick={handleExportPDF}
            disabled={reportData.length === 0}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
        {/* Report Type Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <button
            onClick={() => setReportType('visits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'visits' ? 'bg-blue-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Patient Visits & Consultations
          </button>
          <button
            onClick={() => setReportType('appointments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'appointments' ? 'bg-blue-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Appointments & Queue Flow
          </button>
          <button
            onClick={() => setReportType('followups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'followups' ? 'bg-blue-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Follow-up Compliance & Reminders
          </button>
        </div>

        {/* Date and Doctor Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-gray-500 font-semibold mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Filter by Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Report Records: {reportData.length} entries found
          </span>
          <span className="text-xs text-gray-400">Date Range: {startDate} to {endDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                {reportType === 'visits' && (
                  <>
                    <th className="py-3 px-4">Visit ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Diagnosis</th>
                  </>
                )}
                {reportType === 'appointments' && (
                  <>
                    <th className="py-3 px-4">Appt ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Status</th>
                  </>
                )}
                {reportType === 'followups' && (
                  <>
                    <th className="py-3 px-4">Scheduled Date</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Clinical Instructions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto mb-2"></div>
                    Querying records...
                  </td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No data matching query parameters.
                  </td>
                </tr>
              ) : (
                reportData.map((row: any, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50/80">
                    {reportType === 'visits' && (
                      <>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{row.visit_id}</td>
                        <td className="py-3 px-4">{row.visit_date}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{row.patients?.full_name}</td>
                        <td className="py-3 px-4 text-gray-600">{row.doctors?.full_name}</td>
                        <td className="py-3 px-4 text-gray-800">{row.diagnosis || '-'}</td>
                      </>
                    )}
                    {reportType === 'appointments' && (
                      <>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{row.appointment_id}</td>
                        <td className="py-3 px-4">{row.appointment_date} at {row.appointment_time}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{row.patients?.full_name}</td>
                        <td className="py-3 px-4 text-gray-600">{row.doctors?.full_name}</td>
                        <td className="py-3 px-4 capitalize font-semibold">{row.status}</td>
                      </>
                    )}
                    {reportType === 'followups' && (
                      <>
                        <td className="py-3 px-4 font-medium">{row.scheduled_date}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{row.patients?.full_name}</td>
                        <td className="py-3 px-4 text-gray-600">{row.doctors?.full_name}</td>
                        <td className="py-3 px-4 capitalize font-semibold text-teal-700">{row.status}</td>
                        <td className="py-3 px-4 text-gray-600">{row.instructions || '-'}</td>
                      </>
                    )}
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
