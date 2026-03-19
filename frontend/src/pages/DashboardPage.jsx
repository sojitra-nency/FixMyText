import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TOOLS, ACHIEVEMENTS, LEVELS, PERSONAS, QUEST_TEMPLATES, USE_CASE_TABS } from '../constants/tools'

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
                    if (tab !== 'popular') cats[tab] = (cats[tab] || 0) + count
                })
            }
        })
        return USE_CASE_TABS
            .filter(t => t.id !== 'popular' && cats[t.id])
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
                {activeSection === 'subscription' && (
                    <div className="tu-dash-content">
                        <h2 className="tu-dash-title">Subscription</h2>
                        <p className="tu-dash-subtitle">Manage your plan and billing</p>

                        <div className="tu-dash-sub-card">
                            <div className={`tu-dash-sub-icon tu-dash-sub-icon--${subscription?.isPro ? 'pro' : 'free'}`}>
                                {subscription?.isPro ? '⚡' : '🆓'}
                            </div>
                            <div className="tu-dash-sub-info">
                                <span className={`tu-dash-sub-tier${subscription?.isPro ? ' tu-dash-sub-tier--pro' : ''}`}>
                                    {subscription?.isPro ? 'Pro Plan' : 'Free Plan'}
                                </span>
                                <span className="tu-dash-sub-detail">
                                    {subscription?.isPro
                                        ? 'Unlimited access to all tools'
                                        : `3 free uses per tool per day${subscription?.totalCredits ? ` · ${subscription.totalCredits} credits` : ''}`
                                    }
                                </span>
                            </div>
                            <div className="tu-dash-sub-actions">
                                {subscription?.isPro ? (
                                    <button
                                        className="tu-dash-sub-btn tu-dash-sub-btn--manage"
                                        onClick={() => { if (window.confirm('Cancel your Pro subscription? You will lose unlimited access at the end of the current billing period.')) subscription.handleCancelSubscription() }}
                                        disabled={subscription.cancelLoading}
                                    >
                                        {subscription.cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
                                    </button>
                                ) : (
                                    <button
                                        className="tu-dash-sub-btn tu-dash-sub-btn--upgrade"
                                        onClick={subscription.handleUpgrade}
                                        disabled={subscription.upgradeLoading}
                                    >
                                        {subscription.upgradeLoading ? 'Loading...' : 'Upgrade to Pro'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Plan comparison */}
                        <div className="tu-dash-card">
                            <h3 className="tu-dash-card-title">Plan Comparison</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border, #3c3c3c)' }}>
                                        <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-muted)' }}>Feature</th>
                                        <th style={{ textAlign: 'center', padding: '8px', color: 'var(--text-muted)' }}>Free</th>
                                        <th style={{ textAlign: 'center', padding: '8px', color: 'var(--accent, #007acc)' }}>Pro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['All Tools', '3 uses/day per tool', 'Unlimited'],
                                        ['Local Tools', 'All', 'All'],
                                        ['Gamification', 'Full', 'Full'],
                                        ['Templates', 'Full', 'Full'],
                                        ['Priority Support', '—', '✓'],
                                    ].map(([feature, free, pro]) => (
                                        <tr key={feature} style={{ borderBottom: '1px solid var(--border, #3c3c3c)' }}>
                                            <td style={{ padding: '8px', color: 'var(--text)' }}>{feature}</td>
                                            <td style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>{free}</td>
                                            <td style={{ padding: '8px', textAlign: 'center', color: 'var(--text)' }}>{pro}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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
