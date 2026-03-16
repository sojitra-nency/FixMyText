
export default function CompareDrawer({
    compareText, setCompareText, diffResult, setDiffResult,
    disabled, handleCompare,
}) {
    return (
        <div style={{ padding: '0.85rem 1.1rem' }}>
            <textarea className="tu-textarea" rows="5" placeholder="Paste comparison text here…"
                value={compareText} onChange={e => { setCompareText(e.target.value); setDiffResult(null) }}
                style={{ minHeight: 100, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0.6rem 0.85rem' }} />
            <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="tu-btn tu-btn--compare" disabled={disabled || !compareText}
                    onClick={handleCompare}>Compare</button>
            </div>
            {diffResult && (
                <div className="tu-diff-output" style={{ marginTop: '0.85rem' }}>
                    <div className="tu-diff-legend">
                        <span className="tu-diff-badge tu-diff-badge--added">+ Added</span>
                        <span className="tu-diff-badge tu-diff-badge--removed">− Removed</span>
                        <span className="tu-diff-badge tu-diff-badge--same">= Same</span>
                        <span className="tu-diff-stats">
                            {diffResult.filter(d => d.type === 'added').length} added &nbsp;·&nbsp;
                            {diffResult.filter(d => d.type === 'removed').length} removed
                        </span>
                    </div>
                    {diffResult.map((d, idx) => (
                        <div key={idx} className={`tu-diff-line tu-diff-line--${d.type}`}>
                            <span className="tu-diff-marker">
                                {d.type === 'added' ? '+' : d.type === 'removed' ? '−' : ' '}
                            </span>
                            <span className="tu-diff-text">{d.line || '\u00A0'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
