
function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000)
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    return `${Math.floor(m / 60)}h ago`
}

function truncate(str, len = 60) {
    return str.length > len ? str.slice(0, len) + '…' : str
}

export default function HistoryDrawer({
    history, handleRestoreOriginal, handleRestoreResult, handleClearHistory,
}) {
    return (
        <div className="tu-find-inputs">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)' }}>
                    Operation History
                </span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--fg2)' }}>
                    {history.length} operation{history.length !== 1 ? 's' : ''}
                </span>
                <button className="tu-btn tu-btn--tools"
                    style={{ fontSize: '0.68rem', color: 'var(--rose)' }}
                    onClick={handleClearHistory} disabled={history.length === 0}>Clear</button>
            </div>
            {history.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--fg2)', padding: '0.5rem 0' }}>
                    No operations yet. Use any text tool to start recording.
                </div>
            ) : (
                <div className="tu-diff-output" style={{ maxHeight: 300, marginTop: '0.5rem' }}>
                    {[...history].reverse().map((h, ri) => {
                        const i = history.length - 1 - ri
                        return (
                            <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '0.5rem 0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--violet)' }}>
                                        {h.operation}
                                    </span>
                                    <span style={{ flex: 1 }} />
                                    <span style={{ fontSize: '0.65rem', color: 'var(--fg2)' }}>
                                        {timeAgo(h.timestamp)}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--fg2)', marginBottom: '0.2rem' }}>
                                    <b>In:</b> {truncate(h.original)}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--fg2)', marginBottom: '0.35rem' }}>
                                    <b>Out:</b> {truncate(h.result)}
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button className="tu-btn tu-btn--tools"
                                        style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                                        onClick={() => handleRestoreOriginal(i)}>Restore Input</button>
                                    <button className="tu-btn tu-btn--tools"
                                        style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                                        onClick={() => handleRestoreResult(i)}>Restore Output</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
