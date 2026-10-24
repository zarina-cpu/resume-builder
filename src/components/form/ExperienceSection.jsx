import { useResume } from '../../context/ResumeProvider'
import { createEmptyExperience } from '../../models/resume'
import { FormField, inputClass } from './FormField'

export function ExperienceSection() {
  const { resume, setResume } = useResume()

  const updateList = (next) => setResume({ ...resume, experience: next })

  const updateItem = (id, patch) => {
    updateList(resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const addHighlight = (id) => {
    const item = resume.experience.find((e) => e.id === id)
    updateItem(id, { highlights: [...item.highlights, ''] })
  }

  const updateHighlight = (id, index, value) => {
    const item = resume.experience.find((e) => e.id === id)
    const highlights = [...item.highlights]
    highlights[index] = value
    updateItem(id, { highlights })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Опыт работы</h2>
        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 min-h-11 px-3"
          onClick={() => updateList([...resume.experience, createEmptyExperience()])}
        >
          + Добавить
        </button>
      </div>
      {resume.experience.map((job) => (
        <div
          key={job.id}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Компания">
              <input
                className={inputClass}
                value={job.company}
                onChange={(e) => updateItem(job.id, { company: e.target.value })}
              />
            </FormField>
            <FormField label="Должность">
              <input
                className={inputClass}
                value={job.position}
                onChange={(e) => updateItem(job.id, { position: e.target.value })}
              />
            </FormField>
            <FormField label="Начало">
              <input
                className={inputClass}
                placeholder="2020-01"
                value={job.start}
                onChange={(e) => updateItem(job.id, { start: e.target.value })}
              />
            </FormField>
            <FormField label="Конец">
              <input
                className={inputClass}
                placeholder="2024-06"
                disabled={job.current}
                value={job.end}
                onChange={(e) => updateItem(job.id, { end: e.target.value })}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={job.current}
              onChange={(e) => updateItem(job.id, { current: e.target.checked })}
            />
            По настоящее время
          </label>
          <div>
            <p className="text-sm font-medium mb-2">Достижения / обязанности</p>
            {job.highlights.map((h, i) => (
              <input
                key={i}
                className={`${inputClass} mb-2`}
                value={h}
                onChange={(e) => updateHighlight(job.id, i, e.target.value)}
                placeholder="Краткий пункт"
              />
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 dark:text-indigo-400"
              onClick={() => addHighlight(job.id)}
            >
              + Пункт
            </button>
          </div>
          {resume.experience.length > 1 && (
            <button
              type="button"
              className="text-sm text-red-600"
              onClick={() => updateList(resume.experience.filter((e) => e.id !== job.id))}
            >
              Удалить место работы
            </button>
          )}
        </div>
      ))}
    </section>
  )
}
