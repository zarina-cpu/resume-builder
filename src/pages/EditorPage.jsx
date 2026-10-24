import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useResume } from '../context/ResumeProvider'
import { validateForPdf } from '../models/resume'
import { formatGeminiError, generateResumeTexts } from '../services/gemini'
import { exportPdf } from '../utils/exportPdf'
import { AiGenerateSection } from '../components/form/AiGenerateSection'
import { ContactsSection } from '../components/form/ContactsSection'
import { EducationSection } from '../components/form/EducationSection'
import { ExperienceSection } from '../components/form/ExperienceSection'
import { LanguagesSection } from '../components/form/LanguagesSection'
import { ProfileSection } from '../components/form/ProfileSection'
import { PalettePicker } from '../components/PalettePicker'
import { PreviewPane } from '../components/PreviewPane'
import { TemplatePicker } from '../components/TemplatePicker'

export function EditorPage() {
  const { resume, settings, setAi } = useResume()
  const exportRef = useRef(null)
  const statusRef = useRef(null)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('info')

  const setStatus = (message, type = 'info') => {
    setStatusMessage(message)
    setStatusType(type)
    requestAnimationFrame(() => {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const handleGenerate = async () => {
    setStatus('Отправляем запрос на сервер…', 'info')
    setGenerating(true)
    try {
      const ai = await generateResumeTexts(resume)
      setAi(ai)
      setStatus('Готово! Описание добавлено в превью и в блок ниже.', 'success')
    } catch (err) {
      setStatus(formatGeminiError(err), 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handlePdf = async () => {
    const errors = validateForPdf(resume)
    if (errors.length) {
      setStatus(errors.join('. '), 'error')
      return
    }
    if (!resume.ai.summary) {
      setStatus('Сначала сгенерируйте описание через Gemini (или заполните вручную позже)', 'error')
      return
    }
    setExporting(true)
    setStatus('Формируем PDF…', 'info')
    try {
      const name = (resume.profile.fullName || 'resume').replace(/\s+/g, '-')
      await exportPdf(exportRef.current, `${name}-resume.pdf`)
      setStatus('PDF сохранён', 'success')
    } catch (err) {
      setStatus(err.message || 'Не удалось создать PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 pb-32">
      <div className="lg:grid lg:grid-cols-2 lg:gap-10">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">Шаблон</h2>
            <TemplatePicker />
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Цветовая схема резюме
            </h2>
            <PalettePicker />
          </div>
          <ProfileSection />
          <ContactsSection />
          <ExperienceSection />
          <EducationSection />
          <LanguagesSection />
          <div ref={statusRef}>
            <AiGenerateSection
              onGenerate={handleGenerate}
              generating={generating}
              statusMessage={statusMessage}
              statusType={statusType}
            />
          </div>
          {resume.ai.summary && (
            <section className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
              <h3 className="font-semibold text-sm mb-2">Сгенерированное описание</h3>
              <p className="text-sm">{resume.ai.summary}</p>
              {resume.ai.strengths?.length > 0 && (
                <ul className="mt-2 text-sm list-disc list-inside">
                  {resume.ai.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <div className="mt-10 lg:mt-0">
          <PreviewPane resume={resume} settings={settings} exportRef={exportRef} />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap gap-3 justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-[100]"
      >
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="min-h-11 px-5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60"
        >
          {generating ? 'Генерация…' : 'Сгенерировать'}
        </button>
        <button
          type="button"
          onClick={handlePdf}
          disabled={exporting}
          className="min-h-11 px-5 rounded-lg border border-slate-300 dark:border-slate-600 font-medium"
        >
          {exporting ? 'PDF…' : 'Скачать PDF'}
        </button>
        <Link
          to="/portfolio"
          target="_blank"
          className="min-h-11 inline-flex items-center px-5 rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-medium"
        >
          Открыть портфолио
        </Link>
      </div>
    </div>
  )
}
