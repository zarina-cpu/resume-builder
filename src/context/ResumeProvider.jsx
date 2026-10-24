import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { createInitialResume, createInitialSettings } from '../models/resume'
import { loadRemoteData, scheduleRemoteSave } from '../utils/storage'

const ResumeContext = createContext(null)

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resume: action.payload }
    case 'PATCH_RESUME':
      return { ...state, resume: { ...state.resume, ...action.payload } }
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }
    case 'PATCH_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'SET_AI':
      return {
        ...state,
        resume: { ...state.resume, ai: { ...state.resume.ai, ...action.payload } },
      }
    default:
      return state
  }
}

function applyThemeClass(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function ResumeProvider({ children }) {
  const [hydrated, setHydrated] = useState(false)
  const [storageSource, setStorageSource] = useState('')
  const [state, dispatch] = useReducer(resumeReducer, {
    resume: createInitialResume(),
    settings: createInitialSettings(),
  })

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const loaded = await loadRemoteData()
      if (cancelled) return

      const theme =
        loaded.settings.theme ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

      applyThemeClass(theme)
      dispatch({ type: 'SET_RESUME', payload: loaded.resume })
      dispatch({ type: 'SET_SETTINGS', payload: { ...loaded.settings, theme } })
      setStorageSource(loaded.source || 'unknown')

      if (loaded.source === 'local' || loaded.source === 'local-fallback') {
        scheduleRemoteSave(loaded.resume, { ...loaded.settings, theme })
      }

      setHydrated(true)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    scheduleRemoteSave(state.resume, state.settings)
  }, [state.resume, state.settings, hydrated])

  useEffect(() => {
    if (!hydrated) return
    applyThemeClass(state.settings.theme)
  }, [state.settings.theme, hydrated])

  const value = useMemo(
    () => ({
      resume: state.resume,
      settings: state.settings,
      storageSource,
      setResume: (data) => dispatch({ type: 'SET_RESUME', payload: data }),
      patchResume: (patch) => dispatch({ type: 'PATCH_RESUME', payload: patch }),
      setSettings: (s) => dispatch({ type: 'SET_SETTINGS', payload: s }),
      patchSettings: (patch) => dispatch({ type: 'PATCH_SETTINGS', payload: patch }),
      setAi: (ai) => dispatch({ type: 'SET_AI', payload: ai }),
    }),
    [state.resume, state.settings, storageSource],
  )

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
