import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  user_id: string
  full_name: string
  role: 'admin' | 'receptionist' | 'doctor'
  email: string
  phone?: string | null
  is_active: boolean
}

export interface AppUser {
  id: string
  email: string
  role: 'admin' | 'receptionist' | 'doctor'
  full_name: string
  profile?: Profile | null
}

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  loginAsDemo: (role: 'admin' | 'receptionist' | 'doctor') => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const DEMO_USERS: Record<'admin' | 'receptionist' | 'doctor', AppUser> = {
  admin: {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'admin@arogyaclinic.in',
    role: 'admin',
    full_name: 'Dr. Vikram Malhotra (Admin)',
    profile: {
      id: 'pr000000-0000-0000-0000-000000000001',
      user_id: 'u0000000-0000-0000-0000-000000000001',
      full_name: 'Dr. Vikram Malhotra (Admin)',
      role: 'admin',
      email: 'admin@arogyaclinic.in',
      phone: '+91-9876543210',
      is_active: true
    }
  },
  receptionist: {
    id: 'u0000000-0000-0000-0000-000000000002',
    email: 'reception@arogyaclinic.in',
    role: 'receptionist',
    full_name: 'Pooja Sharma (Receptionist)',
    profile: {
      id: 'pr000000-0000-0000-0000-000000000002',
      user_id: 'u0000000-0000-0000-0000-000000000002',
      full_name: 'Pooja Sharma (Receptionist)',
      role: 'receptionist',
      email: 'reception@arogyaclinic.in',
      phone: '+91-9876543212',
      is_active: true
    }
  },
  doctor: {
    id: 'd1000000-0000-0000-0000-000000000001',
    email: 'dr.rajesh@arogyaclinic.in',
    role: 'doctor',
    full_name: 'Dr. Rajesh Sharma',
    profile: {
      id: 'pr000000-0000-0000-0000-000000000003',
      user_id: 'd1000000-0000-0000-0000-000000000001',
      full_name: 'Dr. Rajesh Sharma',
      role: 'doctor',
      email: 'dr.rajesh@arogyaclinic.in',
      phone: '+91-9811223344',
      is_active: true
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check local storage for demo session first
    const savedDemoUser = localStorage.getItem('demo_user')
    if (savedDemoUser) {
      try {
        const parsed = JSON.parse(savedDemoUser) as AppUser
        setUser(parsed)
        setProfile(parsed.profile || null)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('demo_user')
      }
    }

    // Otherwise check Supabase auth
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '')
        } else {
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session)
          if (session?.user) {
            await fetchProfile(session.user.id, session.user.email || '')
          } else if (!localStorage.getItem('demo_user')) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
        }
      )

      return () => subscription.unsubscribe()
    } catch {
      setLoading(false)
    }
  }, [])

  async function fetchProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        // Fallback default admin if no profile exists
        const defaultAppUser: AppUser = {
          id: userId,
          email,
          role: 'admin',
          full_name: email.split('@')[0]
        }
        setUser(defaultAppUser)
      } else if (data) {
        setProfile(data as Profile)
        setUser({
          id: userId,
          email: data.email,
          role: data.role as any,
          full_name: data.full_name,
          profile: data as Profile
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string): Promise<{ error: Error | null }> {
    // Check if email matches demo accounts for rapid testing
    if (email === 'admin@clinic.com' || email === 'admin@arogyaclinic.in') {
      loginAsDemo('admin')
      return { error: null }
    }
    if (email === 'reception@clinic.com' || email === 'reception@arogyaclinic.in') {
      loginAsDemo('receptionist')
      return { error: null }
    }
    if (email === 'doctor@clinic.com' || email === 'doctor@arogyaclinic.in') {
      loginAsDemo('doctor')
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // If Supabase is unconfigured or credentials fail, allow test mode if password is demo password
        if (password === 'password123' || password === 'admin123') {
          if (email.includes('admin')) {
            loginAsDemo('admin')
            return { error: null }
          }
          if (email.includes('doctor')) {
            loginAsDemo('doctor')
            return { error: null }
          }
          if (email.includes('reception')) {
            loginAsDemo('receptionist')
            return { error: null }
          }
        }
        return { error }
      }
      return { error: null }
    } catch (err: any) {
      return { error: err }
    }
  }

  function loginAsDemo(role: 'admin' | 'receptionist' | 'doctor') {
    const demo = DEMO_USERS[role]
    setUser(demo)
    setProfile(demo.profile || null)
    localStorage.setItem('demo_user', JSON.stringify(demo))
    setLoading(false)
  }

  async function signOut() {
    localStorage.removeItem('demo_user')
    setUser(null)
    setProfile(null)
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore network errors on logout
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        login: signIn,
        signOut,
        logout: signOut,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
