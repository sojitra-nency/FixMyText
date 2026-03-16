import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransformTextMutation } from '../../store/api/textApi'
import { useLogoutMutation } from '../../store/api/authApi'
import { TOOLS, PERSONAS, QUEST_TEMPLATES, USE_CASE_TABS } from '../../constants/tools'
import { ENDPOINTS } from '../../constants/endpoints'
import { ROUTES } from '../../constants'

// Hooks
import useFindReplace from '../../hooks/useFindReplace'
import useTextCompare from '../../hooks/useTextCompare'
import useGenerators from '../../hooks/useGenerators'
import useFormatter from '../../hooks/useFormatter'
import useAiTools from '../../hooks/useAiTools'
import useSpeech from '../../hooks/useSpeech'
import useExport from '../../hooks/useExport'
import useRegexTester from '../../hooks/useRegexTester'
import useTemplates from '../../hooks/useTemplates'
import useHistory from '../../hooks/useHistory'
import useWordFrequency from '../../hooks/useWordFrequency'
import usePipeline from '../../hooks/usePipeline'
import useSmartSuggestions from '../../hooks/useSmartSuggestions'
import useToolSearch from '../../hooks/useToolSearch'
import useResize from '../../hooks/useResize'

// Components
import ToolPanel from './ToolPanel'
import ToolView from './ToolView'
import OutputPanel from './OutputPanel'
import DrawerPanel from '../drawers/DrawerPanel'
import FindReplaceDrawer from '../drawers/FindReplaceDrawer'
import CompareDrawer from '../drawers/CompareDrawer'
import { RandomTextDrawer, PasswordDrawer } from '../drawers/GeneratorDrawer'
import FormatterDrawer from '../drawers/FormatterDrawer'
import RegexDrawer from '../drawers/RegexDrawer'
import TemplatesDrawer from '../drawers/TemplatesDrawer'
import HistoryDrawer from '../drawers/HistoryDrawer'
import SmartSuggestions from './SmartSuggestions'
import BottomPanel from './BottomPanel'
import CommandPalette from '../layout/CommandPalette'
import AchievementToast from '../gamification/AchievementToast'

import { motion, AnimatePresence } from 'framer-motion'

// SVG icons for activity bar (module-level constant — avoids recreation on every render)
const ACTIVITY_ICONS = {
    popular: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z"/></svg>,
    writing: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    transform: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    code: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    ai: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="9" cy="6.5" r="0.8" fill="currentColor" stroke="none"/><circle cx="15" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>,
    language: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    encode: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    export: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
}

// Drawer panel metadata (static — no need to recreate per render)
const DRAWERS = {
    find:     { title: 'Find & Replace',       color: 'teal' },
    compare:  { title: 'Text Compare',         color: 'purple' },
    randtext: { title: 'Random Text Generator', color: 'amber' },
    password: { title: 'Password Generator',    color: 'amber' },
    fmt:      { title: 'Formatter Settings',    color: 'slate' },
    regex:    { title: 'Regex Tester',           color: 'teal' },
    templates:{ title: 'Text Templates',          color: 'amber' },
    history:  { title: 'History / Undo',          color: 'slate' },
}

export default function TextForm(props) {
    const [toolTexts, setToolTexts] = useState({})
    const [dyslexiaMode, setDyslexiaMode] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [activePanel, setActivePanel] = useState(null)
    const [previewMode, setPreviewMode] = useState(null)
    const [activeTab, setActiveTab] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [workspaceTabs, setWorkspaceTabs] = useState([])
    const [activeWorkspaceId, setActiveWorkspaceId] = useState(null)
    const [toolResults, setToolResults] = useState({})
    const [savedTabs, setSavedTabs] = useState({})
    const [saveModal, setSaveModal] = useState(null) // { tabId, defaultName }

    // Per-tool text: derived from the active workspace tab
    const activeTabIdRef = useRef(null)
    activeTabIdRef.current = activeWorkspaceId
    const text = toolTexts[activeWorkspaceId] || ''
    const setText = useCallback((valOrFn) => {
        const tabId = activeTabIdRef.current
        if (!tabId) return
        setToolTexts(prev => {
            const oldVal = prev[tabId] || ''
            const newVal = typeof valOrFn === 'function' ? valOrFn(oldVal) : valOrFn
            return { ...prev, [tabId]: newVal }
        })
        // Mark as unsaved when text changes
        setSavedTabs(prev => prev[tabId] ? { ...prev, [tabId]: false } : prev)
    }, [])
    const sharedTextRef = useRef(null)
    const pendingAutoRun = useRef(null)

    const showAlert = props.showAlert
    const navigate = useNavigate()
    const [logout] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            showAlert('Logged out', 'success')
            navigate(ROUTES.HOME)
        } catch {
            showAlert('Logout failed', 'danger')
        }
    }

    // ── RTK Query mutation ──────────────────────────────────
    const [transformText, { isLoading: rtkLoading }] = useTransformTextMutation()
    const [localLoading, setLocalLoading] = useState(false)
    const loading = rtkLoading || localLoading

    // ── Hooks ───────────────────────────────────────────────
    const findReplace = useFindReplace(text, setText, showAlert)
    const compare = useTextCompare(text, showAlert)
    const generators = useGenerators(setText, showAlert)
    const formatter = useFormatter(text, setText, setLocalLoading, showAlert)
    const history = useHistory(setText, showAlert)
    const ai = useAiTools(text, setText, setMarkdownMode, setPreviewMode, showAlert, history.pushHistory)
    const speech = useSpeech(text, setText, showAlert)
    const exportTools = useExport(text, setLocalLoading, showAlert)
    const regex = useRegexTester(text, showAlert)
    const templates = useTemplates(text, setText, showAlert)
    const wordFreq = useWordFrequency(text, showAlert, ai.setAiResult, setPreviewMode, history.pushHistory)
    const gamification = props.gamification
    const pipeline = usePipeline()
    const suggestions = useSmartSuggestions(text)
    const search = useToolSearch()

    // Resizable panels
    const splitRef = useRef(null)
    const gutterRef = useRef(null)
    const sidebarResize = useResize('horizontal', 240, { min: 160, max: 480, storageKey: 'fmx_sidebar_w' })
    const splitResize = useResize('horizontal', 50, { min: 20, max: 80, storageKey: 'fmx_split_pct', unit: 'percent', containerRef: splitRef })
    const bottomResize = useResize('vertical', 200, { min: 80, max: 500, storageKey: 'fmx_bottom_h' })

    // Set default tab from persona
    useEffect(() => {
        if (gamification?.persona && !activeTab) {
            setActiveTab(PERSONAS[gamification.persona]?.defaultTab || 'popular')
        }
    }, [gamification?.persona, activeTab])

    useEffect(() => {
        if (!activeTab) setActiveTab('popular')
    }, [activeTab])

    // Capture AI results per-tool for persistence
    useEffect(() => {
        if (ai.aiResult && activeWorkspaceId?.startsWith('tool-')) {
            const toolId = activeWorkspaceId.replace('tool-', '')
            setToolResults(prev => ({ ...prev, [toolId]: ai.aiResult }))
        }
    }, [ai.aiResult, activeWorkspaceId])

    const closeWorkspaceTab = (tabId) => {
        const tab = workspaceTabs.find(t => t.id === tabId)
        setWorkspaceTabs(tabs => {
            const remaining = tabs.filter(t => t.id !== tabId)
            if (activeWorkspaceId === tabId) {
                const newActive = remaining.length > 0 ? remaining[remaining.length - 1] : null
                setActiveWorkspaceId(newActive?.id || null)
                setActivePanel(newActive?.type === 'drawer' ? newActive.panelId : null)
            }
            return remaining
        })
        // Clean up per-tab text
        setToolTexts(prev => {
            const next = { ...prev }
            delete next[tabId]
            return next
        })
        if (tab?.type === 'tool') {
            setToolResults(prev => {
                const next = { ...prev }
                delete next[tab.tool.id]
                return next
            })
        }
    }

    // ── URL shared text decode on mount ─────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const shared = params.get('t')
        if (shared) {
            try { sharedTextRef.current = decodeURIComponent(atob(shared)) } catch {}
        }
    }, [])

    // ── Keyboard shortcut for command palette ───────────────
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault()
                search.isOpen ? search.close() : search.open()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [search])

    // ── Generic API handler (RTK Query) ─────────────────────
    const callApi = async (endpoint, successMsg) => {
        if (!text) return
        const original = text
        try {
            const data = await transformText({ endpoint, text }).unwrap()
            ai.setAiResult({ label: successMsg, result: data.result })
            setPreviewMode('result')
            history.pushHistory(successMsg, original, data.result)
            showAlert(successMsg, 'success')
            return { success: true, result: data.result }
        } catch (err) {
            showAlert(err.data?.detail || 'Something went wrong. Please try again.', 'danger')
            return { success: false }
        }
    }

    // ── Clipboard ───────────────────────────────────────────
    const handleClear = () => { setText(''); ai.setAiResult(null); setPreviewMode(null); showAlert('Text cleared', 'success') }
    const handleCopy = () => { navigator.clipboard.writeText(text); showAlert('Copied to clipboard', 'success') }
    const handlePaste = () => { navigator.clipboard.readText().then(t => setText(prev => prev + t)); showAlert('Pasted from clipboard', 'success') }
    const handleClearPaste = () => { navigator.clipboard.readText().then(t => setText(t)); showAlert('Cleared and pasted', 'success') }

    // ── Encoding ────────────────────────────────────────────
    const handleBase64Encode = () => callApi(ENDPOINTS.BASE64_ENCODE, 'Base64 encoded')
    const handleBase64Decode = () => callApi(ENDPOINTS.BASE64_DECODE, 'Base64 decoded')
    const handleUrlEncode    = () => callApi(ENDPOINTS.URL_ENCODE,    'URL encoded')
    const handleUrlDecode    = () => callApi(ENDPOINTS.URL_DECODE,    'URL decoded')
    const handleHexEncode    = () => callApi(ENDPOINTS.HEX_ENCODE,    'Hex encoded')
    const handleHexDecode    = () => callApi(ENDPOINTS.HEX_DECODE,    'Hex decoded')
    const handleMorseEncode  = () => callApi(ENDPOINTS.MORSE_ENCODE,  'Morse encoded')
    const handleMorseDecode  = () => callApi(ENDPOINTS.MORSE_DECODE,  'Morse decoded')

    // ── Hashing (client-side) ───────────────────────────────
    const handleSha256 = async () => {
        if (!text) return
        const original = text
        setLocalLoading(true)
        try {
            const data = new TextEncoder().encode(text)
            const buf = await crypto.subtle.digest('SHA-256', data)
            const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
            ai.setAiResult({ label: 'SHA-256 Hash', result: hash })
            setPreviewMode('result')
            history.pushHistory('SHA-256 Hash', original, hash)
            showAlert('SHA-256 hash generated', 'success')
        } catch { showAlert('SHA-256 hashing failed', 'danger') }
        finally { setLocalLoading(false) }
    }

    const handleMd5 = async () => {
        if (!text) return
        const original = text
        setLocalLoading(true)
        try {
            const md5Module = await import('blueimp-md5')
            const hash = md5Module.default(text)
            ai.setAiResult({ label: 'MD5 Hash', result: hash })
            setPreviewMode('result')
            history.pushHistory('MD5 Hash', original, hash)
            showAlert('MD5 hash generated', 'success')
        } catch { showAlert('MD5 hashing failed', 'danger') }
        finally { setLocalLoading(false) }
    }

    // ── Text Tools ──────────────────────────────────────────
    const handleReverseText      = () => callApi(ENDPOINTS.REVERSE,                'Text reversed')
    const handleSortAsc          = () => callApi(ENDPOINTS.SORT_LINES_ASC,         'Lines sorted A → Z')
    const handleSortDesc         = () => callApi(ENDPOINTS.SORT_LINES_DESC,        'Lines sorted Z → A')
    const handleRemoveDuplicates = () => callApi(ENDPOINTS.REMOVE_DUPLICATE_LINES, 'Duplicate lines removed')
    const handleReverseLines     = () => callApi(ENDPOINTS.REVERSE_LINES,          'Lines reversed')
    const handleNumberLines      = () => callApi(ENDPOINTS.NUMBER_LINES,           'Lines numbered')
    const handleRot13            = () => callApi(ENDPOINTS.ROT13,                  'ROT13 applied')

    // ── Escape / Unescape ───────────────────────────────────
    const handleJsonEscape   = () => callApi(ENDPOINTS.JSON_ESCAPE,   'JSON escaped')
    const handleJsonUnescape = () => callApi(ENDPOINTS.JSON_UNESCAPE, 'JSON unescaped')
    const handleHtmlEscape   = () => callApi(ENDPOINTS.HTML_ESCAPE,   'HTML escaped')
    const handleHtmlUnescape = () => callApi(ENDPOINTS.HTML_UNESCAPE, 'HTML unescaped')

    // ── Developer Tools ─────────────────────────────────────
    const handleJsonFormat = () => callApi(ENDPOINTS.FORMAT_JSON, 'JSON formatted')
    const handleJsonToYaml = () => callApi(ENDPOINTS.JSON_TO_YAML, 'Converted to YAML')
    const handleCsvToJson  = () => callApi(ENDPOINTS.CSV_TO_JSON,  'CSV converted to JSON')
    const handleJsonToCsv  = () => callApi(ENDPOINTS.JSON_TO_CSV,  'JSON converted to CSV')

    // ── JWT Decoder (client-side) ───────────────────────────
    const handleJwtDecode = () => {
        if (!text) return
        const original = text
        setLocalLoading(true)
        try {
            const cleaned = text.trim().replace(/\s+/g, '')
            const parts = cleaned.split('.')
            if (parts.length !== 3) throw new Error('Invalid JWT: expected 3 dot-separated parts')
            const decode = (s, label) => {
                if (!/^[A-Za-z0-9_-]+$/.test(s)) throw new Error(`Invalid characters in JWT ${label}`)
                const padded = s + '='.repeat((4 - s.length % 4) % 4)
                let binary
                try { binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/')) }
                catch { throw new Error(`Invalid base64 in JWT ${label}`) }
                const jsonStr = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)))
                try { return JSON.parse(jsonStr) }
                catch { throw new Error(`JWT ${label} is not valid JSON`) }
            }
            const header = decode(parts[0], 'header')
            const payload = decode(parts[1], 'payload')
            const result = `=== HEADER ===\n${JSON.stringify(header, null, 2)}\n\n=== PAYLOAD ===\n${JSON.stringify(payload, null, 2)}`
            ai.setAiResult({ label: 'JWT Decoded', result })
            setPreviewMode('result')
            history.pushHistory('JWT Decoded', original, result)
            showAlert('JWT decoded', 'success')
        } catch (err) { showAlert(err.message || 'Invalid JWT token', 'danger') }
        finally { setLocalLoading(false) }
    }

    // ── Accessibility ───────────────────────────────────────
    const handleDyslexiaMode = () => {
        setDyslexiaMode(prev => {
            const next = !prev
            showAlert(next ? 'Dyslexia font on' : 'Dyslexia font off', 'info')
            if (next) setPreviewMode('dyslexia')
            else if (previewMode === 'dyslexia') setPreviewMode(null)
            return next
        })
    }
    const handleMarkdownMode = () => {
        setMarkdownMode(prev => {
            const next = !prev
            showAlert(next ? 'Markdown preview on' : 'Markdown preview off', 'info')
            if (next) setPreviewMode('markdown')
            else if (previewMode === 'markdown') setPreviewMode(null)
            return next
        })
    }

    // ── Handler Map (for data-driven tool dispatch) ─────────
    const handlerMap = useMemo(() => ({
        handleBase64Encode, handleBase64Decode,
        handleUrlEncode, handleUrlDecode,
        handleHexEncode, handleHexDecode,
        handleMorseEncode, handleMorseDecode,
        handleMd5, handleSha256,
        handleReverseText: () => callApi(ENDPOINTS.REVERSE, 'Text reversed'),
        handleSortAsc:     () => callApi(ENDPOINTS.SORT_LINES_ASC, 'Lines sorted A → Z'),
        handleSortDesc:    () => callApi(ENDPOINTS.SORT_LINES_DESC, 'Lines sorted Z → A'),
        handleRemoveDuplicates: () => callApi(ENDPOINTS.REMOVE_DUPLICATE_LINES, 'Duplicate lines removed'),
        handleReverseLines: () => callApi(ENDPOINTS.REVERSE_LINES, 'Lines reversed'),
        handleNumberLines:  () => callApi(ENDPOINTS.NUMBER_LINES, 'Lines numbered'),
        handleRot13:        () => callApi(ENDPOINTS.ROT13, 'ROT13 applied'),
        handleJsonEscape, handleJsonUnescape, handleHtmlEscape, handleHtmlUnescape,
        handleJsonFormat, handleJsonToYaml, handleCsvToJson, handleJsonToCsv,
        handleJwtDecode,
        handleFormatHtml: formatter.handleFormatHtml,
        handleFormatCss:  formatter.handleFormatCss,
        handleFormatJs:   formatter.handleFormatJs,
        handleFormatTs:   formatter.handleFormatTs,
        handleFixGrammar:       ai.handleFixGrammar,
        handleParaphrase:       ai.handleParaphrase,
        handleProofread:        ai.handleProofread,
        handleSummarize:        ai.handleSummarize,
        handleEli5:             ai.handleEli5,
        handleLengthenText:     ai.handleLengthenText,
        handleEmailRewrite:     ai.handleEmailRewrite,
        handleTweetShorten:     ai.handleTweetShorten,
        handleHashtags:         ai.handleHashtags,
        handleSeoTitles:        ai.handleSeoTitles,
        handleMetaDescriptions: ai.handleMetaDescriptions,
        handleBlogOutline:      ai.handleBlogOutline,
        handleKeywords:         ai.handleKeywords,
        handleSentiment:        ai.handleSentiment,
        handleGenerateTitle:    ai.handleGenerateTitle,
        handleRefactorPrompt:   ai.handleRefactorPrompt,
        handleChangeFormat:     ai.handleChangeFormat,
        handleChangeTone:       ai.handleChangeTone,
        handleTranslate:        ai.handleTranslate,
        handleTransliterate:    ai.handleTransliterate,
        handleMarkdownMode,
        handleDownloadTxt:   exportTools.handleDownloadTxt,
        handleDownloadPdf:   exportTools.handleDownloadPdf,
        handleDownloadDocx:  exportTools.handleDownloadDocx,
        handleDownloadJson:  exportTools.handleDownloadJson,
        handleWordFrequency: wordFreq.handleWordFrequency,
    }), [callApi, ai, formatter, exportTools, wordFreq, handleBase64Encode, handleBase64Decode, handleUrlEncode, handleUrlDecode, handleHexEncode, handleHexDecode, handleMorseEncode, handleMorseDecode, handleMd5, handleSha256, handleJsonEscape, handleJsonUnescape, handleHtmlEscape, handleHtmlUnescape, handleJsonFormat, handleJsonToYaml, handleCsvToJson, handleJsonToCsv, handleJwtDecode, handleMarkdownMode])

    // ── Open a tool as a workspace tab ──────────────────────
    const openToolTab = useCallback((tool) => {
        if (!tool) return
        const tabId = `tool-${tool.id}`
        let isNew = false
        setWorkspaceTabs(tabs => {
            if (tabs.find(t => t.id === tabId)) return tabs
            isNew = true
            return [...tabs, { id: tabId, label: tool.label, icon: tool.icon, type: 'tool', tool }]
        })
        // Seed new tab: URL shared text > current tab's text
        if (isNew) {
            const seedText = sharedTextRef.current || toolTexts[activeTabIdRef.current] || ''
            if (sharedTextRef.current) sharedTextRef.current = null
            if (seedText) {
                setToolTexts(prev => prev[tabId] ? prev : { ...prev, [tabId]: seedText })
                // Schedule auto-run after state settles
                pendingAutoRun.current = tool
            }
        }
        setActiveWorkspaceId(tabId)
    }, [toolTexts])

    // ── Execute a tool (called from ToolView's Run button) ──
    const executeToolAction = useCallback((tool) => {
        if (!tool) return
        gamification.recordToolUse(tool.id, text.length)

        if (tool.type === 'api') {
            callApi(tool.endpoint, tool.successMsg).then(res => {
                if (res?.success) pipeline.addStep(tool.id, tool.label, res.result)
            })
        } else if (tool.type === 'ai' || tool.type === 'local' || tool.type === 'action' || tool.type === 'select') {
            const handler = handlerMap[tool.handlerKey]
            if (handler) {
                const result = handler()
                if (result && typeof result.then === 'function') {
                    result.then(() => pipeline.addStep(tool.id, tool.label))
                } else {
                    pipeline.addStep(tool.id, tool.label)
                }
            }
        } else if (tool.type === 'drawer') {
            togglePanel(tool.panelId)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, gamification.recordToolUse])

    // ── Unified tool click handler ──────────────────────────
    const handleToolClick = useCallback((tool) => {
        if (!tool) return
        if (tool.type === 'drawer') {
            const tabId = `drawer-${tool.panelId}`
            setWorkspaceTabs(tabs => {
                if (tabs.find(t => t.id === tabId)) return tabs
                return [...tabs, { id: tabId, label: tool.label, icon: tool.icon, type: 'drawer', panelId: tool.panelId }]
            })
            setActiveWorkspaceId(tabId)
            setActivePanel(tool.panelId)
            gamification.recordToolUse(tool.id, text.length)
        } else if (tool.type === 'action') {
            executeToolAction(tool)
        } else {
            openToolTab(tool)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openToolTab, executeToolAction, text, gamification.recordToolUse])

    // ── Auto-run tool on first open (when text was seeded) ──
    useEffect(() => {
        if (pendingAutoRun.current && text) {
            const tool = pendingAutoRun.current
            pendingAutoRun.current = null
            setTimeout(() => executeToolAction(tool), 50)
        }
    }, [text, activeWorkspaceId, executeToolAction])

    // ── Debounced auto-run: re-run tool 2s after user stops typing ──
    const lastTextRef = useRef('')
    useEffect(() => {
        if (!activeWorkspaceId || !text || loading) return
        // Find active tool
        const ws = workspaceTabs.find(t => t.id === activeWorkspaceId)
        if (!ws || ws.type !== 'tool') return
        // Skip if text hasn't actually changed (e.g. tab switch)
        if (text === lastTextRef.current) return
        lastTextRef.current = text

        const timer = setTimeout(() => {
            executeToolAction(ws.tool)
        }, 2000)
        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, activeWorkspaceId])

    // ── Derived stats ───────────────────────────────────────
    const disabled = text.length === 0 || loading
    const { words, chars, sentences } = useMemo(() => ({
        words: text.split(/\s+/).filter(Boolean).length,
        chars: text.length,
        sentences: text.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length,
    }), [text])

    const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel)

    const renderDrawerContent = () => {
        switch (activePanel) {
            case 'find': return <FindReplaceDrawer {...findReplace} disabled={disabled} />
            case 'compare': return <CompareDrawer {...compare} disabled={disabled} />
            case 'randtext': return <RandomTextDrawer {...generators} />
            case 'password': return <PasswordDrawer {...generators} showAlert={showAlert} />
            case 'regex': return <RegexDrawer {...regex} disabled={disabled} />
            case 'templates': return <TemplatesDrawer {...templates} disabled={disabled} />
            case 'history': return <HistoryDrawer {...history} />
            case 'fmt': return (
                <FormatterDrawer
                    pendingFmtCfg={formatter.pendingFmtCfg}
                    setPendingFmt={formatter.setPendingFmt}
                    setPendingFmtCfg={formatter.setPendingFmtCfg}
                    defaultFmtCfg={formatter.defaultFmtCfg}
                    fmtCfg={formatter.fmtCfg}
                    disabled={disabled}
                    handleFmtApply={formatter.handleFmtApply}
                    setActivePanel={setActivePanel}
                />
            )
            default: return null
        }
    }

    // Activity bar tab click — toggles sidebar
    const handleActivityClick = (tabId) => {
        if (activeTab === tabId && sidebarOpen) {
            setSidebarOpen(false)
        } else {
            setActiveTab(tabId)
            setSidebarOpen(true)
        }
    }

    return (
        <>
        <div
            className={`tu-forge${sidebarOpen ? '' : ' tu-forge--sidebar-collapsed'}`}
            style={sidebarOpen ? { gridTemplateColumns: `48px ${sidebarResize.size}px 1fr` } : undefined}
        >
            {/* ─── Activity Bar (far left icons) ─── */}
            <div className="tu-activity-bar">
                {USE_CASE_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tu-activity-btn${activeTab === tab.id && sidebarOpen ? ' tu-activity-btn--active' : ''}`}
                        onClick={() => handleActivityClick(tab.id)}
                        data-tooltip={tab.label}
                    >
                        {ACTIVITY_ICONS[tab.id] || <span>{tab.icon}</span>}
                    </button>
                ))}
                {/* Favourites */}
                <button
                    className={`tu-activity-btn${activeTab === '_favourites' && sidebarOpen ? ' tu-activity-btn--active' : ''}`}
                    onClick={() => handleActivityClick('_favourites')}
                    data-tooltip="Favourites"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <div className="tu-activity-spacer" />
                {/* Templates */}
                <button
                    className={`tu-activity-btn${activeTab === '_templates' && sidebarOpen ? ' tu-activity-btn--active' : ''}`}
                    onClick={() => handleActivityClick('_templates')}
                    data-tooltip="Templates"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </button>
                {/* History */}
                <button
                    className={`tu-activity-btn${activeTab === '_history' && sidebarOpen ? ' tu-activity-btn--active' : ''}`}
                    onClick={() => handleActivityClick('_history')}
                    data-tooltip="History"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </button>
                {/* Bottom: avatar */}
                <button
                    className={`tu-activity-avatar${settingsOpen ? ' tu-activity-avatar--open' : ''}`}
                    onClick={() => setSettingsOpen(o => !o)}
                >
                    <span className="tu-activity-avatar-letter">
                        {props.user?.display_name?.charAt(0)?.toUpperCase() || 'G'}
                    </span>
                </button>
            </div>

            {/* ─── Sidebar (tool explorer / templates / history) ─── */}
            <div className="tu-forge-sidebar">
                <div className="tu-sidebar-header">
                    <span title="~/FixMyText/workspace/tools">
                        {activeTab === '_templates' ? 'Templates' : activeTab === '_history' ? 'History' : activeTab === '_favourites' ? 'Favourites' : USE_CASE_TABS.find(t => t.id === activeTab)?.label || 'Explorer'}
                    </span>
                    <div className="tu-sidebar-header-actions">
                        <button
                            className="tu-sidebar-header-btn"
                            onClick={() => setSidebarOpen(false)}
                            title="Close sidebar"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Tool panel — when a tool category is active */}
                {activeTab && !activeTab.startsWith('_') && (
                    <ToolPanel
                        tools={TOOLS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onToolClick={handleToolClick}
                        disabled={loading}
                        gamification={gamification}
                        activePanel={activePanel}
                        ai={ai}
                        hideTabs
                        suggestedToolIds={suggestions.suggestions.map(t => t.id)}
                    />
                )}

                {/* Favourites panel */}
                {activeTab === '_favourites' && (() => {
                    const favTools = (gamification?.favorites || [])
                        .map(id => TOOLS.find(t => t.id === id))
                        .filter(Boolean)
                    return (
                        <div className="tu-tpanel">
                            {favTools.length === 0 ? (
                                <div className="tu-sidebar-panel-empty">
                                    No favourite tools yet.<br />
                                    Click ♡ on any tool to add it here.
                                </div>
                            ) : (
                                <div className="tu-tpanel-list">
                                    {favTools.map(tool => (
                                        <div key={tool.id} className="tu-titem-wrap">
                                            <div className="tu-titem" onClick={() => handleToolClick(tool)}>
                                                <span className={`tu-titem-icon tu-titem-icon--${tool.color}`}>{tool.icon}</span>
                                                <span className="tu-titem-name">{tool.label}</span>
                                                <button
                                                    className="tu-titem-fav tu-titem-fav--active"
                                                    onClick={e => { e.stopPropagation(); gamification?.toggleFavorite(tool.id) }}
                                                    title="Remove from favourites"
                                                >♥</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })()}

                {/* Templates panel */}
                {activeTab === '_templates' && (
                    <div className="tu-sidebar-panel">
                        <div className="tu-sidebar-panel-actions">
                            <input
                                className="tu-sidebar-panel-input"
                                type="text"
                                placeholder="Template name..."
                                value={templates.templateName}
                                onChange={e => templates.setTemplateName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && templates.handleSaveTemplate()}
                            />
                            <button className="tu-sidebar-panel-btn" onClick={templates.handleSaveTemplate} title="Save current text as template">
                                Save
                            </button>
                        </div>

                        {templates.templates.length === 0 ? (
                            <div className="tu-sidebar-panel-empty">No saved templates yet</div>
                        ) : (
                            <div className="tu-sidebar-panel-list">
                                {templates.templates.map((tpl, i) => (
                                    <div key={i} className="tu-sidebar-panel-item" onClick={() => {
                                        setText(tpl.text)
                                        showAlert(`Template "${tpl.name}" loaded`, 'success')
                                    }}>
                                        <span className="tu-sidebar-panel-item-icon">📄</span>
                                        <span className="tu-sidebar-panel-item-name">{tpl.name}</span>
                                        <span className="tu-sidebar-panel-item-meta">
                                            {new Date(tpl.updatedAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            className="tu-sidebar-panel-item-del"
                                            onClick={e => { e.stopPropagation(); templates.handleDeleteTemplate(i) }}
                                            title="Delete template"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* History panel */}
                {activeTab === '_history' && (
                    <div className="tu-sidebar-panel">
                        {history.history.length > 0 && (
                            <div className="tu-sidebar-panel-actions">
                                <span className="tu-sidebar-panel-count">{history.history.length} operations</span>
                                <button className="tu-sidebar-panel-btn tu-sidebar-panel-btn--danger" onClick={history.handleClearHistory}>
                                    Clear All
                                </button>
                            </div>
                        )}
                        {history.history.length === 0 ? (
                            <div className="tu-sidebar-panel-empty">No operations yet</div>
                        ) : (
                            <div className="tu-sidebar-panel-list">
                                {[...history.history].reverse().map((h, ri) => {
                                    const i = history.history.length - 1 - ri
                                    return (
                                        <div key={i} className="tu-sidebar-panel-item">
                                            <span className="tu-sidebar-panel-item-icon">⚡</span>
                                            <span className="tu-sidebar-panel-item-name">{h.operation}</span>
                                            <span className="tu-sidebar-panel-item-meta">
                                                {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button
                                                className="tu-sidebar-panel-item-action"
                                                onClick={() => {
                                                    setText(h.original)
                                                    showAlert(`Restored input from "${h.operation}"`, 'success')
                                                }}
                                                title="Restore input"
                                            >↩</button>
                                            <button
                                                className="tu-sidebar-panel-item-action"
                                                onClick={() => {
                                                    setText(h.result)
                                                    showAlert(`Restored result from "${h.operation}"`, 'success')
                                                }}
                                                title="Restore result"
                                            >↪</button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Sidebar Footer: Gamification ─── */}
                <div className="tu-sidebar-footer">
                    {/* Level + XP */}
                    <div className="tu-sf-row tu-sf-level">
                        <span className="tu-sf-level-icon">⚡</span>
                        <span className="tu-sf-label">Lv.{gamification.level?.level || 1}</span>
                        <span className="tu-sf-sublabel">{gamification.level?.title || 'Beginner'}</span>
                        <span className="tu-sf-value">{gamification.xp || 0} XP</span>
                    </div>
                    <div className="tu-sf-xp-track">
                        <div
                            className="tu-sf-xp-fill"
                            style={{ width: `${gamification.xpProgress || 0}%` }}
                        />
                    </div>

                    {/* Streak + Discovery */}
                    <div className="tu-sf-stats">
                        <div className="tu-sf-stat" title="Daily streak">
                            🔥 <b>{gamification.streak?.current || 0}</b> streak
                        </div>
                        <div className="tu-sf-stat" title="Tools discovered">
                            🧭 <b>{gamification.discoveredTools?.length || 0}</b>/{TOOLS.length}
                        </div>
                    </div>

                    {/* Daily Quest */}
                    {gamification.dailyQuest?.id && (
                        <div className={`tu-sf-quest${gamification.dailyQuest.completed ? ' tu-sf-quest--done' : ''}`}>
                            <span className="tu-sf-quest-icon">{gamification.dailyQuest.completed ? '✅' : '📋'}</span>
                            <span className="tu-sf-quest-text">
                                {QUEST_TEMPLATES.find(q => q.id === gamification.dailyQuest.id)?.text || 'Daily Quest'}
                            </span>
                        </div>
                    )}
                </div>
                {/* Sidebar resize handle */}
                {sidebarOpen && <div className="tu-resize-handle tu-resize-handle--sidebar" onMouseDown={sidebarResize.onMouseDown} />}
            </div>

            {/* ─── Center: Editor Area ─── */}
            <div className="tu-forge-center">
                {/* ─── Workspace Tab Bar (top-level, tools as files) ─── */}
                <div className="tu-tab-bar">
                    {workspaceTabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`tu-tab${activeWorkspaceId === tab.id ? ' tu-tab--active' : ''}`}
                            onClick={() => {
                                setActiveWorkspaceId(tab.id)
                                if (tab.type === 'drawer') setActivePanel(tab.panelId)
                            }}
                            title={`~/FixMyText/workspace/${tab.label}`}
                        >
                            <span className="tu-tab-icon">{tab.icon}</span>
                            <span className="tu-tab-name">{tab.label}</span>
                            <button
                                className="tu-tab-save"
                                onClick={e => {
                                    e.stopPropagation()
                                    setSaveModal({ tabId: tab.id, defaultName: tab.label })
                                }}
                                title="Save to templates (Ctrl+S)"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            </button>
                            <button
                                className="tu-tab-close"
                                onClick={e => { e.stopPropagation(); closeWorkspaceTab(tab.id) }}
                            >✕</button>
                        </div>
                    ))}
                </div>

                {/* ─── Landing page (no tool selected) ─── */}
                {!activeWorkspaceId && (
                    <div className="tu-landing">
                        <div className="tu-landing-hero">
                            <h1 className="tu-landing-title">FixMyText</h1>
                            <p className="tu-landing-subtitle">{TOOLS.length}+ text tools at your fingertips</p>
                        </div>

                        <div className="tu-landing-columns">
                            {/* Start */}
                            <div className="tu-landing-section">
                                <h3 className="tu-landing-heading">Start</h3>
                                <button className="tu-landing-link" onClick={() => search.open()}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    Search tools...
                                    <kbd>Ctrl+K</kbd>
                                </button>
                                {(() => {
                                    const quickTools = ['uppercase', 'fix_grammar', 'paraphrase', 'summarize', 'base64_encode']
                                        .map(id => TOOLS.find(t => t.id === id)).filter(Boolean)
                                    return quickTools.map(tool => (
                                        <button key={tool.id} className="tu-landing-link" onClick={() => handleToolClick(tool)}>
                                            <span className="tu-landing-link-icon">{tool.icon}</span>
                                            {tool.label}
                                        </button>
                                    ))
                                })()}
                            </div>

                            {/* How it works */}
                            <div className="tu-landing-section">
                                <h3 className="tu-landing-heading">How it works</h3>
                                <div className="tu-landing-steps">
                                    <div className="tu-landing-step">
                                        <span className="tu-landing-step-num">1</span>
                                        <span>Pick a tool from the sidebar</span>
                                    </div>
                                    <div className="tu-landing-step">
                                        <span className="tu-landing-step-num">2</span>
                                        <span>Type or paste your text</span>
                                    </div>
                                    <div className="tu-landing-step">
                                        <span className="tu-landing-step-num">3</span>
                                        <span>Click <b>Run</b> to transform</span>
                                    </div>
                                </div>
                            </div>

                            {/* Favourites / Recent */}
                            <div className="tu-landing-section">
                                <h3 className="tu-landing-heading">
                                    {(gamification?.favorites?.length > 0) ? 'Favourites' : 'Quick access'}
                                </h3>
                                {(gamification?.favorites?.length > 0) ? (
                                    gamification.favorites.slice(0, 5).map(id => {
                                        const tool = TOOLS.find(t => t.id === id)
                                        return tool ? (
                                            <button key={id} className="tu-landing-link" onClick={() => handleToolClick(tool)}>
                                                <span className="tu-landing-link-icon">{tool.icon}</span>
                                                {tool.label}
                                            </button>
                                        ) : null
                                    })
                                ) : (
                                    <>
                                        {['lowercase', 'title_case', 'remove_extra_spaces', 'word_count', 'find_replace']
                                            .map(id => TOOLS.find(t => t.id === id)).filter(Boolean)
                                            .map(tool => (
                                                <button key={tool.id} className="tu-landing-link" onClick={() => handleToolClick(tool)}>
                                                    <span className="tu-landing-link-icon">{tool.icon}</span>
                                                    {tool.label}
                                                </button>
                                            ))
                                        }
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Category grid */}
                        <div className="tu-landing-categories">
                            <h3 className="tu-landing-heading">Explore categories</h3>
                            <div className="tu-landing-cat-grid">
                                {USE_CASE_TABS.filter(t => t.id !== 'popular').map(tab => {
                                    const count = TOOLS.filter(t => t.tabs?.includes(tab.id)).length
                                    return (
                                        <button
                                            key={tab.id}
                                            className="tu-landing-cat-card"
                                            onClick={() => { setActiveTab(tab.id); setSidebarOpen(true) }}
                                        >
                                            <span className="tu-landing-cat-icon">
                                                {ACTIVITY_ICONS[tab.id] || <span>{tab.icon}</span>}
                                            </span>
                                            <span className="tu-landing-cat-name">{tab.label}</span>
                                            <span className="tu-landing-cat-count">{count} tools</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Stats + Shortcuts row */}
                        <div className="tu-landing-bottom">
                            {/* Your progress */}
                            <div className="tu-landing-stats">
                                <h3 className="tu-landing-heading">Your progress</h3>
                                <div className="tu-landing-stat-grid">
                                    <div className="tu-landing-stat">
                                        <span className="tu-landing-stat-val">{gamification?.level?.name || 'Novice'}</span>
                                        <span className="tu-landing-stat-label">Level</span>
                                    </div>
                                    <div className="tu-landing-stat">
                                        <span className="tu-landing-stat-val">{gamification?.xp || 0}</span>
                                        <span className="tu-landing-stat-label">XP earned</span>
                                    </div>
                                    <div className="tu-landing-stat">
                                        <span className="tu-landing-stat-val">{gamification?.streak?.current || 0}</span>
                                        <span className="tu-landing-stat-label">Day streak</span>
                                    </div>
                                    <div className="tu-landing-stat">
                                        <span className="tu-landing-stat-val">{gamification?.discoveredTools?.length || 0}/{TOOLS.length}</span>
                                        <span className="tu-landing-stat-label">Discovered</span>
                                    </div>
                                </div>
                            </div>

                            {/* Keyboard shortcuts */}
                            <div className="tu-landing-shortcuts">
                                <h3 className="tu-landing-heading">Keyboard shortcuts</h3>
                                <div className="tu-landing-shortcut-list">
                                    <div className="tu-landing-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd><span>Command palette</span></div>
                                    <div className="tu-landing-shortcut"><kbd>Ctrl</kbd><kbd>Enter</kbd><span>Run tool</span></div>
                                    <div className="tu-landing-shortcut"><kbd>Ctrl</kbd><kbd>B</kbd><span>Toggle sidebar</span></div>
                                    <div className="tu-landing-shortcut"><kbd>Ctrl</kbd><kbd>W</kbd><span>Close tab</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeWorkspaceId && <><div ref={splitRef} className="tu-editor-split" style={{ gridTemplateColumns: `${splitResize.size}fr 4px ${100 - splitResize.size}fr` }}>
                    {/* ─── Left: Input (always visible) ─── */}
                    <div className="tu-editor-input">
                        <div className="tu-editor-topbar">
                            <span className="tu-editor-label" title="~/FixMyText/workspace/input.txt">INPUT</span>
                            <div className="tu-topbar-stats">
                                <span className="tu-topbar-stat"><b>{words}</b> words</span>
                                <span className="tu-topbar-stat"><b>{chars}</b> chars</span>
                                <span className="tu-topbar-stat"><b>{sentences}</b> sentences</span>
                            </div>
                        </div>
                        <div className="tu-input-toolbar">
                            <button className="tu-input-toolbar-btn" onClick={handleCopy} title="Copy" disabled={!text}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                <span>Copy</span>
                            </button>
                            <button className="tu-input-toolbar-btn" onClick={handlePaste} title="Paste">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                                <span>Paste</span>
                            </button>
                            <button className="tu-input-toolbar-btn" onClick={handleClearPaste} title="Clear + Paste">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                                <span>Clear+Paste</span>
                            </button>
                            <div className="tu-input-toolbar-sep" />
                            <button className="tu-input-toolbar-btn tu-input-toolbar-btn--danger" onClick={handleClear} title="Clear" disabled={!text}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                <span>Clear</span>
                            </button>
                            <div className="tu-input-toolbar-sep" />
                            <button className={`tu-input-toolbar-btn${speech.listening ? ' tu-input-toolbar-btn--active' : ''}`} onClick={speech.handleTts} title="Read Aloud" disabled={!text}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                                <span>Read Aloud</span>
                            </button>
                            <button className={`tu-input-toolbar-btn${speech.listening ? ' tu-input-toolbar-btn--active' : ''}`} onClick={speech.handleSpeechToText} title="Speech to Text">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                                <span>Speech</span>
                            </button>
                            <div className="tu-input-toolbar-sep" />
                            <button className={`tu-input-toolbar-btn${dyslexiaMode ? ' tu-input-toolbar-btn--active' : ''}`} onClick={handleDyslexiaMode} title="Dyslexia-friendly font">
                                <span className="tu-input-toolbar-icon-text">Aa</span>
                                <span>Dyslexia</span>
                            </button>
                        </div>
                        <div className="tu-editor-body">
                            <div className="tu-line-numbers" ref={gutterRef}>
                                {(text || '\n').split('\n').map((_, i) => (
                                    <span key={i}>{i + 1}</span>
                                ))}
                            </div>
                            <textarea
                                className="tu-textarea"
                                id="text"
                                value={text}
                                onChange={e => {
                                    setText(e.target.value)
                                    if (previewMode === 'result') { ai.handleAiDismiss(); setPreviewMode(null) }
                                }}
                                onScroll={e => {
                                    if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop
                                }}
                                placeholder="// Start typing or paste your text here..."
                                style={{ tabSize: formatter.fmtCfg.tabWidth, MozTabSize: formatter.fmtCfg.tabWidth }}
                            />
                        </div>
                        {loading && (
                            <div className="tu-loading">
                                <div className="tu-spinner" />
                                <span>Processing...</span>
                            </div>
                        )}
                    </div>

                    {/* Split resize handle */}
                    <div className="tu-resize-handle tu-resize-handle--split" onMouseDown={splitResize.onMouseDown} />

                    {/* ─── Right: Output (per-tool or default) ─── */}
                    <div className="tu-editor-output">
                        {(() => {
                            const ws = workspaceTabs.find(t => t.id === activeWorkspaceId)
                            if (ws?.type === 'drawer') {
                                return DRAWERS[ws.panelId] ? (
                                    <DrawerPanel
                                        title={DRAWERS[ws.panelId].title}
                                        color={DRAWERS[ws.panelId].color}
                                        onClose={() => closeWorkspaceTab(activeWorkspaceId)}
                                    >
                                        {renderDrawerContent()}
                                    </DrawerPanel>
                                ) : null
                            }
                            const toolResult = ws?.type === 'tool' ? toolResults[ws.tool.id] : null
                            const displayResult = text ? (toolResult || ai.aiResult) : null
                            return (
                                <OutputPanel
                                    aiResult={displayResult || null}
                                    hasMarkdown={ai.hasMarkdown}
                                    onAiAccept={() => {
                                        const r = toolResult || ai.aiResult
                                        if (r) {
                                            setText(r.result)
                                            if (ai.hasMarkdown(r.result)) setMarkdownMode(true)
                                        }
                                        if (ws?.type === 'tool') {
                                            setToolResults(prev => { const next = { ...prev }; delete next[ws.tool.id]; return next })
                                        }
                                        ai.setAiResult(null)
                                        setPreviewMode(null)
                                    }}
                                    onAiDismiss={() => {
                                        if (ws?.type === 'tool') {
                                            setToolResults(prev => { const next = { ...prev }; delete next[ws.tool.id]; return next })
                                        }
                                        ai.setAiResult(null)
                                        setPreviewMode(null)
                                    }}
                                    previewMode={displayResult ? 'result' : previewMode}
                                    setPreviewMode={setPreviewMode}
                                    showAlert={showAlert} text={text}
                                    dyslexiaMode={dyslexiaMode} markdownMode={markdownMode}
                                    speech={speech} onDyslexiaToggle={handleDyslexiaMode}
                                    activeTool={ws?.type === 'tool' ? ws.tool : null}
                                    loading={loading}
                                />
                            )
                        })()}
                    </div>
                </div>

                {/* Bottom panel resize handle */}
                <div className="tu-resize-handle tu-resize-handle--bottom" onMouseDown={bottomResize.onMouseDown} />

                {/* Bottom panel: tabbed */}
                <BottomPanel
                    pipeline={pipeline}
                    history={history}
                    text={text}
                    gamification={gamification}
                    style={{ height: bottomResize.size }}
                />

                {/* Smart Suggestions — status bar style */}
                {suggestions.suggestions.length > 0 && (
                    <SmartSuggestions
                        suggestions={suggestions.suggestions}
                        onToolClick={handleToolClick}
                        onDismiss={suggestions.dismiss}
                    />
                )}</>}
            </div>
        </div>

        {/* Settings menu (rendered outside .tu-forge to escape overflow:hidden) */}
        {settingsOpen && (
            <>
                <div className="tu-settings-backdrop" onClick={() => setSettingsOpen(false)} />
                <div className="tu-settings-menu">
                    {/* User info */}
                    <div className="tu-settings-user">
                        <div className="tu-settings-user-avatar">
                            {props.user?.display_name?.charAt(0)?.toUpperCase() || 'G'}
                        </div>
                        <div className="tu-settings-user-info">
                            <span className="tu-settings-user-name">{props.user?.display_name || 'Guest'}</span>
                            <span className="tu-settings-user-email">{props.user?.email || 'Not signed in'}</span>
                        </div>
                    </div>
                    <div className="tu-settings-divider" />

                    {/* Theme toggle */}
                    <button className="tu-settings-item" onClick={() => { props.setMode?.(props.mode === 'dark' ? 'light' : 'dark'); setSettingsOpen(false) }}>
                        <span className="tu-settings-item-icon">{props.mode === 'dark' ? '☀️' : '🌙'}</span>
                        <span className="tu-settings-item-label">{props.mode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                        <span className="tu-settings-item-hint">{props.mode === 'dark' ? 'Switch to light' : 'Switch to dark'}</span>
                    </button>

                    {/* Command palette */}
                    <button className="tu-settings-item" onClick={() => { search.open(); setSettingsOpen(false) }}>
                        <span className="tu-settings-item-icon">⌨</span>
                        <span className="tu-settings-item-label">Command Palette</span>
                        <kbd className="tu-settings-item-kbd">Ctrl+F</kbd>
                    </button>

                    {/* Dashboard */}
                    <button className="tu-settings-item" onClick={() => { setSettingsOpen(false); navigate('/dashboard') }}>
                        <span className="tu-settings-item-icon">📊</span>
                        <span className="tu-settings-item-label">Dashboard</span>
                        <span className="tu-settings-item-hint">Stats & settings</span>
                    </button>

                    {/* Keyboard shortcuts info */}
                    <button className="tu-settings-item" onClick={() => { showAlert('Ctrl+F: Search tools | Ctrl+Z: Undo | Ctrl+Shift+Z: Redo', 'info'); setSettingsOpen(false) }}>
                        <span className="tu-settings-item-icon">⌘</span>
                        <span className="tu-settings-item-label">Keyboard Shortcuts</span>
                    </button>

                    {/* Logout */}
                    {props.isAuthenticated && (
                        <>
                            <div className="tu-settings-divider" />
                            <button className="tu-settings-item tu-settings-item--danger" onClick={() => { setSettingsOpen(false); handleLogout() }}>
                                <span className="tu-settings-item-icon">⏻</span>
                                <span className="tu-settings-item-label">Sign Out</span>
                            </button>
                        </>
                    )}

                    {/* About */}
                    <div className="tu-settings-footer">
                        FixMyText v1.0 — {TOOLS.length} tools
                    </div>
                </div>
            </>
        )}

        {/* Floating overlays */}
        <AnimatePresence>
            {gamification.xpGain && (
                <motion.div
                    className="tu-xp-float"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -40 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    +{gamification.xpGain} XP
                </motion.div>
            )}
        </AnimatePresence>
        {/* Save to Template modal */}
        {saveModal && (() => {
            const SaveModal = () => {
                const [name, setName] = useState(saveModal.defaultName)
                const inputRef = useRef(null)
                useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])
                const handleSave = () => {
                    if (!name.trim()) return
                    templates.saveDirectly(name.trim(), toolTexts[saveModal.tabId] || '')
                    setSavedTabs(prev => ({ ...prev, [saveModal.tabId]: true }))
                    setActiveTab('_templates')
                    setSidebarOpen(true)
                    setSaveModal(null)
                }
                return (
                    <>
                        <div className="tu-modal-backdrop" onClick={() => setSaveModal(null)} />
                        <div className="tu-modal">
                            <div className="tu-modal-header">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                <span>Save to Templates</span>
                            </div>
                            <div className="tu-modal-body">
                                <label className="tu-modal-label">Template name</label>
                                <input
                                    ref={inputRef}
                                    className="tu-modal-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaveModal(null) }}
                                    placeholder="Enter a name..."
                                />
                            </div>
                            <div className="tu-modal-footer">
                                <button className="tu-modal-btn tu-modal-btn--secondary" onClick={() => setSaveModal(null)}>Cancel</button>
                                <button className="tu-modal-btn tu-modal-btn--primary" onClick={handleSave} disabled={!name.trim()}>Save</button>
                            </div>
                        </div>
                    </>
                )
            }
            return <SaveModal />
        })()}

        <AchievementToast achievement={gamification.newAchievement} />
        <CommandPalette search={search} onToolClick={handleToolClick} />
        </>
    )
}
