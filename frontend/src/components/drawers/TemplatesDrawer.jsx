
export default function TemplatesDrawer({
    templates, templateName, setTemplateName,
    handleSaveTemplate, handleLoadTemplate, handleDeleteTemplate,
    disabled,
}) {
    return (
        <div className="tu-find-inputs">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="tu-find-input" placeholder="Template name…"
                    value={templateName} onChange={e => setTemplateName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveTemplate()}
                    style={{ flex: 1 }} />
                <button className="tu-btn tu-btn--tools" disabled={disabled}
                    onClick={handleSaveTemplate}>Save</button>
            </div>
            {templates.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--fg2)', padding: '0.5rem 0' }}>
                    No saved templates yet. Type text, name it, and save.
                </div>
            ) : (
                <div className="tu-diff-output" style={{ maxHeight: 250, marginTop: '0.5rem' }}>
                    {templates.map((t, i) => (
                        <div key={i} className="tu-diff-line tu-diff-line--same"
                            style={{ padding: '0.4rem 0.75rem', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.8rem', color: 'var(--fg)' }}>
                                {t.name}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--fg2)', whiteSpace: 'nowrap' }}>
                                {t.text.length} chars
                            </span>
                            <button className="tu-btn tu-btn--tools"
                                style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                                onClick={() => handleLoadTemplate(i)}>Load</button>
                            <button className="tu-btn tu-btn--tools"
                                style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', color: 'var(--rose)' }}
                                onClick={() => handleDeleteTemplate(i)}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
