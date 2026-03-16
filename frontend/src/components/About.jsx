import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { USE_CASE_TABS, TOOLS } from '../constants/tools'

const STATS = [
    { value: `${TOOLS.length}+`, label: 'Tools' },
    { value: '9', label: 'Categories' },
    { value: '14+', label: 'Languages' },
    { value: '100%', label: 'Free' },
]

const FEATURES = [
    {
        icon: '✍️',
        title: 'Text Transformation',
        description: 'Uppercase, lowercase, title case, camelCase, snake_case, reverse, sort, deduplicate, trim, and more.',
    },
    {
        icon: '🤖',
        title: 'AI-Powered Tools',
        description: 'Grammar fix, paraphrase, summarize, tone, translate, SEO generation, and sentiment analysis.',
    },
    {
        icon: '💻',
        title: 'Developer Toolkit',
        description: 'JSON/CSV/YAML formatting, HTML/CSS/JS/TS prettifiers, regex tester, JWT decoder, hash generators.',
    },
    {
        icon: '🔒',
        title: 'Encoding & Decoding',
        description: 'Base64, URL encoding, hex, Morse code, HTML/JSON escaping, ROT13 — encode and decode anything.',
    },
    {
        icon: '📤',
        title: 'Export Anywhere',
        description: 'Download as TXT, PDF, DOCX, or JSON. Preview and render Markdown right in the editor.',
    },
    {
        icon: '🎮',
        title: 'Gamified Experience',
        description: 'Earn XP, level up, complete daily quests, unlock achievements, and build streaks.',
    },
]

const PRINCIPLES = [
    { title: 'Privacy First', text: 'Your text stays in your browser for local tools. AI tools send data securely and never store it.' },
    { title: 'No Sign-Up Required', text: 'All transformation tools work without an account. Sign up only unlocks AI features.' },
    { title: 'Always Free', text: 'Every core tool is free with no limits, no ads, and no paywalls.' },
]

const fade = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.35 },
}

export default function About() {
    useEffect(() => {
        document.body.style.overflow = 'auto'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div className="about-page">
            {/* Back to editor */}
            <Link to="/" className="about-back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Editor
            </Link>

            {/* Hero */}
            <motion.section className="about-hero" {...fade}>
                <h1 className="about-hero-title">FixMyText</h1>
                <p className="about-hero-sub">
                    A free, all-in-one text workspace with {TOOLS.length}+ tools for writers,
                    students, developers, and content creators.
                </p>
                <div className="about-stats">
                    {STATS.map((s) => (
                        <div key={s.label} className="about-stat">
                            <span className="about-stat-value">{s.value}</span>
                            <span className="about-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Features */}
            <section className="about-section">
                <h2 className="about-section-title">Features</h2>
                <div className="about-features">
                    {FEATURES.map((f) => (
                        <motion.div key={f.title} className="about-feature" {...fade}>
                            <div className="about-feature-header">
                                <span className="about-feature-icon">{f.icon}</span>
                                <h3 className="about-feature-title">{f.title}</h3>
                            </div>
                            <p className="about-feature-desc">{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <motion.section className="about-section" {...fade}>
                <h2 className="about-section-title">Categories</h2>
                <div className="about-categories">
                    {USE_CASE_TABS.filter(t => t.id !== 'all').map((tab) => (
                        <span key={tab.id} className="about-category-chip">
                            {tab.icon} {tab.label}
                        </span>
                    ))}
                </div>
            </motion.section>

            {/* Principles */}
            <section className="about-section">
                <h2 className="about-section-title">Principles</h2>
                <div className="about-principles">
                    {PRINCIPLES.map((p) => (
                        <motion.div key={p.title} className="about-principle" {...fade}>
                            <h3 className="about-principle-title">{p.title}</h3>
                            <p className="about-principle-text">{p.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tech */}
            <motion.section className="about-section" {...fade}>
                <h2 className="about-section-title">Built with</h2>
                <div className="about-tech">
                    {['React', 'Vite', 'Redux Toolkit', 'FastAPI', 'Framer Motion', 'Prettier'].map((t) => (
                        <span key={t} className="about-tech-tag">{t}</span>
                    ))}
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section className="about-cta" {...fade}>
                <p className="about-cta-text">No install needed. Open and start typing.</p>
                <Link to="/" className="about-cta-btn">Open Editor</Link>
            </motion.section>
        </div>
    )
}
