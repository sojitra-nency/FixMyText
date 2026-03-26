
const S = 16 // icon size
const p = { width: S, height: S, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

// SVG icons keyed by tool.id — every icon renders at a uniform 16×16
const ICONS = {
  // ── Transform / Case ──
  uppercase:     <svg {...p}><path d="M4 20V6l4 14M4 12h8M12 6v14M16 20V6l4 14M16 12h8"/></svg>,
  lowercase:     <svg {...p}><circle cx="8" cy="16" r="4"/><path d="M12 12v8"/><circle cx="19" cy="16" r="4"/><path d="M19 12v8"/></svg>,
  title_case:    <svg {...p}><path d="M4 6h8M8 6v14"/><path d="M16 12v8m-3-8h6"/></svg>,
  sentence_case: <svg {...p}><path d="M4 6h8M8 6v14"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/></svg>,
  toggle_case:   <svg {...p}><path d="M4 12v8m-2-8h4"/><path d="M10 4V18l4 -14v14"/></svg>,
  pascal_case:   <svg {...p}><path d="M4 20V6h5a4 4 0 010 8H4"/><path d="M15 20V6h5a4 4 0 010 8H15"/></svg>,
  camel_case:    <svg {...p}><path d="M2 17a5 5 0 019 0"/><path d="M13 17a5 5 0 019 0"/></svg>,
  snake_case:    <svg {...p}><path d="M2 12h20"/><path d="M6 8v8M12 8v8M18 8v8"/></svg>,
  kebab_case:    <svg {...p}><path d="M2 12h20"/><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="2" fill="currentColor" stroke="none"/></svg>,

  // ── Whitespace ──
  trim_extra:    <svg {...p}><path d="M4 12h16M9 6l-5 6 5 6M15 6l5 6-5 6"/></svg>,
  no_breaks:     <svg {...p}><path d="M17 3l-12 18"/><path d="M4 12h16"/></svg>,
  strip_all:     <svg {...p}><line x1="4" y1="4" x2="20" y2="20"/><path d="M4 12h16"/><line x1="4" y1="20" x2="20" y2="4"/></svg>,
  strip_html:    <svg {...p}><polyline points="8 18 4 12 8 6"/><polyline points="16 6 20 12 16 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>,
  no_accents:    <svg {...p}><path d="M5 20l4-16h2l4 16"/><path d="M7 14h6"/><line x1="15" y1="4" x2="19" y2="4"/></svg>,
  toggle_quotes: <svg {...p}><path d="M5 8c0-2 1-4 4-4v3c-1 0-2 1-2 2v2h3v5H5V8z"/><path d="M14 8c0-2 1-4 4-4v3c-1 0-2 1-2 2v2h3v5h-5V8z"/></svg>,

  // ── Text Tools ──
  reverse:       <svg {...p}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  sort_asc:      <svg {...p}><path d="M3 6h8M3 12h5M3 18h3"/><path d="M17 6v14M14 17l3 3 3-3"/></svg>,
  sort_desc:     <svg {...p}><path d="M3 18h8M3 12h5M3 6h3"/><path d="M17 18V4M14 7l3-3 3 3"/></svg>,
  deduplicate:   <svg {...p}><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 21h12a2 2 0 002-2V7"/><line x1="9" y1="10" x2="13" y2="10"/></svg>,
  reverse_lines: <svg {...p}><path d="M7 4v16M17 4v16"/><path d="M4 8l3-4 3 4M14 16l3 4 3-4"/></svg>,
  number_lines:  <svg {...p}><path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h1M3 12h2M2 18h3"/></svg>,
  rot13:         <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4"/><path d="M8 7l4 5-4 5"/></svg>,
  find_replace:  <svg {...p}><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/><path d="M18 13v6h6"/></svg>,

  // ── Encoding ──
  base64_enc:    <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 9v6M11 9v6M15 9l-2 3 2 3"/></svg>,
  base64_dec:    <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 9v6M11 9v6M15 15l-2-3 2-3"/></svg>,
  url_enc:       <svg {...p}><path d="M10 14a4 4 0 01-4-4V8a4 4 0 018 0v2a4 4 0 01-4 4z"/><path d="M17 10h3M17 14h3M20 12h-3"/></svg>,
  url_dec:       <svg {...p}><path d="M10 14a4 4 0 01-4-4V8a4 4 0 018 0v2a4 4 0 01-4 4z"/><path d="M18 8v8M15 12h6"/></svg>,
  hex_enc:       <svg {...p}><path d="M5 4v16M2 10h6"/><path d="M11 4v16h5"/><path d="M20 4v16h-2"/></svg>,
  hex_dec:       <svg {...p}><path d="M4 4v16M2 12h4"/><path d="M10 4v16h4"/><path d="M22 4l-4 8 4 8"/></svg>,
  morse_enc:     <svg {...p}><circle cx="4" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M10 12h6"/><circle cx="20" cy="12" r="2" fill="currentColor" stroke="none"/></svg>,
  morse_dec:     <svg {...p}><path d="M2 12h6"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M16 12h6"/></svg>,
  md5:           <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16V8l3 4 3-4v8"/><path d="M17 16V8"/></svg>,
  sha256:        <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 9c0-1 1-2 2-2s2 1 2 1-2 1-2 2 1 2 2 2 2-1 2-2"/></svg>,
  json_esc:      <svg {...p}><path d="M8 3H6a2 2 0 00-2 2v14a2 2 0 002 2h2"/><path d="M16 3h2a2 2 0 012 2v14a2 2 0 01-2 2h-2"/><path d="M9 12h6M12 9l3 3-3 3"/></svg>,
  json_unesc:    <svg {...p}><path d="M8 3H6a2 2 0 00-2 2v14a2 2 0 002 2h2"/><path d="M16 3h2a2 2 0 012 2v14a2 2 0 01-2 2h-2"/><path d="M15 12H9M12 9l-3 3 3 3"/></svg>,
  html_esc:      <svg {...p}><polyline points="8 18 4 12 8 6"/><polyline points="16 6 20 12 16 18"/><path d="M12 9l1 6"/></svg>,
  html_unesc:    <svg {...p}><polyline points="8 18 4 12 8 6"/><polyline points="16 6 20 12 16 18"/><path d="M13 15l-1-6"/></svg>,

  // ── Developer ──
  json_fmt:      <svg {...p}><path d="M8 3H6a2 2 0 00-2 2v14a2 2 0 002 2h2"/><path d="M16 3h2a2 2 0 012 2v14a2 2 0 01-2 2h-2"/><path d="M9 10h6M9 14h4"/></svg>,
  json_yaml:     <svg {...p}><path d="M4 8l4 4v8"/><path d="M12 8l-4 4"/><path d="M16 6v12M14 10h4M14 14h4"/></svg>,
  html_fmt:      <svg {...p}><polyline points="8 18 4 12 8 6"/><polyline points="16 6 20 12 16 18"/><path d="M10 14h4"/></svg>,
  css_fmt:       <svg {...p}><path d="M8 3H6a2 2 0 00-2 2v14a2 2 0 002 2h2"/><path d="M16 3h2a2 2 0 012 2v14a2 2 0 01-2 2h-2"/><path d="M12 8v2M10 14h4M12 14v2"/></svg>,
  js_fmt:        <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10 8v6c0 2-3 2-3 0"/><path d="M15 8c2 0 2 3 0 3s-2 3 0 3"/></svg>,
  ts_fmt:        <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h5M10.5 8v8"/><path d="M17 8c-2 0-3 2-1 3 2 1 1 3-1 3"/></svg>,
  csv_json:      <svg {...p}><path d="M4 6h16M4 12h10M4 18h6"/><path d="M18 14l3 3-3 3"/></svg>,
  json_csv:      <svg {...p}><path d="M4 6h6M4 12h10M4 18h16"/><path d="M18 2l3 3-3 3"/></svg>,
  jwt_decode:    <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M12 13v3"/></svg>,
  regex_test:    <svg {...p}><path d="M12 4v16M7 7l10 10M17 7L7 17"/><circle cx="12" cy="12" r="2"/></svg>,

  // ── AI Tools ──
  fix_grammar:   <svg {...p}><path d="M11 4H4v16h16v-7"/><polyline points="20 7 11 16 8 13"/></svg>,
  paraphrase:    <svg {...p}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  proofread:     <svg {...p}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>,
  summarize:     <svg {...p}><path d="M4 6h16M4 10h16M4 14h10M4 18h6"/></svg>,
  eli5:          <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015 1c0 2-3 2-3 4"/><circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none"/></svg>,
  lengthen:      <svg {...p}><path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="9"/></svg>,
  email_rewrite: <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 7 12 13 2 7"/></svg>,
  tweet_shorten: <svg {...p}><path d="M4 4l16 16M12 4h8M4 20h8"/></svg>,
  hashtags:      <svg {...p}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
  seo_titles:    <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M8 11h6M11 8v6"/></svg>,
  meta_desc:     <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h10M7 15h6"/></svg>,
  blog_outline:  <svg {...p}><path d="M4 6h16M4 10h16M8 14h12M8 18h12"/><circle cx="4" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>,
  keywords:      <svg {...p}><circle cx="12" cy="10" r="3"/><path d="M12 13v8"/><path d="M9 18h6"/></svg>,
  sentiment:     <svg {...p}><path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83"/><circle cx="12" cy="12" r="8"/><path d="M12 12l4-4"/></svg>,
  gen_title:     <svg {...p}><path d="M4 6h16M4 12h12"/><path d="M17 16l3 3-3 3"/></svg>,
  refactor_prompt:<svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>,

  // ── AI with selectors ──
  change_format: <svg {...p}><path d="M4 6h16M4 10h16M4 14h10M4 18h6"/><path d="M19 14l2 2-2 2"/></svg>,
  change_tone:   <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  translate:     <svg {...p}><path d="M5 8h8M9 4v4"/><path d="M6 12c0 3 3 6 6 6"/><path d="M14 10l3 8 3-8"/><path d="M15 16h4"/></svg>,
  transliterate: <svg {...p}><path d="M4 6h7M7.5 6v10"/><path d="M14 8l3 8 3-8"/><path d="M15 14h4"/></svg>,

  // ── Emoji ──
  emojify:       <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none"/></svg>,

  // ── Compare & Generate ──
  compare:       <svg {...p}><path d="M8 3v18M16 3v18"/><path d="M3 8l5-5 5 5"/><path d="M11 16l5 5 5-5"/></svg>,
  random_text:   <svg {...p}><path d="M4 6h16M4 10h12M4 14h14M4 18h8"/></svg>,
  password:      <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>,

  // ── Utilities ──
  word_freq:     <svg {...p}><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="3" width="3" height="15" rx="1"/></svg>,
  markdown:      <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8v8l2.5-3 2.5 3V8"/><path d="M17 12l-2-2v8"/></svg>,
}

export default function ToolIcon({ icon, color, toolId }) {
    const svg = toolId ? ICONS[toolId] : null

    if (svg) {
        return (
            <span className={`tu-titem-icon${color ? ` tu-titem-icon--${color}` : ''}`}>
                {svg}
            </span>
        )
    }

    // Fallback for unknown tools: text icon with auto-sizing
    const len = icon ? icon.length : 0
    const fontSize = len <= 2 ? undefined : len === 3 ? '0.58rem' : '0.5rem'

    return (
        <span
            className={`tu-titem-icon${color ? ` tu-titem-icon--${color}` : ''}`}
            style={fontSize ? { fontSize } : undefined}
        >
            {icon}
        </span>
    )
}
