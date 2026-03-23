import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    formatShortcut, eventToBinding, detectConflicts,
    DEFAULT_SHORTCUT_GROUPS,
} from '../../hooks/useKeyboardShortcuts'

function ShortcutRow({ sc, isCustomized, onStartRecording, onReset, recording, conflict }) {
    return (
        <div className={`tu-shortcuts-row${recording ? ' tu-shortcuts-row--recording' : ''}${conflict ? ' tu-shortcuts-row--conflict' : ''}`}>
            <span className="tu-shortcuts-label">
                {sc.label}
                {isCustomized && !recording && <span className="tu-shortcuts-edited" title="Customized">*</span>}
            </span>
            <span className="tu-shortcuts-actions">
                {recording ? (
                    <span className="tu-shortcuts-recording">
                        <span className="tu-shortcuts-recording-dot" />
                        Press keys...
                    </span>
                ) : (
                    <>
                        <button
                            className="tu-shortcuts-keys tu-shortcuts-keys--btn"
                            onClick={() => onStartRecording(sc.id)}
                            title="Click to rebind"
                        >
                            {formatShortcut(sc).map((part, i) => (
                                <kbd key={i}>{part}</kbd>
                            ))}
                        </button>
                        {isCustomized && (
                            <button
                                className="tu-shortcuts-reset-one"
                                onClick={() => onReset(sc.id)}
                                title="Reset to default"
                            >
                                ↺
                            </button>
                        )}
                    </>
                )}
            </span>
            {conflict && (
                <div className="tu-shortcuts-conflict">
                    Conflicts with "{conflict.label}"
                </div>
            )}
        </div>
    )
}

export default function KeyboardShortcuts({
    isOpen, onClose,
    groups, overrides,
    updateBinding, resetAll, resetOne, isCustomized,
}) {
    const panelRef = useRef(null)
    const [recordingId, setRecordingId] = useState(null)
    const [pendingBinding, setPendingBinding] = useState(null)
    const [conflict, setConflict] = useState(null)

    useEffect(() => {
        if (isOpen && panelRef.current) panelRef.current.focus()
        if (!isOpen) {
            setRecordingId(null)
            setPendingBinding(null)
            setConflict(null)
        }
    }, [isOpen])

    const startRecording = useCallback((id) => {
        setRecordingId(id)
        setPendingBinding(null)
        setConflict(null)
    }, [])

    const cancelRecording = useCallback(() => {
        setRecordingId(null)
        setPendingBinding(null)
        setConflict(null)
    }, [])

    // Listen for key presses while recording
    useEffect(() => {
        if (!recordingId) return

        const handler = (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Escape cancels recording
            if (e.key === 'Escape') {
                cancelRecording()
                return
            }

            const binding = eventToBinding(e)
            if (!binding) return // bare modifier

            // Require at least one modifier for non-special keys
            const specialKeys = ['Escape', 'Enter', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5',
                'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
            if (!binding.ctrl && !binding.shift && !binding.alt && !specialKeys.includes(binding.keys)) {
                return // ignore bare letter/number presses
            }

            // Check for conflicts
            const conflicts = detectConflicts(groups, recordingId, binding)
            if (conflicts.length > 0) {
                setPendingBinding(binding)
                setConflict(conflicts[0])
                return
            }

            // Apply immediately if no conflict
            updateBinding(recordingId, binding)
            setRecordingId(null)
            setPendingBinding(null)
            setConflict(null)
        }

        window.addEventListener('keydown', handler, true)
        return () => window.removeEventListener('keydown', handler, true)
    }, [recordingId, groups, updateBinding, cancelRecording])

    const confirmOverride = useCallback(() => {
        if (pendingBinding && recordingId) {
            updateBinding(recordingId, pendingBinding)
        }
        setRecordingId(null)
        setPendingBinding(null)
        setConflict(null)
    }, [pendingBinding, recordingId, updateBinding])

    const hasAnyCustom = Object.keys(overrides || {}).length > 0

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="tu-shortcuts-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        ref={panelRef}
                        className="tu-shortcuts"
                        tabIndex={-1}
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => {
                            if (e.key === 'Escape' && !recordingId) onClose()
                        }}
                    >
                        <div className="tu-shortcuts-header">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M6 8h.001" /><path d="M10 8h.001" /><path d="M14 8h.001" />
                                <path d="M18 8h.001" /><path d="M6 12h.001" /><path d="M18 12h.001" />
                                <path d="M8 16h8" />
                            </svg>
                            <span>Keyboard Shortcuts</span>
                            {hasAnyCustom && (
                                <button
                                    className="tu-shortcuts-reset-all"
                                    onClick={resetAll}
                                    title="Reset all to defaults"
                                >
                                    Reset All
                                </button>
                            )}
                            <button className="tu-shortcuts-close" onClick={onClose}>✕</button>
                        </div>

                        <div className="tu-shortcuts-body">
                            {(groups || DEFAULT_SHORTCUT_GROUPS).map(group => (
                                <div key={group.group} className="tu-shortcuts-group">
                                    <h3 className="tu-shortcuts-group-title">{group.group}</h3>
                                    <div className="tu-shortcuts-list">
                                        {group.shortcuts.map(sc => (
                                            <ShortcutRow
                                                key={sc.id}
                                                sc={sc}
                                                isCustomized={isCustomized?.(sc.id)}
                                                recording={recordingId === sc.id}
                                                conflict={recordingId === sc.id ? conflict : null}
                                                onStartRecording={startRecording}
                                                onReset={resetOne}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Conflict confirmation bar */}
                        <AnimatePresence>
                            {conflict && pendingBinding && (
                                <motion.div
                                    className="tu-shortcuts-conflict-bar"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <span className="tu-shortcuts-conflict-msg">
                                        <b>{formatShortcut(pendingBinding).join(' + ')}</b> is already used by "<b>{conflict.label}</b>"
                                    </span>
                                    <button className="tu-shortcuts-conflict-btn tu-shortcuts-conflict-btn--cancel" onClick={cancelRecording}>
                                        Cancel
                                    </button>
                                    <button className="tu-shortcuts-conflict-btn tu-shortcuts-conflict-btn--override" onClick={confirmOverride}>
                                        Override
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="tu-shortcuts-footer">
                            Click a shortcut to rebind &middot; Press <kbd>Esc</kbd> to cancel &middot; <kbd>Ctrl</kbd><kbd>/</kbd> to toggle
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
