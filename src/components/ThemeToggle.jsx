import { useResume } from '../context/ResumeProvider'

export function ThemeToggle() {
  const { settings, patchSettings } = useResume()
  const isDark = settings.theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => patchSettings({ theme: isDark ? 'light' : 'dark' })}
      className="min-h-11 min-w-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Переключить тему"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
