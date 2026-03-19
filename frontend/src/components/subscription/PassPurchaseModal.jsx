import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPassCatalogQuery } from '../../store/api/passesApi'
import formatPriceUtil from '../../utils/formatPrice'

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

  // Show relevant passes: single-tool (cheapest), a mid-tier, and all-access
  const singlePass = passes.find(p => p.id === 'day_single')
  const triplePass = passes.find(p => p.id === 'day_triple')
  const cheapestCredit = creditPacks[0]

  const formatPrice = (price) => formatPriceUtil(price, currency, symbol)

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

          <div className="tu-upgrade-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>

          <h2 className="tu-upgrade-title">Daily Limit Reached</h2>
          <p className="tu-upgrade-desc">
            You've used <strong>{blockedTool.label}</strong> {usage.uses}/{usage.max} times today.
            Get a pass for more access!
          </p>

          {/* Pass options */}
          <div className="tu-pass-options">
            {singlePass && (
              <div className={`tu-pass-option${buyingId === 'day_single' ? ' tu-pass-option--loading' : ''}`} onClick={() => !buyingId && handleBuy(subscription.handleBuyPass, 'day_single', [blockedTool.id])}>
                <div className="tu-pass-option-left">
                  <span className="tu-pass-option-name">{singlePass.name}</span>
                  <span className="tu-pass-option-desc">{singlePass.uses_per_day} uses of {blockedTool.label} for 24h</span>
                </div>
                <span className="tu-pass-option-price">{buyingId === 'day_single' ? '...' : formatPrice(singlePass.price)}</span>
              </div>
            )}

            {triplePass && (
              <div className="tu-pass-option" onClick={() => { onDismiss(); navigate('/dashboard?tab=subscription') }}>
                <div className="tu-pass-option-left">
                  <span className="tu-pass-option-name">{triplePass.name}</span>
                  <span className="tu-pass-option-desc">Pick any 3 tools, 24 hours</span>
                </div>
                <span className="tu-pass-option-price">{formatPrice(triplePass.price)}</span>
              </div>
            )}

            {cheapestCredit && (
              <div className={`tu-pass-option${buyingId === cheapestCredit.id ? ' tu-pass-option--loading' : ''}`} onClick={() => !buyingId && handleBuy(subscription.handleBuyCredits, cheapestCredit.id)}>
                <div className="tu-pass-option-left">
                  <span className="tu-pass-option-name">{cheapestCredit.name}</span>
                  <span className="tu-pass-option-desc">{cheapestCredit.credits} credits, use on any tool, no expiry</span>
                </div>
                <span className="tu-pass-option-price">{buyingId === cheapestCredit.id ? '...' : formatPrice(cheapestCredit.price)}</span>
              </div>
            )}
          </div>

          {/* Pro upsell */}
          <div className="tu-pass-pro-upsell" onClick={subscription.handleUpgrade}>
            <span>Or go <strong>Pro</strong> — unlimited everything</span>
            <span className="tu-pass-pro-price">{currency === 'inr' ? '₹399/mo' : '$5/mo'}</span>
          </div>

          {/* Hints */}
          <div className="tu-pass-hints">
            <p>Complete today's quest for a chance to earn a free pass!</p>
            <button className="tu-upgrade-footer-link" onClick={() => { onDismiss(); navigate('/dashboard?tab=subscription') }}>
              Browse all passes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
