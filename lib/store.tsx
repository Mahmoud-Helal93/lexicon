"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { PersistedState, WordOrder } from "./types"

const STORAGE_KEY = "gre-vocab-state-v1"
const SELECTION_KEY = "gre-vocab-selection-v1"
const SETTINGS_KEY = "gre-vocab-settings-v1"

const DEFAULT_STATE: PersistedState = {
  bookmarks: [],
  masteredWords: [],
  studyStats: { sessionsCompleted: 0, totalKnownMarks: 0, totalRepeats: 0, lastStudied: null },
  practiceStats: { sessionsCompleted: 0, totalAnswered: 0, totalCorrect: 0, lastPracticed: null },
}

export interface Selection {
  groups: number[]
  includeBookmarks: boolean
}

const DEFAULT_SELECTION: Selection = { groups: [], includeBookmarks: false }

interface StudyPracticeSettings {
  studyOrder: WordOrder
  practiceOrder: WordOrder
}

const DEFAULT_SETTINGS: StudyPracticeSettings = { studyOrder: "random", practiceOrder: "random" }

interface StoreValue {
  hydrated: boolean
  state: PersistedState
  selection: Selection
  setSelection: (s: Selection) => void
  settings: StudyPracticeSettings
  setStudyOrder: (v: WordOrder) => void
  setPracticeOrder: (v: WordOrder) => void
  isBookmarked: (id: string) => boolean
  toggleBookmark: (id: string) => void
  addBookmarks: (ids: string[]) => void
  clearBookmarks: () => void
  isMastered: (id: string) => boolean
  markMastered: (ids: string[]) => void
  recordStudySession: (knownMarks: number, repeats: number) => void
  recordPracticeSession: (answered: number, correct: number) => void
  resetStudyProgress: () => void
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE)
  const [selection, setSelectionState] = useState<Selection>(DEFAULT_SELECTION)
  const [settings, setSettings] = useState<StudyPracticeSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>
        setState({
          ...DEFAULT_STATE,
          ...parsed,
          studyStats: { ...DEFAULT_STATE.studyStats, ...parsed.studyStats },
          practiceStats: { ...DEFAULT_STATE.practiceStats, ...parsed.practiceStats },
          bookmarks: parsed.bookmarks ?? [],
          masteredWords: parsed.masteredWords ?? [],
        })
      }
      const sel = sessionStorage.getItem(SELECTION_KEY)
      if (sel) setSelectionState(JSON.parse(sel))
      const storedSettings = localStorage.getItem(SETTINGS_KEY)
      if (storedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) })
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated])

  const setSelection = useCallback((s: Selection) => {
    setSelectionState(s)
    try {
      sessionStorage.setItem(SELECTION_KEY, JSON.stringify(s))
    } catch {
      // ignore
    }
  }, [])

  const setStudyOrder = useCallback((v: WordOrder) => setSettings((prev) => ({ ...prev, studyOrder: v })), [])
  const setPracticeOrder = useCallback((v: WordOrder) => setSettings((prev) => ({ ...prev, practiceOrder: v })), [])

  const bookmarkSet = useMemo(() => new Set(state.bookmarks), [state.bookmarks])
  const masteredSet = useMemo(() => new Set(state.masteredWords), [state.masteredWords])

  const isBookmarked = useCallback((id: string) => bookmarkSet.has(id), [bookmarkSet])
  const isMastered = useCallback((id: string) => masteredSet.has(id), [masteredSet])

  const toggleBookmark = useCallback((id: string) => {
    setState((prev) => {
      const set = new Set(prev.bookmarks)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return { ...prev, bookmarks: Array.from(set) }
    })
  }, [])

  const addBookmarks = useCallback((ids: string[]) => {
    setState((prev) => {
      const set = new Set(prev.bookmarks)
      for (const id of ids) set.add(id)
      return { ...prev, bookmarks: Array.from(set) }
    })
  }, [])

  const clearBookmarks = useCallback(() => {
    setState((prev) => ({ ...prev, bookmarks: [] }))
  }, [])

  const markMastered = useCallback((ids: string[]) => {
    setState((prev) => {
      const set = new Set(prev.masteredWords)
      for (const id of ids) set.add(id)
      return { ...prev, masteredWords: Array.from(set) }
    })
  }, [])

  const recordStudySession = useCallback((knownMarks: number, repeats: number) => {
    setState((prev) => ({
      ...prev,
      studyStats: {
        sessionsCompleted: prev.studyStats.sessionsCompleted + 1,
        totalKnownMarks: prev.studyStats.totalKnownMarks + knownMarks,
        totalRepeats: prev.studyStats.totalRepeats + repeats,
        lastStudied: new Date().toISOString(),
      },
    }))
  }, [])

  const recordPracticeSession = useCallback((answered: number, correct: number) => {
    setState((prev) => ({
      ...prev,
      practiceStats: {
        sessionsCompleted: prev.practiceStats.sessionsCompleted + 1,
        totalAnswered: prev.practiceStats.totalAnswered + answered,
        totalCorrect: prev.practiceStats.totalCorrect + correct,
        lastPracticed: new Date().toISOString(),
      },
    }))
  }, [])

  const resetStudyProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      masteredWords: [],
      studyStats: DEFAULT_STATE.studyStats,
    }))
  }, [])

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  const value: StoreValue = {
    hydrated,
    state,
    selection,
    setSelection,
    settings,
    setStudyOrder,
    setPracticeOrder,
    isBookmarked,
    toggleBookmark,
    addBookmarks,
    clearBookmarks,
    isMastered,
    markMastered,
    recordStudySession,
    recordPracticeSession,
    resetStudyProgress,
    resetAll,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
