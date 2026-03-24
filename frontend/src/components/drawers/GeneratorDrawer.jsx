import { useMemo } from 'react'

/* ── Password strength calculator ── */
function getStrength(len, opts) {
    let poolSize = 0
    if (opts.upper) poolSize += 26
    if (opts.lower) poolSize += 26
    if (opts.numbers) poolSize += 10
    if (opts.symbols) poolSize += 26
    if (poolSize === 0) return { label: 'None', color: 'var(--text-3)', pct: 0 }
    const entropy = len * Math.log2(poolSize)
    if (entropy < 28)  return { label: 'Very Weak', color: 'var(--rose)',   pct: 15 }
    if (entropy < 36)  return { label: 'Weak',      color: '#E57373',       pct: 30 }
    if (entropy < 60)  return { label: 'Fair',       color: 'var(--amber)',  pct: 50 }
    if (entropy < 80)  return { label: 'Strong',     color: 'var(--emerald)', pct: 75 }
    return { label: 'Very Strong', color: '#4CAF50', pct: 100 }
}

export function RandomTextDrawer({
    textGenType, setTextGenType, textGenCount, setTextGenCount, handleGenerateText,
    onResult,
}) {
    const presets = [
        { label: '10', val: 10 }, { label: '50', val: 50 },
        { label: '100', val: 100 }, { label: '500', val: 500 },
    ]
    return (
        <div className="tu-gen">
            <div className="tu-gen-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
            </div>
            <h3 className="tu-gen-title">Random Text Generator</h3>
            <p className="tu-gen-desc">Generate lorem ipsum placeholder text</p>

            <div className="tu-gen-card">
                <div className="tu-gen-section">
                    <label className="tu-gen-label">Type</label>
                    <div className="tu-gen-options">
                        {['words', 'sentences', 'paragraphs'].map(type => (
                            <button key={type}
                                className={`tu-gen-opt${textGenType === type ? ' tu-gen-opt--on' : ''}`}
                                onClick={() => setTextGenType(type)}
                            >{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                        ))}
                    </div>
                </div>
                <div className="tu-gen-section">
                    <label className="tu-gen-label">Count</label>
                    <div className="tu-gen-presets">
                        {presets.map(p => (
                            <button key={p.val}
                                className={`tu-gen-preset${textGenCount === p.val ? ' tu-gen-preset--on' : ''}`}
                                onClick={() => setTextGenCount(p.val)}
                            >{p.label}</button>
                        ))}
                        <input type="number" className="tu-gen-num" min="1" max="10000"
                            value={textGenCount}
                            onChange={e => setTextGenCount(Math.min(10000, Math.max(1, Number(e.target.value))))}
                        />
                    </div>
                </div>
            </div>

            <button className="tu-gen-btn" onClick={() => {
                const result = handleGenerateText()
                if (result && onResult) onResult(result)
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Generate {textGenCount} {textGenType}
            </button>
            <p className="tu-gen-hint">Text will appear in the editor input area</p>
        </div>
    )
}

export function PasswordDrawer({
    pwdLen, setPwdLen, pwdOpts, setPwdOpts,
    generatedPwd, handleGeneratePassword, showAlert, onResult,
}) {
    const charsets = [
        ['upper',   'A–Z', 'Uppercase letters (A-Z)',    26],
        ['lower',   'a–z', 'Lowercase letters (a-z)',    26],
        ['numbers', '0–9', 'Digits (0-9)',               10],
        ['symbols', '!@#', 'Special characters (!@#...)', 26],
    ]

    const strength = useMemo(() => getStrength(pwdLen, pwdOpts), [pwdLen, pwdOpts])

    const poolSize = charsets.reduce((n, [k,,, sz]) => pwdOpts[k] ? n + sz : n, 0)
    const combinations = poolSize > 0 ? Math.pow(poolSize, pwdLen) : 0
    const entropy = poolSize > 0 ? Math.round(pwdLen * Math.log2(poolSize)) : 0

    const handleGen = () => {
        const pwd = handleGeneratePassword()
        if (pwd && onResult) onResult(pwd)
    }

    const presetLengths = [8, 16, 24, 32, 48, 64]

    return (
        <div className="tu-gen">
            <div className="tu-gen-icon tu-gen-icon--amber">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
            </div>
            <h3 className="tu-gen-title">Password Generator</h3>
            <p className="tu-gen-desc">Create strong, random passwords</p>

            <div className="tu-gen-card">
                {/* Length */}
                <div className="tu-gen-section">
                    <label className="tu-gen-label">Length</label>
                    <div className="tu-gen-slider-wrap">
                        <input type="range" className="tu-gen-slider" min="4" max="128"
                            value={pwdLen} onChange={e => setPwdLen(Number(e.target.value))} />
                        <input type="number" className="tu-gen-num" min="4" max="128"
                            value={pwdLen} onChange={e => setPwdLen(Math.min(128, Math.max(4, Number(e.target.value))))} />
                    </div>
                    <div className="tu-gen-presets">
                        {presetLengths.map(n => (
                            <button key={n}
                                className={`tu-gen-preset${pwdLen === n ? ' tu-gen-preset--on' : ''}`}
                                onClick={() => setPwdLen(n)}
                            >{n}</button>
                        ))}
                    </div>
                </div>

                {/* Character sets */}
                <div className="tu-gen-section">
                    <label className="tu-gen-label">Include</label>
                    <div className="tu-gen-charsets">
                        {charsets.map(([k, lbl, tip, sz]) => (
                            <button key={k}
                                className={`tu-gen-charset${pwdOpts[k] ? ' tu-gen-charset--on' : ''}`}
                                onClick={() => setPwdOpts(o => ({ ...o, [k]: !o[k] }))}
                                title={tip}
                            >
                                <span className="tu-gen-charset-label">{lbl}</span>
                                <span className="tu-gen-charset-count">{sz} chars</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Strength meter */}
                <div className="tu-gen-section">
                    <label className="tu-gen-label">Strength</label>
                    <div className="tu-gen-strength">
                        <div className="tu-gen-strength-bar">
                            <div className="tu-gen-strength-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
                        </div>
                        <span className="tu-gen-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="tu-gen-stats">
                        <span>{entropy} bits entropy</span>
                        <span>{poolSize} char pool</span>
                    </div>
                </div>
            </div>

            <button className="tu-gen-btn" onClick={handleGen}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Generate Password
            </button>
            <p className="tu-gen-hint">Result appears in the output panel</p>
        </div>
    )
}
