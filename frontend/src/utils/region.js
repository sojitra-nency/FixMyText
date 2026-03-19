/**
 * Detect user's pricing region from browser timezone and locale.
 * Returns: 'IN', 'US', 'GB', 'EU', or '' (let server decide).
 */
export function detectBrowserRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''

    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'IN'
    if (tz.startsWith('Europe/London')) return 'GB'
    if (tz.startsWith('Europe/')) return 'EU'
    if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') ||
        tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles') ||
        tz.startsWith('America/Phoenix') || tz.startsWith('US/')) return 'US'

    const lang = (navigator.language || '').toLowerCase()
    if (lang.includes('-in') || lang === 'hi' || lang === 'hi-in') return 'IN'
    if (lang.includes('-gb')) return 'GB'
    if (lang.includes('-us') || lang === 'en') return 'US'
  } catch { /* ignore */ }
  return ''
}

export const BROWSER_REGION = detectBrowserRegion()
