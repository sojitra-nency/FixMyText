
// Which settings are relevant per parser/tool
const TOOL_SETTINGS = {
    js_fmt:   { label: 'JavaScript', indent: true, semi: true, singleQuote: true, trailingComma: true, bracketSpacing: true, arrowParens: true, jsxSingleQuote: true, sortImports: true },
    ts_fmt:   { label: 'TypeScript', indent: true, semi: true, singleQuote: true, trailingComma: true, bracketSpacing: true, arrowParens: true, sortImports: true },
    css_fmt:  { label: 'CSS',        indent: true, singleQuote: true },
    html_fmt: { label: 'HTML',       indent: true, singleQuote: true, bracketSameLine: true, htmlWhitespace: true },
}

const PRESETS = {
    default:  { tabWidth: 2, useTabs: false, semi: true,  singleQuote: false, trailingComma: 'es5',  bracketSpacing: true, arrowParens: 'always', jsxSingleQuote: false, sortImports: true },
    airbnb:   { tabWidth: 2, useTabs: false, semi: false, singleQuote: true,  trailingComma: 'all',  bracketSpacing: true, arrowParens: 'always', jsxSingleQuote: false, sortImports: true },
    standard: { tabWidth: 4, useTabs: false, semi: false, singleQuote: true,  trailingComma: 'es5',  bracketSpacing: true, arrowParens: 'always', jsxSingleQuote: false, sortImports: true },
}

function Toggle({ checked, onChange, label, tooltip }) {
    return (
        <button
            className={`tu-fmtbar-opt${checked ? ' tu-fmtbar-opt--on' : ''}`}
            onClick={() => onChange(!checked)}
            title={tooltip}
        >
            {label}
        </button>
    )
}

export default function FmtConfigBar({ toolId, fmtCfg, setFmtCfg }) {
    const spec = TOOL_SETTINGS[toolId]
    if (!spec) return null

    const set = (patch) => setFmtCfg(c => ({ ...c, ...patch }))
    const hasPresets = spec.semi || spec.trailingComma

    return (
        <div className="tu-fmtbar">
            {/* Language badge */}
            <span className="tu-fmtbar-lang">{spec.label}</span>

            <span className="tu-fmtbar-sep" />

            {/* Indentation */}
            <div className="tu-fmtbar-field" title="Number of spaces (or tabs) per indentation level">
                <span className="tu-fmtbar-label">Indent</span>
                <select
                    className="tu-fmtbar-select"
                    value={fmtCfg.useTabs ? 'tabs' : String(fmtCfg.tabWidth)}
                    onChange={e => {
                        if (e.target.value === 'tabs') set({ useTabs: true })
                        else set({ useTabs: false, tabWidth: Number(e.target.value) })
                    }}
                >
                    <option value="2">2 Spaces</option>
                    <option value="4">4 Spaces</option>
                    <option value="tabs">Tabs</option>
                </select>
            </div>

            {/* Toggle buttons for boolean options */}
            {spec.semi && (
                <Toggle checked={fmtCfg.semi} onChange={v => set({ semi: v })} label="Semicolons" tooltip="Add semicolons at the end of statements" />
            )}
            {spec.singleQuote && (
                <Toggle checked={fmtCfg.singleQuote} onChange={v => set({ singleQuote: v })} label="Single Quotes" tooltip="Use single quotes instead of double quotes" />
            )}
            {spec.bracketSpacing && (
                <Toggle checked={fmtCfg.bracketSpacing} onChange={v => set({ bracketSpacing: v })} label="Bracket Spacing" tooltip="Add spaces inside object braces: { foo } vs {foo}" />
            )}
            {spec.jsxSingleQuote && (
                <Toggle checked={fmtCfg.jsxSingleQuote} onChange={v => set({ jsxSingleQuote: v })} label="JSX Quotes" tooltip="Use single quotes in JSX attributes" />
            )}
            {spec.sortImports && (
                <Toggle checked={fmtCfg.sortImports} onChange={v => set({ sortImports: v })} label="Sort Imports" tooltip="Sort import statements alphabetically" />
            )}

            {/* HTML-specific options */}
            {spec.bracketSameLine && (
                <Toggle checked={fmtCfg.bracketSameLine} onChange={v => set({ bracketSameLine: v })} label="Bracket Same Line" tooltip="Put the > of a multi-line HTML element on the same line as the last attribute" />
            )}
            {spec.htmlWhitespace && (
                <div className="tu-fmtbar-field" title="How to handle whitespace in HTML: css (default), strict, or ignore">
                    <span className="tu-fmtbar-label">Whitespace</span>
                    <select className="tu-fmtbar-select" value={fmtCfg.htmlWhitespaceSensitivity || 'css'} onChange={e => set({ htmlWhitespaceSensitivity: e.target.value })}>
                        <option value="css">CSS</option>
                        <option value="strict">Strict</option>
                        <option value="ignore">Ignore</option>
                    </select>
                </div>
            )}

            {/* Dropdowns for enum options */}
            {spec.trailingComma && (
                <div className="tu-fmtbar-field" title="Add trailing commas: None, ES5 (objects/arrays), or All (including function params)">
                    <span className="tu-fmtbar-label">Trailing</span>
                    <select className="tu-fmtbar-select" value={fmtCfg.trailingComma} onChange={e => set({ trailingComma: e.target.value })}>
                        <option value="none">None</option>
                        <option value="es5">ES5</option>
                        <option value="all">All</option>
                    </select>
                </div>
            )}
            {spec.arrowParens && (
                <div className="tu-fmtbar-field" title="Parentheses around a single arrow function parameter: (x) => x vs x => x">
                    <span className="tu-fmtbar-label">Arrows</span>
                    <select className="tu-fmtbar-select" value={fmtCfg.arrowParens} onChange={e => set({ arrowParens: e.target.value })}>
                        <option value="always">Always</option>
                        <option value="avoid">Avoid</option>
                    </select>
                </div>
            )}

            {/* Presets — JS/TS only */}
            {hasPresets && (
                <>
                    <span className="tu-fmtbar-sep" />
                    <div className="tu-fmtbar-presets">
                        {Object.entries(PRESETS).map(([key, preset]) => (
                            <button
                                key={key}
                                className={`tu-fmtbar-preset${
                                    fmtCfg.tabWidth === preset.tabWidth &&
                                    fmtCfg.semi === preset.semi &&
                                    fmtCfg.singleQuote === preset.singleQuote &&
                                    fmtCfg.trailingComma === preset.trailingComma
                                        ? ' tu-fmtbar-preset--active' : ''
                                }`}
                                onClick={() => setFmtCfg(c => ({ ...c, ...preset }))}
                                title={key === 'default' ? 'Default: 2 spaces, semicolons, double quotes, ES5 trailing commas'
                                    : key === 'airbnb' ? 'Airbnb: 2 spaces, no semicolons, single quotes, all trailing commas'
                                    : 'Standard: 4 spaces, no semicolons, single quotes, ES5 trailing commas'}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
