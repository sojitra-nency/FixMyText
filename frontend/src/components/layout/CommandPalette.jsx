import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommandPalette({ search, onToolClick }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)
  const results = search.results || []

  useEffect(() => {
    if (search.isOpen && inputRef.current) inputRef.current.focus()
  }, [search.isOpen])

  useEffect(() => { setActiveIdx(0) }, [results.length])

  const handleSelect = (tool) => {
    onToolClick(tool)
    search.close()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); search.close() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i + 1) % Math.max(results.length, 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => (i - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[activeIdx]) handleSelect(results[activeIdx]) }
  }

  return (
    <AnimatePresence>
      {search.isOpen && (
        <motion.div
          className="tu-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={search.close}
        >
          <motion.div
            className="tu-palette"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <input
              ref={inputRef}
              className="tu-palette-input"
              type="text"
              placeholder="What do you want to do with your text?"
              value={search.query}
              onChange={e => search.setQuery(e.target.value)}
            />

            <div className="tu-palette-results">
              {results.length === 0 && search.query && (
                <div className="tu-palette-empty">No tools found for "{search.query}"</div>
              )}
              {results.map((tool, i) => (
                <motion.button
                  key={tool.id}
                  className={`tu-palette-item${i === activeIdx ? ' tu-palette-item--active' : ''}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <span className={`tu-palette-item-icon tu-tool-card--${tool.color} tu-tool-card-icon`}
                    style={{ background: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                    {tool.icon}
                  </span>
                  <div className="tu-palette-item-text">
                    <span className="tu-palette-item-name">{tool.label}</span>
                    <span className="tu-palette-item-desc">{tool.description}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="tu-palette-hint">
              ↑↓ Navigate &middot; Enter Select &middot; Esc Close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
