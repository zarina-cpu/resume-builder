import { GoogleGenerativeAI } from '@google/generative-ai'

const LOCAL_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-flash-latest',
].filter(Boolean)

/** Vercel Hobby ~10s limit — короткий бюджет и быстрые модели */
const VERCEL_FAST_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
]

function getGenerationPlan() {
  const preferred = process.env.GEMINI_MODEL?.trim()

  if (process.env.VERCEL) {
    const models = [...new Set([preferred, ...VERCEL_FAST_MODELS].filter(Boolean))].slice(
      0,
      2,
    )
    return { models, perModelMs: 4_500, totalBudgetMs: 9_000 }
  }

  return {
    models: [...new Set(LOCAL_MODEL_CANDIDATES)],
    perModelMs: 90_000,
    totalBudgetMs: null,
  }
}

function buildPrompt(data) {
  const payload = {
    profile: {
      fullName: data.profile?.fullName,
      title: data.profile?.title,
      birthDate: data.profile?.birthDate,
      contacts: data.profile?.contacts,
    },
    experience: (data.experience || []).map((e) => ({
      company: e.company,
      position: e.position,
      start: e.start,
      end: e.current ? 'настоящее время' : e.end,
      highlights: (e.highlights || []).filter((h) => h.trim()),
    })),
    education: data.education || [],
    languages: data.languages || [],
  }

  return `Ты карьерный консультант. На основе фактов из JSON кандидата составь тексты для резюме на русском языке.
Не выдумывай компании, даты, навыки или достижения, которых нет в данных. Если данных мало — пиши нейтрально и короче.

Верни ТОЛЬКО валидный JSON:
{
  "summary": "профессиональное описание 3-5 предложений",
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "tagline": "короткий слоган для портфолио, до 12 слов"
}

Данные кандидата:
${JSON.stringify(payload, null, 2)}`
}

function parseJsonResponse(text) {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Модель не вернула JSON')
  return JSON.parse(jsonMatch[0])
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Нет ответа от Gemini за ${ms / 1000} с`)),
        ms,
      )
    }),
  ])
}

async function generateWithModel(genAI, modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' },
  })
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const parsed = parseJsonResponse(text)
  if (!parsed.summary || !Array.isArray(parsed.strengths)) {
    throw new Error('Некорректный ответ модели')
  }
  return {
    summary: String(parsed.summary).trim(),
    strengths: parsed.strengths.map((s) => String(s).trim()).filter(Boolean),
    tagline: String(parsed.tagline || '').trim(),
  }
}

export async function generateResumeTexts(data) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    const hint = process.env.VERCEL
      ? 'На Vercel: Project → Settings → Environment Variables → GEMINI_API_KEY, затем Redeploy. Файл .env на хостинг не загружается.'
      : 'Локально: GEMINI_API_KEY в .env в корне проекта и перезапуск npm run dev.'
    throw new Error(`На сервере не задан GEMINI_API_KEY. ${hint}`)
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const prompt = buildPrompt(data)
  const { models, perModelMs, totalBudgetMs } = getGenerationPlan()
  const startedAt = Date.now()
  let lastError

  const errors = []

  for (const modelName of models) {
    if (totalBudgetMs && Date.now() - startedAt >= totalBudgetMs - 400) {
      errors.push('budget: превышен лимит времени Vercel')
      break
    }

    try {
      return await withTimeout(generateWithModel(genAI, modelName, prompt), perModelMs)
    } catch (err) {
      lastError = err
      errors.push(`${modelName}: ${err.message}`)
      console.warn(`Gemini model ${modelName} failed:`, err.message)
    }
  }

  if (errors.length) {
    console.warn('All Gemini models failed:', errors.join(' | '))
  }

  throw lastError || new Error('Не удалось вызвать Gemini')
}
