import { useState, useRef, useCallback, useMemo, memo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { USE_CASE_TABS } from '../constants/tools'

function ToolPanelItem({ tool, disabled, onClick, isDiscovered, isFavorite, onToggleFavorite, isActive, ai, onHover, onLeave }) {
  const [selectVal, setSelectVal] = useState(tool.options?.[0]?.[0] || '')
  const [hovered, setHovered] = useState(false)
  const isDisabled = disabled && tool.type !== 'drawer' && tool.type !== 'action'
  const itemRef = useRef(null)

  const handleClick = () => {
    if (isDisabled) return
    if (tool.type === 'select') {
      if (ai && tool.setterKey && ai[tool.setterKey]) ai[tool.setterKey](selectVal)
      setTimeout(() => onClick(), 10)
      return
    }
    onClick()
  }

  const handleMouseEnter = () => {
    setHovered(true)
    if (tool.description && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      onHover(tool.description, rect)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    onLeave()
  }

  return (
    <div
      ref={itemRef}
      className={`tu-titem-wrap${hovered ? ' tu-titem-wrap--hover' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`tu-titem${isActive ? ' tu-titem--active' : ''}${isDisabled ? ' tu-titem--disabled' : ''}`}
        onClick={handleClick}
      >
        <span className={`tu-titem-icon tu-titem-icon--${tool.color}`}>{tool.icon}</span>
        <span className="tu-titem-name">{tool.label}</span>
        {!isDiscovered && (tool.tabs?.includes('ai') || tool.tabs?.includes('code')) && <span className="tu-titem-new">NEW</span>}
        {tool.type === 'select' && (
          <select
            className="tu-titem-select"
            value={selectVal}
            onChange={e => { e.stopPropagation(); setSelectVal(e.target.value) }}
            onClick={e => e.stopPropagation()}
            disabled={disabled}
          >
            {(tool.options || []).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        )}
        <button
          className={`tu-titem-fav${isFavorite ? ' tu-titem-fav--active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite?.(tool.id) }}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
}

export default memo(function ToolPanel({
  tools, activeTab, onTabChange, onToolClick,
  disabled, gamification, activePanel, ai,
  hideTabs,
}) {
  const [tooltip, setTooltip] = useState(null)

  const handleHover = useCallback((text, rect) => {
    const tooltipWidth = 280
    const tooltipHeight = 40
    const gap = 8

    // Position to the right of the sidebar item
    let left = rect.right + gap
    // If it would overflow right edge, show to the left of the item
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.left - tooltipWidth - gap
    }

    // Vertical: center on item, but clamp within viewport
    let top = rect.top + rect.height / 2
    top = Math.max(tooltipHeight / 2 + 4, top)
    top = Math.min(window.innerHeight - tooltipHeight / 2 - 4, top)

    setTooltip({ text, top, left })
  }, [])

  const handleLeave = useCallback(() => setTooltip(null), [])

  const filteredTools = useMemo(() => {
    if (activeTab === 'popular') {
      const usage = gamification?.toolsUsed || {}
      return [...tools].sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0))
    }
    return tools.filter(t => t.tabs?.includes(activeTab))
  }, [tools, activeTab, gamification?.toolsUsed])

  return (
    <div className="tu-tpanel">
      {!hideTabs && (
        <div className="tu-tpanel-tabs">
          {USE_CASE_TABS.map(tab => (
            <button
              key={tab.id}
              className={`tu-tpanel-tab${activeTab === tab.id ? ' tu-tpanel-tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
            >
              <span className="tu-tpanel-tab-icon">{tab.icon}</span>
              <span className="tu-tpanel-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="tu-tpanel-list">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {filteredTools.map(tool => (
              <ToolPanelItem
                key={tool.id}
                tool={tool}
                disabled={disabled}
                onClick={() => onToolClick(tool)}
                isDiscovered={gamification?.discoveredTools?.includes(tool.id)}
                isFavorite={gamification?.favorites?.includes(tool.id)}
                onToggleFavorite={gamification?.toggleFavorite}
                isActive={tool.type === 'drawer' && activePanel === tool.panelId}
                ai={ai}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Portal tooltip — escapes all overflow:hidden containers */}
      {tooltip && createPortal(
        <div
          className="tu-titem-tooltip"
          style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </div>
  )
})
