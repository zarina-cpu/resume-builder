import { initDb, isTursoConfigured } from './db.js'

let dbInitPromise = null

export function ensureDbReady() {
  if (!isTursoConfigured()) return Promise.resolve(false)
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      dbInitPromise = null
      console.error('Turso init failed:', err.message)
      throw err
    })
  }
  return dbInitPromise
}
