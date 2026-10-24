import { ClassicTemplate } from './ClassicTemplate'
import { SidebarTemplate } from './SidebarTemplate'
import { MinimalTemplate } from './MinimalTemplate'

const MAP = {
  classic: ClassicTemplate,
  sidebar: SidebarTemplate,
  minimal: MinimalTemplate,
}

export function ResumeRenderer({ data, templateId, paletteId, mode = 'resume', exportRef }) {
  const Template = MAP[templateId] || ClassicTemplate
  const enriched = { ...data, _paletteId: paletteId }

  return (
    <div
      ref={exportRef}
      className="resume-export-root shadow-xl rounded-sm overflow-hidden mx-auto"
      data-pdf-export="true"
    >
      <Template data={enriched} mode={mode} />
    </div>
  )
}
