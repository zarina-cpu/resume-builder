import { useEffect, useState } from 'react'
import { getServerHealth } from '../../services/serverHealth'

export function ServerSetupBanner() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    getServerHealth().then(setHealth)
  }, [])

  if (!health?.ok) return null

  const missingGemini = !health.geminiConfigured
  const missingTurso = !health.tursoConfigured
  if (!missingGemini && !missingTurso) return null

  const onVercel =
    typeof window !== 'undefined' &&
    /\.vercel\.app$/i.test(window.location.hostname)

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
      role="status"
    >
      <p className="font-medium">На сервере не хватает переменных окружения</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-amber-900/90 dark:text-amber-100/90">
        {missingGemini && (
          <li>
            <strong>GEMINI_API_KEY</strong> — без него не работает «Сгенерировать».
          </li>
        )}
        {missingTurso && (
          <li>
            <strong>TURSO_DATABASE_URL</strong> и <strong>TURSO_AUTH_TOKEN</strong> — без них
            данные только в браузере (это нормально для теста).
          </li>
        )}
      </ul>
      {onVercel ? (
        <p className="mt-2">
          Vercel: Project → <strong>Settings</strong> → <strong>Environment Variables</strong> →
          имя <strong>GEMINI_API_KEY</strong>, значение без кавычек, галочка{' '}
          <strong>Production</strong>, затем <strong>Deployments → Redeploy</strong>. Проверка:{' '}
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium"
          >
            /api/health
          </a>{' '}
          (должно быть <code className="text-xs">geminiConfigured: true</code>).
        </p>
      ) : (
        <p className="mt-2">
          Локально скопируйте <code className="text-xs">.env.example</code> в{' '}
          <code className="text-xs">.env</code> и перезапустите <code className="text-xs">npm run dev</code>.
        </p>
      )}
    </div>
  )
}
