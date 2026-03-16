
export default function RegexDrawer({
    regexPattern, setRegexPattern,
    regexFlags, setRegexFlags,
    regexResult, setRegexResult,
    disabled, handleRegexTest,
}) {
    return (
        <div className="tu-find-inputs">
            <input className="tu-find-input" placeholder="Regex pattern (e.g. \d+)…"
                value={regexPattern} onChange={e => { setRegexPattern(e.target.value); setRegexResult(null) }} />
            <div className="tu-find-footer">
                <div className="tu-find-flags">
                    {['g', 'i', 'm', 's'].map(flag => (
                        <label key={flag} className="tu-fmt-check">
                            <input type="checkbox" checked={regexFlags.includes(flag)}
                                onChange={e => {
                                    setRegexFlags(prev => e.target.checked ? prev + flag : prev.replace(flag, ''))
                                    setRegexResult(null)
                                }} />
                            {flag}
                        </label>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {regexResult && (
                        <span className="tu-find-count">{regexResult.total} match{regexResult.total !== 1 ? 'es' : ''}</span>
                    )}
                    <button className="tu-btn tu-btn--tools" disabled={disabled || !regexPattern}
                        onClick={handleRegexTest}>Test</button>
                </div>
            </div>
            {regexResult && regexResult.matches.length > 0 && (
                <div className="tu-diff-output" style={{ marginTop: '0.85rem', maxHeight: 200, overflow: 'auto' }}>
                    {regexResult.matches.map((m, i) => (
                        <div key={i} className="tu-diff-line tu-diff-line--added">
                            <span className="tu-diff-marker">{i + 1}</span>
                            <span className="tu-diff-text">
                                "{m.match}" at index {m.index}
                                {m.groups.length > 0 && ` [groups: ${m.groups.join(', ')}]`}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
