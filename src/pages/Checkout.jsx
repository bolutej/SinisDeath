import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../App.css"
import NavBar from './NavBar'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/CartContext'
import { useRegion } from '../context/RegionContext'
import Footer from '../pages/Footer'

// Countries where a postal code is expected. Nigeria/Ghana customers often
// don't know theirs, so it's optional there.
const POSTAL_REQUIRED = ['United States', 'United Kingdom', 'Canada']

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory',
]
// Orders are always priced in NGN, whatever currency is shown for reference.
const ngn = (n) => `₦${Math.round(Number(n)).toLocaleString()}`

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', postal: '',
}

const CSS = `
.co-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 36px 100px;
}

/* PAGE TITLE */
.co-title {
  font-size: 30px;
  font-weight: 700;
  margin: 8px 0 28px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #222;
}

/* MAIN LAYOUT */
.co-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.7fr);
  gap: 80px;
  align-items: start;
}

/* SECTION TITLES */
.co-section-title {
   font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #222;
  margin: 0 0 20px;
  font-weight: 500;
}

/* FORM */
.co-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 16px;
  margin-bottom: 42px;
}

.co-full {
  grid-column: 1 / -1;
}

.co-field {
  display: block;
}

.co-field > span {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.co-field input,
.co-field select {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  padding: 13px 14px;
  font-size: 16px;
  border: 1px solid #d8d8d8;
  border-radius: 0;
  background: #fff;
  color: #222;
  transition: border-color 0.15s ease;
}

.co-field input:focus,
.co-field select:focus {
  outline: none;
  border-color: #222;
}

/* COUNTRY */
.co-country {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 14px;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  margin-bottom: 18px;
}

.co-country-label {
  color: #999;
  font-size: 9px;
  margin-right: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.co-country strong {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.co-link-btn {
  background: none;
  border: none;
  text-decoration: underline;
  color: #222;
  padding: 0;
  font: inherit;
  font-size: 9px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ORDER SUMMARY */
.co-summary {
  border: none;
  border-top: 1px solid #222;
  border-radius: 0;
  padding: 0;
  position: sticky;
  top: 30px;
  background: #fff;
}

.co-summary > .co-section-title {
  padding: 20px 0 18px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 0;
}

/* PRODUCTS */
.co-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-size: 15px;
}
.co-item-name {
  font-size: 15px;
}
.co-item img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: #f7f7f7;
  border-radius: 0;
  flex-shrink: 0;
}

.co-item-info {
  flex: 1;
  min-width: 0;
  font-size: 11px;
}

.co-item-info p {
  margin: 0;
  line-height: 1.5;
}

.co-item-info p:first-child {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.co-item-opts {
  color: #999;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px !important;
}

/* DISCOUNT */
.co-code {
  display: flex;
  gap: 8px;
  margin: 20px 0 10px;
}

.co-code input {
  flex: 1;
  min-width: 0;
  padding: 12px;
  font: inherit;
  font-size: 15px;
  border: 1px solid #d8d8d8;
  border-radius: 0;
  text-transform: uppercase;
  background: #fff;
  color: #222;
}

.co-code input:focus {
  outline: none;
  border-color: #222;
}

.co-code button {
  padding: 0 18px;
  border: 1px solid #222;
  background: #fff;
  color: #222;
  border-radius: 0;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.co-code button:hover {
  background: #222;
  color: #fff;
}

.co-code button:disabled {
  opacity: 0.4;
  cursor: default;
}

.co-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  margin: 18px 0 8px;
  padding: 12px 0;
  background: none;
  border-radius: 0;
  border-bottom: 1px solid #eee;
}

.co-error {
  color: #c0392b;
  font-size: 11px;
  margin: 8px 0 0;
}

.co-note {
  color: black;
  font-size: 15px;
  line-height: 1.6;
  margin: 15px 0 0;
}

/* PRICE SUMMARY */
.co-row {
  display: flex;
  justify-content: space-between;
  padding: 11px 0;
  font-size: 14px;
  font-weight: 400;
  border-top: 1px solid #eee;
  letter-spacing: 0.04em;
}

.co-row:first-child {
  border-top: none;
}

.co-total {
  border-top: 1px solid #222;
  margin-top: 8px;
  padding-top: 18px;
  font-weight: 700;
  font-size: 17px;
}

/* BUTTON */
.co-btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 24px;
  padding: 18px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 0;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.co-btn:hover {
  background: #222;
}

.co-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.co-btn-inline {
  display: inline-block;
  width: auto;
}

/* SUCCESS / EMPTY */
.co-center {
  text-align: center;
  padding-top: 100px;
}

.co-center .co-title {
  margin-bottom: 20px;
}

/* TABLET */
@media (max-width: 900px) {
  .co-page {
    padding: 26px 24px 80px;
  }

  .co-grid {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.75fr);
    gap: 45px;
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .co-page {
    padding: 22px 14px 60px;
  }

  .co-title {
    font-size: 20px;
    margin-bottom: 32px;
  }

  .co-grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .co-summary {
    position: static;
  }

  .co-fields {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 35px;
  }

  .co-full {
    grid-column: auto;
  }

  .co-summary > .co-section-title {
    padding-top: 18px;
  }

  .co-item img {
    width: 58px;
    height: 58px;
  }
}
`

function Field({ label, full, children }) {
  return (
    <label className={`co-field${full ? ' co-full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { region, formatPrice, REGIONS } = useRegion()

  const [form, setForm] = useState(EMPTY_FORM)
  const [country, setCountry] = useState(region.label)
  const [editingCountry, setEditingCountry] = useState(false)

  const [codeInput, setCodeInput] = useState('')
  const [discount, setDiscount] = useState(null) // { code, amount } once applied
  const [codeError, setCodeError] = useState(null)
  const [checkingCode, setCheckingCode] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [placed, setPlaced] = useState(null)
  const [shippingAmount, setShippingAmount] = useState(null)
  const [loadingShipping, setLoadingShipping] = useState(false)

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const discountAmount = discount?.amount ?? 0
  const total = Math.max(totalPrice - discountAmount, 0) + (shippingAmount || 0)
  const postalRequired = POSTAL_REQUIRED.includes(country)

  useEffect(() => {
  const loadShipping = async () => {
    setLoadingShipping(true)
    setShippingAmount(null)

    let query = supabase
      .from('shipping_rates')
      .select('fee_ngn')
      .eq('country', country)

    if (country === 'Nigeria') {
      if (!form.state) {
        setLoadingShipping(false)
        return
      }

      query = query.eq('state', form.state)
    } else {
      query = query.is('state', null)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      setShippingAmount(null)
    } else {
      setShippingAmount(Number(data.fee_ngn))
    }

    setLoadingShipping(false)
  }

  loadShipping()
}, [country, form.state])

  // The amount shown here is a preview. The server re-checks the code
  // and recalculates everything when the order is actually placed.
  const applyCode = async () => {
    const code = codeInput.trim()
    if (!code) return
    setCodeError(null)
    setCheckingCode(true)

    const { data, error } = await supabase.rpc('validate_discount_code', {
      code_input: code,
      order_total: totalPrice,
    })

    setCheckingCode(false)

    if (error) {
      setCodeError("Couldn't check that code. Please try again.")
      return
    }
    if (!data || data.length === 0) {
      setCodeError('That code is invalid, expired, or not eligible for this order.')
      return
    }
    setDiscount({ code, amount: Number(data[0].discount_amount) })
  }

  const removeCode = () => {
    setDiscount(null)
    setCodeInput('')
    setCodeError(null)
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)

  if (codeInput.trim() && !discount) {
    setError('Click Apply to use your discount code, or clear the field.')
    return
  }

  if (country === 'Nigeria' && !form.state) {
    setError('Please select your state.')
    return
  }

  if (loadingShipping) {
    setError('Please wait while we calculate shipping.')
    return
  }

  if (shippingAmount === null) {
    setError(`Shipping to ${country}${form.state ? `, ${form.state}` : ''} is not available yet.`)
    return
  }

  setSubmitting(true)

  // ...keep your existing Supabase RPC here

    setSubmitting(true)

    // Only ids and quantities are sent. Prices, stock and the discount
    // are all worked out on the server, so they can't be tampered with.
    const { data, error } = await supabase.rpc('create_order', {
      p_items: items.map((i) => ({
        product_id: i.productId,
        variant_id: i.variantId,
        quantity: i.quantity,
      })),
      p_customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postal_code: form.postal,
        country,
      },
      p_discount_code: discount?.code ?? null,
    })

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    // TODO(payment): once Paystack is connected, send the customer to pay
    // here instead of finishing straight away.
    clearCart()
    setPlaced({ id: data.order_id, total: Number(data.total_amount) })
  }

  // ---------- order placed ----------
  if (placed) {
    return (
      <>
        <NavBar />
        <style>{CSS}</style>
        <div className="co-page co-center">
          <h1 className="co-title">Thank you</h1>
          <p>Your order has been placed.</p>
          <p style={{ color: '#666', fontSize: 14 }}>
            Order reference: <strong>{placed.id.slice(0, 8).toUpperCase()}</strong>
            <br />
            Total: <strong>{ngn(placed.total)}</strong>
          </p>
          <Link to="/shop" className="co-btn co-btn-inline">Continue shopping</Link>
        </div>
      </>
    )
  }

  // ---------- nothing to check out ----------
  if (items.length === 0) {
    return (
      <>
        <NavBar />
        <style>{CSS}</style>
        <div className="co-page co-center">
          <h1 className="co-title">Your cart is empty</h1>
          <Link to="/shop" className="co-btn co-btn-inline">Go to shop</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <style>{CSS}</style>

      <div className="co-page">
        <h1 className="co-title">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="co-grid">
            {/* ---------- left: details ---------- */}
            <div>
              <h2 className="co-section-title">Contact</h2>
              <div className="co-fields">
                <Field label="Full name" full>
                  <input
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    autoComplete="name"
                    required
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </Field>
              </div>

              <h2 className="co-section-title">Shipping address</h2>
              <div className="co-fields">
                {editingCountry ? (
                  <Field label="Country" full>
                    <select
                      value={country}
                      onChange={(e) => {
  const newCountry = e.target.value

  setCountry(newCountry)

  setForm((f) => ({
    ...f,
    state: '',
  }))

  setEditingCountry(false)
}}
                      autoComplete="country-name"
                      autoFocus
                    >
                      {REGIONS.map((r) => (
                        <option key={r.code} value={r.label}>{r.label}</option>
                      ))}
                    </select>
                  </Field>
                ) : (
                  <div className="co-full co-country">
                    <span>
                      <span className="co-country-label">Shipping to</span>
                      <strong>{country}</strong>
                    </span>
                    <button
                      type="button"
                      className="co-link-btn"
                      onClick={() => setEditingCountry(true)}
                    >
                      Change
                    </button>
                  </div>
                )}
                <Field label="Address" full>
                  <input
                    value={form.line1}
                    onChange={(e) => setField('line1', e.target.value)}
                    autoComplete="address-line1"
                    required
                  />
                </Field>
                <Field label="Apartment, suite, etc. (optional)" full>
                  <input
                    value={form.line2}
                    onChange={(e) => setField('line2', e.target.value)}
                    autoComplete="address-line2"
                  />
                </Field>
                <Field label="City">
                  <input
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                    autoComplete="address-level2"
                    required
                  />
                </Field>
                <Field label={country === 'Nigeria' ? 'State' : 'State / Province'}>
  {country === 'Nigeria' ? (
    <select
      value={form.state}
      onChange={(e) => setField('state', e.target.value)}
      autoComplete="address-level1"
      required
    >
      <option value="">Select your state</option>

      {NIGERIAN_STATES.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  ) : (
    <input
      value={form.state}
      onChange={(e) => setField('state', e.target.value)}
      autoComplete="address-level1"
    />
  )}
</Field>
                <Field label={postalRequired ? 'Postal code' : 'Postal code (optional)'}>
                  <input
                    value={form.postal}
                    onChange={(e) => setField('postal', e.target.value)}
                    autoComplete="postal-code"
                    required={postalRequired}
                  />
                </Field>
              </div>
            </div>

            {/* ---------- right: summary ---------- */}
            <aside className="co-summary">
              <h2 className="co-section-title">Order summary</h2>

              {items.map((item) => (
                <div className="co-item" key={`${item.productId}-${item.variantId}`}>
                  <img src={item.image} alt={item.name} />
                  <div className="co-item-info">
                    <p>{item.name}</p>
                    <p className="co-item-opts">
                      {[item.size, item.color].filter(Boolean).join(' / ')}
                      {(item.size || item.color) ? ' · ' : ''}Qty {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: 14 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              {/* discount code */}
              {discount ? (
                <div className="co-applied">
                  <span><strong>{discount.code.toUpperCase()}</strong> applied</span>
                  <button type="button" className="co-link-btn" onClick={removeCode}>Remove</button>
                </div>
              ) : (
                <>
                  <div className="co-code">
                    <input
                      placeholder="Discount code"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault() // don't submit the whole form
                          applyCode()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={applyCode}
                      disabled={checkingCode || !codeInput.trim()}
                    >
                      {checkingCode ? '...' : 'Apply'}
                    </button>
                  </div>
                  {codeError && <p className="co-error" style={{ marginTop: 0 }}>{codeError}</p>}
                </>
              )}

              <div style={{ marginTop: 12 }}>
                <div className="co-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="co-row">
                    <span>Shipping</span>
                    <span>
                        {loadingShipping
                            ? '...'
                            : shippingAmount === null
                            ? 'Unavailable'
                            : formatPrice(shippingAmount)}
                    </span>
                </div>
                {discountAmount > 0 && (
                  <div className="co-row" style={{ color: '#2d8a4e' }}>
                    <span>Discount</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="co-row co-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {region.code !== 'NG' && (
                <p className="co-note">
                  Prices are shown in {region.currency} as an estimate. Orders are
                  priced in naira: {ngn(total)}.
                </p>
              )}

              {error && <p className="co-error">{error}</p>}

              <button type="submit" className="co-btn" disabled={submitting}>
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
            </aside>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}