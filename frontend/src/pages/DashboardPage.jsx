import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TOOLS, ACHIEVEMENTS, LEVELS, PERSONAS, QUEST_TEMPLATES, USE_CASE_TABS } from '../constants/tools'
import { useGetPassCatalogQuery } from '../store/api/passesApi'
import formatPriceUtil from '../utils/formatPrice'

export default function DashboardPage({ gamification, user, isAuthenticated, showAlert, mode, setMode, subscription }) {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeSection, setActiveSection] = useState(() => {
        return searchParams.get('tab') || 'overview'
    })
    const [editingName, setEditingName] = useState(false)
    const [nameInput, setNameInput] = useState(user?.display_name || '')
    const nameRef = useRef(null)

    const g = gamification
    const level = g?.level || LEVELS[0]
    const nextLevel = g?.nextLevel || LEVELS[1]
    const xpProgress = g?.xpProgress || 0

    // Handle payment redirect — auto-open subscription tab and show result
    useEffect(() => {
        const upgrade = searchParams.get('upgrade')
        const purchase = searchParams.get('purchase')
        if (upgrade === 'success') {
            setActiveSection('subscription')
            showAlert('Welcome to Pro! Your subscription is active.', 'success')
            subscription?.refetchStatus?.()
        } else if (upgrade === 'verify-failed') {
            setActiveSection('subscription')
            showAlert('Payment received but verification failed. Please contact support if your plan is not active.', 'error')
        } else if (upgrade === 'cancelled') {
            setActiveSection('subscription')
        } else if (purchase === 'success') {
            setActiveSection('subscription')
            showAlert('Purchase successful! Your pass or credits are now active.', 'success')
            subscription?.refetchStatus?.()
        } else if (purchase === 'verify-failed') {
            setActiveSection('subscription')
            showAlert('Payment received but verification failed. Please contact support if your purchase is not reflected.', 'error')
        }
        if (upgrade || purchase) {
            setSearchParams({}, { replace: true })
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (editingName && nameRef.current) {
            nameRef.current.focus()
            nameRef.current.select()
        }
    }, [editingName])

    // Top used tools
    const topTools = useMemo(() => {
        if (!g?.toolsUsed) return []
        return Object.entries(g.toolsUsed)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([id, count]) => {
                const tool = TOOLS.find(t => t.id === id)
                return tool ? { ...tool, count } : null
            })
            .filter(Boolean)
    }, [g?.toolsUsed])

    // Category usage
    const categoryUsage = useMemo(() => {
        if (!g?.toolsUsed) return []
        const cats = {}
        Object.entries(g.toolsUsed).forEach(([id, count]) => {
            const tool = TOOLS.find(t => t.id === id)
            if (tool?.tabs) {
                tool.tabs.forEach(tab => {
                    if (tab !== 'all') cats[tab] = (cats[tab] || 0) + count
                })
            }
        })
        return USE_CASE_TABS
            .filter(t => t.id !== 'all' && cats[t.id])
            .map(t => ({ ...t, count: cats[t.id] || 0 }))
            .sort((a, b) => b.count - a.count)
    }, [g?.toolsUsed])

    const recentOps = g?.sessionOps || []

    // Level milestones for the progress section
    const completedLevels = LEVELS.filter(l => (g?.xp || 0) >= l.xp)

    const sections = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'subscription', label: 'Subscription', icon: '⚡' },
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'achievements', label: 'Achievements', icon: '🏆' },
        { id: 'favorites', label: 'Favorites', icon: '❤️' },
        { id: 'history', label: 'Usage History', icon: '📈' },
    ]

    return (
        <div className="tu-dash">
            {/* Sidebar nav */}
            <div className="tu-dash-sidebar">
                <div className="tu-dash-sidebar-profile">
                    <div className="tu-dash-avatar">
                        {user?.display_name?.charAt(0)?.toUpperCase() || 'G'}
                    </div>
                    <div className="tu-dash-profile-info">
                        <span className="tu-dash-profile-name">{user?.display_name || 'Guest'}</span>
                        <span className="tu-dash-profile-level">{level.title} — Lvl {level.level}</span>
                    </div>
                </div>

                {/* Mini XP bar in sidebar */}
                <div className="tu-dash-sidebar-xp">
                    <div className="tu-dash-sidebar-xp-track">
                        <div className="tu-dash-sidebar-xp-fill" style={{ width: `${xpProgress}%` }} />
                    </div>
                    <span className="tu-dash-sidebar-xp-text">{g?.xp || 0} XP</span>
                </div>

                <nav className="tu-dash-nav">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            className={`tu-dash-nav-item${activeSection === s.id ? ' tu-dash-nav-item--active' : ''}`}
                            onClick={() => setActiveSection(s.id)}
                        >
                            <span className="tu-dash-nav-icon">{s.icon}</span>
                            <span>{s.label}</span>
                            {s.id === 'achievements' && (
                                <span className="tu-dash-nav-badge">{g?.achievements?.length || 0}/{ACHIEVEMENTS.length}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Quick stats in sidebar */}
                <div className="tu-dash-sidebar-stats">
                    <div className="tu-dash-sidebar-stat">
                        <span>🔥</span>
                        <span>{g?.streak?.current || 0} day streak</span>
                    </div>
                    <div className="tu-dash-sidebar-stat">
                        <span>🔧</span>
                        <span>{g?.totalOps || 0} operations</span>
                    </div>
                </div>

                <div className="tu-dash-sidebar-footer">
                    <button className="tu-dash-back-btn" onClick={() => navigate('/')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to Editor
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="tu-dash-main">
                {/* ─── Overview ─── */}
                {activeSection === 'overview' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Overview</h2>
                        <p className="tu-dash-subtitle">Your FixMyText journey at a glance</p>

                        {/* XP + Level card */}
                        <div className="tu-dash-card tu-dash-card--hero">
                            <div className="tu-dash-level-header">
                                <div className="tu-dash-level-badge">{level.level}</div>
                                <div className="tu-dash-level-info">
                                    <span className="tu-dash-level-title">{level.title}</span>
                                    <span className="tu-dash-level-xp">{g?.xp || 0} XP — {nextLevel.xp - (g?.xp || 0)} XP to {nextLevel.title}</span>
                                </div>
                                <div className="tu-dash-level-next">
                                    <span className="tu-dash-level-next-label">Next</span>
                                    <span className="tu-dash-level-next-title">{nextLevel.title}</span>
                                </div>
                            </div>
                            <div className="tu-dash-xp-track">
                                <div className="tu-dash-xp-fill" style={{ width: `${xpProgress}%` }} />
                            </div>
                            <div className="tu-dash-xp-labels">
                                <span>Lvl {level.level}</span>
                                <span>{Math.round(xpProgress)}%</span>
                                <span>Lvl {nextLevel.level}</span>
                            </div>

                            {/* Level milestones */}
                            <div className="tu-dash-milestones">
                                {LEVELS.map(l => (
                                    <div key={l.level} className={`tu-dash-milestone${(g?.xp || 0) >= l.xp ? ' tu-dash-milestone--done' : ''}`} title={`${l.title} — ${l.xp} XP`}>
                                        <span>{l.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="tu-dash-stats-grid">
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">🔧</span>
                                <span className="tu-dash-stat-value">{g?.totalOps || 0}</span>
                                <span className="tu-dash-stat-label">Operations</span>
                            </div>
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">✏️</span>
                                <span className="tu-dash-stat-value">{((g?.totalChars || 0) / 1000).toFixed(1)}k</span>
                                <span className="tu-dash-stat-label">Characters</span>
                            </div>
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">🔥</span>
                                <span className="tu-dash-stat-value">{g?.streak?.current || 0}</span>
                                <span className="tu-dash-stat-label">Day Streak</span>
                            </div>
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">🧭</span>
                                <span className="tu-dash-stat-value">{g?.discoveredTools?.length || 0}<small>/{TOOLS.length}</small></span>
                                <span className="tu-dash-stat-label">Discovered</span>
                            </div>
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">🏅</span>
                                <span className="tu-dash-stat-value">{g?.achievements?.length || 0}<small>/{ACHIEVEMENTS.length}</small></span>
                                <span className="tu-dash-stat-label">Achievements</span>
                            </div>
                            <div className="tu-dash-stat-card">
                                <span className="tu-dash-stat-icon">❤️</span>
                                <span className="tu-dash-stat-value">{g?.favorites?.length || 0}</span>
                                <span className="tu-dash-stat-label">Favorites</span>
                            </div>
                        </div>

                        {/* Daily Quest */}
                        {g?.dailyQuest?.id && (
                            <div className="tu-dash-card">
                                <h3 className="tu-dash-card-title">Daily Quest</h3>
                                <div className={`tu-dash-quest${g.dailyQuest.completed ? ' tu-dash-quest--done' : ''}`}>
                                    <span className="tu-dash-quest-icon">{g.dailyQuest.completed ? '✅' : '📋'}</span>
                                    <span className="tu-dash-quest-text">
                                        {QUEST_TEMPLATES.find(q => q.id === g.dailyQuest.id)?.text || 'Daily Quest'}
                                    </span>
                                    <span className="tu-dash-quest-xp">+{QUEST_TEMPLATES.find(q => q.id === g.dailyQuest.id)?.xp || 50} XP</span>
                                    {g.dailyQuest.completed && <span className="tu-dash-quest-badge">Completed</span>}
                                </div>
                            </div>
                        )}

                        {/* Top tools + Category usage */}
                        <div className="tu-dash-row">
                            <div className="tu-dash-card">
                                <h3 className="tu-dash-card-title">Most Used Tools</h3>
                                {topTools.length === 0 ? (
                                    <div className="tu-dash-empty">No tools used yet — start exploring!</div>
                                ) : (
                                    <div className="tu-dash-tool-list">
                                        {topTools.map((tool, i) => (
                                            <div key={tool.id} className="tu-dash-tool-row">
                                                <span className="tu-dash-tool-rank">#{i + 1}</span>
                                                <span className="tu-dash-tool-icon">{tool.icon}</span>
                                                <span className="tu-dash-tool-name">{tool.label}</span>
                                                <div className="tu-dash-tool-bar-wrap">
                                                    <div className="tu-dash-tool-bar" style={{ width: `${(tool.count / topTools[0].count) * 100}%` }} />
                                                </div>
                                                <span className="tu-dash-tool-count">{tool.count}x</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="tu-dash-card">
                                <h3 className="tu-dash-card-title">Category Breakdown</h3>
                                {categoryUsage.length === 0 ? (
                                    <div className="tu-dash-empty">No usage data yet</div>
                                ) : (
                                    <div className="tu-dash-tool-list">
                                        {categoryUsage.map(cat => (
                                            <div key={cat.id} className="tu-dash-tool-row">
                                                <span className="tu-dash-tool-icon">{cat.icon}</span>
                                                <span className="tu-dash-tool-name">{cat.label}</span>
                                                <div className="tu-dash-tool-bar-wrap">
                                                    <div className="tu-dash-tool-bar tu-dash-tool-bar--cat" style={{ width: `${(cat.count / categoryUsage[0].count) * 100}%` }} />
                                                </div>
                                                <span className="tu-dash-tool-count">{cat.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent achievements preview */}
                        {g?.achievements?.length > 0 && (
                            <div className="tu-dash-card">
                                <div className="tu-dash-card-header">
                                    <h3 className="tu-dash-card-title">Recent Achievements</h3>
                                    <button className="tu-dash-card-link" onClick={() => setActiveSection('achievements')}>View all</button>
                                </div>
                                <div className="tu-dash-achievements-preview">
                                    {g.achievements.slice(-4).reverse().map(id => {
                                        const ach = ACHIEVEMENTS.find(a => a.id === id)
                                        return ach ? (
                                            <div key={id} className="tu-dash-achievement-mini">
                                                <span>{ach.icon}</span>
                                                <span>{ach.label}</span>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Subscription ─── */}
                {activeSection === 'subscription' && <SubscriptionTab subscription={subscription} showAlert={showAlert} navigate={navigate} isAuthenticated={isAuthenticated} />}

                {/* ─── Profile ─── */}
                {activeSection === 'profile' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Profile</h2>
                        <p className="tu-dash-subtitle">Manage your account and preferences</p>

                        {/* Profile card */}
                        <div className="tu-dash-card tu-dash-card--profile">
                            <div className="tu-dash-profile-large">
                                <div className="tu-dash-avatar-large">
                                    {user?.display_name?.charAt(0)?.toUpperCase() || 'G'}
                                </div>
                                <div className="tu-dash-profile-large-info">
                                    {editingName ? (
                                        <div className="tu-dash-profile-edit-row">
                                            <input
                                                ref={nameRef}
                                                className="tu-dash-profile-input"
                                                value={nameInput}
                                                onChange={e => setNameInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        setEditingName(false)
                                                        showAlert('Display name updated (local only)', 'success')
                                                    }
                                                    if (e.key === 'Escape') { setEditingName(false); setNameInput(user?.display_name || '') }
                                                }}
                                                placeholder="Display name"
                                            />
                                            <button className="tu-dash-profile-save-btn" onClick={() => { setEditingName(false); showAlert('Display name updated (local only)', 'success') }}>Save</button>
                                            <button className="tu-dash-profile-cancel-btn" onClick={() => { setEditingName(false); setNameInput(user?.display_name || '') }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="tu-dash-profile-name-row">
                                            <span className="tu-dash-profile-large-name">{nameInput || user?.display_name || 'Guest'}</span>
                                            <button className="tu-dash-profile-edit-btn" onClick={() => setEditingName(true)} title="Edit name">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                            </button>
                                        </div>
                                    )}
                                    <span className="tu-dash-profile-large-email">{user?.email || 'Not signed in'}</span>
                                    <span className={`tu-dash-settings-badge${isAuthenticated ? ' tu-dash-settings-badge--ok' : ''}`}>
                                        {isAuthenticated ? 'Signed in' : 'Guest'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Persona */}
                        <div className="tu-dash-card">
                            <h3 className="tu-dash-card-title">Persona</h3>
                            <p className="tu-dash-card-desc">Choose your persona to get tailored tool suggestions</p>
                            <div className="tu-dash-persona-grid">
                                {Object.entries(PERSONAS).map(([key, p]) => (
                                    <button
                                        key={key}
                                        className={`tu-dash-persona-card${g?.persona === key ? ' tu-dash-persona-card--active' : ''}`}
                                        onClick={() => { g.setPersona(key); showAlert(`Persona changed to ${p.label}`, 'success') }}
                                    >
                                        <span className="tu-dash-persona-icon">{p.icon}</span>
                                        <span className="tu-dash-persona-label">{p.label}</span>
                                        {g?.persona === key && <span className="tu-dash-persona-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="tu-dash-card">
                            <h3 className="tu-dash-card-title">Appearance</h3>
                            <div className="tu-dash-settings-row">
                                <span className="tu-dash-settings-label">Theme</span>
                                <div className="tu-dash-theme-toggle">
                                    <button
                                        className={`tu-dash-theme-btn${mode === 'light' ? ' tu-dash-theme-btn--active' : ''}`}
                                        onClick={() => setMode('light')}
                                    >
                                        <span>☀️</span> Light
                                    </button>
                                    <button
                                        className={`tu-dash-theme-btn${mode === 'dark' ? ' tu-dash-theme-btn--active' : ''}`}
                                        onClick={() => setMode('dark')}
                                    >
                                        <span>🌙</span> Dark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Achievements ─── */}
                {activeSection === 'achievements' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Achievements</h2>
                        <p className="tu-dash-subtitle">{g?.achievements?.length || 0} of {ACHIEVEMENTS.length} unlocked — {ACHIEVEMENTS.length - (g?.achievements?.length || 0)} remaining</p>

                        {/* Progress bar */}
                        <div className="tu-dash-ach-progress">
                            <div className="tu-dash-ach-progress-fill" style={{ width: `${((g?.achievements?.length || 0) / ACHIEVEMENTS.length) * 100}%` }} />
                        </div>

                        <div className="tu-dash-achievements-grid">
                            {ACHIEVEMENTS.map(ach => {
                                const unlocked = g?.achievements?.includes(ach.id)
                                return (
                                    <div key={ach.id} className={`tu-dash-achievement${unlocked ? ' tu-dash-achievement--unlocked' : ''}`}>
                                        <span className="tu-dash-achievement-icon">{ach.icon}</span>
                                        <span className="tu-dash-achievement-label">{ach.label}</span>
                                        <span className="tu-dash-achievement-desc">{ach.description}</span>
                                        {unlocked && <span className="tu-dash-achievement-check">Unlocked</span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ─── Favorites ─── */}
                {activeSection === 'favorites' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Favorites</h2>
                        <p className="tu-dash-subtitle">{g?.favorites?.length || 0} tools favorited</p>
                        {(!g?.favorites || g.favorites.length === 0) ? (
                            <div className="tu-dash-empty-page">
                                <span className="tu-dash-empty-icon">❤️</span>
                                <span>No favorites yet</span>
                                <span className="tu-dash-empty-hint">Heart tools from the sidebar to add them here</span>
                            </div>
                        ) : (
                            <div className="tu-tpanel-list tu-dash-fav-panel">
                                {g.favorites.map(id => {
                                    const tool = TOOLS.find(t => t.id === id)
                                    if (!tool) return null
                                    return (
                                        <div key={id} className="tu-titem-wrap">
                                            <div className="tu-titem">
                                                <span className={`tu-titem-icon tu-titem-icon--${tool.color}`}>{tool.icon}</span>
                                                <span className="tu-titem-name">{tool.label}</span>
                                                <button
                                                    className="tu-titem-fav tu-titem-fav--active"
                                                    onClick={() => g.toggleFavorite(id)}
                                                    title="Remove from favorites"
                                                >♥</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Usage History ─── */}
                {activeSection === 'history' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Usage History</h2>
                        <p className="tu-dash-subtitle">This session's activity</p>

                        {recentOps.length === 0 ? (
                            <div className="tu-dash-empty-page">
                                <span className="tu-dash-empty-icon">📈</span>
                                <span>No activity this session</span>
                                <span className="tu-dash-empty-hint">Start using tools to see your history here</span>
                            </div>
                        ) : (
                            <div className="tu-dash-card">
                                <h3 className="tu-dash-card-title">Session Timeline ({recentOps.length} operations)</h3>
                                <div className="tu-dash-history-list">
                                    {[...recentOps].reverse().map((op, i) => {
                                        const tool = TOOLS.find(t => t.id === op.id)
                                        return (
                                            <div key={i} className="tu-dash-history-item">
                                                <span className="tu-dash-history-dot" />
                                                <span className="tu-dash-history-icon">{tool?.icon || '🔧'}</span>
                                                <span className="tu-dash-history-name">{tool?.label || op.id}</span>
                                                <span className="tu-dash-history-meta">
                                                    {op.isNew && <span className="tu-dash-history-new">NEW</span>}
                                                    {op.tab && <span className="tu-dash-history-tab">{op.tab}</span>}
                                                </span>
                                                <span className="tu-dash-history-time">
                                                    {new Date(op.time).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* All-time tool discovery */}
                        <div className="tu-dash-card">
                            <h3 className="tu-dash-card-title">Discovered Tools ({g?.discoveredTools?.length || 0}/{TOOLS.length})</h3>
                            <div className="tu-dash-discovered-progress">
                                <div className="tu-dash-discovered-progress-fill" style={{ width: `${((g?.discoveredTools?.length || 0) / TOOLS.length) * 100}%` }} />
                            </div>
                            <div className="tu-dash-discovered-grid">
                                {TOOLS.map(tool => {
                                    const discovered = g?.discoveredTools?.includes(tool.id)
                                    return (
                                        <div key={tool.id} className={`tu-dash-discovered${discovered ? '' : ' tu-dash-discovered--locked'}`} title={discovered ? `${tool.label} — ${g.toolsUsed?.[tool.id] || 0}x used` : '???'}>
                                            <span>{discovered ? tool.icon : '?'}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════════
   Subscription Tab — Inline pricing experience
   ══════════════════════════════════════════════════════════════════ */

const PRO_PRICES = { inr: '₹399', usd: '$5', gbp: '£4', eur: '€4.50' }

const POPULAR_PASS_IDS = ['day_single', 'day_triple', 'day_all', 'sprint_all']

function SubscriptionTab({ subscription, showAlert, navigate, isAuthenticated }) {
    const { data: catalog, isLoading: catalogLoading } = useGetPassCatalogQuery()
    const [buyingId, setBuyingId] = useState(null)

    const passes = catalog?.passes || []
    const creditPacks = catalog?.credit_packs || []
    const symbol = passes[0]?.symbol || '$'
    const currency = passes[0]?.currency || 'usd'
    const formatPrice = (price) => formatPriceUtil(price, currency, symbol)

    const popularPasses = useMemo(() =>
        POPULAR_PASS_IDS.map(id => passes.find(p => p.id === id)).filter(Boolean),
        [passes]
    )

    const handleBuy = async (type, id, toolIds = []) => {
        if (!isAuthenticated) {
            showAlert?.('Sign in to purchase', 'warning')
            navigate('/login')
            return
        }
        setBuyingId(id)
        try {
            if (type === 'pass') await subscription.handleBuyPass(id, toolIds)
            else await subscription.handleBuyCredits(id)
        } finally { setBuyingId(null) }
    }

    const handleUpgrade = () => {
        if (!isAuthenticated) { navigate('/login'); return }
        subscription.handleUpgrade()
    }

    return (
        <div className="tu-dash-content">
            <h2 className="tu-dash-title">Subscription</h2>
            <p className="tu-dash-subtitle">Manage your plan and billing</p>

            {/* ── Current Plan Status ── */}
            <div className={`tu-sub-plan-card${subscription?.isPro ? ' tu-sub-plan-card--pro' : ''}`}>
                <div className="tu-sub-plan-header">
                    <div className="tu-sub-plan-badge-wrap">
                        <div className={`tu-sub-plan-badge${subscription?.isPro ? ' tu-sub-plan-badge--pro' : ''}`}>
                            {subscription?.isPro ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            )}
                        </div>
                        <div className="tu-sub-plan-info">
                            <span className="tu-sub-plan-name">{subscription?.isPro ? 'Pro Plan' : 'Free Plan'}</span>
                            <span className="tu-sub-plan-desc">
                                {subscription?.isPro
                                    ? 'Unlimited access to all tools'
                                    : `3 free uses per tool per day${subscription?.totalCredits ? ` · ${subscription.totalCredits} credits` : ''}`
                                }
                            </span>
                        </div>
                    </div>
                    {subscription?.isPro && (
                        <button
                            className="tu-sub-btn tu-sub-btn--secondary"
                            onClick={() => { if (window.confirm('Cancel your Pro subscription?')) subscription.handleCancelSubscription() }}
                            disabled={subscription.cancelLoading}
                        >
                            {subscription.cancelLoading ? 'Cancelling...' : 'Manage Plan'}
                        </button>
                    )}
                </div>

                {!subscription?.isPro && (
                    <div className="tu-sub-plan-stats">
                        <div className="tu-sub-stat">
                            <span className="tu-sub-stat-val">{subscription?.totalCredits || 0}</span>
                            <span className="tu-sub-stat-label">Credits</span>
                        </div>
                        <div className="tu-sub-stat-divider" />
                        <div className="tu-sub-stat">
                            <span className="tu-sub-stat-val">3</span>
                            <span className="tu-sub-stat-label">Uses/day</span>
                        </div>
                        <div className="tu-sub-stat-divider" />
                        <div className="tu-sub-stat">
                            <span className="tu-sub-stat-val">70+</span>
                            <span className="tu-sub-stat-label">Tools</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Pro Upgrade Card (for free users) ── */}
            {!subscription?.isPro && (
                <motion.div
                    className="tu-sub-pro-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <div className="tu-sub-pro-glow" />
                    <div className="tu-sub-pro-content">
                        <div className="tu-sub-pro-left">
                            <div className="tu-sub-pro-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                                <span>Go Pro</span>
                            </div>
                            <p className="tu-sub-pro-desc">Unlimited access to every tool. No daily limits. Cancel anytime.</p>
                            <ul className="tu-sub-pro-perks">
                                <li>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    Unlimited uses on all 70+ tools
                                </li>
                                <li>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    Priority support
                                </li>
                                <li>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    30-day money-back guarantee
                                </li>
                            </ul>
                        </div>
                        <div className="tu-sub-pro-right">
                            <span className="tu-sub-pro-price">{PRO_PRICES[currency] || '$5'}<small>/mo</small></span>
                            <button
                                className="tu-sub-btn tu-sub-btn--primary tu-sub-btn--wide"
                                onClick={handleUpgrade}
                                disabled={subscription?.upgradeLoading}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                                {subscription?.upgradeLoading ? 'Loading...' : 'Upgrade to Pro'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Popular Passes ── */}
            {!subscription?.isPro && (
                <div className="tu-sub-section">
                    <div className="tu-sub-section-header">
                        <h3 className="tu-sub-section-title">Popular Passes</h3>
                        <button className="tu-sub-section-link" onClick={() => navigate('/pricing')}>
                            View all plans
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>

                    {catalogLoading ? (
                        <div className="tu-sub-loading">
                            <span className="tu-pass-spinner" /> Loading plans...
                        </div>
                    ) : (
                        <div className="tu-sub-pass-grid">
                            {popularPasses.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    className="tu-sub-pass-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.04 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <div className="tu-sub-pass-top">
                                        <span className="tu-sub-pass-name">{p.name}</span>
                                        <span className="tu-sub-pass-price">{formatPrice(p.price)}</span>
                                    </div>
                                    <span className="tu-sub-pass-subtitle">{p.subtitle}</span>
                                    <div className="tu-sub-pass-chips">
                                        <span className="tu-sub-chip">{p.uses_per_day}/day</span>
                                        <span className="tu-sub-chip">{p.tools === -1 ? 'All tools' : `${p.tools} tool${p.tools > 1 ? 's' : ''}`}</span>
                                        <span className="tu-sub-chip">{p.duration_days}d</span>
                                    </div>
                                    <button
                                        className="tu-sub-pass-buy"
                                        disabled={buyingId === p.id}
                                        onClick={() => handleBuy('pass', p.id)}
                                    >
                                        {buyingId === p.id ? <span className="tu-pass-spinner" /> : 'Buy'}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Credit Packs ── */}
            {!subscription?.isPro && creditPacks.length > 0 && (
                <div className="tu-sub-section">
                    <div className="tu-sub-section-header">
                        <h3 className="tu-sub-section-title">Credit Packs</h3>
                        <span className="tu-sub-section-hint">1 credit = 1 extra use, no expiry</span>
                    </div>
                    <div className="tu-sub-credit-grid">
                        {creditPacks.map((c, i) => (
                            <motion.div
                                key={c.id}
                                className="tu-sub-credit-card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.04 }}
                                whileHover={{ y: -2 }}
                            >
                                <span className="tu-sub-credit-amount">{c.credits}</span>
                                <span className="tu-sub-credit-label">credits</span>
                                <span className="tu-sub-credit-price">{formatPrice(c.price)}</span>
                                <span className="tu-sub-credit-per">{formatPrice(c.price / c.credits)}/use</span>
                                <button
                                    className="tu-sub-pass-buy"
                                    disabled={buyingId === c.id}
                                    onClick={() => handleBuy('credit', c.id)}
                                >
                                    {buyingId === c.id ? <span className="tu-pass-spinner" /> : 'Buy'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Plan Comparison ── */}
            <div className="tu-sub-compare">
                <h3 className="tu-sub-compare-title">Plan Comparison</h3>
                <div className="tu-sub-compare-table">
                    <div className="tu-sub-compare-head">
                        <span className="tu-sub-compare-feature">Feature</span>
                        <span className="tu-sub-compare-col">Free</span>
                        <span className="tu-sub-compare-col tu-sub-compare-col--pro">Pro</span>
                    </div>
                    {[
                        ['All Tools', '3/day per tool', 'Unlimited', true],
                        ['Local Tools', 'All', 'All', false],
                        ['Gamification', 'Full', 'Full', false],
                        ['Templates', 'Full', 'Full', false],
                        ['Priority Support', false, true, true],
                        ['Early Access', false, true, true],
                    ].map(([feature, free, pro, highlight]) => (
                        <div className={`tu-sub-compare-row${highlight ? ' tu-sub-compare-row--highlight' : ''}`} key={feature}>
                            <span className="tu-sub-compare-feature">{feature}</span>
                            <span className="tu-sub-compare-col tu-sub-compare-col--free">
                                {free === true ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : free === false ? (
                                    <span className="tu-sub-compare-dash">—</span>
                                ) : free}
                            </span>
                            <span className="tu-sub-compare-col tu-sub-compare-col--pro">
                                {pro === true ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : (
                                    <strong>{pro}</strong>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {!subscription?.isPro && (
                    <div className="tu-sub-compare-cta">
                        <button className="tu-sub-btn tu-sub-btn--primary tu-sub-btn--wide" onClick={handleUpgrade}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            Unlock Pro — {PRO_PRICES[currency] || '$5'}/mo
                        </button>
                        <button className="tu-sub-section-link tu-sub-link--center" onClick={() => navigate('/pricing')}>
                            View full pricing page
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
