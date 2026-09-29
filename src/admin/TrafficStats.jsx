// src/admin/components/TrafficStats.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Loading from '.././pages/loadingg2'

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
    setPeriodStats(byLabel) // was setPeriodStats(results), which made periodStats[selected] always undefined
    setLoading(false)
  }

  if (loading) return <Loading />

  const current = periodStats[selected]

  return (
    <section className="tr-root">
      <style>{styles}</style>

      <div className="tr-wrap">
      {/* Header: title left, period toggle right */}
      <div className="tr-head">
        <h2 className="tr-title">Traffic</h2>

        <div className="tr-toggle" role="group" aria-label="Time period">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={selected === p.label}
              onClick={() => setSelected(p.label)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="tr-grid">
        <Stat
          label="Page views"
          value={current?.views ?? 0}
          change={current?.viewsChange}
          sublabel={`Last ${selected}`}
          compare={`vs previous ${selected}`}
        />
        <Stat
          label="New visitors"
          value={current?.newVisitors ?? 0}
          change={current?.visitorsChange}
          sublabel={`Last ${selected}`}
          compare={`vs previous ${selected}`}
        />
        <Stat label="Online now" value={onlineNow} sublabel="Live" isLive />
      </div>
      </div>
    </section>
  )
}

function Stat({ label, value, change, sublabel, compare, isLive = false }) {
  const hasChange = change !== null && change !== undefined && Number.isFinite(change)
  const isUp = hasChange && Math.round(change) > 0
  const isDown = hasChange && Math.round(change) < 0

  return (
    <div className="tr-stat">
      <div className="tr-stat-head">
        {isLive && <i className="tr-dot" aria-hidden="true" />}
        <span className="tr-stat-label">{label}</span>
        {sublabel && <span className="tr-stat-sub">{sublabel}</span>}
      </div>

      <p className="tr-value">{Number(value).toLocaleString('en-NG')}</p>

      {!isLive && (
        <p className={`tr-trend ${isUp ? 'is-up' : isDown ? 'is-down' : ''}`}>
          {hasChange ? (
            <>
              {(isUp || isDown) && <Arrow down={isDown} />}
              <span className="tr-sr">{isUp ? 'Up ' : isDown ? 'Down ' : 'No change, '}</span>
              {Math.abs(change).toFixed(0)}%
              <span className="tr-compare">{compare}</span>
            </>
          ) : (
            <span className="tr-compare tr-nocompare">No earlier data to compare</span>
          )}
        </p>
      )}
    </div>
  )
}

function Arrow({ down }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: down ? 'rotate(180deg)' : 'none' }}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
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

/* ---------- Styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* Neutralise global element styles leaking in from index.css / App.css */
:where(.tr-root) :is(div, h2, p, span, i, button) {
  all: revert;
}

.tr-root {
  --ink: #000;
  --muted: #767676;
  --line: #e5e5e5;
  --up: #1E8E5A;
  --down: #D4321F;
  --gutter: clamp(20px, 6vw, 93px);
  font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  color: var(--ink);
  padding-top: 40px;
  margin-bottom: 48px;
}
.tr-wrap { max-width: 1440px; margin: 0 auto; padding: 0 var(--gutter); }
.tr-root *, .tr-root *::before, .tr-root *::after { box-sizing: border-box; }
.tr-root p, .tr-root h2 { margin: 0; padding: 0; }

/* Header */
.tr-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
.tr-title { font-size: 20px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase; }

/* Period toggle */
.tr-toggle { display: inline-flex; border: 1px solid var(--line); }
.tr-toggle button {
  height: 36px; padding: 0 18px; border: 0; background: #fff; color: var(--ink); cursor: pointer;
  font: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
}
.tr-toggle button + button { border-left: 1px solid var(--line); }
.tr-toggle button:hover:not([aria-pressed='true']) { background: #f5f5f5; }
.tr-toggle button[aria-pressed='true'] { background: var(--ink); color: #fff; }

/* Stats */
.tr-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.tr-stat { padding: 32px 32px 32px 0; min-width: 0; }
.tr-stat + .tr-stat { padding-left: 32px; border-left: 1px solid var(--line); }

.tr-stat-head { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; margin-bottom: 20px; }
.tr-stat-label { font-size: 13px; font-weight: 500; }
.tr-stat-sub { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

.tr-value {
  font-size: clamp(36px, 4.5vw, 52px); font-weight: 300; letter-spacing: -0.02em; line-height: 1;
  font-variant-numeric: tabular-nums;
}

.tr-trend {
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
  margin-top: 18px; font-size: 13px; font-weight: 500; color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.tr-trend.is-up { color: var(--up); }
.tr-trend.is-down { color: var(--down); }
.tr-compare { font-size: 12px; font-weight: 400; color: var(--muted); margin-left: 4px; }
.tr-nocompare { margin-left: 0; }

/* Live indicator */
.tr-dot { width: 8px; height: 8px; display: block; border-radius: 50%; background: var(--up); animation: tr-pulse 2s infinite; }
@keyframes tr-pulse {
  0% { box-shadow: 0 0 0 0 rgba(30, 142, 90, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(30, 142, 90, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 142, 90, 0); }
}

.tr-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

.tr-toggle button:focus-visible { outline: 1px solid var(--ink); outline-offset: -4px; }
.tr-toggle button[aria-pressed='true']:focus-visible { outline-color: #fff; }

@media (max-width: 760px) {
  .tr-grid { grid-template-columns: 1fr; border-bottom: 0; }
  .tr-stat, .tr-stat + .tr-stat { padding: 24px 0; border-left: 0; border-bottom: 1px solid var(--line); }
  .tr-stat + .tr-stat { border-top: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tr-dot { animation: none; }
}
`