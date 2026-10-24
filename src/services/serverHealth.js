let cache = null
let cacheAt = 0
const TTL_MS = 60_000

export async function getServerHealth(force = false) {
  const now = Date.now()
  if (!force && cache && now - cacheAt < TTL_MS) return cache

  try {
    const res = await fetch('/api/health')
    cache = await res.json()
  } catch {
    cache = {
      ok: false,
      geminiConfigured: false,
      tursoConfigured: false,
    }
  }
  cacheAt = now
  return cache
}
