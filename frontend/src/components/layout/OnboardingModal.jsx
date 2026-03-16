import { motion } from 'framer-motion'
import { PERSONAS } from '../../constants/tools'

const PERSONA_LIST = Object.entries(PERSONAS).map(([id, data]) => ({ id, ...data }))

export default function OnboardingModal({ onComplete }) {
  return (
    <motion.div
      className="tu-onboard-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="tu-onboard"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="tu-onboard-header">
          <h1 className="tu-onboard-title">Welcome to FixMyText!</h1>
          <p className="tu-onboard-sub">What brings you here today?</p>
        </div>

        <div className="tu-onboard-personas">
          {PERSONA_LIST.map((p, i) => (
            <motion.button
              key={p.id}
              className="tu-onboard-persona"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(p.id)}
            >
              <span className="tu-onboard-persona-icon">{p.icon}</span>
              <div className="tu-onboard-persona-text">
                <span className="tu-onboard-persona-label">{p.label}</span>
                <span className="tu-onboard-persona-hint">
                  {p.id === 'developer' ? 'JSON, Regex, Encoding tools highlighted' :
                   p.id === 'writer' ? 'Grammar, Paraphrase, Tone tools highlighted' :
                   p.id === 'student' ? 'Summarize, ELI5, Translate tools highlighted' :
                   p.id === 'social' ? 'Hashtags, SEO, Tweet tools highlighted' :
                   'See all tools equally'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
