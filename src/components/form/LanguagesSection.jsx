import { useResume } from '../../context/ResumeProvider'
import { createEmptyLanguage, LANGUAGE_LEVELS } from '../../models/resume'
import { FormField, inputClass } from './FormField'

export function LanguagesSection() {
  const { resume, setResume } = useResume()

  const updateList = (next) => setResume({ ...resume, languages: next })
  const updateItem = (id, patch) => {
    updateList(resume.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Языки</h2>
        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 min-h-11 px-3"
          onClick={() => updateList([...resume.languages, createEmptyLanguage()])}
        >
          + Добавить
        </button>
      </div>
      {resume.languages.map((lang) => (
        <div key={lang.id} className="grid sm:grid-cols-2 gap-3 items-end">
          <FormField label="Язык">
            <input
              className={inputClass}
              value={lang.name}
              onChange={(e) => updateItem(lang.id, { name: e.target.value })}
              placeholder="Английский"
            />
          </FormField>
          <FormField label="Уровень">
            <select
              className={inputClass}
              value={lang.level}
              onChange={(e) => updateItem(lang.id, { level: e.target.value })}
            >
              {LANGUAGE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </FormField>
        </div>
      ))}
    </section>
  )
}
