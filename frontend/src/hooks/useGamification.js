import { useState, useCallback, useEffect, useRef } from 'react'
import { TOOLS, ACHIEVEMENTS, QUEST_TEMPLATES, LEVELS } from '../constants/tools'

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
  // Deterministic daily pick — hash the day number for better distribution
  const day = Date.now() / 86400000 | 0
  const hash = ((day * 2654435761) >>> 0) // Knuth multiplicative hash
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

const DEFAULT_STATE = {
  persona: null,
  themeSkin: null,
  toolsUsed: {},
  discoveredTools: [],
  totalOps: 0,
  totalChars: 0,
  xp: 0,
  streak: { current: 0, lastDate: null },
  achievements: [],
  favorites: [],
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

  // Persist to localStorage on state change (debounced to avoid excessive writes)
  useEffect(() => {
    const timer = setTimeout(() => {
      const { sessionOps, ...persistable } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
    }, 500)
    return () => clearTimeout(timer)
  }, [state])

  // Check streak on mount
  useEffect(() => {
    setState(prev => {
      const d = today()
      const streak = { ...prev.streak }
      if (streak.lastDate === d) return prev // Already counted today
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
    // Keep only last 60s of timestamps
    speedTimestamps.current = speedTimestamps.current.filter(t => now - t < 60000)

    setState(prev => {
      const tool = TOOLS.find(t => t.id === toolId)
      const isNew = !prev.discoveredTools.includes(toolId)
      const isAi = tool?.tabs?.includes('ai')
      const isDev = tool?.tabs?.includes('code')
      const firstTab = tool?.tabs?.[0] || 'transform'

      // XP calculation
      let xpEarned = 10
      if (isNew) xpEarned += 25

      const toolsUsed = { ...prev.toolsUsed, [toolId]: (prev.toolsUsed[toolId] || 0) + 1 }
      const discoveredTools = isNew ? [...prev.discoveredTools, toolId] : prev.discoveredTools
      const totalOps = prev.totalOps + 1
      const totalChars = prev.totalChars + charCount
      const xp = prev.xp + xpEarned
      const streak = { ...prev.streak, lastDate: today(), current: prev.streak.current || 1 }

      const sessionOps = [...prev.sessionOps, { id: toolId, tab: firstTab, isNew, time: now }]

      // Check daily quest
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

      // Build achievement check state
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

      // Check for new achievements
      let achievements = [...prev.achievements]
      let newUnlock = null
      for (const a of ACHIEVEMENTS) {
        if (!achievements.includes(a.id) && a.condition(achieveState)) {
          achievements = [...achievements, a.id]
          newUnlock = a
          xpEarned += 100
        }
      }

      // Trigger XP animation
      setTimeout(() => setXpGain(xpEarned), 0)
      setTimeout(() => setXpGain(null), 2000)

      if (newUnlock) {
        setTimeout(() => setNewAchievement(newUnlock), 300)
        setTimeout(() => setNewAchievement(null), 4000)
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
      const favorites = prev.favorites.includes(toolId)
        ? prev.favorites.filter(id => id !== toolId)
        : [...prev.favorites, toolId]
      return { ...prev, favorites }
    })
  }, [])

  const setPersona = useCallback((persona) => {
    setState(prev => ({ ...prev, persona }))
  }, [])

  const setThemeSkin = useCallback((themeSkin) => {
    setState(prev => ({ ...prev, themeSkin }))
  }, [])

  const savePipeline = useCallback((pipeline) => {
    setState(prev => ({
      ...prev,
      savedPipelines: [...prev.savedPipelines, pipeline],
    }))
  }, [])

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
    xpGain,
    onboarded: !!state.persona,
    recordToolUse,
    toggleFavorite,
    setPersona,
    setThemeSkin,
    savePipeline,
  }
}
