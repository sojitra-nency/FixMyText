
export function RandomTextDrawer({
    textGenType, setTextGenType, textGenCount, setTextGenCount, handleGenerateText,
}) {
    return (
        <div style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="tu-gen-row">
                <label className="tu-fmt-check">
                    <input type="radio" name="tgt" value="words" checked={textGenType === 'words'}
                        onChange={() => setTextGenType('words')} /> Words
                </label>
                <label className="tu-fmt-check">
                    <input type="radio" name="tgt" value="sentences" checked={textGenType === 'sentences'}
                        onChange={() => setTextGenType('sentences')} /> Sentences
                </label>
                <label className="tu-fmt-check">
                    <input type="radio" name="tgt" value="paragraphs" checked={textGenType === 'paragraphs'}
                        onChange={() => setTextGenType('paragraphs')} /> Paragraphs
                </label>
            </div>
            <div className="tu-gen-row">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Count:</span>
                <input type="number" className="tu-gen-number" min="1" max="10000"
                    value={textGenCount}
                    onChange={e => {
                        const v = Math.min(10000, Math.max(1, Number(e.target.value)))
                        setTextGenCount(v)
                    }} />
                {textGenCount >= 10000 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600 }}>
                        ⚠ Max limit reached
                    </span>
                )}
                <button className="tu-btn tu-btn--gen" onClick={handleGenerateText}>Generate</button>
            </div>
        </div>
    )
}

export function PasswordDrawer({
    pwdLen, setPwdLen, pwdOpts, setPwdOpts,
    generatedPwd, handleGeneratePassword, showAlert,
}) {
    return (
        <div style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="tu-gen-row">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Length:</span>
                <input type="number" className="tu-gen-number" min="4" max="128"
                    value={pwdLen} onChange={e => setPwdLen(Number(e.target.value))} />
            </div>
            <div className="tu-gen-row" style={{ flexWrap: 'wrap', gap: '0.5rem 1.25rem' }}>
                {[['upper','A–Z'],['lower','a–z'],['numbers','0–9'],['symbols','!@#…']].map(([k, lbl]) => (
                    <label key={k} className="tu-fmt-check">
                        <input type="checkbox" checked={pwdOpts[k]}
                            onChange={e => setPwdOpts(o => ({ ...o, [k]: e.target.checked }))} />
                        {lbl}
                    </label>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="tu-btn tu-btn--gen" onClick={handleGeneratePassword}>Generate</button>
            </div>
            {generatedPwd && (
                <div className="tu-pwd-output">
                    <span className="tu-pwd-value">{generatedPwd}</span>
                    <button className="tu-btn tu-btn--clip" style={{ flexShrink: 0 }}
                        onClick={() => { navigator.clipboard.writeText(generatedPwd); showAlert('Password copied', 'success') }}>
                        Copy
                    </button>
                </div>
            )}
        </div>
    )
}
