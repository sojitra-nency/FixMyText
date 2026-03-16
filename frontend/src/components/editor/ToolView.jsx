import { useState } from 'react'

export default function ToolView({ tool, text, loading, aiState, onExecute }) {
  const [selectVal, setSelectVal] = useState(
    tool.type === 'select' && aiState?.[tool.selectKey] ? aiState[tool.selectKey] : tool.options?.[0]?.[0] || ''
  )

  const handleRun = () => {
    if (tool.type === 'select' && tool.setterKey && aiState?.[tool.setterKey]) {
      aiState[tool.setterKey](selectVal)
      setTimeout(() => onExecute(tool), 10)
    } else {
      onExecute(tool)
    }
  }

  return (
    <div className="tu-tool-bar">
      <span className="tu-tool-bar-icon">{tool.icon}</span>
      <span className="tu-tool-bar-name">{tool.label}</span>
      <span className="tu-tool-bar-desc">{tool.description}</span>

      {tool.type === 'select' && tool.options && (
        <div className="tu-tool-bar-options">
          {tool.options.map(([val, label]) => (
            <button
              key={val}
              className={`tu-tool-bar-chip${selectVal === val ? ' tu-tool-bar-chip--active' : ''}`}
              onClick={() => setSelectVal(val)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="tu-tool-bar-spacer" />

      <button
        className="tu-tool-bar-run"
        onClick={handleRun}
        disabled={!text || loading}
      >
        {loading ? (
          <>
            <div className="tu-spinner" style={{ width: 12, height: 12 }} />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Run</span>
          </>
        )}
      </button>
    </div>
  )
}
