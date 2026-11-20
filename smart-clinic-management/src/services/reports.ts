import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

export interface ReportFilter {
  startDate: string
  endDate: string
  doctorId?: string
}

export async function getPatientVisitsReport(filter: ReportFilter) {
  let query = supabase
    .from('visits')
    .select(`
      id, visit_id, visit_date, visit_type, diagnosis, chief_complaint,
      patients(patient_id, full_name, mobile, gender, date_of_birth),
      doctors(full_name, specialization)
    `)
    .gte('visit_date', filter.startDate)
    .lte('visit_date', filter.endDate)
    .order('visit_date', { ascending: false })

  if (filter.doctorId && filter.doctorId !== 'all') {
    query = query.eq('doctor_id', filter.doctorId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getAppointmentsReport(filter: ReportFilter) {
  let query = supabase
    .from('appointments')
    .select(`
      id, appointment_id, appointment_date, appointment_time, appointment_type, status, reason_for_visit,
      patients(patient_id, full_name, mobile),
      doctors(full_name, specialization)
    `)
    .gte('appointment_date', filter.startDate)
    .lte('appointment_date', filter.endDate)
    .order('appointment_date', { ascending: false })

  if (filter.doctorId && filter.doctorId !== 'all') {
    query = query.eq('doctor_id', filter.doctorId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getFollowupsReport(filter: ReportFilter) {
  const query = supabase
    .from('followups')
    .select(`
      id, scheduled_date, status, instructions,
      patients(patient_id, full_name, mobile),
      doctors(full_name, specialization)
    `)
    .gte('scheduled_date', filter.startDate)
    .lte('scheduled_date', filter.endDate)
    .order('scheduled_date', { ascending: true })

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = row[header] === null || row[header] === undefined ? '' : String(row[header])
          return `"${val.replace(/"/g, '""')}"`
        })
        .join(',')
    )
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToExcel(data: any[], filename: string, sheetName = 'Report') {
  if (!data.length) return
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportToPDF(title: string, columns: string[], rows: any[][], filename: string) {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.setTextColor(30, 58, 138) // Navy Blue
  doc.text('Smart Clinic Management System', 14, 15)
  doc.setFontSize(12)
  doc.setTextColor(50, 50, 50)
  doc.text(title, 14, 23)
  doc.setFontSize(8)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 29)

  // Render clean table natively
  let startY = 36
  const colWidth = 180 / columns.length

  // Header
  doc.setFillColor(30, 58, 138)
  doc.rect(14, startY - 5, 182, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  columns.forEach((col, idx) => {
    doc.text(col, 16 + idx * colWidth, startY)
  })

  // Rows
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  startY += 7

  rows.slice(0, 30).forEach((row, rIdx) => {
    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252)
      doc.rect(14, startY - 4, 182, 6, 'F')
    }
    row.forEach((cell, cIdx) => {
      const cellText = String(cell || '').substring(0, 25)
      doc.text(cellText, 16 + cIdx * colWidth, startY)
    })
    startY += 6
  })

  doc.save(`${filename}.pdf`)
}
