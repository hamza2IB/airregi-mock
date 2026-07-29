// FBR invoice helpers. Ported from dummy/pos-shared.js — the counter is
// persisted so reprints reuse the original number.
import { STORE_CONFIG } from './catalog.js'

export function nextFbrInvoice() {
  const key = 'air-register-fbr-counter'
  const seq = (parseInt(localStorage.getItem(key), 10) || 0) + 1
  localStorage.setItem(key, String(seq))
  return `${STORE_CONFIG.storeCode}-${String(seq).padStart(8, '0')}`
}

export function fbrVerifyUrl(fbrInvoice, amount) {
  return `https://fbr.gov.pk/verify?inv=${encodeURIComponent(fbrInvoice)}&ntn=${encodeURIComponent(
    STORE_CONFIG.ntn,
  )}&amount=${amount}`
}
