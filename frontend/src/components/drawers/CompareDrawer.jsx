
import { useState, useRef } from 'react'

/**
 * CompareInput — Renders in the LEFT panel (below the main input textarea).
 * A second editor for the "compare with" text.
 */
export function CompareInput({ compareText, setCompareText, setDiffResult }) {
    const gutterRef = useRef(null)
    const lines = (compareText || '\n').split('\n')
    const words = compareText ? compareText.split(/\s+/).filter(Boolean).length : 0
    const chars = compareText ? compareText.length : 0

    return (
        <div className="tu-compare-input">
            <div className="tu-editor-topbar">
                <span className="tu-editor-label" title="~/FixMyText/workspace/compare-with.txt">COMPARE WITH</span>
                <div className="tu-topbar-stats">
                    <span className="tu-topbar-stat"><b>{words}</b> words</span>
                    <span className="tu-topbar-stat"><b>{chars}</b> chars</span>
                </div>
            </div>
            <div className="tu-input-toolbar">
                <button
                    className="tu-input-toolbar-btn"
                    onClick={() => navigator.clipboard.readText().then(t => { setCompareText(t); setDiffResult(null) })}
                    title="Paste from clipboard"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                    <span>Paste</span>
                </button>
                <button
                    className="tu-input-toolbar-btn tu-input-toolbar-btn--danger"
                    onClick={() => { setCompareText(''); setDiffResult(null) }}
                    title="Clear"
                    disabled={!compareText}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    <span>Clear</span>
                </button>
            </div>
            <div className="tu-editor-body">
                <div className="tu-line-numbers" ref={gutterRef}>
                    {lines.map((_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>
                <textarea
                    className="tu-textarea"
                    value={compareText}
                    onChange={e => { setCompareText(e.target.value); setDiffResult(null) }}
                    onScroll={e => {
                        if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop
                    }}
                    placeholder="// Paste or type the text to compare with..."
                    spellCheck={false}
                />
            </div>
        </div>
    )
}

/**
 * CompareOutput — Renders in the RIGHT panel (output area).
 * Shows the diff results.
 */
export default function CompareOutput({ diffResult, compareText }) {
    const [viewMode, setViewMode] = useState('inline')

    const added = diffResult ? diffResult.filter(d => d.type === 'added').length : 0
    const removed = diffResult ? diffResult.filter(d => d.type === 'removed').length : 0
    const same = diffResult ? diffResult.filter(d => d.type === 'same').length : 0

    // Build inline line numbers
    const buildInlineNums = () => {
        if (!diffResult) return []
        let leftNum = 0, rightNum = 0
        return diffResult.map(d => {
            if (d.type === 'same') { leftNum++; rightNum++; return { left: leftNum, right: rightNum } }
            if (d.type === 'removed') { leftNum++; return { left: leftNum, right: null } }
            rightNum++; return { left: null, right: rightNum }
        })
    }

    // Build side-by-side lines
    const buildSideLines = () => {
        if (!diffResult) return []
        const lines = []
        let leftNum = 0, rightNum = 0
        for (const d of diffResult) {
            if (d.type === 'same') {
                leftNum++; rightNum++
                lines.push({ left: { num: leftNum, text: d.line, type: 'same' }, right: { num: rightNum, text: d.line, type: 'same' } })
            } else if (d.type === 'removed') {
                leftNum++
                lines.push({ left: { num: leftNum, text: d.line, type: 'removed' }, right: { num: null, text: '', type: 'empty' } })
            } else {
                rightNum++
                lines.push({ left: { num: null, text: '', type: 'empty' }, right: { num: rightNum, text: d.line, type: 'added' } })
            }
        }
        return lines
    }

    // No diff yet
    if (!diffResult) {
        return (
            <div className="tu-compare-output">
                <div className="tu-editor-topbar">
                    <span className="tu-editor-label" title="~/FixMyText/workspace/diff">DIFF OUTPUT</span>
                    <div className="tu-topbar-stats">
                        <span className="tu-topbar-stat"><b>0</b> changes</span>
                    </div>
                </div>
                <div className="tu-compare-empty">
                    <span className="tu-compare-empty-icon">⇄</span>
                    {!compareText
                        ? <span>Type text in both panels to compare</span>
                        : <span>Comparing automatically in a moment...</span>
                    }
                    <span className="tu-compare-empty-hint">Differences will appear here</span>
                </div>
            </div>
        )
    }

    return (
        <div className="tu-compare-output">
            {/* Topbar */}
            <div className="tu-editor-topbar">
                <span className="tu-editor-label" title="~/FixMyText/workspace/diff">DIFF OUTPUT</span>
                <div className="tu-topbar-stats">
                    <span className="tu-topbar-stat tu-topbar-stat--added"><b>+{added}</b></span>
                    <span className="tu-topbar-stat tu-topbar-stat--removed"><b>−{removed}</b></span>
                    <span className="tu-topbar-stat"><b>{same}</b> same</span>
                </div>
            </div>

            {/* View toggle toolbar */}
            <div className="tu-diff-toolbar">
                <div className="tu-diff-badges">
                    <span className="tu-diff-badge tu-diff-badge--added">+{added} added</span>
                    <span className="tu-diff-badge tu-diff-badge--removed">−{removed} removed</span>
                    <span className="tu-diff-badge tu-diff-badge--same">{same} same</span>
                </div>
                <div className="tu-diff-controls">
                    <button
                        className={`tu-diff-view-btn${viewMode === 'inline' ? ' tu-diff-view-btn--active' : ''}`}
                        onClick={() => setViewMode('inline')}
                        title="Inline view"
                    >Inline</button>
                    <button
                        className={`tu-diff-view-btn${viewMode === 'side' ? ' tu-diff-view-btn--active' : ''}`}
                        onClick={() => setViewMode('side')}
                        title="Side by side"
                    >Side by Side</button>
                </div>
            </div>

            {/* Inline diff */}
            {viewMode === 'inline' && (() => {
                const nums = buildInlineNums()
                return (
                    <div className="tu-diff-output">
                        {diffResult.map((d, idx) => (
                            <div key={idx} className={`tu-diff-line tu-diff-line--${d.type}`}>
                                <span className="tu-diff-gutter">{nums[idx].left ?? ''}</span>
                                <span className="tu-diff-gutter">{nums[idx].right ?? ''}</span>
                                <span className="tu-diff-marker">
                                    {d.type === 'added' ? '+' : d.type === 'removed' ? '−' : ' '}
                                </span>
                                <span className="tu-diff-text">{d.line || '\u00A0'}</span>
                            </div>
                        ))}
                    </div>
                )
            })()}

            {/* Side-by-side diff */}
            {viewMode === 'side' && (
                <div className="tu-diff-side">
                    <div className="tu-diff-side-header">
                        <div className="tu-diff-side-title">Original</div>
                        <div className="tu-diff-side-title">Comparison</div>
                    </div>
                    <div className="tu-diff-side-body">
                        {buildSideLines().map((row, idx) => (
                            <div key={idx} className="tu-diff-side-row">
                                <div className={`tu-diff-side-cell tu-diff-side-cell--${row.left.type}`}>
                                    <span className="tu-diff-gutter">{row.left.num ?? ''}</span>
                                    <span className="tu-diff-text">{row.left.text || '\u00A0'}</span>
                                </div>
                                <div className={`tu-diff-side-cell tu-diff-side-cell--${row.right.type}`}>
                                    <span className="tu-diff-gutter">{row.right.num ?? ''}</span>
                                    <span className="tu-diff-text">{row.right.text || '\u00A0'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
