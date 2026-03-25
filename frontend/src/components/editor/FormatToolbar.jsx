import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { createPortal } from 'react-dom'

const FORMATS = [
  { key: 'bold',          label: 'Bold',          kbd: 'B', wrap: ['**', '**'] },
  { key: 'italic',        label: 'Italic',        kbd: 'I', wrap: ['_', '_'] },
  { key: 'strikethrough', label: 'Strikethrough',  kbd: 'S', wrap: ['~~', '~~'] },
  { key: 'code',          label: 'Code',           kbd: '<>', wrap: ['`', '`'] },
  { key: 'quote',         label: 'Quote',          kbd: '❝', prefix: '> ' },
  { key: 'heading',       label: 'Heading',        kbd: 'H', prefix: '# ' },
  { key: 'bullet',        label: 'Bullet List',    kbd: '•', prefix: '- ' },
  { key: 'number',        label: 'Numbered List',  kbd: '1.', prefix: '1. ' },
  { key: 'link',          label: 'Link',           kbd: '🔗', wrap: ['[', '](url)'] },
]

function FormatToolbarPopup({ pos, onFormat, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return createPortal(
    <div
      ref={ref}
      className="tu-fmt-toolbar"
      style={{ top: pos.top, left: pos.left }}
    >
      {FORMATS.map((fmt, i) => (
        <span key={fmt.key} className="tu-fmt-toolbar-group">
          {/* Dividers between groups: bold/italic/strike | code/quote | heading/bullet/number | link */}
          {(i === 3 || i === 5 || i === 8) && <span className="tu-fmt-toolbar-sep" />}
          <button
            className="tu-fmt-toolbar-btn"
            onClick={() => onFormat(fmt)}
            title={fmt.label}
          >
            <span className="tu-fmt-toolbar-kbd">{fmt.kbd}</span>
          </button>
        </span>
      ))}
    </div>,
    document.body
  )
}

/**
 * FormatToolbar — Slack-style floating formatting toolbar for textareas.
 * Shows when user selects text. Applies markdown-style formatting.
 *
 * Props:
 *  - textareaRef: ref to the <textarea> element
 *  - text: current text value
 *  - setText: state setter for text
 *  - enabled: whether to show (false for encoding/hashing tools)
 */
export default memo(function FormatToolbar({ textareaRef, text, setText, enabled }) {
  const [selection, setSelection] = useState(null) // { start, end, top, left }

  const checkSelection = useCallback(() => {
    const el = textareaRef?.current
    if (!el || !enabled) { setSelection(null); return }

    const { selectionStart, selectionEnd } = el
    if (selectionStart === selectionEnd) { setSelection(null); return }

    // Get position for the toolbar
    // Use textarea's bounding rect + approximate character position
    const rect = el.getBoundingClientRect()
    const textBefore = text.slice(0, selectionStart)
    const linesBefore = textBefore.split('\n')
    const lineIndex = linesBefore.length - 1

    // Approximate position — center above selection
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    const scrollTop = el.scrollTop
    const top = rect.top + (lineIndex * lineHeight) - scrollTop - 40
    const left = Math.max(rect.left + 20, Math.min(rect.right - 300, rect.left + (rect.width / 2) - 150))

    setSelection({
      start: selectionStart,
      end: selectionEnd,
      top: Math.max(4, top),
      left: Math.max(4, left),
    })
  }, [textareaRef, text, enabled])

  useEffect(() => {
    const el = textareaRef?.current
    if (!el || !enabled) return

    const handleSelect = () => setTimeout(checkSelection, 10)
    const handleBlur = () => setTimeout(() => setSelection(null), 200)

    el.addEventListener('select', handleSelect)
    el.addEventListener('mouseup', handleSelect)
    el.addEventListener('keyup', handleSelect)
    el.addEventListener('blur', handleBlur)

    return () => {
      el.removeEventListener('select', handleSelect)
      el.removeEventListener('mouseup', handleSelect)
      el.removeEventListener('keyup', handleSelect)
      el.removeEventListener('blur', handleBlur)
    }
  }, [textareaRef, enabled, checkSelection])

  const handleFormat = useCallback((fmt) => {
    if (!selection) return
    const el = textareaRef?.current
    if (!el) return

    const { start, end } = selection
    const selected = text.slice(start, end)

    let newText, cursorPos
    if (fmt.wrap) {
      // Wrap selection: **selected** or `selected`
      const [before, after] = fmt.wrap
      newText = text.slice(0, start) + before + selected + after + text.slice(end)
      cursorPos = end + before.length + after.length
    } else if (fmt.prefix) {
      // Prefix each line of selection
      const lines = selected.split('\n')
      const formatted = lines.map((line, i) => {
        if (fmt.key === 'number') return `${i + 1}. ${line}`
        return fmt.prefix + line
      }).join('\n')
      newText = text.slice(0, start) + formatted + text.slice(end)
      cursorPos = start + formatted.length
    }

    setText(newText)
    setSelection(null)

    // Restore focus and cursor
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorPos, cursorPos)
    })
  }, [selection, text, setText, textareaRef])

  const handleClose = useCallback(() => setSelection(null), [])

  if (!selection || !enabled) return null

  return (
    <FormatToolbarPopup
      pos={{ top: selection.top, left: selection.left }}
      onFormat={handleFormat}
      onClose={handleClose}
    />
  )
})
