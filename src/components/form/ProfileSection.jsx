import { useResume } from '../../context/ResumeProvider'
import { compressImage } from '../../utils/image'
import { FormField, inputClass } from './FormField'

export function ProfileSection() {
  const { resume, setResume } = useResume()
  const { profile } = resume

  const updateProfile = (patch) => {
    setResume({ ...resume, profile: { ...profile, ...patch } })
  }

  const onPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressImage(file)
      updateProfile({ photo: dataUrl })
    } catch {
      alert('Не удалось загрузить фото')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Профиль</h2>
      <FormField label="Фото">
        <div className="flex items-center gap-4">
          {profile.photo && (
            <img src={profile.photo} alt="" className="w-16 h-16 rounded-full object-cover" />
          )}
          <input type="file" accept="image/*" onChange={onPhoto} className="text-sm" />
        </div>
      </FormField>
      <FormField label="Имя и фамилия">
        <input
          className={inputClass}
          value={profile.fullName}
          onChange={(e) => updateProfile({ fullName: e.target.value })}
          placeholder="Иван Иванов"
        />
      </FormField>
      <FormField label="Желаемая должность">
        <input
          className={inputClass}
          value={profile.title}
          onChange={(e) => updateProfile({ title: e.target.value })}
          placeholder="Frontend-разработчик"
        />
      </FormField>
      <FormField label="Дата рождения">
        <input
          type="date"
          className={inputClass}
          value={profile.birthDate}
          onChange={(e) => updateProfile({ birthDate: e.target.value })}
        />
      </FormField>
    </section>
  )
}
