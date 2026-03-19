/**
 * Format a price in smallest currency unit (paise/cents) for display.
 * @param {number} price — amount in smallest unit (e.g. 1000 = ₹10 or $10.00)
 * @param {string} currency — 'inr', 'usd', 'gbp', 'eur'
 * @param {string} symbol — '₹', '$', '£', '€'
 * @param {number} [decimals] — override decimal places (INR auto-detects)
 */
export default function formatPrice(price, currency, symbol, decimals) {
  const val = price / 100
  if (currency === 'inr') {
    return val % 1 === 0 ? `${symbol}${val.toFixed(0)}` : `${symbol}${val.toFixed(decimals ?? 2)}`
  }
  return `${symbol}${val.toFixed(2)}`
}
