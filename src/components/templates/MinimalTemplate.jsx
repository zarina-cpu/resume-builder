import { ContactLine, formatPeriod, StrengthChips } from './shared'

export function MinimalTemplate({ data, mode }) {
  const { profile, experience, education, languages, ai } = data
  const isPortfolio = mode === 'portfolio'

  return (
    <div
      className={`resume-sheet resume-palette-${data._paletteId || 'ocean'} p-10 md:p-14 ${
        isPortfolio ? 'min-h-screen' : ''
      }`}
      style={{ width: isPortfolio ? '100%' : '794px', maxWidth: '100%' }}
    >
      <header className="mb-12 text-center">
        {profile.photo && (
          <img
            src={profile.photo}
            alt=""
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
        )}
        <h1 className="text-4xl font-light tracking-tight">{profile.fullName || 'Имя'}</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.2em]" style={{ color: 'var(--resume-accent)' }}>
          {profile.title || 'Должность'}
        </p>
        {isPortfolio && ai.tagline && (
          <p className="mt-4 text-base" style={{ color: 'var(--resume-muted)' }}>{ai.tagline}</p>
        )}
        <div className="mt-4">
          <ContactLine contacts={profile.contacts} />
        </div>
      </header>

      {ai.summary && (
        <section className="mb-10 max-w-2xl mx-auto text-center">
          <p className="text-sm leading-loose">{ai.summary}</p>
        </section>
      )}

      {ai.strengths?.length > 0 && (
        <section className="mb-10 flex justify-center">
          <StrengthChips strengths={ai.strengths} />
        </section>
      )}

      <div className="max-w-xl mx-auto space-y-10">
        <section>
          <h2 className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--resume-muted)' }}>
            Опыт
          </h2>
          {experience.map((job) => (
            <div key={job.id} className="mb-6 text-center">
              <p className="font-medium">{job.position}</p>
              <p className="text-sm" style={{ color: 'var(--resume-muted)' }}>
                {job.company} · {formatPeriod(job.start, job.end, job.current)}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--resume-muted)' }}>
            Образование
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4 text-center text-sm">
              <p className="font-medium">{edu.institution}</p>
              <p style={{ color: 'var(--resume-muted)' }}>{edu.degree}</p>
            </div>
          ))}
        </section>

        <section className="text-center text-sm">
          {languages.map((lang) => (
            <span key={lang.id} className="inline-block mx-2">
              {lang.name} ({lang.level})
            </span>
          ))}
        </section>
      </div>
    </div>
  )
}
