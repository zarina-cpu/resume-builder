export function formatGeminiError(err) {
  if (!err) return 'Неизвестная ошибка'
  const msg = err.message || String(err)
  if (msg.includes('GEMINI_API_KEY')) return msg
  if (msg.includes('API key')) {
    return 'Неверный API-ключ на сервере. Проверьте GEMINI_API_KEY в файле .env.'
  }
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
    return 'Доступ запрещён: проверьте ключ и Gemini API в Google Cloud.'
  }
  if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
    return 'Gemini временно перегружен. Подождите минуту и нажмите «Сгенерировать» снова.'
  }
  if (msg.includes('Нет ответа от Gemini')) {
    return `${msg} Проверьте интернет и GEMINI_MODEL=gemini-3.8-flash в .env, перезапустите npm run dev.`
  }
  if (msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
    return 'Модель Gemini недоступна для вашего ключа. В .env укажите GEMINI_MODEL=gemini-3.8-flash (или gemini-2.5-flash) и перезапустите сервер.'
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Не удалось связаться с сервером. Запустите: npm run dev (должны работать API и Vite).'
  }
  return msg.length > 200 ? `${msg.slice(0, 200)}…` : msg
}

export async function generateResumeTexts(data) {
  const res = await fetch('/api/generate-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  let body = {}
  try {
    body = await res.json()
  } catch {
    body = {}
  }

  if (!res.ok) {
    throw new Error(body.error || `Ошибка сервера (${res.status})`)
  }

  return body
}
