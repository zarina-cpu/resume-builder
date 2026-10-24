export function formatPeriod(start, end, current) {
  if (!start && !end) return ''
  if (current) return `${start || '…'} — наст. время`
  return [start, end].filter(Boolean).join(' — ')
}

export function SectionTitle({ children }) {
  return (
    <h2
      className="text-sm font-semibold uppercase tracking-wider mb-3"
      style={{ color: 'var(--resume-accent)' }}
    >
      {children}
    </h2>
  )
}

export function StrengthChips({ strengths }) {
  if (!strengths?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {strengths.map((s) => (
        <span
          key={s}
          className="text-xs px-2.5 py-1 rounded-full border chip-soft"
          style={{
            borderColor: 'var(--resume-border)',
            color: 'var(--resume-accent)',
            backgroundColor: 'var(--resume-accent-soft, #f1f5f9)',
          }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

export function ContactLine({ contacts }) {
  const items = [
    contacts.email && `✉ ${contacts.email}`,
    contacts.phone && `☎ ${contacts.phone}`,
    contacts.city && contacts.city,
    contacts.telegram && contacts.telegram,
    contacts.linkedin && contacts.linkedin,
    contacts.website && contacts.website,
  ].filter(Boolean)

  return (
    <p className="text-sm" style={{ color: 'var(--resume-muted)' }}>
      {items.join(' · ')}
    </p>
  )
}
