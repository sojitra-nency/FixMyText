import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetHistoryQuery, useDeleteHistoryEntryMutation, useClearHistoryMutation } from '../../store/api/historyApi'

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
    setText, showAlert,
}) {
    const { accessToken } = useSelector((s) => s.auth)
    const [view, setView] = useState('session')
    const [page, setPage] = useState(1)
    const { data: serverHistory, isFetching } = useGetHistoryQuery(
        { page, pageSize: 25 },
        { skip: !accessToken || view !== 'saved' }
    )
    const [deleteEntry] = useDeleteHistoryEntryMutation()
    const [clearServer] = useClearHistoryMutation()

    return (
        <div className="tu-find-inputs">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)' }}>
                    Operation History
                </span>
                <span style={{ flex: 1 }} />
                {accessToken && (
                    <>
                        <button
                            className={`tu-btn tu-btn--tools${view === 'session' ? ' tu-btn--active' : ''}`}
                            style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                            onClick={() => setView('session')}
                        >Session</button>
                        <button
                            className={`tu-btn tu-btn--tools${view === 'saved' ? ' tu-btn--active' : ''}`}
                            style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                            onClick={() => { setView('saved'); setPage(1) }}
                        >All History</button>
                    </>
                )}
            </div>

            {/* Session view */}
            {view === 'session' && (
                <>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--fg2)' }}>
                            {history.length} operation{history.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ flex: 1 }} />
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
                </>
            )}

            {/* Saved (server-side) view */}
            {view === 'saved' && accessToken && (
                <>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--fg2)' }}>
                            {serverHistory?.total || 0} total operation{(serverHistory?.total || 0) !== 1 ? 's' : ''}
                        </span>
                        <span style={{ flex: 1 }} />
                        <button className="tu-btn tu-btn--tools"
                            style={{ fontSize: '0.68rem', color: 'var(--rose)' }}
                            onClick={() => clearServer().unwrap().catch(() => {})}
                            disabled={!serverHistory || serverHistory.total === 0}>Clear All</button>
                    </div>
                    {isFetching ? (
                        <div style={{ fontSize: '0.78rem', color: 'var(--fg2)', padding: '0.5rem 0' }}>Loading...</div>
                    ) : !serverHistory || serverHistory.items.length === 0 ? (
                        <div style={{ fontSize: '0.78rem', color: 'var(--fg2)', padding: '0.5rem 0' }}>
                            No saved history. Operations are saved when you're logged in.
                        </div>
                    ) : (
                        <div className="tu-diff-output" style={{ maxHeight: 300, marginTop: '0.5rem' }}>
                            {serverHistory.items.map((h) => (
                                <div key={h.id} style={{ borderBottom: '1px solid var(--border)', padding: '0.5rem 0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--violet)' }}>
                                            {h.tool_label}
                                        </span>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--fg2)', background: 'var(--bg2)', padding: '0 4px', borderRadius: 3 }}>
                                            {h.tool_type}
                                        </span>
                                        <span style={{ flex: 1 }} />
                                        <span style={{ fontSize: '0.65rem', color: 'var(--fg2)' }}>
                                            {new Date(h.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                                            {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--fg2)', marginBottom: '0.2rem' }}>
                                        <b>In:</b> {truncate(h.input_preview)} <span style={{ fontSize: '0.6rem', color: 'var(--fg2)' }}>({h.input_length} chars)</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--fg2)', marginBottom: '0.35rem' }}>
                                        <b>Out:</b> {truncate(h.output_preview)} <span style={{ fontSize: '0.6rem', color: 'var(--fg2)' }}>({h.output_length} chars)</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="tu-btn tu-btn--tools"
                                            style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                                            onClick={() => {
                                                if (setText) setText(h.input_preview)
                                                if (showAlert) showAlert(`Restored input from "${h.tool_label}"`, 'success')
                                            }}>Restore Input</button>
                                        <button className="tu-btn tu-btn--tools"
                                            style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem' }}
                                            onClick={() => {
                                                if (setText) setText(h.output_preview)
                                                if (showAlert) showAlert(`Restored output from "${h.tool_label}"`, 'success')
                                            }}>Restore Output</button>
                                        <span style={{ flex: 1 }} />
                                        <button className="tu-btn tu-btn--tools"
                                            style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', color: 'var(--rose)' }}
                                            onClick={() => deleteEntry(h.id).unwrap().catch(() => {})}>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {/* Pagination */}
                            {serverHistory.total > 25 && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                                    <button className="tu-btn tu-btn--tools"
                                        style={{ fontSize: '0.65rem' }}
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--fg2)' }}>
                                        Page {page} of {Math.ceil(serverHistory.total / 25)}
                                    </span>
                                    <button className="tu-btn tu-btn--tools"
                                        style={{ fontSize: '0.65rem' }}
                                        disabled={!serverHistory.has_more}
                                        onClick={() => setPage(p => p + 1)}>Next</button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
