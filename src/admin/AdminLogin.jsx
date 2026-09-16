// src/admin/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password,
    })

    setLoading(false)

    if (error) {
  console.log('Supabase auth error:', error.message)
  setError(error.message)
  return
}

    navigate('/admin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0b0a',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '280px',
        }}
      >
        <h2 style={{ color: '#f4f2ec', fontFamily: 'Georgia, serif', textAlign: 'center', paddingTop: '20px' }}>
          Admin
        </h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{ padding: '10px 12px', fontSize: '1rem', marginTop: '20px', color: '#f4f2ec'  }}
        />
        {error && <p style={{ color: '#e07a5f', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 12px', fontSize: '1rem', cursor: 'pointer', color: '#f4f2ec' }}
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}