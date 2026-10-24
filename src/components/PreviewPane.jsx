import { useRef } from 'react'
import { ResumeRenderer } from './templates/ResumeRenderer'

export function PreviewPane({ resume, settings, exportRef }) {
  const scrollRef = useRef(null)

  return (
    <div className="lg:sticky lg:top-20">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 hidden lg:block">
        Превью резюме (масштаб на мобильных — прокрутите горизонтально)
      </p>
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        <div className="min-w-[min(100%,794px)] lg:origin-top lg:[zoom:0.85]">
          <ResumeRenderer
            exportRef={exportRef}
            data={resume}
            templateId={settings.templateId}
            paletteId={settings.paletteId}
            mode="resume"
          />
        </div>
      </div>
    </div>
  )
}
