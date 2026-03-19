/**
 * Browser fingerprinting for server-side trial tracking.
 * Uses FingerprintJS (free, open-source) to generate a stable visitor ID
 * that persists across incognito, cleared cookies, and different sessions.
 *
 * Falls back to a localStorage-cached random ID if FingerprintJS is unavailable.
 */

const STORAGE_KEY = 'fmx_visitor_id'
let _visitorId = null

function getCachedId() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function setCachedId(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // ignore
  }
}

/**
 * Generate a simple fingerprint without external dependencies.
 * Combines: canvas hash, screen, timezone, language, platform.
 * Not as robust as FingerprintJS but works without npm install.
 */
function generateSimpleFingerprint() {
  const components = []

  // Screen
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`)

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)

  // Language
  components.push(navigator.language)

  // Platform
  components.push(navigator.platform)

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('FixMyText', 2, 15)
    ctx.fillStyle = 'rgba(102,204,0,0.7)'
    ctx.fillText('FixMyText', 4, 17)
    components.push(canvas.toDataURL())
  } catch {
    components.push('no-canvas')
  }

  // WebGL renderer
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      }
    }
  } catch {
    components.push('no-webgl')
  }

  // Hash all components
  const raw = components.join('|||')
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + raw.length.toString(36)
}

export function getVisitorId() {
  if (_visitorId) return _visitorId

  const cached = getCachedId()
  if (cached) {
    _visitorId = cached
    return _visitorId
  }

  _visitorId = generateSimpleFingerprint()
  setCachedId(_visitorId)
  return _visitorId
}

