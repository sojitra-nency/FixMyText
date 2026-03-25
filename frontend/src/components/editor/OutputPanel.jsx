import { memo, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { marked } from 'marked'
import { useCreateShareMutation } from '../../store/api/shareApi'

export default memo(function OutputPanel({
  aiResult, hasMarkdown, onAiDismiss,
  previewMode, setPreviewMode, showAlert,
  text, dyslexiaMode, markdownMode,
  speech, onDyslexiaToggle,
  activeTool, loading, exportTools,
}) {
  const [createShare, { isLoading: isSharing }] = useCreateShareMutation()
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const [mdPreview, setMdPreview] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const saveBtnRef = useRef(null)
  const saveMenuRef = useRef(null)
  const showResult = previewMode === 'result' && aiResult
  const showDyslexia = previewMode === 'dyslexia' && dyslexiaMode && text
  const showMarkdown = previewMode === 'markdown' && markdownMode && text

  // Determine output content
  const outputText = showResult ? aiResult.result : showDyslexia || showMarkdown ? text : ''
  const hasContent = showResult || showDyslexia || showMarkdown

  // Keep export hook in sync with current output
  useEffect(() => {
    if (exportTools?.setOutputText) exportTools.setOutputText(outputText)
  }, [outputText, exportTools])

  // Stats for output text (memoized to avoid recomputing on every render)
  const { words, chars, sentences } = useMemo(() => ({
    words: outputText ? outputText.split(/\s+/).filter(Boolean).length : 0,
    chars: outputText ? outputText.length : 0,
    sentences: outputText ? outputText.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length : 0,
  }), [outputText])

  // Close save menu on outside click
  useEffect(() => {
    if (!saveMenuOpen) return
    const handleClick = (e) => {
      if (saveMenuRef.current?.contains(e.target)) return
      if (saveBtnRef.current?.contains(e.target)) return
      setSaveMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [saveMenuOpen])

  const toggleSaveMenu = useCallback(() => {
    setSaveMenuOpen(prev => {
      if (!prev && saveBtnRef.current) {
        const rect = saveBtnRef.current.getBoundingClientRect()
        setMenuPos({ top: rect.bottom + 4, left: rect.right })
      }
      return !prev
    })
  }, [])

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

  const handleShare = async () => {
    if (!outputText || isSharing) return
    try {
      const result = await createShare({
        tool_id: activeTool?.id || 'unknown',
        tool_label: activeTool?.label || aiResult?.label || 'Text Transform',
        output_text: outputText,
      }).unwrap()
      await navigator.clipboard.writeText(result.share_url)
      showAlert('Share link copied to clipboard!', 'success')
    } catch {
      showAlert('Failed to create share link', 'danger')
    }
  }

  const saveMenu = saveMenuOpen && createPortal(
    <div className="tu-save-menu" ref={saveMenuRef} style={{ top: menuPos.top, left: menuPos.left }}>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadTxt(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">.txt</span>
        <span>Save TXT</span>
      </button>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadPdf(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">.pdf</span>
        <span>Save PDF</span>
      </button>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadDocx(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">.doc</span>
        <span>Save DOCX</span>
      </button>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadJson(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">{'{}'}</span>
        <span>Save JSON</span>
      </button>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadCsv(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">.csv</span>
        <span>Save CSV</span>
      </button>
      <button className="tu-save-menu-item" onClick={() => { exportTools.handleDownloadMd(); setSaveMenuOpen(false) }}>
        <span className="tu-save-menu-icon">.md</span>
        <span>Save Markdown</span>
      </button>
    </div>,
    document.body
  )

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
        <button className={`tu-input-toolbar-btn${mdPreview ? ' tu-input-toolbar-btn--active' : ''}`} onClick={() => setMdPreview(p => !p)} title="Toggle Markdown preview">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8v8l2.5-3 2.5 3V8"/><path d="M17 12l-2-2v8"/></svg>
          <span>Markdown</span>
        </button>
        {exportTools && (
          <>
            <div className="tu-input-toolbar-sep" />
            <button
              ref={saveBtnRef}
              className={`tu-input-toolbar-btn${saveMenuOpen ? ' tu-input-toolbar-btn--active' : ''}`}
              onClick={toggleSaveMenu}
              title="Save output as file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Save As</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </>
        )}
        <div className="tu-input-toolbar-sep" />
        <button
          className="tu-input-toolbar-btn"
          onClick={handleShare}
          disabled={isSharing}
          title="Generate shareable link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>{isSharing ? 'Sharing...' : 'Share'}</span>
        </button>
      </div>
      {saveMenu}
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
            mdPreview || (activeTool?.type === 'ai' && hasMarkdown(aiResult.result))
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
