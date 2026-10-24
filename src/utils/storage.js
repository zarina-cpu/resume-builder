import { createInitialResume, createInitialSettings } from '../models/resume'
import { getServerHealth } from '../services/serverHealth'

const CLIENT_ID_KEY = 'resume-builder:client-id'
const RESUME_CACHE_KEY = 'resume-builder:resume-cache'
const SETTINGS_CACHE_KEY = 'resume-builder:settings-cache'
const LEGACY_RESUME_KEY = 'resume-builder:resume'
const LEGACY_SETTINGS_KEY = 'resume-builder:settings'

let saveTimer = null
let pendingSave = null

function mergeResume(saved) {
  const base = createInitialResume()
  if (!saved) return base
  return {
    ...base,
    ...saved,
    profile: {
      ...base.profile,
      ...saved.profile,
      contacts: { ...base.profile.contacts, ...saved.profile?.contacts },
    },
    ai: { ...base.ai, ...saved.ai },
  }
}

export function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function loadLegacyLocal() {
  try {
    const resumeRaw = localStorage.getItem(LEGACY_RESUME_KEY)
    const settingsRaw = localStorage.getItem(LEGACY_SETTINGS_KEY)
    if (!resumeRaw && !settingsRaw) return null
    return {
      resume: resumeRaw ? mergeResume(JSON.parse(resumeRaw)) : createInitialResume(),
      settings: settingsRaw
        ? { ...createInitialSettings(), ...JSON.parse(settingsRaw) }
        : createInitialSettings(),
    }
  } catch {
    return null
  }
}

function loadLocalCache() {
  try {
    let resumeRaw = localStorage.getItem(RESUME_CACHE_KEY)
    let settingsRaw = localStorage.getItem(SETTINGS_CACHE_KEY)

    if (!resumeRaw && !settingsRaw) {
      const legacy = loadLegacyLocal()
      if (legacy) {
        writeLocalCache(legacy.resume, legacy.settings)
        localStorage.removeItem(LEGACY_RESUME_KEY)
        localStorage.removeItem(LEGACY_SETTINGS_KEY)
        return legacy
      }
    }

    return {
      resume: resumeRaw ? mergeResume(JSON.parse(resumeRaw)) : createInitialResume(),
      settings: settingsRaw
        ? { ...createInitialSettings(), ...JSON.parse(settingsRaw) }
        : createInitialSettings(),
    }
  } catch {
    return { resume: createInitialResume(), settings: createInitialSettings() }
  }
}

function writeLocalCache(resume, settings) {
  localStorage.setItem(RESUME_CACHE_KEY, JSON.stringify(resume))
  localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings))
}

export async function loadRemoteData() {
  const clientId = getClientId()
  const health = await getServerHealth()

  if (!health.tursoConfigured) {
    const local = loadLocalCache()
    return { ...local, source: 'local', clientId }
  }

  try {
    const res = await fetch(`/api/data?clientId=${encodeURIComponent(clientId)}`)
    if (res.status === 404) {
      const local = loadLocalCache()
      return { ...local, source: 'local', clientId }
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `HTTP ${res.status}`)
    }
    const data = await res.json()
    writeLocalCache(mergeResume(data.resume), {
      ...createInitialSettings(),
      ...data.settings,
    })
    return {
      resume: mergeResume(data.resume),
      settings: { ...createInitialSettings(), ...data.settings },
      source: 'turso',
      clientId,
    }
  } catch (err) {
    console.warn('Turso load failed, using local cache:', err.message)
    const local = loadLocalCache()
    return { ...local, source: 'local-fallback', clientId, error: err.message }
  }
}

async function putRemoteData(resume, settings) {
  const health = await getServerHealth()
  if (!health.tursoConfigured) return

  const clientId = getClientId()
  const res = await fetch(`/api/data?clientId=${encodeURIComponent(clientId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId },
    body: JSON.stringify({ resume, settings }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
}

export function scheduleRemoteSave(resume, settings, delayMs = 800) {
  writeLocalCache(resume, settings)
  pendingSave = { resume, settings }

  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    const payload = pendingSave
    pendingSave = null
    if (!payload) return
    try {
      await putRemoteData(payload.resume, payload.settings)
    } catch (err) {
      console.warn('Turso save failed (kept in local cache):', err.message)
    }
  }, delayMs)
}

/** @deprecated use loadRemoteData */
export function loadResume() {
  return loadLocalCache().resume
}

/** @deprecated use scheduleRemoteSave */
export function saveResume(data) {
  const settings = loadLocalCache().settings
  scheduleRemoteSave(data, settings, 0)
}

/** @deprecated */
export function loadSettings() {
  return loadLocalCache().settings
}

/** @deprecated */
export function saveSettings(settings) {
  const resume = loadLocalCache().resume
  scheduleRemoteSave(resume, settings, 0)
}
