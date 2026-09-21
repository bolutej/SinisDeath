// src/admin/components/TrafficStats.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const PERIODS = [
  { label: '24H', hours: 24 },
  { label: '7D', hours: 24 * 7 },
  { label: '30D', hours: 24 * 30 },
]

export function TrafficStats() {
  const [loading, setLoading] = useState(true)
  const [periodStats, setPeriodStats] = useState([])
  const [onlineNow, setOnlineNow] = useState(0)

  useEffect(() => {
    fetchStats()
    const channel = subscribeToPresence(setOnlineNow)
    return () => supabase.removeChannel(channel)
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    const results = await Promise.all(PERIODS.map(fetchPeriodStats))
    setPeriodStats(results)
    setLoading(false)
  }

  if (loading) return <div style={{paddingTop: '200px'}}>Loading analytics stats...</div>

  return (
    <div style={{ margin: '30px', paddingTop: '30px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h3 style={{ fontSize: 40, margin: 0, paddingBottom: 40 }}>Analytics</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#2d8a4e',
              display: 'inline-block',
              // fontSize: '30px'
            }}
          />
          {onlineNow} online now
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {periodStats.map((p) => (
          <div
            key={p.label}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <p style={{ fontSize: 20, margin: '0 0 8px' }}>
              Last {p.label}
            </p>
            <TrendRow label="Page views" value={p.views} change={p.viewsChange} />
            <TrendRow label="New visitors" value={p.newVisitors} change={p.visitorsChange} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendRow({ label, value, change }) {
  // null change means "no data from the previous period to compare to"
  const hasChange = change !== null && Number.isFinite(change)
  const isUp = hasChange && change > 0
  const isDown = hasChange && change < 0
  const color = isUp ? '#2d8a4e' : isDown ? '#c0392b' : '#ffff'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
      }}
    >
      <span style={{ fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 14 }}>
        <strong>{value}</strong>{' '}
        {hasChange && (
          <span style={{ color, fontSize: 12 }}>
            {isUp ? '▲' : isDown ? '▼' : '–'} {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </span>
    </div>
  )
}

// Fetch views + new visitors for one period, plus the % change vs the
// equivalent PRIOR period (e.g. this 24h vs the 24h before that).
async function fetchPeriodStats({ label, hours }) {
  const now = new Date()
  const periodStart = new Date(now.getTime() - hours * 60 * 60 * 1000)
  const priorStart = new Date(periodStart.getTime() - hours * 60 * 60 * 1000)

  const [{ count: views }, { count: priorViews }, { count: newVisitors }, { count: priorVisitors }] =
    await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', periodStart.toISOString()),
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', priorStart.toISOString())
        .lt('created_at', periodStart.toISOString()),
      supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .gte('first_seen', periodStart.toISOString()),
      supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .gte('first_seen', priorStart.toISOString())
        .lt('first_seen', periodStart.toISOString()),
    ])

  const pctChange = (current, prior) => {
    if (!prior) return current > 0 ? 100 : null // no prior data to compare
    return ((current - prior) / prior) * 100
  }

  return {
    label,
    views: views ?? 0,
    newVisitors: newVisitors ?? 0,
    viewsChange: pctChange(views ?? 0, priorViews ?? 0),
    visitorsChange: pctChange(newVisitors ?? 0, priorVisitors ?? 0),
  }
}

// Subscribe to the same presence channel the storefront announces to,
// and keep a live count of how many distinct sessions are tracked.
function subscribeToPresence(setOnlineNow) {
  const channel = supabase.channel('site-presence')

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      setOnlineNow(Object.keys(state).length)
    })
    .subscribe()

  return channel
}