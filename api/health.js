import { loadEnv } from '../server/loadEnv.js'
import { isTursoConfigured } from '../server/db.js'

export default async function handler(req, res) {
  await loadEnv()

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const raw = process.env.GEMINI_API_KEY
  const geminiConfigured = Boolean(raw?.trim())

  res.json({
    ok: true,
    geminiConfigured,
    tursoConfigured: isTursoConfigured(),
    hosting: process.env.VERCEL ? 'vercel' : 'local',
    vercelEnv: process.env.VERCEL_ENV || null,
    geminiEnvPresent: raw !== undefined && raw !== null,
  })
}
