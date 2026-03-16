import { useEffect, useState } from 'react'

const ICONS = {
    success: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    danger: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    ),
}

function Toast({ alert, onDismiss }) {
    const [exiting, setExiting] = useState(false)

    const handleDismiss = () => {
        setExiting(true)
        setTimeout(() => onDismiss(alert.id), 200)
    }

    return (
        <div
            className={`tu-toast tu-toast--${alert.type}${exiting ? ' tu-toast--exit' : ''}`}
            role="alert"
        >
            <span className="tu-toast-icon">{ICONS[alert.type] || ICONS.info}</span>
            <span className="tu-toast-msg">{alert.msg}</span>
            <button
                className="tu-toast-close"
                onClick={handleDismiss}
                aria-label="Dismiss"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}

export default function Alert({ alerts = [], dismissAlert, alert: legacyAlert }) {
    // Support both new (alerts array) and old (single alert) API
    const items = alerts.length > 0 ? alerts : legacyAlert ? [legacyAlert] : []

    if (items.length === 0) return null

    return (
        <div className="tu-toast-wrapper" aria-live="polite">
            {items.map((a) => (
                <Toast
                    key={a.id ?? a.msg}
                    alert={a}
                    onDismiss={dismissAlert || (() => {})}
                />
            ))}
        </div>
    )
}
