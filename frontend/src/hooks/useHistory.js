import { useState, useCallback, useRef } from 'react'

const MAX_HISTORY = 50

export default function useHistory(setText, showAlert) {
    const [history, setHistory] = useState([])
    const undoIndexRef = useRef(-1)

    const pushHistory = useCallback((operation, original, result) => {
        setHistory(prev => {
            const entry = { operation, original, result, timestamp: Date.now() }
            const next = [...prev, entry]
            undoIndexRef.current = next.length - 1
            return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
        })
    }, [])

    const handleRestoreOriginal = (idx) => {
        setText(history[idx].original)
        showAlert(`Restored original from "${history[idx].operation}"`, 'success')
    }

    const handleRestoreResult = (idx) => {
        setText(history[idx].result)
        showAlert(`Restored result of "${history[idx].operation}"`, 'success')
    }

    const handleUndo = useCallback(() => {
        if (history.length === 0) return
        // Find current position — defaults to latest entry
        const idx = undoIndexRef.current >= 0 && undoIndexRef.current < history.length
            ? undoIndexRef.current
            : history.length - 1
        const entry = history[idx]
        if (!entry) return
        setText(entry.original)
        undoIndexRef.current = idx - 1
        showAlert(`Undo: "${entry.operation}"`, 'success')
    }, [history, setText, showAlert])

    const handleRedo = useCallback(() => {
        const nextIdx = undoIndexRef.current + 1
        if (nextIdx < 0 || nextIdx >= history.length) return
        const entry = history[nextIdx]
        if (!entry) return
        setText(entry.result)
        undoIndexRef.current = nextIdx
        showAlert(`Redo: "${entry.operation}"`, 'success')
    }, [history, setText, showAlert])

    const handleClearHistory = () => {
        setHistory([])
        undoIndexRef.current = -1
        showAlert('History cleared', 'success')
    }

    return {
        history, pushHistory,
        handleRestoreOriginal, handleRestoreResult, handleClearHistory,
        handleUndo, handleRedo,
    }
}
