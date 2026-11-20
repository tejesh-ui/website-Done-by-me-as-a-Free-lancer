import React, { useState, useEffect } from 'react'
import {
  UserCog, UserPlus, Shield, CheckCircle, XCircle,
  Mail, Phone, Lock, Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface UserAccount {
  id: string
  full_name: string
  role: 'admin' | 'receptionist' | 'doctor'
  email: string
  phone?: string | null
  is_active: boolean
  created_at: string
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: '1',
      full_name: 'Dr. Vikram Malhotra',
      role: 'admin',
      email: 'admin@arogyaclinic.in',
      phone: '+91-9876543210',
      is_active: true,
      created_at: '2026-01-15'
    },
    {
      id: '2',
      full_name: 'Pooja Sharma',
      role: 'receptionist',
      email: 'reception@arogyaclinic.in',
      phone: '+91-9876543212',
      is_active: true,
      created_at: '2026-02-01'
    },
    {
      id: '3',
      full_name: 'Dr. Rajesh Sharma',
      role: 'doctor',
      email: 'dr.rajesh@arogyaclinic.in',
      phone: '+91-9811223344',
      is_active: true,
      created_at: '2026-01-20'
    },
    {
      id: '4',
      full_name: 'Dr. Sunita Deshmukh',
      role: 'doctor',
      email: 'dr.sunita@arogyaclinic.in',
      phone: '+91-9822334455',
      is_active: true,
      created_at: '2026-02-10'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'receptionist' as 'admin' | 'receptionist' | 'doctor',
    phone: '',
    password: ''
  })

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('profiles').select('*')
        if (data && data.length > 0) {
          setUsers(data as any)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
    )
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const created: UserAccount = {
      id: String(Date.now()),
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, created])
    setShowAddModal(false)
    setNewUser({ full_name: '', email: '', role: 'receptionist', phone: '', password: '' })
  }

  const roleBadgeColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    receptionist: 'bg-teal-100 text-teal-800 border-teal-200',
    doctor: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff & Access Control Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Provision user accounts, configure role permissions, and deactivate staff access.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs">
          <UserPlus className="w-3.5 h-3.5 mr-1" />
          Provision New User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{u.full_name}</span>
                    <span className="text-[11px] text-gray-400">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${roleBadgeColors[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <div>📞 {u.phone || 'N/A'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-semibold text-xs ${u.is_active ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {u.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">{u.created_at}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant={u.is_active ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs h-7 ${u.is_active ? 'text-rose-700 border-rose-200 hover:bg-rose-50' : 'bg-emerald-700 text-white'}`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Provision New User Account</h3>
            <p className="text-xs text-gray-500 mb-4">Create clinic login with role permissions</p>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name of staff"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@arogyaclinic.in"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="receptionist">Receptionist (Patient Intake & Scheduling)</option>
                  <option value="doctor">Doctor (Consultations & Digital Prescriptions)</option>
                  <option value="admin">Administrator (Full System & Audit Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="+91-9876543210"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t mt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-700 text-white">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
