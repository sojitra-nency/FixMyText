import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { USE_CASE_TABS, TOOL_GROUPS } from '../../constants/tools'
import ToolIcon from './ToolIcon'

/* ── Custom dropdown for select-type tools ─────────── */
function SelectDropdown({ options, value, onChange, disabled, triggerRef }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)

  const selectedLabel = options.find(([v]) => v === value)?.[1] || value

  const toggle = (e) => {
    e.stopPropagation()
    if (disabled) return
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const menuHeight = Math.min(options.length * 30 + 10, 240)
      const spaceBelow = window.innerHeight - rect.bottom - 8
      const showAbove = spaceBelow < menuHeight && rect.top > menuHeight

      setPos({
        left: rect.left,
        width: Math.max(rect.width, 160),
        top: showAbove ? rect.top - menuHeight - 2 : rect.bottom + 2,
      })
    }
    setOpen(o => !o)
  }

  const select = (val, e) => {
    e.stopPropagation()
    onChange(val)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <>
      <button
        className={`tu-titem-dropdown-trigger${open ? ' tu-titem-dropdown-trigger--open' : ''}`}
        onClick={toggle}
        disabled={disabled}
        type="button"
      >
        <span className="tu-titem-dropdown-value">{selectedLabel}</span>
        <span className="tu-titem-dropdown-chevron">{open ? '▴' : '▾'}</span>
      </button>
      {open && pos && createPortal(
        <div
          ref={menuRef}
          className="tu-titem-dropdown-menu"
          style={{ left: pos.left, top: pos.top, width: pos.width }}
        >
          {options.map(([val, label]) => (
            <div
              key={val}
              className={`tu-titem-dropdown-option${val === value ? ' tu-titem-dropdown-option--active' : ''}`}
              onClick={(e) => select(val, e)}
            >
              {val === value && <span className="tu-titem-dropdown-check">✓</span>}
              <span>{label}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}

function ToolPanelItem({ tool, disabled, onClick, isFavorite, onToggleFavorite, isActive, isSuggested, ai, onHover, onLeave }) {
  const [selectVal, setSelectVal] = useState(tool.options?.[0]?.[0] || '')
  const [hovered, setHovered] = useState(false)
  const isDisabled = disabled && tool.type !== 'drawer' && tool.type !== 'action'
  const itemRef = useRef(null)
  const isSelect = tool.type === 'select'

  const handleClick = () => {
    if (isDisabled) return
    if (isSelect) {
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
        <ToolIcon icon={tool.icon} color={tool.color} toolId={tool.id} />
        <span className="tu-titem-name">{tool.label}</span>
        {isSelect && (
          <SelectDropdown
            options={tool.options || []}
            value={selectVal}
            onChange={setSelectVal}
            disabled={disabled}
            triggerRef={itemRef}
          />
        )}
        {isSuggested && <span className="tu-titem-suggested">suggested</span>}
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

/* ── Collapsible group header (VSCode Source Control style) ── */
function GroupHeader({ label, count, collapsed, onToggle }) {
  return (
    <button className={`tu-group-header${collapsed ? ' tu-group-header--collapsed' : ''}`} onClick={onToggle}>
      <svg className="tu-group-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span className="tu-group-label">{label}</span>
      <span className="tu-group-count">{count}</span>
    </button>
  )
}

export default memo(function ToolPanel({
  tools, activeTab, onTabChange, onToolClick,
  disabled, gamification, activePanel, ai,
  hideTabs, suggestedToolIds = [],
}) {
  const [tooltip, setTooltip] = useState(null)
  const [collapsedGroups, setCollapsedGroups] = useState({})

  const toggleGroup = useCallback((groupId) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }, [])

  const handleHover = useCallback((text, rect) => {
    const tooltipWidth = 280
    const tooltipHeight = 40
    const gap = 8

    let left = rect.right + gap
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.left - tooltipWidth - gap
    }

    let top = rect.top + rect.height / 2
    top = Math.max(tooltipHeight / 2 + 4, top)
    top = Math.min(window.innerHeight - tooltipHeight / 2 - 4, top)

    setTooltip({ text, top, left })
  }, [])

  const handleLeave = useCallback(() => setTooltip(null), [])

  // Count tools per tab
  const tabCounts = useMemo(() => {
    const counts = { all: tools.length, popular: tools.length }
    for (const tab of USE_CASE_TABS) {
      if (!counts[tab.id]) {
        counts[tab.id] = tools.filter(t => t.tabs?.includes(tab.id)).length
      }
    }
    return counts
  }, [tools])

  // Filter tools by active tab
  const filteredTools = useMemo(() => {
    if (activeTab === 'all') return [...tools].sort((a, b) => a.label.localeCompare(b.label))
    if (activeTab === 'popular') {
      const suggested = new Set(suggestedToolIds)
      const usage = gamification?.toolsUsed || {}
      return [...tools].sort((a, b) => {
        const aSug = suggested.has(a.id) ? 1 : 0
        const bSug = suggested.has(b.id) ? 1 : 0
        if (aSug !== bSug) return bSug - aSug
        return (usage[b.id] || 0) - (usage[a.id] || 0)
      })
    }
    return tools.filter(t => t.tabs?.includes(activeTab))
  }, [tools, activeTab, gamification?.toolsUsed, suggestedToolIds])

  // Group tools — each group contains tools sorted alphabetically
  const groupedTools = useMemo(() => {
    const groups = []
    const groupMap = {}

    for (const tool of filteredTools) {
      const gid = tool.group || 'other'
      if (!groupMap[gid]) {
        groupMap[gid] = []
      }
      groupMap[gid].push(tool)
    }

    // Sort each group's tools alphabetically
    for (const gid of Object.keys(groupMap)) {
      groupMap[gid].sort((a, b) => a.label.localeCompare(b.label))
    }

    // Maintain TOOL_GROUPS order, then add any ungrouped
    for (const g of TOOL_GROUPS) {
      if (groupMap[g.id]?.length > 0) {
        groups.push({ id: g.id, label: g.label, tools: groupMap[g.id] })
        delete groupMap[g.id]
      }
    }
    // Any remaining groups not in TOOL_GROUPS
    for (const [gid, gTools] of Object.entries(groupMap)) {
      if (gTools.length > 0) {
        groups.push({ id: gid, label: gid.charAt(0).toUpperCase() + gid.slice(1), tools: gTools })
      }
    }

    return groups
  }, [filteredTools])

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
              <span className="tu-tpanel-tab-count">{tabCounts[tab.id] || 0}</span>
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
            {groupedTools.map(group => (
              <div key={group.id} className="tu-group">
                <GroupHeader
                  label={group.label}
                  count={group.tools.length}
                  collapsed={!!collapsedGroups[group.id]}
                  onToggle={() => toggleGroup(group.id)}
                />
                {!collapsedGroups[group.id] && (
                  <div className="tu-group-items">
                    {group.tools.map(tool => (
                      <ToolPanelItem
                        key={tool.id}
                        tool={tool}
                        disabled={disabled}
                        onClick={() => onToolClick(tool)}
                        isFavorite={gamification?.favorites?.includes(tool.id)}
                        onToggleFavorite={gamification?.toggleFavorite}
                        isActive={tool.type === 'drawer' && activePanel === tool.panelId}
                        isSuggested={suggestedToolIds.includes(tool.id)}
                        ai={ai}
                        onHover={handleHover}
                        onLeave={handleLeave}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Portal tooltip */}
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
