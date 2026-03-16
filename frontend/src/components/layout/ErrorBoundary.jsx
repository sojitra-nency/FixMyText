import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary:', error, errorInfo)
        this.setState({ errorInfo })
    }

    handleReload = () => {
        window.location.reload()
    }

    handleReset = () => {
        this.setState({ error: null, errorInfo: null })
    }

    render() {
        if (this.state.error) {
            return (
                <div style={styles.page}>
                    <div style={styles.card}>
                        <div style={styles.iconRow}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F44747" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 style={styles.title}>Something went wrong</h2>
                        <p style={styles.subtitle}>
                            An unexpected error occurred. You can try going back or reloading the page.
                        </p>
                        <div style={styles.actions}>
                            <button style={styles.btnPrimary} onClick={this.handleReload}>
                                Reload Page
                            </button>
                            <button style={styles.btnSecondary} onClick={this.handleReset}>
                                Try Again
                            </button>
                        </div>
                        <details style={styles.details}>
                            <summary style={styles.summary}>Error details</summary>
                            <pre style={styles.stack}>
                                {this.state.error?.message}
                                {'\n\n'}
                                {this.state.error?.stack}
                            </pre>
                        </details>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

const styles = {
    page: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1E1E1E',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: 24,
    },
    card: {
        maxWidth: 480,
        width: '100%',
        background: '#252526',
        border: '1px solid #3C3C3C',
        borderRadius: 8,
        padding: '40px 32px',
        textAlign: 'center',
    },
    iconRow: {
        marginBottom: 16,
    },
    title: {
        margin: '0 0 8px',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#D4D4D4',
    },
    subtitle: {
        margin: '0 0 24px',
        fontSize: '0.88rem',
        color: '#858585',
        lineHeight: 1.5,
    },
    actions: {
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20,
    },
    btnPrimary: {
        padding: '8px 20px',
        borderRadius: 4,
        border: 'none',
        background: '#0E639C',
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
    },
    btnSecondary: {
        padding: '8px 20px',
        borderRadius: 4,
        border: '1px solid #3C3C3C',
        background: 'transparent',
        color: '#ABABAB',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
    },
    details: {
        textAlign: 'left',
    },
    summary: {
        fontSize: '0.78rem',
        color: '#858585',
        cursor: 'pointer',
        marginBottom: 8,
    },
    stack: {
        fontSize: '0.72rem',
        color: '#858585',
        background: '#1E1E1E',
        border: '1px solid #3C3C3C',
        borderRadius: 4,
        padding: 12,
        overflow: 'auto',
        maxHeight: 200,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
    },
}
