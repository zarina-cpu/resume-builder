import { formatPeriod, SectionTitle, StrengthChips } from './shared'

export function SidebarTemplate({ data, mode }) {
  const { profile, experience, education, languages, ai } = data
  const isPortfolio = mode === 'portfolio'

  const contactItems = [
    { label: 'Email', value: profile.contacts.email },
    { label: 'Телефон', value: profile.contacts.phone },
    { label: 'Город', value: profile.contacts.city },
    { label: 'Telegram', value: profile.contacts.telegram },
    { label: 'LinkedIn', value: profile.contacts.linkedin },
    { label: 'Сайт', value: profile.contacts.website },
  ].filter((c) => c.value?.trim())

  return (
    <div
      className={`resume-sheet flex flex-col md:flex-row resume-palette-${data._paletteId || 'ocean'} ${
        isPortfolio ? 'min-h-screen' : ''
      }`}
      style={{ width: isPortfolio ? '100%' : '794px', maxWidth: '100%' }}
    >
      <aside
        className="md:w-56 shrink-0 p-6 text-white"
        style={{ backgroundColor: 'var(--resume-accent)' }}
      >
        {profile.photo && (
          <img
            src={profile.photo}
            alt=""
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-xl font-bold leading-tight">{profile.fullName || 'Имя'}</h1>
        <p className="text-sm mt-2 opacity-90">{profile.title || 'Должность'}</p>
        {profile.birthDate && (
          <p className="text-xs mt-3 opacity-75">Род.: {profile.birthDate}</p>
        )}
        <div className="mt-6 space-y-2 text-xs">
          {contactItems.map((c) => (
            <div key={c.label}>
              <span className="opacity-70 block">{c.label}</span>
              <span className="break-all">{c.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wider opacity-80 mb-2">Языки</p>
          <ul className="text-sm space-y-1">
            {languages.map((lang) => (
              <li key={lang.id}>
                {lang.name} <span className="opacity-75">({lang.level})</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {isPortfolio && ai.tagline && (
          <p className="text-lg italic mb-6" style={{ color: 'var(--resume-muted)' }}>
            {ai.tagline}
          </p>
        )}
        {ai.summary && (
          <section className="mb-8">
            <SectionTitle>Профиль</SectionTitle>
            <p className="text-sm leading-relaxed">{ai.summary}</p>
          </section>
        )}
        {ai.strengths?.length > 0 && (
          <section className="mb-8">
            <SectionTitle>Сильные стороны</SectionTitle>
            <StrengthChips strengths={ai.strengths} />
          </section>
        )}
        <section className="mb-8">
          <SectionTitle>Опыт</SectionTitle>
          <div className="space-y-5">
            {experience.map((job) => (
              <div key={job.id}>
                <h3 className="font-semibold">{job.position}</h3>
                <p className="text-sm" style={{ color: 'var(--resume-accent-light)' }}>
                  {job.company} · {formatPeriod(job.start, job.end, job.current)}
                </p>
                <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                  {job.highlights.filter((h) => h.trim()).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle>Образование</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-semibold text-sm">{edu.institution}</h3>
              <p className="text-sm">{edu.degree}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
