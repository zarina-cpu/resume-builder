import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateResumeTexts } from './geminiService.js'
import { initDb, isTursoConfigured, loadClientData, saveClientData } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT) || 3001
const distPath = path.join(__dirname, '../dist')

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function parseClientId(req) {
  const id = req.query.clientId || req.headers['x-client-id']
  if (!id || typeof id !== 'string' || !UUID_RE.test(id)) return null
  return id
}

app.use(cors())
app.use(express.json({ limit: '4mb' }))

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

async function start() {
  if (isTursoConfigured()) {
    try {
      await initDb()
      console.log('Turso: connected, schema ready')
    } catch (err) {
      console.error('Turso init failed:', err.message)
    }
  } else {
    console.warn('Warning: TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set')
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server: http://127.0.0.1:${PORT}`)
    if (!process.env.GEMINI_API_KEY?.trim()) {
      console.warn('Warning: GEMINI_API_KEY is not set in .env')
    }
  })
}

start()
