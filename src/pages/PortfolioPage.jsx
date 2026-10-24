import { Link } from 'react-router-dom'
import { useResume } from '../context/ResumeProvider'
import { ResumeRenderer } from '../components/templates/ResumeRenderer'

export function PortfolioPage() {
  const { resume, settings } = useResume()
  const { contacts } = resume.profile

  const contactButtons = [
    { label: 'Email', href: contacts.email ? `mailto:${contacts.email}` : null },
    { label: 'Телефон', href: contacts.phone ? `tel:${contacts.phone}` : null },
    { label: 'Telegram', href: contacts.telegram?.startsWith('http') ? contacts.telegram : null },
    { label: 'LinkedIn', href: contacts.linkedin?.startsWith('http') ? contacts.linkedin : null },
    { label: 'Сайт', href: contacts.website?.startsWith('http') ? contacts.website : null },
  ].filter((b) => b.href)

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400">
          ← Редактор
        </Link>
        {contactButtons.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {contactButtons.map((b) => (
              <a
                key={b.label}
                href={b.href}
                className="min-h-11 inline-flex items-center px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium"
              >
                {b.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <ResumeRenderer
        data={resume}
        templateId={settings.templateId}
        paletteId={settings.paletteId}
        mode="portfolio"
      />
    </div>
  )
}
