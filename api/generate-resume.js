import { loadEnv } from '../server/loadEnv.js'
import { generateResumeTexts } from '../server/geminiService.js'

export const config = {
  maxDuration: 10,
}

export default async function handler(req, res) {
  await loadEnv()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body ?? {}
    const ai = await generateResumeTexts(body)
    res.json(ai)
  } catch (err) {
    console.error('generate-resume:', err)
    res.status(500).json({ error: err.message || 'Ошибка генерации' })
  }
}
