import { Link } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle'

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-slate-900 dark:text-white">
          Конструктор резюме
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/portfolio"
            className="min-h-11 inline-flex items-center px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            Портфолио
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
