import { useResume } from '../context/ResumeProvider'
import { PALETTE_IDS } from '../models/resume'

const LABELS = {
  slate: 'Сланец',
  ocean: 'Океан',
  forest: 'Лес',
  burgundy: 'Бордо',
}

const SWATCH = {
  slate: '#334155',
  ocean: '#0369a1',
  forest: '#166534',
  burgundy: '#881337',
}

export function PalettePicker() {
  const { settings, patchSettings } = useResume()

  return (
    <div className="flex flex-wrap gap-2">
      {PALETTE_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => patchSettings({ paletteId: id })}
          className={`min-h-11 px-3 rounded-lg text-sm font-medium border flex items-center gap-2 ${
            settings.paletteId === id
              ? 'border-indigo-600 ring-2 ring-indigo-500/30'
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          <span
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: SWATCH[id] }}
          />
          {LABELS[id]}
        </button>
      ))}
    </div>
  )
}
