import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default memo(function SmartSuggestions({ suggestions, onToolClick, onDismiss }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="tu-suggestions">
      <span className="tu-suggestion-label">💡 Try:</span>
      <AnimatePresence>
        {suggestions.map((tool, i) => (
          <motion.button
            key={tool.id}
            className="tu-suggestion-pill"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
            whileHover={{ y: -2, scale: 1.05 }}
            onClick={() => onToolClick(tool)}
          >
            <span>{tool.icon}</span>
            <span>{tool.label}</span>
            <span
              className="tu-suggestion-dismiss"
              onClick={e => { e.stopPropagation(); onDismiss(tool.id) }}
            >
              ✕
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
})
