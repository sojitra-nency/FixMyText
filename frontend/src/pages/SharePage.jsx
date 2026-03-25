import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useGetShareQuery } from '../store/api/shareApi'
import { TOOLS } from '../constants/tools'
import ToolIcon from '../components/editor/ToolIcon'

export default function SharePage({ showAlert }) {
  const { id } = useParams()
  const { data, isLoading, error } = useGetShareQuery(id)
  const [copied, setCopied] = useState(false)

  const { tool, createdDate, lines, words, chars } = useMemo(() => {
    if (!data) return {}
    return {
      tool: TOOLS.find(t => t.id === data.tool_id),
      createdDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lines: data.output_text.split('\n'),
      words: data.output_text.split(/\s+/).filter(Boolean).length,
      chars: data.output_text.length,
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="sh-page">
        <div className="sh-state">
          <div className="tu-spinner" style={{ width: 32, height: 32 }} />
          <span className="sh-state-text">Loading shared result...</span>
        </div>
      </div>
    )
  }

  if (error) {
    const expired = error.status === 410
    return (
      <div className="sh-page">
        <div className="sh-state">
          <div className="sh-state-emoji">{expired ? '⏱' : '🔗'}</div>
          <h2 className="sh-state-title">{expired ? 'This share has expired' : 'Share not found'}</h2>
          <p className="sh-state-desc">
            {expired ? 'Shared results expire after 30 days.' : 'The link may be invalid or the share may have been removed.'}
          </p>
          <a href="/" className="sh-cta-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Go to FixMyText
          </a>
        </div>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.output_text)
    setCopied(true)
    showAlert?.('Copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="sh-page">
      {/* ── Hero section with glow ─── */}
      <div className="sh-hero">
        <div className="sh-hero-glow" />
        <div className="sh-hero-inner">
          <div className="sh-hero-badge">Shared Result</div>
          <div className="sh-hero-tool">
            <div className="sh-hero-icon">
              <ToolIcon icon={tool?.icon} color={tool?.color} toolId={data.tool_id} />
            </div>
            <h1 className="sh-hero-title">{data.tool_label}</h1>
          </div>
          <div className="sh-hero-meta">
            <span>{createdDate}</span>
            <span className="sh-dot" />
            <span>{lines.length} lines</span>
            <span className="sh-dot" />
            <span>{words} words</span>
            <span className="sh-dot" />
            <span>{chars} chars</span>
          </div>
          <div className="sh-hero-actions">
            <button className={`sh-btn${copied ? ' sh-btn--success' : ''}`} onClick={handleCopy}>
              {copied ? (
                <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              ) : (
                <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy to Clipboard</>
              )}
            </button>
            <a href="/" className="sh-btn sh-btn--accent">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Try FixMyText
            </a>
          </div>
        </div>
      </div>

      {/* ── Mock editor card ─── */}
      <div className="sh-card-wrap">
        <div className="sh-card">
          {/* Titlebar with macOS dots */}
          <div className="sh-card-titlebar">
            <span className="sh-card-dot" style={{ background: '#FF5F57' }} />
            <span className="sh-card-dot" style={{ background: '#FEBC2E' }} />
            <span className="sh-card-dot" style={{ background: '#28C840' }} />
            <span className="sh-card-title">output.txt — {data.tool_label}</span>
            <button className={`sh-card-copy${copied ? ' sh-card-copy--done' : ''}`} onClick={handleCopy} title="Copy">
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
          </div>
          {/* Code body */}
          <div className="sh-card-body">
            {lines.length > 1 && (
              <div className="sh-card-gutter">
                {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
              </div>
            )}
            <pre className="sh-card-pre">{data.output_text}</pre>
          </div>
          {/* Mini status bar */}
          <div className="sh-card-status">
            <span>{lines.length} {lines.length === 1 ? 'line' : 'lines'}</span>
            <span>{words} words</span>
            <span>{chars} chars</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ─── */}
      <div className="sh-footer">
        <span className="sh-footer-text">Transform your text with 70+ tools —</span>
        <a href="/" className="sh-footer-link">Get started free →</a>
      </div>
    </div>
  )
}
