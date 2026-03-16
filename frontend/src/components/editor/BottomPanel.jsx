import { useState, useMemo, memo } from 'react'
import PipelineStrip from './PipelineStrip'

function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000)
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    return `${Math.floor(m / 60)}h ago`
}

function truncate(str, len = 80) {
    return str.length > len ? str.slice(0, len) + '…' : str
}

const TABS = [
    { id: 'pipeline', label: 'Pipeline', icon: '▶' },
    { id: 'history',  label: 'History',  icon: '⧖' },
    { id: 'wordfreq', label: 'Word Frequency', icon: '≡' },
    { id: 'stats',    label: 'Stats Dashboard', icon: '☷' },
]

export default memo(function BottomPanel({
    pipeline, history, text, gamification, style,
}) {
    const [activeTab, setActiveTab] = useState('pipeline')
    const [collapsed, setCollapsed] = useState(false)

    // Word frequency computed on demand
    const wordFreqData = useMemo(() => {
        if (activeTab !== 'wordfreq' || !text) return null
        const words = text.toLowerCase().match(/[a-z\u00C0-\u024F]+(?:'[a-z]+)?/gi)
        if (!words || words.length === 0) return { total: 0, unique: 0, entries: [] }
        const freq = {}
        for (const w of words) {
            const lower = w.toLowerCase()
            freq[lower] = (freq[lower] || 0) + 1
        }
        const entries = Object.entries(freq).sort((a, b) => b[1] - a[1])
        return { total: words.length, unique: entries.length, entries }
    }, [activeTab, text])

    // Text stats
    const stats = useMemo(() => {
        if (activeTab !== 'stats') return null
        const words = text.split(/\s+/).filter(Boolean)
        const chars = text.length
        const charsNoSpaces = text.replace(/\s/g, '').length
        const lines = text.split('\n').length
        const sentences = text.split(/[.!?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
        const avgWordLen = words.length > 0 ? (words.reduce((s, w) => s + w.length, 0) / words.length).toFixed(1) : 0
        const readingTime = Math.max(1, Math.ceil(words.length / 200))
        const speakingTime = Math.max(1, Math.ceil(words.length / 130))
        const longest = words.length > 0 ? words.reduce((a, b) => a.length >= b.length ? a : b, '') : '-'

        return {
            words: words.length, chars, charsNoSpaces, lines, sentences,
            paragraphs, avgWordLen, readingTime, speakingTime, longest,
        }
    }, [activeTab, text])

    return (
        <div className={`tu-bottom-panel${collapsed ? ' tu-bottom-panel--collapsed' : ''}`} style={collapsed ? undefined : style}>
            {/* Tab bar */}
            <div className="tu-bottom-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tu-bottom-tab${activeTab === tab.id && !collapsed ? ' tu-bottom-tab--active' : ''}`}
                        onClick={() => {
                            if (activeTab === tab.id && !collapsed) {
                                setCollapsed(true)
                            } else {
                                setActiveTab(tab.id)
                                setCollapsed(false)
                            }
                        }}
                    >
                        <span className="tu-bottom-tab-icon">{tab.icon}</span>
                        {tab.label}
                        {tab.id === 'pipeline' && pipeline.steps.length > 0 && (
                            <span className="tu-bottom-tab-badge">{pipeline.steps.length}</span>
                        )}
                        {tab.id === 'history' && history.history.length > 0 && (
                            <span className="tu-bottom-tab-badge">{history.history.length}</span>
                        )}
                    </button>
                ))}
                <span className="tu-bottom-tabs-spacer" />
                <button
                    className="tu-bottom-tab-toggle"
                    onClick={() => setCollapsed(c => !c)}
                    title={collapsed ? 'Expand panel' : 'Collapse panel'}
                >
                    {collapsed ? '▲' : '▼'}
                </button>
            </div>

            {/* Panel body */}
            {!collapsed && (
                <div className="tu-bottom-body">
                    {activeTab === 'pipeline' && (
                        <div className="tu-bottom-content">
                            {pipeline.steps.length === 0 ? (
                                <div className="tu-bottom-empty">
                                    <span className="tu-bottom-empty-icon">▶</span>
                                    <span>No pipeline steps yet. Use tools to build a processing chain.</span>
                                </div>
                            ) : (
                                <PipelineStrip steps={pipeline.steps} onClear={pipeline.clearPipeline} />
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="tu-bottom-content">
                            {history.history.length === 0 ? (
                                <div className="tu-bottom-empty">
                                    <span className="tu-bottom-empty-icon">⧖</span>
                                    <span>No operations yet. Use any tool to start recording.</span>
                                </div>
                            ) : (
                                <>
                                    <div className="tu-bottom-toolbar">
                                        <span className="tu-bottom-toolbar-info">
                                            {history.history.length} operation{history.history.length !== 1 ? 's' : ''}
                                        </span>
                                        <button
                                            className="tu-btn tu-btn--ai-dismiss"
                                            style={{ fontSize: '0.62rem', padding: '1px 6px' }}
                                            onClick={history.handleClearHistory}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="tu-bottom-scroll">
                                        <table className="tu-bottom-table">
                                            <thead>
                                                <tr>
                                                    <th>Operation</th>
                                                    <th>Input</th>
                                                    <th>Output</th>
                                                    <th>When</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...history.history].reverse().map((h, ri) => {
                                                    const i = history.history.length - 1 - ri
                                                    return (
                                                        <tr key={i}>
                                                            <td className="tu-bottom-cell-op">{h.operation}</td>
                                                            <td className="tu-bottom-cell-text" title={h.original}>{truncate(h.original)}</td>
                                                            <td className="tu-bottom-cell-text" title={h.result}>{truncate(h.result)}</td>
                                                            <td className="tu-bottom-cell-time">{timeAgo(h.timestamp)}</td>
                                                            <td className="tu-bottom-cell-actions">
                                                                <button className="tu-bottom-action" onClick={() => history.handleRestoreOriginal(i)} title="Restore input">↩</button>
                                                                <button className="tu-bottom-action" onClick={() => history.handleRestoreResult(i)} title="Restore output">↪</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'wordfreq' && (
                        <div className="tu-bottom-content">
                            {!text ? (
                                <div className="tu-bottom-empty">
                                    <span className="tu-bottom-empty-icon">≡</span>
                                    <span>Enter some text to see word frequency analysis.</span>
                                </div>
                            ) : wordFreqData && wordFreqData.entries.length === 0 ? (
                                <div className="tu-bottom-empty">
                                    <span>No words found in text.</span>
                                </div>
                            ) : wordFreqData && (
                                <>
                                    <div className="tu-bottom-toolbar">
                                        <span className="tu-bottom-toolbar-info">
                                            <b>{wordFreqData.total}</b> total &middot; <b>{wordFreqData.unique}</b> unique
                                        </span>
                                    </div>
                                    <div className="tu-bottom-scroll">
                                        <table className="tu-bottom-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Word</th>
                                                    <th>Count</th>
                                                    <th>%</th>
                                                    <th>Bar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wordFreqData.entries.slice(0, 50).map(([word, count], i) => {
                                                    const pct = ((count / wordFreqData.total) * 100)
                                                    const maxCount = wordFreqData.entries[0][1]
                                                    const barWidth = (count / maxCount) * 100
                                                    return (
                                                        <tr key={word}>
                                                            <td className="tu-bottom-cell-rank">{i + 1}</td>
                                                            <td className="tu-bottom-cell-word">{word}</td>
                                                            <td className="tu-bottom-cell-count">{count}</td>
                                                            <td className="tu-bottom-cell-pct">{pct.toFixed(1)}%</td>
                                                            <td className="tu-bottom-cell-bar">
                                                                <div className="tu-freq-bar">
                                                                    <div className="tu-freq-bar-fill" style={{ width: `${barWidth}%` }} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="tu-bottom-content">
                            {!text ? (
                                <div className="tu-bottom-empty">
                                    <span className="tu-bottom-empty-icon">☷</span>
                                    <span>Enter some text to see statistics.</span>
                                </div>
                            ) : stats && (
                                <div className="tu-stats-grid">
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.words}</span>
                                        <span className="tu-stat-label">Words</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.chars}</span>
                                        <span className="tu-stat-label">Characters</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.charsNoSpaces}</span>
                                        <span className="tu-stat-label">Chars (no spaces)</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.sentences}</span>
                                        <span className="tu-stat-label">Sentences</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.paragraphs}</span>
                                        <span className="tu-stat-label">Paragraphs</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.lines}</span>
                                        <span className="tu-stat-label">Lines</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.avgWordLen}</span>
                                        <span className="tu-stat-label">Avg Word Len</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.readingTime}m</span>
                                        <span className="tu-stat-label">Reading Time</span>
                                    </div>
                                    <div className="tu-stat-card">
                                        <span className="tu-stat-value">{stats.speakingTime}m</span>
                                        <span className="tu-stat-label">Speaking Time</span>
                                    </div>
                                    <div className="tu-stat-card tu-stat-card--wide">
                                        <span className="tu-stat-value tu-stat-value--word">{stats.longest}</span>
                                        <span className="tu-stat-label">Longest Word</span>
                                    </div>
                                    {gamification && (
                                        <>
                                            <div className="tu-stat-card tu-stat-card--accent">
                                                <span className="tu-stat-value">{gamification.xp || 0}</span>
                                                <span className="tu-stat-label">Total XP</span>
                                            </div>
                                            <div className="tu-stat-card tu-stat-card--accent">
                                                <span className="tu-stat-value">{gamification.discoveredTools?.length || 0}</span>
                                                <span className="tu-stat-label">Tools Used</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
})
