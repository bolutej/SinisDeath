import NavBar from './NavBar'

export default function info() {
    return (
        <div style={{letterSpacing: '1.5px',paddingBottom: '90px'}}>
            <NavBar />
            <div style={{display: 'flex', justifyContent: 'space-around',paddingTop: '20px'}}>
            <div>
            <h1>REFUND POLICY</h1>
            <p style={{fontSize: '20px'}}>ALL SALES ARE FINAL, WE DO NOT OFFER<br /> REFUNDS UNLESS THE ITEM IS<br /> UNAVAILABLE OR IF THE ITEM IS LOST IN<br /> TRANSIT.</p>
            </div>
            <div>
                <h1>SHIPPING</h1>
                <p style={{fontSize: '20px'}}>ALL ORDERS ARE PROCESSED WITHIN 3–5<br /> BUSINESS DAYS BEFORE THEY ARE SENT<br /> OUT FOR DELIVERY. PLEASE CONFIRM THE<br/> DELIVERY INFORMATION FOR EACH ITEM<br/> BY READING ITS DESCRIPTION. TO ENSURE<br/> SMOOTH COMMUNICATION, PLEASE<br/> PROVIDE A VALID EMAIL AND PHONE<br/> NUMBER WHEN PLACING YOUR ORDER.<br/> NOTE THAT IMPORT DUTIES MAY APPLY<br/> FOR CUSTOMERS IN CERTAIN REGIONS.<br/> FOR MORE INFO, REFER TO OUR SHIPPING<br/> POLICY</p>
            </div>
            </div>
        </div>
    )
}