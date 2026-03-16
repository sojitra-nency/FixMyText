
export default function FindReplaceDrawer({
    findText, setFindText, replaceText, setReplaceText,
    findCaseSensitive, setFindCaseSensitive,
    findUseRegex, setFindUseRegex,
    replaceCount, setReplaceCount,
    disabled, handleReplaceAll,
}) {
    return (
        <div className="tu-find-inputs">
            <input className="tu-find-input" placeholder="Find…"
                value={findText} onChange={e => { setFindText(e.target.value); setReplaceCount(null) }} />
            <input className="tu-find-input" placeholder="Replace with…"
                value={replaceText} onChange={e => setReplaceText(e.target.value)} />
            <div className="tu-find-footer">
                <div className="tu-find-flags">
                    <label className="tu-fmt-check">
                        <input type="checkbox" checked={findCaseSensitive}
                            onChange={e => setFindCaseSensitive(e.target.checked)} />
                        Case-sensitive
                    </label>
                    <label className="tu-fmt-check">
                        <input type="checkbox" checked={findUseRegex}
                            onChange={e => setFindUseRegex(e.target.checked)} />
                        Regex
                    </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {replaceCount !== null && (
                        <span className="tu-find-count">{replaceCount} replaced</span>
                    )}
                    <button className="tu-btn tu-btn--tools" disabled={disabled}
                        onClick={handleReplaceAll}>Replace All</button>
                </div>
            </div>
        </div>
    )
}
