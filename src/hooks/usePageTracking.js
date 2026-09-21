// src/hooks/usePageTracking.js

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// Get (or create) a stable anonymous ID for this browser
function getSessionId() {
  let id = localStorage.getItem('session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('session_id', id)
  }
  return id
}

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    const sessionId = getSessionId()

    // Log this page view
    supabase.from('page_views').insert({
      session_id: sessionId,
      path: location.pathname,
    })

    // Register the visitor (insert if new, update last_seen if returning).
    // Uses upsert instead of select-then-insert, because guests only have
    // INSERT/UPDATE permission on this table, not SELECT — so checking
    // "does this row exist?" first would always fail silently and cause
    // duplicate-key errors on every visit after the first.
    // first_seen is deliberately left out of the payload: on conflict,
    // Postgres only updates the columns you send, so the original
    // first_seen value is preserved rather than overwritten.
    supabase
      .from('visitors')
      .upsert(
        { session_id: sessionId, last_seen: new Date().toISOString() },
        { onConflict: 'session_id' }
      )
  }, [location.pathname])
}