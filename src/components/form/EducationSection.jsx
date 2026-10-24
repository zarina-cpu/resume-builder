import { useResume } from '../../context/ResumeProvider'
import { createEmptyEducation } from '../../models/resume'
import { FormField, inputClass } from './FormField'

export function EducationSection() {
  const { resume, setResume } = useResume()

  const updateList = (next) => setResume({ ...resume, education: next })
  const updateItem = (id, patch) => {
    updateList(resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Образование</h2>
        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 min-h-11 px-3"
          onClick={() => updateList([...resume.education, createEmptyEducation()])}
        >
          + Добавить
        </button>
      </div>
      {resume.education.map((edu) => (
        <div
          key={edu.id}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
        >
          <FormField label="Учебное заведение">
            <input
              className={inputClass}
              value={edu.institution}
              onChange={(e) => updateItem(edu.id, { institution: e.target.value })}
            />
          </FormField>
          <FormField label="Специальность / степень">
            <input
              className={inputClass}
              value={edu.degree}
              onChange={(e) => updateItem(edu.id, { degree: e.target.value })}
            />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Начало">
              <input
                className={inputClass}
                value={edu.start}
                onChange={(e) => updateItem(edu.id, { start: e.target.value })}
              />
            </FormField>
            <FormField label="Окончание">
              <input
                className={inputClass}
                value={edu.end}
                onChange={(e) => updateItem(edu.id, { end: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Дополнительно">
            <textarea
              className={inputClass}
              rows={2}
              value={edu.details}
              onChange={(e) => updateItem(edu.id, { details: e.target.value })}
            />
          </FormField>
        </div>
      ))}
    </section>
  )
}
