import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPassCatalogQuery } from '../../store/api/passesApi'
import formatPriceUtil from '../../utils/formatPrice'

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)
const CrownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/>
  </svg>
)
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>
  </svg>
)

export default function PassPurchaseModal({
  show, onDismiss, blockedTool, subscription,
}) {
  const navigate = useNavigate()
  const { data: catalog } = useGetPassCatalogQuery(undefined, { skip: !show })
  const [buyingId, setBuyingId] = useState(null)

  if (!show || !blockedTool) return null

  const handleBuy = async (fn, ...args) => {
    const id = args[0]
    setBuyingId(id)
    try { await fn(...args) } finally { setBuyingId(null) }
  }

  const usage = subscription?.getToolUsage?.(blockedTool.id) || { uses: 3, max: 3 }
  const passes = catalog?.passes || []
  const creditPacks = catalog?.credit_packs || []
  const symbol = catalog?.passes?.[0]?.symbol || '$'
  const currency = catalog?.passes?.[0]?.currency || 'usd'

  const singlePass = passes.find(p => p.id === 'day_single')
  const triplePass = passes.find(p => p.id === 'day_triple')
  const cheapestCredit = creditPacks[0]

  const formatPrice = (price) => formatPriceUtil(price, currency, symbol)
  const usagePercent = Math.min((usage.uses / usage.max) * 100, 100)

  return (
    <AnimatePresence>
      <motion.div
        className="tu-upgrade-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div
          className="tu-upgrade-modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="tu-upgrade-close" onClick={onDismiss} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Header icon */}
          <div className="tu-upgrade-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>

          <h2 className="tu-upgrade-title">Daily Limit Reached</h2>

          {/* Usage bar */}
          <div className="tu-upgrade-usage">
            <div className="tu-upgrade-usage-label">
              <span><strong>{blockedTool.label}</strong> usage today</span>
              <span className="tu-upgrade-usage-count">{usage.uses}/{usage.max}</span>
            </div>
            <div className="tu-upgrade-usage-track">
              <motion.div
                className="tu-upgrade-usage-fill"
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          <p className="tu-upgrade-desc">
            Get a pass to unlock more uses, or go Pro for unlimited access.
          </p>

          {/* Pass options */}
          <div className="tu-pass-options">
            {singlePass && (
              <motion.div
                className={`tu-pass-option${buyingId === 'day_single' ? ' tu-pass-option--loading' : ''}`}
                onClick={() => !buyingId && handleBuy(subscription.handleBuyPass, 'day_single', [blockedTool.id])}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="tu-pass-option-icon tu-pass-option-icon--single">
                  <ClockIcon />
                </div>
                <div className="tu-pass-option-body">
                  <span className="tu-pass-option-name">{singlePass.name}</span>
                  <span className="tu-pass-option-desc">{singlePass.uses_per_day} uses of {blockedTool.label} for 24h</span>
                </div>
                <span className="tu-pass-option-price">
                  {buyingId === 'day_single' ? (
                    <span className="tu-pass-spinner" />
                  ) : formatPrice(singlePass.price)}
                </span>
              </motion.div>
            )}

            {triplePass && (
              <motion.div
                className="tu-pass-option"
                onClick={() => { onDismiss(); navigate('/dashboard?tab=subscription') }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="tu-pass-option-icon tu-pass-option-icon--triple">
                  <LayersIcon />
                </div>
                <div className="tu-pass-option-body">
                  <span className="tu-pass-option-name">{triplePass.name}</span>
                  <span className="tu-pass-option-desc">Pick any 3 tools, 24 hours</span>
                </div>
                <span className="tu-pass-option-price">{formatPrice(triplePass.price)}</span>
              </motion.div>
            )}

            {cheapestCredit && (
              <motion.div
                className={`tu-pass-option${buyingId === cheapestCredit.id ? ' tu-pass-option--loading' : ''}`}
                onClick={() => !buyingId && handleBuy(subscription.handleBuyCredits, cheapestCredit.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
              >
                <div className="tu-pass-option-icon tu-pass-option-icon--credit">
                  <ZapIcon />
                </div>
                <div className="tu-pass-option-body">
                  <span className="tu-pass-option-name">{cheapestCredit.name}</span>
                  <span className="tu-pass-option-desc">{cheapestCredit.credits} credits, use on any tool, no expiry</span>
                </div>
                <span className="tu-pass-option-price">
                  {buyingId === cheapestCredit.id ? (
                    <span className="tu-pass-spinner" />
                  ) : formatPrice(cheapestCredit.price)}
                </span>
              </motion.div>
            )}
          </div>

          {/* Pro upsell */}
          <motion.div
            className="tu-pass-pro-upsell"
            onClick={subscription.handleUpgrade}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="tu-pass-pro-left">
              <CrownIcon />
              <span>Or go <strong>Pro</strong> — unlimited everything</span>
            </div>
            <span className="tu-pass-pro-price">{currency === 'inr' ? '₹399/mo' : '$5/mo'}</span>
          </motion.div>

          {/* Hints */}
          <div className="tu-pass-hints">
            <p><SparkleIcon /> Complete today's quest for a chance to earn a free pass!</p>
            <button className="tu-upgrade-footer-link" onClick={() => { onDismiss(); navigate('/dashboard?tab=subscription') }}>
              Browse all passes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
