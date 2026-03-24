import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONFETTI = ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🏆', '🔥']

function ConfettiParticle({ index }) {
  const emoji = CONFETTI[index % CONFETTI.length]
  const left = 10 + Math.random() * 80
  const delay = Math.random() * 0.6
  const duration = 1.5 + Math.random() * 1.5
  const size = 0.7 + Math.random() * 0.8

  return (
    <motion.span
      className="tu-achieve-confetti"
      style={{ left: `${left}%`, fontSize: `${size}rem` }}
      initial={{ opacity: 0, y: -20, rotate: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, 60, 140, 200], rotate: [0, 180, 360] }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.span>
  )
}

export default function AchievementToast({ achievement, onDismiss }) {
  const dismiss = useCallback(() => {
    if (onDismiss) onDismiss()
  }, [onDismiss])

  // Auto-close after 5 seconds
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(dismiss, 5000)
    return () => clearTimeout(timer)
  }, [achievement, dismiss])

  // Close on Escape
  useEffect(() => {
    if (!achievement) return
    const handleKey = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [achievement, dismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="tu-achieve-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={dismiss}
        >
          <motion.div
            className="tu-achieve-modal"
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Confetti burst */}
            <div className="tu-achieve-confetti-wrap">
              {Array.from({ length: 12 }, (_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </div>

            {/* Glow ring behind icon */}
            <motion.div
              className="tu-achieve-glow"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, delay: 0.15 }}
            />

            {/* Icon */}
            <motion.div
              className="tu-achieve-icon"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            >
              {achievement.icon}
            </motion.div>

            {/* Badge */}
            <motion.span
              className="tu-achieve-badge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Achievement Unlocked!
            </motion.span>

            {/* Name */}
            <motion.h3
              className="tu-achieve-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {achievement.label}
            </motion.h3>

            {/* Description */}
            {achievement.desc && (
              <motion.p
                className="tu-achieve-desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {achievement.desc}
              </motion.p>
            )}

            {/* Progress bar animation */}
            <motion.div
              className="tu-achieve-progress"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
            />

            {/* Dismiss hint */}
            <motion.span
              className="tu-achieve-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Click anywhere or press Esc to close
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
