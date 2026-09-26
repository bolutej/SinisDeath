// src/admin/RequireAdmin.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setStatus('denied')
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || profile?.role !== 'admin') {
      setStatus('denied')
      return
    }

    setStatus('allowed')
  }

  if (status === 'checking') {
    return <div style={{ padding: 40 }}>Checking access...</div>
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}