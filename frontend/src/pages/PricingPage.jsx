import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPassCatalogQuery } from '../store/api/passesApi'
import useSubscription from '../hooks/useSubscription'
import formatPriceUtil from '../utils/formatPrice'

// ── SVG Icon helpers ──
const I = ({ d, size = 24, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', children }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
)

const NumIcon = ({ n, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="4" stroke="#007ACC" strokeWidth="2" fill="#007ACC22" />
    <text x="12" y="16.5" textAnchor="middle" fill="#007ACC" fontSize={n.toString().length > 1 ? '11' : '14'} fontWeight="bold" fontFamily="monospace">{n}</text>
  </svg>
)

const DropletIcon = (p) => <I {...p} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
const SunIcon = (p) => <I {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></I>
const RunnerIcon = (p) => <I {...p}><circle cx="17" cy="4" r="2"/><path d="M14 7l-2 2-3 1-1 4 3 2v4"/><path d="M9 9L6 12"/><path d="M12 9l4 4-2 4"/></I>
const CalendarIcon = (p) => <I {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></I>
const TrophyIcon = (p) => <I {...p}><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/><path d="M6 3h12v7a6 6 0 0 1-12 0V3z"/><path d="M9 21h6"/><path d="M12 16v5"/></I>
const WrenchIcon = (p) => <I {...p} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
const TwoIcon = (p) => <I {...p}><rect x="2" y="2" width="20" height="20" rx="4" stroke="#007ACC" strokeWidth="2" fill="#007ACC22" /><text x="12" y="16.5" textAnchor="middle" fill="#007ACC" fontSize="11" fontWeight="bold" fontFamily="monospace">2x</text></I>
const StarIcon = (p) => <I {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
const FlagIcon = (p) => <I {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></I>
const ClipboardIcon = (p) => <I {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></I>
const RulerIcon = (p) => <I {...p}><path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/></I>
const LeafIcon = (p) => <I {...p}><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-3.8 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></I>
const CrownIcon = (p) => <I {...p}><path d="M2 20h20l-2-12-5 5-3-7-3 7-5-5-2 12z"/><rect x="2" y="20" width="20" height="2" rx="1"/></I>
const JarIcon = (p) => <I {...p}><path d="M8 3h8v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V3z"/><rect x="6" y="7" width="12" height="13" rx="2"/><line x1="6" y1="11" x2="18" y2="11"/></I>
const BucketIcon = (p) => <I {...p}><path d="M5 7h14l-1.5 13a2 2 0 0 1-2 1.75h-7A2 2 0 0 1 6.5 20L5 7z"/><path d="M4 7c0-2 3.6-4 8-4s8 2 8 4"/></I>
const BarrelIcon = (p) => <I {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></I>
const GiftIcon = (p) => <I {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></I>

const PRO_PRICES = { inr: '₹399', usd: '$5', gbp: '£4', eur: '€4.50' }

const PASS_GROUPS = [
  { key: 'micro',    label: 'Micro',     icon: <DropletIcon size={16} />, desc: 'Just a taste — pocket change' },
  { key: 'day',      label: 'Day',       icon: <SunIcon size={16} />, desc: 'One productive day' },
  { key: 'multiday', label: 'Multi-Day', icon: <RunnerIcon size={16} />, desc: 'Short-term commitment' },
  { key: 'monthly',  label: 'Monthly',   icon: <CalendarIcon size={16} />, desc: 'Regular power user' },
  { key: 'longterm', label: 'Long-Term', icon: <TrophyIcon size={16} />, desc: 'Best value for pros' },
]

const GROUP_IDS = {
  micro:    ['quick_fix', 'tinkerer', 'double_dip'],
  day:      ['day_single', 'day_triple', 'day_five', 'day_ten', 'day_fifteen', 'day_all'],
  multiday: ['sprint_single', 'sprint_triple', 'sprint_five', 'sprint_all', 'marathon_five', 'marathon_all', 'stretch_all'],
  monthly:  ['monthly_five', 'monthly_ten', 'monthly_all'],
  longterm: ['season_all', 'half_year', 'annual'],
}

const PASS_ICONS = {
  quick_fix: <DropletIcon size={28} />, tinkerer: <WrenchIcon size={28} />, double_dip: <TwoIcon size={28} />,
  day_single: <NumIcon n={1} size={28} />, day_triple: <NumIcon n={3} size={28} />, day_five: <NumIcon n={5} size={28} />, day_ten: <NumIcon n={10} size={28} />, day_fifteen: <ClipboardIcon size={28} />, day_all: <StarIcon size={28} />,
  sprint_single: <FlagIcon size={28} />, sprint_triple: <FlagIcon size={28} />, sprint_five: <FlagIcon size={28} />, sprint_all: <FlagIcon size={28} />,
  marathon_five: <RunnerIcon size={28} />, marathon_all: <RunnerIcon size={28} />, stretch_all: <RulerIcon size={28} />,
  monthly_five: <CalendarIcon size={28} />, monthly_ten: <CalendarIcon size={28} />, monthly_all: <CalendarIcon size={28} />,
  season_all: <LeafIcon size={28} />, half_year: <CalendarIcon size={28} />, annual: <CrownIcon size={28} />,
}

const PASS_ICONS_LG = {
  quick_fix: <DropletIcon size={52} />, tinkerer: <WrenchIcon size={52} />, double_dip: <TwoIcon size={52} />,
  day_single: <NumIcon n={1} size={52} />, day_triple: <NumIcon n={3} size={52} />, day_five: <NumIcon n={5} size={52} />, day_ten: <NumIcon n={10} size={52} />, day_fifteen: <ClipboardIcon size={52} />, day_all: <StarIcon size={52} />,
  sprint_single: <FlagIcon size={52} />, sprint_triple: <FlagIcon size={52} />, sprint_five: <FlagIcon size={52} />, sprint_all: <FlagIcon size={52} />,
  marathon_five: <RunnerIcon size={52} />, marathon_all: <RunnerIcon size={52} />, stretch_all: <RulerIcon size={52} />,
  monthly_five: <CalendarIcon size={52} />, monthly_ten: <CalendarIcon size={52} />, monthly_all: <CalendarIcon size={52} />,
  season_all: <LeafIcon size={52} />, half_year: <CalendarIcon size={52} />, annual: <CrownIcon size={52} />,
}

const CREDIT_ICONS = { credits_5: <DropletIcon size={32} />, credits_15: <JarIcon size={32} />, credits_50: <BucketIcon size={32} />, credits_150: <BarrelIcon size={32} /> }

function getValueTag(pass) {
  if (pass.id === 'day_all') return 'Best Day Deal'
  if (pass.id === 'sprint_all') return 'Popular'
  if (pass.id === 'monthly_all') return 'Best Monthly'
  if (pass.id === 'annual') return 'Best Value'
  if (pass.id === 'quick_fix') return 'Cheapest'
  return null
}

function getPerDayPrice(pass, formatPrice) {
  if (pass.duration_days <= 1) return null
  return formatPrice(pass.price / pass.duration_days)
}

export default function PricingPage({ showAlert, subscription: subProp }) {
  const navigate = useNavigate()
  const { accessToken } = useSelector((s) => s.auth)
  const fallbackSub = useSubscription({ showAlert })
  const subscription = subProp || fallbackSub
  const { data: catalog, isLoading, error: catalogError } = useGetPassCatalogQuery()
  const [activeGroup, setActiveGroup] = useState('day')
  const [selectedPass, setSelectedPass] = useState(null)
  const [selectedCredit, setSelectedCredit] = useState(null)
  const [buyingId, setBuyingId] = useState(null)

  const passes = catalog?.passes || []
  const creditPacks = catalog?.credit_packs || []
  const symbol = passes[0]?.symbol || '$'
  const currency = passes[0]?.currency || 'usd'

  const formatPrice = (price, decimals) => formatPriceUtil(price, currency, symbol, decimals)

  const passMap = useMemo(() => {
    const m = {}
    passes.forEach(p => { m[p.id] = p })
    return m
  }, [passes])

  const creditMap = useMemo(() => {
    const m = {}
    creditPacks.forEach(c => { m[c.id] = c })
    return m
  }, [creditPacks])

  const activeGroupPasses = useMemo(() =>
    (GROUP_IDS[activeGroup] || []).map(id => passMap[id]).filter(Boolean),
    [activeGroup, passMap]
  )

  const handleBuyPass = async (passId) => {
    if (!accessToken) {
      showAlert?.('Sign in to purchase a pass', 'warning')
      navigate('/login')
      return
    }
    setBuyingId(passId)
    try {
      await subscription.handleBuyPass(passId, [])
    } finally {
      setBuyingId(null)
    }
  }

  const handleBuyCredits = async (packId) => {
    if (!accessToken) {
      showAlert?.('Sign in to purchase credits', 'warning')
      navigate('/login')
      return
    }
    setBuyingId(packId)
    try {
      await subscription.handleBuyCredits(packId)
    } finally {
      setBuyingId(null)
    }
  }

  const detailPass = selectedPass ? passMap[selectedPass] : null
  const detailCredit = selectedCredit ? creditMap[selectedCredit] : null

  return (
    <div className="tu-pricing">
      {/* ── Sticky top bar ── */}
      <div className="tu-pricing-topbar">
        <button className="tu-pricing-back" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Editor
        </button>
        <span className="tu-pricing-topbar-title">Pricing</span>
      </div>

      <div className="tu-pricing-inner">
        {/* ── Hero ── */}
        <div className="tu-pricing-hero">
          <h1 className="tu-pricing-title">Simple, Flexible Pricing</h1>
          <p className="tu-pricing-subtitle">
            Every tool gets <strong>3 free uses/day</strong>. Need more? Pick a pass that fits your workflow.
          </p>
          <div className="tu-pricing-badges">
            <span className="tu-pricing-badge">70+ Tools</span>
            <span className="tu-pricing-badge">Cancel Anytime</span>
            <span className="tu-pricing-badge">Earn Free Passes</span>
          </div>
        </div>

        {/* ── Pro Card ── */}
        <motion.div
          className="tu-pricing-pro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="tu-pricing-pro-glow" />
          <div className="tu-pricing-pro-badge">Recommended</div>
          <div className="tu-pricing-pro-content">
            <div className="tu-pricing-pro-left">
              <h2 className="tu-pricing-pro-name">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Pro
              </h2>
              <p className="tu-pricing-pro-desc">Unlimited access to every tool. No daily limits. No passes needed.</p>
              <ul className="tu-pricing-pro-features">
                <li>Unlimited uses on all 70+ tools</li>
                <li>No daily limits ever</li>
                <li>Priority support</li>
                <li>Cancel anytime</li>
              </ul>
            </div>
            <div className="tu-pricing-pro-right">
              <span className="tu-pricing-pro-price">
                {PRO_PRICES[currency] || '$5'}<small>/mo</small>
              </span>
              {subscription?.isPro ? (
                <span className="tu-pricing-pro-current">Your Current Plan</span>
              ) : (
                <button className="tu-pricing-pro-btn" onClick={() => { if (!accessToken) { navigate('/login'); return } subscription.handleUpgrade() }} disabled={subscription?.upgradeLoading}>
                  {subscription?.upgradeLoading ? 'Redirecting...' : 'Upgrade to Pro'}
                </button>
              )}
              <span className="tu-pricing-pro-guarantee">30-day money-back guarantee</span>
            </div>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="tu-pricing-divider"><span>Or pick a pass</span></div>

        {/* ── Category Tabs ── */}
        <div className="tu-pricing-tabs">
          {PASS_GROUPS.map(g => (
            <button
              key={g.key}
              className={`tu-pricing-tab${activeGroup === g.key ? ' tu-pricing-tab--active' : ''}`}
              onClick={() => setActiveGroup(g.key)}
            >
              <span className="tu-pricing-tab-icon">{g.icon}</span>
              <span className="tu-pricing-tab-label">{g.label}</span>
            </button>
          ))}
        </div>

        {/* Group description */}
        <p className="tu-pricing-group-desc">{PASS_GROUPS.find(g => g.key === activeGroup)?.desc}</p>

        {/* ── Pass Grid ── */}
        {catalogError ? (
          <div className="tu-pricing-loading">
            <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Failed to load passes.</p>
            <button className="tu-pricing-card-btn" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : isLoading ? (
          <div className="tu-pricing-loading">
            <div className="tu-pricing-spinner" />
            Loading passes...
          </div>
        ) : (
          <motion.div
            className="tu-pricing-grid"
            key={activeGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeGroupPasses.map((p, i) => {
              const tag = getValueTag(p)
              const perDay = getPerDayPrice(p, formatPrice)
              return (
                <motion.div
                  key={p.id}
                  className={`tu-pricing-card${tag ? ' tu-pricing-card--featured' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedPass(p.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPass(p.id) } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${p.name} details`}
                >
                  {tag && <span className="tu-pricing-card-tag">{tag}</span>}
                  <div className="tu-pricing-card-top">
                    <span className="tu-pricing-card-icon">{PASS_ICONS[p.id] || <DropletIcon size={28} />}</span>
                    <span className="tu-pricing-card-price">{formatPrice(p.price)}</span>
                  </div>
                  <span className="tu-pricing-card-name">{p.name}</span>
                  <span className="tu-pricing-card-subtitle">{p.subtitle}</span>
                  <div className="tu-pricing-card-chips">
                    <span className="tu-pricing-chip">{p.uses_per_day} uses/day</span>
                    <span className="tu-pricing-chip">{p.tools === -1 ? 'All tools' : `${p.tools} tool${p.tools > 1 ? 's' : ''}`}</span>
                    <span className="tu-pricing-chip">{p.duration_days}d</span>
                  </div>
                  {perDay && <span className="tu-pricing-card-perday">{perDay}/day</span>}
                  <button className="tu-pricing-card-btn" disabled={buyingId === p.id} onClick={(e) => { e.stopPropagation(); handleBuyPass(p.id) }}>
                    {buyingId === p.id ? 'Loading...' : 'Buy Now'}
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* ── Credit Packs ── */}
        <div className="tu-pricing-section">
          <div className="tu-pricing-section-header">
            <h3 className="tu-pricing-section-title">Credit Packs</h3>
            <p className="tu-pricing-section-desc">Use on any tool. No expiry. 1 credit = 1 use beyond the daily free limit.</p>
          </div>
          <div className="tu-pricing-credit-grid">
            {creditPacks.map((c, i) => (
              <motion.div
                key={c.id}
                className="tu-pricing-credit-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setSelectedCredit(c.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCredit(c.id) } }}
                role="button"
                tabIndex={0}
                aria-label={`View ${c.name} details`}
                style={{ cursor: 'pointer' }}
              >
                <span className="tu-pricing-credit-icon">{CREDIT_ICONS[c.id] || <DropletIcon size={32} />}</span>
                <span className="tu-pricing-credit-name">{c.name}</span>
                <span className="tu-pricing-credit-amount">{c.credits} credits</span>
                <span className="tu-pricing-credit-price">{formatPrice(c.price)}</span>
                <span className="tu-pricing-credit-per">{formatPrice(c.price / c.credits)}/use</span>
                <button className="tu-pricing-card-btn" disabled={buyingId === c.id} onClick={(e) => { e.stopPropagation(); handleBuyCredits(c.id) }}>{buyingId === c.id ? '...' : 'Buy'}</button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Free Tier ── */}
        <div className="tu-pricing-free">
          <div className="tu-pricing-free-icon"><GiftIcon size={32} /></div>
          <h3>Free Forever</h3>
          <p>Every tool gets <strong>3 free uses per day</strong> — no sign-up needed.<br />Log in for a <strong>+1 daily bonus</strong>. Earn free passes through streaks, quests, and the weekly spin!</p>
        </div>
      </div>

      {/* ── Pass Detail Drawer ── */}
      <AnimatePresence>
        {detailPass && (
          <motion.div
            className="tu-pass-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPass(null)}
          >
            <motion.div
              className="tu-pass-detail"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="tu-pass-detail-close" onClick={() => setSelectedPass(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              {/* ── Left Column: Hero + Stats + CTA ── */}
              <div className="tu-pass-detail-left">
                <div className="tu-pass-detail-hero">
                  <span className="tu-pass-detail-icon">{PASS_ICONS_LG[detailPass.id] || <DropletIcon size={52} />}</span>
                  <h2 className="tu-pass-detail-name">{detailPass.name}</h2>
                  <span className="tu-pass-detail-price">{formatPrice(detailPass.price)}</span>
                  <p className="tu-pass-detail-subtitle">{detailPass.subtitle}</p>
                </div>

                <div className="tu-pass-detail-stats">
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">{detailPass.uses_per_day}</span>
                    <span className="tu-pass-detail-stat-label">Uses/day</span>
                  </div>
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">{detailPass.tools === -1 ? 'All' : detailPass.tools}</span>
                    <span className="tu-pass-detail-stat-label">{detailPass.tools === -1 ? 'Tools' : `Tool${detailPass.tools > 1 ? 's' : ''}`}</span>
                  </div>
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">{detailPass.duration_days}d</span>
                    <span className="tu-pass-detail-stat-label">Duration</span>
                  </div>
                  {detailPass.duration_days > 1 && (
                    <div className="tu-pass-detail-stat">
                      <span className="tu-pass-detail-stat-val">{formatPrice(detailPass.price / detailPass.duration_days)}</span>
                      <span className="tu-pass-detail-stat-label">Per day</span>
                    </div>
                  )}
                </div>

                <button className="tu-pass-detail-cta" disabled={buyingId === detailPass.id} onClick={() => handleBuyPass(detailPass.id)}>
                  {buyingId === detailPass.id ? 'Loading...' : `Buy Now — ${formatPrice(detailPass.price)}`}
                </button>
                <p className="tu-pass-detail-footer">Secure payment via Razorpay</p>
              </div>

              {/* ── Right Column: Details ── */}
              <div className="tu-pass-detail-right">
                <div className="tu-pass-detail-section">
                  <h4>What's included</h4>
                  <ul className="tu-pass-detail-list">
                    <li>{detailPass.uses_per_day} uses per day on {detailPass.tools === -1 ? 'every tool (70+)' : `${detailPass.tools} tool${detailPass.tools > 1 ? 's' : ''} you pick`}</li>
                    <li>Works on AI tools, text transforms, exports — everything</li>
                    <li>Active for {detailPass.duration_days} day{detailPass.duration_days > 1 ? 's' : ''} from purchase</li>
                    <li>Uses reset daily at midnight</li>
                    {detailPass.tools > 0 && detailPass.tools <= 5 && (
                      <li>You choose which tool{detailPass.tools > 1 ? 's' : ''} to unlock after purchase</li>
                    )}
                  </ul>
                </div>

                <div className="tu-pass-detail-section">
                  <h4>How it works</h4>
                  <div className="tu-pass-detail-steps">
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">1</span>
                      <span>Purchase via secure Razorpay checkout</span>
                    </div>
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">2</span>
                      <span>{detailPass.tools > 0 && detailPass.tools <= 15 ? 'Select your tools from the panel' : 'All tools unlocked instantly'}</span>
                    </div>
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">3</span>
                      <span>Use up to {detailPass.uses_per_day}x/day for {detailPass.duration_days} day{detailPass.duration_days > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="tu-pass-detail-section">
                  <h4>Compared to free</h4>
                  <div className="tu-pass-detail-compare">
                    <div className="tu-pass-detail-compare-row">
                      <span>Free</span>
                      <span>3 uses/day per tool</span>
                    </div>
                    <div className="tu-pass-detail-compare-row tu-pass-detail-compare-row--highlight">
                      <span>{detailPass.name}</span>
                      <span>{detailPass.uses_per_day} uses/day{detailPass.tools === -1 ? ', all tools' : ''}</span>
                    </div>
                    <div className="tu-pass-detail-compare-row">
                      <span>Pro</span>
                      <span>Unlimited, {PRO_PRICES[currency] || '$5'}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Credit Detail Modal ── */}
      <AnimatePresence>
        {detailCredit && (
          <motion.div
            className="tu-pass-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCredit(null)}
          >
            <motion.div
              className="tu-pass-detail"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="tu-pass-detail-close" onClick={() => setSelectedCredit(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              {/* Left Column */}
              <div className="tu-pass-detail-left">
                <div className="tu-pass-detail-hero">
                  <span className="tu-pass-detail-icon">{CREDIT_ICONS[detailCredit.id] || <DropletIcon size={52} />}</span>
                  <h2 className="tu-pass-detail-name">{detailCredit.name}</h2>
                  <span className="tu-pass-detail-price">{formatPrice(detailCredit.price)}</span>
                  <p className="tu-pass-detail-subtitle">{detailCredit.credits} credits</p>
                </div>

                <div className="tu-pass-detail-stats">
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">{detailCredit.credits}</span>
                    <span className="tu-pass-detail-stat-label">Credits</span>
                  </div>
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">{formatPrice(detailCredit.price / detailCredit.credits)}</span>
                    <span className="tu-pass-detail-stat-label">Per use</span>
                  </div>
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">All</span>
                    <span className="tu-pass-detail-stat-label">Tools</span>
                  </div>
                  <div className="tu-pass-detail-stat">
                    <span className="tu-pass-detail-stat-val">No</span>
                    <span className="tu-pass-detail-stat-label">Expiry</span>
                  </div>
                </div>

                <button className="tu-pass-detail-cta" disabled={buyingId === detailCredit.id} onClick={() => handleBuyCredits(detailCredit.id)}>
                  {buyingId === detailCredit.id ? 'Loading...' : `Buy Now — ${formatPrice(detailCredit.price)}`}
                </button>
                <p className="tu-pass-detail-footer">Secure payment via Razorpay</p>
              </div>

              {/* Right Column */}
              <div className="tu-pass-detail-right">
                <div className="tu-pass-detail-section">
                  <h4>What's included</h4>
                  <ul className="tu-pass-detail-list">
                    <li>{detailCredit.credits} credits that work on any tool</li>
                    <li>1 credit = 1 extra use beyond the daily free limit</li>
                    <li>No expiry — use them whenever you need</li>
                    <li>Works on AI tools, text transforms, exports — everything</li>
                    <li>Credits are consumed in order (oldest first)</li>
                  </ul>
                </div>

                <div className="tu-pass-detail-section">
                  <h4>How it works</h4>
                  <div className="tu-pass-detail-steps">
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">1</span>
                      <span>Purchase credits via Razorpay</span>
                    </div>
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">2</span>
                      <span>Credits are added to your balance instantly</span>
                    </div>
                    <div className="tu-pass-detail-step">
                      <span className="tu-pass-detail-step-num">3</span>
                      <span>When you hit the daily free limit on any tool, 1 credit is used automatically</span>
                    </div>
                  </div>
                </div>

                <div className="tu-pass-detail-section">
                  <h4>Compared to passes</h4>
                  <div className="tu-pass-detail-compare">
                    <div className="tu-pass-detail-compare-row">
                      <span>Passes</span>
                      <span>Fixed tools, fixed duration, more uses/day</span>
                    </div>
                    <div className="tu-pass-detail-compare-row tu-pass-detail-compare-row--highlight">
                      <span>Credits</span>
                      <span>Any tool, no expiry, pay per use</span>
                    </div>
                    <div className="tu-pass-detail-compare-row">
                      <span>Pro</span>
                      <span>Unlimited, all tools, {PRO_PRICES[currency] || '$5'}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
