import { memo, useMemo } from 'react'
import { marked } from 'marked'

export default memo(function OutputPanel({
  aiResult, hasMarkdown, onAiAccept, onAiDismiss,
  previewMode, setPreviewMode, showAlert,
  text, dyslexiaMode, markdownMode,
  speech, onDyslexiaToggle,
  activeTool, loading,
}) {
  const handleAccept = () => { onAiAccept(); setPreviewMode(null) }

  const showResult = previewMode === 'result' && aiResult
  const showDyslexia = previewMode === 'dyslexia' && dyslexiaMode && text
  const showMarkdown = previewMode === 'markdown' && markdownMode && text

  // Determine output content
  const outputText = showResult ? aiResult.result : showDyslexia || showMarkdown ? text : ''
  const hasContent = showResult || showDyslexia || showMarkdown

  // Stats for output text (memoized to avoid recomputing on every render)
  const { words, chars, sentences } = useMemo(() => ({
    words: outputText ? outputText.split(/\s+/).filter(Boolean).length : 0,
    chars: outputText ? outputText.length : 0,
    sentences: outputText ? outputText.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length : 0,
  }), [outputText])

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    showAlert('Copied output to clipboard', 'success')
  }

  const handleClear = () => {
    onAiDismiss()
    setPreviewMode(null)
  }

  const handleTts = () => {
    if (!outputText || !speech?.handleTts) return
    // Use the speech synthesis directly for output text
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      return
    }
    const utterance = new SpeechSynthesisUtterance(outputText)
    window.speechSynthesis.speak(utterance)
    showAlert('Reading output aloud...', 'info')
  }

  // No content to show
  if (!hasContent) {
    return (
      <div className="tu-output">
        <div className="tu-editor-topbar">
          <span className="tu-editor-label" title="~/FixMyText/workspace/output.txt">OUTPUT</span>
          <div className="tu-topbar-stats">
            <span className="tu-topbar-stat"><b>0</b> words</span>
            <span className="tu-topbar-stat"><b>0</b> chars</span>
          </div>
        </div>
        <div className="tu-output-empty">
          {loading ? (
            <>
              <div className="tu-spinner" style={{ width: 24, height: 24 }} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className="tu-output-empty-icon">⚡</span>
              <span>{activeTool ? 'Start typing — output updates automatically' : 'Select a tool to get started'}</span>
              <span className="tu-output-empty-hint">Results will appear here</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="tu-output">
      <div className="tu-editor-topbar">
        <span className="tu-editor-label" title="~/FixMyText/workspace/output.txt">OUTPUT</span>
        <div className="tu-topbar-stats">
          <span className="tu-topbar-stat"><b>{words}</b> words</span>
          <span className="tu-topbar-stat"><b>{chars}</b> chars</span>
          <span className="tu-topbar-stat"><b>{sentences}</b> sentences</span>
        </div>
      </div>
      <div className="tu-input-toolbar">
        <button className="tu-input-toolbar-btn" onClick={handleCopy} title="Copy output">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy</span>
        </button>
        {showResult && (
          <button className="tu-input-toolbar-btn tu-input-toolbar-btn--accept" onClick={handleAccept} title="Accept and replace input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Accept</span>
          </button>
        )}
        <button className="tu-input-toolbar-btn tu-input-toolbar-btn--danger" onClick={handleClear} title="Dismiss output">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span>Dismiss</span>
        </button>
        <div className="tu-input-toolbar-sep" />
        <button className="tu-input-toolbar-btn" onClick={handleTts} title="Read output aloud">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <span>Read Aloud</span>
        </button>
        <div className="tu-input-toolbar-sep" />
        <button className={`tu-input-toolbar-btn${dyslexiaMode ? ' tu-input-toolbar-btn--active' : ''}`} onClick={onDyslexiaToggle} title="Dyslexia-friendly font">
          <span className="tu-input-toolbar-icon-text">Aa</span>
          <span>Dyslexia</span>
        </button>
      </div>
      <div className="tu-output-body" onScroll={e => {
        const gutter = e.currentTarget.querySelector('.tu-line-numbers')
        if (gutter) gutter.scrollTop = e.currentTarget.scrollTop
      }}>
        <div className="tu-line-numbers">
          {(outputText || '\n').split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className="tu-output-text">
          {showResult ? (
            hasMarkdown(aiResult.result)
              ? <div className="tu-preview-markdown" dangerouslySetInnerHTML={{ __html: marked.parse(aiResult.result) }} />
              : <span style={{ whiteSpace: 'pre-wrap' }}>{aiResult.result}</span>
          ) : showDyslexia ? (
            <span className="tu-dyslexia" style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
          ) : showMarkdown ? (
            <div className="tu-preview-markdown" dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
          ) : null}
        </div>
      </div>
    </div>
  )
})
