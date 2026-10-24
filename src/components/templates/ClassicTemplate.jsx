import { ContactLine, formatPeriod, SectionTitle, StrengthChips } from './shared'

export function ClassicTemplate({ data, mode }) {
  const { profile, experience, education, languages, ai } = data
  const isPortfolio = mode === 'portfolio'

  return (
    <div
      className={`resume-sheet resume-palette-${data._paletteId || 'ocean'} p-8 md:p-10 ${
        isPortfolio ? 'min-h-screen' : ''
      }`}
      style={{ width: isPortfolio ? '100%' : '794px', maxWidth: '100%' }}
    >
      <header className="border-b pb-6 mb-6" style={{ borderColor: 'var(--resume-border)' }}>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {profile.photo && (
            <img
              src={profile.photo}
              alt=""
              className="w-24 h-24 rounded-full object-cover shrink-0"
              style={{ border: '3px solid var(--resume-accent)' }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--resume-accent)' }}>
              {profile.fullName || 'Ваше имя'}
            </h1>
            <p className="text-lg mt-1 font-medium">{profile.title || 'Должность'}</p>
            {isPortfolio && ai.tagline && (
              <p className="mt-2 text-base italic" style={{ color: 'var(--resume-muted)' }}>
                {ai.tagline}
              </p>
            )}
            <div className="mt-3">
              <ContactLine contacts={profile.contacts} />
            </div>
            {profile.birthDate && (
              <p className="text-sm mt-1" style={{ color: 'var(--resume-muted)' }}>
                Дата рождения: {profile.birthDate}
              </p>
            )}
          </div>
        </div>
      </header>

      {ai.summary && (
        <section className="mb-8">
          <SectionTitle>О себе</SectionTitle>
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
        <SectionTitle>Опыт работы</SectionTitle>
        <div className="space-y-5">
          {experience.map((job) => (
            <div key={job.id}>
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-semibold">{job.position || 'Должность'}</h3>
                <span className="text-sm" style={{ color: 'var(--resume-muted)' }}>
                  {formatPeriod(job.start, job.end, job.current)}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--resume-accent-light)' }}>
                {job.company}
              </p>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                {job.highlights.filter((h) => h.trim()).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Образование</SectionTitle>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id}>
              <h3 className="font-semibold">{edu.institution}</h3>
              <p className="text-sm">
                {edu.degree}{' '}
                <span style={{ color: 'var(--resume-muted)' }}>
                  ({formatPeriod(edu.start, edu.end, false)})
                </span>
              </p>
              {edu.details && <p className="text-sm mt-1">{edu.details}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Языки</SectionTitle>
        <ul className="text-sm space-y-1">
          {languages.map((lang) => (
            <li key={lang.id}>
              <span className="font-medium">{lang.name}</span>
              {lang.level && (
                <span style={{ color: 'var(--resume-muted)' }}> — {lang.level}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
