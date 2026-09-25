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
  const [periodStats, setPeriodStats] = useState({})
  const [selected, setSelected] = useState('24H')
  const [onlineNow, setOnlineNow] = useState(0)

  useEffect(() => {
    fetchStats()
    const channel = subscribeToPresence(setOnlineNow)
    return () => supabase.removeChannel(channel)
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    const results = await Promise.all(PERIODS.map(fetchPeriodStats))
    const byLabel = {}
    results.forEach((r) => {
      byLabel[r.label] = r
    })
    setPeriodStats(results)
    setLoading(false)
  }

  if (loading) return <div style={{paddingTop: '200px'}}>Loading analytics stats...</div>

  const current = periodStats[selected]

  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
      }}
    >
      {/* Header: title left, period toggle top right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontSize: 35, margin: 0, color: '#444',paddingBottom: '70px', paddingTop: '20px'}}>Traffic</h3>
 
        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden', marginBottom: '70px', marginTop: '20px' }}>
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setSelected(p.label)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: selected === p.label ? '#111' : '#fff',
                color: selected === p.label ? '#fff' : '#555',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* Three stacked rows */}
      <div
  style={{
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '0 20px',
  }}
>
  <StatRow
    label="Page views"
    value={current?.views ?? 0}
    change={current?.viewsChange}
    sublabel={`last ${selected}`}
  />

  <div style={{ width: 1, height: 48, background: '#eee' }} />

  <StatRow
    label="New visitors"
    value={current?.newVisitors ?? 0}
    change={current?.visitorsChange}
    sublabel={`last ${selected}`}
  />

  <div style={{ width: 1, height: 48, background: '#eee' }} />

  <StatRow label="Online now" value={onlineNow} isLive />
</div>
    </div>
  )
}
 
function StatRow({ label, value, change, sublabel, isLive = false }) {
  const hasChange = change !== null && change !== undefined && Number.isFinite(change)
  const isUp = hasChange && change > 0
  const isDown = hasChange && change < 0
  const trendColor = isUp ? '#2d8a4e' : isDown ? '#c0392b' : '#ffff'
 
  return (
    <div
      style={{
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px 20px',
        border: '1px solid #f0f0f0',
        marginLeft: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: '10px' }}>
        {isLive && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#2d8a4e',
              display: 'inline-block',
            }}
          />
        )}
        <span style={{ fontSize: 14 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 12, color: '#999' }}>({sublabel})</span>
        )}
      </div>
 
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600 }}>{value}</span>
        {hasChange && (
          <span style={{ color: trendColor, fontSize: 13 }}>
            {isUp ? '▲' : isDown ? '▼' : '–'} {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>
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
 
  const pctChange = (curr, prior) => {
    if (!prior) return curr > 0 ? 100 : null // no prior data to compare
    return ((curr - prior) / prior) * 100
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