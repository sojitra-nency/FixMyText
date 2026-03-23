import { useEffect, useCallback, useState, useMemo } from 'react'
import { TOOLS } from '../constants/tools'

/* ═══════════════════════════════════════════════════════
   useKeyboardShortcuts — Customizable power-user hotkeys
   ═══════════════════════════════════════════════════════ */

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
const MOD = isMac ? 'metaKey' : 'ctrlKey'
const STORAGE_KEY = 'fmx_keybindings'

// ── Default shortcut definitions ──────────────────────

export const DEFAULT_SHORTCUT_GROUPS = [
    {
        group: 'General',
        shortcuts: [
            { keys: 'k', ctrl: true, label: 'Command Palette', id: 'palette' },
            { keys: 'b', ctrl: true, label: 'Toggle Sidebar', id: 'toggle_sidebar' },
            { keys: '/', ctrl: true, label: 'Keyboard Shortcuts', id: 'show_shortcuts' },
            { keys: ',', ctrl: true, label: 'Settings', id: 'settings' },
            { keys: 'Escape', label: 'Close Panel / Modal', id: 'escape' },
        ],
    },
    {
        group: 'Editor',
        shortcuts: [
            { keys: 'Enter', ctrl: true, label: 'Run Active Tool', id: 'run_tool' },
            { keys: 's', ctrl: true, label: 'Save to Template', id: 'save_template' },
            { keys: 'w', ctrl: true, label: 'Close Active Tab', id: 'close_tab' },
            { keys: 'x', ctrl: true, shift: true, label: 'Clear Text', id: 'clear_text' },
            { keys: 'z', alt: true, label: 'Undo (History)', id: 'undo' },
            { keys: 'z', alt: true, shift: true, label: 'Redo (History)', id: 'redo' },
        ],
    },
    {
        group: 'Clipboard',
        shortcuts: [
            { keys: 'c', ctrl: true, shift: true, label: 'Copy Output', id: 'copy_output' },
            { keys: 'v', ctrl: true, shift: true, label: 'Clear + Paste', id: 'clear_paste' },
        ],
    },
    {
        group: 'Navigation',
        shortcuts: [
            { keys: '1', alt: true, label: 'Go to Tab 1', id: 'tab_1' },
            { keys: '2', alt: true, label: 'Go to Tab 2', id: 'tab_2' },
            { keys: '3', alt: true, label: 'Go to Tab 3', id: 'tab_3' },
            { keys: '4', alt: true, label: 'Go to Tab 4', id: 'tab_4' },
            { keys: '5', alt: true, label: 'Go to Tab 5', id: 'tab_5' },
            { keys: '6', alt: true, label: 'Go to Tab 6', id: 'tab_6' },
            { keys: '7', alt: true, label: 'Go to Tab 7', id: 'tab_7' },
            { keys: '8', alt: true, label: 'Go to Tab 8', id: 'tab_8' },
            { keys: '9', alt: true, label: 'Go to Tab 9 (last)', id: 'tab_9' },
            { keys: '[', ctrl: true, label: 'Previous Tab', id: 'prev_tab' },
            { keys: ']', ctrl: true, label: 'Next Tab', id: 'next_tab' },
        ],
    },
    {
        group: 'Quick Tools',
        shortcuts: [
            { keys: 'u', ctrl: true, shift: true, label: 'UPPERCASE', id: 'tool_uppercase' },
            { keys: 'l', ctrl: true, shift: true, label: 'lowercase', id: 'tool_lowercase' },
            { keys: 'g', ctrl: true, shift: true, label: 'Fix Grammar', id: 'tool_fix_grammar' },
            { keys: 'p', ctrl: true, shift: true, label: 'Paraphrase', id: 'tool_paraphrase' },
            { keys: 'e', ctrl: true, shift: true, label: 'Summarize', id: 'tool_summarize' },
            { keys: 'h', ctrl: true, shift: true, label: 'Find & Replace', id: 'tool_find_replace' },
            { keys: 'j', ctrl: true, shift: true, label: 'Format JSON', id: 'tool_json_fmt' },
            { keys: 't', ctrl: true, shift: true, label: 'Title Case', id: 'tool_title_case' },
        ],
    },
]

// ── Persistence helpers ───────────────────────────────

function loadCustomBindings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch { return {} }
}

function saveCustomBindings(overrides) {
    try {
        if (Object.keys(overrides).length === 0) {
            localStorage.removeItem(STORAGE_KEY)
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
        }
    } catch { /* storage full / unavailable */ }
}

// Merge defaults with overrides: { [id]: { keys, ctrl?, shift?, alt? } }
function mergeBindings(defaults, overrides) {
    return defaults.map(group => ({
        ...group,
        shortcuts: group.shortcuts.map(sc => {
            const ov = overrides[sc.id]
            if (!ov) return sc
            return {
                ...sc,
                keys: ov.keys,
                ctrl: ov.ctrl || false,
                shift: ov.shift || false,
                alt: ov.alt || false,
            }
        }),
    }))
}

// ── Matching ──────────────────────────────────────────

function matchShortcut(e, sc) {
    const mod   = sc.ctrl  ? e[MOD]      : !e[MOD]
    const shift = sc.shift ? e.shiftKey  : !e.shiftKey
    const alt   = sc.alt   ? e.altKey    : !e.altKey
    const key   = e.key.toLowerCase() === sc.keys.toLowerCase()
    return mod && shift && alt && key
}

// ── Conflict detection ────────────────────────────────

function bindingKey(sc) {
    const parts = []
    if (sc.ctrl)  parts.push('ctrl')
    if (sc.shift) parts.push('shift')
    if (sc.alt)   parts.push('alt')
    parts.push(sc.keys.toLowerCase())
    return parts.join('+')
}

export function detectConflicts(groups, editingId, candidate) {
    const candidateKey = bindingKey(candidate)
    const conflicts = []
    for (const g of groups) {
        for (const sc of g.shortcuts) {
            if (sc.id === editingId) continue
            if (bindingKey(sc) === candidateKey) {
                conflicts.push(sc)
            }
        }
    }
    return conflicts
}

// ── Hook ──────────────────────────────────────────────

export default function useKeyboardShortcuts(actions) {
    const [shortcutsOpen, setShortcutsOpen] = useState(false)
    const [overrides, setOverrides] = useState(loadCustomBindings)

    const groups = useMemo(
        () => mergeBindings(DEFAULT_SHORTCUT_GROUPS, overrides),
        [overrides]
    )

    const allShortcuts = useMemo(
        () => groups.flatMap(g => g.shortcuts.map(sc => ({ ...sc, group: g.group }))),
        [groups]
    )

    // Persist override for a single shortcut
    const updateBinding = useCallback((id, binding) => {
        setOverrides(prev => {
            // Find the default to compare
            const defaultSc = DEFAULT_SHORTCUT_GROUPS
                .flatMap(g => g.shortcuts)
                .find(s => s.id === id)

            const isDefault = defaultSc &&
                binding.keys.toLowerCase() === defaultSc.keys.toLowerCase() &&
                !!binding.ctrl === !!defaultSc.ctrl &&
                !!binding.shift === !!defaultSc.shift &&
                !!binding.alt === !!defaultSc.alt

            const next = { ...prev }
            if (isDefault) {
                delete next[id]
            } else {
                next[id] = {
                    keys: binding.keys,
                    ctrl: binding.ctrl || false,
                    shift: binding.shift || false,
                    alt: binding.alt || false,
                }
            }
            saveCustomBindings(next)
            return next
        })
    }, [])

    const resetAll = useCallback(() => {
        setOverrides({})
        saveCustomBindings({})
    }, [])

    const resetOne = useCallback((id) => {
        setOverrides(prev => {
            const next = { ...prev }
            delete next[id]
            saveCustomBindings(next)
            return next
        })
    }, [])

    // Check if a shortcut has been customized
    const isCustomized = useCallback((id) => id in overrides, [overrides])

    const handleKeyDown = useCallback((e) => {
        const tag = e.target.tagName
        const isInput = tag === 'INPUT' || tag === 'SELECT'
        const isTextarea = tag === 'TEXTAREA'
        const hasModifier = e[MOD] || e.altKey

        if (!hasModifier && e.key !== 'Escape') {
            if (isInput || isTextarea) return
        }

        for (const sc of allShortcuts) {
            if (!matchShortcut(e, sc)) continue

            e.preventDefault()
            e.stopPropagation()

            switch (sc.id) {
                // General
                case 'palette':        actions.openPalette?.(); break
                case 'toggle_sidebar': actions.toggleSidebar?.(); break
                case 'show_shortcuts': setShortcutsOpen(o => !o); break
                case 'settings':       actions.toggleSettings?.(); break
                case 'escape':
                    if (shortcutsOpen) { setShortcutsOpen(false); break }
                    actions.onEscape?.()
                    break

                // Editor
                case 'run_tool':      actions.runActiveTool?.(); break
                case 'save_template': actions.saveTemplate?.(); break
                case 'close_tab':     actions.closeActiveTab?.(); break
                case 'clear_text':    actions.clearText?.(); break
                case 'undo':          actions.undo?.(); break
                case 'redo':          actions.redo?.(); break

                // Clipboard
                case 'copy_output':   actions.copyOutput?.(); break
                case 'clear_paste':   actions.clearPaste?.(); break

                // Tab navigation
                case 'tab_1': case 'tab_2': case 'tab_3': case 'tab_4':
                case 'tab_5': case 'tab_6': case 'tab_7': case 'tab_8':
                case 'tab_9': {
                    const idx = parseInt(sc.keys) - 1
                    actions.goToTab?.(idx)
                    break
                }
                case 'next_tab': actions.nextTab?.(); break
                case 'prev_tab': actions.prevTab?.(); break

                // Quick tools
                default:
                    if (sc.id.startsWith('tool_')) {
                        const toolId = sc.id.replace('tool_', '')
                        const tool = TOOLS.find(t => t.id === toolId)
                        if (tool) actions.runTool?.(tool)
                    }
                    break
            }
            return
        }
    }, [actions, shortcutsOpen, allShortcuts])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return {
        shortcutsOpen, setShortcutsOpen,
        groups, overrides,
        updateBinding, resetAll, resetOne, isCustomized,
    }
}

// ── Display helper ────────────────────────────────────

export function formatShortcut(sc) {
    const parts = []
    if (sc.ctrl)  parts.push(isMac ? '⌘' : 'Ctrl')
    if (sc.shift) parts.push(isMac ? '⇧' : 'Shift')
    if (sc.alt)   parts.push(isMac ? '⌥' : 'Alt')

    let key = sc.keys
    if (key === 'Enter') key = '↵'
    else if (key === 'Escape') key = 'Esc'
    else if (key === 'Tab') key = 'Tab'
    else if (key === ',') key = ','
    else if (key === '/') key = '/'
    else if (key === '[') key = '['
    else if (key === ']') key = ']'
    else key = key.toUpperCase()

    parts.push(key)
    return parts
}

// Parse a keydown event into a binding object
export function eventToBinding(e) {
    const ctrl  = e[MOD]      || false
    const shift = e.shiftKey  || false
    const alt   = e.altKey    || false
    let keys    = e.key

    // Ignore bare modifier presses
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(keys)) return null

    return { keys, ctrl, shift, alt }
}
