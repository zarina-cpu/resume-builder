import { loadEnv } from '../server/loadEnv.js'
import { parseClientId } from '../server/clientId.js'
import { ensureDbReady } from '../server/ensureDbReady.js'
import { isTursoConfigured, loadClientData, saveClientData } from '../server/db.js'

export default async function handler(req, res) {
  await loadEnv()

  try {
    await ensureDbReady()
  } catch {
    /* optional Turso */
  }

  const clientId = parseClientId(req)
  if (!clientId) {
    return res.status(400).json({ error: 'Некорректный clientId (ожидается UUID)' })
  }

  if (!isTursoConfigured()) {
    return res.status(503).json({ error: 'Turso не настроен на сервере' })
  }

  if (req.method === 'GET') {
    try {
      const data = await loadClientData(clientId)
      if (!data) return res.status(404).json({ error: 'not_found' })
      return res.json(data)
    } catch (err) {
      console.error('GET /api/data:', err)
      return res.status(500).json({ error: err.message || 'Ошибка чтения данных' })
    }
  }

  if (req.method === 'PUT') {
    const { resume, settings } = req.body || {}
    if (!resume || !settings) {
      return res.status(400).json({ error: 'Нужны resume и settings в теле запроса' })
    }

    try {
      await saveClientData(clientId, resume, settings)
      return res.json({ ok: true })
    } catch (err) {
      console.error('PUT /api/data:', err)
      return res.status(500).json({ error: err.message || 'Ошибка сохранения' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
