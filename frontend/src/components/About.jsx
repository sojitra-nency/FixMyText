import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { USE_CASE_TABS, TOOLS } from '../constants/tools'

const STATS = [
    { value: `${TOOLS.length}+`, label: 'Tools Available' },
    { value: `${USE_CASE_TABS.filter(t => t.id !== 'all').length}`, label: 'Categories' },
    { value: '14+', label: 'Languages' },
    { value: '100%', label: 'Free Forever' },
]

const FEATURES = [
    {
        icon: '✍️',
        title: 'Text Transformation',
        description: 'Uppercase, lowercase, title case, camelCase, snake_case, reverse, sort, deduplicate, trim, and more.',
        color: 'var(--pink)',
    },
    {
        icon: '🤖',
        title: 'AI-Powered Tools',
        description: 'Grammar fix, paraphrase, summarize, tone, translate, SEO generation, and sentiment analysis.',
        color: 'var(--cyan)',
    },
    {
        icon: '💻',
        title: 'Developer Toolkit',
        description: 'JSON/CSV/YAML formatting, HTML/CSS/JS/TS prettifiers, regex tester, JWT decoder, hash generators.',
        color: 'var(--indigo)',
    },
    {
        icon: '🔒',
        title: 'Encoding & Decoding',
        description: 'Base64, URL encoding, hex, Morse code, HTML/JSON escaping, ROT13 — encode and decode anything.',
        color: 'var(--amber)',
    },
    {
        icon: '📤',
        title: 'Export Anywhere',
        description: 'Download as TXT, PDF, DOCX, or JSON. Preview and render Markdown right in the editor.',
        color: 'var(--emerald)',
    },
    {
        icon: '🎮',
        title: 'Gamified Experience',
        description: 'Earn XP, level up, complete daily quests, unlock achievements, and build streaks as you work.',
        color: 'var(--violet)',
    },
]

const HOW_IT_WORKS = [
    { step: '01', title: 'Paste or type', desc: 'Drop your text into the split editor — input on the left, output on the right.' },
    { step: '02', title: 'Pick a tool', desc: 'Browse categories in the sidebar or search with the command palette (Ctrl+K).' },
    { step: '03', title: 'Get results', desc: 'See instant output. Accept, copy, or export in one click.' },
]

const PRINCIPLES = [
    { icon: '🛡', title: 'Privacy First', text: 'Your text stays in your browser for local tools. AI tools send data securely and never store it.', accent: 'var(--cyan)' },
    { icon: '🔓', title: 'No Sign-Up Required', text: 'All transformation tools work without an account. Sign up only unlocks AI features.', accent: 'var(--amber)' },
    { icon: '💎', title: 'Always Free', text: 'Every core tool is free with no limits, no ads, and no paywalls.', accent: 'var(--emerald)' },
]

const AUDIENCES = [
    { icon: '📝', label: 'Writers', desc: 'Clean up drafts, rewrite, and format in seconds' },
    { icon: '🎓', label: 'Students', desc: 'Fix grammar, summarize notes, translate assignments' },
    { icon: '👨‍💻', label: 'Developers', desc: 'Format JSON, decode JWTs, test regex, prettify code' },
    { icon: '📱', label: 'Creators', desc: 'Generate hashtags, SEO titles, and social copy' },
]

const TECH = ['React', 'Vite', 'Redux Toolkit', 'FastAPI', 'Framer Motion', 'Prettier']

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const fadeRight = (delay = 0) => ({
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const scaleIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function About() {
    useEffect(() => {
        document.body.style.overflow = 'auto'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div className="about-page">
            {/* ── Fixed Nav ── */}
            <nav className="about-nav">
                <Link to="/" className="about-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Editor
                </Link>
                <div className="about-nav-links">
                    <a href="#features" className="about-nav-link">Features</a>
                    <a href="#how" className="about-nav-link">How it works</a>
                    <a href="#principles" className="about-nav-link">Principles</a>
                </div>
            </nav>

            {/* ════════ Hero ════════ */}
            <section className="about-hero">
                <div className="about-hero-glow" />
                <div className="about-container about-hero-inner">
                    <motion.div className="about-hero-left" {...fadeLeft()}>
                        <span className="about-hero-badge">Open Source Text Workspace</span>
                        <h1 className="about-hero-title">
                            Fix<span className="about-hero-accent">My</span>Text
                        </h1>
                        <p className="about-hero-sub">
                            A free, all-in-one text workspace with <strong>{TOOLS.length}+</strong> tools
                            for writers, students, developers, and content creators.
                        </p>
                        <div className="about-hero-actions">
                            <Link to="/" className="about-cta-btn about-cta-btn--primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                Open Editor
                            </Link>
                            <a href="#features" className="about-cta-btn about-cta-btn--ghost">Explore Features</a>
                        </div>
                    </motion.div>
                    <motion.div className="about-hero-right" {...fadeRight(0.15)}>
                        <div className="about-hero-visual">
                            <div className="about-mock-editor">
                                <div className="about-mock-titlebar">
                                    <span className="about-mock-dot" style={{ background: '#F44747' }} />
                                    <span className="about-mock-dot" style={{ background: '#DCDCAA' }} />
                                    <span className="about-mock-dot" style={{ background: '#6A9955' }} />
                                    <span className="about-mock-title">FixMyText</span>
                                </div>
                                <div className="about-mock-body">
                                    <div className="about-mock-sidebar">
                                        {['Fix Grammar', 'Paraphrase', 'Summarize', 'Translate', 'Format JSON'].map(t => (
                                            <span key={t} className="about-mock-tool">{t}</span>
                                        ))}
                                    </div>
                                    <div className="about-mock-content">
                                        <div className="about-mock-input">
                                            <span className="about-mock-label">INPUT</span>
                                            <span className="about-mock-text">Hello wrold, this is a tset...</span>
                                        </div>
                                        <div className="about-mock-output">
                                            <span className="about-mock-label about-mock-label--accent">OUTPUT</span>
                                            <span className="about-mock-text about-mock-text--fixed">Hello world, this is a test...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════ Stats ════════ */}
            <div className="about-container">
                <div className="about-stats-bar">
                    {STATS.map((s, i) => (
                        <motion.div key={s.label} className="about-stat" {...scaleIn(i * 0.08)}>
                            <span className="about-stat-value">{s.value}</span>
                            <span className="about-stat-label">{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ════════ Features ════════ */}
            <div className="about-container">
                <section className="about-section about-section--bordered" id="features">
                    <motion.div className="about-section-header" {...fade()}>
                        <span className="about-section-eyebrow">Features</span>
                        <h2 className="about-section-title">Everything you need in one place</h2>
                        <p className="about-section-sub">Powerful tools organized into one seamless, code-editor-style workspace</p>
                    </motion.div>
                    <div className="about-features">
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} className="about-feature" {...scaleIn(i * 0.06)}>
                                <div className="about-feature-icon-wrap" style={{ '--feature-color': f.color }}>
                                    <span className="about-feature-icon">{f.icon}</span>
                                </div>
                                <h3 className="about-feature-title">{f.title}</h3>
                                <p className="about-feature-desc">{f.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ════════ How it works ════════ */}
            <div className="about-container">
                <section className="about-section about-section--bordered" id="how">
                    <motion.div className="about-section-header" {...fade()}>
                        <span className="about-section-eyebrow">How it works</span>
                        <h2 className="about-section-title">Three steps. Zero friction.</h2>
                    </motion.div>
                    <div className="about-steps">
                        {HOW_IT_WORKS.map((s, i) => (
                            <motion.div key={s.step} className="about-step" {...fadeLeft(i * 0.12)}>
                                <span className="about-step-num">{s.step}</span>
                                <div className="about-step-body">
                                    <h3 className="about-step-title">{s.title}</h3>
                                    <p className="about-step-desc">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ════════ Who it's for + Categories ════════ */}
            <div className="about-container">
                <section className="about-split about-split--bordered">
                    <motion.div className="about-split-col" {...fadeLeft()}>
                        <span className="about-section-eyebrow">Built for everyone</span>
                        <h2 className="about-section-title">Who uses FixMyText?</h2>
                        <div className="about-audiences">
                            {AUDIENCES.map((a, i) => (
                                <motion.div key={a.label} className="about-audience" {...fade(i * 0.06)}>
                                    <span className="about-audience-icon">{a.icon}</span>
                                    <div>
                                        <h4 className="about-audience-label">{a.label}</h4>
                                        <p className="about-audience-desc">{a.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div className="about-split-col" {...fadeRight(0.1)}>
                        <span className="about-section-eyebrow">Organized</span>
                        <h2 className="about-section-title">Tool categories</h2>
                        <div className="about-categories">
                            {USE_CASE_TABS.filter(t => t.id !== 'all').map((tab, i) => {
                                const count = TOOLS.filter(t => t.tabs?.includes(tab.id)).length
                                return (
                                    <motion.div key={tab.id} className="about-category-card" {...scaleIn(i * 0.04)}>
                                        <span className="about-category-icon">{tab.icon}</span>
                                        <span className="about-category-name">{tab.label}</span>
                                        <span className="about-category-count">{count}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* ════════ Principles ════════ */}
            <div className="about-container">
                <section className="about-section about-section--bordered" id="principles">
                    <motion.div className="about-section-header" {...fade()}>
                        <span className="about-section-eyebrow">Our values</span>
                        <h2 className="about-section-title">Built on principles that matter</h2>
                    </motion.div>
                    <div className="about-principles">
                        {PRINCIPLES.map((p, i) => (
                            <motion.div key={p.title} className="about-principle" style={{ '--principle-accent': p.accent }} {...scaleIn(i * 0.1)}>
                                <span className="about-principle-icon">{p.icon}</span>
                                <h3 className="about-principle-title">{p.title}</h3>
                                <p className="about-principle-text">{p.text}</p>
                                <div className="about-principle-bar" />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ════════ Tech + CTA ════════ */}
            <div className="about-container">
                <section className="about-split about-split--bordered">
                    <motion.div className="about-split-col" {...fadeLeft()}>
                        <span className="about-section-eyebrow">Technology</span>
                        <h2 className="about-section-title">Built with modern tools</h2>
                        <p className="about-section-sub">Open-source, fast, and reliable technologies</p>
                        <div className="about-tech">
                            {TECH.map((t, i) => (
                                <motion.span key={t} className="about-tech-tag" {...scaleIn(i * 0.05)}>
                                    {t}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div className="about-split-col about-cta-panel" {...fadeRight(0.1)}>
                        <div className="about-cta-card">
                            <div className="about-cta-glow" />
                            <h2 className="about-cta-title">Ready to start?</h2>
                            <p className="about-cta-text">No install. No sign-up. Just open and type.</p>
                            <Link to="/" className="about-cta-btn about-cta-btn--primary about-cta-btn--lg">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                Open Editor
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* Footer */}
            <div className="about-container">
                <footer className="about-footer">
                    <span>FixMyText</span>
                    <span className="about-footer-sep">·</span>
                    <span>Free &amp; Open Source</span>
                </footer>
            </div>
        </div>
    )
}
