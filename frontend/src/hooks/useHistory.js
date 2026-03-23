import { useState, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useRecordOperationMutation, useClearHistoryMutation } from '../store/api/historyApi'

const MAX_HISTORY = 50
const PREVIEW_MAX = 500

export default function useHistory(setText, showAlert) {
    const [history, setHistory] = useState([])
    const undoIndexRef = useRef(-1)
    const { accessToken } = useSelector((s) => s.auth)
    const [recordOperation] = useRecordOperationMutation()
    const [clearHistoryApi] = useClearHistoryMutation()

    const pushHistory = useCallback((operation, original, result, toolMeta = {}) => {
        const entry = { operation, original, result, timestamp: Date.now() }
        setHistory(prev => {
            const next = [...prev, entry]
            undoIndexRef.current = next.length - 1
            return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
        })

        // Persist to backend if authenticated (fire-and-forget)
        if (accessToken) {
            recordOperation({
                tool_id: toolMeta.toolId || operation.toLowerCase().replace(/\s+/g, '_'),
                tool_label: operation,
                tool_type: toolMeta.toolType || 'api',
                input_preview: (original || '').slice(0, PREVIEW_MAX),
                output_preview: (result || '').slice(0, PREVIEW_MAX),
                input_length: (original || '').length,
                output_length: (result || '').length,
                status: 'success',
            }).unwrap().catch(() => {
                // Silently fail — local history already captured
            })
        }
    }, [accessToken, recordOperation])

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
        // Also clear server-side history if authenticated
        if (accessToken) {
            clearHistoryApi().unwrap().catch(() => {})
        }
        showAlert('History cleared', 'success')
    }

    return {
        history, pushHistory,
        handleRestoreOriginal, handleRestoreResult, handleClearHistory,
        handleUndo, handleRedo,
    }
}
