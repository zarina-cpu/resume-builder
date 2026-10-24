import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateResumeTexts } from './geminiService.js'
import { isTursoConfigured, loadClientData, saveClientData } from './db.js'
import { parseClientId } from './clientId.js'
import { ensureDbReady } from './ensureDbReady.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')

const app = express()

app.use(cors())
app.use(express.json({ limit: '4mb' }))

app.use(async (_req, _res, next) => {
  try {
    await ensureDbReady()
  } catch {
    /* Turso optional; routes return 503 when not configured */
  }
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    tursoConfigured: isTursoConfigured(),
  })
})

app.get('/api/data', async (req, res) => {
  const clientId = parseClientId(req)
  if (!clientId) {
    return res.status(400).json({ error: 'Некорректный clientId (ожидается UUID)' })
  }
  if (!isTursoConfigured()) {
    return res.status(503).json({ error: 'Turso не настроен на сервере' })
  }

  try {
    const data = await loadClientData(clientId)
    if (!data) return res.status(404).json({ error: 'not_found' })
    res.json(data)
  } catch (err) {
    console.error('GET /api/data:', err)
    res.status(500).json({ error: err.message || 'Ошибка чтения данных' })
  }
})

app.put('/api/data', async (req, res) => {
  const clientId = parseClientId(req)
  if (!clientId) {
    return res.status(400).json({ error: 'Некорректный clientId (ожидается UUID)' })
  }
  if (!isTursoConfigured()) {
    return res.status(503).json({ error: 'Turso не настроен на сервере' })
  }

  const { resume, settings } = req.body || {}
  if (!resume || !settings) {
    return res.status(400).json({ error: 'Нужны resume и settings в теле запроса' })
  }

  try {
    await saveClientData(clientId, resume, settings)
    res.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/data:', err)
    res.status(500).json({ error: err.message || 'Ошибка сохранения' })
  }
})

app.post('/api/generate-resume', async (req, res) => {
  try {
    const ai = await generateResumeTexts(req.body)
    res.json(ai)
  } catch (err) {
    console.error('generate-resume:', err)
    res.status(500).json({ error: err.message || 'Ошибка генерации' })
  }
})

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

export default app
