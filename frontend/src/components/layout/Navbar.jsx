import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(props) {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.origin)
            .then(() => props.showAlert?.('Website link copied to clipboard!', 'success'))
            .catch(() => props.showAlert?.('Failed to copy link', 'danger'))
    }

    return (
        <nav className="tu-navbar">
            {/* Brand */}
            <Link className="tu-titlebar-brand" to="/">
                <span className="tu-titlebar-brand-accent">Fix</span>MyText
                <span className="tu-titlebar-brand-cursor" />
            </Link>

            {/* Right section */}
            <div className="tu-titlebar-right">
                {/* Search trigger — opens command palette */}
                <button
                    className="tu-titlebar-search d-none d-md-flex"
                    onClick={() => {
                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true }))
                    }}
                >
                    <span className="tu-titlebar-search-text">Search tools...</span>
                    <kbd className="tu-titlebar-search-kbd">Ctrl+F</kbd>
                </button>

                {/* Share website link */}
                <button
                    className="tu-titlebar-share"
                    onClick={handleShare}
                    aria-label="Share website link"
                    title="Share website link"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span className="tu-titlebar-share-label">Share</span>
                </button>

                {/* GitHub */}
                <a
                    className="tu-titlebar-share"
                    href="https://github.com/sojitra-nency/FixMyText"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contribute on GitHub"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span className="tu-titlebar-share-label">GitHub</span>
                </a>

                {/* Mobile hamburger */}
                <button
                    className="tu-theme-btn d-md-none"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="tu-mobile-menu">
                    <Link className="tu-mobile-link" to="/" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link className="tu-mobile-link" to="/about" onClick={() => setMenuOpen(false)}>
                        About
                    </Link>
                </div>
            )}
        </nav>
    )
}
