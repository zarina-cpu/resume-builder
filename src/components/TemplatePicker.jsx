import { useResume } from '../context/ResumeProvider'
import { TEMPLATE_IDS } from '../models/resume'

const LABELS = {
  classic: 'Классический',
  sidebar: 'С боковой панелью',
  minimal: 'Минимализм',
}

export function TemplatePicker() {
  const { settings, patchSettings } = useResume()

  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATE_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => patchSettings({ templateId: id })}
          className={`min-h-11 px-4 rounded-lg text-sm font-medium border transition-colors ${
            settings.templateId === id
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {LABELS[id]}
        </button>
      ))}
    </div>
  )
}
