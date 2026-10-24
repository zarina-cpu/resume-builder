import { createClient } from '@libsql/client'

let client = null

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim() && process.env.TURSO_AUTH_TOKEN?.trim())
}

export function getTursoClient() {
  if (!isTursoConfigured()) return null
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL.trim(),
      authToken: process.env.TURSO_AUTH_TOKEN.trim(),
    })
  }
  return client
}

export async function initDb() {
  const db = getTursoClient()
  if (!db) return false

  await db.execute(`
    CREATE TABLE IF NOT EXISTS client_data (
      client_id TEXT PRIMARY KEY,
      resume_json TEXT NOT NULL,
      settings_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)
  return true
}

export async function loadClientData(clientId) {
  const db = getTursoClient()
  if (!db) throw new Error('Turso не настроен')

  const result = await db.execute({
    sql: 'SELECT resume_json, settings_json FROM client_data WHERE client_id = ?',
    args: [clientId],
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  return {
    resume: JSON.parse(row.resume_json),
    settings: JSON.parse(row.settings_json),
  }
}

export async function saveClientData(clientId, resume, settings) {
  const db = getTursoClient()
  if (!db) throw new Error('Turso не настроен')

  const now = Date.now()
  await db.execute({
    sql: `
      INSERT INTO client_data (client_id, resume_json, settings_json, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(client_id) DO UPDATE SET
        resume_json = excluded.resume_json,
        settings_json = excluded.settings_json,
        updated_at = excluded.updated_at
    `,
    args: [clientId, JSON.stringify(resume), JSON.stringify(settings), now],
  })
}
