// src/hooks/useAnnouncePresence.js
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// Call this once, anywhere in the customer-facing app, so this visitor
// shows up in the admin's live "currently online" count.
export function useAnnouncePresence() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    // Don't announce presence while viewing admin pages — otherwise the
    // admin's own "listening" channel in TrafficStats collides with this
    // "announcing" channel (same name, same browser tab).
    if (isAdminRoute) return

    const sessionId =
      localStorage.getItem('session_id') || crypto.randomUUID()

    const channel = supabase.channel('site-presence', {
      config: { presence: { key: sessionId } },
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.track({ online_at: new Date().toISOString() })
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdminRoute])
}