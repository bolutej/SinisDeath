// src/admin/pages/AdminAnalytics.jsx
import { TrafficStats } from '../TrafficStats'
import AdminNavbar from './AdminNavbar'


export default function AdminAnalytics() {
  return (
    <div style={{ textAlign: 'center', paddingBottom:'280px'}}>
      <AdminNavbar />
      <TrafficStats />
    </div>
  )
}