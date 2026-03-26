import { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  useGetGamificationQuery, useUpdateGamificationMutation,
  useUpdatePreferencesMutation, useGetPreferencesQuery,
  useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation,
} from '../store/api/userDataApi'
import { TOOLS, ACHIEVEMENTS, QUEST_TEMPLATES, LEVELS } from '../constants/tools'

// localStorage is a read-cache for pre-auth display speed only — never the source of truth.
const STORAGE_KEY = 'fmx_gamification'

// Pre-compute static tool ID sets (TOOLS never changes)
const AI_TOOL_IDS = TOOLS.filter(t => t.tabs?.includes('ai')).map(t => t.id)
const DEV_TOOL_IDS = TOOLS.filter(t => t.tabs?.includes('code')).map(t => t.id)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function pickDailyQuest(completed = []) {
  const available = QUEST_TEMPLATES.filter(q => !completed.includes(q.id))
  const pool = available.length > 0 ? available : QUEST_TEMPLATES
  const day = Date.now() / 86400000 | 0
  const hash = ((day * 2654435761) >>> 0)
  return pool[hash % pool.length]
}

function getLevel(xp) {
  let lvl = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xp) lvl = l
    else break
  }
  return lvl
}

/** Convert API response (flat) to hook state shape (nested).
 *  Note: favorites are NOT included here — they load from GET /user/favorites. */
function apiToState(api) {
  return {
    persona: null, // persona is in preferences, not gamification
    toolsUsed: api.tools_used || {},
    discoveredTools: api.discovered_tools || [],
    totalOps: api.total_ops || 0,
    totalChars: api.total_chars || 0,
    xp: api.xp || 0,
    streak: { current: api.streak_current || 0, lastDate: api.streak_last_date || null },
    achievements: api.achievements || [],
    dailyQuest: {
      id: api.daily_quest_id || null,
      date: api.daily_quest_date || null,
      completed: api.daily_quest_completed || false,
    },
    savedPipelines: api.saved_pipelines || [],
    completedQuests: api.completed_quests || [],
  }
}

/** Convert hook state (nested) to API payload (flat).
 *  favorites are excluded — managed via dedicated /user/favorites endpoint. */
function stateToApi(s) {
  return {
    xp: s.xp,
    streak_current: s.streak.current,
    streak_last_date: s.streak.lastDate,
    total_ops: s.totalOps,
    total_chars: s.totalChars,
    tools_used: s.toolsUsed,
    discovered_tools: s.discoveredTools,
    achievements: s.achievements,
    saved_pipelines: s.savedPipelines,
    completed_quests: s.completedQuests,
    daily_quest_id: s.dailyQuest.id,
    daily_quest_date: s.dailyQuest.date,
    daily_quest_completed: s.dailyQuest.completed,
  }
}

const DEFAULT_STATE = {
  persona: null,
  toolsUsed: {},
  discoveredTools: [],
  totalOps: 0,
  totalChars: 0,
  xp: 0,
  streak: { current: 0, lastDate: null },
  achievements: [],
  favorites: [], // populated from GET /user/favorites when authenticated
  dailyQuest: { id: null, date: null, completed: false },
  savedPipelines: [],
  completedQuests: [],
  sessionOps: [],
}

export default function useGamification() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return saved ? { ...DEFAULT_STATE, ...saved, sessionOps: [] } : { ...DEFAULT_STATE }
  })

  const speedTimestamps = useRef([])
  const [newAchievement, setNewAchievement] = useState(null)
  const [xpGain, setXpGain] = useState(null)
  const hydrated = useRef(false)

  // Auth state from Redux
  const accessToken = useSelector((s) => s.auth.accessToken)
  const isAuthenticated = !!accessToken

  // RTK Query — fetch gamification + preferences + favorites from DB when authenticated
  const { data: dbGamification } = useGetGamificationQuery(undefined, { skip: !isAuthenticated })
  const { data: dbPrefs } = useGetPreferencesQuery(undefined, { skip: !isAuthenticated })
  const { data: dbFavorites } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })
  const [syncToDb] = useUpdateGamificationMutation()
  const [syncPrefs] = useUpdatePreferencesMutation()
  const [apiAddFavorite] = useAddFavoriteMutation()
  const [apiRemoveFavorite] = useRemoveFavoriteMutation()

  // Hydrate from DB on first fetch (DB is authoritative; localStorage was read-only pre-auth cache)
  useEffect(() => {
    if (dbGamification && !hydrated.current) {
      hydrated.current = true
      const dbState = apiToState(dbGamification)
      setState(prev => {
        const merged = { ...prev, ...dbState, sessionOps: prev.sessionOps }
        if (dbPrefs) {
          merged.persona = dbPrefs.persona || prev.persona
        }
        return merged
      })
    }
  }, [dbGamification, dbPrefs])

  // Hydrate favorites from dedicated endpoint
  useEffect(() => {
    if (dbFavorites) {
      const ids = dbFavorites.favorites.map(f => f.tool_id)
      setState(prev => ({ ...prev, favorites: ids }))
    }
  }, [dbFavorites])

  // Reset hydration flag on logout
  useEffect(() => {
    if (!isAuthenticated) hydrated.current = false
  }, [isAuthenticated])

  // Sync to DB on state change (debounced). localStorage is NOT written — DB is source of truth.
  useEffect(() => {
    if (!isAuthenticated) return
    const timer = setTimeout(() => {
      syncToDb(stateToApi(state)).unwrap().catch(() => {})
    }, 500)
    return () => clearTimeout(timer)
  }, [state, isAuthenticated, syncToDb])

  // Check streak on mount
  useEffect(() => {
    setState(prev => {
      const d = today()
      const streak = { ...prev.streak }
      if (streak.lastDate === d) return prev
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yStr = yesterday.toISOString().slice(0, 10)
      if (streak.lastDate === yStr) {
        streak.current += 1
        streak.lastDate = d
      } else if (streak.lastDate !== d) {
        streak.current = streak.lastDate ? 0 : 0
        streak.lastDate = d
      }
      return { ...prev, streak }
    })
  }, [])

  // Ensure daily quest
  useEffect(() => {
    setState(prev => {
      const d = today()
      if (prev.dailyQuest.date === d) return prev
      const quest = pickDailyQuest(prev.completedQuests)
      return { ...prev, dailyQuest: { id: quest.id, date: d, completed: false } }
    })
  }, [])

  const recordToolUse = useCallback((toolId, charCount = 0) => {
    const now = Date.now()
    speedTimestamps.current.push(now)
    speedTimestamps.current = speedTimestamps.current.filter(t => now - t < 60000)

    setState(prev => {
      const tool = TOOLS.find(t => t.id === toolId)
      const isNew = !prev.discoveredTools.includes(toolId)
      const firstTab = tool?.tabs?.[0] || 'transform'

      let xpEarned = 10
      if (isNew) xpEarned += 25

      const toolsUsed = { ...prev.toolsUsed, [toolId]: (prev.toolsUsed[toolId] || 0) + 1 }
      const discoveredTools = isNew ? [...prev.discoveredTools, toolId] : prev.discoveredTools
      const totalOps = prev.totalOps + 1
      const totalChars = prev.totalChars + charCount
      const streak = { ...prev.streak, lastDate: today(), current: prev.streak.current || 1 }

      const sessionOps = [...prev.sessionOps, { id: toolId, tab: firstTab, isNew, time: now }]

      let dailyQuest = { ...prev.dailyQuest }
      let completedQuests = [...prev.completedQuests]
      if (!dailyQuest.completed && dailyQuest.id) {
        const questDef = QUEST_TEMPLATES.find(q => q.id === dailyQuest.id)
        if (questDef?.check(sessionOps)) {
          dailyQuest = { ...dailyQuest, completed: true }
          completedQuests = [...completedQuests, dailyQuest.id]
          xpEarned += questDef.xp
        }
      }

      const translateOpts = TOOLS.find(t => t.id === 'translate')?.options || []
      const langCount = translateOpts.filter(([v]) => toolsUsed['translate'] && prev.discoveredTools.includes('translate')).length

      const hour = new Date().getHours()
      const achieveState = {
        totalOps,
        discoveredTools,
        sessionOps: sessionOps.length,
        speedCount: speedTimestamps.current.length,
        aiToolsUsed: discoveredTools.filter(id => AI_TOOL_IDS.includes(id)).length,
        devToolsUsed: discoveredTools.filter(id => DEV_TOOL_IDS.includes(id)).length,
        languagesUsed: langCount,
        streak: streak.current,
        totalChars,
        favoritesCount: prev.favorites.length,
        savedPipelines: prev.savedPipelines.length,
        nightOwl: hour >= 0 && hour < 5,
        earlyBird: hour >= 5 && hour < 7,
      }

      let achievements = [...prev.achievements]
      let newUnlock = null
      for (const a of ACHIEVEMENTS) {
        if (!achievements.includes(a.id) && a.condition(achieveState)) {
          achievements = [...achievements, a.id]
          newUnlock = a
          xpEarned += 100
        }
      }

      setTimeout(() => setXpGain(xpEarned), 0)
      setTimeout(() => setXpGain(null), 2000)

      if (newUnlock) {
        setTimeout(() => setNewAchievement(newUnlock), 300)
        setTimeout(() => setNewAchievement(null), 6000)
      }

      return {
        ...prev, toolsUsed, discoveredTools, totalOps, totalChars,
        xp: prev.xp + xpEarned, streak, achievements,
        dailyQuest, completedQuests, sessionOps,
      }
    })
  }, [])

  const toggleFavorite = useCallback((toolId) => {
    setState(prev => {
      const isFav = prev.favorites.includes(toolId)
      if (isAuthenticated) {
        if (isFav) apiRemoveFavorite(toolId).unwrap().catch(() => {})
        else apiAddFavorite(toolId).unwrap().catch(() => {})
      }
      const favorites = isFav
        ? prev.favorites.filter(id => id !== toolId)
        : [...prev.favorites, toolId]
      return { ...prev, favorites }
    })
  }, [isAuthenticated, apiAddFavorite, apiRemoveFavorite])

  const setPersona = useCallback((persona) => {
    setState(prev => ({ ...prev, persona }))
    if (isAuthenticated) {
      syncPrefs({ persona }).unwrap().catch(() => {})
    }
  }, [isAuthenticated, syncPrefs])

  const level = getLevel(state.xp)
  const nextLevel = LEVELS.find(l => l.xp > state.xp) || level
  const xpProgress = nextLevel.xp > level.xp
    ? ((state.xp - level.xp) / (nextLevel.xp - level.xp)) * 100
    : 100

  return {
    ...state,
    level,
    nextLevel,
    xpProgress,
    newAchievement,
    dismissAchievement: () => setNewAchievement(null),
    xpGain,
    onboarded: !!state.persona,
    recordToolUse,
    toggleFavorite,
    setPersona,
  }
}
