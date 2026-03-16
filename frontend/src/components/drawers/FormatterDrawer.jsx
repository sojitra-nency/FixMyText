
export default function FormatterDrawer({
    pendingFmtCfg, setPendingFmt, setPendingFmtCfg,
    defaultFmtCfg, fmtCfg, disabled, handleFmtApply, setActivePanel,
}) {
    return (
        <div>
            <div className="tu-fmt-section-label">Language</div>
            <div className="tu-fmt-grid">
                <label className="tu-fmt-field">
                    <select value={pendingFmtCfg.language} onChange={e => setPendingFmt({ language: e.target.value })}>
                        {[['babel','JavaScript / JSX'],['typescript','TypeScript'],['html','HTML'],['css','CSS']].map(([v,l]) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="tu-fmt-section-label">Indentation</div>
            <div className="tu-fmt-grid">
                <label className="tu-fmt-field">
                    <span>Tab width</span>
                    <select value={pendingFmtCfg.tabWidth} onChange={e => setPendingFmt({ tabWidth: Number(e.target.value) })}>
                        {[2, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </label>
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.useTabs}
                        onChange={e => setPendingFmt({ useTabs: e.target.checked })} />
                    Use tabs
                </label>
            </div>
            <div className="tu-fmt-section-label">Syntax</div>
            <div className="tu-fmt-checks">
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.semi}
                        onChange={e => setPendingFmt({ semi: e.target.checked })} />
                    Semicolons
                </label>
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.singleQuote}
                        onChange={e => setPendingFmt({ singleQuote: e.target.checked })} />
                    Single quotes
                </label>
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.bracketSpacing}
                        onChange={e => setPendingFmt({ bracketSpacing: e.target.checked })} />
                    Bracket spacing
                </label>
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.jsxSingleQuote}
                        onChange={e => setPendingFmt({ jsxSingleQuote: e.target.checked })} />
                    JSX single quotes
                </label>
                <label className="tu-fmt-check">
                    <input type="checkbox" checked={pendingFmtCfg.sortImports}
                        onChange={e => setPendingFmt({ sortImports: e.target.checked })} />
                    Sort imports
                </label>
            </div>
            <div className="tu-fmt-section-label">Trailing commas</div>
            <div className="tu-fmt-grid">
                <label className="tu-fmt-field">
                    <select value={pendingFmtCfg.trailingComma}
                        onChange={e => setPendingFmt({ trailingComma: e.target.value })}>
                        {['none','es5','all'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </label>
                <label className="tu-fmt-field">
                    <span>Arrow parens</span>
                    <select value={pendingFmtCfg.arrowParens}
                        onChange={e => setPendingFmt({ arrowParens: e.target.value })}>
                        {['always','avoid'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </label>
            </div>
            <div className="tu-fmt-presets">
                <span className="tu-fmt-preset-label">Presets:</span>
                <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg })}>Default</button>
                <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg, singleQuote: true, semi: false, trailingComma: 'all' })}>Airbnb</button>
                <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg, tabWidth: 4, singleQuote: true, semi: false })}>Standard</button>
            </div>
            <div className="tu-fmt-actions">
                <button className="tu-btn tu-btn--dev" onClick={() => { setPendingFmtCfg(fmtCfg); setActivePanel(null) }}>Cancel</button>
                <button className="tu-btn tu-btn--apply" disabled={disabled} onClick={() => handleFmtApply(setActivePanel)}>Apply & Format</button>
            </div>
        </div>
    )
}
