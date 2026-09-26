// src/context/RegionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const RegionContext = createContext()

const STORAGE_KEY = 'region'

// Rates are "how many units of this currency per 1 NGN."
// Snapshot as of late July 2026 — exchange rates drift daily, so these
// will go stale. For a real store, swap this for a live rate API
// (e.g. exchangerate-api.com) fetched periodically, or at minimum
// update these numbers every few weeks.
export const REGIONS = [
  { code: 'NG', label: 'Nigeria', currency: 'NGN', symbol: '₦', rateFromNGN: 1 },
  { code: 'US', label: 'United States', currency: 'USD', symbol: '$', rateFromNGN: 1 / 1376 },
  { code: 'GB', label: 'United Kingdom', currency: 'GBP', symbol: '£', rateFromNGN: 1 / 1855 },
  { code: 'GH', label: 'Ghana', currency: 'GHS', symbol: '₵', rateFromNGN: 0.0083 },
  { code: 'CA', label: 'Canada', currency: 'CAD', symbol: '$', rateFromNGN: 1 / 985 },
]

export function RegionProvider({ children }) {
  const [regionCode, setRegionCode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'NG'
  })

  // Show the picker automatically on a visitor's first-ever visit (no
  // stored region yet). Once they pick one, it won't auto-show again —
  // they can still reopen it manually via the small corner button.
  const [pickerOpen, setPickerOpen] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === null
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, regionCode)
  }, [regionCode])

  const chooseRegion = (code) => {
    setRegionCode(code)
    setPickerOpen(false)
  }

  const region = REGIONS.find((r) => r.code === regionCode) ?? REGIONS[0]

  // Takes a price stored in NGN (all your product prices are stored in
  // NGN regardless of region) and returns a formatted string in the
  // shopper's selected currency, e.g. formatPrice(25000) -> "$18.17"
  const formatPrice = (ngnAmount) => {
    const converted = ngnAmount * region.rateFromNGN
    const decimals = region.code === 'NG' ? 0 : 2
    return `${region.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`
  }

  return (
    <RegionContext.Provider
      value={{
        region,
        regionCode,
        setRegionCode,
        formatPrice,
        REGIONS,
        pickerOpen,
        setPickerOpen,
        chooseRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  return useContext(RegionContext)
}