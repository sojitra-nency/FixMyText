import { motion, AnimatePresence } from 'framer-motion'

export default function AchievementToast({ achievement }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="tu-achieve-toast"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <span className="tu-achieve-toast-icon">{achievement.icon}</span>
          <div className="tu-achieve-toast-body">
            <span className="tu-achieve-toast-title">Achievement Unlocked!</span>
            <span className="tu-achieve-toast-name">{achievement.label}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
