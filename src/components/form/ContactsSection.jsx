import { useResume } from '../../context/ResumeProvider'
import { FormField, inputClass } from './FormField'

export function ContactsSection() {
  const { resume, setResume } = useResume()
  const contacts = resume.profile.contacts

  const update = (key, value) => {
    setResume({
      ...resume,
      profile: {
        ...resume.profile,
        contacts: { ...contacts, [key]: value },
      },
    })
  }

  const fields = [
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Телефон' },
    { key: 'city', label: 'Город' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'website', label: 'Сайт' },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Контакты</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <FormField key={f.key} label={f.label}>
            <input
              type={f.type || 'text'}
              className={inputClass}
              value={contacts[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
            />
          </FormField>
        ))}
      </div>
    </section>
  )
}
