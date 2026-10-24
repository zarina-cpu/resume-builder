export const LANGUAGE_LEVELS = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
  'Родной',
]

export const TEMPLATE_IDS = ['classic', 'sidebar', 'minimal']
export const PALETTE_IDS = ['slate', 'ocean', 'forest', 'burgundy']

export function createEmptyExperience() {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    start: '',
    end: '',
    current: false,
    highlights: [''],
  }
}

export function createEmptyEducation() {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    start: '',
    end: '',
    details: '',
  }
}

export function createEmptyLanguage() {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 'B2',
  }
}

export function createInitialResume() {
  return {
    profile: {
      photo: '',
      fullName: '',
      title: '',
      birthDate: '',
      contacts: {
        email: '',
        phone: '',
        telegram: '',
        linkedin: '',
        city: '',
        website: '',
      },
    },
    experience: [createEmptyExperience()],
    education: [createEmptyEducation()],
    languages: [createEmptyLanguage()],
    ai: {
      summary: '',
      strengths: [],
      tagline: '',
    },
  }
}

export function createInitialSettings() {
  return {
    templateId: 'classic',
    paletteId: 'ocean',
    theme: 'light',
  }
}

export function validateForPdf(data) {
  const errors = []
  if (!data.profile.fullName?.trim()) {
    errors.push('Укажите имя')
  }
  const contacts = data.profile.contacts
  const hasContact = [
    contacts.email,
    contacts.phone,
    contacts.telegram,
    contacts.linkedin,
    contacts.website,
  ].some((v) => v?.trim())
  if (!hasContact) {
    errors.push('Укажите хотя бы один контакт')
  }
  return errors
}
