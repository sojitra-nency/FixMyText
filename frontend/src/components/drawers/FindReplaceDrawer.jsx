import { useMemo } from 'react'

function getMatchCount(text, findText, caseSensitive, useRegex) {
    if (!text || !findText) return 0
    try {
        const flags = caseSensitive ? 'g' : 'gi'
        const pattern = useRegex
            ? findText
            : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(pattern, flags)
        return (text.match(re) || []).length
    } catch {
        return 0
    }
}

export default function FindReplaceDrawer({
    findText, setFindText, replaceText, setReplaceText,
    findCaseSensitive, setFindCaseSensitive,
    findUseRegex, setFindUseRegex,
    replaceCount, setReplaceCount,
    disabled, handleReplaceAll, text,
}) {
    const matchCount = useMemo(
        () => getMatchCount(text, findText, findCaseSensitive, findUseRegex),
        [text, findText, findCaseSensitive, findUseRegex]
    )

    const hasFind = findText.length > 0

    return (
        <div className="tu-fr">
            {/* Find row */}
            <div className="tu-fr-row">
                <div className="tu-fr-field">
                    <input
                        className="tu-fr-input"
                        placeholder="Find"
                        value={findText}
                        onChange={e => { setFindText(e.target.value); setReplaceCount(null) }}
                        spellCheck={false}
                        autoFocus
                    />
                    {hasFind && (
                        <span className={`tu-fr-badge${matchCount === 0 ? ' tu-fr-badge--none' : ''}`}>
                            {matchCount === 0 ? 'No results' : `${matchCount} found`}
                        </span>
                    )}
                </div>
                <div className="tu-fr-toggles">
                    <button
                        className={`tu-fr-toggle${findCaseSensitive ? ' tu-fr-toggle--active' : ''}`}
                        onClick={() => setFindCaseSensitive(v => !v)}
                        title="Match Case (Aa)"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18l5-14h1l5 14"/><path d="M5.5 12h7"/><path d="M17 8v10"/><path d="M15 8h4"/>
                        </svg>
                    </button>
                    <button
                        className={`tu-fr-toggle${findUseRegex ? ' tu-fr-toggle--active' : ''}`}
                        onClick={() => setFindUseRegex(v => !v)}
                        title="Use Regular Expression (.*)"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="18" r="3"/><path d="M14 4l-2 4 2 4"/><path d="M18 4l2 4-2 4"/><circle cx="18" cy="18" r="1" fill="currentColor" stroke="none"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Replace row */}
            <div className="tu-fr-row">
                <div className="tu-fr-field">
                    <input
                        className="tu-fr-input"
                        placeholder="Replace"
                        value={replaceText}
                        onChange={e => setReplaceText(e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className="tu-fr-actions">
                    <button
                        className="tu-fr-action"
                        disabled={disabled || !hasFind || matchCount === 0}
                        onClick={handleReplaceAll}
                        title="Replace All"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h13M3 12h9M3 18h13"/><path d="M19 6v12"/><path d="M16 15l3 3 3-3"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Status bar */}
            {replaceCount !== null && (
                <div className="tu-fr-status">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {replaceCount} replacement{replaceCount !== 1 ? 's' : ''} made
                </div>
            )}
        </div>
    )
}
