import { motion } from 'framer-motion'
import { PERSONAS } from '../../constants/tools'

const PERSONA_META = {
    writer:    { gradient: 'linear-gradient(135deg, #C586C0 0%, #569CD6 100%)', accent: '#C586C0', tools: ['Grammar', 'Paraphrase', 'Tone'], tagline: 'Craft words that resonate' },
    student:   { gradient: 'linear-gradient(135deg, #4EC9B0 0%, #007ACC 100%)', accent: '#4EC9B0', tools: ['Summarize', 'ELI5', 'Translate'], tagline: 'Learn smarter, not harder' },
    developer: { gradient: 'linear-gradient(135deg, #569CD6 0%, #DCDCAA 100%)', accent: '#569CD6', tools: ['JSON', 'Regex', 'Encoding'], tagline: 'Parse, encode, transform' },
    social:    { gradient: 'linear-gradient(135deg, #CE9178 0%, #F44747 100%)', accent: '#CE9178', tools: ['Hashtags', 'SEO', 'Tweet'], tagline: 'Content that gets clicks' },
    explorer:  { gradient: 'linear-gradient(135deg, #007ACC 0%, #4EC9B0 100%)', accent: '#007ACC', tools: ['Everything!'], tagline: 'Discover all 70+ tools' },
}

const PERSONA_LIST = Object.entries(PERSONAS).map(([id, data]) => ({ id, ...data, ...PERSONA_META[id] }))

const TypingText = ({ text }) => (
    <motion.span>
        {text.split('').map((char, i) => (
            <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
            >
                {char}
            </motion.span>
        ))}
        <motion.span
            className="tu-onboard-cursor"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
        >|</motion.span>
    </motion.span>
)

export default function OnboardingModal({ onComplete }) {
    return (
        <motion.div
            className="tu-onboard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Floating particles */}
            <div className="tu-onboard-particles">
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="tu-onboard-particle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            y: [-20, -80],
                            x: [0, (i % 2 ? 1 : -1) * 30],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3 + i * 0.5,
                            delay: i * 0.7,
                            ease: 'easeOut',
                        }}
                        style={{ left: `${15 + i * 14}%`, bottom: '20%' }}
                    />
                ))}
            </div>

            <motion.div
                className="tu-onboard"
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
            >
                {/* Header */}
                <div className="tu-onboard-header">
                    <motion.div
                        className="tu-onboard-logo"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    >
                        <span className="tu-onboard-logo-icon">F</span>
                    </motion.div>
                    <h1 className="tu-onboard-title">
                        <TypingText text="Welcome to FixMyText" />
                    </h1>
                    <motion.p
                        className="tu-onboard-sub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Pick your path. We'll tailor the experience for you.
                    </motion.p>
                </div>

                {/* Persona cards */}
                <div className="tu-onboard-personas">
                    {PERSONA_LIST.map((p, i) => (
                        <motion.button
                            key={p.id}
                            className="tu-onboard-persona"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onComplete(p.id)}
                        >
                            <span className="tu-onboard-persona-icon">{p.icon}</span>
                            <div className="tu-onboard-persona-text">
                                <span className="tu-onboard-persona-label">{p.label}</span>
                                <span className="tu-onboard-persona-tagline">{p.tagline}</span>
                            </div>
                            <div className="tu-onboard-persona-tools">
                                {p.tools.map((t) => (
                                    <span key={t} className="tu-onboard-tool-tag" style={{ borderColor: p.accent + '55', color: p.accent }}>{t}</span>
                                ))}
                            </div>
                            <svg className="tu-onboard-persona-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </motion.button>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    className="tu-onboard-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <span>You can change this anytime in settings</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
