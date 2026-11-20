import React from 'react'
import { Patient } from '@/types'
import { AlertTriangle, UserCheck, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DuplicatePatientWarningProps {
  duplicates: Patient[]
  onSelectExisting: (patient: Patient) => void
  onProceedAnyway: () => void
  onCancel: () => void
}

export function DuplicatePatientWarning({
  duplicates,
  onSelectExisting,
  onProceedAnyway,
  onCancel
}: DuplicatePatientWarningProps) {
  if (!duplicates || duplicates.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Possible Duplicate Patient Found!</h3>
              <p className="text-xs text-gray-500">
                Matching mobile number or name already exists in clinic database.
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
          {duplicates.map((patient) => (
            <div
              key={patient.id}
              className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">{patient.full_name}</span>
                  <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {patient.patient_id}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  📞 {patient.phone || (patient as any).mobile} • Gender: {patient.gender || '-'}
                </p>
                {patient.city && <p className="text-xs text-gray-500">📍 {patient.city}</p>}
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSelectExisting(patient)}
                className="gap-1 text-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Select Existing
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onProceedAnyway}
            className="text-amber-800 border-amber-300 hover:bg-amber-50 text-xs"
          >
            Create New Anyway
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
