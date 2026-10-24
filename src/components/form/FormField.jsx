export function FormField({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full min-h-11 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
