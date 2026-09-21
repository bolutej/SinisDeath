// src/admin/pages/AdminAnalytics.jsx
import { TrafficStats } from '../TrafficStats'
import sinisdeath from '../../assets/sinisdeath_logo.svg'


export default function AdminAnalytics() {
  return (
    <div style={{ textAlign: 'center', paddingBottom:'280px'}}>
      <nav style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={sinisdeath} alt="Logo" style={{ width: '340px', height: 'auto', textAlign: 'center'}}/>
                    </nav>
      {/* <h1 style={{ margin: 0, paddingTop: '60px', color: 'white', fontWeight: 'bold'}}>Analytics</h1> */}
      <TrafficStats />
    </div>
  )
}